'use client';
import { useState, useEffect, useRef } from 'react';

export default function CurrencyTicker() {
  const [rates, setRates] = useState({ Dólar: 0, Euro: 0, Real: 0, 'Peso Argentino': 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tickerRef = useRef(null);
  const order = ['Real', 'Dólar', 'Euro', 'Peso Argentino']; // orden deseado

  const fetchRates = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/rates', { cache: 'no-store' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      setRates(json.rates);
      setError(null);
    } catch (e) {
      console.error('fetch /api/rates failed:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const id = setInterval(fetchRates, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf;
    const animate = () => {
      if (tickerRef.current) {
        const cw = tickerRef.current.offsetWidth;
        const sw = tickerRef.current.scrollWidth;
        setScrollPosition((p) => (p + 0.5 > sw - cw ? 0 : p + 0.5));
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (loading) return (
    <div style={{background:'linear-gradient(135deg,#0a0f1e,#1a1f35)',color:'#64c8ff',padding:12,textAlign:'center',fontSize:13,fontWeight:600}}>
      Cargando tasas de cambio...
    </div>
  );

  if (error) return (
    <div style={{background:'linear-gradient(135deg,#2d1b1b,#1a0f0f)',color:'#ff6b6b',padding:12,textAlign:'center',fontSize:13,fontWeight:600}}>
      Error al cargar tasas
    </div>
  );

  const items = order.map((k) => [k, rates[k]]).filter(([,v]) => v);

  const Chip = ({label, value}) => (
    <span style={{marginRight:24,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:20,background:'rgba(30,41,59,.6)',border:'1px solid rgba(100,200,255,.2)',fontWeight:700,fontSize:13,boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}>
      <span style={{color:'#64c8ff'}}>{label}:</span>
      <span style={{color:'#ffd700'}}>₲{Math.round(value).toLocaleString('es-PY')}</span>
    </span>
  );

  return (
    <div style={{background:'linear-gradient(135deg,#0a0f1e,#1a1f35)',color:'#e2e8f0',padding:'12px 0',fontSize:14,overflow:'hidden',whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(0,0,0,.5)',position:'sticky',top:0,zIndex:100,borderBottom:'2px solid rgba(100,200,255,.2)'}}>
      <div ref={tickerRef} style={{display:'flex',transform:`translateX(-${scrollPosition}px)`,transition:'none'}}>
        {items.map(([k,v]) => <Chip key={k} label={k} value={v} />)}
        {items.map(([k,v]) => <Chip key={`${k}-dup`} label={k} value={v} />)}
      </div>
    </div>
  );
}
