alter table app.learning_requests add column if not exists quote_valid_until timestamptz;
update app.learning_requests set quote_valid_until=created_at+interval '7 days'
 where quote_valid_until is null and payable_cad_cents is not null and payment_status not in ('reported','verified');
CREATE OR REPLACE FUNCTION public.learning_request_create_cad(p_data jsonb, p_rate numeric, p_rate_date date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_result jsonb;v_usd int;v_cents bigint;v_id uuid;v_rate numeric;
begin
 if (select auth.role()) is distinct from 'service_role' then
   raise exception 'not_authorized' using errcode='28000';
 end if;
 if p_data->>'termsAccepted' is distinct from 'true' then
    raise exception 'terms_required' using errcode='22023';
 end if;
 if p_rate not between 0.5 and 3.0 or p_rate_date is null
   or p_rate_date>current_date or p_rate_date<current_date-10 then
   raise exception 'rate_unavailable' using errcode='22023';
 end if;
 v_rate:=round(p_rate,6);
 v_result:=public.learning_request_create(p_data);
 v_usd:=(v_result->>'quoteUsd')::int;
 v_cents:=round(v_usd*v_rate*100)::bigint;
 v_id:=(v_result->>'id')::uuid;
 update app.learning_requests set
   fx_cad_per_usd=v_rate,fx_rate_date=p_rate_date,
   payable_cad_cents=v_cents,fx_source='Bank of Canada',terms_accepted_at=now(),quote_valid_until=now()+interval '7 days'
 where id=v_id;
 return v_result||jsonb_build_object(
   'payableCadCents',v_cents,'rateCadPerUsd',v_rate,'rateDate',p_rate_date,'quoteValidUntil',(select quote_valid_until from app.learning_requests where id=v_id));
end $function$

CREATE OR REPLACE FUNCTION public.learning_invoice_get(p_id uuid, p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare r app.learning_requests;
begin
 select * into r from app.learning_requests
 where id=p_id and invoice_token_hash=app.hash(p_token);
 if not found then raise exception 'invoice_not_found' using errcode='28000';end if;
 return jsonb_build_object('id',r.id,'invoiceRef',r.invoice_ref,'name',r.name,'email',r.email,
  'subject',r.subject,'goal',r.goal,'kind',r.kind,'deliveryMethod',r.delivery_method,'speed',r.speed,
  'addons',r.addons,'enhancements',r.enhancements,'learningPreference',r.learning_preference,
  'units',r.unit_count,'baseUsd',r.base_usd,'addonUsd',r.addon_usd,'quoteUsd',r.quote_usd,
  'turnaroundDays',r.turnaround_days,'paymentStatus',r.payment_status,'status',r.status,
  'createdAt',r.created_at,'payableCadCents',r.payable_cad_cents,
  'rateCadPerUsd',r.fx_cad_per_usd,'rateDate',r.fx_rate_date,'fxSource',r.fx_source,
  'quoteValidUntil',r.quote_valid_until,
  'learningPlanStatus',r.learning_plan_status,'learningPlanTitle',r.learning_plan_title,
  'learningPlanSummary',r.learning_plan_summary,'learningPlanTopics',r.learning_plan_topics,
  'learningPlanObjectives',r.learning_plan_objectives,
  'learningPlanDates',r.learning_plan_dates,'learningPlanFeedback',r.learning_plan_feedback
 );
end $function$

CREATE OR REPLACE FUNCTION public.learning_payment_report(p_id uuid, p_token text, p_reference text, p_paid_on date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare r app.learning_requests;v_ref text:=trim(coalesce(p_reference,''));
begin
 select * into r from app.learning_requests
  where id=p_id and invoice_token_hash=app.hash(p_token) for update;
 if not found then raise exception 'invoice_not_found' using errcode='28000'; end if;
 if r.payment_status='verified' then return jsonb_build_object('paymentStatus','verified');end if;
 if r.payable_cad_cents is null then raise exception 'cad_not_set' using errcode='22023';end if;
 if r.quote_valid_until is not null and p_paid_on>r.quote_valid_until::date
 then raise exception 'invoice_expired' using errcode='22023';end if;
 if length(v_ref)>120 or (length(v_ref)>0 and length(v_ref)<5)
  or (length(v_ref)=0 and not exists(select 1 from app.learning_payment_proofs where order_id=p_id))
  or p_paid_on is null or p_paid_on>current_date+1 or p_paid_on<current_date-90 then
  raise exception 'invalid_payment_details' using errcode='22023';
 end if;
 update app.learning_requests set payment_reference=nullif(v_ref,''),
  payment_date=p_paid_on,payment_reported_at=now(),
  payment_status='reported',updated_at=now() where id=p_id;
 return jsonb_build_object('paymentStatus','reported');
end $function$

create or replace function public.learning_staff_invoice_requote(
 p_staff_token text,p_order uuid,p_rate numeric,p_rate_date date
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;v_token text;v_cents bigint;
begin
 if (select auth.role()) is distinct from 'service_role' then
  raise exception 'not_authorized' using errcode='28000';end if;
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'owner_required' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order for update;
 if not found or r.status='cancelled' or r.payment_status not in ('awaiting','awaiting_payment')
 then raise exception 'not_eligible' using errcode='22023';end if;
 if r.quote_valid_until is null or r.quote_valid_until>now() then
  raise exception 'quote_not_expired' using errcode='22023';end if;
 if r.invoice_reissue_count>=5 then raise exception 'recovery_limit' using errcode='22023';end if;
 if p_rate not between 0.5 and 3.0 or p_rate_date is null
  or p_rate_date>current_date or p_rate_date<current_date-10 then
  raise exception 'rate_unavailable' using errcode='22023';end if;
 v_cents:=round(r.quote_usd*round(p_rate,6)*100)::bigint;
 v_token:=encode(extensions.gen_random_bytes(24),'hex');
 update app.learning_requests set fx_cad_per_usd=round(p_rate,6),fx_rate_date=p_rate_date,
  payable_cad_cents=v_cents,quote_valid_until=now()+interval '7 days',
  invoice_token_hash=app.hash(v_token),invoice_reissued_at=now(),
  invoice_reissue_count=invoice_reissue_count+1,updated_at=now() where id=p_order;
 return jsonb_build_object('invoiceRef',r.invoice_ref,'invoiceToken',v_token,
  'payableCadCents',v_cents,'quoteValidUntil',now()+interval '7 days',
  'id',p_order,'email',r.email,'name',r.name);
end $fn$;
revoke all on function public.learning_staff_invoice_requote(text,uuid,numeric,date) from public,anon,authenticated;
grant execute on function public.learning_staff_invoice_requote(text,uuid,numeric,date) to service_role;
revoke all on function public.learning_request_create_cad(jsonb,numeric,date) from public,anon,authenticated;
grant execute on function public.learning_request_create_cad(jsonb,numeric,date) to service_role;
revoke all on function public.learning_invoice_get(uuid,text) from public;
grant execute on function public.learning_invoice_get(uuid,text) to anon,authenticated,service_role;
revoke all on function public.learning_payment_report(uuid,text,text,date) from public;
grant execute on function public.learning_payment_report(uuid,text,text,date) to anon,authenticated;
