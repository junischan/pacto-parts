import { useEffect, useRef, useState } from "react";

export default function CategoryBar({ items = [], selected = "Todos", onChange }) {
  const cats = ["Todos", ...new Set(items.map(p => p.categoria ?? p.category ?? "Otros"))];
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const animationRef = useRef(null);

  // Auto-scroll continuo
  useEffect(() => {
    if (!autoScroll || isDragging) return;

    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        
        // Reset al inicio cuando llega al final
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [autoScroll, isDragging]);

  // Detener auto-scroll al interactuar
  const handleTouchStart = () => {
    setIsDragging(true);
    setAutoScroll(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Reanudar auto-scroll después de 3 segundos
    setTimeout(() => setAutoScroll(true), 3000);
  };

  const handleCategoryClick = (cat) => {
    setAutoScroll(false);
    onChange(cat);
    // Reanudar después de 5 segundos
    setTimeout(() => setAutoScroll(true), 5000);
  };

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      padding: '12px 0',
      background: 'rgba(10, 20, 40, 0.6)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(100, 200, 255, 0.2)'
    }}>
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0 16px',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        {/* Duplicar categorías para efecto infinito */}
        {[...cats, ...cats, ...cats].map((cat, i) => (
          <button
            key={`${cat}-${i}`}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: selected === cat ? '2px solid #64c8ff' : '1px solid rgba(100, 200, 255, 0.3)',
              background: selected === cat 
                ? 'linear-gradient(135deg, rgba(100, 200, 255, 0.3), rgba(30, 80, 150, 0.3))'
                : 'rgba(20, 30, 50, 0.6)',
              color: selected === cat ? '#64c8ff' : '#a0d8ff',
              fontSize: 14,
              fontWeight: selected === cat ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              boxShadow: selected === cat 
                ? '0 0 15px rgba(100, 200, 255, 0.5)' 
                : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
