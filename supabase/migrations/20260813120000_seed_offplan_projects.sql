-- Real off-plan project inventory supplied by the client, replacing the
-- placeholder catalogue. Status values are mapped onto the existing
-- off_plan_projects CHECK constraint ('Pre-Launch' | 'Off-Plan' |
-- 'Under Construction' | 'Nearing Completion') since the source material
-- used different labels ("Upcoming" / "Ongoing" / "Completed").
-- Coordinates are approximate district-level placements (no survey-grade
-- geocode available), and no photography was supplied, so `images` is left
-- empty for the admin to fill in via /admin/off-plan.

insert into public.off_plan_projects
  (slug, name, developer, status, area, city, handover, starting_price,
   unit_types, min_size, max_size, payment_plan, description, amenities,
   images, featured, reference, lat, lng)
values
(
  'grid-villas-the-grid-2',
  'Grid Villas (The Grid 2)',
  'Luxury Estates Real Estate',
  'Pre-Launch',
  'Lusail City',
  'Lusail',
  '',
  4000000,
  ARRAY['Type A - 5-Bedroom Villa (private garden, open or closed kitchen)', 'Type B - 5-Bedroom Villa (contemporary design, floor-to-ceiling windows)'],
  0, 0,
  '',
  'Discover The Grid 2, an exclusive gated collection of just 49 luxury villas brought to you by Luxury Estates Real Estate. Strategically positioned directly opposite Doha Festival City, this rare development places world-class shopping, dining, and entertainment literally at your doorstep. Designed for discerning families and investors seeking privacy, prestige, and prime connectivity, The Grid 2 represents a unique opportunity to own a freehold villa in Qatar''s fastest-growing residential hotspot.

Both villa types are 5-bedroom layouts with open-plan living and premium modern finishes. Ownership: Freehold for eligible buyers.',
  ARRAY['🏊 Private clubhouse with temperature-controlled swimming pool', '💪 Fully equipped gym, sauna & dedicated wellness zone', '🧸 Safe, engaging kids'' play area', '🚗 Ample guest parking & landscaped communal spaces', '🔒 24/7 security, gated access'],
  '{}',
  false,
  'OP-2006',
  25.375, 51.440
),
(
  'city-avenue-lusail',
  'City Avenue',
  'Luxury Estates Real Estate',
  'Pre-Launch',
  'Lusail City',
  'Lusail',
  '',
  0,
  '{}',
  0, 0,
  '',
  'City Avenue is an upcoming premium development by Luxury Estates Real Estate located in Lusail City, Qatar. Detailed specifications, floor plans, and pricing details will be available in the project brochure upon launch. Limited availability expected.',
  '{}',
  '{}',
  false,
  'OP-2007',
  25.430, 51.510
),
(
  'marina-44',
  'Marina 44',
  'Luxury Estates Real Estate',
  'Pre-Launch',
  'Marina',
  'Lusail',
  '',
  1200000,
  ARRAY['1-Bedroom (150 units total across the tower)', '2-Bedroom (150 units total across the tower)'],
  0, 0,
  'Direct purchase available. Mortgage solutions offered through banking partners (no installment plans currently offered).',
  'Introducing Marina 44, a striking 20-story landmark brought to you by Luxury Estates Real Estate. Rising gracefully in the vibrant heart of Lusail, this architectural masterpiece redefines elevated urban living. Where clean lines meet timeless elegance, Marina 44 offers a complete lifestyle experience — blending refined comfort, thoughtful design, and the dynamic energy of Qatar''s most forward-thinking city.

Units are fully furnished and move-in ready, with floor-to-ceiling windows, panoramic skyline views, built-in wardrobes, climate-controlled A/C, and optional maid''s rooms. 8 on-site retail spaces sit within the development.

Prime Location: minutes from Lusail Marina & Boulevard, Place Vendôme, entertainment districts, and major business corridors.',
  ARRAY['🏊 Serene shared pool & dedicated children''s pool', '💆 Jacuzzi & modern sauna', '💪 Fully equipped fitness center', '🌳 Landscaped gardens, BBQ zones & play areas', '🛍️ 8 on-site retail spaces', '🔒 24/7 security with controlled access'],
  '{}',
  false,
  'OP-2008',
  25.418, 51.493
),
(
  'al-mayyas-porto-arabia',
  'Al Mayyas',
  'Luxury Estates Real Estate',
  'Nearing Completion',
  'Porto Arabia',
  'Doha',
  '',
  1553566,
  ARRAY['1-Bedroom Apartment', '2-Bedroom + Maid''s Room', '3-Bedroom + Maid''s Room'],
  0, 0,
  'Down Payment: 10% upon reservation. During Construction & Handover: 25% cumulative. Post-Handover: 65% payable over a 5-year plan. Starting price QAR 1,553,566.',
  'Introducing Al Mayyas, an exclusive off-plan residential collection brought to you by Luxury Estates Real Estate. Located in the heart of Porto Arabia, The Pearl-Qatar, this premium development offers semi-furnished luxury apartments designed for discerning homeowners and international investors. With elegant architecture, spacious layouts, and a coveted freehold status for expatriates, Al Mayyas represents a rare opportunity to own a high-end waterfront residence in one of Doha''s most prestigious addresses.

147 apartments in total, with contemporary open-plan designs, floor-to-ceiling windows, private balconies, and breathtaking city or sea views. Ownership: Freehold for expatriates.',
  ARRAY['🏊 Outdoor infinity pool & children''s play area', '💪 Fully equipped fitness center, sauna & steam rooms', '🌿 Tropical landscaped courtyard & rooftop relaxation terrace', '🚗 Covered parking, high-speed elevators, central A/C', '🔒 24/7 security, CCTV surveillance & controlled access', '🧹 Concierge, laundry & cleaning services', '🐾 Pet-friendly community'],
  '{}',
  false,
  'OP-2009',
  25.369, 51.550
),
(
  'skala-villas-north',
  'Skala Villas North',
  'Luxury Estates Real Estate',
  'Under Construction',
  'Qetaifan Islands',
  'Lusail',
  '',
  4000000,
  ARRAY['4-Bedroom Townhouse', '5-Bedroom Townhouse'],
  0, 0,
  '2% down payment. Full instalment schedule available on request.',
  'Discover Skala North, an exclusive collection of brand-new, fully furnished luxury townhouses brought to you by Luxury Estates Real Estate. Nestled along the tranquil coastline of Qetaifan Island North in Lusail, Qatar, this master-planned community offers a peaceful retreat from the metropolitan pace while keeping you seamlessly connected to Qatar''s most vibrant lifestyle destinations. Designed for modern families and discerning buyers, Skala North transforms coastal living into a move-in-ready reality.

Fully furnished with meticulously curated interiors, sleek quartz countertops, warm natural wood accents, integrated pendant lighting, a functional built-in pantry, smart home technology throughout, and open layouts with premium acoustic finishes.

Prime Location: minutes from a 5-star hotel, retail destinations, a lifestyle mall (with Sainsbury''s), Lusail''s cultural hubs, and Doha''s business corridors.',
  ARRAY['💪 Fully equipped gym', '🌳 Lush landscaped parks', '🏖️ Direct beach access', '🍖 Dedicated BBQ areas', '🏊 Children''s pool & shared pool', '🔒 24/7 security'],
  '{}',
  false,
  'OP-2010',
  25.437, 51.545
),
(
  'skala-villas-south',
  'Skala Villas South',
  'Luxury Estates Real Estate',
  'Under Construction',
  'Qetaifan Island North',
  'Lusail',
  '',
  4200000,
  ARRAY['4-Bedroom', '5-Bedroom', '6-Bedroom'],
  0, 0,
  'Direct purchase available. Mortgage solutions offered through banking partners (no installment plans currently offered).',
  'Discover Skala Villas South, an exclusive residential sanctuary brought to you by Luxury Estates Real Estate. Nestled on the serene shores of Qetaifan Island North, this thoughtfully designed community offers a peaceful retreat from the city — without compromising on connectivity or luxury. Here, everyday life transforms into an experience of balance, beauty, and boundless possibility.

Homes feature built-in wardrobes, climate-controlled air conditioning, and thoughtful layouts maximizing comfort and privacy.',
  ARRAY['🏊 Pristine infinity pool with panoramic views', '💪 Fully equipped gym', '🌳 Lush landscaped parks', '🏖️ Direct beach access', '🍖 Dedicated BBQ areas', '🏊 Children''s pool & shared pool', '🔒 24/7 security'],
  '{}',
  false,
  'OP-2011',
  25.434, 51.548
),
(
  'canal-bay-qetaifan',
  'Canal Bay',
  'Luxury Estates Real Estate (TAAMEER Group)',
  'Under Construction',
  'Qetaifan Islands',
  'Lusail',
  '',
  1800000,
  '{}',
  0, 0,
  'Direct purchase available. No installment plans currently offered; mortgage guidance available through banking partners.',
  'Welcome to Canal Bay, an exclusive waterfront residence brought to you by Luxury Estates Real Estate. Inspired by the gentle movement of water, this architectural masterpiece embodies modern sophistication and coastal tranquility. Strategically positioned along the prestigious Majra Alsail Canal in Qetaifan Island North, Qatar, the development offers a seamless blend of timeless design, natural harmony, and contemporary luxury living.

Exterior: floor-to-ceiling glass, brushed aluminum, and natural stone. Interior: premium marble finishes, warm wooden textures, calming neutral palettes, built-in wardrobes, climate-controlled air conditioning, and sustainable, durable materials.

Prime Location: steps from Qatar Outlet Village and Meryal Waterpark (the world''s tallest thrill ride).',
  ARRAY['🏖️ Direct beach access', '🏊 Shared swimming pool & children''s pool', '💪 Fully equipped fitness center', '🌳 Thoughtfully landscaped parks', '🍖 Private BBQ zones', '🔒 24/7 security'],
  '{}',
  false,
  'OP-2012',
  25.440, 51.550
),
(
  'carlton-house-qetaifan',
  'Carlton House',
  'Luxury Estates Real Estate (TAAMEER Group)',
  'Under Construction',
  'Qetaifan Island North',
  'Lusail',
  'Q4 2028',
  1800000,
  ARRAY['Studio (66-75 m²)', '1-Bedroom (82-124 m²)', '2-Bedroom (129-174 m²)', '3-Bedroom Penthouse (220-260 m², 10th & 12th floors)'],
  66, 260,
  'Sample plan for a 1-Bedroom, 110 sqm unit: Total price QAR 2,123,000 — 2% down payment, QAR 20,000 per month during construction, 21% due at handover. Completion Q4 2028.',
  'Carlton House is more than a residence; it is an ultra-branded sanctuary located in the heart of Qetaifan Island North. Designed as a seamless blend of hotel-style hospitality and private residential comfort, every detail has been curated for those who demand the extraordinary, across 12 exclusive floors.

Bright, spacious layouts flooded with natural light, premium materials and finishes, and breathtaking waterfront views throughout.

Location: Qetaifan Island North spans 1.3 million m² with seamless connectivity to West Bay, Katara Cultural Village, and Lusail City, complete infrastructure with themed precincts and a central mosque, plus on-island schools, clinics, and emergency services.',
  ARRAY['💪 State-of-the-art gym', '💆 Rejuvenating spa facilities', '🏊 Stunning infinity pool', '🧸 Dedicated children''s playgrounds', '🧸 Safe, engaging kids'' areas', '🛋️ Curated leisure spaces', '🛎️ 24/7 professional concierge', '🚗 Valet parking services', '🤝 Personalized resident support'],
  '{}',
  false,
  'OP-2013',
  25.436, 51.552
);
