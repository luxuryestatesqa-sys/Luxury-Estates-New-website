-- Align property_finder_settings with the real Property Finder Enterprise
-- API auth model: OAuth-style apiKey + apiSecret exchanged for a
-- short-lived access token. There is no "agency id" concept in this API,
-- so that column is dropped; api_base_url stays as an optional override
-- (empty string means "use the production host").

alter table public.property_finder_settings
  add column api_secret text not null default '';

alter table public.property_finder_settings
  drop column agency_id;
