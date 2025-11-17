import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const DB = path.join(process.cwd(), ".data", "codes.json");
function ensureDB() {
  const dir = path.dirname(DB);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");
}
function upsertCode(email, code) {
  ensureDB();
  const now = Date.now();
  const exp = now + 10 * 60 * 1000; // 10 min
  const list = JSON.parse(fs.readFileSync(DB, "utf8"));
  const idx = list.findIndex(r => r.email === email);
  const rec = { email, code, exp };
  if (idx >= 0) list[idx] = rec; else list.push(rec);
  fs.writeFileSync(DB, JSON.stringify(list));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Método no permitido" });
  try {
    const { to, code } = req.body || {};
    if (!to || !code) return res.status(400).json({ ok:false, error:"Faltan datos" });

    upsertCode(to, String(code).trim());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS },
    });

    await transporter.sendMail({
      from: `"PactoParts" <${process.env.GMAIL_USER}>`,
      to, subject: "Código de verificación - PactoParts",
      text: `Tu código de verificación es: ${code}`,
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
}
