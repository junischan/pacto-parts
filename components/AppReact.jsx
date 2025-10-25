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
    if (t === "home"){
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (t === "search" || t === "buscar"){
      const el = document.getElementById("searchBox") || document.querySelector("input[placeholder=\"Buscar repuesto...\"]");
      if (el){ el.scrollIntoView({ behavior: "auto", block: "center" }); el.focus(); }
      return;
    }
    if (t === "add" || t === "plus" || t === "+" || t === "novo" || t === "nuevo" || t === "publicar" || t === "upload"){
      return;
    }
  } catch(e) {}
}

export default function AppReact({ base = [], q = "", cat = "Todos" }){
  const seed = (Array.isArray(base)? base : []).map(normalize);
  const [items, setItems] = useState(seed);

  useEffect(()=>{
    localStorage.removeItem("pp.local.products");
    setItems([...getLocalProducts(), ...seed]);
  }, [base.length]);

  useEffect(()=>{
    localStorage.removeItem("pp.local.products");
    const onChange = () => setItems([...getLocalProducts(), ...seed]);
    window.addEventListener("pp:products:changed", onChange);
    return () => window.removeEventListener("pp:products:changed", onChange);
  }, [base.length]);

  return (
    <div style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
      <ProductGrid items={items} q={q} cat={cat} />
      <BottomMenuIcons onChange={onMenuChange} />
    </div>
  );
}
