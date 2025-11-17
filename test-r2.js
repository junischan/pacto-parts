import { subirFotoR2 } from './lib/cloudflare-r2.js'
import fs from 'fs'

async function probarR2() {
  // Buscar una foto existente en tu sistema
  const rutaFoto = './public/pacto-banner.jpg' // Cambia si no existe
  
  if (!fs.existsSync(rutaFoto)) {
    console.log('❌ No se encontró la foto de prueba')
    console.log('Buscando otra foto...')
    
    // Intentar con otra
    const alternativa = './uploads/test.jpg'
    if (!fs.existsSync(alternativa)) {
      console.log('Crea una foto de prueba primero:')
      console.log('Copia cualquier .jpg a ./test-foto.jpg')
      return
    }
  }
  
  try {
    console.log('📤 Subiendo foto de prueba a Cloudflare R2...')
    
    const archivo = fs.readFileSync(rutaFoto)
    const url = await subirFotoR2(archivo, 'test-prueba.jpg')
    
    console.log('✅ Foto subida exitosamente!')
    console.log('📍 URL:', url)
    console.log('\nAhora verificá en Cloudflare dashboard que apareció la foto.')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

probarR2()
