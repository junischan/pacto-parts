import { useMemo } from "react";

export default function SearchBar({ items = [], q, setQ, cat, setCat }) {
  const categorias = useMemo(() => {
    const s = new Set(["Todos"]);
    (items || []).forEach(p => s.add(p.categoria ?? p.category ?? "Otros"));
    return Array.from(s);
  }, [items]);

  const chip = (active) => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: active ? "2px solid rgba(14, 166, 108, 0.8)" : "1px solid rgba(255, 255, 255, 0.4)",
    background: "transparent",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "13px",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)"
  });

  return (
    <>
      <input
        id="searchBox"
        placeholder="Buscar repuesto..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.4)",
          outline: "none",
          marginBottom: 8,
          background: "transparent",
          fontSize: "14px",
          color: "#fff",
          fontWeight: 500
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {categorias.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>
        ))}
      </div>
    </>
  );
}
