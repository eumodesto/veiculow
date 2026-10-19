-- Vendedor responsável pelo anúncio e WhatsApp usado na negociação/comissão.

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

create index if not exists seller_profiles_company_index on public.seller_profiles (company_id, is_active);
create index if not exists vehicles_seller_index on public.vehicles (seller_id, created_at desc);

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

alter table public.seller_profiles enable row level security;

drop policy if exists "members can manage seller profiles" on public.seller_profiles;
drop policy if exists "sellers can view own profile" on public.seller_profiles;
drop policy if exists "sellers can update own profile" on public.seller_profiles;

create policy "members can manage seller profiles" on public.seller_profiles
  for all using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id));

create policy "sellers can view own profile" on public.seller_profiles
  for select using (user_id = auth.uid());

create policy "sellers can update own profile" on public.seller_profiles
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select on public.seller_profiles to authenticated;
grant insert, update, delete on public.seller_profiles to authenticated;
