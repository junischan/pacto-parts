import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPA_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPA_URL || !SUPA_KEY) {
  console.error('❌ Faltan variables: SUPABASE_URL / SUPABASE_SERVICE_KEY (o sus NEXT_PUBLIC_*)');
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY);

// -------- helpers CSV + upload --------
function parseCSV(file) {
  const txt = fs.readFileSync(file, 'utf8').trim();
  const [head, ...lines] = txt.split(/\r?\n/);
  const cols = head.split(',');
  return lines.map(l => {
    const parts = l.split(',');
    const obj = {};
    cols.forEach((c, i) => (obj[c.trim()] = (parts[i] ?? '').trim()));
    return obj;
  });
}

async function upsertProducto({ codigo, titulo, categoria, precio, imagen_url }) {
  const { error } = await supabase
    .from('productos')
    .upsert({ codigo, titulo, categoria, precio: Number(precio||0), imagen_url }, { onConflict: 'codigo' });
  if (error) throw error;
}

async function uploadFoto(localDir, codigo, bucketCarpeta='otros') {
  const localPath = path.join(localDir, `${codigo}.jpg`);
  if (!fs.existsSync(localPath)) return null;

  const storagePath = `${bucketCarpeta}/${codigo}.jpg`;
  const file = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from('productos').upload(storagePath, file, {
    upsert: true,
    contentType: 'image/jpeg',
  });
  if (error) throw error;

  const { data } = supabase.storage.from('productos').getPublicUrl(storagePath);
  return data.publicUrl || null;
}

(async function main() {
  const [ , , dirFotos, csvFile ] = process.argv;
  if (!dirFotos || !csvFile) {
    console.error('Uso: node tools/subir-lote.js <dir_fotos> <archivo.csv>');
    process.exit(1);
  }

  const filas = parseCSV(csvFile);
  for (const f of filas) {
    try {
      const url = await uploadFoto(dirFotos, f.codigo, (f.categoria||'otros').toLowerCase());
      if (url) f.imagen_url = url;
      await upsertProducto(f);
      console.log(`✅ ${f.codigo} OK${url ? ' (foto)' : ''}`);
    } catch(e) {
      console.error(`❌ ${f.codigo}: ${e.message}`);
    }
  }
})();
