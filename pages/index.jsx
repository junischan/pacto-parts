import Banner from "../components/Banner";
import fs from "fs";
import path from "path";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MagicParticles from "../components/MagicParticles";
import BottomMenuIcons from "../components/BottomMenuIcons";

const AppReact = dynamic(() => import("../components/AppReact"), { ssr: true });

function normalize(p){
  return {
    id: p.id ?? null,
    titulo: p.titulo ?? p.title ?? p.name ?? "Sin título",
    precio: p.precio ?? p.price ?? p.priceGs ?? 0,
    imagen: p.imagen ?? p.image ?? p.photo ?? "",
    categoria: p.categoria ?? p.category ?? "Otros",
  };
}

export async function getServerSideProps() {
  const file = path.join(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  const productos = Array.isArray(data) ? data.map(normalize) : [];
  return { props: { productos } };
}

export default function Home({ productos }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab) => {
    console.log("Tab changed:", tab);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      paddingBottom: 100
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '45vh',
        borderRadius: '0 0 14px 14px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        backgroundColor: '#1a1a1a',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 1.2s ease-in-out'
      }}>
        <div style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s ease-out',
          width: '100%',
          height: '100%',
          position: 'relative',
          animation: 'float 6s ease-in-out infinite'
        }}>
          <Image
            src="/pacto-banner.jpg"
            alt="Pacto.parts banner"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <MagicParticles />
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 10
        }}>
          <SearchBar items={productos} q={q} setQ={setQ} cat={cat} setCat={setCat} />
        </div>
      </div>
      <AppReact base={productos} q={q} cat={cat} />
      
      <BottomMenuIcons onChange={handleTabChange} autoHide={true} />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(${scrollY * 0.3}px);
          }
          50% {
            transform: translateY(${scrollY * 0.3 - 8}px);
          }
        }
      `}</style>
    </div>
  );
}
