import React, { useEffect, useRef, useState } from "react";
import { Home, Search, SquarePlus, MessageCircle, UserRound } from "lucide-react";

const styles = {
  bar: {
    position: "fixed",
    left: "50%",
    bottom: 12,
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    width: "90%",
    maxWidth: 680,
    padding: "6px 12px",
    background: "linear-gradient(90deg,#e11d48 0%, #ffffff 50%, #2563eb 100%)",
    borderRadius: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,.12)",
    zIndex: 40,

    /* animación para mostrar/ocultar */
    transition: "transform .25s ease, opacity .25s ease",
  },
  hidden: {
    transform: "translate(-50%, 120%)",
    opacity: 0,
    pointerEvents: "none",
  },
  side: { display: "flex", alignItems: "center", gap: 18 },
  btn: {
    width: 36, height: 36, borderRadius: 9999,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "transparent", border: "none",
  },
  icon: { color: "#111" },
  fabWrap: { display: "flex", alignItems: "center", justifyContent: "center" },
  fab: {
    width: 54, height: 54, borderRadius: 12, background: "#fff",
    border: "2px solid rgba(59,130,246,.85)",
    boxShadow: "0 6px 16px rgba(0,0,0,.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  fabIcon: { color: "#ef4444" },
};

export default function BottomMenuIcons({ onChange = () => {}, autoHide = true }) {
  const go = (tab) => onChange && onChange(tab);

  // ---- Auto-ocultar en scroll ----
  const lastY = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoHide) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        // si baja más de 6px -> ocultar, si sube -> mostrar
        if (y > lastY.current + 6) setVisible(false);
        else if (y < lastY.current - 6) setVisible(true);
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [autoHide]);

  return (
    <div style={{ ...styles.bar, ...(visible ? {} : styles.hidden) }}>
      <div style={styles.side}>
        <button aria-label="Inicio" style={styles.btn} onClick={() => go("home")}>
          <Home size={22} style={styles.icon} />
        </button>
        <button aria-label="Buscar" style={styles.btn} onClick={() => go("search")}>
          <Search size={22} style={styles.icon} />
        </button>
      </div>

      <div style={styles.fabWrap}>
        <button aria-label="Publicar" style={styles.fab} onClick={() => { try { window.location.href = "/publicar"; } catch(e){} }}>
          <SquarePlus size={24} style={styles.fabIcon} />
        </button>
      </div>

      <div style={styles.side}>
        <button aria-label="Mensajes" style={styles.btn} onClick={() => go("chat")}>
          <MessageCircle size={22} style={styles.icon} />
        </button>
        <button aria-label="Perfil" style={styles.btn} onClick={() => { if (typeof window !== "undefined") window.location.href = "/profile"; }}>
          <UserRound size={22} style={styles.icon} />
        </button>
      </div>
    </div>
  );
}
