import { useMemo } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ items = [], q = "", cat = "Todos" }) {
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items || []).filter(p => {
      const c = p.categoria ?? p.category ?? "Otros";
      const titulo = (p.titulo ?? p.title ?? p.name ?? "").toLowerCase();
      const hitCat = cat === "Todos" ? true : c === cat;
      const hitQ = !needle ? true : titulo.includes(needle);
      return hitCat && hitQ;
    });
  }, [items, q, cat]);

  return (
    <div style={{ paddingBottom: 80, paddingTop: 0 }}>
      <div style={{ 
        marginBottom: 8, 
        paddingLeft: 4, 
        color: "#94a3b8", 
        fontWeight: 600, 
        fontSize: 14 
      }}>
        {list.length} resultados
      </div>

      {/* Masonry con columnas adaptables */}
      <style jsx>{`
        @media (max-width: 640px) and (orientation: portrait) {
          .masonry-grid { column-count: 2; }
        }
        @media (min-width: 640px) and (orientation: landscape),
               (min-width: 768px) {
          .masonry-grid { column-count: 4; }
        }
        @media (min-width: 1024px) {
          .masonry-grid { column-count: 5; }
        }
      `}</style>

      <div className="masonry-grid" style={{ 
        columnGap: 4,
        columnFill: 'balance',
        padding: 0
      }}>
        {list.map((p, i) => (
          <div 
            key={p.id || p.codigo || i} 
            style={{ 
              breakInside: "avoid",
              WebkitColumnBreakInside: "avoid",
              marginBottom: 4,
              pageBreakInside: 'avoid'
            }}
          >
            <ProductCard item={p} allProducts={items} />
          </div>
        ))}
      </div>
    </div>
  );
}
