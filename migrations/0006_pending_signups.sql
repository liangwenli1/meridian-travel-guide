create table if not exists pending_signups (
  id text primary key,
  email text not null unique,
  name text not null,
  password text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists pending_signups_token_idx on pending_signups (token);
