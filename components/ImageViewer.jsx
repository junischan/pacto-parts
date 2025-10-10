export default function ImageViewer({ p = {} }) {
  const titulo = p.titulo ?? p.title ?? p.name ?? "";
  const codigo = p.codigo ?? p.code ?? p.id ?? "";
  const raw = p.imagen ?? p.image ?? p.photo ?? "";
  const src = raw ? (raw.startsWith("/") ? raw : `/${raw}`) : "";

  return (
    <div className="image-viewer" style={{background:"#0b0f19", color:"#e6e8ee"}}>
      {src ? (
        <img
          src={src}
          alt={titulo || codigo || "producto"}
          style={{ width:"100%", height:"auto", display:"block" }}
        />
      ) : null}

      <div className="caption" style={{ padding:"8px 4px" }}>
        <div className="t" style={{ fontWeight:700 }}>{titulo || codigo || "Producto"}</div>
        <div className="meta" style={{ opacity:.85, fontSize:12 }}>
          {codigo ? `Código: ${codigo}` : ""}
        </div>
      </div>
    </div>
  );
}
