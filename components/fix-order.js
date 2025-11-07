const fs = require('fs');
const f = 'ProductCard.jsx';
let t = fs.readFileSync(f, 'utf8');

// 1️⃣ Elimina la línea del whatsapp actual
t = t.replace(/^\s*const whatsapp = .*?\n/, '');

// 2️⃣ Inserta whatsapp justo DESPUÉS de la definición de codigo
t = t.replace(/(const codigo[^\n]*\n)/, `$1  const whatsapp = \`https://wa.me/595971111111?text=Hola!%20Estoy%20interesado%20en%20\${encodeURIComponent(nombreBonito)}%20(\${codigo})\`;\n`);

fs.writeFileSync(f, t);
console.log('✅ whatsapp movido debajo de codigo');
