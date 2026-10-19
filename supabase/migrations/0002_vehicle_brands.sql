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

alter table public.vehicle_brands enable row level security;

create policy "public can view active vehicle brands" on public.vehicle_brands
  for select using (is_active = true);

create policy "members can manage vehicle brands" on public.vehicle_brands
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

grant select on public.vehicle_brands to anon, authenticated;
grant all on public.vehicle_brands to authenticated;
