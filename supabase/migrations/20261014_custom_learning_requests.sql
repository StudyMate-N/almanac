-- Almanac custom learning invoice requests. Separate from existing students.
create table if not exists app.learning_requests (
  id uuid primary key default gen_random_uuid(),
  invoice_ref text not null unique,
  invoice_token_hash text not null,
  name text not null,
  email text not null,
  course_id text,
  subject text not null,
  goal text not null,
  kind text not null check (kind in ('resource','exam','course')),
  delivery_method text not null check (delivery_method in ('both','workspace','files')),
  speed text not null check (speed in ('standard','priority','express')),
  addons text[] not null default '{}',
  unit_count int not null check (unit_count between 1 and 8),
  base_usd int not null check (base_usd > 0),
  addon_usd int not null check (addon_usd >= 0),
  quote_usd int not null check (quote_usd > 0),
  turnaround_days int not null check (turnaround_days between 1 and 30),
  status text not null default 'awaiting_payment' check (status in ('received','awaiting_payment','in_production','review','delivered','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','reported','verified','rejected')),
  payment_reference text,
  payment_date date,
  payment_reported_at timestamptz,
  paid_at timestamptz,
  access_issued_at timestamptz,
  student_id uuid references app.students(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists learning_requests_created_idx on app.learning_requests(created_at desc);
create index if not exists learning_requests_email_created_idx on app.learning_requests(email, created_at desc);
alter table app.learning_requests enable row level security;
revoke all on app.learning_requests from public, anon, authenticated;

-- Server-calculated immutable price and unguessable private invoice URL token.
create or replace function public.learning_request_create(p_data jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $function$
declare
  v_kind text := p_data->>'kind';
  v_speed text := p_data->>'speed';
  v_method text := p_data->>'deliveryMethod';
  v_name text := trim(coalesce(p_data->>'name',''));
  v_email text := lower(trim(coalesce(p_data->>'email','')));
  v_subject text := trim(coalesce(p_data->>'subject',''));
  v_goal text := trim(coalesce(p_data->>'goal',''));
  v_course text := nullif(trim(coalesce(p_data->>'courseId','')), '');
  v_addons text[];
  v_base int;
  v_units int;
  v_days int;
  v_extra int := 0;
  v_factor numeric;
  v_total int;
  v_id uuid := gen_random_uuid();
  v_invoice_ref text;
  v_token text := encode(extensions.gen_random_bytes(24),'hex');
begin
  if v_kind not in ('resource','exam','course')
    or v_speed not in ('standard','priority','express')
    or v_method not in ('both','workspace','files') then
      raise exception 'invalid_package' using errcode='22023';
  end if;
  if length(v_name) not between 2 and 120
     or length(v_subject) not between 3 and 140
     or length(v_goal) not between 10 and 2000
     or length(v_email) not between 5 and 254
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
     or (v_course is not null and (length(v_course)>100 or v_course !~ '^[a-z0-9-]+$')) then
      raise exception 'invalid_details' using errcode='22023';
  end if;
  if jsonb_typeof(p_data->'addons') is distinct from 'array' then
      raise exception 'invalid_addons' using errcode='22023';
  end if;
  select coalesce(array_agg(x),'{}'::text[]) into v_addons
    from jsonb_array_elements_text(p_data->'addons') as a(x);
  if cardinality(v_addons)>6
    or (select count(distinct x) from unnest(v_addons) a(x)) <> cardinality(v_addons)
    or exists(select 1 from unnest(v_addons) a(x) where x not in
      ('slides','audio','video','mindmaps','infographics','exam_sim')) then
      raise exception 'invalid_addons' using errcode='22023';
  end if;
  v_base := case v_kind when 'resource' then 49 when 'exam' then 149 else 399 end;
  v_units := case v_kind when 'resource' then 1 when 'exam' then 4 else 8 end;
  v_days := case
    when v_kind='resource' then case v_speed when 'standard' then 5 when 'priority' then 3 else 2 end
    when v_kind='exam' then case v_speed when 'standard' then 7 when 'priority' then 5 else 3 end
    else case v_speed when 'standard' then 14 when 'priority' then 7 else 3 end end;
  v_factor := case v_speed when 'standard' then 1 when 'priority' then 1.4 else 1.9 end;
  select coalesce(sum(case x
    when 'slides' then 9*v_units
    when 'audio' then 12*v_units
    when 'video' then 30*v_units
    when 'mindmaps' then 7*v_units
    when 'infographics' then 9*v_units
    when 'exam_sim' then 39 else 0 end),0)::int
    into v_extra from unnest(v_addons) a(x);
  v_total := round((v_base+v_extra)*v_factor)::int;
  if v_kind='course' and v_speed='express' and 'video'=any(v_addons) then
    raise exception 'express_unavailable' using errcode='22023';
  end if;
  if coalesce(p_data->>'expectedTotalUsd','') !~ '^[0-9]+$'
     or (p_data->>'expectedTotalUsd')::int <> v_total then
    raise exception 'price_changed' using errcode='22023';
  end if;
  if (select count(*) from app.learning_requests where created_at>now()-interval '1 hour')>=100
      or (select count(*) from app.learning_requests where email=v_email and created_at>now()-interval '1 hour')>=3 then
    raise exception 'request_limit' using errcode='53400';
  end if;
  v_invoice_ref := 'ALM-' || to_char(now(),'YYYY') || '-' ||
                   upper(substr(replace(v_id::text,'-',''),1,12));
  insert into app.learning_requests
    (id,invoice_ref,invoice_token_hash,name,email,course_id,subject,goal,kind,delivery_method,
      speed,addons,unit_count,base_usd,addon_usd,quote_usd,turnaround_days)
  values (v_id,v_invoice_ref,app.hash(v_token),v_name,v_email,v_course,v_subject,v_goal,
          v_kind,v_method,v_speed,v_addons,v_units,v_base,v_extra,v_total,v_days);
  return jsonb_build_object('id',v_id,'invoiceRef',v_invoice_ref,
    'invoiceToken',v_token,'quoteUsd',v_total,'turnaroundDays',v_days,
    'status','awaiting_payment');
end $function$;
revoke all on function public.learning_request_create(jsonb) from public;
grant execute on function public.learning_request_create(jsonb) to anon, authenticated;

-- Possession of the private invoice token authorizes read-only order details.
create or replace function public.learning_invoice_get(p_id uuid,p_token text)
returns jsonb
language plpgsql security definer set search_path = ''
as $function$
declare r app.learning_requests;
begin
  select * into r from app.learning_requests
  where id=p_id and invoice_token_hash=app.hash(p_token);
  if not found then raise exception 'invoice_not_found' using errcode='28000'; end if;
  return jsonb_build_object(
    'id',r.id,'invoiceRef',r.invoice_ref,'name',r.name,'email',r.email,
    'subject',r.subject,'goal',r.goal,'kind',r.kind,'deliveryMethod',r.delivery_method,
    'speed',r.speed,'addons',r.addons,'units',r.unit_count,'baseUsd',r.base_usd,
    'addonUsd',r.addon_usd,'quoteUsd',r.quote_usd,'turnaroundDays',r.turnaround_days,
    'paymentStatus',r.payment_status,'status',r.status,'createdAt',r.created_at
  );
end $function$;
revoke all on function public.learning_invoice_get(uuid,text) from public;
grant execute on function public.learning_invoice_get(uuid,text) to anon, authenticated;

-- A payment report is not payment verification. No proof-of-payment file is required.
create or replace function public.learning_payment_report(
  p_id uuid,p_token text,p_reference text,p_paid_on date
)
returns jsonb
language plpgsql security definer set search_path = ''
as $function$
declare r app.learning_requests;
begin
  select * into r from app.learning_requests
   where id=p_id and invoice_token_hash=app.hash(p_token) for update;
  if not found then raise exception 'invoice_not_found' using errcode='28000'; end if;
  if r.payment_status='verified' then
    return jsonb_build_object('paymentStatus','verified');
  end if;
  if length(trim(coalesce(p_reference,''))) not between 5 and 120
     or p_paid_on is null or p_paid_on > current_date + 1
     or p_paid_on < current_date - 90 then
    raise exception 'invalid_payment_details' using errcode='22023';
  end if;
  update app.learning_requests set payment_reference=trim(p_reference),
    payment_date=p_paid_on,payment_reported_at=now(),payment_status='reported',
    updated_at=now() where id=p_id;
  return jsonb_build_object('paymentStatus','reported');
end $function$;
revoke all on function public.learning_payment_report(uuid,text,text,date) from public;
grant execute on function public.learning_payment_report(uuid,text,text,date) to anon, authenticated;

-- Existing staff codes authorize a restricted inbox; no bank account details here.
create or replace function public.learning_requests_list(p_token text)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_role text;
begin
  select a.role into v_role from app.admin_sessions s join app.admins a
    on a.id=s.admin_id where s.token_hash=app.hash(p_token) and s.expires_at>now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  return coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc)
   from (select id,invoice_ref,name,email,course_id,subject,goal,kind,delivery_method,
      speed,addons,unit_count,base_usd,addon_usd,quote_usd,turnaround_days,status,
      payment_status,payment_reference,payment_date,payment_reported_at,paid_at,access_issued_at,created_at
      from app.learning_requests order by created_at desc limit 200) r),'[]'::jsonb);
end $function$;
revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon, authenticated;

-- Staff verifies transfer independently. Returns newly provisioned sign-in code ONCE
-- for secure delivery to the learner; never store the raw access code.
create or replace function public.learning_payment_verify(p_token text,p_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_role text; r app.learning_requests; v_code text; v_student_id uuid;
begin
  select a.role into v_role from app.admin_sessions s join app.admins a
    on a.id=s.admin_id where s.token_hash=app.hash(p_token) and s.expires_at>now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  select * into r from app.learning_requests where id=p_id for update;
  if not found then raise exception 'request_not_found' using errcode='22023'; end if;
  if r.payment_status='verified' then
    return jsonb_build_object('paymentStatus','verified','alreadyVerified',true);
  end if;
  if r.payment_status<>'reported' then
    raise exception 'payment_not_reported' using errcode='22023';
  end if;
  v_code := 'ALM-' || upper(encode(extensions.gen_random_bytes(12),'hex'));
  insert into app.students(code_hash,label,name,email)
    values (app.hash(app.norm_code(v_code)),r.invoice_ref,r.name,r.email)
    returning id into v_student_id;
  update app.learning_requests set payment_status='verified',paid_at=now(),
    access_issued_at=now(),student_id=v_student_id,status='in_production',updated_at=now()
    where id=p_id;
  return jsonb_build_object('paymentStatus','verified','accessCode',v_code,
    'invoiceRef',r.invoice_ref,'email',r.email,'name',r.name);
end $function$;
revoke all on function public.learning_payment_verify(text,uuid) from public;
grant execute on function public.learning_payment_verify(text,uuid) to anon, authenticated;

create or replace function public.learning_request_status_set(
  p_token text,p_id uuid,p_status text
)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare v_role text;
begin
  select a.role into v_role from app.admin_sessions s join app.admins a
    on a.id=s.admin_id where s.token_hash=app.hash(p_token) and s.expires_at>now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  if p_status not in ('received','awaiting_payment','in_production','review','delivered','cancelled') then
    raise exception 'invalid_status' using errcode='22023';
  end if;
  update app.learning_requests set status=p_status,updated_at=now() where id=p_id;
  if not found then raise exception 'request_not_found' using errcode='22023'; end if;
  return jsonb_build_object('id',p_id,'status',p_status);
end $function$;
revoke all on function public.learning_request_status_set(text,uuid,text) from public;
grant execute on function public.learning_request_status_set(text,uuid,text) to anon, authenticated;
