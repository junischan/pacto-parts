import React, { useState } from "react";

export default function NovoProducto() {
  const [form, setForm] = useState({
    descripcion: "", codigo: "", precio: "", categoria: "", imagen: "", whatsapp: ""
  });

  const set = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto de prueba:", form);
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <div style={{ padding: 16, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
        Publicar producto (demo)
      </h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <input placeholder="Descripción" value={form.descripcion} onChange={e=>set("descripcion", e.target.value)} />
        <input placeholder="Código" value={form.codigo} onChange={e=>set("codigo", e.target.value)} />
        <input placeholder="Precio (Gs.)" inputMode="numeric" value={form.precio} onChange={e=>set("precio", e.target.value)} />
        <input placeholder="Categoría" value={form.categoria} onChange={e=>set("categoria", e.target.value)} />
        <input placeholder="URL de imagen" value={form.imagen} onChange={e=>set("imagen", e.target.value)} />
        <input placeholder="WhatsApp" value={form.whatsapp} onChange={e=>set("whatsapp", e.target.value)} />
        <button type="submit" style={{ background:"#10b981", color:"white", border:"none", padding:"12px 16px", borderRadius:10 }}>
          Guardar (demo) y volver
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <a href="/" style={{ textDecoration:"underline" }}>← Volver al catálogo</a>
      </div>
      <style jsx>{`
        input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; outline: none; }
        input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
      `}</style>
    </div>
  );
}
