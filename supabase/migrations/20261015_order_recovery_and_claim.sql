-- Owner-controlled recovery of private invoice links and student access.
alter table app.learning_requests
 add column if not exists invoice_reissue_count int not null default 0,
 add column if not exists invoice_reissued_at timestamptz,
 add column if not exists access_reset_count int not null default 0,
 add column if not exists access_reset_at timestamptz;

create or replace function public.learning_staff_reissue_invoice(p_staff_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;v_new text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'owner_required' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order for update;
 if not found or r.status='cancelled' then raise exception 'order_not_found' using errcode='22023';end if;
 if r.invoice_reissue_count>=5 then raise exception 'recovery_limit' using errcode='22023';end if;
 v_new:=encode(extensions.gen_random_bytes(24),'hex');
 update app.learning_requests set invoice_token_hash=app.hash(v_new),
 invoice_reissued_at=now(),invoice_reissue_count=invoice_reissue_count+1,updated_at=now()
 where id=p_order;
 return jsonb_build_object('id',p_order,'invoiceToken',v_new,'invoiceRef',r.invoice_ref,
 'name',r.name,'email',r.email,'invalidatesOldLink',true);
end $fn$;
revoke all on function public.learning_staff_reissue_invoice(text,uuid) from public;
grant execute on function public.learning_staff_reissue_invoice(text,uuid) to anon,authenticated;

create or replace function public.learning_staff_reset_access(p_staff_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;v_new text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'owner_required' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order for update;
 if not found or r.payment_status<>'verified' or r.student_id is null then
 raise exception 'not_verified' using errcode='22023';end if;
 if r.access_reset_count>=5 then raise exception 'recovery_limit' using errcode='22023';end if;
 v_new:='ALM-'||upper(encode(extensions.gen_random_bytes(12),'hex'));
 update app.students set code_hash=app.hash(app.norm_code(v_new))
 where id=r.student_id and not disabled;
 if not found then raise exception 'student_unavailable' using errcode='22023';end if;
 -- Invalidate sessions on credential reset; no stale session should survive.
 delete from app.sessions where student_id=r.student_id;
 update app.learning_requests set access_reset_count=access_reset_count+1,
 access_reset_at=now(),updated_at=now() where id=p_order;
 return jsonb_build_object('accessCode',v_new,'email',r.email,
 'invoiceRef',r.invoice_ref,'revokedOldSessions',true);
end $fn$;
revoke all on function public.learning_staff_reset_access(text,uuid) from public;
grant execute on function public.learning_staff_reset_access(text,uuid) to anon,authenticated;

-- Existing signed-in learners can attach a separately paid order to their
-- existing workspace using BOTH their session and the private invoice token.
-- Email must match, so a shared receipt link cannot attach another person's order.
create or replace function public.learning_student_claim_order(
 p_student_token text,p_order uuid,p_invoice_token text
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;r app.learning_requests;v_email text;v_other uuid;
begin
 v_student:=app.student_for(p_student_token);
 select lower(email) into v_email from app.students where id=v_student and not disabled;
 if v_email is null then raise exception 'student_email_required' using errcode='22023';end if;
 select * into r from app.learning_requests where id=p_order and
 invoice_token_hash=app.hash(p_invoice_token) and payment_status='verified' for update;
 if not found then raise exception 'not_authorized' using errcode='28000';end if;
 if lower(r.email)<>v_email then raise exception 'email_mismatch' using errcode='28000';end if;
 v_other:=r.student_id;
 if v_other=v_student then return jsonb_build_object('linked',true,'alreadyLinked',true);end if;
 update app.learning_requests set student_id=v_student,updated_at=now() where id=p_order;
 if v_other is not null and v_other<>v_student
 and not exists(select 1 from app.learning_requests where student_id=v_other)
 then
   update app.students set disabled=true where id=v_other;
   delete from app.sessions where student_id=v_other;
 end if;
 return jsonb_build_object('linked',true,'alreadyLinked',false);
end $fn$;
revoke all on function public.learning_student_claim_order(text,uuid,text) from public;
grant execute on function public.learning_student_claim_order(text,uuid,text) to anon,authenticated;
