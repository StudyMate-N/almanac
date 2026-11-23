CREATE OR REPLACE FUNCTION public.learning_requests_list(p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 return coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc)
 from (select id,invoice_ref,name,email,course_id,subject,goal,kind,delivery_method,
 speed,addons,enhancements,learning_preference,unit_count,base_usd,addon_usd,
 quote_usd,turnaround_days,status,payment_status,payment_reference,payment_date,
 payment_reported_at,paid_at,access_issued_at,created_at,payable_cad_cents,
 fx_cad_per_usd,fx_rate_date,learning_plan_title,learning_plan_summary,
 learning_plan_topics,learning_plan_objectives,learning_plan_dates,
 learning_plan_status,learning_plan_feedback,quote_valid_until,production_started_at,
 delivery_due_at,delivered_at,student_id
 from app.learning_requests order by created_at desc limit 200) r),'[]'::jsonb);
end $function$
;
revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon,authenticated;