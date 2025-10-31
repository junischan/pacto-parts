import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import BottomMenuIcons from "./BottomMenuIcons";

function normalize(p){
  return {
    id: p?.id ?? null,
    codigo: p?.codigo ?? p?.code ?? null,
    titulo: p?.titulo ?? p?.title ?? p?.name ?? "Sin título",
    precio: p?.precio ?? p?.price ?? p?.priceGs ?? 0,
    imagen: p?.imagen ?? p?.image ?? p?.photo ?? "",
    imagen_url: p?.imagen_url ?? p?.imagen ?? "",
    marca: p?.marca ?? null,
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
    if (t === "home"){
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (t === "search" || t === "buscar"){
      const el = document.getElementById("searchBox") || document.querySelector("input[placeholder=\"Buscar repuesto...\"]");
      if(el) el.focus();
    }
  }catch(e){ console.warn(e); }
}

export default function AppReact({ base=[], q="", cat="Todos" }){
  const [items, setItems] = useState([]);

  useEffect(()=>{
    const local = getLocalProducts();
    const fromBase = Array.isArray(base) ? base.map(normalize) : [];
    const combined = [...fromBase, ...local];
    setItems(combined);
  }, [base]);

  return (
    <>
      <ProductGrid items={items} q={q} cat={cat} />
      <BottomMenuIcons onChange={onMenuChange} autoHide={true} />
    </>
  );
}
