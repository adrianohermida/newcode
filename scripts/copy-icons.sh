#!/bin/bash
# Copia favicons e apple-touch-icon para o diretório dist (build final)
set -e

# Caminho de origem dos ícones
SRC_DIR="/workspaces/newcode/src/react-app/assets/img"
DIST_DIR="/workspaces/newcode/dist"

# Lista de ícones esperados
ICONS=(
  "favicon.ico"
  "genfavicon-16.png"
  "genfavicon-32.png"
  "apple-touch-icon-57x57.png"
  "apple-touch-icon-114x114.png"
  "apple-touch-icon-120x120.png"
  "apple-touch-icon-180x180.png"
)

mkdir -p "$DIST_DIR"
for icon in "${ICONS[@]}"; do
  if [ -f "$SRC_DIR/$icon" ]; then
    cp "$SRC_DIR/$icon" "$DIST_DIR/$icon"
    echo "Copiado: $icon"
  else
    echo "Aviso: $icon não encontrado em $SRC_DIR"
  fi
  
  # Também copia para raiz do projeto se necessário
  if [ -f "$SRC_DIR/$icon" ]; then
    cp "$SRC_DIR/$icon" "/workspaces/newcode/$icon"
  fi
  
  # Também copia para /assets se necessário
  if [ -f "$SRC_DIR/$icon" ]; then
    cp "$SRC_DIR/$icon" "/workspaces/newcode/assets/$icon"
  fi

done

echo "Favicons e apple-touch-icon copiados para dist, raiz e assets."
