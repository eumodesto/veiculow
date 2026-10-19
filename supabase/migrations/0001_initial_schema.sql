create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'seller' check (role in ('owner', 'manager', 'seller', 'editor')),
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.store_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  name text not null,
  logo_url text,
  facade_url text,
  phone text,
  whatsapp text,
  address text,
  city text,
  state text,
  opening_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  make text not null,
  model text not null,
  version text,
  stock_code text,
  price numeric(12, 2),
  manufacturing_year integer,
  model_year integer,
  mileage integer,
  transmission text,
  fuel text,
  body_type text,
  color text,
  description text,
  status text not null default 'draft' check (status in ('draft', 'review', 'available', 'reserved', 'sold', 'archived')),
  is_published boolean not null default false,
  primary_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists vehicles_public_index on public.vehicles (is_published, status, created_at desc);
create index if not exists vehicles_company_index on public.vehicles (company_id, status);
create index if not exists vehicle_images_vehicle_index on public.vehicle_images (vehicle_id, sort_order);

alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.store_profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;

create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.company_members
    where company_id = target_company_id and user_id = auth.uid()
  );
$$;

create policy "public can view published vehicles" on public.vehicles
  for select using (is_published = true and status = 'available');

create policy "members can manage vehicles" on public.vehicles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "public can view published vehicle images" on public.vehicle_images
  for select using (exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and vehicles.is_published = true
      and vehicles.status = 'available'
  ));

create policy "members can manage vehicle images" on public.vehicle_images
  for all using (exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and public.is_company_member(vehicles.company_id)
  ));

create policy "public can view store profile" on public.store_profiles
  for select using (true);

create policy "members can manage store profile" on public.store_profiles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

grant select on public.vehicles, public.vehicle_images, public.store_profiles to anon, authenticated;
grant all on public.companies, public.company_members to authenticated;

