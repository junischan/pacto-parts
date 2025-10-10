import { useEffect, useRef, useState } from "react";

// Carga el CSS de Leaflet en el <head> (solo una vez)
function ensureLeafletCss(){
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

export default function MapPicker({ value, onChange }){
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [L, setL] = useState(null);
  const [q, setQ] = useState("");

  // Cargar Leaflet solo en cliente
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      if (typeof window === "undefined") return;
      ensureLeafletCss();
      const leaflet = await import("leaflet");
      if (!alive) return;
      setL(leaflet);
      // Fix de íconos en CDN
      leaflet.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      // Crear mapa
      const start = value?.lat && value?.lon ? [value.lat, value.lon] : [-25.296, -57.641]; // Asunción aprox
      const m = leaflet.map("mapbox", { zoomControl: true }).setView(start, value?.lat? 15 : 12);
      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(m);
      mapRef.current = m;

      // Marker si ya hay valor
      if (value?.lat && value?.lon){
        markerRef.current = leaflet.marker([value.lat, value.lon]).addTo(m);
      }

      // Click en mapa para elegir manualmente
      m.on("click", (ev)=>{
        const { lat, lng } = ev.latlng;
        if (!markerRef.current) markerRef.current = leaflet.marker([lat, lng]).addTo(m);
        markerRef.current.setLatLng([lat, lng]);
        onChange && onChange({ lat, lon: lng, label: "" });
      });
    })();
    return ()=>{ alive = false; mapRef.current && mapRef.current.remove(); };
  }, []);

  async function buscar(){
    if (!q.trim()) return;
    try{
      const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=py&q=" + encodeURIComponent(q.trim());
      const res = await fetch(url, { headers: { "Accept-Language": "es" }});
      const data = await res.json();
      if (!Array.isArray(data) || !data[0]) { alert("No se encontró esa dirección"); return; }
      const lat = parseFloat(data[0].lat), lon = parseFloat(data[0].lon);
      if (mapRef.current && L){
        mapRef.current.setView([lat, lon], 16);
        if (!markerRef.current) markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
        markerRef.current.setLatLng([lat, lon]);
      }
      onChange && onChange({ lat, lon, label: data[0].display_name || q.trim() });
    }catch(e){
      alert("Error buscando la dirección");
    }
  }

  return (
    <div style={{display:"grid", gap:8}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8}}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Buscar dirección (calle, ciudad)…"
          style={{padding:"10px 12px", borderRadius:10, border:"1px solid #1f2a44", background:"#0b1224", color:"#e5e7eb"}}
        />
        <button onClick={buscar} style={{borderRadius:10, padding:"10px 14px", background:"#3b82f6", color:"#fff", border:"none"}}>Buscar</button>
      </div>
      <div id="mapbox" style={{width:"100%", height:220, borderRadius:12, overflow:"hidden", border:"1px solid #1f2a44"}} />
      {value?.lat && value?.lon && (
        <div style={{fontSize:12, color:"#94a3b8"}}>
          📍 {value.label ? value.label : `${value.lat.toFixed(6)}, ${value.lon.toFixed(6)}`}
        </div>
      )}
      <div style={{fontSize:12, color:"#64748b"}}>Tip: podés tocar el mapa para ajustar el pin.</div>
    </div>
  );
}
