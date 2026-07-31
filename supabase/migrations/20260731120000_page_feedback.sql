-- Calificación de utilidad por página (👍/👎), sin cuenta requerida.
-- Escrita por el sitio estático publicado en GitHub Pages usando la anon key
-- pública (no hay sesión). Solo permite INSERT anónimo; nadie puede leer,
-- editar ni borrar filas de otros desde el cliente — la consulta se hace
-- desde el dashboard de Supabase o, más adelante, un panel admin.
CREATE TABLE public.page_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  useful boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_feedback TO anon;
GRANT ALL ON public.page_feedback TO service_role;

ALTER TABLE public.page_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_feedback anon insert"
  ON public.page_feedback FOR INSERT
  TO anon
  WITH CHECK (true);
