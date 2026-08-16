-- Property Finder listings carry their own listing agent (assignedTo/createdBy
-- on the raw listing) separate from our internal `agents` table, which only
-- represents Luxury Estates' own team. PF's API exposes only the agent's
-- name and photo, not a phone/WhatsApp number, so this is attribution only —
-- contact actions on these listings still route to Luxury Estates directly.

alter table public.properties
  add column pf_agent_name text,
  add column pf_agent_photo text;
