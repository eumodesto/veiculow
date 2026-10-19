-- Complementa o cadastro do veículo com a localização informada no anúncio.
alter table public.vehicles add column if not exists city text;
alter table public.vehicles add column if not exists state text;
