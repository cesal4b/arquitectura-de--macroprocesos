
ALTER TABLE public.proceso_avance
  ADD COLUMN IF NOT EXISTS descripcion text,
  ADD COLUMN IF NOT EXISTS proposito text,
  ADD COLUMN IF NOT EXISTS lideres text;

CREATE TABLE IF NOT EXISTS public.macroproceso_info (
  macro_slug text PRIMARY KEY,
  macro_nombre text,
  objetivo text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.macroproceso_info TO anon, authenticated;
GRANT ALL ON public.macroproceso_info TO authenticated;
GRANT ALL ON public.macroproceso_info TO service_role;

ALTER TABLE public.macroproceso_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "macroproceso_info read all" ON public.macroproceso_info;
CREATE POLICY "macroproceso_info read all" ON public.macroproceso_info
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "macroproceso_info admin write" ON public.macroproceso_info;
CREATE POLICY "macroproceso_info admin write" ON public.macroproceso_info
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
