export default function ProductCard(props) {
  // Acepta ambos formatos: <ProductCard {...it}/> o <ProductCard item={it}>
  const item = props.item || props;

  const {
    id,
    titulo = "Sin título",
    precio = 0,
    imagen = ""
  } = item || {};

  // Usamos SIEMPRE ruta relativa para evitar problemas de SSR/Hydration.
  // Si no empieza con /uploads, la normalizamos.
  const srcRel =
    typeof imagen === "string" && imagen.length > 0
      ? (imagen.startsWith("/uploads/") ? imagen : `/uploads/${imagen}`)
      : "";

  return (
    <article className="card" data-id={id}>
      <div
        className="thumb"
        style={{
          ,
          background: "#f4f6f8",
          borderRadius: 8,
          overflow: "hidden"
        }}
      >
        {srcRel ? (
          <img
            src={srcRel}
            alt={titulo}
            loading="lazy"
            style={{ width: "100%", , , display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              ,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa3ab",
              fontSize: 16
            }}
          >
            Sin imagen
          </div>
        )}
      </div>

      <div className="body" style={{ padding: "10px 8px" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{titulo}</h3>
        <div style={{ marginTop: 6, color: "#0a8f3f", fontWeight: 700 }}>
          ₲ {Number(precio || 0).toLocaleString("es-PY")}
        </div>
      </div>
    </article>
  );
}
