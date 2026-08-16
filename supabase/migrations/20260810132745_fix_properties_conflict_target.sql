-- The original properties_source_external_id_idx was a partial unique
-- index (WHERE external_id IS NOT NULL), which Postgres will not use as
-- an ON CONFLICT (source, external_id) target — upserts from the sync
-- function were failing with "no unique or exclusion constraint
-- matching the ON CONFLICT specification". A plain unique constraint
-- works just as well here: NULLs are never considered equal in a
-- unique constraint, so manual rows (external_id = NULL) still can't
-- collide with each other.

drop index if exists public.properties_source_external_id_idx;

alter table public.properties
  add constraint properties_source_external_id_key unique (source, external_id);
