import React from "react";
import { Home, Search, SquarePlus, MessageCircle, UserRound } from "lucide-react";

const SIZES = { barH: 64, icon: 22 };

const styles = {
  bar: {
    position: "fixed",
    left: "50%",
    bottom: 16,
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "92vw",
    maxWidth: 640,
    height: SIZES.barH,
    padding: "10px 14px",
    borderRadius: 22,
    background:
      "linear-gradient(90deg, rgba(220,38,38,.85) 0%, rgba(255,255,255,.92) 50%, rgba(37,99,235,.85) 100%)",
    boxShadow: "0 12px 30px rgba(0,0,0,.18)",
    backdropFilter: "blur(6px)",
    zIndex: 50,
  },
  btn: (active) => ({
    width: 44,
    height: 44,
    borderRadius: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: active ? "rgba(0,0,0,.06)" : "transparent",
  }),
  icon: (active) => ({ color: active ? "#0a0a0a" : "#374151" }),
  publishWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    marginTop: -20, // queda un poquito “flotando”
  },
  publishBtn: {
    width: 58,
    height: 58,
    borderRadius: 9999,
    border: "none",
    background: "#10b981",
    color: "#fff",
    boxShadow: "0 10px 20px rgba(16,185,129,.35)",
  },
};

export default function BottomMenuIcons({
  active = "home",
  hidden = false,
  onChange = () => {},
}) {
  if (hidden) return null;

  const go = (tab) => onChange && onChange(tab);

  const Item = ({ id, Icon, label, onClick }) => (
    <button
      aria-label={label}
      onClick={onClick}
      style={styles.btn(active === id)}
    >
      <Icon size={SIZES.icon} style={styles.icon(active === id)} />
    </button>
  );

  const handlePublish = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/nuevo"; // SOLO esto: ir a /nuevo
    }
  };

  return (
    <nav style={styles.bar}>
      <Item id="home" Icon={Home} label="Inicio" onClick={() => go("home")} />
      <Item id="search" Icon={Search} label="Buscar" onClick={() => go("search")} />

      <div style={styles.publishWrap}>
        <button aria-label="Publicar" onClick={handlePublish} style={styles.publishBtn}>
          <SquarePlus size={24} />
        </button>
      </div>

      <Item id="chat" Icon={MessageCircle} label="Mensajes" onClick={() => go("chat")} />
      <Item id="profile" Icon={UserRound} label="Perfil" onClick={() => go("profile")} />
    </nav>
  );
}
