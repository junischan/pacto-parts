import { supabase } from './lib/supabase.js'

async function verEspacio() {
  // Listar TODOS los archivos del bucket
  const { data: files, error } = await supabase
    .storage
    .from('productos')
    .list('', {
      limit: 1000,
      offset: 0
    })

  if (error) {
    console.log('Error:', error)
    return
  }

  let totalBytes = 0
  let totalArchivos = 0

  // Función recursiva para listar en subcarpetas
  async function listarCarpeta(path = '') {
    const { data: items } = await supabase
      .storage
      .from('productos')
      .list(path)

    for (const item of items || []) {
      if (item.metadata) {
        // Es un archivo
        totalBytes += item.metadata.size || 0
        totalArchivos++
      } else {
        // Es una carpeta, listar recursivamente
        await listarCarpeta(path ? `${path}/${item.name}` : item.name)
      }
    }
  }

  await listarCarpeta()

  const totalMB = (totalBytes / 1024 / 1024).toFixed(2)
  const totalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(2)

  console.log('📊 ESPACIO EN SUPABASE STORAGE:\n')
  console.log(`Total archivos: ${totalArchivos}`)
  console.log(`Espacio usado: ${totalMB} MB (${totalGB} GB)`)
  console.log(`Promedio por foto: ${(totalBytes / totalArchivos / 1024).toFixed(2)} KB`)
}

verEspacio()
