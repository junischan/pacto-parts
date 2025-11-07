import Link from "next/link";
import React from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ item }) {
  const precio = Number(item?.precio || 0);
  const precioFmt = precio > 0 ? new Intl.NumberFormat("es-PY").format(precio) : "Consultar";
  const codigo = item?.codigo || "Sin código";
  const nombreBonito = item?.titulo
    ? item.titulo.replace(/^[^-]+-/, "").replace(/-/g, " ").replace(/\s+/g, " ").trim()
    : "Sin nombre";

  const img = item?.imagen_url ?? "";
  const whatsapp = `https://wa.me/595XXXXXXXXX?text=Me%20interesa%20el%20producto%20${encodeURIComponent(codigo)}`;

  return (
    <div style={{ background: "#141a2a", color: "#e6e8ee", border: "1px solid #243043", borderRadius: 12, overflow: "hidden", marginBottom: 6, width: "100%" }}>
      {img ? (
        <Link href={`/productos/${encodeURIComponent(codigo)}`}>
          <img src={img} alt={nombreBonito} style={{ width: "100%", height: "auto", background: "#0b1220" }} />
        </Link>
      ) : (
        <div style={{ display: "grid", placeItems: "center", padding: "60px 20px", color: "#8aa0b6", background: "#0b1220" }}>
          Sin imagen
        </div>
      )}
      <div style={{ padding: "10px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#64c8ff" }}>{codigo}</div>
        <div style={{ marginTop: 3, fontSize: 12, fontWeight: 600, color: "#ff9966" }}>{nombreBonito}</div>
        <div style={{ fontSize: 16, fontWeight: 900, margin: "6px 0 8px", color: precioFmt === "Consultar" ? "#cbd5e1" : "#ffd700" }}>
          {precioFmt === "Consultar" ? "Consultar" : `₲ ${precioFmt}`}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "#25d366", color: "#0b1220", padding: "8px", borderRadius: 8, fontWeight: 800, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            WhatsApp
          </a>
          <button type="button" style={{ flex: 1, background: "#243043", color: "#fff", padding: "8px", border: "1px solid #64c8ff", borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart size={14} /> Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
