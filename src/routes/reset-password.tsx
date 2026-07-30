import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { KeyRound, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Restablecer contraseña — CESA" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

async function routeAfterLogin(navigate: ReturnType<typeof useNavigate>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  navigate({ to: roleRow ? "/admin" : "/training" });
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecked(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecked(true);
    });
    const timeout = setTimeout(() => setChecked(true), 2500);
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirmPassword) return toast.error("Las contraseñas no coinciden");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Contraseña actualizada");
    routeAfterLogin(navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4 font-[Outfit,system-ui,sans-serif]">
      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="bg-[#013998] rounded-xl p-3 mb-3 shadow-sm">
              <img src="/logo-cesa.svg" alt="Logo CESA" className="w-12 h-12" />
            </div>
            <CardTitle className="text-2xl text-[#013998]">Nueva contraseña</CardTitle>
            <CardDescription>
              Define la contraseña con la que vas a ingresar de ahora en adelante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!checked ? (
              <p className="text-sm text-slate-500 text-center py-6">Verificando enlace…</p>
            ) : !ready ? (
              <div className="text-center space-y-3 py-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-semibold text-slate-800">Enlace inválido o expirado</h3>
                <p className="text-sm text-slate-600">
                  Solicita un nuevo enlace de recuperación desde la pantalla de acceso.
                </p>
                <Link to="/auth" className="inline-block text-sm font-medium text-[#013998] hover:underline">
                  Volver al acceso
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#013998] hover:bg-[#012a70] gap-2">
                  <KeyRound className="w-4 h-4" />
                  {loading ? "Guardando…" : "Guardar nueva contraseña"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
