export async function resizeImageFile(file, maxW = 1280, maxH = 1280, quality = 0.7) {
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("read error"));
    r.onload = () => resolve(String(r.result || ""));
    r.readAsDataURL(file);
  });

  // Crear imagen
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("image load error"));
    i.src = dataUrl;
  });

  // Calcular tamaño destino
  let { width, height } = img;
  const ratio = Math.min(maxW / width, maxH / height, 1);
  const w = Math.round(width * ratio);
  const h = Math.round(height * ratio);

  // Dibujar en canvas
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  // Exportar JPEG comprimido
  return canvas.toDataURL("image/jpeg", quality);
}
