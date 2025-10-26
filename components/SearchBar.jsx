import { useMemo, useEffect, useRef, useState } from "react";

export default function SearchBar({ items = [], q, setQ, cat, setCat }) {
  const categorias = useMemo(() => {
    const s = new Set(["Todos"]);
    (items || []).forEach(p => s.add(p.categoria ?? p.category ?? "Otros"));
    return Array.from(s);
  }, [items]);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const animationRef = useRef(null);

  // Auto-scroll continuo MÁS RÁPIDO
  useEffect(() => {
    if (!autoScroll || isDragging) return;

    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 2; // Era 0.5, ahora 2 (4x más rápido)
        
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoScroll, isDragging]);

  const handleTouchStart = () => {
    setIsDragging(true);
    setAutoScroll(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 3000);
  };

  const handleCategoryClick = (c) => {
    setAutoScroll(false);
    setCat(c);
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const chip = (active) => ({
    padding: "6px 16px",
    borderRadius: 999,
    border: active ? "2px solid rgba(14, 166, 108, 0.8)" : "1px solid rgba(255, 255, 255, 0.4)",
    background: active ? "rgba(14, 166, 108, 0.2)" : "transparent",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "13px",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
    whiteSpace: "nowrap",
    flexShrink: 0
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

      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          paddingBottom: 4
        }}
      >
        {[...categorias, ...categorias, ...categorias].map((c, i) => (
          <button key={`${c}-${i}`} onClick={() => handleCategoryClick(c)} style={chip(cat === c)}>
            {c}
          </button>
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
