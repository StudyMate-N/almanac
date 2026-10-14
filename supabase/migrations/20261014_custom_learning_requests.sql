-- Almanac made-to-order learning requests. Apply before merging the public request page.
-- Isolated from pilot students, content approvals, and existing coach requests.
create table if not exists app.learning_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  course_id text,
  subject text not null,
  goal text not null,
  kind text not null check (kind in ('resource','exam','course')),
  delivery_method text not null check (delivery_method in ('both','workspace','files')),
  speed text not null check (speed in ('standard','priority','express')),
  addons text[] not null default '{}',
  unit_count integer not null check (unit_count between 1 and 8),
  base_usd integer not null check (base_usd > 0),
  addon_usd integer not null check (addon_usd >= 0),
  quote_usd integer not null check (quote_usd > 0),
  turnaround_days integer not null check (turnaround_days between 1 and 30),
  status text not null default 'received' check (status in ('received','awaiting_payment','in_production','review','delivered','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists learning_requests_created_at_idx on app.learning_requests (created_at desc);
create index if not exists learning_requests_email_created_idx on app.learning_requests (email, created_at desc);
alter table app.learning_requests enable row level security;
revoke all on app.learning_requests from public, anon, authenticated;

-- The database independently validates and calculates every price. Clients cannot
-- write their own totals or modify the status. No payment or deadline is implied.
create or replace function public.learning_request_create(p_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
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
  v_base integer;
  v_units integer;
  v_days integer;
  v_extra integer := 0;
  v_factor numeric;
  v_total integer;
  v_id uuid;
begin
  if v_kind not in ('resource','exam','course') or
     v_speed not in ('standard','priority','express') or
     v_method not in ('both','workspace','files') then
     raise exception 'invalid_package' using errcode='22023';
  end if;

  if length(v_name) not between 2 and 120 or
     length(v_subject) not between 3 and 140 or
     length(v_goal) not between 10 and 2000 or
     length(v_email) not between 5 and 254 or
     v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or
     (v_course is not null and (length(v_course) > 100 or v_course !~ '^[a-z0-9-]+$')) then
     raise exception 'invalid_details' using errcode='22023';
  end if;

  if jsonb_typeof(p_data->'addons') <> 'array' then
     raise exception 'invalid_addons' using errcode='22023';
  end if;
  select coalesce(array_agg(x), '{}'::text[]) into v_addons
    from jsonb_array_elements_text(p_data->'addons') as a(x);
  if cardinality(v_addons) > 6
     or (select count(distinct x) from unnest(v_addons) as a(x)) <> cardinality(v_addons)
     or exists (select 1 from unnest(v_addons) as a(x)
                where x not in ('slides','audio','video','mindmaps','infographics','exam_sim')) then
     raise exception 'invalid_addons' using errcode='22023';
  end if;

  v_base := case v_kind when 'resource' then 49 when 'exam' then 149 else 399 end;
  v_units := case v_kind when 'resource' then 1 when 'exam' then 4 else 8 end;
  v_days := case
    when v_kind='resource' then case v_speed when 'standard' then 5 when 'priority' then 3 else 2 end
    when v_kind='exam' then case v_speed when 'standard' then 7 when 'priority' then 5 else 3 end
    else case v_speed when 'standard' then 14 when 'priority' then 7 else 3 end
  end;
  v_factor := case v_speed when 'standard' then 1 when 'priority' then 1.4 else 1.9 end;

  select coalesce(sum(case x
    when 'slides' then 9*v_units
    when 'audio' then 12*v_units
    when 'video' then 30*v_units
    when 'mindmaps' then 7*v_units
    when 'infographics' then 9*v_units
    when 'exam_sim' then 39
    else 0 end),0)::int
    into v_extra from unnest(v_addons) as a(x);
  v_total := round((v_base + v_extra) * v_factor)::integer;
  if v_kind = 'course' and v_speed = 'express' and 'video' = any(v_addons) then
    raise exception 'express_unavailable' using errcode='22023';
  end if;
  if coalesce(p_data->>'expectedTotalUsd','') !~ '^[0-9]+

  if (select count(*) from app.learning_requests
      where created_at > now() - interval '1 hour') >= 100
      or (select count(*) from app.learning_requests
          where email = v_email and created_at > now() - interval '1 hour') >= 3 then
      raise exception 'request_limit' using errcode='53400';
  end if;

  insert into app.learning_requests
    (name,email,course_id,subject,goal,kind,delivery_method,speed,
     addons,unit_count,base_usd,addon_usd,quote_usd,turnaround_days)
  values
    (v_name,v_email,v_course,v_subject,v_goal,v_kind,v_method,v_speed,
     v_addons,v_units,v_base,v_extra,v_total,v_days)
  returning id into v_id;

  return jsonb_build_object(
    'id',v_id,
    'quoteUsd',v_total,
    'turnaroundDays',v_days,
    'status','received'
  );
end
$function$;

revoke all on function public.learning_request_create(jsonb) from public;
grant execute on function public.learning_request_create(jsonb) to anon, authenticated;

-- Existing coach/owner sessions can read incoming requests without broad table grants.
create or replace function public.learning_requests_list(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_role text;
begin
  select a.role into v_role
  from app.admin_sessions s
  join app.admins a on a.id = s.admin_id
  where s.token_hash = app.hash(p_token)
    and s.expires_at > now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  return coalesce((
    select jsonb_agg(to_jsonb(r) order by r.created_at desc)
    from (select * from app.learning_requests order by created_at desc limit 200) r
  ), '[]'::jsonb);
end
$function$;

revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon, authenticated;

    or (p_data->>'expectedTotalUsd')::integer <> v_total then
    raise exception 'price_changed' using errcode='22023';
  end if;

  if (select count(*) from app.learning_requests
      where created_at > now() - interval '1 hour') >= 100
      or (select count(*) from app.learning_requests
          where email = v_email and created_at > now() - interval '1 hour') >= 3 then
      raise exception 'request_limit' using errcode='53400';
  end if;

  insert into app.learning_requests
    (name,email,course_id,subject,goal,kind,delivery_method,speed,
     addons,unit_count,base_usd,addon_usd,quote_usd,turnaround_days)
  values
    (v_name,v_email,v_course,v_subject,v_goal,v_kind,v_method,v_speed,
     v_addons,v_units,v_base,v_extra,v_total,v_days)
  returning id into v_id;

  return jsonb_build_object(
    'id',v_id,
    'quoteUsd',v_total,
    'turnaroundDays',v_days,
    'status','received'
  );
end
$function$;

revoke all on function public.learning_request_create(jsonb) from public;
grant execute on function public.learning_request_create(jsonb) to anon, authenticated;

-- Existing coach/owner sessions can read incoming requests without broad table grants.
create or replace function public.learning_requests_list(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_role text;
begin
  select a.role into v_role
  from app.admin_sessions s
  join app.admins a on a.id = s.admin_id
  where s.token_hash = app.hash(p_token)
    and s.expires_at > now();
  if v_role not in ('owner','coach') or v_role is null then
    raise exception 'not_authorized' using errcode='28000';
  end if;
  return coalesce((
    select jsonb_agg(to_jsonb(r) order by r.created_at desc)
    from (select * from app.learning_requests order by created_at desc limit 200) r
  ), '[]'::jsonb);
end
$function$;

revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon, authenticated;
