import fs from "fs";
import path from "path";
import formidable from "formidable";

// Necesario para multipart/form-data
export const config = {
  api: { bodyParser: false },
};

const UPDIR = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPDIR)) fs.mkdirSync(UPDIR, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "Método no permitido" });
  }

  ensureUploadsDir();

  // Config de formidable
  const form = formidable({
    multiples: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    keepExtensions: true,
  });

  try {
    const { files, fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    // Reunimos todos los archivos sin importar el nombre del campo
    const allFiles = [];
    for (const k of Object.keys(files || {})) {
      const v = files[k];
      if (Array.isArray(v)) allFiles.push(...v);
      else if (v) allFiles.push(v);
    }

    if (!allFiles.length) {
      return res.status(400).json({ ok: false, msg: "No llegó ningún archivo" });
    }

    const saved = [];

    for (const f of allFiles) {
      // En formidable v3 los props se llaman distinta según runtime:
      // filepath / originalFilename (node), o file.filepath …
      const tmp = f.filepath || f._writeStream?.path || f.path;
      const orig = f.originalFilename || f.newFilename || f.name || "foto";

      if (!tmp) {
        return res.status(400).json({ ok: false, msg: "Archivo sin ruta temporal" });
      }

      const safeName =
        Date.now() + "-" + orig.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");

      const dest = path.join(UPDIR, safeName);
      // Mover (rename) y si falla, copiamos
      try {
        await fs.promises.rename(tmp, dest);
      } catch {
        await fs.promises.copyFile(tmp, dest);
      }

      saved.push("/uploads/" + safeName);
    }

    // Si subiste 1, devolvemos url única; si varias, un array
    return res.json({ ok: true, url: saved.length === 1 ? saved[0] : saved, fields });
  } catch (e) {
    return res.status(400).json({ ok: false, msg: String(e) });
  }
}
