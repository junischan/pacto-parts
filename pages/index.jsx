import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MagicParticles from "../components/MagicParticles";
import BottomMenuIcons from "../components/BottomMenuIcons";
import { supabase } from "../lib/supabase";
import Link from "next/link";

const AppReact = dynamic(() => import("../components/AppReact"), { ssr: true });

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;
  const perPage = 10;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { count } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true });

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error Supabase:', error);
    return { props: { productos: [], currentPage: 1, totalPages: 1 } };
  }

  const productos = JSON.parse(JSON.stringify(data || []));
  const totalPages = Math.ceil(count / perPage);

  return { 
    props: { 
      productos,
      currentPage: page,
      totalPages
    } 
  };
}

export default function Home({ productos, currentPage, totalPages }) {
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

      {/* Paginación */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '40px 20px',
        color: '#fff'
      }}>
        {currentPage > 1 && (
          <Link href={`/?page=${currentPage - 1}`} style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.3s'
          }}>
            ← Anterior
          </Link>
        )}
        
        <span style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px'
        }}>
          Página {currentPage} de {totalPages}
        </span>

        {currentPage < totalPages && (
          <Link href={`/?page=${currentPage + 1}`} style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.3s'
          }}>
            Siguiente →
          </Link>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'rgba(255,255,255,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '20px'
      }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Creado por <strong style={{ color: '#fff' }}>Pacto</strong>
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          tahyi.dev • Powered by IA & café ☕
        </p>
      </div>

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
