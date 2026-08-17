revoke update (has_paid, selected_plan) on public.evera_profiles from authenticated;

create or replace function public.protect_evera_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    if tg_op = 'INSERT' then
      new.has_paid := false;
      new.selected_plan := null;
    elsif new.has_paid is distinct from old.has_paid or new.selected_plan is distinct from old.selected_plan then
      raise exception 'Evera entitlement can only be changed after server-side payment verification';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_evera_entitlement_trigger on public.evera_profiles;
create trigger protect_evera_entitlement_trigger
before insert or update on public.evera_profiles
for each row execute function public.protect_evera_entitlement();

create table if not exists public.evera_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  result_id text,
  selected_plan text not null,
  payment_status text not null check (payment_status in ('paid', 'unpaid', 'refunded')),
  quiz_answers jsonb not null default '{}'::jsonb,
  primary_focus text not null,
  secondary_focuses jsonb not null default '[]'::jsonb,
  purchased_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.evera_purchases enable row level security;

do $$ begin
  create policy "Users can read their Evera purchases"
    on public.evera_purchases for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

revoke insert, update, delete on public.evera_purchases from authenticated;
