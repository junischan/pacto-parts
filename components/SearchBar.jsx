import { useEffect, useRef } from "react";

export default function SearchBar({ value, onChange, placeholder="Buscar repuesto..." }) {
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="toolbar">
      <input
        id="q"
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search"
        placeholder={placeholder}
        aria-label="Buscar"
      />
    </div>
  );
}
