#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
PORT=3000
pkill -f "next|node|npm" 2>/dev/null || true
export NODE_OPTIONS="--max-old-space-size=512"
nohup npx next start -H 0.0.0.0 -p "$PORT" > .next-prod.log 2>&1 &
echo "✅ Servidor iniciado en puerto $PORT (PID $!) — log: .next-prod.log"
