import fs from "fs";
import path from "path";
const DB = path.join(process.cwd(), ".data", "codes.json");
function readList(){ try{ return JSON.parse(fs.readFileSync(DB, "utf8")); }catch{ return []; } }
function writeList(list){ fs.writeFileSync(DB, JSON.stringify(list)); }

export default async function handler(req,res){
  if (req.method !== "POST") return res.status(405).json({ ok:false });
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ ok:false, error:"Faltan datos" });

  const list = readList();
  const idx = list.findIndex(r => r.email === email);
  if (idx < 0) return res.status(400).json({ ok:false, error:"No existe código" });

  const rec = list[idx], now = Date.now();
  if (now > rec.exp) { list.splice(idx,1); writeList(list); return res.status(400).json({ ok:false, error:"Código vencido" }); }
  if (String(rec.code) !== String(code)) return res.status(400).json({ ok:false, error:"Código incorrecto" });

  list.splice(idx,1); writeList(list);
  res.json({ ok:true });
}
