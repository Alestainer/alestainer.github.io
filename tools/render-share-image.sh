#!/usr/bin/env bash
# Renders a share image from a standalone HTML file in tools/.
# Kept out of src/pages because Astro scopes <style> blocks, which broke the layout.
#   ./tools/render-share-image.sh tools/share-image-001.html public/img/which-map-is-random-og.png
set -euo pipefail
B="$HOME/.claude/skills/gstack/browse/dist/browse"
SRC="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="$2"
TMP="/tmp/share-image-$$.png"
"$B" viewport 1300x800 --scale 2 >/dev/null
"$B" goto "file://$SRC" >/dev/null
sleep 2
"$B" screenshot "$TMP" --selector "#card" >/dev/null
cp "$TMP" "$OUT" && rm -f "$TMP"
echo "wrote $OUT"
