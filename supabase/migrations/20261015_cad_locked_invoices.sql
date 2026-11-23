-- Lock CAD settlement to the invoice rather than asking customers to convert USD.
alter table app.learning_requests
 add column if not exists fx_cad_per_usd numeric(12,6),
 add column if not exists fx_rate_date date,
 add column if not exists payable_cad_cents bigint,
 add column if not exists fx_source text;
alter table app.learning_requests drop constraint if exists learning_requests_fx_fields_check;
alter table app.learning_requests add constraint learning_requests_fx_fields_check check (
 (fx_cad_per_usd is null and fx_rate_date is null and payable_cad_cents is null and fx_source is null)
 or (fx_cad_per_usd between 0.5 and 3.0 and fx_rate_date is not null
     and payable_cad_cents>0 and fx_source='Bank of Canada')
);
-- New orders may only be created through the server-side conversion function.
revoke execute on function public.learning_request_create(jsonb) from anon,authenticated;
grant execute on function public.learning_request_create(jsonb) to service_role;

create or replace function public.learning_request_create_cad(
 p_data jsonb,p_rate numeric,p_rate_date date
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_result jsonb;v_usd int;v_cents bigint;v_id uuid;v_rate numeric;
begin
 if current_setting('request.jwt.claim.role',true) is distinct from 'service_role' then
   raise exception 'not_authorized' using errcode='28000';
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
   payable_cad_cents=v_cents,fx_source='Bank of Canada'
 where id=v_id;
 return v_result||jsonb_build_object(
   'payableCadCents',v_cents,'rateCadPerUsd',v_rate,'rateDate',p_rate_date);
end $fn$;
revoke all on function public.learning_request_create_cad(jsonb,numeric,date) from public,anon,authenticated;
grant execute on function public.learning_request_create_cad(jsonb,numeric,date) to service_role;

-- Extend invoice response; retain server-side token access control.
create or replace function public.learning_invoice_get(p_id uuid,p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;
begin
 select * into r from app.learning_requests
 where id=p_id and invoice_token_hash=app.hash(p_token);
 if not found then raise exception 'invoice_not_found' using errcode='28000'; end if;
 return jsonb_build_object(
  'id',r.id,'invoiceRef',r.invoice_ref,'name',r.name,'email',r.email,
  'subject',r.subject,'goal',r.goal,'kind',r.kind,'deliveryMethod',r.delivery_method,
  'speed',r.speed,'addons',r.addons,'enhancements',r.enhancements,
  'learningPreference',r.learning_preference,'units',r.unit_count,
  'baseUsd',r.base_usd,'addonUsd',r.addon_usd,'quoteUsd',r.quote_usd,
  'turnaroundDays',r.turnaround_days,'paymentStatus',r.payment_status,
  'status',r.status,'createdAt',r.created_at,
  'payableCadCents',r.payable_cad_cents,'rateCadPerUsd',r.fx_cad_per_usd,
  'rateDate',r.fx_rate_date,'fxSource',r.fx_source
 );
end $fn$;
revoke all on function public.learning_invoice_get(uuid,text) from public;
grant execute on function public.learning_invoice_get(uuid,text) to anon,authenticated,service_role;
