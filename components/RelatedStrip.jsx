import ProductCard from "./ProductCard";

export default function RelatedStrip({ base, items = [], onClick }) {
  if (!base) return null;

  const sameCat = items.filter(
    (p) => p.categoria && base.categoria &&
           p.categoria.toLowerCase() === base.categoria.toLowerCase() &&
           p.codigo !== base.codigo
  );

  return (
    <section className="related" id="related">
      <h2>
        Seleccionado: {base.descripcion || base.codigo} — Categoría: {base.categoria || "N/D"}
      </h2>

      {sameCat.length > 0 ? (
        <>
          <p style={{margin:"6px 0 10px", opacity:.8}}>
            Más en <strong>{base.categoria}</strong>:
          </p>
          <div className="related-row">
            {sameCat.map((p) => (
              <ProductCard key={p.codigo} producto={p} onClick={onClick} />
            ))}
          </div>
        </>
      ) : (
        <p style={{margin:"8px 2px 0", opacity:.8}}>
          No hay más productos en <strong>{base.categoria || "esta categoría"}</strong>.
        </p>
      )}
    </section>
  );
}
