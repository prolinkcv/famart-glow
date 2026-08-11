CREATE TABLE public.product_overrides (
  slug TEXT PRIMARY KEY,
  price_ksh INTEGER,
  in_stock BOOLEAN,
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  rating NUMERIC(2,1),
  review_count INTEGER,
  hidden BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_overrides TO anon;
GRANT SELECT ON public.product_overrides TO authenticated;
GRANT ALL ON public.product_overrides TO service_role;

ALTER TABLE public.product_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product settings are publicly readable"
  ON public.product_overrides FOR SELECT
  TO anon, authenticated
  USING (true);