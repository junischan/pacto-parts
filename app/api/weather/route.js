import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let lastGood = null; let lastTs = 0;
async function fetchWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController(); const t = setTimeout(()=>ctrl.abort(), ms);
  try { return await fetch(url, { cache:'no-store', signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get('lat')) || -25.2637;
    const lon = Number(searchParams.get('lon')) || -57.5759;

    try {
      const r = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`);
      if (r.ok) {
        const j = await r.json();
        const c = j?.current || j?.current_weather || {};
        const cur = {
          temperature_2m: Number(c.temperature_2m ?? c.temperature ?? NaN),
          relative_humidity_2m: Number(c.relative_humidity_2m ?? c.humidity ?? NaN),
          wind_speed_10m: Number(c.wind_speed_10m ?? c.windspeed ?? NaN),
          precipitation: Number(c.precipitation ?? 0),
        };
        if (Number.isFinite(cur.temperature_2m)) { lastGood = cur; lastTs = Date.now(); return NextResponse.json({ ok:true, current:cur, source:'open-meteo' }); }
      }
    } catch {}

    try {
      const r2 = await fetchWithTimeout(`https://wttr.in/${lat},${lon}?format=j1`, 7000);
      if (r2.ok) {
        const j2 = await r2.json();
        const c = j2?.current_condition?.[0] || {};
        const cur = {
          temperature_2m: Number(c.temp_C ?? c.temp_c ?? NaN),
          relative_humidity_2m: Number(c.humidity ?? NaN),
          wind_speed_10m: Number(c.windspeedKmph ?? NaN),
          precipitation: Number(c.precipMM ?? 0),
        };
        if (Number.isFinite(cur.temperature_2m)) { lastGood = cur; lastTs = Date.now(); return NextResponse.json({ ok:true, current:cur, source:'wttr' }); }
      }
    } catch {}

    if (lastGood && Date.now() - lastTs < 10800000) return NextResponse.json({ ok:true, current:lastGood, source:'cache' });
    return NextResponse.json({ ok:true, current:{ temperature_2m:NaN, relative_humidity_2m:NaN, wind_speed_10m:NaN, precipitation:0 }, source:'placeholder' });
  } catch {
    return NextResponse.json({ ok:true, current:{ temperature_2m:NaN, relative_humidity_2m:NaN, wind_speed_10m:NaN, precipitation:0 }, source:'placeholder' });
  }
}
