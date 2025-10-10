import fs from "fs";
import path from "path";

function arg(name, def=""){ 
  const i = process.argv.indexOf(name);
  return i> -1 ? process.argv[i+1] : def;
}
function slug(s){
  return (s||"").toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
    .slice(0,60) || "producto";
}

const ROOT = process.cwd();
const dataFile = path.join(ROOT, "data", "products.json");
const uploadsDir = path.join(ROOT, "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const titulo    = arg("--title")     || arg("--titulo") || "Sin título";
const precioStr = arg("--price")     || arg("--precio") || "0";
const categoria = arg("--category")  || arg("--cat")    || "Otros";
const srcImage  = arg("--image")     || arg("--img")    || "";

const precio = Number(precioStr) || 0;

let imagen = "";
if (srcImage) {
  if (!fs.existsSync(srcImage)) {
    console.error("❌ Imagen no encontrada:", srcImage);
    process.exit(1);
  }
  const ext = path.extname(srcImage).toLowerCase() || ".jpg";
  const base = `${Date.now()}-${slug(titulo)}${ext}`;
  const dest = path.join(uploadsDir, base);
  fs.copyFileSync(srcImage, dest);
  imagen = `/uploads/${base}`;
}

let arr = [];
try {
  arr = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  if (!Array.isArray(arr)) arr = [];
} catch { arr = []; }

const item = {
  id: Math.random().toString(36).slice(2),
  titulo,
  precio,
  categoria,
  imagen
};

arr.unshift(item);
fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), "utf8");

console.log("✅ Producto agregado:");
console.log(item);
