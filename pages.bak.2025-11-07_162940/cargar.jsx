import { useEffect, useState } from "react";

const initial = { id:"", nombre:"", precio:"", imagen:"", categoria:"", codigo:"" };

export default function Cargar() {
  const [drafts, setDrafts] = useState([]);
  const [form, setForm] = useState(initial);
  const [copiado, setCopiado] = useState(false);

  // cargar desde localStorage solo en cliente
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pacto_drafts");
      if (raw) setDrafts(JSON.parse(raw));
    } catch {}
  }, []);

  // persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pacto_drafts", JSON.stringify(drafts));
    } catch {}
  }, [drafts]);

  const addItem = () => {
    if (!form.id || !form.nombre) return alert("Completá al menos ID y Nombre");
    const precioNum = Number(form.precio || 0);
    const item = { ...form, precio: isNaN(precioNum) ? 0 : precioNum };
    setDrafts((arr) => [item, ...arr]);
    setForm(initial);
  };

  const removeItem = (id) => setDrafts((arr) => arr.filter(x => x.id !== id));
  const clearAll = () => {
    if (confirm("¿Borrar todos los borradores?")) setDrafts([]);
  };

  const copyJSON = async () => {
    try {
      const txt = JSON.stringify(drafts, null, 2);
      await navigator.clipboard.writeText(txt);
      setCopiado(true);
      setTimeout(()=>setCopiado(false), 1500);
    } catch {
      alert("No se pudo copiar automáticamente. Seleccioná el cuadro y copiá manualmente.");
    }
  };

  return (
    <div style={{padding:"16px 16px 110px"}}>
      <h1 style={{fontWeight:800, fontSize:22, marginBottom:8}}>Cargar productos (borrador local)</h1>
      <p style={{color:"#475569", marginBottom:16}}>
        Agregá ítems; quedan guardados solo en este dispositivo. Luego copiá el JSON y pegalo en <code>data/products.json</code>.
      </p>

      {/* Form */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:12,
        background:"#fff",
        border:"1px solid #e5e7eb",
        borderRadius:12,
        padding:12,
        marginBottom:16
      }}>
        {[
          {key:"id", label:"ID (único) *"},
          {key:"nombre", label:"Nombre *"},
          {key:"precio", label:"Precio (número)"},
          {key:"imagen", label:"URL de imagen (placeholder ok)"},
          {key:"categoria", label:"Categoría"},
          {key:"codigo", label:"Código interno / OEM"}
        ].map(({key,label}) => (
          <div key={key} style={{display:"flex", flexDirection:"column", gap:6}}>
            <label style={{fontSize:12, color:"#334155"}}>{label}</label>
            <input
              value={form[key]}
              onChange={e=>setForm(s=>({...s, [key]: e.target.value}))}
              placeholder={label}
              style={{
                padding:"10px 12px",
                border:"1px solid #cbd5e1",
                borderRadius:10,
                outline:"none"
              }}
            />
          </div>
        ))}

        <div style={{gridColumn:"1 / -1", display:"flex", gap:8, justifyContent:"flex-end"}}>
          <button onClick={()=>setForm(initial)} style={btn("gray")}>Limpiar</button>
          <button onClick={addItem} style={btn("green")}>Agregar</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <h2 style={{fontWeight:700}}>Borradores ({drafts.length})</h2>
        <div style={{display:"flex", gap:8}}>
          <button onClick={copyJSON} style={btn("blue")}>{copiado ? "¡Copiado!" : "Copiar JSON"}</button>
          <button onClick={clearAll} style={btn("red")}>Borrar todo</button>
        </div>
      </div>

      <div style={{
        border:"1px solid #e5e7eb",
        borderRadius:12,
        overflow:"hidden",
        marginBottom:12
      }}>
        <textarea
          readOnly
          value={JSON.stringify(drafts, null, 2)}
          style={{width:"100%", minHeight:180, padding:12, border:"none", outline:"none", fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace", fontSize:13}}
        />
      </div>

      <ul style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        {drafts.map(p => (
          <li key={p.id} style={{border:"1px solid #e5e7eb", borderRadius:12, overflow:"hidden", background:"#fff"}}>
            <div style={{aspectRatio:"1/1", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center"}}>
              {/* preview imagen */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={p.nombre}
                src={p.imagen || `https://picsum.photos/seed/${encodeURIComponent(p.id)}/600/600`}
                style={{maxWidth:"100%", maxHeight:"100%"}}
              />
            </div>
            <div style={{padding:10}}>
              <div style={{fontWeight:700, marginBottom:2}}>{p.nombre}</div>
              <div style={{fontSize:12, color:"#64748b", marginBottom:6}}>
                {p.categoria || "Sin categoría"} · {p.codigo || "s/código"}
              </div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{fontWeight:800, color:"#0f172a"}}>
                  {new Intl.NumberFormat("es-PY").format(Number(p.precio||0))}
                </div>
                <button onClick={()=>removeItem(p.id)} style={btn("gray")}>Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function btn(color){
  const base = {
    padding:"8px 12px",
    border:"1px solid transparent",
    borderRadius:10,
    fontWeight:600,
    cursor:"pointer"
  };
  const map = {
    gray: { background:"#f1f5f9", color:"#0f172a", borderColor:"#e2e8f0" },
    green:{ background:"#10b981", color:"#fff" },
    blue: { background:"#2563eb", color:"#fff" },
    red:  { background:"#ef4444", color:"#fff" }
  };
  return { ...base, ...(map[color]||{}) };
}
