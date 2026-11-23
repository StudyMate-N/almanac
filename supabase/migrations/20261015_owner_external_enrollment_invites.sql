-- New Owner-only API for approved enrollment outside public checkout.
-- No changes to invoice, payment, existing credentials, or historical enrollments.
create or replace function public.learning_external_paid_invite(
 p_token text,p_name text,p_email text,p_course text,p_source_note text
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare
 admin_row app.admins;
 learner app.students;
 clean_name text:=trim(coalesce(p_name,''));
 clean_email text:=lower(trim(coalesce(p_email,'')));
 note text:=trim(coalesce(p_source_note,''));
 found_existing boolean;
 matches int;
 invite_code text;
begin
 select a.* into admin_row from app.admin_sessions sess join app.admins a on a.id=sess.admin_id
 where sess.token_hash=app.hash(p_token) and sess.expires_at>now() and a.role='owner';
 if not found then raise exception 'owner_required' using errcode='28000';end if;
 if length(clean_name) not between 2 and 80 then raise exception 'invalid_name';end if;
 if length(clean_email)>160 or clean_email !~ '^[a-z0-9._%+\-]+@[a-z0-9.\-]+[.][a-z]{2,}$'
 then raise exception 'invalid_email';end if;
 if p_course not in ('advanced-pharmacology','advanced-pathophysiology')
 then raise exception 'invalid_course';end if;
 if length(note) not between 12 and 500 then raise exception 'source_note_required';end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(clean_email));
 select count(*) into matches from app.students where lower(email)=clean_email;
 if matches>1 then raise exception 'ambiguous_existing_student';end if;
 select * into learner from app.students where lower(email)=clean_email for update;
 found_existing:=found;
 if found_existing and learner.disabled then raise exception 'account_disabled';end if;
 if found_existing then
   if exists(select 1 from app.external_paid_enrollments e
     where e.student_id=learner.id and e.course_id=p_course and e.revoked_at is null)
   then return jsonb_build_object('status','already_enrolled','name',coalesce(learner.name,clean_name),
    'email',clean_email,'courseId',p_course,'accessCode',null);end if;
 else
   invite_code:='ALM-'||upper(encode(extensions.gen_random_bytes(12),'hex'));
   insert into app.students(label,name,email,code_hash)
   values(clean_name,clean_name,clean_email,app.hash(app.norm_code(invite_code)))
   returning * into learner;
 end if;
 insert into app.external_paid_enrollments(
   student_id,course_id,verified_externally_at,recorded_by,source_note,revoked_at)
 values(learner.id,p_course,now(),left(admin_row.label,120),note,null)
 on conflict(student_id,course_id) do update set
   verified_externally_at=excluded.verified_externally_at,
   recorded_by=excluded.recorded_by,source_note=excluded.source_note,revoked_at=null;
 return jsonb_build_object('status',case when found_existing then 'existing_account' else 'created' end,
 'name',clean_name,'email',clean_email,'courseId',p_course,'accessCode',invite_code);
end $fn$;
revoke all on function public.learning_external_paid_invite(text,text,text,text,text) from public;
grant execute on function public.learning_external_paid_invite(text,text,text,text,text) to anon,authenticated;
