import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

/* ---------- Helpers de categoría ---------- */
function stripAccents(s=""){ return s.normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function toSlug(label=""){
  const base = stripAccents(String(label).trim().toLowerCase());
  return base.replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
function toLabel(label=""){
  const clean = stripAccents(String(label).trim().toLowerCase());
  return clean.replace(/\b[a-z]/g, c => c.toUpperCase());
}

/* Carga/guarda categorías en localStorage */
function loadCategories(){
  try{
    const raw = JSON.parse(localStorage.getItem("pp.categorias")||"[]");
    if(Array.isArray(raw) && raw.length) return raw;
  }catch{}
  const seed = [
    { slug:"faros", label:"Faros" },
    { slug:"frenos", label:"Frenos" },
    { slug:"carroceria", label:"Carrocería" },
    { slug:"motor", label:"Motor" },
    { slug:"suspension", label:"Suspensión" },
    { slug:"accesorios", label:"Accesorios" },
    { slug:"vidrios", label:"Vidrios" },
  ];
  localStorage.setItem("pp.categorias", JSON.stringify(seed));
  return seed;
}
function saveCategories(list){
  try{ localStorage.setItem("pp.categorias", JSON.stringify(list)); }catch{}
}
function ensureCategory(list, anyLabel){
  const slug = toSlug(anyLabel);
  const label = toLabel(anyLabel);
  const exists = list.find(c=>c.slug===slug);
  if(exists) return {list, cat:exists};
  const next = [...list, {slug, label}];
  saveCategories(next);
  return {list:next, cat:{slug,label}};
}

/* ---------- Página ---------- */
export default function PublicarPage() {
  // NUEVO: código y marca
  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("gm");

  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [cats, setCats] = useState([]);
  const [catInput, setCatInput] = useState("");
  const [catSlug, setCatSlug] = useState("");

  const [busy, setBusy] = useState(false);

  useEffect(()=>{ setCats(loadCategories()); },[]);

  // Sugerencias
  const sugerencias = useMemo(()=>{
    const q = stripAccents(catInput).trim().toLowerCase();
    if(!q) return cats.slice(0,8);
    return cats.filter(c => (
      stripAccents(c.label).toLowerCase().includes(q) ||
      c.slug.includes(q)
    )).slice(0,8);
  },[catInput, cats]);

  function handlePickSuggestion(sug){
    setCatInput(sug.label);
    setCatSlug(sug.slug);
  }

  useEffect(()=>{
    if(!catInput){ setCatSlug(""); return; }
    setCatSlug(toSlug(catInput));
  },[catInput]);

  // Imágenes (máx 5 + preview)
  function handleFileChange(e) {
    const files = Array.from(e.target.files||[]);
    const nuevas = files.map(f => ({ file:f, name:f.name, url:URL.createObjectURL(f) }));
    setFotos(prev => [...prev, ...nuevas].slice(0,5));
  }
  function quitarFoto(idx){
    setFotos(prev => prev.filter((_,i)=>i!==idx));
  }

  // Borrador local
  function guardarBorrador() {
    const data = { codigo, marca, titulo, precio, descripcion, fotos:fotos.map(f=>({name:f.name,url:f.url})), categoriaSlug:catSlug, categoriaLabel:toLabel(catInput) };
    localStorage.setItem("draft.producto", JSON.stringify(data));
    alert("Borrador guardado ✅");
  }
  function cargarBorrador() {
    try{
      const d = JSON.parse(localStorage.getItem("draft.producto")||"{}");
      setCodigo(d.codigo||"");
      setMarca(d.marca||"gm");
      setTitulo(d.titulo||"");
      setPrecio(d.precio||"");
      setDescripcion(d.descripcion||"");
      setFotos(Array.isArray(d.fotos)? d.fotos : []);
      setCatInput(d.categoriaLabel||"");
      setCatSlug(d.categoriaSlug||"");
    }catch{}
  }

  // PUBLICAR REAL a Supabase
  async function publicar() {
    if(!codigo.trim()) return alert("Poné el código.");
    if(!catSlug)      return alert("Elegí una categoría.");
    if(!titulo.trim())return alert("Poné el título/aclaración.");
    if(!fotos.length) return alert("Agregá al menos una foto.");

    // asegurar categoría en local
    const { list, cat } = ensureCategory(cats, catInput || catSlug);
    setCats(list); setCatInput(cat.label); setCatSlug(cat.slug);

    setBusy(true);
    try {
      // 1) subir fotos al bucket "productos"
      const urls = [];
      for (let i=0;i<fotos.length;i++){
        const f = fotos[i].file || null;
        if(!f) continue;
        const ext = (f.name?.split(".").pop() || "jpg").toLowerCase();
        const key = `${marca}/${cat.slug}/${codigo}-${i+1}.${ext}`;
        const up = await supabase.storage.from("productos")
          .upload(key, f, { upsert:true, cacheControl:"3600", contentType:f.type || "image/jpeg" });
        if (up.error) throw up.error;
        const { data:pub } = supabase.storage.from("productos").getPublicUrl(key);
        urls.push(pub.publicUrl);
      }

      // 2) guardar/actualizar fila en tabla productos
      const precioNum = Number(precio) || 0;
      const row = {
        codigo: String(codigo).trim(),
        titulo: titulo.trim(),
        precio: precioNum,
        descripcion: descripcion.trim(),
        marca: marca.trim().toLowerCase(),
        categoria: cat.slug,
        imagen_url: urls[0] || null
      };
      const ins = await supabase.from("productos").upsert(row, { onConflict:"codigo" });
      if(ins.error) throw ins.error;

      alert("✅ Publicado correctamente");
      // limpiar mínimamente
      setFotos([]); setPrecio(""); setDescripcion("");
    } catch (e) {
      alert("❌ Error publicando: " + (e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2 style={{fontSize:26, marginBottom:12}}>🧩 Publicar producto</h2>

      {/* Código */}
      <div style={{marginTop:8, fontWeight:600}}>Código:</div>
      <input value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="Ej. 52100278" style={inputStyle} />

      {/* Marca */}
      <div style={{marginTop:12, fontWeight:600}}>Marca:</div>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8}}>
        {["gm","ford","vw","otro"].map(m=>(
          <button key={m} onClick={()=>setMarca(m)}
            style={{...chipStyle, background: marca===m ? "#10b981" : "#fff", color: marca===m ? "#fff":"#111"}}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Fotos */}
      <div style={{margin:"14px 0 8px", fontWeight:600}}>Fotos (máx 5):</div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange}/>
      {!!fotos.length && (
        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:10}}>
          {fotos.map((f,i)=>(
            <div key={i} style={{position:"relative"}}>
              <img src={f.url} alt={f.name} style={{width:90,height:90,objectFit:"cover",borderRadius:8,border:"1px solid #e5e7eb"}}/>
              <button onClick={()=>quitarFoto(i)} style={{position:"absolute",top:-6,right:-6, border:"none", background:"#ef4444", color:"#fff", borderRadius:9999, width:22, height:22}}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Categoría con sugerencias */}
      <div style={{marginTop:16, fontWeight:600}}>Categoría:</div>
      <input
        value={catInput}
        onChange={e=>setCatInput(e.target.value)}
        placeholder="Ej. Faros, Frenos, Carrocería…"
        style={inputStyle}
      />
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8}}>
        {sugerencias.map(s => (
          <button key={s.slug} onClick={()=>handlePickSuggestion(s)} style={chipStyle}>
            {s.label}
          </button>
        ))}
        {catInput && !sugerencias.find(s=>s.slug===catSlug) && (
          <button onClick={()=>handlePickSuggestion({slug:catSlug,label:toLabel(catInput)})} style={{...chipStyle, borderStyle:"dashed"}}>
            Crear “{toLabel(catInput)}”
          </button>
        )}
      </div>
      <div style={{fontSize:12, opacity:.7, marginTop:6}}>
        Guardaremos: <code>{marca}/{catSlug||"(cat)"}{codigo?`/${codigo}-*.jpg`:""}</code>
      </div>

      {/* Título / Precio / Descripción */}
      <div style={{marginTop:16, fontWeight:600}}>Título:</div>
      <input value={titulo} onChange={e=>setTitulo(e.target.value)} style={inputStyle} />
      <div style={{marginTop:12, fontWeight:600}}>Precio (Gs):</div>
      <input value={precio} onChange={e=>setPrecio(e.target.value)} inputMode="numeric" style={inputStyle} />
      <div style={{marginTop:12, fontWeight:600}}>Descripción:</div>
      <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={4} style={{...inputStyle, height:"auto"}} />

      {/* Acciones */}
      <div style={{display:"flex", gap:10, marginTop:16, flexWrap:"wrap"}}>
        <button onClick={guardarBorrador} style={btnStyle}>💾 Guardar borrador</button>
        <button onClick={cargarBorrador} style={btnStyleAlt}>📂 Cargar borrador</button>
        <button onClick={publicar} style={btnPrimary} disabled={busy}>
          {busy ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}

/* ---------- estilos mínimos ---------- */
const inputStyle = {
  width:"100%", padding:"10px 12px", borderRadius:10,
  border:"1px solid #d1d5db", outline:"none", background:"#f9fafb"
};
const chipStyle = {
  border:"1px solid #d1d5db", padding:"6px 10px", borderRadius:9999,
  background:"#fff", cursor:"pointer"
};
const btnStyle = {
  padding:"10px 12px", borderRadius:10, border:"1px solid #d1d5db", background:"#fff"
};
const btnStyleAlt = {
  padding:"10px 12px", borderRadius:10, border:"1px dashed #d1d5db", background:"#fff"
};
const btnPrimary = {
  padding:"10px 14px", borderRadius:10, border:"none", background:"#10b981", color:"#fff", fontWeight:700
};
