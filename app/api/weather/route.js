import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let lastGood = null;         // { temperature_2m, relative_humidity_2m, wind_speed_10m, precipitation, source, ts }
let lastTs   = 0;

async function fetchWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    return r;
  } finally {
    clearTimeout(t);
  }
}

function packCurrent(src) {
  const c = src?.current || src?.current_weather || {};
  return {
    temperature_2m: Number(c.temperature_2m ?? c.temperature ?? c.temp_C ?? c.temp_c ?? NaN),
    relative_humidity_2m: Number(c.relative_humidity_2m ?? c.humidity ?? NaN),
    wind_speed_10m: Number(c.wind_speed_10m ?? c.windspeed ?? c.windspeedKmph ?? NaN),
    precipitation: Number(c.precipitation ?? c.precipMM ?? 0),
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get('lat')) || -25.2637; // Asunción
    const lon = Number(searchParams.get('lon')) || -57.5759;

    // 1) Open-Meteo
    try {
      const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;
      const r = await fetchWithTimeout(omUrl, 6000);
      if (r.ok) {
        const j = await r.json();
        const cur = packCurrent(j);
        if (Number.isFinite(cur.temperature_2m)) {
          lastGood = { ...cur, source: 'open-meteo' };
          lastTs = Date.now();
          return NextResponse.json({ ok: true, current: cur, source: 'open-meteo' });
        }
      }
    } catch {}

    // 2) wttr.in fallback
    try {
      const wUrl = `https://wttr.in/${lat},${lon}?format=j1`;
      const r2 = await fetchWithTimeout(wUrl, 7000);
      if (r2.ok) {
        const j2 = await r2.json();
        const curRaw = j2?.current_condition?.[0] || {};
        const cur = {
          temperature_2m: Number(curRaw.temp_C ?? curRaw.temp_c ?? NaN),
          relative_humidity_2m: Number(curRaw.humidity ?? NaN),
          wind_speed_10m: Number(curRaw.windspeedKmph ?? NaN),
          precipitation: Number(curRaw.precipMM ?? 0),
        };
        if (Number.isFinite(cur.temperature_2m)) {
          lastGood = { ...cur, source: 'wttr' };
          lastTs = Date.now();
          return NextResponse.json({ ok: true, current: cur, source: 'wttr' });
        }
      }
    } catch {}

    // 3) Caché en memoria (válida por 3 horas)
    if (lastGood && Date.now() - lastTs < 3 * 60 * 60 * 1000) {
      const { source, ...cur } = lastGood;
      return NextResponse.json({ ok: true, current: cur, source: 'cache' });
    }

    // 4) Último recurso: placeholder ok=true (la barra muestra "—")
    return NextResponse.json({
      ok: true,
      current: { temperature_2m: NaN, relative_humidity_2m: NaN, wind_speed_10m: NaN, precipitation: 0 },
      source: 'placeholder'
    });
  } catch (e) {
    // incluso si hay excepción, devolvemos ok:true con placeholder para no “desaparecer”
    return NextResponse.json({
      ok: true,
      current: { temperature_2m: NaN, relative_humidity_2m: NaN, wind_speed_10m: NaN, precipitation: 0 },
      source: 'placeholder'
    });
  }
}
