#!/data/data/com.termux/files/usr/bin/bash
set -e
DIR="${1:-/storage/emulated/0/DCIM/Camera}"
PRICE="${2:-100000}"
CAT="${3:-Varios}"

for f in "$DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  [ -e "$f" ] || continue
  base="$(basename "$f")"
  title="${base%.*}"
  node "$(dirname "$0")/add-product.mjs" --title "$title" --price "$PRICE" --category "$CAT" --image "$f"
done
echo "✅ Carga masiva terminada."
