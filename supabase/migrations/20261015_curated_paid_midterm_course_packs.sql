-- Versioned prepared courses for approved paid learners, independent of order-specific packs.
-- Only a valid Almanac Owner session can save/publish. Students must have active
-- course entitlement; no unprotected table API grants are provided.
create table if not exists app.curated_course_packs(
 course_id text primary key,
 pack jsonb not null,
 published boolean not null default false,
 updated_at timestamptz not null default now(),
 published_at timestamptz,
 reviewed_by text
);
revoke all on app.curated_course_packs from public, anon, authenticated;

create or replace function public.learning_curated_staff_pack_get(p_token text,p_course text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_pack app.curated_course_packs;
begin
 select a.role into v_role
 from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'not_authorized' using errcode='28000';end if;
 if p_course<>'advanced-pharmacology' then raise exception 'invalid_course';end if;
 select * into v_pack from app.curated_course_packs where course_id=p_course;
 return jsonb_build_object('content',v_pack.pack,'published',coalesce(v_pack.published,false),'updatedAt',v_pack.updated_at);
end $fn$;

create or replace function public.learning_curated_staff_pack_set(p_token text,p_course text,p_content jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_module jsonb;v_item jsonb;v_sim jsonb;
begin
 select a.role into v_role
 from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'not_authorized' using errcode='28000';end if;
 if p_course<>'advanced-pharmacology' then raise exception 'invalid_course';end if;
 if pg_catalog.octet_length(p_content::text)>1500000 then raise exception 'pack_too_large';end if;
 if jsonb_typeof(p_content)<>'object' or p_content->>'version'<>'1'
    or jsonb_typeof(p_content->'modules')<>'array'
    or jsonb_array_length(p_content->'modules')<>8
    or jsonb_typeof(p_content->'simulations')<>'array' or jsonb_array_length(p_content->'simulations')<1
 then raise exception 'invalid_midterm_structure'; end if;
 for v_module in select value from jsonb_array_elements(p_content->'modules') loop
  if jsonb_typeof(v_module->'title')<>'string'
     or length(trim(v_module->>'title'))<8
     or jsonb_typeof(v_module->'lesson')<>'string'
     or length(trim(v_module->>'lesson'))<450
     or jsonb_typeof(v_module->'objectives')<>'array'
     or jsonb_array_length(v_module->'objectives')<2
     or jsonb_typeof(v_module->'practice')<>'array'
     or jsonb_array_length(v_module->'practice')<6
     or jsonb_typeof(v_module->'flashcards')<>'array'
     or jsonb_array_length(v_module->'flashcards')<6
  then raise exception 'incomplete_midterm_module';end if;
  for v_item in select value from jsonb_array_elements(v_module->'practice') loop
   if jsonb_typeof(v_item->'options')<>'array'
      or jsonb_array_length(v_item->'options')<>4
      or (v_item->>'correctIndex') !~ '^[0-3]$'
      or length(trim(coalesce(v_item->>'explanation','')))<15
   then raise exception 'invalid_midterm_question'; end if;
  end loop;
 end loop;
 for v_sim in select value from jsonb_array_elements(p_content->'simulations') loop
  if jsonb_typeof(v_sim->'questions')<>'array'
     or jsonb_array_length(v_sim->'questions')<10
     or coalesce((v_sim->>'minutes') ~ '^([1-9][0-9]?)$',false)=false
  then raise exception 'invalid_midterm_rehearsal';end if;
 end loop;
 insert into app.curated_course_packs(course_id,pack,published,updated_at,published_at,reviewed_by)
 values(p_course,p_content,false,now(),null,null)
 on conflict(course_id) do update
 set pack=excluded.pack,published=false,updated_at=now(),published_at=null,reviewed_by=null;
 return jsonb_build_object('saved',true,'published',false);
end $fn$;

create or replace function public.learning_curated_staff_pack_publish(p_token text,p_course text,p_reviewed_by text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_pack app.curated_course_packs;
begin
 select a.role into v_role
 from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role is distinct from 'owner' then raise exception 'not_authorized' using errcode='28000';end if;
 if p_course<>'advanced-pharmacology' or length(trim(coalesce(p_reviewed_by,'')))<2 then
  raise exception 'review_confirmation_required';
 end if;
 update app.curated_course_packs set published=true,published_at=now(),reviewed_by=left(trim(p_reviewed_by),120),updated_at=now()
 where course_id=p_course returning * into v_pack;
 if not found then raise exception 'no_midterm_pack';end if;
 return jsonb_build_object('published',true,'publishedAt',v_pack.published_at);
end $fn$;

create or replace function public.learning_curated_student_pack_get(p_token text,p_course text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;v_pack app.curated_course_packs;
begin
 v_student:=app.student_for(p_token);
 if p_course<>'advanced-pharmacology' then raise exception 'not_authorized' using errcode='28000'; end if;
 if not exists(select 1 from app.external_paid_enrollments e
     where e.student_id=v_student and e.course_id=p_course and e.revoked_at is null)
  and not exists(select 1 from app.learning_requests r
     where r.student_id=v_student and r.course_id=p_course
        and r.payment_status='verified' and r.status<>'cancelled')
 then raise exception 'not_authorized' using errcode='28000';end if;
 select * into v_pack from app.curated_course_packs where course_id=p_course;
 if not found or not v_pack.published then
  return jsonb_build_object('published',false,'content',null);end if;
 return jsonb_build_object('published',true,'content',v_pack.pack);
end $fn$;

revoke all on function public.learning_curated_staff_pack_get(text,text) from public;
revoke all on function public.learning_curated_staff_pack_set(text,text,jsonb) from public;
revoke all on function public.learning_curated_staff_pack_publish(text,text,text) from public;
revoke all on function public.learning_curated_student_pack_get(text,text) from public;
grant execute on function public.learning_curated_staff_pack_get(text,text) to anon, authenticated;
grant execute on function public.learning_curated_staff_pack_set(text,text,jsonb) to anon, authenticated;
grant execute on function public.learning_curated_staff_pack_publish(text,text,text) to anon, authenticated;
grant execute on function public.learning_curated_student_pack_get(text,text) to anon, authenticated;
