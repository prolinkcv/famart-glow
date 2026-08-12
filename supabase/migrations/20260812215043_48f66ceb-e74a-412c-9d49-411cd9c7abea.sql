CREATE TABLE public.custom_products (
  slug text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL DEFAULT 'Famart Derma',
  category text NOT NULL,
  short text NOT NULL DEFAULT '',
  overview text NOT NULL DEFAULT '',
  uses text[] NOT NULL DEFAULT '{}',
  how_to_use text[] NOT NULL DEFAULT '{}',
  ingredients text[] NOT NULL DEFAULT '{}',
  skin_types text[] NOT NULL DEFAULT '{}',
  precautions text[] NOT NULL DEFAULT '{}',
  concerns text[] NOT NULL DEFAULT '{}',
  price_ksh integer NOT NULL DEFAULT 0,
  size text,
  in_stock boolean NOT NULL DEFAULT true,
  rating numeric,
  review_count integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  images text[] NOT NULL DEFAULT '{}',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  related_service text,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.custom_products TO anon;
GRANT SELECT ON public.custom_products TO authenticated;
GRANT ALL ON public.custom_products TO service_role;

ALTER TABLE public.custom_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom products are publicly readable"
ON public.custom_products FOR SELECT
TO anon, authenticated
USING (hidden = false);