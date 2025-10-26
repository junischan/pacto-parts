import fs from "fs";
import path from "path";
import Link from "next/link";
// Import relativo desde /app/productos/[codigo]/ hacia /components
import RelatedStrip from "../../../components/RelatedStrip";

export default async function Producto({ params }) {
  // Leer productos reales
  const filePath = path.join(process.cwd(), "data", "products.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const productos = JSON.parse(jsonData);

  const producto = productos.find(p => String(p.codigo) === params.codigo);

  if (!producto) {
    return (
      <div style={{padding:16, color:"#e6e8ee", background:"#0b1220", minHeight:"100vh"}}>
        <p>⚙️ Producto no encontrado</p>
        <Link href="/" style={{color:"#64c8ff"}}>← Volver</Link>
      </div>
    );
  }

  const precioFmt = new Intl.NumberFormat("es-PY").format(producto.precio ?? 0);
  const wa = `https://wa.me/595971111111?text=${encodeURIComponent(
    `Hola! Estoy interesado en ${producto.titulo} (${producto.codigo})`
  )}`;

  return (
    <div style={{padding:16, color:"#e6e8ee", background:"#0b1220", minHeight:"100vh"}}>
      <Link href="/" style={{color:"#64c8ff"}}>← Volver</Link>

      {/* Imagen grande */}
      <div style={{marginTop:12}}>
        <img src={producto.imagen} alt={producto.titulo} style={{width:"100%", borderRadius:16}} />
      </div>

      {/* Info principal */}
      <h1 style={{marginTop:12, fontSize:28, lineHeight:1.1, fontWeight:800}}>
        {producto.titulo}
      </h1>
      <div style={{opacity:.75, marginTop:4}}>
        {producto.categoria || "Otros"}
      </div>
      <div style={{marginTop:8, color:"#ffd700", fontWeight:900, fontSize:20}}>
        ₲ {precioFmt}
      </div>

      {/* Botones */}
      <div style={{display:"flex", gap:8, marginTop:12}}>
        <a href={wa} target="_blank"
           style={{flex:1,background:"#25d366",padding:12,borderRadius:12,textAlign:"center",color:"#0b1220",fontWeight:800}}>
          WhatsApp
        </a>
        <button
          style={{flex:1,background:"#141a2a",border:"1px solid #243043",padding:12,borderRadius:12,color:"#e6e8ee",fontWeight:800}}>
          🛒 Carrito
        </button>
      </div>

      {/* 🔥 Productos relacionados por categoría (tu componente) */}
      <div style={{marginTop:28}}>
        <RelatedStrip base={producto} items={productos} />
      </div>
    </div>
  );
}
