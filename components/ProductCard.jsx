import Link from "next/link";
import React from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ item }) {
  const precio = Number(item?.precio || 0);
  const precioFmt = precio > 0 ? new Intl.NumberFormat("es-PY").format(precio) : "Consultar";

  const codigo = item?.codigo ?? item?.codigo_fabricante ?? (item?.titulo?.match(/^([0-9]+)/)?.[1]) ?? (item?.imagen?.match(/[0-9]{5,}/)?.[0]) ?? item?.id ?? item?.code ?? "Sin código";
  const tituloLimpio = (item?.titulo || "").replace(/^\d+-/, "");
  const nombreBonito = tituloLimpio.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  const img = item?.imagen ?? item?.image ?? item?.photo ?? "";
  const categoria = item?.categoria ?? "Otros";

  const whatsapp = `https://wa.me/595971111111?text=Hola!%20Estoy%20interesado%20en%20${encodeURIComponent(nombreBonito)}%20(${codigo})`;

  return (
    <div style={{
      background:"#141a2a",
      color:"#e6e8ee",
      border:"1px solid #243043",
      borderRadius:12,
      overflow: "hidden",
      marginBottom: 6,
      display: "inline-block",
      width: "100%",
      verticalAlign: "top"
    }}>
      {/* IMAGEN */}
      {img ? (
        <Link href={`/productos/${codigo}`}>
          <img
            src={img}
            alt={nombreBonito || "Producto"}
            style={{
              width:"100%",
              height:"auto",
              display:"block",
              background:"#0b1220"
            }}
          />
        </Link>
      ) : (
        <div style={{
          display:"grid", 
          placeItems:"center", 
          padding:"60px 20px", 
          color:"#8aa0b6",
          background:"#0b1220"
        }}>
          Sin imagen
        </div>
      )}

      {/* Contenido */}
      <div style={{ padding: "10px" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#64c8ff" }}>{codigo}</div>
        <div style={{ marginTop:3, fontSize:12, fontWeight:600, color:"#ff9966" }}>{nombreBonito || "Sin título"}</div>

        <div style={{
          fontSize:16, fontWeight:900, margin:"6px 0 8px",
          color: precioFmt === "Consultar" ? "#cbd5e1" : "#ffd700"
        }}>
          {precioFmt === "Consultar" ? "Consultar" : `₲ ${precioFmt}`}
        </div>

        {/* Botones */}
        <div style={{ display:"flex", gap:6 }}>
          <a
            href={whatsapp} target="_blank" rel="noopener noreferrer"
            style={{ 
              flex: 1,
              background:"#25d366", 
              color:"#0b1220", 
              padding:"8px", 
              borderRadius:8, 
              fontWeight:800, 
              fontSize:12, 
              textDecoration:"none", 
              display:"flex", 
              alignItems:"center",
              justifyContent: "center",
              gap:4 
            }}
          >WhatsApp</a>
          <button
            type="button"
            style={{ 
              flex: 1,
              background:"#243043", 
              color:"#fff", 
              padding:"8px", 
              border:"1px solid #64c8ff", 
              borderRadius:8, 
              fontWeight:600, 
              fontSize:12, 
              cursor:"pointer", 
              display:"flex", 
              alignItems:"center",
              justifyContent: "center",
              gap:4 
            }}
            onClick={() => console.log("Add to cart:", codigo)}
          >
            <ShoppingCart size={14} />
            Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
