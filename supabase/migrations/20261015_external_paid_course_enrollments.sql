-- Approved paid learners whose payment was settled outside Almanac.
-- This creates a course entitlement, not a fabricated bank-transfer invoice.
create table if not exists app.external_paid_enrollments (
  student_id uuid not null references app.students(id) on delete cascade,
  course_id text not null,
  verified_externally_at timestamptz not null default now(),
  recorded_by text not null,
  source_note text not null,
  revoked_at timestamptz,
  primary key(student_id, course_id),
  constraint external_paid_course_id_check check (course_id ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  constraint external_paid_source_note_check check (length(trim(source_note)) between 12 and 500)
);
revoke all on app.external_paid_enrollments from public, anon, authenticated;
create index if not exists idx_external_paid_enrollments_course on app.external_paid_enrollments(course_id) where revoked_at is null;

create or replace function public.learning_authorized_courses(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;
begin
  v_student := app.student_for(p_token);
  return coalesce((
    select jsonb_agg(course_id order by course_id) from (
      select e.course_id
      from app.external_paid_enrollments e
      where e.student_id=v_student and e.revoked_at is null
      union
      select r.course_id
      from app.learning_requests r
      where r.student_id=v_student and r.payment_status='verified'
        and r.status<>'cancelled' and r.course_id is not null
    ) entitled
  ),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_authorized_courses(text) from public;
grant execute on function public.learning_authorized_courses(text) to anon, authenticated;

-- Paid-only sign-in: previously issued pilot codes do not independently grant
-- course access once this policy is deployed.
create or replace function public.pilot_sign_in(p_code text, p_name text default null, p_email text default null)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare st app.students; tok text;
begin
 select * into st from app.students where code_hash=app.hash(app.norm_code(p_code)) and not disabled;
 if not found then
   perform pg_sleep(0.4);
   raise exception 'invalid_code' using errcode='28000';
 end if;
 if not exists(
   select 1 from app.external_paid_enrollments e
   where e.student_id=st.id and e.revoked_at is null
 ) and not exists(
   select 1 from app.learning_requests r
   where r.student_id=st.id and r.payment_status='verified' and r.status<>'cancelled'
 ) then
   perform pg_sleep(0.4);
   raise exception 'invalid_code' using errcode='28000';
 end if;
 update app.students
   set name=coalesce(nullif(left(trim(p_name),80),''),name),
       email=coalesce(nullif(left(lower(trim(p_email)),160),''),email),
       last_seen_at=now()
 where id=st.id returning * into st;
 tok:=encode(extensions.gen_random_bytes(32),'hex');
 insert into app.sessions(token_hash,student_id) values(app.hash(tok),st.id);
 return jsonb_build_object('token',tok,'student',
   jsonb_build_object('id',st.id,'label',st.label,'name',st.name,'email',st.email));
end $fn$;

create or replace function public.pilot_me(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare st app.students;
begin
 select * into st from app.students where id=app.student_for(p_token);
 if not found or not (
   exists(select 1 from app.external_paid_enrollments e
          where e.student_id=st.id and e.revoked_at is null)
   or exists(select 1 from app.learning_requests r
             where r.student_id=st.id and r.payment_status='verified'
               and r.status<>'cancelled')
 ) then
   raise exception 'not_authorized' using errcode='28000';
 end if;
 return jsonb_build_object('id',st.id,'label',st.label,'name',st.name,'email',st.email);
end $fn$;
