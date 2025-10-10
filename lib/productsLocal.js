const KEY = "pp.local.products";

export function getLocalProducts() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function addLocalProduct(item) {
  try {
    const all = getLocalProducts();
    all.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(all));
    // notificar a toda la app que cambió la lista
    window.dispatchEvent(new Event("pp:products:changed"));
    return true;
  } catch (e) {
    alert("No se pudo guardar (localStorage lleno o bloqueado).");
    return false;
  }
}

export function clearLocalProducts() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("pp:products:changed"));
  } catch {}
}

/**
 * Suscribe un handler al evento de cambios.
 * Devuelve una función para desuscribir.
 */
export function onProductsChanged(handler) {
  const listener = () => handler();
  window.addEventListener("pp:products:changed", listener);
  return () => window.removeEventListener("pp:products:changed", listener);
}
