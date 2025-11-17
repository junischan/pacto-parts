// Test del formateo
const precio = 10800000;

// Mal (actual)
const mal = Number(precio).toLocaleString("es-PY");
console.log("❌ Mal:", mal); // Probablemente muestra "10"

// Bien (correcto)
const bien = new Intl.NumberFormat("es-PY", { 
  minimumFractionDigits: 0,
  maximumFractionDigits: 0 
}).format(precio);
console.log("✅ Bien:", bien); // Debe mostrar "10.800.000"
