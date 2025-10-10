import { useEffect, useState } from "react";
const KEY = "pp.local.products";

export default function Dump(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    try{
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(Array.isArray(raw)? raw : []);
    }catch{ setItems([]); }
  },[]);
  return (
    <main style={{padding:16}}>
      <h1>Dump local ({items.length})</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {items.map((p,i)=>(
          <div key={i} style={{border:"1px solid #eee",padding:8}}>
            {p.imagen ? <img src={p.imagen} style={{width:"100%",height:120,objectFit:"cover"}}/> : <div style={{height:120,background:"#f3f4f6"}}/>}
            <div style={{fontWeight:800,marginTop:6}}>{p.titulo||"(sin título)"}</div>
            <div style={{color:"#64748b"}}>{p.categoria||""}</div>
            <div style={{color:"#059669",fontWeight:800}}>{(p.precio||0).toLocaleString("es-PY")} Gs</div>
          </div>
        ))}
      </div>
    </main>
  );
}
