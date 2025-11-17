require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://pvwyjulitlzuceqqyfnb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3lqdWxpdGx6dWNlcXF5Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczMjksImV4cCI6MjA3NzEwMzMyOX0.EthsSooZrym38CZ9V3EVEe3YfYXTBS6GqA5ghwl2_gM'
);

async function subirProductos(archivoJson) {
  try {
    const productos = JSON.parse(fs.readFileSync(archivoJson, 'utf8'));
    console.log(`📦 Cargando ${productos.length} productos...`);
    
    const { data, error } = await supabase
      .from('productos')
      .insert(productos)
      .select();
    
    if (error) throw error;
    
    console.log('✅ Productos cargados exitosamente!');
    console.log(data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

subirProductos(process.argv[2] || './productos.json');
