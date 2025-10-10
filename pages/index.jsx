import fs from "fs";
import path from "path";
import dynamic from "next/dynamic";

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
  return <AppReact base={productos} />;
}
