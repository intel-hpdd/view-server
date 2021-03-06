#!/bin/sh

set -e

until [ -f /var/lib/chroma/iml-settings.conf ]; do
  echo "Waiting for settings."
  sleep 1
done

set -a
source /var/lib/chroma/iml-settings.conf
set +a

exec $@
