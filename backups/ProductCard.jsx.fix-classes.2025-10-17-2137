import { MessageCircle, ShoppingCart } from "lucide-react";

export default function ProductCard({ item }) {
  if (!item) return null;

  const codigo = item.codigo ?? item.code ?? "Sin código";
  const titulo = item.titulo ?? item.title ?? item.name ?? "Sin título";
  const precio = item.precio ?? item.price ?? item.priceGs ?? 0;
  const img = item.imagen ?? item.image ?? item.photo ?? "";
  const precioFmt = new Intl.NumberFormat("es-PY").format(precio);

  const whatsapp = `https://wa.me/595971111111?text=Hola!%20Estoy%20interesado%20en%20${encodeURIComponent(titulo)}%20(${codigo})`;

  return (
    <div style={{
      background:"transparent",
      border:"none",
      boxShadow:"none",
      color:"#0b1730",
      marginBottom:"14px",
    }}>
      {img && (
        <img
          src={img}
          alt={titulo}
          loading="lazy"
          style={{
            display:"block",
            width:"100%",
            height:"auto",
            borderRadius:10,
            background:"#fff"
          }}
        />
      )}

      <div style={{textAlign:"center", padding:"8px 4px"}}>
        <div className="pin-price" style={{ fontWeight:800, fontSize:15 }}>
          {codigo}
        </div>
        <div className="pin-meta" style={{ fontSize:13, marginTop:3 }}>
          {titulo}
        </div>
        <div className="pin-title" style={{ marginTop:5, fontSize:14 }}>
          ₲ {precioFmt}
        </div>

        <div style={{
          marginTop:8,
          display:"flex",
          justifyContent:"center",
          gap:10,
        }}>
          <a
            href={whatsapp}
            target="_blank" rel="noopener noreferrer"
            style={{
              background:"#25d366",
              color:"#000",
              padding:"5px 10px",
              borderRadius:8,
              fontWeight:600,
              fontSize:12,
              textDecoration:"none",
              display:"flex",
              alignItems:"center",
              gap:4
            }}
          >
            <MessageCircle size={14} color="#000" />
            WhatsApp
          </a>

          <button
            style={{
              background:"#111827",
              color:"#fff",
              padding:"5px 10px",
              border:"1px solid #25d366",
              borderRadius:8,
              fontWeight:600,
              fontSize:12,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              gap:4
            }}
          >
            <ShoppingCart size={14} color="#fff" />
            Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
