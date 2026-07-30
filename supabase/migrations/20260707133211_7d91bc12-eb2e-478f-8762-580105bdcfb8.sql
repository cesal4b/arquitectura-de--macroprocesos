
CREATE TABLE public.procedimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  macro_slug text NOT NULL,
  macro_nombre text NOT NULL,
  proceso_slug text NOT NULL,
  proceso_nombre text NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  url_diagrama text,
  estado public.avance_estado NOT NULL DEFAULT 'pendiente',
  porcentaje integer NOT NULL DEFAULT 0 CHECK (porcentaje >= 0 AND porcentaje <= 100),
  responsable text,
  fecha_objetivo date,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE INDEX procedimientos_proceso_idx ON public.procedimientos(proceso_slug);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.procedimientos TO authenticated;
GRANT ALL ON public.procedimientos TO service_role;

ALTER TABLE public.procedimientos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "procedimientos read authenticated"
  ON public.procedimientos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "procedimientos admin write"
  ON public.procedimientos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER procedimientos_updated_at
  BEFORE UPDATE ON public.procedimientos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
