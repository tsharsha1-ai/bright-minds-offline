
CREATE TABLE public.content_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  variant text NOT NULL DEFAULT 'default',
  level text NOT NULL DEFAULT 'beginner',
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX content_cache_lookup_idx ON public.content_cache (module, variant, level, created_at DESC);

ALTER TABLE public.content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached content"
  ON public.content_cache FOR SELECT
  USING (true);
