#!/usr/bin/env bash
set -e

ACTION="${1:-reload}"

case "$ACTION" in
  reload|rebuild)
    echo "🔨 Reconstruyendo y actualizando contenedor en producción..."
    docker compose up -d --build
    ;;
  restart)
    echo "🔄 Reiniciando contenedor guitar-companion..."
    docker compose restart guitar-companion
    ;;
  logs)
    docker compose logs -f guitar-companion
    ;;
  *)
    echo "Uso: $0 [reload|restart|logs]"
    exit 1
    ;;
esac
