export default function ProductModal({ open=false, item=null, phone="+595981000000", onClose=()=>{} }){
  if(!open || !item) return null;

  const price = new Intl.NumberFormat("es-PY").format(item.precio||0);
  const whatstext = encodeURIComponent(
    `Hola, vi este repuesto en PactoParts:\n`+
    `• Código: ${item.codigo||"-"}\n`+
    `• Descripción: ${item.descripcion||"-"}\n`+
    `• Precio: ${price} Gs.\n\n¿Sigue disponible?`
  );
  const wa = `https://wa.me/${phone.replace(/\D/g,"")}?text=${whatstext}`;

  return (
    <div className="mmask" onClick={onClose}>
      <div className="mbox" onClick={e=>e.stopPropagation()}>
        <div className="mimg">
          {item.imagen
            ? <img src={item.imagen} alt={item.descripcion||"Producto"} loading="lazy"/>
        </div>
        <div className="mbody">
          <h2 className="mtitle">{item.descripcion||"Producto"}</h2>
          <div className="mmeta">
            {item.categoria && <span className="mchip">{item.categoria}</span>}
            {item.codigo && <span className="mchip">Cod: {item.codigo}</span>}
          </div>
          <div className="mprice">{price} Gs.</div>

          <div className="mactions">
            <a className="btn btn-wa" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
            <button className="btn" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
