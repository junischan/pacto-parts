import { useEffect } from "react";
export default function Sync(){
  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch("/api/products");
        const data = await res.json();
        localStorage.setItem("pp.local.products", JSON.stringify(data));
        window.dispatchEvent(new Event("pp:products:changed"));
      }catch(e){}
      location.replace("/");
    })();
  },[]);
  return <div style={{padding:20,fontFamily:"system-ui"}}>Sincronizando productos…</div>;
}
