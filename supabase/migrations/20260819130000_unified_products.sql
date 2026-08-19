-- Unified products table — the single source of truth for the shop.
-- Replaces the old split model (hardcoded catalogue + product_overrides + custom_products).

CREATE TABLE public.products (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Famart Derma',
  category TEXT NOT NULL,
  short TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  uses TEXT[] NOT NULL DEFAULT '{}',
  how_to_use TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  skin_types TEXT[] NOT NULL DEFAULT '{}',
  precautions TEXT[] NOT NULL DEFAULT '{}',
  concerns TEXT[] NOT NULL DEFAULT '{}',
  price_ksh INTEGER NOT NULL DEFAULT 0,
  size TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,1),
  review_count INTEGER NOT NULL DEFAULT 0,
  rating_source TEXT NOT NULL DEFAULT 'demo',
  featured BOOLEAN NOT NULL DEFAULT false,
  added_order INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  related_service TEXT,
  hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (hidden = false);

CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_featured_order ON public.products (featured DESC, added_order DESC);

-- Seed the built-in catalogue so the storefront looks identical to before.
INSERT INTO public.products
  (slug, name, brand, category, short, overview, uses, how_to_use, ingredients, skin_types, precautions, concerns, price_ksh, size, in_stock, rating, review_count, featured, added_order, images, seo_title, seo_description, related_service)
VALUES
  ('gentle-foaming-facial-cleanser', 'Gentle Foaming Facial Cleanser', 'Famart Derma', 'Cleansers',
   'A soap-free daily foaming wash for face and neck.',
   'A gentle, soap-free foaming cleanser formulated for everyday use on the face and neck. It removes excess oil, sunscreen and everyday grime while leaving the skin comfortable rather than tight.',
   ARRAY['Daily cleansing of face and neck','Removes excess surface oil and sunscreen residue','Leaves skin feeling comfortable, not stripped'],
   ARRAY['Wet the face with lukewarm water.','Apply a small amount and massage gently for 20–30 seconds.','Rinse thoroughly and pat dry. Use morning and evening.'],
   '{}', ARRAY['Oily skin','Combination skin','All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.','Discontinue use and speak to a clinician if irritation occurs.'],
   ARRAY['cleansing','oily','daily care','face wash'],
   1800, '200 ml', true, 4.7, 12, true, 12,
   ARRAY['/images/shop/foaming-cleanser.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Gentle Foaming Facial Cleanser in Nairobi | Famart Healthcare',
   'Buy a gentle soap-free foaming facial cleanser in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.',
   'skin-consultation'),

  ('hydrating-cream-cleanser', 'Hydrating Cream Cleanser', 'Famart Derma', 'Cleansers',
   'A creamy, non-foaming cleanser for dry and sensitive skin.',
   'A rich, non-foaming cream cleanser designed for skin that feels dry or reactive after washing. It cleanses gently and helps the skin retain its natural moisture.',
   ARRAY['Gentle cleansing for dry or easily irritated skin','Helps avoid the tight feeling that follows harsh washing','Suitable for use morning and evening'],
   ARRAY['Apply to damp skin and massage lightly.','Rinse with lukewarm water or remove with a soft cloth.','Follow with a moisturiser.'],
   '{}', ARRAY['Dry skin','Sensitive skin'],
   ARRAY['For external use only. Avoid contact with the eyes.','Patch test if your skin is highly reactive.'],
   ARRAY['dryness','sensitive','cleansing','eczema-prone'],
   1950, '150 ml', true, 4.6, 8, false, 11,
   ARRAY['/images/shop/cream-cleanser.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Hydrating Cream Cleanser for Dry Skin in Nairobi | Famart Healthcare',
   'A gentle cream cleanser for dry and sensitive skin, available from Famart Healthcare Medical and Skin Clinic in Nairobi. Order via WhatsApp.',
   'eczema-management'),

  ('daily-moisturising-face-cream', 'Daily Moisturising Face Cream', 'Famart Derma', 'Moisturizers',
   'A lightweight everyday face cream for lasting comfort.',
   'A lightweight daily face cream that absorbs quickly and helps keep skin feeling hydrated and comfortable throughout the day. Suitable under sunscreen and make-up.',
   ARRAY['Everyday facial hydration','Helps relieve the feeling of dryness and tightness','Comfortable base under sunscreen'],
   ARRAY['Apply a pea-sized amount to clean skin.','Smooth over face and neck morning and evening.'],
   '{}', ARRAY['All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.'],
   ARRAY['dryness','hydration','moisturiser','daily care'],
   2400, '50 ml', true, 4.8, 15, true, 10,
   ARRAY['/images/shop/moisturising-cream.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Daily Moisturising Face Cream in Nairobi | Famart Healthcare',
   'Shop a lightweight daily moisturising face cream in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.',
   'skin-consultation'),

  ('barrier-repair-lotion', 'Barrier Repair Lotion', 'Famart Derma', 'Moisturizers',
   'A rich lotion for very dry, rough or flaky skin.',
   'A richer lotion for skin that stays dry, rough or flaky. Designed for daily use on the face and body where extra moisture is needed.',
   ARRAY['Intensive daily moisturising for very dry skin','Softens rough or flaky areas','Suitable for face and body'],
   ARRAY['Apply generously to clean, dry skin.','Use at least once daily, ideally after bathing.'],
   '{}', ARRAY['Dry skin','Sensitive skin'],
   ARRAY['For external use only.','If your skin is broken or inflamed, seek clinical advice before use.'],
   ARRAY['dryness','eczema-prone','body','moisturiser'],
   2600, '250 ml', true, 4.5, 6, false, 9,
   ARRAY['/images/shop/barrier-lotion.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Barrier Repair Lotion for Dry Skin in Nairobi | Famart Healthcare',
   'Buy a rich barrier repair lotion for very dry skin in Nairobi from Famart Healthcare Medical and Skin Clinic. WhatsApp ordering available.',
   'eczema-management'),

  ('broad-spectrum-sunscreen-spf-50', 'Broad Spectrum Sunscreen SPF 50', 'Famart Derma', 'Sunscreens',
   'Daily high-protection sunscreen with a non-greasy finish.',
   'A broad spectrum SPF 50 sunscreen for daily use. It applies evenly, absorbs without a heavy feel and is suitable for use under make-up.',
   ARRAY['Daily sun protection for the face and neck','Helps protect skin from the effects of sun exposure','Part of an everyday pigmentation-care routine'],
   ARRAY['Apply generously to exposed skin 15 minutes before going outdoors.','Reapply every two hours, and after sweating or towel drying.'],
   '{}', ARRAY['All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.','Sunscreen is one part of sun protection — also seek shade and cover up.'],
   ARRAY['sun protection','pigmentation','spf','sunscreen'],
   2800, '60 ml', true, 4.9, 21, true, 8,
   ARRAY['/images/shop/sunscreen-spf50.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Broad Spectrum Sunscreen SPF 50 in Nairobi | Famart Healthcare',
   'Shop broad spectrum SPF 50 sunscreen in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.',
   'pigmentation-disorders'),

  ('tinted-mineral-sunscreen-spf-30', 'Tinted Mineral Sunscreen SPF 30', 'Famart Derma', 'Sunscreens',
   'A lightly tinted mineral sunscreen for sensitive skin.',
   'A mineral-based tinted sunscreen with a soft, natural finish. Formulated for people who prefer a mineral filter or find other sunscreens leave a white cast.',
   ARRAY['Daily sun protection with a light tint','An option for skin that reacts to other sunscreens'],
   ARRAY['Apply evenly to the face before sun exposure.','Reapply every two hours when outdoors.'],
   '{}', ARRAY['Sensitive skin','All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.','Patch test before first full use if your skin is reactive.'],
   ARRAY['sun protection','sensitive','tinted','sunscreen','mineral'],
   3000, '40 ml', false, NULL, 0, false, 7,
   ARRAY['/images/shop/tinted-sunscreen.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Tinted Mineral Sunscreen SPF 30 in Nairobi | Famart Healthcare',
   'Tinted mineral SPF 30 sunscreen for sensitive skin, from Famart Healthcare Medical and Skin Clinic in Nairobi. Ask about availability on WhatsApp.',
   'skin-allergy-treatment'),

  ('acne-control-gel', 'Acne Control Gel', 'Famart Derma', 'Acne Care',
   'A targeted leave-on gel for blemish-prone areas.',
   'A lightweight leave-on gel for use on blemish-prone areas as part of an acne-care routine. Best used alongside professional guidance from the clinic.',
   ARRAY['Targeted care for blemish-prone areas','Fits into a daily acne-care routine'],
   ARRAY['Cleanse and dry the skin first.','Apply a thin layer to affected areas once daily, increasing as tolerated.','Use sunscreen during the day.'],
   '{}', ARRAY['Oily skin','Combination skin'],
   ARRAY['For external use only. Avoid the eyes, lips and broken skin.','May cause dryness — reduce frequency if irritation develops.','Speak to our clinicians before combining with prescribed acne treatment.'],
   ARRAY['acne','breakouts','blemishes','oily','spots'],
   2200, '30 ml', true, 4.6, 18, true, 6,
   ARRAY['/images/shop/acne-gel.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Acne Control Gel in Nairobi | Famart Healthcare',
   'Buy acne care products in Nairobi from Famart Healthcare Medical and Skin Clinic. Professional skincare guidance and WhatsApp ordering.',
   'acne-treatment'),

  ('salicylic-acid-face-wash', 'Salicylic Acid Face Wash', 'Famart Derma', 'Acne Care',
   'A clarifying daily wash for oily, blemish-prone skin.',
   'A clarifying face wash for oily and blemish-prone skin. Cleanses away excess oil and everyday build-up as part of a consistent acne-care routine.',
   ARRAY['Daily cleansing for oily, blemish-prone skin','Helps manage the feeling of excess surface oil'],
   ARRAY['Massage onto damp skin and rinse thoroughly.','Start once daily and build up as tolerated.'],
   ARRAY['Salicylic acid'], ARRAY['Oily skin','Combination skin'],
   ARRAY['For external use only. Avoid contact with the eyes.','Can be drying — reduce use if the skin becomes irritated.','Use sun protection during the day.'],
   ARRAY['acne','oily','blackheads','face wash','breakouts'],
   1700, '150 ml', true, 4.4, 9, false, 5,
   ARRAY['/images/shop/salicylic-wash.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Salicylic Acid Face Wash for Acne in Nairobi | Famart Healthcare',
   'Shop acne skincare in Nairobi — salicylic acid face wash from Famart Healthcare Medical and Skin Clinic. Order through WhatsApp.',
   'acne-treatment'),

  ('vitamin-c-brightening-serum', 'Vitamin C Brightening Serum', 'Famart Derma', 'Serums',
   'A daily antioxidant serum for a more even-looking tone.',
   'A lightweight vitamin C serum used in the morning as part of a routine focused on the appearance of an even skin tone. Pair with daily sunscreen.',
   ARRAY['Cosmetic care for the look of uneven tone and dull skin','Morning antioxidant step before sunscreen'],
   ARRAY['Apply 3–4 drops to clean, dry skin in the morning.','Follow with moisturiser and sunscreen.'],
   ARRAY['Vitamin C (ascorbic acid derivative)'], ARRAY['All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.','Introduce gradually if your skin is sensitive.'],
   ARRAY['pigmentation','dark spots','dullness','serum','brightening'],
   3500, '30 ml', true, 4.8, 14, true, 4,
   ARRAY['/images/shop/vitamin-c-serum.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Vitamin C Brightening Serum in Nairobi | Famart Healthcare',
   'Buy a vitamin C serum in Nairobi from Famart Healthcare Medical and Skin Clinic. Dermatology-led skincare with WhatsApp ordering.',
   'pigmentation-disorders'),

  ('niacinamide-balancing-serum', 'Niacinamide Balancing Serum', 'Famart Derma', 'Serums',
   'A light serum for shine-prone, congested-looking skin.',
   'A light, fast-absorbing niacinamide serum for skin that looks shiny or congested through the day. Layers easily under moisturiser.',
   ARRAY['Cosmetic care for the look of visible pores and shine','Everyday step for combination and oily skin'],
   ARRAY['Apply a few drops to clean skin morning and/or evening.','Follow with moisturiser.'],
   ARRAY['Niacinamide'], ARRAY['Oily skin','Combination skin','All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.'],
   ARRAY['oily','pores','shine','serum','texture'],
   2900, '30 ml', true, 4.5, 7, false, 3,
   ARRAY['/images/shop/niacinamide-serum.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Niacinamide Serum in Nairobi | Famart Healthcare',
   'Shop niacinamide serum in Nairobi from Famart Healthcare Medical and Skin Clinic. Skincare guidance from a dermatology clinic, ordered via WhatsApp.',
   'cosmetic-skin-care'),

  ('urea-body-lotion', 'Urea Body Lotion', 'Famart Derma', 'Body Care',
   'A softening body lotion for rough, dry areas.',
   'A body lotion for rough, dry areas such as elbows, knees and lower legs. Absorbs without a heavy residue so it can be used daily.',
   ARRAY['Daily body moisturising','Softens rough patches on elbows, knees and legs'],
   ARRAY['Apply to clean, dry skin once or twice daily, ideally after bathing.'],
   ARRAY['Urea'], ARRAY['Dry skin','All skin types'],
   ARRAY['For external use only.','Avoid broken or freshly shaved skin.'],
   ARRAY['dryness','body','rough skin','lotion'],
   2100, '400 ml', true, 4.6, 5, false, 2,
   ARRAY['/images/shop/body-lotion.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Urea Body Lotion for Dry Skin in Nairobi | Famart Healthcare',
   'Buy urea body lotion for dry, rough skin in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.',
   'general-dermatology'),

  ('anti-dandruff-shampoo', 'Anti-Dandruff Shampoo', 'Famart Derma', 'Hair & Scalp Care',
   'A cleansing shampoo for flaky, itchy-feeling scalps.',
   'A cleansing shampoo for scalps that feel flaky or itchy. Used regularly as part of a scalp-care routine, with clinical review where symptoms persist.',
   ARRAY['Regular cleansing for a flake-prone scalp','Part of an ongoing scalp-care routine'],
   ARRAY['Massage into a wet scalp and leave for 2–3 minutes.','Rinse thoroughly. Use two to three times a week.'],
   '{}', ARRAY['All skin types'],
   ARRAY['For external use only. Avoid contact with the eyes.','If the scalp remains irritated, book a consultation with our clinicians.'],
   ARRAY['dandruff','scalp','itchy scalp','hair','shampoo'],
   1900, '200 ml', true, 4.3, 4, false, 1,
   ARRAY['/images/shop/anti-dandruff-shampoo.jpg','/images/shop/detail-texture.jpg','/images/shop/detail-packaging.jpg'],
   'Anti-Dandruff Shampoo in Nairobi | Famart Healthcare',
   'Shop scalp care in Nairobi — anti-dandruff shampoo from Famart Healthcare Medical and Skin Clinic. Order through WhatsApp.',
   'hair-scalp-conditions')
ON CONFLICT (slug) DO NOTHING;

-- Migrate any admin-created products into the unified table.
INSERT INTO public.products
  (slug, name, brand, category, short, overview, uses, how_to_use, ingredients,
   skin_types, precautions, concerns, price_ksh, size, in_stock, rating, review_count,
   rating_source, featured, added_order, images, seo_title, seo_description, related_service, hidden, created_at)
SELECT
  slug,
  name,
  COALESCE(brand, 'Famart Derma'),
  category,
  COALESCE(short, ''),
  COALESCE(NULLIF(overview, ''), COALESCE(short, '')),
  COALESCE(uses, '{}'),
  COALESCE(how_to_use, '{}'),
  COALESCE(ingredients, '{}'),
  CASE WHEN cardinality(COALESCE(skin_types, '{}')) = 0 THEN ARRAY['All skin types'] ELSE skin_types END,
  COALESCE(precautions, '{}'),
  COALESCE(concerns, '{}'),
  COALESCE(price_ksh, 0),
  size,
  COALESCE(in_stock, true),
  rating,
  COALESCE(review_count, 0),
  'demo',
  COALESCE(featured, false),
  1000 + row_number() OVER (ORDER BY created_at),
  COALESCE(images, '{}'),
  COALESCE(NULLIF(seo_title, ''), name || ' in Nairobi | Famart Healthcare'),
  COALESCE(NULLIF(seo_description, ''), 'Buy ' || name || ' in Nairobi from Famart Healthcare Medical and Skin Clinic. Order easily through WhatsApp.'),
  related_service,
  COALESCE(hidden, false),
  COALESCE(created_at, now())
FROM public.custom_products
ON CONFLICT (slug) DO NOTHING;

-- Drop the legacy tables now that products is the single source of truth.
DROP TABLE IF EXISTS public.product_overrides;
DROP TABLE IF EXISTS public.custom_products;

-- Private bucket for uploaded product images (idempotent).
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', false)
ON CONFLICT (id) DO NOTHING;
