-- Níveis oficiais do sistema: dono, gerente e vendedor.
alter table public.company_members drop constraint if exists company_members_role_check;
alter table public.company_members add constraint company_members_role_check check (role in ('owner', 'manager', 'seller'));

create or replace function public.current_company_role(target_company_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.company_members
  where company_id = target_company_id and user_id = auth.uid()
  limit 1;
$$;

create or replace function public.has_company_role(target_company_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_company_role(target_company_id) = any(allowed_roles), false);
$$;

drop policy if exists "members can manage vehicles" on public.vehicles;
create policy "owners and managers can manage vehicles" on public.vehicles
  for all using (public.has_company_role(company_id, array['owner', 'manager']))
  with check (public.has_company_role(company_id, array['owner', 'manager']));
create policy "sellers can manage own vehicles" on public.vehicles
  for all using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

drop policy if exists "members can manage vehicle images" on public.vehicle_images;
create policy "owners and managers can manage vehicle images" on public.vehicle_images
  for all using (exists (select 1 from public.vehicles v where v.id = vehicle_id and public.has_company_role(v.company_id, array['owner', 'manager'])))
  with check (exists (select 1 from public.vehicles v where v.id = vehicle_id and public.has_company_role(v.company_id, array['owner', 'manager'])));
create policy "sellers can manage own vehicle images" on public.vehicle_images
  for all using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.seller_id = auth.uid()))
  with check (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.seller_id = auth.uid()));

drop policy if exists "members can manage store profile" on public.store_profiles;
create policy "owners and managers can manage store profile" on public.store_profiles
  for all using (public.has_company_role(company_id, array['owner', 'manager']))
  with check (public.has_company_role(company_id, array['owner', 'manager']));

drop policy if exists "members can manage vehicle brands" on public.vehicle_brands;
create policy "owners and managers can manage vehicle brands" on public.vehicle_brands
  for all using (public.has_company_role(company_id, array['owner', 'manager']))
  with check (public.has_company_role(company_id, array['owner', 'manager']));

drop policy if exists "members can manage seller profiles" on public.seller_profiles;
create policy "owners and managers can manage seller profiles" on public.seller_profiles
  for all using (public.has_company_role(company_id, array['owner', 'manager']))
  with check (public.has_company_role(company_id, array['owner', 'manager']));

drop policy if exists "members can view company membership" on public.company_members;
drop policy if exists "owners can manage company membership" on public.company_members;
create policy "members can view company membership" on public.company_members
  for select using (public.current_company_role(company_id) is not null);
create policy "owners can manage company membership" on public.company_members
  for all using (public.has_company_role(company_id, array['owner']))
  with check (public.has_company_role(company_id, array['owner']));

grant execute on function public.current_company_role(uuid) to authenticated;
grant execute on function public.has_company_role(uuid, text[]) to authenticated;
