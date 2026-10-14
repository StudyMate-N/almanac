-- Replaces per-format add-on pricing with complete core packages and quantified extras.
-- Historical requests are preserved; legacy addons remain readable for older invoices.
alter table app.learning_requests
  add column if not exists enhancements jsonb not null default '{}'::jsonb,
  add column if not exists learning_preference text not null default 'balanced';
alter table app.learning_requests drop constraint if exists learning_requests_unit_count_check;
alter table app.learning_requests add constraint learning_requests_unit_count_check
  check (unit_count between 1 and 12);
alter table app.learning_requests drop constraint if exists learning_requests_preference_check;
alter table app.learning_requests add constraint learning_requests_preference_check
  check (learning_preference in ('balanced','video','reading','practice'));

create or replace function public.learning_request_create(p_data jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $function$
declare
  v_kind text := p_data->>'kind';
  v_speed text := p_data->>'speed';
  v_method text := p_data->>'deliveryMethod';
  v_preference text := p_data->>'learningPreference';
  v_name text := trim(coalesce(p_data->>'name',''));
  v_email text := lower(trim(coalesce(p_data->>'email','')));
  v_subject text := trim(coalesce(p_data->>'subject',''));
  v_goal text := trim(coalesce(p_data->>'goal',''));
  v_course text := nullif(trim(coalesce(p_data->>'courseId','')),'');
  v_extras jsonb := p_data->'enhancements';
  v_key text;
  v_txt text;
  v_deep int := 0;
  v_exam int := 0;
  v_unit int := 0;
  v_base int;
  v_units int;
  v_days int;
  v_extra int;
  v_factor numeric;
  v_total int;
  v_id uuid := gen_random_uuid();
  v_invoice_ref text;
  v_token text := encode(extensions.gen_random_bytes(24),'hex');
begin
  if v_kind is null or v_kind not in ('resource','exam','course')
    or v_speed is null or v_speed not in ('standard','priority','express')
    or v_method is null or v_method not in ('both','workspace','files')
    or v_preference is null or v_preference not in ('balanced','video','reading','practice') then
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
  if jsonb_typeof(v_extras) is distinct from 'object' then
    raise exception 'invalid_enhancements' using errcode='22023';
  end if;
  for v_key in select jsonb_object_keys(v_extras) loop
    if v_key not in ('deep_video','exam_sim','unit') then
      raise exception 'invalid_enhancements' using errcode='22023';
    end if;
  end loop;
  v_txt := coalesce(v_extras->>'deep_video','0');
  if v_txt !~ '^[0-9]{1,2}$' then raise exception 'invalid_enhancements' using errcode='22023'; end if;
  v_deep := v_txt::int;
  v_txt := coalesce(v_extras->>'exam_sim','0');
  if v_txt !~ '^[0-9]{1,2}$' then raise exception 'invalid_enhancements' using errcode='22023'; end if;
  v_exam := v_txt::int;
  v_txt := coalesce(v_extras->>'unit','0');
  if v_txt !~ '^[0-9]{1,2}$' then raise exception 'invalid_enhancements' using errcode='22023'; end if;
  v_unit := v_txt::int;
  if (v_kind='resource' and (v_deep>1 or v_exam<>0 or v_unit<>0))
    or (v_kind='exam' and (v_deep>2 or v_exam>2 or v_unit<>0))
    or (v_kind='course' and (v_deep>3 or v_exam>2 or v_unit>4)) then
    raise exception 'invalid_enhancements' using errcode='22023';
  end if;
  if (v_speed='express' and (v_unit>0 or v_deep>1 or v_exam>1))
     or (v_speed='priority' and v_unit>2) then
    raise exception 'delivery_unavailable' using errcode='22023';
  end if;
  v_base := case v_kind when 'resource' then 49 when 'exam' then 149 else 399 end;
  v_units := (case v_kind when 'resource' then 1 when 'exam' then 4 else 8 end) + v_unit;
  v_days := case
    when v_kind='resource' then case v_speed when 'standard' then 5 when 'priority' then 3 else 2 end
    when v_kind='exam' then case v_speed when 'standard' then 7 when 'priority' then 5 else 3 end
    else case v_speed when 'standard' then 14 when 'priority' then 7 else 3 end
  end;
  v_factor := case v_speed when 'standard' then 1 when 'priority' then 1.4 else 1.9 end;
  v_extra := 35*v_deep + 39*v_exam + 59*v_unit;
  v_total := round((v_base+v_extra)*v_factor)::int;
  if coalesce(p_data->>'expectedTotalUsd','') !~ '^[0-9]{1,9}$'
    or (p_data->>'expectedTotalUsd')::int <> v_total then
    raise exception 'price_changed' using errcode='22023';
  end if;
  if (select count(*) from app.learning_requests where created_at > now()-interval '1 hour') >= 100
    or (select count(*) from app.learning_requests
        where email=v_email and created_at>now()-interval '1 hour') >= 3 then
    raise exception 'request_limit' using errcode='53400';
  end if;
  v_invoice_ref := 'ALM-' || to_char(now(),'YYYY') || '-' ||
                   upper(substr(replace(v_id::text,'-',''),1,12));
  insert into app.learning_requests
    (id,invoice_ref,invoice_token_hash,name,email,course_id,subject,goal,kind,delivery_method,
     speed,addons,enhancements,learning_preference,unit_count,base_usd,addon_usd,quote_usd,turnaround_days)
  values
    (v_id,v_invoice_ref,app.hash(v_token),v_name,v_email,v_course,v_subject,v_goal,
     v_kind,v_method,v_speed,'{}'::text[],jsonb_build_object('deep_video',v_deep,'exam_sim',v_exam,'unit',v_unit),
     v_preference,v_units,v_base,v_extra,v_total,v_days);
  return jsonb_build_object('id',v_id,'invoiceRef',v_invoice_ref,
    'invoiceToken',v_token,'quoteUsd',v_total,
    'turnaroundDays',v_days,'status','awaiting_payment');
end $function$;

revoke all on function public.learning_request_create(jsonb) from public;
grant execute on function public.learning_request_create(jsonb) to anon,authenticated;

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
    'speed',r.speed,'addons',r.addons,'enhancements',r.enhancements,
    'learningPreference',r.learning_preference,'units',r.unit_count,'baseUsd',r.base_usd,
    'addonUsd',r.addon_usd,'quoteUsd',r.quote_usd,'turnaroundDays',r.turnaround_days,
    'paymentStatus',r.payment_status,'status',r.status,'createdAt',r.created_at
  );
end $function$;

revoke all on function public.learning_invoice_get(uuid,text) from public;
grant execute on function public.learning_invoice_get(uuid,text) to anon,authenticated;

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
      speed,addons,enhancements,learning_preference,unit_count,base_usd,addon_usd,
      quote_usd,turnaround_days,status,payment_status,payment_reference,payment_date,
      payment_reported_at,paid_at,access_issued_at,created_at
      from app.learning_requests order by created_at desc limit 200) r),'[]'::jsonb);
end $function$;

revoke all on function public.learning_requests_list(text) from public;
grant execute on function public.learning_requests_list(text) to anon,authenticated;
