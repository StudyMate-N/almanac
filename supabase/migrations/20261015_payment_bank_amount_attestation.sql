alter table app.learning_requests
 add column if not exists amount_verified_cad_cents bigint,
 add column if not exists payment_verified_by text;
create or replace function public.learning_payment_verify(
 p_token text,p_id uuid,p_cad_cents bigint
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text; r app.learning_requests;v_code text;v_student_id uuid;v_staff text;
begin
 select a.role,a.label into v_role,v_staff from app.admin_sessions s join app.admins a
 on a.id=s.admin_id where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then
 raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_id for update;
 if not found or r.status='cancelled' then raise exception 'request_not_found' using errcode='22023';end if;
 if r.payment_status='verified' then return jsonb_build_object('alreadyVerified',true,'paymentStatus','verified');end if;
 if r.payment_status<>'reported' then raise exception 'payment_not_reported' using errcode='22023';end if;
 if r.payable_cad_cents is null or p_cad_cents is null or p_cad_cents<>r.payable_cad_cents
 then raise exception 'paid_amount_mismatch' using errcode='22023';end if;
 -- Staff attests funds were confirmed independently in the bank; a receipt alone is insufficient.
 v_code:='ALM-'||upper(encode(extensions.gen_random_bytes(12),'hex'));
 insert into app.students(code_hash,label,name,email)
 values(app.hash(app.norm_code(v_code)),r.invoice_ref,r.name,r.email)
 returning id into v_student_id;
 update app.learning_requests set payment_status='verified',paid_at=now(),
 amount_verified_cad_cents=p_cad_cents,payment_verified_by=v_staff,
 access_issued_at=now(),student_id=v_student_id,status='received',updated_at=now()
 where id=p_id;
 return jsonb_build_object('paymentStatus','verified','accessCode',v_code,
  'invoiceRef',r.invoice_ref,'email',r.email,'name',r.name);
end $fn$;
revoke all on function public.learning_payment_verify(text,uuid) from public,anon,authenticated;
revoke all on function public.learning_payment_verify(text,uuid,bigint) from public;
grant execute on function public.learning_payment_verify(text,uuid,bigint) to anon,authenticated;
