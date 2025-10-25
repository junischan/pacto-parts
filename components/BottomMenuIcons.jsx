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
    gap: 16,
    width: "90%",
    maxWidth: 680,
    padding: "8px",
    background: "transparent",
    zIndex: 40,
    transition: "transform .25s ease, opacity .25s ease",
  },
  hidden: {
    transform: "translate(-50%, 120%)",
    opacity: 0,
    pointerEvents: "none",
  },
  side: { display: "flex", alignItems: "center", gap: 14 },
  btn: {
    width: 54, 
    height: 54, 
    borderRadius: "50%",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    background: "radial-gradient(circle at 30% 30%, rgba(100, 200, 255, 0.4), rgba(30, 80, 150, 0.3))", 
    border: "none",
    boxShadow: "0 0 25px rgba(100, 200, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.25)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    position: "relative",
  },
  runeCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "3px solid rgba(100, 200, 255, 0.6)",
    borderRadius: "50%",
    borderStyle: "dashed",
    borderDasharray: "8 8",
    animation: "rotateRune 8s linear infinite",
  },
  icon: { 
    color: "#e8f4ff",
    filter: "drop-shadow(0 0 12px rgba(100, 200, 255, 1))",
    position: "relative",
    zIndex: 1,
  },
  fabWrap: { display: "flex", alignItems: "center", justifyContent: "center" },
  fab: {
    width: 72, 
    height: 72, 
    borderRadius: "50%", 
    background: "radial-gradient(circle at 30% 30%, #10b981, #059669, #047857)",
    border: "none",
    boxShadow: "0 0 35px rgba(16, 185, 129, 0.9), 0 0 60px rgba(255, 215, 0, 0.6), 0 6px 20px rgba(0, 0, 0, 0.6), inset 0 3px 8px rgba(255, 255, 255, 0.35)",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    transition: "all 0.35s ease",
    cursor: "pointer",
    position: "relative",
  },
  fabRuneOuter: {
    position: "absolute",
    width: "110%",
    height: "110%",
    border: "4px solid rgba(255, 215, 0, 0.8)",
    borderRadius: "50%",
    borderStyle: "dotted",
    borderDasharray: "3 6",
    animation: "rotateRune 6s linear infinite",
  },
  fabRuneInner: {
    position: "absolute",
    width: "90%",
    height: "90%",
    border: "3px solid rgba(255, 215, 0, 0.6)",
    borderRadius: "50%",
    borderStyle: "dashed",
    borderDasharray: "6 6",
    animation: "rotateRuneReverse 8s linear infinite",
  },
  fabGlow: {
    position: "absolute",
    width: "130%",
    height: "130%",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255, 215, 0, 0.5), transparent 60%)",
    animation: "pulse 2.5s ease-in-out infinite",
  },
  fabIcon: { 
    color: "#fff",
    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 1))",
    position: "relative",
    zIndex: 1,
  },
};

export default function BottomMenuIcons({ onChange, autoHide = true }) {
  const go = (tab) => onChange && onChange(tab);
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
    <>
      <style jsx>{`
        @keyframes rotateRune {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateRuneReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
      `}</style>
      <div style={{ ...styles.bar, ...(visible ? {} : styles.hidden) }}>
        <div style={styles.side}>
          <button 
            aria-label="Inicio" 
            style={styles.btn} 
            onClick={() => go("home")}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(100, 200, 255, 0.9), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(100, 200, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div style={styles.runeCircle}></div>
            <Home size={24} style={styles.icon} />
          </button>
          <button 
            aria-label="Buscar" 
            style={styles.btn} 
            onClick={() => go("search")}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(100, 200, 255, 0.9), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(100, 200, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div style={styles.runeCircle}></div>
            <Search size={24} style={styles.icon} />
          </button>
        </div>
        <div style={styles.fabWrap}>
          <button 
            aria-label="Publicar" 
            style={styles.fab} 
            onClick={() => { try { window.location.href = "/publicar"; } catch(e){} }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.92) rotate(90deg)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            }}
          >
            <div style={styles.fabGlow}></div>
            <div style={styles.fabRuneOuter}></div>
            <div style={styles.fabRuneInner}></div>
            <SquarePlus size={32} style={styles.fabIcon} />
          </button>
        </div>
        <div style={styles.side}>
          <button 
            aria-label="Mensajes" 
            style={styles.btn} 
            onClick={() => go("chat")}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(100, 200, 255, 0.9), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(100, 200, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div style={styles.runeCircle}></div>
            <MessageCircle size={24} style={styles.icon} />
          </button>
          <button 
            aria-label="Perfil" 
            style={styles.btn} 
            onClick={() => { if (typeof window !== "undefined") window.location.href = "/profile"; }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(100, 200, 255, 0.9), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(100, 200, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)";
            }}
          >
            <div style={styles.runeCircle}></div>
            <UserRound size={24} style={styles.icon} />
          </button>
        </div>
      </div>
    </>
  );
}
