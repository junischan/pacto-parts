import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ ok:false, error:`HTTP ${res.status}` }, { status: 500 });

    const data = await res.json();
    const r = data?.rates || {};
    const usdEnPyg = Number(r.PYG) || 0;   // 1 USD en ₲
    const eurUsd  = Number(r.EUR) || 0;    // 1 USD = X EUR
    const brlUsd  = Number(r.BRL) || 0;    // 1 USD = Y BRL
    const arsUsd  = Number(r.ARS) || 0;    // 1 USD = Z ARS

    const eurEnPyg = eurUsd > 0 ? usdEnPyg / eurUsd : 0; // 1 EUR en ₲
    const brlEnPyg = brlUsd > 0 ? usdEnPyg / brlUsd : 0; // 1 BRL en ₲
    const arsEnPyg = arsUsd > 0 ? usdEnPyg / arsUsd : 0; // 1 ARS en ₲

    return NextResponse.json({
      ok: true,
      rates: {
        'Dólar': usdEnPyg,
        'Euro':  eurEnPyg,
        'Real':  brlEnPyg,
        'Peso Argentino': arsEnPyg
      },
      provider: 'open.er-api.com'
    });
  } catch (e) {
    return NextResponse.json({ ok:false, error:String(e) }, { status: 500 });
  }
}
