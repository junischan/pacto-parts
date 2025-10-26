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
      <div style={{ marginBottom: 8, paddingLeft: 8, color: "#374151", fontWeight: 600, fontSize: 14 }}>
        {list.length} resultados
      </div>

      <div style={{ 
        columnCount: 2, 
        columnGap: 4,
        columnFill: 'balance',
        paddingLeft: 2,
        paddingRight: 2
      }}>
        {list.map((p, i) => (
          <div key={p.id || i} style={{ 
            breakInside: "avoid", 
            WebkitColumnBreakInside: "avoid", 
            marginBottom: 4,
            pageBreakInside: 'avoid'
          }}>
            <ProductCard item={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
