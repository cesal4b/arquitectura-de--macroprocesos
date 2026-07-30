
CREATE OR REPLACE FUNCTION public.protect_training_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  is_allowed boolean;
BEGIN
  IF NEW.training_access IS DISTINCT FROM OLD.training_access THEN
    is_admin := public.has_role(auth.uid(), 'admin');
    IF is_admin THEN
      RETURN NEW;
    END IF;
    -- Permitir auto-activarse SOLO si el propio correo está en la allowlist
    SELECT EXISTS(SELECT 1 FROM public.training_allowlist WHERE lower(email) = lower(NEW.email))
      INTO is_allowed;
    IF NEW.training_access = true AND is_allowed THEN
      RETURN NEW;
    END IF;
    -- En cualquier otro caso, revertir el cambio
    NEW.training_access := OLD.training_access;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_training_access() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_protect_training_access ON public.profiles;
CREATE TRIGGER profiles_protect_training_access
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_training_access();
