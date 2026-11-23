-- Expose only published interactive course content to the rightful paid account.
create or replace function public.learning_student_orders(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;
begin
 v_student:=app.student_for(p_token);
 return coalesce((select jsonb_agg(jsonb_build_object(
 'id',r.id,'invoiceRef',r.invoice_ref,'subject',r.subject,'kind',r.kind,
 'moduleCount',r.unit_count,'status',r.status,'paymentStatus',r.payment_status,
 'planStatus',r.learning_plan_status,'planTitle',r.learning_plan_title,
 'productionStartedAt',r.production_started_at,'deliveryDueAt',r.delivery_due_at,
 'deliveredAt',r.delivered_at,
 'packPublished',coalesce((select published from app.learning_course_packs where order_id=r.id),false),
 'releasedCount',(select count(*) from app.learning_deliverables d where d.order_id=r.id and d.released))
 order by r.created_at desc)
 from app.learning_requests r where r.student_id=v_student and
 r.payment_status='verified' and r.status<>'cancelled'),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_student_orders(text) from public;
grant execute on function public.learning_student_orders(text) to anon,authenticated;

create or replace function public.learning_request_status_set(p_token text,p_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;v_check jsonb;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_id for update;
 if not found then raise exception 'request_not_found' using errcode='22023';end if;
 if p_status not in ('received','awaiting_payment','in_production','review','delivered','cancelled')
 then raise exception 'invalid_status' using errcode='22023';end if;
 if r.status='cancelled' and p_status<>'cancelled' then raise exception 'order_closed' using errcode='22023';end if;
 if p_status in ('in_production','review','delivered') and r.payment_status<>'verified'
 then raise exception 'payment_not_verified' using errcode='22023';end if;
 if p_status in ('review','delivered') and r.production_started_at is null
 then raise exception 'production_not_started' using errcode='22023';end if;
 if p_status='delivered' then
  v_check:=public.learning_delivery_requirements(p_id);
  if (v_check->>'ready')::boolean is distinct from true
  then raise exception 'delivery_incomplete' using errcode='22023';end if;
  if r.delivery_method<>'files' and not exists(
   select 1 from app.learning_course_packs
   where order_id=p_id and published
  ) then raise exception 'interactive_course_not_published' using errcode='22023';end if;
 end if;
 update app.learning_requests set status=p_status,
 delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,
 updated_at=now() where id=p_id;
 return jsonb_build_object('id',p_id,'status',p_status);
end $fn$;
revoke all on function public.learning_request_status_set(text,uuid,text) from public;
grant execute on function public.learning_request_status_set(text,uuid,text) to anon,authenticated;

create or replace function public.learning_student_delivery_list(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order and student_id=v_student
 and payment_status='verified' and status<>'cancelled') then
 raise exception 'not_authorized' using errcode='28000';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',file_name,
 'kind',resource_kind,'moduleNumber',module_number,'size',file_size,
 'releasedAt',released_at) order by module_number nulls last,uploaded_at)
 from app.learning_deliverables where order_id=p_order and released),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_student_delivery_list(text,uuid) from public;
grant execute on function public.learning_student_delivery_list(text,uuid) to anon,authenticated;

create or replace function public.learning_student_delivery_path(p_token text,p_order uuid,p_file uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;v_path text;
begin
 v_student:=app.student_for(p_token);
 select d.object_path into v_path from app.learning_deliverables d
 join app.learning_requests r on r.id=d.order_id
 where d.id=p_file and d.order_id=p_order and d.released
 and r.student_id=v_student and r.payment_status='verified' and r.status<>'cancelled';
 if v_path is null then raise exception 'not_authorized' using errcode='28000';end if;
 return jsonb_build_object('path',v_path);
end $fn$;
revoke all on function public.learning_student_delivery_path(text,uuid,uuid) from public;
grant execute on function public.learning_student_delivery_path(text,uuid,uuid) to anon,authenticated;
