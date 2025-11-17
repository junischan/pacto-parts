import fs from "fs";
import { supabase } from "../lib/supabase.js";

const file = process.argv[2] || "lote.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

(async () => {
  for (const p of data) {
    const registro = {
      codigo: p.codigo,
      titulo: p.titulo,
      categoria: p.categoria,
      precio: p.precio || 0,
      imagen_url: null // todavía no hay foto
    };
    const { error } = await supabase
      .from("productos")
      .upsert(registro, { onConflict: "codigo" });
    if (error) console.error("❌", p.codigo, error.message);
    else console.log("✅ OK", p.codigo);
  }
})();
