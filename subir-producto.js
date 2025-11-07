import { supabase } from './lib/supabase.js'
import fs from 'fs'
import path from 'path'

async function subirProducto(fotoPath, titulo, precio, categoria = 'Otros', marca = 'Sin marca') {
  try {
    console.log('📸 Subiendo foto...')
    
    // Leer archivo
    const fotoBuffer = fs.readFileSync(fotoPath)
    const extension = path.extname(fotoPath)
    const codigo = Date.now().toString()
    const nombreArchivo = `${codigo}${extension}`
    
    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(`fotos/${nombreArchivo}`, fotoBuffer, {
        contentType: `image/${extension.replace('.', '')}`,
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('productos')
      .getPublicUrl(`fotos/${nombreArchivo}`)
    
    const imagen_url = urlData.publicUrl
    
    console.log('✅ Foto subida:', imagen_url)
    console.log('💾 Creando producto...')
    
    // Crear producto en BD
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
    
    console.log('🎉 ¡Producto creado exitosamente!')
    console.log('Código:', codigo)
    console.log('Título:', titulo)
    console.log('Precio: ₲', new Intl.NumberFormat('es-PY').format(precio))
    console.log('URL:', imagen_url)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Leer argumentos
const [foto, titulo, precio, categoria, marca] = process.argv.slice(2)

if (!foto || !titulo || !precio) {
  console.log(`
📦 USO:
  node subir-producto.js <foto> <titulo> <precio> [categoria] [marca]

EJEMPLO:
  node subir-producto.js foto.jpg "Bomba agua Ranger" 150000 "Motor" "GM"
  `)
  process.exit(1)
}

subirProducto(foto, titulo, precio, categoria, marca)
