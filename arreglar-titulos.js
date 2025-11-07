import { supabase } from './lib/supabase.js'

async function arreglar() {
  // Obtener productos con títulos problemáticos
  const { data: productos } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('🔧 Arreglando títulos...\n');

  for (const p of productos) {
    let nuevoTitulo = p.titulo;
    
    // Si el título empieza con el código, quitarlo
    if (nuevoTitulo.startsWith(p.codigo)) {
      nuevoTitulo = nuevoTitulo.replace(p.codigo, '').trim();
      nuevoTitulo = nuevoTitulo.replace(/^-\s*/, ''); // quitar guión inicial
    }
    
    // Si quedó vacío o solo tiene el código, poner descripción genérica
    if (!nuevoTitulo || nuevoTitulo === p.codigo) {
      nuevoTitulo = 'Repuesto automotriz';
    }
    
    if (nuevoTitulo !== p.titulo) {
      console.log(`✏️  ${p.codigo}`);
      console.log(`   Antes: ${p.titulo}`);
      console.log(`   Después: ${nuevoTitulo}\n`);
      
      await supabase
        .from('productos')
        .update({ titulo: nuevoTitulo })
        .eq('id', p.id);
    }
  }
  
  console.log('✅ Títulos arreglados');
}

arreglar();
