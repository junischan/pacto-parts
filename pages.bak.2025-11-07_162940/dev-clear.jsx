import { useEffect } from "react";
export default function DevClear(){
  useEffect(()=>{
    try{
      localStorage.removeItem("pp.local.products");
      localStorage.removeItem("pp.local.products-v2");
    }catch(e){}
    location.replace("/");
  },[]);
  return <div style={{padding:20,fontFamily:"system-ui"}}>Limpiando productos locales…</div>;
}
