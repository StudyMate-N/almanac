-- Arbitrary-subject interactive content packs for paid learning orders.
-- The file library is retained separately for narrated videos, slides and downloads.
create table if not exists app.learning_course_packs(
 order_id uuid primary key references app.learning_requests(id) on delete cascade,
 content jsonb not null,
 published boolean not null default false,
 version int not null default 1,
 updated_at timestamptz not null default now(),
 published_at timestamptz,
 updated_by text
);
create table if not exists app.learning_course_progress(
 order_id uuid not null references app.learning_requests(id) on delete cascade,
 student_id uuid not null references app.students(id) on delete cascade,
 answers jsonb not null default '{}'::jsonb,
 cards jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 primary key(order_id,student_id)
);
alter table app.learning_course_packs enable row level security;
alter table app.learning_course_progress enable row level security;
revoke all on app.learning_course_packs from public,anon,authenticated;
revoke all on app.learning_course_progress from public,anon,authenticated;

create or replace function public.learning_staff_pack_get(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_course_packs;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_course_packs where order_id=p_order;
 if not found then return jsonb_build_object('content',null,'published',false);end if;
 return jsonb_build_object('content',r.content,'published',r.published,'version',r.version,'updatedAt',r.updated_at);
end $fn$;

create or replace function public.learning_staff_pack_set(p_token text,p_order uuid,p_content jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;v_staff text;r app.learning_requests;mods jsonb;sims jsonb;m jsonb;q jsonb;card jsonb;sim jsonb;
begin
 select a.role,a.label into v_role,v_staff from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order;
 if not found or r.payment_status<>'verified' or r.status='cancelled' then
 raise exception 'order_not_ready' using errcode='22023';end if;
 if jsonb_typeof(p_content) is distinct from 'object'
 or coalesce((p_content->>'version')::text,'')<>'1' or pg_column_size(p_content)>1500000
 then raise exception 'invalid_content' using errcode='22023';end if;
 mods:=p_content->'modules';sims:=coalesce(p_content->'simulations','[]'::jsonb);
 if jsonb_typeof(mods) is distinct from 'array'
 or jsonb_array_length(mods)<>r.unit_count or jsonb_typeof(sims) is distinct from 'array'
 or jsonb_array_length(sims)>4 then
 raise exception 'invalid_modules' using errcode='22023';end if;
 for m in select value from jsonb_array_elements(mods) loop
  if jsonb_typeof(m) is distinct from 'object' or length(coalesce(m->>'title','')) not between 3 and 140
   or length(coalesce(m->>'lesson',''))>25000
   or jsonb_typeof(m->'practice') is distinct from 'array'
   or jsonb_typeof(m->'flashcards') is distinct from 'array'
   or jsonb_typeof(coalesce(m->'objectives','[]'::jsonb)) is distinct from 'array'
   or jsonb_array_length(m->'practice')>50 or jsonb_array_length(m->'flashcards')>50
   or jsonb_array_length(coalesce(m->'objectives','[]'::jsonb))>20 then
   raise exception 'invalid_module_content' using errcode='22023';end if;
  for q in select value from jsonb_array_elements(m->'practice') loop
   if jsonb_typeof(q) is distinct from 'object' or length(coalesce(q->>'stem','')) not between 8 and 1000
    or length(coalesce(q->>'explanation','')) not between 8 and 2500
    or jsonb_typeof(q->'options') is distinct from 'array'
    or jsonb_array_length(q->'options')<>4 or (q->>'correctIndex') !~ '^[0-3]$'
   then raise exception 'invalid_question' using errcode='22023';end if;
  end loop;
  for card in select value from jsonb_array_elements(m->'flashcards') loop
   if jsonb_typeof(card) is distinct from 'object'
    or length(coalesce(card->>'front','')) not between 3 and 500
    or length(coalesce(card->>'back','')) not between 3 and 1000
   then raise exception 'invalid_flashcard' using errcode='22023';end if;
  end loop;
 end loop;
 for sim in select value from jsonb_array_elements(sims) loop
  if jsonb_typeof(sim) is distinct from 'object'
   or jsonb_typeof(sim->'questions') is distinct from 'array'
   or jsonb_array_length(sim->'questions')>150
   or length(coalesce(sim->>'title','')) not between 3 and 140
   then raise exception 'invalid_simulation' using errcode='22023';end if;
  for q in select value from jsonb_array_elements(sim->'questions') loop
   if jsonb_typeof(q) is distinct from 'object' or length(coalesce(q->>'stem','')) not between 8 and 1000
    or length(coalesce(q->>'explanation','')) not between 8 and 2500
    or jsonb_typeof(q->'options') is distinct from 'array'
    or jsonb_array_length(q->'options')<>4 or (q->>'correctIndex') !~ '^[0-3]$'
   then raise exception 'invalid_question' using errcode='22023';end if;
  end loop;
 end loop;
 insert into app.learning_course_packs(order_id,content,published,version,updated_at,updated_by)
 values(p_order,p_content,false,1,now(),v_staff)
 on conflict(order_id) do update set content=excluded.content,published=false,
 version=app.learning_course_packs.version+1,updated_at=now(),published_at=null,updated_by=v_staff;
 return jsonb_build_object('saved',true,'published',false,'modules',jsonb_array_length(mods));
end $fn$;

create or replace function public.learning_staff_pack_publish(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;r app.learning_requests;pack app.learning_course_packs;m jsonb;sim jsonb;
 v_min int;v_exams int;v_exam_min int;v_topics int:=0;v_cards int:=0;v_deep int;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role not in ('owner','coach') or v_role is null then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_requests where id=p_order;
 select * into pack from app.learning_course_packs where order_id=p_order for update;
 if not found or r.payment_status<>'verified' or r.production_started_at is null
 then raise exception 'pack_not_ready' using errcode='22023';end if;
 v_min:=case r.kind when 'resource' then 15 when 'exam' then 10 else 15 end;
 for m in select value from jsonb_array_elements(pack.content->'modules') loop
  if length(trim(coalesce(m->>'lesson','')))<150
   or jsonb_array_length(m->'practice')<v_min
   or jsonb_array_length(m->'flashcards')<v_min
  then raise exception 'incomplete_module_content' using errcode='22023';end if;
  v_topics:=v_topics+jsonb_array_length(m->'practice');
  v_cards:=v_cards+jsonb_array_length(m->'flashcards');
 end loop;
 v_exams:=case r.kind when 'resource' then 0 else 1+coalesce((r.enhancements->>'exam_sim')::int,0) end;
 v_exam_min:=case r.kind when 'course' then 80 else 50 end;
 if jsonb_array_length(coalesce(pack.content->'simulations','[]'::jsonb))<v_exams
 then raise exception 'incomplete_exam_simulation' using errcode='22023';end if;
 if v_exams>0 then
  for sim in select value from jsonb_array_elements(pack.content->'simulations') loop
   if jsonb_array_length(sim->'questions')<v_exam_min then
    raise exception 'incomplete_exam_simulation' using errcode='22023';end if;
   v_exam_min:=50;
  end loop;
 end if;
 update app.learning_course_packs set published=true,published_at=now(),updated_at=now()
 where order_id=p_order;
 return jsonb_build_object('published',true,'practiceQuestions',v_topics,'flashcards',v_cards);
end $fn$;

create or replace function public.learning_student_pack_get(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;pack app.learning_course_packs;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order
 and student_id=v_student and payment_status='verified' and status<>'cancelled') then
 raise exception 'not_authorized' using errcode='28000';end if;
 select * into pack from app.learning_course_packs where order_id=p_order and published;
 if not found then return jsonb_build_object('published',false,'content',null);end if;
 return jsonb_build_object('published',true,'content',pack.content,'updatedAt',pack.updated_at);
end $fn$;

create or replace function public.learning_student_progress_get(p_token text,p_order uuid)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;r app.learning_course_progress;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order
 and student_id=v_student and payment_status='verified' and status<>'cancelled')
 then raise exception 'not_authorized' using errcode='28000';end if;
 select * into r from app.learning_course_progress where order_id=p_order and student_id=v_student;
 if not found then return jsonb_build_object('answers','{}'::jsonb,'cards','{}'::jsonb);end if;
 return jsonb_build_object('answers',r.answers,'cards',r.cards,'updatedAt',r.updated_at);
end $fn$;

create or replace function public.learning_student_answer(
 p_token text,p_order uuid,p_kind text,p_module int,p_question int,p_selected int
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;pack app.learning_course_packs;v_q jsonb;v_key text;
 v_correct int;v_accuracy boolean;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order
 and student_id=v_student and payment_status='verified' and status<>'cancelled')
 then raise exception 'not_authorized' using errcode='28000';end if;
 if p_selected not between 0 and 3 or p_question not between 0 and 149
 or p_module not between 0 and 12 or p_kind not in ('practice','simulation')
 then raise exception 'invalid_answer' using errcode='22023';end if;
 select * into pack from app.learning_course_packs where order_id=p_order and published;
 if not found then raise exception 'content_not_ready' using errcode='22023';end if;
 if p_kind='practice' then
  v_q:=pack.content->'modules'->p_module->'practice'->p_question;
 else
  v_q:=pack.content->'simulations'->p_module->'questions'->p_question;
 end if;
 if v_q is null then raise exception 'question_not_found' using errcode='22023';end if;
 v_correct:=(v_q->>'correctIndex')::int;
 v_accuracy:=v_correct=p_selected;
 v_key:=case p_kind when 'practice' then 'p' else 's' end ||p_module||':'||p_question;
 insert into app.learning_course_progress(order_id,student_id,answers)
 values(p_order,v_student,jsonb_build_object(v_key,jsonb_build_object('selected',p_selected,
 'correct',v_accuracy,'answeredAt',now())))
 on conflict(order_id,student_id) do update set
 answers=coalesce(app.learning_course_progress.answers,'{}'::jsonb)||
 excluded.answers,updated_at=now();
 return jsonb_build_object('correct',v_accuracy,'correctIndex',v_correct,
 'explanation',v_q->>'explanation');
end $fn$;

create or replace function public.learning_student_card_mark(
 p_token text,p_order uuid,p_module int,p_card int,p_known boolean
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_student uuid;pack app.learning_course_packs;v_key text;
begin
 v_student:=app.student_for(p_token);
 if not exists(select 1 from app.learning_requests where id=p_order
 and student_id=v_student and payment_status='verified' and status<>'cancelled')
 then raise exception 'not_authorized' using errcode='28000';end if;
 if p_module not between 0 and 11 or p_card not between 0 and 49
 then raise exception 'invalid_card' using errcode='22023';end if;
 select * into pack from app.learning_course_packs where order_id=p_order and published;
 if not found or pack.content->'modules'->p_module->'flashcards'->p_card is null then
 raise exception 'card_not_found' using errcode='22023';end if;
 v_key:='m'||p_module||':'||p_card;
 insert into app.learning_course_progress(order_id,student_id,cards)
 values(p_order,v_student,jsonb_build_object(v_key,jsonb_build_object('known',p_known,'reviewedAt',now())))
 on conflict(order_id,student_id) do update set
 cards=coalesce(app.learning_course_progress.cards,'{}'::jsonb)||excluded.cards,updated_at=now();
 return jsonb_build_object('saved',true);
end $fn$;

revoke all on function public.learning_staff_pack_get(text,uuid) from public;
revoke all on function public.learning_staff_pack_set(text,uuid,jsonb) from public;
revoke all on function public.learning_staff_pack_publish(text,uuid) from public;
revoke all on function public.learning_student_pack_get(text,uuid) from public;
revoke all on function public.learning_student_progress_get(text,uuid) from public;
revoke all on function public.learning_student_answer(text,uuid,text,int,int,int) from public;
revoke all on function public.learning_student_card_mark(text,uuid,int,int,boolean) from public;
grant execute on function public.learning_staff_pack_get(text,uuid) to anon,authenticated;
grant execute on function public.learning_staff_pack_set(text,uuid,jsonb) to anon,authenticated;
grant execute on function public.learning_staff_pack_publish(text,uuid) to anon,authenticated;
grant execute on function public.learning_student_pack_get(text,uuid) to anon,authenticated;
grant execute on function public.learning_student_progress_get(text,uuid) to anon,authenticated;
grant execute on function public.learning_student_answer(text,uuid,text,int,int,int) to anon,authenticated;
grant execute on function public.learning_student_card_mark(text,uuid,int,int,boolean) to anon,authenticated;
