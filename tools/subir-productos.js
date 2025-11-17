require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Usa service role para evitar RLS
);

async function subirProductos(archivoJson) {
  try {
    const productos = JSON.parse(fs.readFileSync(archivoJson, 'utf8'));
    
    console.log(`📦 Cargando ${productos.length} productos...`);
    
    const { data, error } = await supabase
      .from('productos')
      .insert(productos);
    
    if (error) throw error;
    
    console.log('✅ Productos cargados exitosamente!');
    console.log(data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const archivo = process.argv[2] || './productos.json';
subirProductos(archivo);
