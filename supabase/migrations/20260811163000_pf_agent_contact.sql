-- The listing-level assignedTo/createdBy only carries id/name/photo. Real
-- contact details live on Property Finder's separate /v1/users directory
-- (these are Luxury Estates' own team members, keyed by publicProfile.id,
-- which is what assignedTo.id/createdBy.id actually refer to) — the sync
-- function cross-references that directory and fills these in.

alter table public.properties
  add column pf_agent_phone text,
  add column pf_agent_whatsapp text,
  add column pf_agent_email text,
  add column pf_agent_title text;
