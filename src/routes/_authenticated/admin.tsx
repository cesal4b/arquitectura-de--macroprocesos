import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MACROS, type ProcesoRef, type MacroRef } from "@/data/macro";
import {
  fetchExtraProcesos, mergeMacrosWithExtras, buildProcesoSlug, isExtraProceso, renameExtraProceso,
  fetchProcesoOverrides, upsertProcesoOverride,
  type ExtraProceso, type ProcesoOverride,
} from "@/data/procesos-extra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Pencil, Users, BookOpen, CheckCircle2, Lock, AlertCircle, AlertTriangle, TrendingUp, Star, TrendingDown, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { deleteUserAccount } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel administrador — CESA" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanel,
});

type Avance = {
  proceso_slug: string;
  macro_slug: string;
  macro_nombre: string;
  proceso_nombre: string;
  responsable: string | null;
  updated_at: string;
};

type Procedimiento = {
  id: string;
  macro_slug: string;
  macro_nombre: string;
  proceso_slug: string;
  proceso_nombre: string;
  nombre: string;
  responsable: string | null;
  updated_at: string;
};

function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserEmail(u.user.email ?? "");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
      setChecking(false);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F5F7FB]">
        <p className="text-slate-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-[Outfit,system-ui,sans-serif]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-xs text-slate-500 hover:text-[#013998]">← Sitio institucional</Link>
            <h1 className="text-xl font-semibold text-[#013998]">Panel de administración</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{userEmail}</span>
            {isAdmin && <Badge className="bg-[#013998]">Admin</Badge>}
            <Button variant="outline" size="sm" onClick={signOut}>Salir</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isAdmin ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin permisos de administrador</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <p>Tu cuenta <b>{userEmail}</b> está autenticada pero no tiene el rol <b>admin</b>.</p>
              <p>Solicita al equipo técnico que habilite el acceso al panel.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="procesos">Procesos</TabsTrigger>
              <TabsTrigger value="training">Entrenamiento Daruma</TabsTrigger>
              <TabsTrigger value="accesos">Accesos</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard"><DashboardTab /></TabsContent>
            <TabsContent value="procesos"><ProcesosTab /></TabsContent>
            <TabsContent value="training"><TrainingTab /></TabsContent>
            <TabsContent value="accesos"><AccesosTab /></TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

/* ============ DASHBOARD ============ */

function DashboardTab() {
  const { perUser, abandonedUsers, stats, loading } = useTrainingAnalytics();

  const topUsers = useMemo(
    () => perUser.filter((u) => u.visits > 0 || u.completed > 0).sort((a, b) => b.visits - a.visits).slice(0, 8),
    [perUser],
  );

  if (loading) return <p className="text-slate-500">Cargando dashboard…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0B1120]">Dashboard</h2>
        <p className="text-sm text-slate-500 mb-4">Usuarios y avance en el Entrenamiento Daruma</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={<Users className="w-5 h-5" />} accent="#7C3AED" label="TOTAL USUARIOS" value={stats.totalUsuarios} sub="Registrados en la plataforma" />
          <MetricCard icon={<TrendingUp className="w-5 h-5" />} accent="#3B82F6" label="AVANCE PROMEDIO" value={`${stats.avgPct.toFixed(1)}%`} sub="% Ruta 1 completada (promedio)" />
          <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} accent="#059669" label="COMPLETARON RUTA" value={stats.completadosTotal} sub={`De ${TOTAL_MODULES_RUTA1} módulos totales`} />
          <MetricCard icon={<AlertTriangle className="w-5 h-5" />} accent="#F59E0B" label="EN ABANDONO" value={stats.abandonados} sub="Sin actividad hace 7+ días" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base text-[#013998] flex items-center gap-2"><BookOpen className="w-4 h-4" /> Usuarios más activos en entrenamiento</CardTitle></CardHeader>
        <CardContent>
          {topUsers.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay registros de entrenamiento.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Módulos completados</TableHead>
                  <TableHead>Última visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>
                      <div className="text-sm font-medium">{u.profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-slate-500">{u.profile?.email ?? u.userId.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell>
                      {u.status === "completado" && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completado</Badge>}
                      {u.status === "en_progreso" && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En progreso</Badge>}
                      {u.status === "abandonado" && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Abandonado</Badge>}
                      {u.status === "sin_iniciar" && <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">Sin iniciar</Badge>}
                    </TableCell>
                    <TableCell>{u.visits}</TableCell>
                    <TableCell>{u.completed}/{TOTAL_MODULES_RUTA1}</TableCell>
                    <TableCell className="text-sm">{u.last ? new Date(u.last).toLocaleString() : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {abandonedUsers.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/40">
          <CardHeader className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-base text-[#0B1120]">Usuarios en riesgo de abandono</CardTitle>
            </div>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{abandonedUsers.length}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Sin actividad hace 7+ días y aún no completan la ruta. Ver detalle completo en "Entrenamiento Daruma".</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ icon, accent, label, value, sub }: { icon: React.ReactNode; accent: string; label: string; value: React.ReactNode; sub: string }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6 pb-5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </div>
        <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">{label}</div>
        <div className="text-4xl font-extrabold text-[#0B1120] leading-tight mb-1">{value}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />
    </Card>
  );
}

/* ============ AVANCE ============ */

const DEFAULT_ROLES: string[] = [
  "Conector Ejecutivo",
  "Coordinadora de Experiencia del Profesorado y Cultura",
  "Coordinadora de Sostenibilidad",
  "Decana de CESA Empresarial",
  "Decana de Pregrado y Posgrado",
  "Decana Escuela Empresarial",
  "Director General de Crecimiento",
  "Director General de la Oficina de Transformación",
  "Director General de Planeación Institucional",
  "Directora CESA for Life",
  "Directora de Aseguramiento de la Calidad Académica",
  "Directora de Biblioteca",
  "Directora de Innovación",
  "Directora de Innovación y Emprendimiento",
  "Directora General de Comunicaciones",
  "Directora General de Infraestructura",
  "Directora General de Personas y Cultura",
  "Líder Centro de Vitalidad y Bienestar",
  "Líder de Compras",
  "Líder de Comunidades",
  "Líder de Contenidos",
  "Líder de Internacionalización",
  "Líder de Planeación Financiera",
  "Líder de Procesos",
  "Líder de Tecnología",
  "Profesional de Experiencia del Estudiante",
  "Profesional de Investigación",
  "Secretaria General",
];


const ROLES_STORAGE_KEY = "avance_roles_custom";


function loadCustomRoles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ROLES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function saveCustomRoles(list: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(list));
}

const COLLAPSED_KEY = "admin_macro_collapsed";

function loadCollapsed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(COLLAPSED_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

function saveCollapsed(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(Array.from(set)));
}

function useMacroCollapse() {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => loadCollapsed());
  const toggle = (slug: string) => {
    const next = new Set(collapsed);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    setCollapsed(next);
    saveCollapsed(next);
  };
  const expandAll = () => {
    const next = new Set<string>();
    setCollapsed(next);
    saveCollapsed(next);
  };
  const collapseAll = () => {
    const next = new Set(MACROS.map((m) => m.slug));
    setCollapsed(next);
    saveCollapsed(next);
  };
  return { collapsed, toggle, expandAll, collapseAll };
}

function useMergedMacros(): {
  macros: MacroRef[]; extras: ExtraProceso[]; overrides: ProcesoOverride[]; reload: () => Promise<void>; loading: boolean;
} {
  const [extras, setExtras] = useState<ExtraProceso[]>([]);
  const [overrides, setOverrides] = useState<ProcesoOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const reload = async () => {
    try {
      const [rows, ov] = await Promise.all([fetchExtraProcesos(), fetchProcesoOverrides()]);
      setExtras(rows);
      setOverrides(ov);
    } catch (e) {
      console.warn("No se pudieron cargar procesos extra / overrides", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { reload(); }, []);
  const macros = useMemo(() => mergeMacrosWithExtras(extras, overrides), [extras, overrides]);
  return { macros, extras, overrides, reload, loading };
}

function NuevoProcesoDialog({ onCreated, macros }: { onCreated: () => void; macros: MacroRef[] }) {
  const [open, setOpen] = useState(false);
  const [macroSlug, setMacroSlug] = useState(macros[0]?.slug ?? "");
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macroSlug) return toast.error("Selecciona un macroproceso");
    const clean = nombre.trim();
    if (!clean) return toast.error("Nombre requerido");
    setSaving(true);
    const slug = buildProcesoSlug(macroSlug, clean);
    const { error } = await (supabase.from("procesos_extra" as never) as never as ReturnType<typeof supabase.from>)
      .insert({ macro_slug: macroSlug, slug, nombre: clean });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Proceso creado");
    setNombre("");
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#013998] text-[#013998] hover:bg-[#013998]/5">
          <Plus className="w-4 h-4 mr-1" /> Nuevo proceso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo proceso</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div>
            <Label>Macroproceso</Label>
            <Select value={macroSlug} onValueChange={setMacroSlug}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{macros.map((m) => <SelectItem key={m.slug} value={m.slug}>{m.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nombre del proceso</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Gestión de becas internacionales" required />
            <p className="text-[11px] text-slate-500 mt-1">Aparecerá en el macroproceso seleccionado, listo para registrar avance y procedimientos.</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving} className="bg-[#013998] hover:bg-[#012a70]">
              {saving ? "Guardando…" : "Crear proceso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

async function deleteExtraProceso(id: string): Promise<boolean> {
  const { error } = await (supabase.from("procesos_extra" as never) as never as ReturnType<typeof supabase.from>)
    .delete().eq("id", id);
  if (error) { toast.error(error.message); return false; }
  toast.success("Proceso eliminado");
  return true;
}


/* ============ PROCEDIMIENTOS ============ */

const procTable = () => supabase.from("procedimientos" as never) as never as ReturnType<typeof supabase.from>;

function ProcedimientoNombreDialog({
  editing, macroSlug, macroNombre, procesoSlug, procesoNombre, roles, onAddRole, onSaved,
}: {
  editing: Procedimiento | null;
  macroSlug: string;
  macroNombre: string;
  procesoSlug: string;
  procesoNombre: string;
  roles: string[];
  onAddRole: (name: string) => void;
  onSaved: () => void;
}) {
  const [nombre, setNombre] = useState(editing?.nombre ?? "");
  const [responsable, setResponsable] = useState(editing?.responsable ?? "");
  const [saving, setSaving] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState("");

  const respSelectValue = responsable && roles.includes(responsable) ? responsable : (responsable ? "__custom__" : "");

  const confirmAddRole = () => {
    const clean = newRole.trim();
    if (!clean) return;
    onAddRole(clean);
    setResponsable(clean);
    setNewRole("");
    setAddRoleOpen(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nombre.trim();
    if (!clean) return toast.error("Nombre requerido");
    setSaving(true);
    const isUpdate = !!(editing && editing.id);
    const payload = isUpdate
      ? { nombre: clean, responsable: responsable || null }
      : {
          macro_slug: macroSlug, macro_nombre: macroNombre,
          proceso_slug: procesoSlug, proceso_nombre: procesoNombre,
          nombre: clean, responsable: responsable || null,
        };
    const q = isUpdate ? procTable().update(payload).eq("id", editing!.id) : procTable().insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isUpdate ? "Procedimiento actualizado" : "Procedimiento creado");
    onSaved();
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{editing && editing.id ? "Editar procedimiento" : "Nuevo procedimiento"}</DialogTitle>
        <p className="text-xs text-slate-500">{macroNombre} · {procesoNombre}</p>
      </DialogHeader>
      <form onSubmit={save} className="space-y-3">
        <div>
          <Label>Nombre del procedimiento</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label>Responsable</Label>
          <Select
            value={respSelectValue}
            onValueChange={(v) => {
              if (v === "__add__") { setAddRoleOpen(true); return; }
              if (v === "__clear__") { setResponsable(""); return; }
              setResponsable(v);
            }}
          >
            <SelectTrigger><SelectValue placeholder="Seleccionar rol…" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              {responsable && !roles.includes(responsable) && (
                <SelectItem value="__custom__">{responsable}</SelectItem>
              )}
              {responsable && <SelectItem value="__clear__">— Sin asignar —</SelectItem>}
              <SelectItem value="__add__">➕ Agregar rol…</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Agregar nuevo rol</DialogTitle></DialogHeader>
              <Input
                autoFocus
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmAddRole(); } }}
                placeholder="Ej. Coordinador de Calidad"
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddRoleOpen(false)}>Cancelar</Button>
                <Button type="button" onClick={confirmAddRole} className="bg-[#013998] hover:bg-[#012a70]">Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving} className="bg-[#013998] hover:bg-[#012a70]">
            {saving ? "Guardando…" : editing && editing.id ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function RenameProcesoDialog({
  proceso, onSaved,
}: {
  proceso: { slug: string; nombre: string; isExtra: boolean; extraId?: string };
  onSaved: (nombre: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(proceso.nombre);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nombre.trim();
    if (!clean) return toast.error("Nombre requerido");
    setSaving(true);
    const ok = proceso.isExtra && proceso.extraId
      ? await renameExtraProceso(proceso.extraId, clean)
      : await upsertProcesoOverride(proceso.slug, { nombre: clean });
    setSaving(false);
    if (!ok) return toast.error("No se pudo renombrar el proceso");
    toast.success("Proceso renombrado");
    setOpen(false);
    onSaved(clean);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setNombre(proceso.nombre); }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-[#013998]" title="Renombrar proceso">
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Renombrar proceso</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus required />
          <DialogFooter>
            <Button type="submit" disabled={saving} className="bg-[#013998] hover:bg-[#012a70]">
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============ PROCESOS (editor: nombre + responsable) ============ */

function ProcesosTab() {
  const { macros, extras, reload } = useMergedMacros();
  const [avances, setAvances] = useState<Map<string, Avance>>(new Map());
  const [procsByProceso, setProcsByProceso] = useState<Map<string, Procedimiento[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [procRoles, setProcRoles] = useState<string[]>([]);
  const [procDialog, setProcDialog] = useState<{ macro: MacroRef; proceso: ProcesoRef; editing: Procedimiento | null } | null>(null);

  const { collapsed, toggle, expandAll, collapseAll } = useMacroCollapse();

  const load = async () => {
    setLoading(true);
    const [av, pr] = await Promise.all([
      supabase.from("proceso_avance").select("*"),
      procTable().select("*").order("nombre"),
    ]);
    if (av.error) toast.error(av.error.message);
    if (pr.error) toast.error(pr.error.message);
    const am = new Map<string, Avance>();
    ((av.data ?? []) as Avance[]).forEach((r) => am.set(r.proceso_slug, r));
    setAvances(am);
    const list = (pr.data ?? []) as Procedimiento[];
    const pm = new Map<string, Procedimiento[]>();
    list.forEach((p) => {
      if (!pm.has(p.proceso_slug)) pm.set(p.proceso_slug, []);
      pm.get(p.proceso_slug)!.push(p);
    });
    setProcsByProceso(pm);
    const set = new Set<string>();
    ((av.data ?? []) as { responsable: string | null }[]).forEach((r) => {
      if (r.responsable) r.responsable.split(/[,;/]|\s+y\s+/).map((s) => s.trim()).filter(Boolean).forEach((s) => set.add(s));
    });
    list.forEach((p) => { if (p.responsable) set.add(p.responsable); });
    setProcRoles(Array.from(set));
    setLoading(false);
  };

  useEffect(() => { load(); setCustomRoles(loadCustomRoles()); }, []);

  const roles = useMemo(() => {
    const set = new Set<string>();
    DEFAULT_ROLES.forEach((r) => set.add(r));
    procRoles.forEach((r) => set.add(r));
    customRoles.forEach((r) => set.add(r));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [procRoles, customRoles]);

  const addRole = (name: string) => {
    const clean = name.trim();
    if (!clean || roles.includes(clean)) return;
    const next = [...customRoles, clean];
    setCustomRoles(next);
    saveCustomRoles(next);
  };

  const saveResponsable = async (proceso: ProcesoRef, macro: MacroRef, responsable: string) => {
    const payload = {
      proceso_slug: proceso.slug,
      macro_slug: macro.slug,
      macro_nombre: macro.nombre,
      proceso_nombre: proceso.nombre,
      responsable: responsable || null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("proceso_avance").upsert(payload, { onConflict: "proceso_slug" }).select().single();
    if (error) { toast.error(error.message); return; }
    toast.success("Responsable actualizado");
    if (data) {
      const m = new Map(avances);
      m.set((data as Avance).proceso_slug, data as Avance);
      setAvances(m);
    }
  };

  const deleteProceso = async (proceso: ProcesoRef) => {
    const extra = isExtraProceso(extras, proceso.slug);
    const procs = procsByProceso.get(proceso.slug) ?? [];
    if (procs.length > 0) return toast.error("Elimina primero sus procedimientos");
    if (!confirm(`¿Eliminar el proceso "${proceso.nombre}"?`)) return;
    if (extra) {
      if (await deleteExtraProceso(extra.id)) reload();
      return;
    }
    const ok = await upsertProcesoOverride(proceso.slug, { eliminado: true });
    if (!ok) return toast.error("No se pudo eliminar el proceso");
    toast.success("Proceso eliminado");
    reload();
  };

  const deleteProcedimiento = async (id: string) => {
    if (!confirm("¿Eliminar este procedimiento?")) return;
    const { error } = await procTable().delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Procedimiento eliminado");
    load();
  };

  if (loading) return <p className="text-slate-500">Cargando procesos…</p>;

  const query = q.trim().toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-[#013998]">Procesos</h2>
          <p className="text-sm text-slate-600">Agrega, elimina o renombra procesos y procedimientos, y asigna su responsable.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input placeholder="Buscar proceso…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
          <NuevoProcesoDialog macros={macros} onCreated={reload} />
          <Button variant="outline" size="sm" onClick={expandAll}>Expandir todo</Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>Contraer todo</Button>
        </div>
      </div>

      {macros.map((macro) => {
        const isCollapsed = collapsed.has(macro.slug);
        const procesos = macro.procesos.filter((p) =>
          !query || p.nombre.toLowerCase().includes(query) || macro.nombre.toLowerCase().includes(query),
        );
        if (procesos.length === 0) return null;
        return (
          <Card key={macro.slug}>
            <CardHeader className="pb-2">
              <button onClick={() => toggle(macro.slug)} className="w-full flex items-center justify-between text-left group" aria-expanded={!isCollapsed}>
                <CardTitle className="text-base text-[#013998]">{macro.nombre}</CardTitle>
                <span className="text-slate-400 group-hover:text-[#013998] transition-colors">
                  {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <p className="text-xs text-slate-500">{procesos.length} proceso{procesos.length === 1 ? "" : "s"}</p>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="space-y-3">
                {procesos.map((proceso) => {
                  const extra = isExtraProceso(extras, proceso.slug);
                  return (
                    <ProcesoRow
                      key={proceso.slug}
                      proceso={proceso}
                      isExtra={!!extra}
                      extraId={extra?.id}
                      responsable={avances.get(proceso.slug)?.responsable ?? ""}
                      procedimientos={procsByProceso.get(proceso.slug) ?? []}
                      roles={roles}
                      onAddRole={addRole}
                      onSaveResponsable={(r) => saveResponsable(proceso, macro, r)}
                      onRenamed={() => reload()}
                      onDelete={() => deleteProceso(proceso)}
                      onNuevoProcedimiento={() => setProcDialog({ macro, proceso, editing: null })}
                      onEditarProcedimiento={(p) => setProcDialog({ macro, proceso, editing: p })}
                      onEliminarProcedimiento={deleteProcedimiento}
                    />
                  );
                })}
              </CardContent>
            )}
          </Card>
        );
      })}

      <Dialog open={!!procDialog} onOpenChange={(o) => { if (!o) setProcDialog(null); }}>
        {procDialog && (
          <ProcedimientoNombreDialog
            editing={procDialog.editing}
            macroSlug={procDialog.macro.slug}
            macroNombre={procDialog.macro.nombre}
            procesoSlug={procDialog.proceso.slug}
            procesoNombre={procDialog.proceso.nombre}
            roles={roles}
            onAddRole={addRole}
            onSaved={() => { setProcDialog(null); load(); }}
          />
        )}
      </Dialog>
    </div>
  );
}

function ProcesoRow({
  proceso, isExtra, extraId, responsable, procedimientos, roles, onAddRole,
  onSaveResponsable, onRenamed, onDelete, onNuevoProcedimiento, onEditarProcedimiento, onEliminarProcedimiento,
}: {
  proceso: ProcesoRef;
  isExtra: boolean;
  extraId?: string;
  responsable: string;
  procedimientos: Procedimiento[];
  roles: string[];
  onAddRole: (name: string) => void;
  onSaveResponsable: (responsable: string) => void;
  onRenamed: () => void;
  onDelete: () => void;
  onNuevoProcedimiento: () => void;
  onEditarProcedimiento: (p: Procedimiento) => void;
  onEliminarProcedimiento: (id: string) => void;
}) {
  const [resp, setResp] = useState(responsable);
  const [dirty, setDirty] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { setResp(responsable); setDirty(false); }, [responsable]);

  const selectValue = resp && roles.includes(resp) ? resp : (resp ? "__custom__" : "");

  const confirmAdd = () => {
    const clean = newRole.trim();
    if (!clean) return;
    onAddRole(clean);
    setResp(clean);
    setDirty(true);
    setNewRole("");
    setAddOpen(false);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <button onClick={() => setExpanded((v) => !v)} className="text-slate-400 hover:text-[#013998] shrink-0">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">{proceso.nombre}</div>
            <div className="flex items-center gap-1 mt-0.5">
              {isExtra && <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">Personalizado</Badge>}
              <Badge variant="outline" className="text-[10px]">{procedimientos.length} procedimiento{procedimientos.length === 1 ? "" : "s"}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectValue}
            onValueChange={(v) => {
              if (v === "__add__") { setAddOpen(true); return; }
              if (v === "__clear__") { setResp(""); setDirty(true); return; }
              setResp(v); setDirty(true);
            }}
          >
            <SelectTrigger className="w-48 h-8 text-xs"><SelectValue placeholder="Responsable…" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              {resp && !roles.includes(resp) && <SelectItem value="__custom__">{resp}</SelectItem>}
              {resp && <SelectItem value="__clear__">— Sin asignar —</SelectItem>}
              <SelectItem value="__add__">➕ Agregar rol…</SelectItem>
            </SelectContent>
          </Select>
          {dirty && (
            <Button size="sm" className="h-8 bg-[#013998] hover:bg-[#012a70]" onClick={() => { onSaveResponsable(resp); setDirty(false); }}>
              Guardar
            </Button>
          )}
          <RenameProcesoDialog proceso={{ slug: proceso.slug, nombre: proceso.nombre, isExtra, extraId }} onSaved={onRenamed} />
          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-600" title="Eliminar proceso" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Agregar nuevo rol</DialogTitle></DialogHeader>
          <Input autoFocus value={newRole} onChange={(e) => setNewRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmAdd(); }} placeholder="Ej. Coordinador de Calidad" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={confirmAdd} className="bg-[#013998] hover:bg-[#012a70]">Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {expanded && (
        <div className="mt-3 border-t border-slate-100 pt-3 space-y-1">
          {procedimientos.length === 0 && (
            <p className="text-xs text-slate-400 italic">Sin procedimientos registrados.</p>
          )}
          {procedimientos.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 text-xs bg-slate-50 rounded px-2 py-1.5">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-700">{p.nombre}</span>
                <span className="text-slate-400 ml-2">· {p.responsable ?? "sin responsable"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEditarProcedimiento(p)} title="Editar procedimiento">
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600 hover:text-red-700" onClick={() => onEliminarProcedimiento(p.id)} title="Eliminar procedimiento">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-1 h-7 text-xs" onClick={onNuevoProcedimiento}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Nuevo procedimiento
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============ TRAINING ============ */

type Visit = { id: string; user_id: string; page: string; section: string | null; entered_at: string };
type Completion = { id: string; user_id: string; module_slug: string; completed_at: string };
type Profile = { id: string; email: string | null; full_name: string | null; training_access?: boolean };

const TOTAL_MODULES_RUTA1 = 6;

function useTrainingAnalytics() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [v, c, p] = await Promise.all([
        supabase.from("training_visits").select("*").order("entered_at", { ascending: false }).limit(500),
        supabase.from("module_completions").select("*").order("completed_at", { ascending: false }),
        supabase.from("profiles").select("id,email,full_name,training_access"),
      ]);
      if (v.error) toast.error(v.error.message);
      if (c.error) toast.error(c.error.message);
      if (p.error) toast.error(p.error.message);
      setVisits((v.data ?? []) as Visit[]);
      setCompletions((c.data ?? []) as Completion[]);
      const map = new Map<string, Profile>();
      (p.data ?? []).forEach((x: Profile) => map.set(x.id, x));
      setProfiles(map);
      setLoading(false);
    })();
  }, []);

  const perUser = useMemo(() => {
    const byUser = new Map<string, { visits: number; last: string | null; completed: Set<string> }>();
    // seed with all profiles so we count users with 0 progress too
    profiles.forEach((_, id) => byUser.set(id, { visits: 0, last: null, completed: new Set() }));
    visits.forEach((v) => {
      const cur = byUser.get(v.user_id) ?? { visits: 0, last: null, completed: new Set() };
      cur.visits++;
      if (!cur.last || cur.last < v.entered_at) cur.last = v.entered_at;
      byUser.set(v.user_id, cur);
    });
    completions.forEach((c) => {
      const cur = byUser.get(c.user_id) ?? { visits: 0, last: null, completed: new Set() };
      cur.completed.add(c.module_slug);
      byUser.set(c.user_id, cur);
    });
    const now = Date.now();
    return Array.from(byUser.entries()).map(([userId, s]) => {
      const completedCount = s.completed.size;
      const pct = Math.round((completedCount / TOTAL_MODULES_RUTA1) * 100);
      const daysSinceLast = s.last ? Math.floor((now - new Date(s.last).getTime()) / 86400000) : null;
      let status: "completado" | "en_progreso" | "sin_iniciar" | "abandonado" = "sin_iniciar";
      if (pct >= 100) status = "completado";
      else if (completedCount > 0 || s.visits > 0) {
        status = daysSinceLast !== null && daysSinceLast >= 7 ? "abandonado" : "en_progreso";
      }
      return {
        userId,
        profile: profiles.get(userId),
        visits: s.visits,
        last: s.last,
        completed: completedCount,
        completedModules: Array.from(s.completed),
        pct,
        daysSinceLast,
        status,
      };
    }).sort((a, b) => (b.last ?? "").localeCompare(a.last ?? ""));
  }, [visits, completions, profiles]);

  const abandonedUsers = useMemo(
    () => perUser.filter((u) => u.status === "abandonado").sort((a, b) => (b.daysSinceLast ?? 0) - (a.daysSinceLast ?? 0)),
    [perUser]
  );

  const stats = useMemo(() => {
    const totalUsuarios = profiles.size;
    const avgPct = totalUsuarios ? perUser.reduce((s, u) => s + u.pct, 0) / totalUsuarios : 0;
    const sinAvance = perUser.filter((u) => u.pct === 0).length;
    const enRiesgo = perUser.filter((u) => u.pct < 15).length;
    const completadosTotal = perUser.filter((u) => u.status === "completado").length;
    const abandonados = abandonedUsers.length;
    const buckets = [
      { name: "0–5%", count: 0, color: "#D00416" },
      { name: "5–15%", count: 0, color: "#7C3AED" },
      { name: "15–30%", count: 0, color: "#013998" },
      { name: "30–50%", count: 0, color: "#3B82F6" },
      { name: "50–100%", count: 0, color: "#84EBB4" },
    ];
    perUser.forEach((u) => {
      const p = u.pct;
      if (p <= 5) buckets[0].count++;
      else if (p <= 15) buckets[1].count++;
      else if (p <= 30) buckets[2].count++;
      else if (p <= 50) buckets[3].count++;
      else buckets[4].count++;
    });
    const top = perUser.reduce<{ name: string; pct: number } | null>((best, u) => {
      const name = u.profile?.full_name || u.profile?.email || "—";
      return !best || u.pct > best.pct ? { name, pct: u.pct } : best;
    }, null);
    const maxBucket = Math.max(1, ...buckets.map((b) => b.count));
    return { totalUsuarios, avgPct, sinAvance, enRiesgo, completadosTotal, abandonados, buckets, top, maxBucket };
  }, [perUser, profiles, abandonedUsers]);

  return { visits, completions, profiles, perUser, abandonedUsers, stats, loading };
}

function TrainingTab() {
  const { visits, profiles, perUser, abandonedUsers, stats } = useTrainingAnalytics();
  const [filterUser, setFilterUser] = useState<string>("all");

  const filteredVisits = useMemo(() => filterUser === "all" ? visits : visits.filter((v) => v.user_id === filterUser), [visits, filterUser]);

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, Map<string, { profile: Profile | undefined; items: Visit[] }>>();
    filteredVisits.forEach((v) => {
      const day = new Date(v.entered_at).toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
      const key = v.entered_at.slice(0, 10); // YYYY-MM-DD for sorting
      if (!groups.has(key)) groups.set(key, new Map());
      const dayGroup = groups.get(key)!;
      if (!dayGroup.has(v.user_id)) dayGroup.set(v.user_id, { profile: profiles.get(v.user_id), items: [] });
      dayGroup.get(v.user_id)!.items.push(v);
    });
    return Array.from(groups.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, users]) => ({
        key,
        label: new Date(key + "T00:00:00").toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "short", day: "numeric" }),
        users: Array.from(users.entries()).map(([userId, { profile, items }]) => ({
          userId,
          profile,
          items: items.sort((a, b) => b.entered_at.localeCompare(a.entered_at)),
        })).sort((a, b) => b.items[0].entered_at.localeCompare(a.items[0].entered_at)),
      }));
  }, [filteredVisits, profiles]);

  return (
    <div className="space-y-6">
      {/* ============ VISTA GENERAL ============ */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B1120]">Vista General</h2>
        <p className="text-sm text-slate-500 mb-4">Métricas consolidadas de la plataforma de aprendizaje CESA / Bold</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard icon={<Users className="w-5 h-5" />} accent="#7C3AED" label="TOTAL USUARIOS" value={stats.totalUsuarios} sub="Registrados en la plataforma" />
          <MetricCard icon={<TrendingUp className="w-5 h-5" />} accent="#3B82F6" label="AVANCE PROMEDIO" value={`${stats.avgPct.toFixed(1)}%`} sub="% Ruta 1 completada (promedio)" />
          <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} accent="#059669" label="COMPLETARON RUTA" value={stats.completadosTotal} sub={`De ${TOTAL_MODULES_RUTA1} módulos totales`} />
          <MetricCard icon={<AlertTriangle className="w-5 h-5" />} accent="#F59E0B" label="EN ABANDONO" value={stats.abandonados} sub="Sin actividad hace 7+ días" />
          <MetricCard icon={<AlertCircle className="w-5 h-5" />} accent="#D00416" label="EN RIESGO CRÍTICO" value={stats.enRiesgo} sub="Avance menor al 15%" />
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader className="flex-row justify-between items-start">
              <div>
                <CardTitle className="text-base text-[#0B1120]">Distribución de Avance en la Ruta</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Agrupación por rango de porcentaje completado</p>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">{stats.totalUsuarios} USUARIOS</Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {stats.buckets.map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-slate-600 shrink-0">{b.name}</div>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(b.count / stats.maxBucket) * 100}%`, background: b.color }} />
                  </div>
                  <div className="w-8 text-right text-sm font-semibold text-slate-700">{b.count}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============ ANÁLISIS DE AVANCE ============ */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B1120]">Análisis de Avance</h2>
        <p className="text-sm text-slate-500 mb-4">Porcentaje de completitud de la Ruta 1 por usuario</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard icon={<Star className="w-5 h-5" />} accent="#7C3AED" label="MAYOR AVANCE" value={stats.top ? `${stats.top.pct}%` : "—"} sub={stats.top?.name ?? "Sin datos"} />
          <MetricCard icon={<TrendingDown className="w-5 h-5" />} accent="#3B82F6" label="SIN AVANCE" value={stats.sinAvance} sub="Usuarios en 0%" />
        </div>
      </div>

      {/* ============ ALARMA DE ABANDONO ============ */}
      <Card className={abandonedUsers.length > 0 ? "border-amber-300 bg-amber-50/40" : ""}>
        <CardHeader className="flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${abandonedUsers.length > 0 ? "text-amber-600 animate-pulse" : "text-slate-400"}`} />
            <CardTitle className="text-base text-[#0B1120]">Alarma de abandono</CardTitle>
          </div>
          <Badge className={abandonedUsers.length > 0 ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
            {abandonedUsers.length} {abandonedUsers.length === 1 ? "USUARIO" : "USUARIOS"}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500 mb-3">Usuarios que iniciaron el entrenamiento pero no registran actividad en los últimos 7 días y aún no completan la ruta.</p>
          {abandonedUsers.length === 0 ? (
            <p className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Ningún usuario en riesgo de abandono. </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Avance</TableHead>
                  <TableHead>Módulos</TableHead>
                  <TableHead>Días sin actividad</TableHead>
                  <TableHead>Última visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {abandonedUsers.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>
                      <div className="text-sm font-medium">{u.profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-slate-500">{u.profile?.email ?? u.userId.slice(0,8)}</div>
                    </TableCell>
                    <TableCell><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{u.pct}%</Badge></TableCell>
                    <TableCell className="text-sm">{u.completed}/{TOTAL_MODULES_RUTA1}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                        <Clock className="w-3.5 h-3.5" /> {u.daysSinceLast} días
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{u.last ? new Date(u.last).toLocaleString() : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-[#013998]">Consumo por usuario</CardTitle></CardHeader>
        <CardContent>
          {perUser.length === 0 ? (

            <p className="text-sm text-slate-500">Aún no hay visitas registradas al portal de entrenamiento.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Última visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perUser.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>
                      <div className="text-sm font-medium">{u.profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-slate-500">{u.profile?.email ?? u.userId.slice(0,8)}</div>
                    </TableCell>
                    <TableCell>
                      {u.status === "completado" && (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1"><CheckCircle2 className="w-3 h-3" /> Completado</Badge>
                      )}
                      {u.status === "en_progreso" && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En progreso</Badge>
                      )}
                      {u.status === "abandonado" && (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 gap-1"><AlertTriangle className="w-3 h-3" /> Abandonado</Badge>
                      )}
                      {u.status === "sin_iniciar" && (
                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">Sin iniciar</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <Progress value={u.pct} className="h-2 flex-1" />
                        <span className="text-xs text-slate-600 tabular-nums">{u.completed}/{TOTAL_MODULES_RUTA1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{u.visits}</TableCell>
                    <TableCell className="text-sm">{u.last ? new Date(u.last).toLocaleString() : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <div>
            <CardTitle className="text-base text-[#013998]">Actividad reciente</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Agrupada por día y usuario</p>
          </div>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              {perUser.map((u) => (
                <SelectItem key={u.userId} value={u.userId}>{u.profile?.email ?? u.userId.slice(0,8)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {groupedByDay.length === 0 ? (
            <p className="text-sm text-slate-500">Sin actividad.</p>
          ) : (
            <Accordion type="multiple" defaultValue={groupedByDay.slice(0, 3).map((d) => d.key)} className="w-full">
              {groupedByDay.map((day) => {
                const totalEvents = day.users.reduce((s, u) => s + u.items.length, 0);
                return (
                  <AccordionItem key={day.key} value={day.key} className="border-b border-slate-100">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-700 capitalize">{day.label}</span>
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">{day.users.length} {day.users.length === 1 ? "usuario" : "usuarios"}</Badge>
                        </div>
                        <span className="text-xs text-slate-500">{totalEvents} {totalEvents === 1 ? "evento" : "eventos"}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pb-2">
                        {day.users.map((u) => (
                          <div key={u.userId} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-sm font-medium text-slate-800">{u.profile?.full_name ?? "—"}</div>
                                <div className="text-xs text-slate-500">{u.profile?.email ?? u.userId.slice(0, 8)}</div>
                              </div>
                              <Badge className="bg-[#013998] text-white hover:bg-[#013998]">{u.items.length}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {u.items.map((item, idx) => (
                                <div key={item.id} className="inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2 py-1 text-xs text-slate-600">
                                  <span className="font-medium text-slate-700">{item.page}</span>
                                  {item.section && (
                                    <>
                                      <span className="text-slate-300">·</span>
                                      <span>{item.section}</span>
                                    </>
                                  )}
                                  <span className="text-slate-400">{new Date(item.entered_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============ ACCESOS ============ */

type AccessProfile = { id: string; email: string | null; full_name: string | null; training_access: boolean };
type AllowEntry = { email: string; created_at: string };

function AccesosTab() {
  const [profiles, setProfiles] = useState<AccessProfile[]>([]);
  const [allowlist, setAllowlist] = useState<AllowEntry[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const [importing, setImporting] = useState(false);

  const load = async () => {
    const [p, a, roles] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,training_access").order("email"),
      (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
        .select("email,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
    ]);
    if (p.error) toast.error(p.error.message);
    if (a.error) toast.error(a.error.message);
    if (roles.error) toast.error(roles.error.message);
    setProfiles((p.data ?? []) as AccessProfile[]);
    setAllowlist((a.data ?? []) as AllowEntry[]);
    setAdminIds(new Set(((roles.data ?? []) as { user_id: string }[]).map((r) => r.user_id)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (p: AccessProfile, value: boolean) => {
    setSavingId(p.id);
    const { error } = await supabase.from("profiles").update({ training_access: value }).eq("id", p.id);
    if (!error && p.email) {
      // Sync allowlist para que sea coherente si se registran de nuevo
      if (value) {
        await (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
          .upsert({ email: p.email.toLowerCase() });
      } else {
        await (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
          .delete().eq("email", p.email.toLowerCase());
      }
    }
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success(value ? `Acceso otorgado a ${p.email ?? "usuario"}` : `Acceso revocado a ${p.email ?? "usuario"}`);
    load();
  };

  const removeAccess = async (p: AccessProfile) => {
    if (!confirm(`¿Eliminar el acceso al Entrenamiento de ${p.email ?? "este usuario"}?\n\nLa cuenta seguirá existiendo, pero no podrá ver el contenido.`)) return;
    setSavingId(p.id);
    const { error } = await supabase.from("profiles").update({ training_access: false }).eq("id", p.id);
    if (!error && p.email) {
      await (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
        .delete().eq("email", p.email.toLowerCase());
    }
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success(`Acceso eliminado a ${p.email ?? "usuario"}`);
    load();
  };

  const deleteUserFn = useServerFn(deleteUserAccount);
  const deleteUser = async (p: AccessProfile) => {
    if (!confirm(`¿ELIMINAR PERMANENTEMENTE la cuenta de ${p.email ?? "este usuario"}?\n\nSe borrará su acceso, perfil, progreso y visitas. Esta acción no se puede deshacer.`)) return;
    setSavingId(p.id);
    try {
      await deleteUserFn({ data: { userId: p.id } });
      toast.success(`Cuenta eliminada: ${p.email ?? p.id}`);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar la cuenta");
    } finally {
      setSavingId(null);
    }
  };

  const removePending = async (email: string) => {
    if (!confirm(`¿Eliminar ${email} de la lista de correos pre-autorizados?`)) return;
    const { error } = await (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
      .delete().eq("email", email);
    if (error) return toast.error(error.message);
    toast.success("Correo eliminado de la lista");
    load();
  };


  const parseEmails = (text: string): string[] => {
    const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
    const matches = text.match(emailRe) ?? [];
    return Array.from(new Set(matches.map((e) => e.toLowerCase())));
  };

  const importEmails = async (emails: string[]) => {
    if (emails.length === 0) {
      toast.error("No se detectaron correos válidos");
      return;
    }
    setImporting(true);
    const rows = emails.map((email) => ({ email }));
    const { error } = await (supabase.from("training_allowlist" as never) as never as ReturnType<typeof supabase.from>)
      .upsert(rows, { onConflict: "email" });

    // Además, si alguno ya está registrado, activarles el flag inmediatamente
    const { data: existing } = await supabase
      .from("profiles")
      .select("id,email")
      .in("email", emails);
    if (existing && existing.length) {
      await Promise.all(
        (existing as { id: string; email: string }[]).map((row) =>
          supabase.from("profiles").update({ training_access: true }).eq("id", row.id)
        )
      );
    }
    setImporting(false);
    if (error) return toast.error(error.message);
    toast.success(`${emails.length} correo(s) agregado(s). ${existing?.length ?? 0} ya registrado(s) activado(s).`);
    setPasted("");
    setAddOpen(false);
    load();
  };

  const onFileUpload = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const emails: string[] = [];
      wb.SheetNames.forEach((name) => {
        const sheet = wb.Sheets[name];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { header: 1, raw: false });
        rows.forEach((row) => {
          Object.values(row).forEach((v) => {
            if (typeof v === "string") emails.push(...parseEmails(v));
          });
        });
      });
      const unique = Array.from(new Set(emails.map((e) => e.toLowerCase())));
      await importEmails(unique);
    } catch (e) {
      toast.error("No se pudo leer el archivo: " + (e as Error).message);
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return profiles;
    return profiles.filter((p) =>
      (p.email ?? "").toLowerCase().includes(s) ||
      (p.full_name ?? "").toLowerCase().includes(s)
    );
  }, [profiles, q]);

  const registeredEmails = useMemo(
    () => new Set(profiles.map((p) => (p.email ?? "").toLowerCase()).filter(Boolean)),
    [profiles]
  );
  const pending = useMemo(
    () => allowlist.filter((a) => !registeredEmails.has(a.email.toLowerCase())),
    [allowlist, registeredEmails]
  );

  const enabledCount = profiles.filter((p) => p.training_access).length;

  if (loading) return <p className="text-slate-500">Cargando usuarios…</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <CardTitle className="text-base text-[#013998] flex items-center gap-2">
              <Lock className="w-4 h-4" /> Acceso al Entrenamiento Daruma
            </CardTitle>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#013998] hover:bg-[#012a70]">
                  <Plus className="w-4 h-4 mr-1" /> Agregar usuarios
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Agregar usuarios al Entrenamiento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Pegar correos (separados por coma, espacio o salto de línea)</Label>
                    <Textarea
                      rows={6}
                      placeholder="juan@cesa.edu.co, maria@cesa.edu.co&#10;pedro@cesa.edu.co"
                      value={pasted}
                      onChange={(e) => setPasted(e.target.value)}
                      className="mt-1 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Se detectarán automáticamente los correos válidos en el texto.
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-sm">O subir archivo Excel / CSV</Label>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv,.txt"
                      className="mt-1"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onFileUpload(f);
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Cualquier celda que contenga un correo válido será importada.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
                  <Button
                    disabled={importing}
                    onClick={() => importEmails(parseEmails(pasted))}
                    className="bg-[#013998] hover:bg-[#012a70]"
                  >
                    {importing ? "Agregando…" : "Agregar correos pegados"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Los correos pre-autorizados podrán registrarse en <b>/auth</b> y accederán automáticamente al contenido.
            Los usuarios sin acceso verán una pantalla de "Contenido restringido".
          </p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Input
              placeholder="Buscar por correo o nombre…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                {enabledCount} con acceso · {profiles.length} registrados
              </Badge>
              {pending.length > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                  {pending.length} pre-autorizado(s) sin registrar
                </Badge>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Sin resultados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="w-[220px] text-right">Acceso Entrenamiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {p.full_name ?? "—"}
                        {adminIds.has(p.id) && (
                          <Badge className="bg-[#013998] text-white hover:bg-[#013998]">Admin</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{p.email ?? p.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      {adminIds.has(p.id) ? (
                        <Badge variant="outline" className="border-[#013998] text-[#013998]">Administrador</Badge>
                      ) : (
                        <span className="text-xs text-slate-500">Usuario</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className={`text-xs ${p.training_access ? "text-emerald-700" : "text-slate-500"}`}>
                          {p.training_access ? "Autorizado" : "Sin acceso"}
                        </span>
                        <Switch
                          checked={p.training_access}
                          disabled={savingId === p.id}
                          onCheckedChange={(v) => toggle(p, v)}
                        />
                        {!adminIds.has(p.id) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8"
                            disabled={savingId === p.id}
                            onClick={() => deleteUser(p)}
                            title="Eliminar usuario permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#013998]">
              Correos pre-autorizados (aún no se han registrado)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Correo</TableHead>
                  <TableHead>Agregado</TableHead>
                  <TableHead className="w-[100px] text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((a) => (
                  <TableRow key={a.email}>
                    <TableCell className="text-sm">{a.email}</TableCell>
                    <TableCell className="text-sm text-slate-500">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8"
                        onClick={() => removePending(a.email)}
                        title="Quitar de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

