require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pvwyjulitlzuceqqyfnb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d3lqdWxpdGx6dWNlcXF5Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczMjksImV4cCI6MjA3NzEwMzMyOX0.EthsSooZrym38CZ9V3EVEe3YfYXTBS6GqA5ghwl2_gM'
);

async function contar() {
  const { count, error } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true });
  
  if (error) console.error('❌', error.message);
  else console.log(`📦 Total de productos en la base de datos: ${count}`);
}

contar();
