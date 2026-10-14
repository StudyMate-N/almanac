-- Private payment evidence, separate from syllabus and study materials.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('almanac-payment-receipts','almanac-payment-receipts',false,5242880,
  array['application/pdf','image/jpeg','image/png'])
 on conflict(id) do nothing;
create table if not exists app.learning_payment_proofs(
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references app.learning_requests(id) on delete cascade,
 file_name text not null,
 object_path text not null unique,
 media_type text not null,
 file_size bigint not null check(file_size between 1 and 5242880),
 submitted_at timestamptz not null default now()
);
alter table app.learning_payment_proofs enable row level security;
revoke all on app.learning_payment_proofs from public,anon,authenticated;
create index if not exists learning_payment_proofs_order_idx
 on app.learning_payment_proofs(order_id,submitted_at desc);

create or replace function public.learning_payment_proof_register(
 p_order uuid,p_token text,p_file_name text,p_object_path text,p_media_type text,p_bytes bigint
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;v_id uuid;
begin
 perform pg_advisory_xact_lock(hashtext(p_order::text));
 select * into r from app.learning_requests where id=p_order
  and invoice_token_hash=app.hash(p_token);
 if not found then raise exception 'not_authorized' using errcode='28000'; end if;
 if r.payment_status='verified' or r.status='cancelled' then
  raise exception 'proof_closed' using errcode='22023';
 end if;
 if r.payable_cad_cents is null then raise exception 'cad_not_set' using errcode='22023'; end if;
 if length(p_file_name) not between 1 and 120 or p_bytes not between 1 and 5242880
  or p_media_type not in ('image/jpeg','image/png','application/pdf')
  or length(p_object_path)>270
  or p_object_path !~ ('^'||p_order::text||'/[a-f0-9-]{36}-[a-zA-Z0-9._-]+$')
  or (select count(*) from app.learning_payment_proofs where order_id=p_order)>=2 then
  raise exception 'proof_limit' using errcode='22023';
 end if;
 insert into app.learning_payment_proofs(order_id,file_name,object_path,media_type,file_size)
 values(p_order,p_file_name,p_object_path,p_media_type,p_bytes) returning id into v_id;
 return jsonb_build_object('id',v_id,'fileName',p_file_name,'fileSize',p_bytes);
end $fn$;
revoke all on function public.learning_payment_proof_register(uuid,text,text,text,text,bigint) from public;
grant execute on function public.learning_payment_proof_register(uuid,text,text,text,text,bigint) to anon,authenticated,service_role;

create or replace function public.learning_payment_proofs_list(p_order uuid,p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
begin
 if not exists(select 1 from app.learning_requests where id=p_order
  and invoice_token_hash=app.hash(p_token)) then
  raise exception 'not_authorized' using errcode='28000';
 end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',id,'fileName',file_name,
  'fileSize',file_size,'submittedAt',submitted_at) order by submitted_at desc)
  from app.learning_payment_proofs where order_id=p_order),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_payment_proofs_list(uuid,text) from public;
grant execute on function public.learning_payment_proofs_list(uuid,text) to anon,authenticated,service_role;

create or replace function public.learning_payment_proofs_staff_list(p_staff_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a
 on a.id=s.admin_id where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then
   raise exception 'not_authorized' using errcode='28000';
 end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',id,'fileName',file_name,
  'fileSize',file_size,'objectPath',object_path,'submittedAt',submitted_at)
  order by submitted_at desc)
  from app.learning_payment_proofs where order_id=p_order),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_payment_proofs_staff_list(text,uuid) from public;
grant execute on function public.learning_payment_proofs_staff_list(text,uuid) to anon,authenticated,service_role;

-- Bank reference or uploaded payment receipt, plus a date, is sufficient
-- to report a transfer. Neither is proof of verified receipt at the bank.
create or replace function public.learning_payment_report(
 p_id uuid,p_token text,p_reference text,p_paid_on date
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;v_ref text:=trim(coalesce(p_reference,''));
begin
 select * into r from app.learning_requests
  where id=p_id and invoice_token_hash=app.hash(p_token) for update;
 if not found then raise exception 'invoice_not_found' using errcode='28000'; end if;
 if r.payment_status='verified' then return jsonb_build_object('paymentStatus','verified');end if;
 if r.payable_cad_cents is null then raise exception 'cad_not_set' using errcode='22023';end if;
 if length(v_ref)>120 or (length(v_ref)>0 and length(v_ref)<5)
  or (length(v_ref)=0 and not exists(select 1 from app.learning_payment_proofs where order_id=p_id))
  or p_paid_on is null or p_paid_on>current_date+1 or p_paid_on<current_date-90 then
  raise exception 'invalid_payment_details' using errcode='22023';
 end if;
 update app.learning_requests set payment_reference=nullif(v_ref,''),
  payment_date=p_paid_on,payment_reported_at=now(),
  payment_status='reported',updated_at=now() where id=p_id;
 return jsonb_build_object('paymentStatus','reported');
end $fn$;
revoke all on function public.learning_payment_report(uuid,text,text,date) from public;
grant execute on function public.learning_payment_report(uuid,text,text,date) to anon,authenticated;

-- Human-reviewed study plan touchpoint. Do not infer goals from files automatically.
alter table app.learning_requests
 add column if not exists learning_plan_title text,
 add column if not exists learning_plan_summary text,
 add column if not exists learning_plan_topics text[] not null default '{}',
 add column if not exists learning_plan_objectives text[] not null default '{}',
 add column if not exists learning_plan_dates text[] not null default '{}',
 add column if not exists learning_plan_status text not null default 'pending',
 add column if not exists learning_plan_feedback text,
 add column if not exists learning_plan_shared_at timestamptz,
 add column if not exists learning_plan_confirmed_at timestamptz;
alter table app.learning_requests drop constraint if exists learning_requests_plan_status_check;
alter table app.learning_requests add constraint learning_requests_plan_status_check
 check(learning_plan_status in ('pending','shared','revision_requested','confirmed'));

create or replace function public.learning_plan_staff_set(
 p_staff_token text,p_id uuid,p_title text,p_summary text,
 p_topics text[],p_objectives text[],p_dates text[]
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a
 on a.id=s.admin_id where s.token_hash=app.hash(p_staff_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then
  raise exception 'not_authorized' using errcode='28000';
 end if;
 if length(trim(coalesce(p_title,''))) not between 3 and 140
  or length(trim(coalesce(p_summary,''))) not between 15 and 1500
  or cardinality(coalesce(p_topics,'{}'))>12 or cardinality(coalesce(p_objectives,'{}'))>12
  or cardinality(coalesce(p_dates,'{}'))>12
  or exists(select 1 from unnest(p_topics||p_objectives||p_dates) a(x)
    where length(x)>240) then raise exception 'invalid_plan' using errcode='22023';end if;
 update app.learning_requests set learning_plan_title=trim(p_title),
  learning_plan_summary=trim(p_summary),learning_plan_topics=coalesce(p_topics,'{}'),
  learning_plan_objectives=coalesce(p_objectives,'{}'),learning_plan_dates=coalesce(p_dates,'{}'),
  learning_plan_status='shared',learning_plan_shared_at=now(),learning_plan_feedback=null,
  learning_plan_confirmed_at=null,updated_at=now()
 where id=p_id and status<>'cancelled';
 if not found then raise exception 'request_not_found' using errcode='22023';end if;
 return jsonb_build_object('status','shared');
end $fn$;
revoke all on function public.learning_plan_staff_set(text,uuid,text,text,text[],text[],text[]) from public;
grant execute on function public.learning_plan_staff_set(text,uuid,text,text,text[],text[],text[]) to anon,authenticated;

create or replace function public.learning_plan_respond(
 p_id uuid,p_token text,p_action text,p_feedback text
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;v_status text;
begin
 select * into r from app.learning_requests where id=p_id and
  invoice_token_hash=app.hash(p_token) for update;
 if not found then raise exception 'not_authorized' using errcode='28000';end if;
 if r.learning_plan_status not in ('shared','revision_requested') then
   raise exception 'plan_not_ready' using errcode='22023';
 end if;
 if p_action not in ('confirm','request_revision') then
   raise exception 'invalid_action' using errcode='22023';
 end if;
 if p_action='request_revision' and length(trim(coalesce(p_feedback,''))) not between 8 and 1000
 then raise exception 'invalid_feedback' using errcode='22023';end if;
 v_status:=case when p_action='confirm' then 'confirmed' else 'revision_requested' end;
 update app.learning_requests set learning_plan_status=v_status,
  learning_plan_feedback=case when p_action='request_revision' then trim(p_feedback) else null end,
  learning_plan_confirmed_at=case when p_action='confirm' then now() else null end,
  updated_at=now() where id=p_id;
 return jsonb_build_object('status',v_status);
end $fn$;
revoke all on function public.learning_plan_respond(uuid,text,text,text) from public;
grant execute on function public.learning_plan_respond(uuid,text,text,text) to anon,authenticated;

create or replace function public.learning_invoice_get(p_id uuid,p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare r app.learning_requests;
begin
 select * into r from app.learning_requests
 where id=p_id and invoice_token_hash=app.hash(p_token);
 if not found then raise exception 'invoice_not_found' using errcode='28000';end if;
 return jsonb_build_object('id',r.id,'invoiceRef',r.invoice_ref,'name',r.name,'email',r.email,
  'subject',r.subject,'goal',r.goal,'kind',r.kind,'deliveryMethod',r.delivery_method,'speed',r.speed,
  'addons',r.addons,'enhancements',r.enhancements,'learningPreference',r.learning_preference,
  'units',r.unit_count,'baseUsd',r.base_usd,'addonUsd',r.addon_usd,'quoteUsd',r.quote_usd,
  'turnaroundDays',r.turnaround_days,'paymentStatus',r.payment_status,'status',r.status,
  'createdAt',r.created_at,'payableCadCents',r.payable_cad_cents,
  'rateCadPerUsd',r.fx_cad_per_usd,'rateDate',r.fx_rate_date,'fxSource',r.fx_source,
  'learningPlanStatus',r.learning_plan_status,'learningPlanTitle',r.learning_plan_title,
  'learningPlanSummary',r.learning_plan_summary,'learningPlanTopics',r.learning_plan_topics,
  'learningPlanObjectives',r.learning_plan_objectives,
  'learningPlanDates',r.learning_plan_dates,'learningPlanFeedback',r.learning_plan_feedback
 );
end $fn$;
revoke all on function public.learning_invoice_get(uuid,text) from public;
grant execute on function public.learning_invoice_get(uuid,text) to anon,authenticated,service_role;

create or replace function public.learning_requests_list(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then
  raise exception 'not_authorized' using errcode='28000';
 end if;
 return coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc)
  from (select id,invoice_ref,name,email,course_id,subject,goal,kind,delivery_method,
   speed,addons,enhancements,learning_preference,unit_count,base_usd,addon_usd,
   quote_usd,turnaround_days,status,payment_status,payment_reference,payment_date,
   payment_reported_at,paid_at,access_issued_at,created_at,payable_cad_cents,
   fx_cad_per_usd,fx_rate_date,learning_plan_title,learning_plan_summary,
   learning_plan_topics,learning_plan_objectives,learning_plan_dates,
   learning_plan_status,learning_plan_feedback
   from app.learning_requests order by created_at desc limit 200) r),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon,authenticated;
