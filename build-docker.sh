#!/bin/bash
TAG=${TAG:-1.13.2}
set -e
DIR="$( cd "$(dirname "$0")" ; pwd -P )"
cd $DIR
docker build  --rm -t pontusvisiongdpr/pontus-grafana-react-panel:${TAG} .
docker push pontusvisiongdpr/pontus-grafana-react-panel:${TAG}
