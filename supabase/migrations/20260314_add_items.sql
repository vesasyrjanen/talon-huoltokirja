create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  name text not null,
  category text,
  brand text,
  model text,
  serial_number text,
  location text,
  purchase_date date,
  purchase_price numeric(12,2),
  notes text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_house_id
  on public.items(house_id);

create index if not exists idx_items_house_id_archived
  on public.items(house_id, archived);

alter table public.items enable row level security;

drop policy if exists "house members can view items" on public.items;
drop policy if exists "house members can create items" on public.items;
drop policy if exists "house members can update items" on public.items;
drop policy if exists "house members can delete items" on public.items;

create policy "house members can view items"
on public.items
for select
using (public.is_house_member(house_id));

create policy "house members can create items"
on public.items
for insert
with check (public.is_house_member(house_id));

create policy "house members can update items"
on public.items
for update
using (public.is_house_member(house_id))
with check (public.is_house_member(house_id));

create policy "house members can delete items"
on public.items
for delete
using (public.is_house_member(house_id));
