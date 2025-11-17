import { supabase } from './lib/supabase.js'
import { subirFotoR2 } from './lib/cloudflare-r2.js'
import fs from 'fs'
import path from 'path'

async function subirProducto(fotoPath, titulo, precio, categoria = 'Otros', marca = 'Sin marca') {
  try {
    console.log('📸 Subiendo foto a Cloudflare R2...')

    // Leer archivo
    const fotoBuffer = fs.readFileSync(fotoPath)
    const extension = path.extname(fotoPath)
    const codigo = Date.now().toString()
    const nombreArchivo = `${codigo}${extension}`

    // Subir a Cloudflare R2 (en vez de Supabase)
    const imagen_url = await subirFotoR2(fotoBuffer, nombreArchivo)

    console.log('✅ Foto subida a R2:', imagen_url)
    console.log('💾 Creando producto en Supabase...')

    // Crear producto en BD de Supabase
    const { data: producto, error: dbError } = await supabase
      .from('productos')
      .insert({
        codigo,
        titulo,
        precio: Number(precio),
        imagen_url,
        categoria,
        marca
      })
      .select()
      .single()

    if (dbError) throw dbError

    console.log('✅ Producto creado:', producto)
    return producto

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Si se llama directo desde terminal
if (process.argv.length > 2) {
  const [fotoPath, titulo, precio, categoria, marca] = process.argv.slice(2)
  subirProducto(fotoPath, titulo, precio, categoria, marca)
}

export { subirProducto }
