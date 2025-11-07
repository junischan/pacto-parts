// pages/subir.jsx
import { useState } from "react";
import { supabase } from "../lib/supabase.js"; // ya copiado del experimental

export default function SubirProducto() {
  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("gm");
  const [categoria, setCategoria] = useState("molduras");
  const [titulo, setTitulo] = useState("");   // aclaración
  const [precio, setPrecio] = useState("");   // Gs
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!codigo.trim()) return setMsg("Poné el código.");
    if (!titulo.trim()) return setMsg("Poné el título/aclaración.");
    if (!file) return setMsg("Elegí una imagen.");

    const code  = codigo.trim().replace(/\s+/g, "");
    const brand = marca.trim().toLowerCase().replace(/\s+/g, "");
    const cat   = categoria.trim().toLowerCase().replace(/\s+/g, "");
    const ext   = (file.name.split(".").pop() || "jpg").toLowerCase();
    const storageKey = `${brand}/${cat}/${code}.${ext}`;

    try {
      setBusy(true);

      // 1) Subir imagen al bucket "productos" (reemplaza si ya existe)
      const up = await supabase.storage
        .from("productos")
        .upload(storageKey, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "image/jpeg",
        });
      if (up.error) throw up.error;

      // 2) URL pública
      const { data: pub } = supabase.storage.from("productos").getPublicUrl(storageKey);
      const imagen_url = pub.publicUrl;

      // 3) Guardar/actualizar fila en tabla "productos"
      const precioNum = Number(precio) || 0; // 0 = "Consultar"
      const row = { codigo: code, titulo: titulo.trim(), precio: precioNum, marca: brand, categoria: cat, imagen_url };
      const ins = await supabase.from("productos").upsert(row, { onConflict: "codigo" });
      if (ins.error) throw ins.error;

      setMsg(`✅ Subido: ${code}`);
      setFile(null);
    } catch (err) {
      setMsg(`❌ Error: ${err.message || err}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "24px auto", padding: 12, fontFamily:"system-ui" }}>
      <h1>Subir producto</h1>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:10 }}>
        <input placeholder="Código (ej. 52100278)" value={codigo} onChange={e=>setCodigo(e.target.value)} />
        <input placeholder="Marca (gm/ford/vw)" value={marca} onChange={e=>setMarca(e.target.value)} />
        <input placeholder="Categoría (molduras/paragolpes/...)" value={categoria} onChange={e=>setCategoria(e.target.value)} />
        <input placeholder="Título / Aclaración" value={titulo} onChange={e=>setTitulo(e.target.value)} />
        <input type="number" inputMode="numeric" placeholder="Precio en Gs (0 = Consultar)" value={precio} onChange={e=>setPrecio(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button type="submit" disabled={busy}>{busy ? "Subiendo..." : "Subir"}</button>
      </form>
      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </main>
  );
}
