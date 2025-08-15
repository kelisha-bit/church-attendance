-- Church Attendance App - Supabase/Postgres Schema
-- Run this in the Supabase SQL Editor.

-- 1) Extensions (UUID)
create extension if not exists "uuid-ossp";

-- 2) Enums
do $$ begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'user_role' and n.nspname = 'public'
  ) then
    create type public.user_role as enum ('Admin', 'Pastor', 'Member');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'member_status' and n.nspname = 'public'
  ) then
    create type public.member_status as enum ('Active', 'Inactive');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'recurring_frequency' and n.nspname = 'public'
  ) then
    create type public.recurring_frequency as enum ('none', 'weekly', 'monthly', 'yearly');
  end if;
end $$;

-- 3) Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role user_role not null default 'Member',
  created_at timestamptz not null default now()
);

-- 4) Members
create table if not exists public.members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  address text,
  department text not null,
  date_of_birth date,
  join_date date not null default (current_date),
  status member_status not null default 'Active',
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4a) Update trigger for updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_members_set_updated_at on public.members;
create trigger trg_members_set_updated_at
before update on public.members
for each row execute function public.set_updated_at();

-- Indexes for members
create index if not exists idx_members_name on public.members (name);
create index if not exists idx_members_status on public.members (status);
create index if not exists idx_members_department on public.members (department);

-- 5) Attendance Records
create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references public.members(id) on delete cascade,
  service_date date not null,
  service_type text not null,
  present boolean not null default false,
  check_in_time time,
  created_at timestamptz not null default now()
);

-- Indexes for attendance
create index if not exists idx_attendance_member on public.attendance_records (member_id);
create index if not exists idx_attendance_date_type on public.attendance_records (service_date, service_type);
create index if not exists idx_attendance_present on public.attendance_records (present);

-- 6) Donations
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references public.members(id) on delete set null,
  donor_name text not null,
  donor_phone text,
  donor_email text,
  amount numeric(10,2) not null check (amount > 0),
  donation_type text not null,
  payment_method text not null,
  donation_date date not null,
  notes text,
  receipt_number text not null unique,
  created_at timestamptz not null default now()
);

-- Indexes for donations
create index if not exists idx_donations_member on public.donations (member_id);
create index if not exists idx_donations_date on public.donations (donation_date);
create index if not exists idx_donations_type on public.donations (donation_type);
create index if not exists idx_donations_receipt on public.donations (receipt_number);

-- 7) Events
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_date date not null,
  event_time text not null,
  location text,
  recurring_frequency recurring_frequency not null default 'none',
  notification_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes for events
create index if not exists idx_events_date on public.events (event_date);
create index if not exists idx_events_created on public.events (created_at);

-- 8) Visitors
create table if not exists public.visitors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  address text,
  visit_date date not null,
  visit_time text not null,
  service text not null,
  first_time boolean not null default true,
  follow_up_needed boolean not null default false,
  notes text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Indexes for visitors
create index if not exists idx_visitors_created on public.visitors (created_at desc);
create index if not exists idx_visitors_service on public.visitors (service);

-- 9) Row Level Security (RLS) and policies
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.attendance_records enable row level security;
alter table public.donations enable row level security;
alter table public.events enable row level security;
alter table public.visitors enable row level security;

-- Basic policies: allow authenticated users full access; block anon
-- You can tighten these later as needed.

  -- profiles: users can read all, modify own row
  -- Restrict members to only their own profile; Admin/Pastor can view all
  drop policy if exists profiles_select_auth on public.profiles;
  drop policy if exists profiles_select_member_self on public.profiles;
  drop policy if exists profiles_select_admin_pastor_all on public.profiles;
  
  create policy profiles_select_member_self on public.profiles
  for select to authenticated
  using (
    role = 'Member' and id = auth.uid()
  );
  
  create policy profiles_select_admin_pastor_all on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('Admin','Pastor')
    )
  );

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert to authenticated with check (auth.uid() = id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- members
drop policy if exists members_all_auth on public.members;
create policy members_all_auth on public.members
for all to authenticated using (true) with check (true);

-- attendance_records
drop policy if exists attendance_all_auth on public.attendance_records;
create policy attendance_all_auth on public.attendance_records
for all to authenticated using (true) with check (true);

-- donations
drop policy if exists donations_all_auth on public.donations;
create policy donations_all_auth on public.donations
for all to authenticated using (true) with check (true);

-- events
drop policy if exists events_all_auth on public.events;
create policy events_all_auth on public.events
for all to authenticated using (true) with check (true);

-- visitors
drop policy if exists visitors_all_auth on public.visitors;
create policy visitors_all_auth on public.visitors
for all to authenticated using (true) with check (true);

-- 10) Helpful views (optional)
-- Recent activity view for dashboard could be built in queries; keeping schema minimal.

-- 11) Seed helper comment
-- After running this schema, run supabase/seed.sql to populate sample data.
