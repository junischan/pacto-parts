import { useState, useEffect } from "react";
import Link from "next/link";

export default function Signup() {
  const [alias, setAlias] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    try {
      const a = localStorage.getItem("alias");
      const w = localStorage.getItem("whatsapp");
      if (a) setAlias(a);
      if (w) setWhatsapp(w);
    } catch {}
  }, []);

  const save = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("alias", alias);
      localStorage.setItem("whatsapp", whatsapp);
    } catch {}
    // Volver al catálogo
    window.location.href = "/";
  };

  return (
    <main style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 12 }}>
        Crear cuenta de vendedor
      </h1>

      <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
        <label>
          Alias
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
          />
        </label>

        <label>
          WhatsApp
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+595..."
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "#10b981",
            color: "white",
            border: "none",
            fontWeight: 700,
          }}
        >
          Guardar y volver
        </button>
      </form>

      <p style={{ marginTop: 14 }}>
        <Link href="/">← Volver al catálogo</Link>
      </p>
    </main>
  );
}
