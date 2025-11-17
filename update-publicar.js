import fs from 'fs'

const codigo = fs.readFileSync('pages/publicar.jsx', 'utf8')

// Agregar import de R2 al inicio
const nuevoImport = `import { supabase } from "../lib/supabase";
import { subirFotoR2 } from "../lib/cloudflare-r2";`

const actualizado = codigo
  .replace('import { supabase } from "../lib/supabase";', nuevoImport)
  .replace(
    /const up = await supabase\.storage\.from\("productos"\)[^}]+\}/,
    `// Subir a Cloudflare R2 en vez de Supabase
        const buffer = await f.arrayBuffer();
        const nombreArchivo = \`\${codigo}-\${i+1}.\${ext}\`;
        const url = await subirFotoR2(Buffer.from(buffer), nombreArchivo);
        urls.push(url);
        continue;`
  )

fs.writeFileSync('pages/publicar.jsx', actualizado)
console.log('✅ pages/publicar.jsx actualizado')
