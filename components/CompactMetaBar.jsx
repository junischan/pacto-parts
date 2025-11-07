'use client';
import { useEffect, useRef, useState } from 'react';

export default function CompactMetaBar({
  speed = 3.5,         // más rápida
  debug = false,       // poné true para ver borde fucsia
}) {
  const [fx, setFx] = useState(null);
  const [wx, setWx] = useState(null);
  const [cx, setCx] = useState(null);
  const [x, setX]   = useState(0);
  const [spacerH, setSpacerH] = useState(44); // se recalcula solo

  const barRef    = useRef(null);
  const trackRef  = useRef(null);
  const dragging  = useRef(false);
  const lastPos   = useRef(0);
  const momentum  = useRef(0);
  const rafId     = useRef(0);

  // --------- datos ----------
  const loadAll = async () => {
    try {
      const [w, r, c] = await Promise.allSettled([
        fetch('/api/weather', { cache: 'no-store' }),
        fetch('/api/rates',   { cache: 'no-store' }),
        fetch('/api/crypto',  { cache: 'no-store' }),
      ]);
      if (w.status === 'fulfilled') { const j = await w.value.json(); j.ok && setWx(j.current); }
      if (r.status === 'fulfilled') { const j = await r.value.json(); j.ok && setFx(j.rates); }
      if (c.status === 'fulfilled') { const j = await c.value.json(); j.ok && setCx(j.coins); }
    } catch {}
  };

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 60000);
    return () => clearInterval(id);
  }, []);

  // --------- medir alto real y crear espaciador ----------
  const measure = () => {
    const h = barRef.current?.offsetHeight || 44;
    setSpacerH(h);
  };
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (barRef.current) ro.observe(barRef.current);
    const onRes = () => measure();
    window.addEventListener('resize', onRes);
    return () => { ro.disconnect(); window.removeEventListener('resize', onRes); };
  }, []);

  // --------- animación con inercia ----------
  useEffect(() => {
    const tick = () => {
      const el = trackRef.current;
      if (el && !dragging.current) {
        const cw = el.offsetWidth, sw = el.scrollWidth;
        const total = speed + momentum.current;
        let next = x + (total > 0 ? total : 0);
        if (next > sw - cw) next = 0;
        setX(next);
        momentum.current *= 0.94;
        if (Math.abs(momentum.current) < 0.08) momentum.current = 0;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [x, speed]);

  // --------- drag táctil/mouse ----------
  const onDown = (clientX) => { dragging.current = true; lastPos.current = clientX; momentum.current = 0; };
  const onMove =  (clientX) => {
    if (!dragging.current) return;
    const delta = clientX - lastPos.current;
    lastPos.current = clientX;
    setX((p) => {
      const el = trackRef.current; if (!el) return p;
      const cw = el.offsetWidth, sw = el.scrollWidth;
      let nx = p - delta;               // mover según el dedo
      if (nx < 0) nx = 0;
      if (nx > sw - cw) nx = sw - cw;
      return nx;
    });
    momentum.current = Math.max(-16, Math.min(16, -delta)); // inercia
  };
  const onUp = () => { dragging.current = false; };

  const handlers = {
    onMouseDown: (e) => onDown(e.clientX),
    onMouseMove: (e) => onMove(e.clientX),
    onMouseUp: onUp,
    onMouseLeave: onUp,
    onTouchStart: (e) => onDown(e.touches[0].clientX),
    onTouchMove: (e) => onMove(e.touches[0].clientX),
    onTouchEnd: onUp,
  };

  // --------- UI helpers ----------
  const money = (v) => `₲${Math.round(v || 0).toLocaleString('es-PY')}`;
  const Chip = ({ label, value }) => (
    <span style={{
      marginRight: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 16, background: 'rgba(30,41,59,.6)',
      border: '1px solid rgba(100,200,255,.2)', fontWeight: 700, fontSize: 12,
      boxShadow: '0 1px 6px rgba(0,0,0,.22)'
    }}>
      <span style={{ color: '#64c8ff' }}>{label}:</span>
      <span style={{ color: '#ffd700' }}>{value}</span>
    </span>
  );

  const chips = [];
  if (wx) {
    chips.push(['🌡️', `${wx.temperature_2m}°C`]);
    chips.push(['💧',  `${wx.relative_humidity_2m}%`]);
    chips.push(['💨',  `${wx.wind_speed_10m} km/h`]);
    chips.push(['☔',  `${wx.precipitation ?? 0} mm`]);
  }
  if (fx) {
    chips.push(['Dólar', money(fx['Dólar'])]);
    chips.push(['Euro', money(fx['Euro'])]);
    chips.push(['Real', money(fx['Real'])]);
    if (fx['Peso Argentino']) chips.push(['Peso Argentino', money(fx['Peso Argentino'])]);
  }
  if (cx) {
    chips.push(['BTC', money(cx.BTC?.PYG)]);
    chips.push(['ETH', money(cx.ETH?.PYG)]);
    chips.push(['USDT', money(cx.USDT?.PYG)]);
    chips.push(['BNB', money(cx.BNB?.PYG)]);
  }

  return (
    <>
      <div
        ref={barRef}
        style={{
          position: 'fixed', left: 0, right: 0, top: 0,
          background: 'linear-gradient(135deg,#0a0f1e,#131c34)',
          color: '#e2e8f0', padding: '6px 0', fontSize: 12,
          overflow: 'hidden', whiteSpace: 'nowrap',
          borderBottom: '1px solid rgba(100,200,255,.15)',
          zIndex: 9999,
          outline: debug ? '2px solid fuchsia' : 'none',
        }}
      >
        <div
          ref={trackRef}
          style={{ display: 'flex', transform: `translateX(-${x}px)`, transition: 'none', touchAction: 'pan-x' }}
          {...handlers}
        >
          {chips.map(([k,v]) => <Chip key={k} label={k} value={v} />)}
          {chips.map(([k,v]) => <Chip key={`${k}-dup`} label={k} value={v} />)}
        </div>
      </div>
      {/* Espaciador del alto real de la barra */}
      <div style={{ height: spacerH }} />
    </>
  );
}
