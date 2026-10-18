-- HomeFix starter schema for Supabase/Postgres.
create extension if not exists pgcrypto;

create type public.app_role as enum ('customer','worker','admin');
create type public.worker_status as enum ('pending','verified','rejected','suspended');
create type public.booking_status as enum ('requested','accepted','in_progress','completed','cancelled','disputed');
create type public.payment_status as enum ('unpaid','pending','paid','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  active boolean not null default true
);

create table public.workers (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text not null default '',
  service_area text not null default '',
  city text not null default '',
  state text not null default '',
  postal_code text,
  latitude double precision,
  longitude double precision,
  status public.worker_status not null default 'pending',
  hourly_rate_paise integer check (hourly_rate_paise is null or hourly_rate_paise >= 0),
  available boolean not null default true,
  average_rating numeric(3,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.worker_services (
  worker_id uuid not null references public.workers(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key(worker_id, service_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  worker_id uuid references public.workers(id),
  service_id uuid not null references public.services(id),
  status public.booking_status not null default 'requested',
  address text not null,
  city text not null,
  postal_code text,
  scheduled_at timestamptz not null,
  customer_notes text not null default '',
  quoted_amount_paise integer check (quoted_amount_paise is null or quoted_amount_paise >= 0),
  platform_fee_paise integer not null default 0 check (platform_fee_paise >= 0),
  payment_status public.payment_status not null default 'unpaid',
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  worker_id uuid not null references public.workers(id),
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

insert into public.services(name, description) values
 ('Plumber','Leaks, taps, pipes and bathroom repairs'),
 ('Electrician','Wiring, switches, fans and fittings'),
 ('Home Worker','Cleaning and everyday home help'),
 ('Carpenter','Furniture repair and woodwork'),
 ('AC Service','Installation, repair and maintenance'),
 ('Painter','Interior and exterior painting')
on conflict (name) do nothing;

-- SECURITY TODO before production:
-- Enable RLS on all tables and add policies after defining the verified role flow.
-- Do not let users self-assign the admin role. Set admin roles only server-side.
-- Use PostGIS for robust distance searches; validate worker coordinates server-side.
