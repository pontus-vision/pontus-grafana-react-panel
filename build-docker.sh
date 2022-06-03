#!/bin/bash
TAG=${TAG:-1.15.0}
set -e
DIR="$( cd "$(dirname "$0")" ; pwd -P )"
cd $DIR
docker build \
  --rm \
  -t pontusvisiongdpr/pontus-grafana-react-panel:${TAG} \
  --build-arg GRAFANA_API_KEY=${GRAFANA_API_KEY} \
  .
docker push pontusvisiongdpr/pontus-grafana-react-panel:${TAG}
