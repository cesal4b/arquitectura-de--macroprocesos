
ALTER FUNCTION public.set_updated_at() SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
