'use client';
import { useEffect, useRef, useState } from 'react';

export default function CryptoTicker({ moneda = 'PYG' }) { // 'PYG' | 'USD' | 'BRL'
  const [data, setData] = useState(null);
  const [err, setErr]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [x, setX] = useState(0);
  const ref = useRef(null);

  const fetchCrypto = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/crypto', { cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'ok:false');
      setData(j.coins);
      setErr(null);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrypto();
    const id = setInterval(fetchCrypto, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current) {
        const cw = ref.current.offsetWidth, sw = ref.current.scrollWidth;
        setX((p) => (p + 0.6 > sw - cw ? 0 : p + 0.6));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmt = (v) => {
    if (moneda === 'PYG') return `₲${Math.round(v).toLocaleString('es-PY')}`;
    if (moneda === 'BRL') return `R$ ${v.toFixed(2)}`;
    return `$ ${v.toFixed(2)}`;
  };

  if (loading) return null;
  if (err || !data) return null;

  const chips = [
    ['BTC', data.BTC?.[moneda]],
    ['ETH', data.ETH?.[moneda]],
    ['USDT', data.USDT?.[moneda]],
  ].filter(([,v]) => !!v);

  const Chip = ({k, v}) => (
    <span style={{marginRight:24,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:20,background:'rgba(30,41,59,.6)',border:'1px solid rgba(100,200,255,.2)',fontWeight:700,fontSize:13,boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}>
      <span style={{color:'#64c8ff'}}>{k}:</span>
      <span style={{color:'#ffd700'}}>{fmt(v)}</span>
    </span>
  );

  return (
    <div style={{background:'linear-gradient(135deg,#0a0f1e,#142038)',color:'#e2e8f0',padding:'10px 0',fontSize:14,overflow:'hidden',whiteSpace:'nowrap',borderBottom:'1px solid rgba(100,200,255,.15)'}}>
      <div ref={ref} style={{display:'flex',transform:`translateX(-${x}px)`,transition:'none'}}>
        {chips.map(([k,v]) => <Chip key={k} k={k} v={v} />)}
        {chips.map(([k,v]) => <Chip key={`${k}-dup`} k={k} v={v} />)}
      </div>
    </div>
  );
}
