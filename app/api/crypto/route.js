import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // FX USD->PYG/BRL
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!fxRes.ok) return NextResponse.json({ ok:false, error:`FX HTTP ${fxRes.status}` }, { status: 500 });
    const fx = await fxRes.json();
    const R = fx?.rates || {};
    const USD_PYG = Number(R.PYG) || 0;
    const USD_BRL = Number(R.BRL) || 0;

    // Precios cripto (CoinGecko)
    const ids = ['bitcoin','ethereum','tether','binancecoin'].join(',');
    const cgRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, { cache: 'no-store' });
    if (!cgRes.ok) return NextResponse.json({ ok:false, error:`CG HTTP ${cgRes.status}` }, { status: 500 });
    const cg = await cgRes.json();

    const mk = (id) => {
      const usd = Number(cg?.[id]?.usd) || 0;
      return { USD: usd, PYG: usd * USD_PYG, BRL: usd * USD_BRL };
    };

    return NextResponse.json({
      ok: true,
      coins: {
        BTC: mk('bitcoin'),
        ETH: mk('ethereum'),
        USDT: mk('tether'),
        BNB: mk('binancecoin'),
      },
      provider: { prices: 'coingecko', fx: 'open.er-api.com' }
    });
  } catch (e) {
    return NextResponse.json({ ok:false, error:String(e) }, { status: 500 });
  }
}
