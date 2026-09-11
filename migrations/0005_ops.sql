-- Site ops: admin, SMTP, email verification, payments.
-- Never store secrets in .env; operators enter them in /admin.

create table if not exists site_admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists email_verifications (
  id text primary key,
  user_id text not null,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verifications_user_idx on email_verifications (user_id);
create index if not exists email_verifications_token_idx on email_verifications (token);

create table if not exists payment_providers (
  id text primary key,
  type text not null,
  name text not null,
  enabled boolean not null default true,
  credentials jsonb not null default '{}'::jsonb,
  extra jsonb not null default '{}'::jsonb,
  min_amount numeric,
  max_amount numeric,
  daily_limit numeric,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists payment_providers_type_idx on payment_providers (type);

create table if not exists payment_orders (
  id text primary key,
  user_id text not null,
  provider_id text,
  provider_type text not null,
  method text not null,
  out_trade_no text not null unique,
  trade_no text,
  amount numeric not null,
  currency text not null default 'CNY',
  product text not null default 'field-pass',
  status text not null default 'PENDING',
  pay_url text,
  qr_code text,
  url_scheme text,
  raw jsonb,
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payment_orders_user_idx on payment_orders (user_id);
create index if not exists payment_orders_status_idx on payment_orders (status);
create index if not exists payment_orders_out_trade_no_idx on payment_orders (out_trade_no);
