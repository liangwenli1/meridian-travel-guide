#!/bin/sh
set -eu
cd "$(dirname "$0")"

CONFIG_FILE="${CONFIG_FILE:-/opt/meridian/config.json}"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Missing $CONFIG_FILE"
  echo "Put the real config at /opt/meridian/config.json (the repo copy is placeholders only)."
  exit 1
fi

export POSTGRES_PASSWORD="$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).database.password || '')" "$CONFIG_FILE")"
export APP_PORT="$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).site.port || 3000))" "$CONFIG_FILE")"

case "$POSTGRES_PASSWORD" in
  "" | CHANGE_ME*)
    echo "Fill the CHANGE_ME_* fields in $CONFIG_FILE first."
    exit 1
    ;;
esac

exec docker compose up "$@"
