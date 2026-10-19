-- Veiculow / Ponto Auto Veículos
-- Execute este arquivo uma vez no Supabase SQL Editor.
-- Não contém senhas, tokens ou chaves privadas.

create extension if not exists "pgcrypto";

-- Organização principal do sistema
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

-- Inventário de veículos
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

-- Marcas administráveis. A marca só aparece no site quando possui veículo publicado.
create table if not exists public.vehicle_brands (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  slug text not null,
  logo_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, slug)
);

create table if not exists public.seller_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  whatsapp text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id)
);

alter table public.vehicles add column if not exists seller_id uuid references auth.users(id) on delete set null;
alter table public.vehicles add column if not exists seller_whatsapp text;

create index if not exists vehicles_public_index on public.vehicles (is_published, status, created_at desc);
create index if not exists vehicles_company_index on public.vehicles (company_id, status);
create index if not exists vehicle_images_vehicle_index on public.vehicle_images (vehicle_id, sort_order);
create index if not exists vehicle_brands_slug_index on public.vehicle_brands (slug, is_active);
create index if not exists seller_profiles_company_index on public.seller_profiles (company_id, is_active);
create index if not exists vehicles_seller_index on public.vehicles (seller_id, created_at desc);

-- Verifica se o usuário autenticado pertence à empresa.
create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where company_id = target_company_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.fill_vehicle_seller_whatsapp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.seller_id is not null and nullif(trim(new.seller_whatsapp), '') is null then
    select whatsapp into new.seller_whatsapp
    from public.seller_profiles
    where user_id = new.seller_id
      and company_id = new.company_id
      and is_active = true
    limit 1;
  end if;
  return new;
end;
$$;

drop trigger if exists fill_vehicle_seller_whatsapp on public.vehicles;
create trigger fill_vehicle_seller_whatsapp
  before insert or update of seller_id, seller_whatsapp, company_id on public.vehicles
  for each row execute function public.fill_vehicle_seller_whatsapp();

alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.store_profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.vehicle_brands enable row level security;

-- Recria as políticas com segurança para permitir executar este arquivo novamente.
drop policy if exists "public can view published vehicles" on public.vehicles;
drop policy if exists "members can manage vehicles" on public.vehicles;
drop policy if exists "public can view published vehicle images" on public.vehicle_images;
drop policy if exists "members can manage vehicle images" on public.vehicle_images;
drop policy if exists "public can view store profile" on public.store_profiles;
drop policy if exists "members can manage store profile" on public.store_profiles;
drop policy if exists "public can view active vehicle brands" on public.vehicle_brands;
drop policy if exists "members can manage vehicle brands" on public.vehicle_brands;
drop policy if exists "members can manage seller profiles" on public.seller_profiles;
drop policy if exists "sellers can view own profile" on public.seller_profiles;
drop policy if exists "sellers can update own profile" on public.seller_profiles;

create policy "public can view published vehicles" on public.vehicles
  for select using (is_published = true and status = 'available');

create policy "members can manage vehicles" on public.vehicles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "public can view published vehicle images" on public.vehicle_images
  for select using (exists (
    select 1
    from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and vehicles.is_published = true
      and vehicles.status = 'available'
  ));

create policy "members can manage vehicle images" on public.vehicle_images
  for all using (exists (
    select 1
    from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and public.is_company_member(vehicles.company_id)
  ));

create policy "public can view store profile" on public.store_profiles
  for select using (true);

create policy "members can manage store profile" on public.store_profiles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "public can view active vehicle brands" on public.vehicle_brands
  for select using (is_active = true);

create policy "members can manage vehicle brands" on public.vehicle_brands
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "members can manage seller profiles" on public.seller_profiles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "sellers can view own profile" on public.seller_profiles
  for select using (user_id = auth.uid());

create policy "sellers can update own profile" on public.seller_profiles
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select on public.vehicles, public.vehicle_images, public.store_profiles, public.vehicle_brands to anon, authenticated;
grant all on public.companies, public.company_members to authenticated;
grant all on public.store_profiles, public.vehicles, public.vehicle_images, public.vehicle_brands to authenticated;
grant select on public.seller_profiles to authenticated;
grant insert, update, delete on public.seller_profiles to authenticated;

-- Após criar um usuário em Authentication > Users, substitua os valores abaixo
-- e execute para criar a empresa e vincular o primeiro administrador.
--
-- insert into public.companies (name, slug)
-- values ('Ponto Auto Veículos', 'ponto-auto-veiculos')
-- on conflict (slug) do update set name = excluded.name
-- returning id;
--
-- insert into public.company_members (company_id, user_id, role)
-- values ('COLE-O-COMPANY-ID-AQUI', 'COLE-O-USER-ID-AQUI', 'owner')
-- on conflict (company_id, user_id) do update set role = 'owner';
