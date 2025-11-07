import { useState } from "react";
export default function StoreSettings(){
  const [s,setS]=useState({nombre:"Mi Tienda", whatsapp:"+595", direccion:""});
  const save=(e)=>{e.preventDefault(); alert("✅ Guardado (demo)");};
  return (
    <main style={{padding:16,maxWidth:620,margin:"0 auto"}}>
      <h1>Ajustes de tienda</h1>
      <form onSubmit={save} style={{display:"grid",gap:10}}>
        <input placeholder="Nombre de la tienda" value={s.nombre} onChange={e=>setS({...s,nombre:e.target.value})}/>
        <input placeholder="WhatsApp" value={s.whatsapp} onChange={e=>setS({...s,whatsapp:e.target.value})}/>
        <input placeholder="Dirección" value={s.direccion} onChange={e=>setS({...s,direccion:e.target.value})}/>
        <button type="submit" style={{padding:"10px 14px"}}>Guardar</button>
      </form>
    </main>
  );
}
