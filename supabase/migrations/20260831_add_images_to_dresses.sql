alter table public.dresses
add column if not exists images text[] not null default '{}';

update public.dresses
set images = array_remove(array[image], null)
where images is null or cardinality(images) = 0;
