#!/bin/sh
# Gera /config.js com a identidade visual do sistema a partir de variáveis de
# ambiente. Executado pelo entrypoint oficial do nginx:alpine
# (/docker-entrypoint.d) toda vez que o container sobe, então trocar o .env ou
# os arquivos da pasta branding exige apenas `docker compose up -d`.
#
# Variáveis (todas opcionais):
#   APP_TITLE            título da aba e do sistema
#   APP_PRIMARY_COLOR    cor primária em hex (#rgb ou #rrggbb)
#   APP_SECONDARY_COLOR  cor secundária em hex
#   APP_LOGO_FILE        nome do arquivo de logo dentro da pasta branding
#   APP_BACKGROUND_FILE  nome do arquivo de fundo dentro da pasta branding
#
# A pasta branding é montada em /usr/share/nginx/html/branding. Arquivo
# ausente ou inválido cai no padrão embutido na imagem (/img/...).

set -eu

HTML_DIR="${APP_HTML_DIR:-/usr/share/nginx/html}"
BRANDING_DIR="$HTML_DIR/branding"
OUT="$HTML_DIR/config.js"

DEFAULT_TITLE="Guarda - 6° RCB"
DEFAULT_PRIMARY="#dc2626"
DEFAULT_SECONDARY="#991b1b"
DEFAULT_LOGO="/img/logo.png"
DEFAULT_BACKGROUND="/img/bg-cover.png"

log() { echo "app-config: $*"; }

# Escapa para string JSON/JS entre aspas duplas.
json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/</\\u003c/g' | tr -d '\r\n'
}

color_or_default() {
  value="$1"; fallback="$2"; name="$3"
  if [ -z "$value" ]; then
    printf '%s' "$fallback"
  elif printf '%s' "$value" | grep -Eq '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'; then
    printf '%s' "$value"
  else
    log "$name inválida ('$value'); usando $fallback" >&2
    printf '%s' "$fallback"
  fi
}

# Resolve um arquivo da pasta branding. Adiciona ?v=<mtime> para que todos os
# navegadores busquem a imagem nova quando o arquivo for trocado.
asset_or_default() {
  file="$1"; fallback="$2"; name="$3"
  if [ -z "$file" ]; then
    printf '%s' "$fallback"
    return
  fi
  if ! printf '%s' "$file" | grep -Eq '^[A-Za-z0-9._-]+$'; then
    log "$name com nome inválido ('$file'); usando $fallback" >&2
    printf '%s' "$fallback"
    return
  fi
  if [ ! -f "$BRANDING_DIR/$file" ]; then
    log "$name '$file' não encontrado em $BRANDING_DIR; usando $fallback" >&2
    printf '%s' "$fallback"
    return
  fi
  version=$(stat -c %Y "$BRANDING_DIR/$file" 2>/dev/null || echo 0)
  printf '/branding/%s?v=%s' "$file" "$version"
}

TITLE="${APP_TITLE:-$DEFAULT_TITLE}"
PRIMARY=$(color_or_default "${APP_PRIMARY_COLOR:-}" "$DEFAULT_PRIMARY" APP_PRIMARY_COLOR)
SECONDARY=$(color_or_default "${APP_SECONDARY_COLOR:-}" "$DEFAULT_SECONDARY" APP_SECONDARY_COLOR)
LOGO=$(asset_or_default "${APP_LOGO_FILE:-logo.png}" "$DEFAULT_LOGO" APP_LOGO_FILE)
BACKGROUND=$(asset_or_default "${APP_BACKGROUND_FILE:-bg-cover.png}" "$DEFAULT_BACKGROUND" APP_BACKGROUND_FILE)

cat > "$OUT" <<EOF
window.__APP_CONFIG__ = {
  "title": "$(json_escape "$TITLE")",
  "primaryColor": "$PRIMARY",
  "secondaryColor": "$SECONDARY",
  "logo": "$(json_escape "$LOGO")",
  "background": "$(json_escape "$BACKGROUND")"
};
EOF

log "config.js gerado (logo=$LOGO, background=$BACKGROUND)"
