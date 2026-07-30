import { supabase } from "@/integrations/supabase/client";
import { MACROS, type MacroRef } from "@/data/macro";

export type ExtraProceso = {
  id: string;
  macro_slug: string;
  slug: string;
  nombre: string;
  created_at: string;
};

export type ProcesoOverride = {
  proceso_slug: string;
  nombre: string | null;
  eliminado: boolean;
};

// Genera un slug único basado en macro y nombre.
export function buildProcesoSlug(macroSlug: string, nombre: string): string {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return `${macroSlug}-${base || "proceso"}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function fetchExtraProcesos(): Promise<ExtraProceso[]> {
  const { data, error } = await (
    supabase.from("procesos_extra" as never) as never as ReturnType<typeof supabase.from>
  )
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ExtraProceso[];
}

// Renombra un proceso personalizado (creado desde el panel).
export async function renameExtraProceso(id: string, nombre: string): Promise<boolean> {
  const { error } = await (
    supabase.from("procesos_extra" as never) as never as ReturnType<typeof supabase.from>
  )
    .update({ nombre })
    .eq("id", id);
  return !error;
}

export async function fetchProcesoOverrides(): Promise<ProcesoOverride[]> {
  const { data, error } = await (
    supabase.from("proceso_overrides" as never) as never as ReturnType<typeof supabase.from>
  ).select("*");
  if (error) throw error;
  return (data ?? []) as ProcesoOverride[];
}

// Renombra o marca como eliminado un proceso base (definido en src/data/macro.ts).
export async function upsertProcesoOverride(
  procesoSlug: string,
  patch: { nombre?: string | null; eliminado?: boolean },
): Promise<boolean> {
  const { error } = await (
    supabase.from("proceso_overrides" as never) as never as ReturnType<typeof supabase.from>
  ).upsert(
    { proceso_slug: procesoSlug, ...patch, updated_at: new Date().toISOString() },
    { onConflict: "proceso_slug" },
  );
  return !error;
}

// Devuelve MACROS con los procesos extra insertados y los overrides (renombrar / ocultar)
// aplicados sobre los procesos base.
export function mergeMacrosWithExtras(
  extras: ExtraProceso[],
  overrides: ProcesoOverride[] = [],
): MacroRef[] {
  const overrideMap = new Map(overrides.map((o) => [o.proceso_slug, o]));
  return MACROS.map((m) => {
    const base = m.procesos
      .filter((p) => !overrideMap.get(p.slug)?.eliminado)
      .map((p) => {
        const ov = overrideMap.get(p.slug);
        return ov?.nombre ? { ...p, nombre: ov.nombre } : p;
      });
    const own = extras.filter((e) => e.macro_slug === m.slug);
    return {
      ...m,
      procesos: [...base, ...own.map((e) => ({ slug: e.slug, nombre: e.nombre }))],
    };
  });
}

// Utilidad para saber si un proceso pertenece al catálogo extra (para poder eliminarlo).
export function isExtraProceso(
  extras: ExtraProceso[],
  procesoSlug: string,
): ExtraProceso | undefined {
  return extras.find((e) => e.slug === procesoSlug);
}

