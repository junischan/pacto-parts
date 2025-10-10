export default function ImageModal({ open, src, alt, onClose }) {
  if (!open) return null;

  const onBackdrop = (e) => {
    // cerrar si clickean fuera de la imagen
    if (e.target.classList.contains("modal-backdrop")) onClose?.();
  };

  return (
    <div className="modal-backdrop" onClick={onBackdrop} role="dialog" aria-modal="true">
      <div className="modal-body">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <img src={src} alt={alt || "Imagen"} />
      </div>
    </div>
  );
}
