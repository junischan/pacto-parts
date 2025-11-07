'use client';
import { useEffect, useRef, useState } from 'react';

export default function CompactMetaBarPRO({
  baseSpeed = 3.4,
  friction  = 0.92,
  maxFling  = 28,
  debug = false,
}) {
  const [fx, setFx] = useState(null);
  const [wx, setWx] = useState(null);   // dejamos el último bueno
  const [cx, setCx] = useState(null);
  const [x,  setX]  = useState(0);
  const [spacerH, setSpacerH] = useState(44);

  const barRef   = useRef(null);
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const momentum = useRef(0);
  const rafId    = useRef(0);
  const lastPos  = useRef(0);
  const lastTime = useRef(0);
  const vSamples = useRef([]);

  // fetchers con "no pisar si falla"
  const loadAll = async () => {
    try {
      const [w, r, c] = await Promise.allSettled([
        fetch('/api/weather', { cache: 'no-store' }),
        fetch('/api/rates',   { cache: 'no-store' }),
        fetch('/api/crypto',  { cache: 'no-store' }),
      ]);
      if (w.status === 'fulfilled') {
        const j = await w.value.json();
        if (j.ok && j.current) setWx(j.current); // NO hacemos setWx(null) nunca
      }
      if (r.status === 'fulfilled') {
        const j = await r.value.json();
        if (j.ok && j.rates) setFx(j.rates);
      }
      if (c.status === 'fulfilled') {
        const j = await c.value.json();
        if (j.ok && j.coins) setCx(j.coins);
      }
    } catch {}
  };

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 60000);
    return () => clearInterval(id);
  }, []);

  // medir barra para spacer
  const measure = () => setSpacerH(barRef.current?.offsetHeight || 44);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (barRef.current) ro.observe(barRef.current);
    const onRes = () => measure();
    window.addEventListener('resize', onRes);
    return () => { ro.disconnect(); window.removeEventListener('resize', onRes); };
  }, []);

  // animación + momentum
  useEffect(() => {
    const tick = () => {
      const el = trackRef.current;
      if (el && !dragging.current) {
        const cw = el.offsetWidth, sw = el.scrollWidth;
        let step = baseSpeed + momentum.current;
        let next = x + step;
        if (next < 0) next = 0;
        if (next > sw - cw) next = 0;
        setX(next);
        momentum.current *= friction;
        if (Math.abs(momentum.current) < 0.06) momentum.current = 0;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [x, baseSpeed, friction]);

  // drag + fling
  const pushV = (v) => { vSamples.current.push(v); if (vSamples.current.length > 6) vSamples.current.shift(); };
  const start = (clientX) => { dragging.current = true; lastPos.current = clientX; lastTime.current = performance.now(); momentum.current = 0; vSamples.current = []; };
  const move  = (clientX) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTime.current);
    const dx = clientX - lastPos.current;
    lastPos.current = clientX; lastTime.current = now;

    setX((p) => {
      const el = trackRef.current; if (!el) return p;
      const cw = el.offsetWidth, sw = el.scrollWidth;
      let nx = p - dx;
      if (nx < 0) nx = 0;
      if (nx > sw - cw) nx = sw - cw;
      return nx;
    });

    pushV(dx / dt); // px/ms
  };
  const end   = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const s = vSamples.current; let avg = 0;
    if (s.length) {
      let vsum = 0, wsum = 0;
      for (let i = 0; i < s.length; i++) { const w = i + 1; vsum += s[i] * w; wsum += w; }
      avg = vsum / wsum;
    }
    let pxpf = -avg * 16; // signo para seguir lectura
    if (pxpf >  maxFling) pxpf =  maxFling;
    if (pxpf < -maxFling) pxpf = -maxFling;
    momentum.current = pxpf;
    vSamples.current = [];
  };

  const handlers = {
    onMouseDown: (e) => start(e.clientX),
    onMouseMove: (e) => move(e.clientX),
    onMouseUp: end, onMouseLeave: end,
    onTouchStart: (e) => start(e.touches[0].clientX),
    onTouchMove:  (e) => move(e.touches[0].clientX),
    onTouchEnd: end,
  };

  // helpers UI
  const money = (v) => `₲${Math.round(v || 0).toLocaleString('es-PY')}`;
  const dash  = (v, unit='') => (Number.isFinite(v) ? `${v}${unit}` : '—');

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

  // SIEMPRE mostramos los 4 chips de clima (con “—” si no hay datos aún)
  const chips = [];
  const t = wx?.temperature_2m, h = wx?.relative_humidity_2m, w = wx?.wind_speed_10m, p = wx?.precipitation;
  chips.push(['🌡️', dash(t, '°C')]);
  chips.push(['💧',  dash(h, '%')]);
  chips.push(['💨',  dash(w, ' km/h')]);
  chips.push(['☔',  dash(p, ' mm')]);

  if (fx) {
    chips.push(['Dólar', money(fx['Dólar'])]);
    chips.push(['Euro',  money(fx['Euro'])]);
    chips.push(['Real',  money(fx['Real'])]);
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
          zIndex: 9999, outline: debug ? '2px solid fuchsia' : 'none',
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
      <div style={{ height: spacerH }} />
    </>
  );
}
