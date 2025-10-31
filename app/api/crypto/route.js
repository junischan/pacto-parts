import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // USD->PYG
    const fr = await fetch('https://open-er-api.com/v6/latest/USD'.replace('open-er','open.er'), { cache: 'no-store' });
    if (!fr.ok) return NextResponse.json({ ok:false, error:`rates HTTP ${fr.status}` }, { status: 500 });
    const fj = await fr.json();
    const usd_pyg = Number(fj?.rates?.PYG || 0);
    if (!usd_pyg) return NextResponse.json({ ok:false, error:'PYG rate missing' }, { status: 500 });

    // Cripto en USD (CoinGecko)
    const cr = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin&vs_currencies=usd', { cache: 'no-store' });
    if (!cr.ok) return NextResponse.json({ ok:false, error:`cg HTTP ${cr.status}` }, { status: 500 });
    const cj = await cr.json();

    const map = (usd) => ({ USD: Number(usd||0), PYG: Number(usd||0) * usd_pyg });
    const out = {
      BTC: map(cj?.bitcoin?.usd),
      ETH: map(cj?.ethereum?.usd),
      USDT: map(cj?.tether?.usd ?? 1),
      BNB: map(cj?.binancecoin?.usd),
    };
    return NextResponse.json({ ok:true, coins: out, provider: 'coingecko+open-er-api' });
  } catch (e) {
    return NextResponse.json({ ok:false, error:String(e) }, { status: 500 });
  }
}
