import { useEffect } from "react";
export default function DevReload(){
  useEffect(()=>{
    try{
      window.dispatchEvent(new Event("pp:products:changed"));
      // por si el componente no escucha el evento, recargamos igual
      setTimeout(()=>location.href='/', 300);
    }catch(e){ setTimeout(()=>location.href='/', 300); }
  },[]);
  return <div style={{padding:16,fontFamily:"sans-serif"}}>
    <h1>Dev Reload</h1>
    <p>Disparando evento pp:products:changed…</p>
  </div>;
}
