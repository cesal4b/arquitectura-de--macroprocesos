
DROP POLICY IF EXISTS "macroproceso_info read all" ON public.macroproceso_info;
CREATE POLICY "macroproceso_info read authenticated" ON public.macroproceso_info FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.macroproceso_info FROM anon;

DROP POLICY IF EXISTS "procesos_extra readable by everyone" ON public.procesos_extra;
CREATE POLICY "procesos_extra read authenticated" ON public.procesos_extra FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.procesos_extra FROM anon;
