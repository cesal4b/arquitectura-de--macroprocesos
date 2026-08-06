-- Registro de ingreso (nombre + correo institucional) antes de ver el
-- contenido de una página. Permite al administrador saber qué
-- funcionarios han entrado.
-- Escrita por el sitio estático publicado en GitHub Pages usando la anon key
-- pública (no hay sesión). Solo permite INSERT anónimo; nadie puede leer,
-- editar ni borrar filas desde el cliente — la consulta se hace desde el
-- dashboard de Supabase (Table Editor) o, más adelante, un panel admin.
CREATE TABLE public.page_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  page text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_visitors TO anon;
GRANT ALL ON public.page_visitors TO service_role;

ALTER TABLE public.page_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_visitors anon insert"
  ON public.page_visitors FOR INSERT
  TO anon
  WITH CHECK (true);
