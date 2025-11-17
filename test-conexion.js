import { supabase } from './lib/supabase.js'

async function test() {
  console.log('🔍 Probando Supabase...')
  
  const { data, error } = await supabase
    .from('productos')
    .select('codigo, titulo, precio')
    .limit(3)
  
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Conectado!')
    console.log('📦 Productos:', data)
  }
}

test()
