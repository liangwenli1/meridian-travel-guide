-- Catalog, editorial guides, and anonymous search events (no user_id — auth is off).
create table if not exists countries (
  slug      text primary key,
  name      text not null,
  code      text not null,
  latitude  double precision not null,
  longitude double precision not null,
  priority  integer not null default 0
);

create table if not exists cities (
  id                 text primary key,
  name               text not null,
  slug               text not null,
  alternate_names    jsonb not null default '[]'::jsonb,
  country            text not null,
  country_slug       text not null references countries (slug),
  country_code       text not null,
  region             text not null,
  latitude           double precision not null,
  longitude          double precision not null,
  population         integer not null default 0,
  tourism_priority   integer not null default 0,
  capital            boolean not null default false,
  timezone           text not null,
  currency           text not null,
  currency_code      text not null,
  languages          jsonb not null default '[]'::jsonb,
  airport_codes      jsonb not null default '[]'::jsonb,
  short_description  text not null default '',
  content_status     text not null default 'coming-soon',
  unique (country_slug, slug)
);

create index if not exists cities_country_slug_idx on cities (country_slug);
create index if not exists cities_status_idx on cities (content_status);
create index if not exists cities_priority_idx on cities (tourism_priority desc);

create table if not exists city_guides (
  city_slug  text primary key,
  payload    jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists search_events (
  id             serial primary key,
  query          text not null,
  result_city_id text,
  created_at     timestamptz not null default now()
);

create index if not exists search_events_created_idx on search_events (created_at desc);
