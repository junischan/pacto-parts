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

export default function PublicarPage() {
  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("gm");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [catInput, setCatInput] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [cats, setCats] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(()=>{ setCats(loadCategories()); cargarBorrador(); }, []);

  const sugerencias = useMemo(()=>{
    if(!catInput.trim()) return cats;
    const low = stripAccents(catInput).toLowerCase();
    return cats.filter(c=> stripAccents(c.label).toLowerCase().includes(low));
  },[catInput,cats]);

  function handleFileChange(e) {
    const arr = Array.from(e.target.files || []);
    if(fotos.length + arr.length > 5) return alert("Máx 5 fotos");
    const nuevas = arr.map(f=>({ file:f, name:f.name, url:URL.createObjectURL(f) }));
    setFotos(prev=>[...prev,...nuevas]);
  }
  function quitarFoto(idx){ setFotos(prev=>prev.filter((_,i)=>i!==idx)); }

  function guardarBorrador() {
    try{
      const d = { codigo, marca, titulo, precio, descripcion, fotos, categoriaLabel:catInput, categoriaSlug:catSlug };
      localStorage.setItem("draft.producto", JSON.stringify(d));
    }catch{}
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

  async function publicar() {
    if(!codigo.trim()) return alert("Poné el código.");
    if(!catInput.trim()) return alert("Elegí una categoría.");
    if(!titulo.trim())return alert("Poné el título/aclaración.");
    if(!fotos.length) return alert("Agregá al menos una foto.");

    const { list, cat } = ensureCategory(cats, catInput || catSlug);
    setCats(list); setCatInput(cat.label); setCatSlug(cat.slug);

    setBusy(true);
    try {
      // Subir fotos a R2 via API
      const urls = [];
      for (let i=0;i<fotos.length;i++){
        const f = fotos[i].file || null;
        if(!f) continue;
        const ext = (f.name?.split(".").pop() || "jpg").toLowerCase();
        
        // Convertir a base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(f);
        });
        
        // Llamar a la API
        const nombreArchivo = `${codigo}-${i+1}.${ext}`;
        const res = await fetch('/api/upload-r2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, nombre: nombreArchivo })
        });
        
        if (!res.ok) throw new Error('Error subiendo foto');
        const { url } = await res.json();
        urls.push(url);
      }

      // Guardar en Supabase
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
      setFotos([]); setPrecio(""); setDescripcion("");
    } catch (e) {
      alert("❌ Error: " + (e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {padding:10, fontSize:16, border:"1px solid #d1d5db", borderRadius:8, width:"100%"};
  const chipStyle = {padding:"8px 16px", border:"1px solid #d1d5db", borderRadius:20, cursor:"pointer", fontSize:14};

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2 style={{fontSize:26, marginBottom:12}}>🧩 Publicar producto (R2)</h2>

      <div style={{marginTop:8, fontWeight:600}}>Código:</div>
      <input value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="Ej. 52100278" style={inputStyle} />

      <div style={{marginTop:12, fontWeight:600}}>Marca:</div>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8}}>
        {["gm","ford","vw","otro"].map(m=>(
          <button key={m} onClick={()=>setMarca(m)}
            style={{...chipStyle, background: marca===m ? "#10b981" : "#fff", color: marca===m ? "#fff":"#111"}}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>

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

      <div style={{marginTop:16, fontWeight:600}}>Categoría:</div>
      <input
        value={catInput}
        onChange={e=>{setCatInput(e.target.value); setCatSlug("");}}
        onBlur={()=>{ if(sugerencias.length===1) setCatSlug(sugerencias[0].slug); }}
        placeholder="Ej. Faros, Motor, etc."
        style={inputStyle}
      />
      {catInput.trim() && sugerencias.length>0 && (
        <div style={{marginTop:8, display:"flex", gap:8, flexWrap:"wrap"}}>
          {sugerencias.map(s=>(
            <button key={s.slug} onClick={()=>{setCatInput(s.label); setCatSlug(s.slug);}}
              style={{...chipStyle, background: catSlug===s.slug?"#3b82f6":"#fff", color:catSlug===s.slug?"#fff":"#111"}}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div style={{marginTop:16, fontWeight:600}}>Título/Aclaración:</div>
      <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ej. Faro delantero LD S10 12/20" style={inputStyle} />

      <div style={{marginTop:16, fontWeight:600}}>Precio (sin puntos):</div>
      <input value={precio} onChange={e=>setPrecio(e.target.value)} placeholder="Ej. 150000" type="number" style={inputStyle} />

      <div style={{marginTop:16, fontWeight:600}}>Descripción (opcional):</div>
      <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={3} style={{...inputStyle, resize:"vertical"}} />

      <div style={{marginTop:20, display:"flex", gap:8}}>
        <button onClick={publicar} disabled={busy}
          style={{flex:1, padding:14, fontSize:16, fontWeight:700, background:"#10b981", color:"#fff", border:"none", borderRadius:8, cursor: busy?"wait":"pointer"}}>
          {busy ? "⏳ Publicando..." : "✅ Publicar"}
        </button>
        <button onClick={guardarBorrador}
          style={{padding:14, fontSize:16, fontWeight:600, background:"#f3f4f6", border:"1px solid #d1d5db", borderRadius:8, cursor:"pointer"}}>
          💾
        </button>
      </div>
    </div>
  );
}
