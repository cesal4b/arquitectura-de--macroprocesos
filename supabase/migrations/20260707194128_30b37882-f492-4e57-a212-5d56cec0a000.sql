
-- Fix 1: Add WITH CHECK to profiles self update policy
DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix 2: Revoke direct EXECUTE of has_role from authenticated/anon
-- RLS policies invoke it internally as postgres, so this doesn't break them.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
