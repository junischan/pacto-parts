import { useEffect, useState } from "react";

export default function DevGrid(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ (async()=>{
    const r = await fetch("/api/products");
    const data = await r.json();
    setItems(data.map(p=>({
      ...p,
      imagen: p.imagen ?? p.image ?? p.photo ?? ""
    })));
  })(); },[]);

  return (
    <div style={{padding:16,fontFamily:"system-ui,Segoe UI,Roboto,sans-serif"}}>
      <h1>DEV GRID (API directa)</h1>
      <p>Items: {items.length}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {items.slice(0,20).map((p,i)=>(
          <div key={p.id||i} style={{background:"#0b1220",padding:8,borderRadius:10}}>
            <div style={{aspectRatio:"1/1",overflow:"hidden",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {p.imagen
                ? <img src={p.imagen} alt={p.titulo||p.title||""} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <div style={{color:"#fff"}}>(sin imagen)</div>}
            </div>
            <div style={{marginTop:8,color:"#fff",fontWeight:700,fontSize:14}}>
              {p.titulo||p.title||"(sin título)"}
            </div>
          </div>
        ))}
      </div>
      <p style={{marginTop:12}}><a href="/">Volver al inicio</a></p>
    </div>
  );
}
