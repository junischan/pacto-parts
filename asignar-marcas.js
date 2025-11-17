import { supabase } from './lib/supabase.js'

// Palabras clave por marca
const marcas = {
  gm: ['s10', 'onix', 'prisma', 'cruze', 'spin', 'montana', 'trailblazer', 'equinox', 'silverado', 'colorado', 'chevrolet', 'gm'],
  ford: ['ranger', 'ecosport', 'focus', 'fiesta', 'ka', 'fusion', 'edge', 'explorer', 'f-150', 'f150', 'bronco', 'transit', 'ford'],
  vw: ['saveiro', 'gol', 'voyage', 'polo', 'virtus', 'amarok', 't-cross', 'nivus', 'jetta', 'tiguan', 'volkswagen', 'vw']
};

async function asignarMarcas() {
  // Obtener productos sin marca o con marca inconsistente
  const { data: productos } = await supabase
    .from('productos')
    .select('*');

  console.log(`📦 Procesando ${productos.length} productos...\n`);

  let actualizados = 0;
  let sinDetectar = 0;

  for (const p of productos) {
    const texto = `${p.titulo} ${p.codigo} ${p.categoria}`.toLowerCase();
    let marcaDetectada = null;

    // Buscar marca por palabras clave
    for (const [marca, keywords] of Object.entries(marcas)) {
      if (keywords.some(kw => texto.includes(kw))) {
        marcaDetectada = marca;
        break;
      }
    }

    // Si encontramos marca y es diferente, actualizar
    if (marcaDetectada && p.marca?.toLowerCase() !== marcaDetectada) {
      await supabase
        .from('productos')
        .update({ marca: marcaDetectada })
        .eq('id', p.id);
      
      console.log(`✅ [${p.codigo}] ${p.titulo}`);
      console.log(`   ${p.marca || 'Sin marca'} → ${marcaDetectada}\n`);
      actualizados++;
    } else if (!marcaDetectada && !p.marca) {
      sinDetectar++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Productos actualizados: ${actualizados}`);
  console.log(`⚠️  Sin detectar: ${sinDetectar}`);
  console.log('='.repeat(50));

  // Mostrar resumen final
  const { data: resumen } = await supabase
    .from('productos')
    .select('marca');

  const conteo = {};
  resumen.forEach(p => {
    const m = p.marca || 'Sin marca';
    conteo[m] = (conteo[m] || 0) + 1;
  });

  console.log('\n📊 RESUMEN FINAL:');
  Object.entries(conteo).sort((a,b) => b[1] - a[1]).forEach(([marca, cant]) => {
    console.log(`  ${marca}: ${cant} productos`);
  });
}

asignarMarcas();
