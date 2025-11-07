import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Página de publicación mínima funcional:
// - Si NO está verificado: te manda a /verify?next=/nuevo
// - Si NO hay perfil: te manda a /profile?next=/nuevo
// - Muestra un form para guardar en localStorage y refrescar el catálogo

export default function Nuevo(){
  const router = useRouter();

  useEffect(()=> {
    try {
      const verified = localStorage.getItem("pp.user.verified");
      const isOk = (verified === "1" || verified === "true");
      if (!isOk) { router.replace("/verify?next=/nuevo"); return; }

      const prof = JSON.parse(localStorage.getItem("pp.profile") || "null");
      const hasProfile = prof && prof.name && prof.phone && prof.email;
      if (!hasProfile) { router.replace("/profile?next=/nuevo"); return; }
    } catch {}
  }, [router]);

  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  function readFileAsDataURL(f){
    return new Promise((resolve, reject)=>{
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(f);
    });
  }

  async function onSubmit(e){
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try{
      let imagen = "";
      if (file) imagen = await readFileAsDataURL(file);

      const raw = JSON.parse(localStorage.getItem("pp.local.products") || "[]");

      const nuevo = {
        id: Date.now(),
        titulo: titulo || "Sin título",
        precio: Number(precio) || 0,
        categoria: categoria || "Otros",
        imagen
      };

      raw.unshift(nuevo);
      localStorage.setItem("pp.local.products", JSON.stringify(raw));

      // Notificar a la grilla
      window.dispatchEvent(new Event("pp:products:changed"));

      // Ir al Home
      router.replace("/");
    }catch(e){
      alert("Error al guardar: " + (e?.message || e));
    }finally{
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontWeight: 800, fontSize: 28 }}>Publicar producto</h1>

      <form onSubmit={onSubmit} style={{ display:"grid", gap:12, marginTop:12 }}>
        <input
          placeholder="Título"
          value={titulo}
          onChange={e=>setTitulo(e.target.value)}
          style={inputStyle}
          id="title"
        />
        <input
          placeholder="Precio (Gs.)"
          value={precio}
          onChange={e=>setPrecio(e.target.value)}
          inputMode="numeric"
          style={inputStyle}
        />
        <input
          placeholder="Categoría"
          value={categoria}
          onChange={e=>setCategoria(e.target.value)}
          style={inputStyle}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e=>setFile(e.target.files?.[0] || null)}
          style={{ ...inputStyle, padding: 10 }}
        />

        <button
          type="submit"
          disabled={busy}
          style={{
            background:"#10b981", color:"#fff", border:"none",
            padding:"14px 16px", borderRadius:12, fontWeight:700
          }}
        >
          {busy ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width:"100%", padding:14, borderRadius:12,
  border:"1px solid #d1d5db", outline:"none"
};
