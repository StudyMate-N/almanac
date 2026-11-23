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
 if not found or r.status='cancelled' or r.payment_status not in ('unpaid','awaiting','awaiting_payment')
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