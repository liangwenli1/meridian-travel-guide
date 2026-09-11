create table if not exists letter_subscribers (
  id text primary key,
  email text not null unique,
  locale text not null default 'en',
  city_slug text,
  source text not null default 'letter-form',
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index if not exists letter_subscribers_created_idx on letter_subscribers (created_at desc);
