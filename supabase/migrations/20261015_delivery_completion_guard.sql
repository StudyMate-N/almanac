-- A package cannot be marked delivered until its included and purchased media are released.
create or replace function public.learning_delivery_requirements(p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;
 v_required jsonb;v_missing jsonb:='{}'::jsonb;v_kind text;v_need int;v_actual int;
begin
 select * into r from app.learning_requests where id=p_order;
 if not found then raise exception 'order_not_found' using errcode='22023';end if;
 if r.kind='resource' then
  v_required:=jsonb_build_object('lesson',1,'video',1+coalesce((r.enhancements->>'deep_video')::int,0),
   'slides',1,'practice',1,'flashcards',1);
 elsif r.kind='exam' then
  v_required:=jsonb_build_object('lesson',4,'video',2+coalesce((r.enhancements->>'deep_video')::int,0),
   'slides',1,'practice',1,'flashcards',1,
   'simulation',1+coalesce((r.enhancements->>'exam_sim')::int,0),'plan',1);
 else
  v_required:=jsonb_build_object('lesson',r.unit_count,
   'video',r.unit_count+coalesce((r.enhancements->>'deep_video')::int,0),
   'slides',r.unit_count,'practice',1,'flashcards',1,
   'simulation',1+coalesce((r.enhancements->>'exam_sim')::int,0),'plan',1);
 end if;
 for v_kind,v_need in select key,value::text::int from jsonb_each(v_required) loop
  select count(*) into v_actual from app.learning_deliverables
   where order_id=p_order and released and resource_kind=v_kind;
  if v_actual<v_need then
   v_missing:=v_missing||jsonb_build_object(v_kind,jsonb_build_object('required',v_need,'released',v_actual));
  end if;
 end loop;
 return jsonb_build_object('ready',v_missing='{}'::jsonb,'required',v_required,'missing',v_missing);
end $fn$;
revoke all on function public.learning_delivery_requirements(uuid) from public,anon,authenticated;

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
  then raise exception 'delivery_incomplete' using errcode='22023',
   detail='Not all purchased resource types have been released.';end if;
 end if;
 update app.learning_requests set status=p_status,
 delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,
 updated_at=now() where id=p_id;
 return jsonb_build_object('id',p_id,'status',p_status);
end $fn$;
revoke all on function public.learning_request_status_set(text,uuid,text) from public;
grant execute on function public.learning_request_status_set(text,uuid,text) to anon,authenticated;
