alter table letter_subscribers
  add column if not exists unsub_token text unique;
update letter_subscribers
  set unsub_token = md5(random()::text || id)
  where unsub_token is null;
