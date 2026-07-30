
CREATE TABLE public.procesos_extra (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  macro_slug text NOT NULL,
  slug text NOT NULL UNIQUE,
  nombre text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT ON public.procesos_extra TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.procesos_extra TO authenticated;
GRANT ALL ON public.procesos_extra TO service_role;

ALTER TABLE public.procesos_extra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "procesos_extra readable by everyone"
  ON public.procesos_extra FOR SELECT
  USING (true);

CREATE POLICY "procesos_extra insert by admins"
  ON public.procesos_extra FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "procesos_extra update by admins"
  ON public.procesos_extra FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "procesos_extra delete by admins"
  ON public.procesos_extra FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
