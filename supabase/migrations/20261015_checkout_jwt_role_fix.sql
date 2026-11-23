-- PostgREST exposes JWT claims through auth.role() on current versions.
-- Keep the quote-lock function service-role-only; do not grant public access.
create or replace function public.learning_request_create_cad(
 p_data jsonb,p_rate numeric,p_rate_date date
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_result jsonb;v_usd int;v_cents bigint;v_id uuid;v_rate numeric;
begin
 if (select auth.role()) is distinct from 'service_role' then
   raise exception 'not_authorized' using errcode='28000';
 end if;
 if p_rate not between 0.5 and 3.0 or p_rate_date is null
   or p_rate_date>current_date or p_rate_date<current_date-10 then
   raise exception 'rate_unavailable' using errcode='22023';
 end if;
 v_rate:=round(p_rate,6);
 v_result:=public.learning_request_create(p_data);
 v_usd:=(v_result->>'quoteUsd')::int;
 v_cents:=round(v_usd*v_rate*100)::bigint;
 v_id:=(v_result->>'id')::uuid;
 update app.learning_requests set
   fx_cad_per_usd=v_rate,fx_rate_date=p_rate_date,
   payable_cad_cents=v_cents,fx_source='Bank of Canada'
 where id=v_id;
 return v_result||jsonb_build_object(
   'payableCadCents',v_cents,'rateCadPerUsd',v_rate,'rateDate',p_rate_date);
end $fn$;
revoke all on function public.learning_request_create_cad(jsonb,numeric,date) from public,anon,authenticated;
grant execute on function public.learning_request_create_cad(jsonb,numeric,date) to service_role;
