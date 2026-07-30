import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ userId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId: callerId } = context;

    // Verify caller is admin by reading user_roles directly (RLS as caller)
    const { data: adminRow, error: roleErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr) throw new Error(roleErr.message);
    if (!adminRow) throw new Error("Solo administradores pueden eliminar usuarios");

    if (data.userId === callerId) {
      throw new Error("No puedes eliminar tu propia cuenta");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get email to clean allowlist
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", data.userId)
      .maybeSingle();

    // Clean related rows (profiles cascades via FK to auth.users on some setups, but explicit is safer)
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    await supabaseAdmin.from("module_completions").delete().eq("user_id", data.userId);
    await supabaseAdmin.from("training_visits").delete().eq("user_id", data.userId);
    if (profile?.email) {
      await supabaseAdmin
        .from("training_allowlist")
        .delete()
        .eq("email", profile.email.toLowerCase());
    }
    await supabaseAdmin.from("profiles").delete().eq("id", data.userId);

    // Finally delete the auth user
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (delErr) throw new Error(delErr.message);

    return { ok: true };
  });
