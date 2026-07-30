import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arquitectura de Macroprocesos — CESA" },
      {
        name: "description",
        content:
          "Mapa institucional de los 7 macroprocesos del CESA organizados en cadena de valor: gobierno, núcleo y soporte.",
      },
      { property: "og:title", content: "Arquitectura de Macroprocesos — CESA" },
      {
        property: "og:description",
        content: "Los 7 macroprocesos del CESA en un mapa de valor interactivo.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [stay, setStay] = useState(false);
  useEffect(() => {
    // Permitir quedarse aquí con ?panel=1 (para acceder al enlace admin)
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("panel") === "1") {
      setStay(true);
      return;
    }
    window.location.replace("/arquitectura-macroprocesos.html");
  }, []);

  if (!stay) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F7FB" }}>
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/arquitectura-macroprocesos.html" />
          <a href="/arquitectura-macroprocesos.html">Abrir Arquitectura de Macroprocesos</a>
        </noscript>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-[Outfit,system-ui,sans-serif] px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold text-[#013998]">Portal institucional CESA</h1>
        <ul className="space-y-2">
          <li><a className="text-[#013998] underline" href="/arquitectura-macroprocesos.html">Arquitectura de macroprocesos</a></li>
          <li><a className="text-[#013998] underline" href="/entrenamiento-daruma.html">Entrenamiento Daruma</a></li>
          <li><Link to="/admin" className="text-[#013998] underline">Panel de administración</Link></li>
          <li><Link to="/auth" className="text-[#013998] underline">Ingresar</Link></li>
        </ul>
      </div>
    </div>
  );
}
