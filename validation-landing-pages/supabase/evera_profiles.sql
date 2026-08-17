create table if not exists public.evera_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  quiz_answers jsonb not null default '{}'::jsonb,
  primary_focus text not null,
  has_paid boolean not null default false,
  selected_plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.evera_profiles enable row level security;

create policy "Users can read their Evera profile"
  on public.evera_profiles for select
  using (auth.uid() = id);

create policy "Users can create their Evera profile"
  on public.evera_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their Evera profile"
  on public.evera_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
