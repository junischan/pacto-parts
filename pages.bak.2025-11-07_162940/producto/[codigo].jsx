import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export async function getServerSideProps({ params }){
  const p = path.join(process.cwd(), "data", "products.json");
  const arr = JSON.parse(await fs.readFile(p, "utf8").catch(()=> "[]"));
  const prod = arr.find(x => (x.codigo || x.id) == decodeURIComponent(params.codigo)) || null;
  return { props: { prod } };
}

export default function Product({ prod }){
  if(!prod) return <main style={{padding:16}}><h1>Producto no encontrado</h1><Link href="/">Volver</Link></main>;
  return (
    <main style={{maxWidth:960,margin:"0 auto",padding:16,display:"grid",gap:16,gridTemplateColumns:"1fr 1fr"}}>
      <div style={{background:"#f3f5f9",aspectRatio:"4/3"}}>
        {prod.imagen
          ? <img src={prod.imagen} alt={prod.descripcion} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>Sin imagen</div>}
      </div>
      <div>
        <h1 style={{marginTop:0}}>{prod.descripcion}</h1>
        <div style={{opacity:.7}}>Código: {prod.codigo || "—"}</div>
        <div style={{margin:"10px 0 16px",color:"#0a7",fontWeight:700,fontSize:20}}>
          {prod.precio ? Number(prod.precio).toLocaleString("es-PY")+" Gs." : "Consultar"}
        </div>
        <a href={`https://wa.me/595991234567?text=${encodeURIComponent(`Hola, me interesa ${prod.descripcion} (código ${prod.codigo}).`)}`} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"10px 14px",border:"1px solid #d7deea",borderRadius:10,textDecoration:"none"}}>Consultar por WhatsApp</a>
        <div style={{marginTop:18}}><Link href="/">Volver al catálogo</Link></div>
      </div>
    </main>
  );
}
