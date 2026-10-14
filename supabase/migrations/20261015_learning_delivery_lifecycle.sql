-- Order-specific deliverable library and measurable fulfillment lifecycle.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('almanac-deliverables','almanac-deliverables',false,20971520,
 array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
 'application/zip','video/mp4','audio/mpeg','image/png','image/jpeg','text/plain'])
on conflict (id) do nothing;

create table if not exists app.learning_deliverables(
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references app.learning_requests(id) on delete cascade,
 file_name text not null,
 object_path text not null unique,
 media_type text not null,
 file_size bigint not null check(file_size between 1 and 20971520),
 resource_kind text not null check(resource_kind in ('lesson','video','slides','practice','flashcards','simulation','plan','other')),
 module_number int check(module_number between 1 and 12),
 released boolean not null default false,
 uploaded_at timestamptz not null default now(),
 released_at timestamptz
);
create index if not exists learning_deliverables_order_idx on app.learning_deliverables(order_id,released);
alter table app.learning_deliverables enable row level security;
revoke all on app.learning_deliverables from public,anon,authenticated;

alter table app.learning_requests
 add column if not exists production_started_at timestamptz,
 add column if not exists delivery_due_at timestamptz,
 add column if not exists delivered_at timestamptz;

create or replace function public.learning_staff_delivery_list(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'name',d.file_name,
 'objectPath',d.object_path,'kind',d.resource_kind,'moduleNumber',d.module_number,
 'size',d.file_size,'released',d.released,'uploadedAt',d.uploaded_at)
 order by d.uploaded_at desc) from app.learning_deliverables d where d.order_id=p_order),'[]'::jsonb);
end $fn$;

create or replace function public.learning_staff_delivery_register(
 p_token text,p_order uuid,p_name text,p_path text,p_mime text,p_size bigint,
 p_kind text,p_module int
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_id uuid;v_status text;v_payment text;
begin
 perform pg_advisory_xact_lock(hashtext(p_order::text));
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select status,payment_status into v_status,v_payment from app.learning_requests where id=p_order;
 if v_status is null or v_status='cancelled' or v_payment<>'verified' then
 raise exception 'order_not_active' using errcode='22023';end if;
 if length(p_name) not between 1 and 120 or p_size not between 1 and 20971520
 or p_kind not in ('lesson','video','slides','practice','flashcards','simulation','plan','other')
 or (p_module is not null and p_module not between 1 and 12)
 or length(p_path)>260 or p_path !~ ('^'||p_order::text||'/[a-f0-9-]{36}-[a-zA-Z0-9._-]+$')
 or p_mime not in ('application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'application/vnd.openxmlformats-officedocument.presentationml.presentation','application/zip',
 'video/mp4','audio/mpeg','image/png','image/jpeg','text/plain')
 or (select count(*) from app.learning_deliverables where order_id=p_order)>=100 then
 raise exception 'invalid_resource' using errcode='22023';end if;
 insert into app.learning_deliverables(order_id,file_name,object_path,media_type,file_size,resource_kind,module_number)
 values(p_order,p_name,p_path,p_mime,p_size,p_kind,p_module) returning id into v_id;
 return jsonb_build_object('id',v_id,'name',p_name,'released',false);
end $fn$;

create or replace function public.learning_staff_delivery_release(
 p_token text,p_order uuid,p_file uuid,p_release boolean
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_payment text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select payment_status into v_payment from app.learning_requests where id=p_order;
 if v_payment<>'verified' then raise exception 'payment_not_verified' using errcode='22023';end if;
 update app.learning_deliverables set released=p_release,
 released_at=case when p_release then now() else null end
 where order_id=p_order and id=p_file;
 if not found then raise exception 'resource_not_found' using errcode='22023';end if;
 return jsonb_build_object('released',p_release);
end $fn$;

create or replace function public.learning_staff_start_production(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order for update;
 if not found or r.status='cancelled' or r.payment_status<>'verified'
 then raise exception 'order_not_ready' using errcode='22023';end if;
 if r.production_started_at is null then
 update app.learning_requests set production_started_at=now(),delivery_due_at=now()+
 (r.turnaround_days||' days')::interval,status='in_production',updated_at=now() where id=p_order;
 end if;
 select * into r from app.learning_requests where id=p_order;
 return jsonb_build_object('startedAt',r.production_started_at,'dueAt',r.delivery_due_at);
end $fn$;

create or replace function public.learning_student_orders(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;
begin
 v_student:=app.student_for(p_token);
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'invoiceRef',r.invoice_ref,
 'subject',r.subject,'kind',r.kind,'moduleCount',r.unit_count,'status',r.status,
 'paymentStatus',r.payment_status,'planStatus',r.learning_plan_status,
 'planTitle',r.learning_plan_title,'productionStartedAt',r.production_started_at,
 'deliveryDueAt',r.delivery_due_at,'deliveredAt',r.delivered_at,
 'releasedCount',(select count(*) from app.learning_deliverables d where d.order_id=r.id and d.released))
 order by r.created_at desc) from app.learning_requests r
 where r.student_id=v_student and r.payment_status='verified'),'[]'::jsonb);
end $fn$;

create or replace function public.learning_student_delivery_list(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order and student_id=v_student
 and payment_status='verified') then raise exception 'not_authorized' using errcode='28000';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',file_name,
 'kind',resource_kind,'moduleNumber',module_number,'size',file_size,
 'releasedAt',released_at) order by module_number nulls last,uploaded_at)
 from app.learning_deliverables where order_id=p_order and released),'[]'::jsonb);
end $fn$;

create or replace function public.learning_student_delivery_path(p_token text,p_order uuid,p_file uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;v_path text;
begin
 v_student:=app.student_for(p_token);
 select d.object_path into v_path from app.learning_deliverables d
 join app.learning_requests r on r.id=d.order_id
 where d.id=p_file and d.order_id=p_order and d.released
 and r.student_id=v_student and r.payment_status='verified';
 if v_path is null then raise exception 'not_authorized' using errcode='28000';end if;
 return jsonb_build_object('path',v_path);
end $fn$;

create or replace function public.learning_request_status_set(p_token text,p_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;
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
 if p_status='delivered' and (
   select count(*) from app.learning_deliverables where order_id=p_id and released
 )=0 then raise exception 'release_required' using errcode='22023';end if;
 update app.learning_requests set status=p_status,
 delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,
 updated_at=now() where id=p_id;
 return jsonb_build_object('id',p_id,'status',p_status);
end $fn$;

revoke all on function public.learning_staff_delivery_list(text,uuid) from public;
revoke all on function public.learning_staff_delivery_register(text,uuid,text,text,text,bigint,text,int) from public;
revoke all on function public.learning_staff_delivery_release(text,uuid,uuid,boolean) from public;
revoke all on function public.learning_staff_start_production(text,uuid) from public;
revoke all on function public.learning_student_orders(text) from public;
revoke all on function public.learning_student_delivery_list(text,uuid) from public;
revoke all on function public.learning_student_delivery_path(text,uuid,uuid) from public;
revoke all on function public.learning_request_status_set(text,uuid,text) from public;
grant execute on function public.learning_staff_delivery_list(text,uuid) to anon,authenticated;
grant execute on function public.learning_staff_delivery_register(text,uuid,text,text,text,bigint,text,int) to anon,authenticated;
grant execute on function public.learning_staff_delivery_release(text,uuid,uuid,boolean) to anon,authenticated;
grant execute on function public.learning_staff_start_production(text,uuid) to anon,authenticated;
grant execute on function public.learning_student_orders(text) to anon,authenticated;
grant execute on function public.learning_student_delivery_list(text,uuid) to anon,authenticated;
grant execute on function public.learning_student_delivery_path(text,uuid,uuid) to anon,authenticated;
grant execute on function public.learning_request_status_set(text,uuid,text) to anon,authenticated;

create or replace function public.learning_requests_list(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
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
 learning_plan_status,learning_plan_feedback,production_started_at,
 delivery_due_at,delivered_at,student_id
 from app.learning_requests order by created_at desc limit 200) r),'[]'::jsonb);
end $fn$;

revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon,authenticated;
