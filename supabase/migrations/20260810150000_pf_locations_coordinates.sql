-- Property Finder listings only carry a location id, no coordinates.
-- The /v1/locations lookup we already use for area/city names also
-- returns a coordinates.{lat,lng} centroid for that location, so we
-- cache it here too and use it as the map marker position for
-- Property Finder-sourced properties.

alter table public.pf_locations
  add column lat double precision,
  add column lng double precision;
