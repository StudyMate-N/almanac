-- Private source documents for made-to-order Almanac learning packages.
-- No public object access. A private storage bucket is required.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
 'almanac-course-sources','almanac-course-sources',false,10485760,
 array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
 'text/plain','image/png','image/jpeg']
) on conflict (id) do nothing;

create table if not exists app.learning_source_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references app.learning_requests(id) on delete cascade,
  file_name text not null,
  object_path text not null unique,
  media_type text not null,
  file_size bigint not null check(file_size between 1 and 10485760),
  submitted_at timestamptz not null default now()
);
create index if not exists learning_source_files_order_idx
  on app.learning_source_files(order_id,submitted_at desc);
alter table app.learning_source_files enable row level security;
revoke all on app.learning_source_files from public,anon,authenticated;

create or replace function public.learning_sources_slot_check(p_order uuid,p_token text,p_bytes bigint)
returns jsonb language plpgsql security definer set search_path = ''
as $fn$
declare v_count int; v_bytes bigint;
begin
  if p_token is null or not exists(select 1 from app.learning_requests
    where id=p_order and invoice_token_hash=app.hash(p_token)
      and status<>'cancelled') then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  if p_bytes<1 or p_bytes>10485760 then
    raise exception 'file_too_large' using errcode='22023';
  end if;
  select count(*),coalesce(sum(file_size),0) into v_count,v_bytes
    from app.learning_source_files where order_id=p_order;
  if v_count>=8 or v_bytes+p_bytes>41943040 then
    raise exception 'upload_limit' using errcode='22023';
  end if;
  return jsonb_build_object('allowed',true,'remainingFiles',8-v_count,
    'remainingBytes',41943040-v_bytes);
end $fn$;
revoke all on function public.learning_sources_slot_check(uuid,text,bigint) from public;
grant execute on function public.learning_sources_slot_check(uuid,text,bigint) to anon,authenticated;

create or replace function public.learning_source_file_register(
  p_order uuid,p_token text,p_file_name text,p_object_path text,
  p_media_type text,p_bytes bigint
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_count int;v_bytes bigint;v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_order::text));
  perform public.learning_sources_slot_check(p_order,p_token,p_bytes);
  if length(p_file_name) not between 1 and 120
    or length(p_object_path)>260
    or p_object_path !~ ('^'||p_order::text||'/[a-f0-9-]{36}-[a-zA-Z0-9._-]+$')
    or p_media_type not in ('application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain','image/png','image/jpeg') then
      raise exception 'invalid_file' using errcode='22023';
  end if;
  select count(*),coalesce(sum(file_size),0) into v_count,v_bytes
    from app.learning_source_files where order_id=p_order;
  if v_count>=8 or v_bytes+p_bytes>41943040 then
    raise exception 'upload_limit' using errcode='22023';
  end if;
  insert into app.learning_source_files(order_id,file_name,object_path,media_type,file_size)
    values(p_order,p_file_name,p_object_path,p_media_type,p_bytes) returning id into v_id;
  return jsonb_build_object('id',v_id,'fileName',p_file_name,'fileSize',p_bytes);
end $fn$;
revoke all on function public.learning_source_file_register(uuid,text,text,text,text,bigint) from public;
grant execute on function public.learning_source_file_register(uuid,text,text,text,text,bigint) to anon,authenticated;

create or replace function public.learning_sources_list(p_order uuid,p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
begin
  if not exists(select 1 from app.learning_requests
    where id=p_order and invoice_token_hash=app.hash(p_token)) then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id',id,'fileName',file_name,'fileSize',file_size,'submittedAt',submitted_at
  ) order by submitted_at desc) from app.learning_source_files
  where order_id=p_order),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_sources_list(uuid,text) from public;
grant execute on function public.learning_sources_list(uuid,text) to anon,authenticated;

create or replace function public.learning_sources_staff_list(p_staff_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
  select a.role into v_role from app.admin_sessions s join app.admins a
  on a.id=s.admin_id where s.token_hash=app.hash(p_staff_token)
    and s.expires_at>now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id',id,'fileName',file_name,'fileSize',file_size,
    'objectPath',object_path,'submittedAt',submitted_at
  ) order by submitted_at desc)
  from app.learning_source_files where order_id=p_order),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_sources_staff_list(text,uuid) from public;
grant execute on function public.learning_sources_staff_list(text,uuid) to anon,authenticated;
