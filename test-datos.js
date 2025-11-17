import { supabase } from './lib/supabase.js'

async function test() {
  const { data } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: false })
    .limit(3);

  console.log('📊 Datos que llegan desde Supabase:\n');
  
  data.forEach(p => {
    console.log('='.repeat(50));
    console.log('TODOS los campos del producto:');
    console.log(JSON.stringify(p, null, 2));
    console.log('');
  });
}

test();
