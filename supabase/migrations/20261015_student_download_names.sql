create or replace function public.learning_student_delivery_path(p_token text,p_order uuid,p_file uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;v_path text;v_name text;
begin
 v_student:=app.student_for(p_token);
 select d.object_path,d.file_name into v_path,v_name from app.learning_deliverables d
 join app.learning_requests r on r.id=d.order_id
 where d.id=p_file and d.order_id=p_order and d.released
 and r.student_id=v_student and r.payment_status='verified' and r.status<>'cancelled';
 if v_path is null then raise exception 'not_authorized' using errcode='28000';end if;
 return jsonb_build_object('path',v_path,'name',v_name);
end $fn$;
revoke all on function public.learning_student_delivery_path(text,uuid,uuid) from public;
grant execute on function public.learning_student_delivery_path(text,uuid,uuid) to anon,authenticated;