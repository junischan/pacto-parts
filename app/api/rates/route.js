import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!r.ok) return NextResponse.json({ ok:false, error:`HTTP ${r.status}` }, { status: 500 });
    const j = await r.json();
    const rates = j?.rates || {};
    const usd_pyg = Number(rates.PYG || 0);
    const eur_usd = Number(rates.EUR || 0);
    const brl_usd = Number(rates.BRL || 0);
    const ars_usd = Number(rates.ARS || 0);

    const out = {
      'Dólar': usd_pyg,
      'Euro':  eur_usd ? usd_pyg / eur_usd : 0,
      'Real':  brl_usd ? usd_pyg / brl_usd : 0,
      'Peso Argentino': ars_usd ? usd_pyg / ars_usd : 0,
    };
    return NextResponse.json({ ok:true, rates: out, provider: 'open-er-api' });
  } catch (e) {
    return NextResponse.json({ ok:false, error:String(e) }, { status: 500 });
  }
}
