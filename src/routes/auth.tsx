import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, ShieldCheck, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — CESA" },
      { name: "description", content: "Ingreso al panel institucional del CESA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
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
  if (roleRow) {
    navigate({ to: "/admin" });
    return;
  }
  navigate({ to: "/training" });
}

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [userMode, setUserMode] = useState<"new" | "existing">("new");
  const [userEmail, setUserEmail] = useState("");
  const [existingEmail, setExistingEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterLogin(navigate);
    });
  }, [navigate]);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/training`,
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setMagicSent(true);
    toast.success("Te enviamos un enlace de acceso a tu correo");
  };

  const [existingSent, setExistingSent] = useState(false);

  const userSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: existingEmail.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/training`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setExistingSent(true);
    toast.success("Te enviamos un enlace de acceso a tu correo");
  };

  const adminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail.trim().toLowerCase(),
      password: adminPass,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bienvenido");
    routeAfterLogin(navigate);
  };

  const sendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setForgotSent(true);
    toast.success("Te enviamos un enlace para restablecer tu contraseña");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB] px-4 font-[Outfit,system-ui,sans-serif]">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#013998] hover:bg-[#012a70] px-4 py-2 rounded-lg shadow-sm transition-colors mb-4">
          ← Volver al inicio
        </Link>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="bg-[#013998] rounded-xl p-3 mb-3 shadow-sm">
              <img src="/logo-cesa.svg" alt="Logo CESA" className="w-12 h-12" />
            </div>
            <CardTitle className="text-2xl text-[#013998]">Acceso institucional</CardTitle>
            <CardDescription>
              Elige el tipo de acceso según tu rol.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usuario">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="usuario" className="gap-2">
                  <GraduationCap className="w-4 h-4" /> Usuario
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <ShieldCheck className="w-4 h-4" /> Administrador
                </TabsTrigger>
              </TabsList>

              <TabsContent value="usuario" className="space-y-4">
                {magicSent ? (
                  <div className="text-center space-y-3 py-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Revisa tu correo</h3>
                    <p className="text-sm text-slate-600">
                      Enviamos un enlace de acceso a <strong>{userEmail}</strong>. Ábrelo desde este dispositivo para entrar.
                    </p>
                    <Button
                      variant="ghost"
                      className="text-[#013998]"
                      onClick={() => { setMagicSent(false); setUserEmail(""); }}
                    >
                      Usar otro correo
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setUserMode("new")}
                        className={`text-sm font-medium py-2 px-3 rounded-md transition-colors ${
                          userMode === "new"
                            ? "bg-white text-[#013998] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Soy nuevo
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserMode("existing")}
                        className={`text-sm font-medium py-2 px-3 rounded-md transition-colors ${
                          userMode === "existing"
                            ? "bg-white text-[#013998] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Ya estoy autorizado
                      </button>
                    </div>

                    {userMode === "new" ? (
                      <form onSubmit={sendMagicLink} className="space-y-3">
                        <p className="text-sm text-slate-600">
                          Ingresa el correo con el que fuiste autorizado. Te enviaremos un enlace de acceso — no requiere contraseña.
                        </p>
                        <div>
                          <Label htmlFor="user-email">Correo institucional</Label>
                          <Input
                            id="user-email"
                            type="email"
                            required
                            placeholder="tu.correo@cesa.edu.co"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-[#013998] hover:bg-[#012a70]">
                          {loading ? "Enviando…" : "Enviar enlace de acceso"}
                        </Button>
                        <p className="text-xs text-slate-500 text-center pt-1">
                          Si tu correo no está autorizado, el sistema te lo indicará al ingresar.
                        </p>
                      </form>
                    ) : (
                      existingSent ? (
                        <div className="text-center space-y-3 py-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-emerald-700" />
                          </div>
                          <h3 className="font-semibold text-slate-800">Revisa tu correo</h3>
                          <p className="text-sm text-slate-600">
                            Enviamos un enlace de acceso a <strong>{existingEmail}</strong>. Ábrelo desde este dispositivo para entrar.
                          </p>
                          <Button
                            variant="ghost"
                            className="text-[#013998]"
                            onClick={() => { setExistingSent(false); setExistingEmail(""); }}
                          >
                            Usar otro correo
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={userSignIn} className="space-y-3">
                          <p className="text-sm text-slate-600">
                            Ingresa el correo autorizado. Te enviaremos un enlace de acceso — no necesitas contraseña.
                          </p>
                          <div>
                            <Label htmlFor="existing-email">Correo institucional</Label>
                            <Input
                              id="existing-email"
                              type="email"
                              required
                              placeholder="tu.correo@cesa.edu.co"
                              value={existingEmail}
                              onChange={(e) => setExistingEmail(e.target.value)}
                            />
                          </div>
                          <Button type="submit" disabled={loading} className="w-full bg-[#013998] hover:bg-[#012a70]">
                            {loading ? "Enviando…" : "Enviar enlace de acceso"}
                          </Button>
                          <p className="text-xs text-slate-500 text-center pt-1">
                            Si tu correo no está autorizado, no recibirás el enlace.
                          </p>
                        </form>
                      )
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="admin">
                {forgotMode ? (
                  forgotSent ? (
                    <div className="text-center space-y-3 py-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-emerald-700" />
                      </div>
                      <h3 className="font-semibold text-slate-800">Revisa tu correo</h3>
                      <p className="text-sm text-slate-600">
                        Enviamos un enlace a <strong>{forgotEmail}</strong> para que definas una nueva contraseña.
                      </p>
                      <Button
                        variant="ghost"
                        className="text-[#013998]"
                        onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); }}
                      >
                        Volver a iniciar sesión
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={sendPasswordReset} className="space-y-3">
                      <p className="text-sm text-slate-600">
                        Ingresa tu correo de administrador. Te enviaremos un enlace para definir una nueva contraseña.
                      </p>
                      <div>
                        <Label htmlFor="forgot-email">Correo</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full bg-[#013998] hover:bg-[#012a70]">
                        {loading ? "Enviando…" : "Enviar enlace de recuperación"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-slate-500"
                        onClick={() => setForgotMode(false)}
                      >
                        Volver a iniciar sesión
                      </Button>
                    </form>
                  )
                ) : (
                  <form onSubmit={adminSignIn} className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Acceso exclusivo para administradores del sistema.
                    </p>
                    <div>
                      <Label htmlFor="admin-email">Correo</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-pass">Contraseña</Label>
                      <Input
                        id="admin-pass"
                        type="password"
                        required
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-[#013998] hover:bg-[#012a70]">
                      {loading ? "Ingresando…" : "Ingresar como administrador"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setForgotEmail(adminEmail); }}
                      className="w-full text-center text-xs text-slate-500 hover:text-[#013998] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
