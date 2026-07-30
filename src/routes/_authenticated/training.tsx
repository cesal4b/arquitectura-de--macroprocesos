import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, GraduationCap, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/training")({
  head: () => ({ meta: [{ title: "Entrenamiento — CESA" }, { name: "robots", content: "noindex" }] }),
  component: TrainingGate,
});

function TrainingGate() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "allowed" | "pending">("checking");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      setEmail(user.email ?? "");

      // Si es admin, mándalo al panel admin
      const { data: adminRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (adminRow) {
        navigate({ to: "/admin" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("training_access")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.training_access) {
        window.location.href = "/entrenamiento-daruma.html";
      } else {
        setState("pending");
      }
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4 font-[Outfit,system-ui,sans-serif]">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
        {state === "checking" && (
          <CardContent className="py-10 flex flex-col items-center gap-3 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin text-[#013998]" />
            <p>Verificando tu acceso…</p>
          </CardContent>
        )}
        {state === "pending" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
              <CardTitle className="text-xl text-[#013998]">Acceso pendiente</CardTitle>
              <CardDescription>
                El correo <strong>{email}</strong> aún no está autorizado para el Entrenamiento Daruma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 text-center">
                Solicita a un administrador que agregue tu correo al listado de acceso. Cuando lo haga, podrás ingresar volviendo a este enlace.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/"><GraduationCap className="w-4 h-4 mr-2" /> Volver al inicio</Link>
                </Button>
                <Button onClick={signOut} variant="ghost" className="w-full text-slate-500">
                  <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
