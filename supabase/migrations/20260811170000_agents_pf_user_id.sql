-- Stable link back to Property Finder's own user id (publicProfile.id),
-- so the sync function can reliably match each listing's assignedTo.id to
-- one of our internal agent rows and set properties.agent_id — without
-- this, "who is this agent's listings" (agent_id) and "who does Property
-- Finder say listed this" (pf_agent_name/phone) never connect.
alter table public.agents
  add column pf_user_id integer unique;
