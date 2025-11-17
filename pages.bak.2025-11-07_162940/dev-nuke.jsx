import { useEffect } from "react";
export default function Nuke(){
  useEffect(()=>{ try{ localStorage.clear(); }catch(e){} location.replace("/"); },[]);
  return <div style={{padding:20,fontFamily:"system-ui"}}>Limpiando almacenamiento local…</div>;
}
