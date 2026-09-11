#!/bin/sh
set -eu
cd "$(dirname "$0")"

if [ ! -f config.json ]; then
  echo "config.json is missing"
  exit 1
fi

export POSTGRES_PASSWORD="$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('config.json','utf8')).database.password || '')")"
export APP_PORT="$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('config.json','utf8')).site.port || 3000))")"

case "$POSTGRES_PASSWORD" in
  "" | CHANGE_ME*)
    echo "Fill the CHANGE_ME_* fields in config.json first."
    exit 1
    ;;
esac

exec docker compose up "$@"
