import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import BottomMenuIcons from "./BottomMenuIcons";

function normalize(p){
  return {
    id: p?.id ?? null,
    titulo: p?.titulo ?? p?.title ?? p?.name ?? "Sin título",
    precio: p?.precio ?? p?.price ?? p?.priceGs ?? 0,
    imagen: p?.imagen ?? p?.image ?? p?.photo ?? "",
    categoria: p?.categoria ?? p?.category ?? "Otros",
  };
}

function getLocalProducts(){
  try{
    const raw = JSON.parse(localStorage.getItem("pp.local.products")||"[]");
    return Array.isArray(raw)? raw.map(normalize) : [];
  }catch{ return []; }
}


function onMenuChange(tab){
  try{
    const t = String(tab||"").toLowerCase().trim();

    // Home → ir arriba
    if (t === "home"){
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // Buscar → enfocar buscador de arriba
    if (t === "search" || t === "buscar"){
      const el = document.getElementById("searchBox") || document.querySelector("input[placeholder=\"Buscar repuesto...\"]");
      if (el){ el.scrollIntoView({ behavior: "auto", block: "center" }); el.focus(); }
      return;
    }

    // Publicar (+) → ir a /nuevo
    if (t === "add" || t === "plus" || t === "+" || t === "novo" || t === "nuevo" || t === "publicar" || t === "upload"){
      // window.location.href = "/nuevo"; // desactivado
      return;
    }
  } catch(e) {}
}
export default function AppReact({ base = [] }){
  const seed = (Array.isArray(base)? base : []).map(normalize);
  const [items, setItems] = useState(seed);

  // Cargar locales + base al montar y cuando cambie base
  useEffect(()=>{
  localStorage.removeItem("pp.local.products");  // limpia basura previa
    setItems([...getLocalProducts(), ...seed]);
  }, [base.length]); // suficiente para nuestro caso

  // Escuchar publicaciones nuevas
  useEffect(()=>{
  localStorage.removeItem("pp.local.products");  // limpia basura previa
    const onChange = () => setItems([...getLocalProducts(), ...seed]);
    window.addEventListener("pp:products:changed", onChange);
    return () => window.removeEventListener("pp:products:changed", onChange);
  }, [base.length]);

  // Menú inferior
  return (
    <div style={{ padding: 20 }}>
      <ProductGrid items={items} />
      <BottomMenuIcons onChange={onMenuChange} />
    </div>
  );
}
