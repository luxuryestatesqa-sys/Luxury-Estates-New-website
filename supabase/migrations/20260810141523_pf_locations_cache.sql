-- Cache of Property Finder location id -> name/city, populated
-- out-of-band (Property Finder's /v1/locations endpoint blocks requests
-- from Supabase's egress IPs with a WAF-style fingerprint check, even
-- though it works fine from an ordinary client — see comments in the
-- sync-property-finder function). The sync job reads from here instead
-- of calling that endpoint at run time.

create table public.pf_locations (
  id integer primary key,
  name text not null,
  city text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.pf_locations enable row level security;

create policy "pf_locations_admin_read" on public.pf_locations
  for select to authenticated using (true);
