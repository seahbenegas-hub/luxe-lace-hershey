alter table public.dresses
add column if not exists featured boolean not null default false;
