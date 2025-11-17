"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

const norm = (s) =>
  (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function RelatedStrip({ base, items = [] }) {
  const [page, setPage] = useState(1);
  const perPage = 6;

  if (!base) return null;

  const sameCat = items.filter(
    (p) =>
      p &&
      norm(p.categoria) === norm(base.categoria) &&
      String(p.codigo) !== String(base.codigo)
  );

  if (!sameCat.length) {
    return (
      <div style={{ opacity: 0.7, padding: 12, color: "#94a3b8" }}>
        No hay más productos en <strong>{base.categoria || "esta categoría"}</strong>.
      </div>
    );
  }

  // Paginación
  const totalPages = Math.ceil(sameCat.length / perPage);
  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;
  const currentItems = sameCat.slice(startIdx, endIdx);

  console.log("DEBUG:", { total: sameCat.length, totalPages, page });

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        fontWeight: 700,
        marginBottom: 12,
        color: "#64c8ff",
        fontSize: 16
      }}>
        Más en <strong>{base.categoria}</strong> ({sameCat.length} productos - {totalPages} páginas):
      </div>

      {/* Masonry grid para relacionados */}
      <div style={{
        columnCount: 2,
        columnGap: 8,
        columnFill: 'balance'
      }}>
        {currentItems.map((p) => (
          <div
            key={p.codigo || p.id}
            style={{
              breakInside: "avoid",
              WebkitColumnBreakInside: "avoid",
              marginBottom: 8,
              pageBreakInside: 'avoid'
            }}
          >
            <ProductCard item={p} allProducts={items} />
          </div>
        ))}
      </div>

      {/* Paginación - SIEMPRE VISIBLE PARA DEBUG */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        marginTop: 20,
        padding: '16px 0',
        background: 'rgba(255,0,0,0.1)' // Fondo rojo temporal para ver si existe
      }}>
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          style={{
            padding: '8px 16px',
            background: page <= 1 ? 'rgba(100, 100, 100, 0.3)' : 'rgba(100, 200, 255, 0.1)',
            border: '1px solid rgba(100, 200, 255, 0.3)',
            borderRadius: '8px',
            color: page <= 1 ? '#666' : '#64c8ff',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          ← Anterior
        </button>
        
        <span style={{
          padding: '8px 16px',
          background: 'rgba(100, 200, 255, 0.05)',
          borderRadius: '8px',
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 600
        }}>
          {page} de {totalPages} (total: {sameCat.length})
        </span>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          style={{
            padding: '8px 16px',
            background: page >= totalPages ? 'rgba(100, 100, 100, 0.3)' : 'rgba(100, 200, 255, 0.1)',
            border: '1px solid rgba(100, 200, 255, 0.3)',
            borderRadius: '8px',
            color: page >= totalPages ? '#666' : '#64c8ff',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
