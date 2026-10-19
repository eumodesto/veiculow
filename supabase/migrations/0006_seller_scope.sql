-- Vendedores só podem consultar o próprio vínculo e os próprios dados.
drop policy if exists "members can view company membership" on public.company_members;
create policy "owners and managers can view company membership" on public.company_members
  for select using (public.has_company_role(company_id, array['owner', 'manager']));
create policy "users can view own membership" on public.company_members
  for select using (user_id = auth.uid());

-- As políticas de seller_profiles criadas em 0003 já limitam vendedor ao próprio user_id.
-- Esta política explícita mantém a regra documentada para instalações antigas.
drop policy if exists "sellers can view own profile" on public.seller_profiles;
drop policy if exists "sellers can update own profile" on public.seller_profiles;
create policy "sellers can view own profile" on public.seller_profiles
  for select using (user_id = auth.uid());
create policy "sellers can update own profile" on public.seller_profiles
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());
