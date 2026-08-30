alter table public.dresses
add column if not exists additional_day_price numeric not null default 0;
