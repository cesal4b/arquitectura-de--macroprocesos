
-- Allowlist de correos autorizados para Entrenamiento Daruma
CREATE TABLE public.training_allowlist (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_allowlist TO authenticated;
GRANT ALL ON public.training_allowlist TO service_role;

ALTER TABLE public.training_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage allowlist"
  ON public.training_allowlist
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Los usuarios autenticados pueden consultar SI su propio correo está en la lista
CREATE POLICY "Users can check their own email"
  ON public.training_allowlist
  FOR SELECT
  TO authenticated
  USING (email = (SELECT auth.jwt() ->> 'email'));

-- Al registrarse un usuario, si su correo está pre-autorizado, se le otorga acceso
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_allowed boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.training_allowlist WHERE lower(email) = lower(NEW.email))
    INTO is_allowed;

  INSERT INTO public.profiles (id, email, full_name, training_access)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), COALESCE(is_allowed, false));

  RETURN NEW;
END;
$$;
