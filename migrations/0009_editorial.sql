create table if not exists dispatches (
  slug text primary key,
  date date not null,
  kicker jsonb not null default '{}'::jsonb,
  title jsonb not null default '{}'::jsonb,
  dek jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  tier text not null default 'letter-free',
  updated_at timestamptz not null default now()
);

create table if not exists guide_chapter_edits (
  city_slug text not null,
  chapter text not null,
  locale text not null default 'en',
  markdown text not null default '',
  updated_at timestamptz not null default now(),
  primary key (city_slug, chapter, locale)
);
