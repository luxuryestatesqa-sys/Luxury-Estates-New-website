-- Per client request: only keep name/description for the newly-added
-- off-plan projects (OP-2006 through OP-2013) — everything else (price,
-- location, unit types, amenities, payment plan, status detail, images,
-- coordinates) will be entered manually via /admin/off-plan. `status` is
-- reset to 'Pre-Launch' only because the column is NOT NULL with no
-- default; it's a placeholder for the admin to change, not a real claim.

update public.off_plan_projects
set
  status = 'Pre-Launch',
  area = '',
  city = '',
  handover = '',
  starting_price = 0,
  unit_types = '{}',
  min_size = 0,
  max_size = 0,
  payment_plan = '',
  amenities = '{}',
  images = '{}',
  featured = false,
  lat = null,
  lng = null,
  brochure_url = null
where reference in (
  'OP-2006', 'OP-2007', 'OP-2008', 'OP-2009',
  'OP-2010', 'OP-2011', 'OP-2012', 'OP-2013'
);
