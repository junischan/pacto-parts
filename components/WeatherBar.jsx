'use client';
import { useEffect, useState } from 'react';

export default function WeatherBar({ lat, lon }) {
  const [w, setW] = useState(null);

  const load = async () => {
    try {
      const q = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
      const r = await fetch(`/api/weather${q}`, { cache: 'no-store' });
      const j = await r.json();
      if (j.ok) setW(j.current);
    } catch {}
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30 * 60 * 1000); // cada 30 min
    return () => clearInterval(id);
  }, [lat, lon]);

  if (!w) return null;
  return (
    <div style={{background:'linear-gradient(135deg,#0a0f1e,#142038)',color:'#cfe8ff',padding:'8px 12px',fontSize:13,display:'flex',gap:16,borderBottom:'1px solid rgba(100,200,255,.12)'}}>
      <span>🌡️ {w.temperature_2m}°C</span>
      <span>💧 {w.relative_humidity_2m}%</span>
      <span>💨 {w.wind_speed_10m} km/h</span>
      <span>☔ {w.precipitation ?? 0} mm</span>
    </div>
  );
}
