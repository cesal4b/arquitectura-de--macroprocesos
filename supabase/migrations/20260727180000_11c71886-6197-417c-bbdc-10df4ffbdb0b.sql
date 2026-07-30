-- Overrides de nombre / eliminación para los procesos base (definidos en el código, src/data/macro.ts).
-- Permite renombrar o "eliminar" (ocultar) esos procesos desde el panel de administración
-- sin tener que editar el código fuente.
CREATE TABLE public.proceso_overrides (
  proceso_slug text PRIMARY KEY,
  nombre text,
  eliminado boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.proceso_overrides TO authenticated;
GRANT ALL ON public.proceso_overrides TO service_role;

ALTER TABLE public.proceso_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proceso_overrides read authenticated"
  ON public.proceso_overrides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "proceso_overrides admin write"
  ON public.proceso_overrides FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
