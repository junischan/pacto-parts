import { useState } from "react";

export default function Cargar(){
  const [form, setForm] = useState({ codigo:"", descripcion:"", categoria:"", precio:"" });
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");

  const onFile = (e)=>{
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ()=> setPreview(r.result);
    r.readAsDataURL(f);
  };

  const save = async ()=>{
    setStatus("Guardando…");
    const body = { ...form, precio: form.precio ? Number(form.precio) : 0, imagenBase64: preview || null };
    if(!body.codigo || !body.descripcion){ setStatus("⚠️ Código y descripción son obligatorios"); return; }
    const res = await fetch("/api/products", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    setStatus(res.ok ? "✅ Guardado" : "❌ Error");
    if (res.ok){ setForm({ codigo:"", descripcion:"", categoria:"", precio:"" }); setPreview(null); }
  };

  return (
    <main style={{maxWidth:720, margin:"0 auto", padding:16}}>
      <h1>Cargar producto</h1>
      <div style={{display:"grid", gap:10}}>
        <input placeholder="Código *" value={form.codigo} onChange={e=>setForm({...form, codigo:e.target.value})}/>
        <input placeholder="Descripción *" value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})}/>
        <input placeholder="Categoría" value={form.categoria} onChange={e=>setForm({...form, categoria:e.target.value})}/>
        <input placeholder="Precio (Gs., opcional)" inputMode="numeric" value={form.precio} onChange={e=>setForm({...form, precio:e.target.value})}/>
        <label>Foto (opcional): <input type="file" accept="image/*" onChange={onFile}/></label>
        {preview && <img src={preview} alt="preview" style={{maxWidth:"100%", border:"1px solid #eee"}}/>}
        <button onClick={save} style={{padding:"10px 14px"}}>Guardar</button>
        <p style={{opacity:.75}}>{status}</p>
      </div>
    </main>
  );
}
