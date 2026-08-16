-- Support for syncing listings in from the Property Finder API on a
-- recurring schedule, without disturbing manually-entered properties.

-- ---------------------------------------------------------------------
-- Track where each property row came from
-- ---------------------------------------------------------------------
alter table public.properties
  add column source text not null default 'manual' check (source in ('manual', 'property_finder')),
  add column external_id text,
  add column external_url text,
  add column synced_at timestamptz;

-- One row per (source, external_id): lets the sync job upsert cleanly.
create unique index properties_source_external_id_idx
  on public.properties(source, external_id)
  where external_id is not null;

create index properties_source_idx on public.properties(source);

-- ---------------------------------------------------------------------
-- property_finder_settings — singleton row holding the integration's
-- credentials and last-run status. Admin-only, never exposed to anon.
-- ---------------------------------------------------------------------
create table public.property_finder_settings (
  id text primary key default 'default',
  api_key text not null default '',
  api_base_url text not null default '',
  agency_id text not null default '',
  enabled boolean not null default false,
  last_synced_at timestamptz,
  last_sync_status text check (last_sync_status in ('success', 'error', 'skipped')),
  last_sync_message text,
  last_sync_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_finder_settings_singleton check (id = 'default')
);

create trigger property_finder_settings_set_updated_at
  before update on public.property_finder_settings
  for each row execute function public.set_updated_at();

insert into public.property_finder_settings (id) values ('default');

alter table public.property_finder_settings enable row level security;

create policy "property_finder_settings_admin_read" on public.property_finder_settings
  for select to authenticated using (true);
create policy "property_finder_settings_admin_write" on public.property_finder_settings
  for update to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- Schedule the sync Edge Function every 12 hours via pg_cron + pg_net.
-- The function itself authenticates its database writes with the
-- service role key (set as a function secret), so the anon key here
-- only needs to get the request past the Functions gateway.
-- ---------------------------------------------------------------------
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'sync-property-finder-every-12h',
  '0 */12 * * *',
  $$
  select net.http_post(
    url := 'https://eskrxutnidutmflfxfnt.supabase.co/functions/v1/sync-property-finder',
    headers := jsonb_build_object(
      'Authorization', 'Bearer sb_publishable_poIBrBLZDcSkP4-wc8ya9Q_aCZJYqso',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
