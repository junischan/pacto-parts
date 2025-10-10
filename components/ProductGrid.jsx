import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ items = [] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");

  const categorias = useMemo(() => {
    const s = new Set(["Todos"]);
    (items || []).forEach(p => s.add(p.categoria ?? p.category ?? "Otros"));
    return Array.from(s);
  }, [items]);

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

  const chip = (active) => ({
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: active ? "#0ea66c" : "#fff",
    color: active ? "#fff" : "#111",
    fontWeight: 700,
    cursor: "pointer",
  });

  return (
    <div style={{ paddingBottom: 80 }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: "#111", margin: "0 0 12px" }}>
        Catálogo de Repuestos
      </h1>

      <input
        id="searchBox"
        placeholder="Buscar repuesto..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "1px solid #d1d5db",
          outline: "none",
          marginBottom: 12,
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {categorias.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>
        ))}
      </div>

      <div style={{ marginBottom: 12, color: "#374151", fontWeight: 600 }}>
        {list.length} resultados
      </div>

      {/* Masonry simple: dos columnas, las tarjetas evitan romperse */}
      <div style={{ columnCount: 2, columnGap: 14 }}>
        {list.map((p, i) => (
          <div key={p.id || i} style={{ breakInside: "avoid", WebkitColumnBreakInside: "avoid", marginBottom: 14 }}>
            <ProductCard item={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
