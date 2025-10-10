import { useEffect, useState } from "react";
export default function DevInspect(){
  const [count,setCount]=useState(null);
  const [sample,setSample]=useState(null);
  useEffect(()=>{
    try{
      const raw = localStorage.getItem("pp.local.products") || "[]";
      const arr = JSON.parse(raw);
      setCount(arr.length);
      setSample(arr[0] || null);
    }catch(e){ setCount(-1); }
  },[]);
  const img = sample?.imagen || sample?.image || sample?.photo || "";
  return (
    <div style={{padding:16,fontFamily:"sans-serif"}}>
      <h1>Dev Inspect</h1>
      <p><b>pp.local.products length:</b> {String(count)}</p>
      <pre style={{whiteSpace:"pre-wrap",background:"#111",color:"#eee",padding:8,borderRadius:8}}>
        {JSON.stringify(sample, null, 2)}
      </pre>
      <div style={{marginTop:12}}>
        <div>Probando imagen: <code>{img||"(vacío)"}</code></div>
        {img ? <img src={img} alt="sample" style={{maxWidth:240,borderRadius:8}}/> : <div>(sin imagen)</div>}
      </div>
      <p style={{marginTop:12}}><a href="/">Volver al inicio</a></p>
    </div>
  );
}
