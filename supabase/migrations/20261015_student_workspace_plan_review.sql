-- Allows a paid learner to view and respond to their own plan using an expiring session.\nCREATE OR REPLACE FUNCTION public.learning_student_plan_get(p_student_token text, p_order uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare r app.learning_requests; v_student uuid;
begin
  v_student := app.student_for(p_student_token);
  select * into r from app.learning_requests
  where id = p_order and student_id = v_student
    and payment_status='verified' and status <> 'cancelled';
  if not found then raise exception 'not_authorized' using errcode='28000'; end if;
  if r.learning_plan_status is null then
    raise exception 'plan_not_ready' using errcode='22023';
  end if;
  return jsonb_build_object(
    'orderId',r.id,'invoiceRef',r.invoice_ref,'subject',r.subject,
    'status',r.learning_plan_status,'title',r.learning_plan_title,
    'summary',r.learning_plan_summary,
    'topics',coalesce(r.learning_plan_topics,'{}'::text[]),
    'objectives',coalesce(r.learning_plan_objectives,'{}'::text[]),
    'dates',coalesce(r.learning_plan_dates,'{}'::text[]),
    'feedback',r.learning_plan_feedback
  );
end $function$
\nrevoke all on function public.learning_student_plan_get(text,uuid) from public;\ngrant execute on function public.learning_student_plan_get(text,uuid) to anon,authenticated;\n\nCREATE OR REPLACE FUNCTION public.learning_student_plan_respond(p_student_token text, p_order uuid, p_action text, p_feedback text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare r app.learning_requests; v_student uuid; v_status text;
begin
  v_student := app.student_for(p_student_token);
  select * into r from app.learning_requests
    where id=p_order and student_id=v_student
      and payment_status='verified' and status <> 'cancelled' for update;
  if not found then raise exception 'not_authorized' using errcode='28000'; end if;
  if r.learning_plan_status not in ('shared','revision_requested') then
    raise exception 'plan_not_ready' using errcode='22023';
  end if;
  if p_action not in ('confirm','request_revision') then
    raise exception 'invalid_action' using errcode='22023';
  end if;
  if p_action='request_revision'
     and length(trim(coalesce(p_feedback,''))) not between 8 and 1000 then
    raise exception 'invalid_feedback' using errcode='22023';
  end if;
  v_status := case when p_action='confirm' then 'confirmed' else 'revision_requested' end;
  update app.learning_requests set
    learning_plan_status=v_status,
    learning_plan_feedback=case when p_action='request_revision' then trim(p_feedback) else null end,
    learning_plan_confirmed_at=case when p_action='confirm' then now() else null end,
    updated_at=now()
  where id=p_order and student_id=v_student;
  return jsonb_build_object('status',v_status);
end $function$
\nrevoke all on function public.learning_student_plan_respond(text,uuid,text,text) from public;\ngrant execute on function public.learning_student_plan_respond(text,uuid,text,text) to anon,authenticated;\n\n