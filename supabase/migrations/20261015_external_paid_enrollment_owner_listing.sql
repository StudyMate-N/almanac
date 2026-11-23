create or replace function public.learning_external_paid_list(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_role text;
begin
 select a.role into v_role from app.admin_sessions s join app.admins a on a.id=s.admin_id
 where s.token_hash=app.hash(p_token) and s.expires_at>now();
 if v_role is null or v_role not in ('owner','coach') then
  raise exception 'not_authorized' using errcode='28000';
 end if;
 return coalesce((select jsonb_agg(jsonb_build_object(
    'name',s.name,'email',s.email,'courseId',e.course_id,'verifiedExternallyAt',e.verified_externally_at,
    'active',e.revoked_at is null,'recordedBy',e.recorded_by
  ) order by e.verified_externally_at desc)
  from app.external_paid_enrollments e join app.students s on s.id=e.student_id),'[]'::jsonb);
end $fn$;
revoke all on function public.learning_external_paid_list(text) from public;
grant execute on function public.learning_external_paid_list(text) to anon,authenticated;