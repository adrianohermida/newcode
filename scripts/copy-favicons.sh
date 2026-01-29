#!/bin/bash
# Copia favicons e apple-touch-icons para a pasta de build (dist/assets)
set -e

SRC_DIR="$(dirname "$0")/.."
ASSET_DIR="$SRC_DIR/assets"
DIST_ASSET_DIR="$SRC_DIR/dist/assets"

mkdir -p "$DIST_ASSET_DIR"

# Copia todos os favicons e apple-touch-icons do root
cp -v $SRC_DIR/favicon.ico $DIST_ASSET_DIR/ 2>/dev/null || true
cp -v $SRC_DIR/apple-touch-icon*.png $DIST_ASSET_DIR/ 2>/dev/null || true
cp -v $SRC_DIR/genfavicon-*.png $DIST_ASSET_DIR/ 2>/dev/null || true


# Copia do assets SEMPRE, nunca deleta, apenas sobrescreve se houver novo
cp -u -v $ASSET_DIR/apple-touch-icon*.png $DIST_ASSET_DIR/ 2>/dev/null || true
cp -u -v $ASSET_DIR/genfavicon-*.png $DIST_ASSET_DIR/ 2>/dev/null || true
cp -u -v $ASSET_DIR/favicon.ico $DIST_ASSET_DIR/ 2>/dev/null || true

# Copia o manifest se existir
if [ -f "$SRC_DIR/site.webmanifest" ]; then
  cp -v "$SRC_DIR/site.webmanifest" "$DIST_ASSET_DIR/"
fi

echo "Arquivos copiados para $DIST_ASSET_DIR:"
ls -lh $DIST_ASSET_DIR | grep icon || true
ls -lh $DIST_ASSET_DIR | grep favicon || true
