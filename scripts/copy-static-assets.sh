#!/bin/bash
# Copia todos os favicons, apple-touch-icons e manifest para dist/assets
set -e

ASSETS=(
  apple-touch-icon-114x114.png
  apple-touch-icon-120x120.png
  apple-touch-icon-180x180.png
  apple-touch-icon-57x57.png
  apple-touch-icon.png
  favicon.ico
  genfavicon-114.png
  genfavicon-120.png
  genfavicon-128.png
  genfavicon-16.png
  genfavicon-180.png
  genfavicon-256.png
  genfavicon-32.png
  genfavicon-48.png
  genfavicon-512.png
  genfavicon-57.png
  genfavicon-64.png
  site.webmanifest
)

mkdir -p dist/assets

for asset in "${ASSETS[@]}"; do
  # Sempre prioriza ./assets
  if [ -f "./assets/$asset" ]; then
    cp -u "./assets/$asset" dist/assets/
  elif [ -f "$asset" ]; then
    cp -u "$asset" dist/assets/
  fi
done

echo "Assets copiados para dist/assets."
