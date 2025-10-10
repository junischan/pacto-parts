import { useEffect, useState } from "react";

export default function DevForceSync(){
  const [msg, setMsg] = useState("Sincronizando…");
  useEffect(() => {
    (async () => {
      try{
        const res = await fetch("/api/products");
        const data = await res.json();
        localStorage.setItem("pp.local.products", JSON.stringify(data));
        setMsg(`OK: ${data.length ?? 0} items guardados. Redirigiendo…`);
        setTimeout(() => { location.href = "/"; }, 800);
      }catch(e){
        console.error(e);
        setMsg("Error sincronizando. Probá /api/products en el navegador.");
      }
    })();
  }, []);
  return (
    <div style={{padding:16,fontFamily:"sans-serif"}}>
      <h1>Dev Force Sync</h1>
      <p>{msg}</p>
      <p><a href="/">Volver al inicio</a></p>
    </div>
  );
}
