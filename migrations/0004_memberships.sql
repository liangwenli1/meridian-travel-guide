create table if not exists memberships (
  user_id text primary key,
  plan text not null default 'field-pass',
  status text not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists memberships_status_idx on memberships (status);
