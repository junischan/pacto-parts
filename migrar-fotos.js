import { supabase } from './lib/supabase.js'
import fs from 'fs'
import path from 'path'

async function migrarFotos() {
  console.log('📦 Obteniendo productos desde Supabase...')
  
  // Obtener todos los productos
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  console.log(`📊 Encontrados: ${productos.length} productos`)
  
  let migrados = 0
  let errores = 0
  
  for (const prod of productos) {
    const imagenUrl = prod.imagen_url || ''
    
    // Solo migrar si la URL es local (no de Supabase)
    if (!imagenUrl || imagenUrl.includes('supabase.co')) {
      console.log(`⏭️  Saltando ${prod.codigo} (ya en Supabase o sin imagen)`)
      continue
    }
    
    // Construir ruta local
    const rutaLocal = path.join(process.cwd(), 'public', imagenUrl.replace(/^\//, ''))
    
    if (!fs.existsSync(rutaLocal)) {
      console.log(`❌ No existe: ${rutaLocal}`)
      errores++
      continue
    }
    
    try {
      console.log(`📤 Subiendo: ${prod.codigo}...`)
      
      // Leer archivo
      const buffer = fs.readFileSync(rutaLocal)
      const extension = path.extname(rutaLocal)
      const nombreArchivo = `${prod.codigo}${extension}`
      
      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(`fotos/${nombreArchivo}`, buffer, {
          contentType: `image/jpeg`,
          upsert: true
        })
      
      if (uploadError) throw uploadError
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('productos')
        .getPublicUrl(`fotos/${nombreArchivo}`)
      
      const nuevaUrl = urlData.publicUrl
      
      // Actualizar producto con nueva URL
      const { error: updateError } = await supabase
        .from('productos')
        .update({ imagen_url: nuevaUrl })
        .eq('id', prod.id)
      
      if (updateError) throw updateError
      
      console.log(`✅ ${prod.codigo} migrado`)
      migrados++
      
    } catch (err) {
      console.error(`❌ Error en ${prod.codigo}:`, err.message)
      errores++
    }
  }
  
  console.log('\n🎉 Migración completa!')
  console.log(`✅ Migrados: ${migrados}`)
  console.log(`❌ Errores: ${errores}`)
}

migrarFotos()
