-- Validate authorized staff, verified order, and issued student code before email.
CREATE OR REPLACE FUNCTION public.learning_staff_access_email_validate(p_staff_token text, p_order uuid, p_access_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_role text; r app.learning_requests; st app.students;
begin
 select a.role into v_role
 from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null
 then raise exception 'not_authorized' using errcode='28000'; end if;
 select * into r from app.learning_requests
 where id=p_order and payment_status='verified' and status<>'cancelled';
 if not found or r.student_id is null
 then raise exception 'not_authorized' using errcode='28000'; end if;
 select * into st from app.students
 where id=r.student_id and not disabled
 and code_hash=app.hash(app.norm_code(p_access_code));
 if not found
 then raise exception 'not_authorized' using errcode='28000'; end if;
 return jsonb_build_object('email',r.email,'name',r.name,
                          'invoiceRef',r.invoice_ref);
end $function$

revoke all on function public.learning_staff_access_email_validate(text,uuid,text) from public;
grant execute on function public.learning_staff_access_email_validate(text,uuid,text) to anon,authenticated;
