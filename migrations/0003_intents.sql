create table if not exists intents (
  id serial primary key,
  kind text not null,
  city_slug text,
  created_at timestamptz not null default now()
);

create index if not exists intents_kind_idx on intents (kind, created_at desc);
