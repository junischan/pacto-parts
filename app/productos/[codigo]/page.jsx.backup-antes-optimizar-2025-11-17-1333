import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import RelatedStrip from "../../../components/RelatedStrip";

export default async function Producto({ params }) {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error Supabase:', error);
    return <div style={{padding:16, color:"#e6e8ee"}}>Error cargando producto</div>;
  }

  const producto = productos.find(p => String(p.codigo) === params.codigo);

  if (!producto) {
    return (
      <div style={{
        padding: 20,
        color: "#e6e8ee",
        background: "linear-gradient(to bottom, #0b1220 0%, #1a2332 100%)",
        minHeight: "100vh"
      }}>
        <p style={{fontSize: 18, marginBottom: 16}}>⚙️ Producto no encontrado</p>
        <Link href="/" style={{
          color: "#64c8ff",
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 600
        }}>← Volver al catálogo</Link>
      </div>
    );
  }

  const precioFmt = producto.precio > 0 
    ? new Intl.NumberFormat("es-PY").format(producto.precio) 
    : "Consultar";
    
  const wa = `https://wa.me/595971111111?text=${encodeURIComponent(
    `Hola! Estoy interesado en ${producto.titulo} (${producto.codigo})`
  )}`;

  const imagen = producto.imagen_url || producto.imagen || "";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #0b1220 0%, #1a2332 50%, #0f1a2e 100%)",
      color: "#e6e8ee"
    }}>
      {/* Header fijo */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(11, 18, 32, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "2px solid rgba(100, 200, 255, 0.2)",
        padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
      }}>
        <Link href="/" style={{
          color: "#64c8ff",
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: 6
        }}>
          <span style={{fontSize: 18}}>←</span> Volver
        </Link>
      </div>

      {/* Container principal */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0"
      }}>
        {/* Imagen hero fullwidth */}
        <div style={{
          position: "relative",
          width: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          maxHeight: "70vh"
        }}>
          {imagen ? (
            <img 
              src={imagen} 
              alt={producto.titulo}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "contain",
                display: "block"
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: 16,
              fontWeight: 600
            }}>
              📷 Sin imagen disponible
            </div>
          )}
        </div>

        {/* Contenido con padding lateral */}
        <div style={{padding: "20px 16px"}}>
          {/* Badge de categoría */}
          <div style={{
            display: "inline-block",
            background: "rgba(100, 200, 255, 0.15)",
            border: "1px solid rgba(100, 200, 255, 0.3)",
            borderRadius: 16,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: "#64c8ff",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 12
          }}>
            {producto.categoria || "Repuesto"}
          </div>

          {/* Título más pequeño */}
          <h1 style={{
            fontSize: 22,
            lineHeight: 1.3,
            fontWeight: 800,
            margin: "0 0 10px 0",
            color: "#fff"
          }}>
            {producto.titulo}
          </h1>

          {/* Código */}
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#94a3b8",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span style={{color: "#64c8ff"}}>Código:</span>
            <span style={{
              background: "rgba(100, 200, 255, 0.1)",
              padding: "3px 8px",
              borderRadius: 6,
              fontFamily: "monospace",
              fontSize: 13
            }}>{producto.codigo}</span>
          </div>

          {/* Precio más compacto */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)",
            border: "2px solid rgba(255, 215, 0, 0.3)",
            borderRadius: 12,
            padding: "14px",
            marginBottom: 20,
            boxShadow: "0 4px 16px rgba(255, 215, 0, 0.1)"
          }}>
            <div style={{
              fontSize: 12,
              color: "#cbd5e1",
              marginBottom: 4,
              fontWeight: 600
            }}>Precio</div>
            <div style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#ffd700",
              letterSpacing: "-0.5px"
            }}>
              {precioFmt === "Consultar" ? "Consultar" : `₲ ${precioFmt}`}
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 28
          }}>
            <a 
              href={wa} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(135deg, #25d366 0%, #1ea952 100%)",
                color: "#fff",
                padding: "14px",
                borderRadius: 10,
                textAlign: "center",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 4px 16px rgba(37, 211, 102, 0.3)"
              }}
            >
              💬 WhatsApp
            </a>
            <button
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                color: "#64c8ff",
                border: "2px solid #64c8ff",
                padding: "14px",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 4px 16px rgba(100, 200, 255, 0.2)"
              }}
            >
              🛒 Carrito
            </button>
          </div>

          {/* Marca si existe */}
          {producto.marca && (
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(100, 200, 255, 0.2)",
              borderRadius: 10,
              padding: "12px",
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 4,
                fontWeight: 600
              }}>Marca</div>
              <div style={{
                fontSize: 14,
                color: "#e2e8f0",
                fontWeight: 700,
                textTransform: "uppercase"
              }}>{producto.marca}</div>
            </div>
          )}

          {/* Productos relacionados */}
          <div style={{marginTop: 40}}>
            <h2 style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 16,
              color: "#fff"
            }}>
              Productos relacionados
            </h2>
            <RelatedStrip base={producto} items={productos} />
          </div>
        </div>
      </div>
    </div>
  );
}
