import { useState } from "react";

const empty = { name:"PactoParts", address:"", hours:"", payments:"", delivery:"" };

export default function StoreSettings({ onBack }) {
  const [store, setStore] = useState(()=> {
    try { return JSON.parse(localStorage.getItem("store")||"null") || empty; } catch { return empty; }
  });
  const [ok, setOk] = useState("");

  const set = (k,v)=> setStore(s=>({...s,[k]:v}));

  const save = (e)=>{
    e.preventDefault();
    localStorage.setItem("store", JSON.stringify(store));
    localStorage.setItem("isOwner", "1");
    setOk("Guardado ✓");
    setTimeout(()=> setOk(""), 1200);
  };

  return (
    <section style={{padding:"12px 4px 100px"}}>
      <h2 style={{margin:"0 0 12px"}}>Ajustes de mi Tienda</h2>
      <form onSubmit={save} style={{border:"1px solid #e6ecf5",borderRadius:12,padding:14,background:"#fff"}}>
        <Label t="Nombre comercial *">
          <Input value={store.name} onChange={e=>set("name",e.target.value)} placeholder="PactoParts" autoFocus/>
        </Label>
        <Label t="Dirección">
          <Input value={store.address} onChange={e=>set("address",e.target.value)} placeholder="Av. ..." />
        </Label>
        <Label t="Horarios">
          <Input value={store.hours} onChange={e=>set("hours",e.target.value)} placeholder="Lun a Sáb 8:00–18:00" />
        </Label>
        <Label t="Medios de pago">
          <Input value={store.payments} onChange={e=>set("payments",e.target.value)} placeholder="Efectivo, Transferencia, POS" />
        </Label>
        <Label t="Zonas de entrega">
          <Input value={store.delivery} onChange={e=>set("delivery",e.target.value)} placeholder="Asunción y AM, interior por encomienda" />
        </Label>

        {ok && <p style={{color:"#0a7",margin:"0 0 10px"}}>{ok}</p>}
        <div style={{display:"flex",gap:8}}>
          <button type="submit" style={primaryBtn}>Guardar</button>
          <button type="button" onClick={onBack} style={ghostBtn}>Volver</button>
        </div>
      </form>
    </section>
  );
}

function Label({t, children}){ return <label style={{display:"block",marginBottom:10}}><span>{t}</span>{children}</label>; }
function Input(props){ return <input {...props} style={{width:"100%",padding:"10px 12px",marginTop:6,borderRadius:10,border:"1px solid #d7deea"}}/>; }

const primaryBtn={padding:"10px 14px",borderRadius:10,border:"1px solid #25d366",background:"#25d366",color:"#000",fontWeight:800,cursor:"pointer"};
const ghostBtn={padding:"10px 14px",borderRadius:10,border:"1px solid #d7deea",background:"#fff",color:"#0b1730",cursor:"pointer"};
