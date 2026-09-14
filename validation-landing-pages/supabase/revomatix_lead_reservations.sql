-- Minimal idempotency ledger only. Contact data stays in Google Sheets.
create table if not exists public.revomatix_lead_reservations (
 submission_id uuid primary key,
 payload_hash text not null,
 sheet_key text not null,
 row_number integer not null,
 created_at timestamptz not null default now(),
 unique(sheet_key,row_number)
);
alter table public.revomatix_lead_reservations enable row level security;
revoke all on public.revomatix_lead_reservations from anon, authenticated;
create or replace function public.reserve_revomatix_row(p_id uuid,p_hash text,p_sheet text,p_floor integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.revomatix_lead_reservations; next_row integer;
begin
 perform pg_advisory_xact_lock(hashtextextended('revomatix:' || p_sheet,0));
 select * into r from public.revomatix_lead_reservations where submission_id=p_id;
 if found then
  if r.payload_hash<>p_hash or r.sheet_key<>p_sheet then raise exception 'SUBMISSION_CONFLICT'; end if;
 else
  select greatest(coalesce(max(row_number)+1,2),p_floor) into next_row from public.revomatix_lead_reservations where sheet_key=p_sheet;
  insert into public.revomatix_lead_reservations(submission_id,payload_hash,sheet_key,row_number) values(p_id,p_hash,p_sheet,next_row) returning * into r;
 end if;
 return jsonb_build_object('row_number',r.row_number,'created_at',r.created_at);
end;
$$;
revoke all on function public.reserve_revomatix_row(uuid,text,text,integer) from public,anon,authenticated;
grant execute on function public.reserve_revomatix_row(uuid,text,text,integer) to service_role;
