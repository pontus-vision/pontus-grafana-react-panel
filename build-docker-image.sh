#!/bin/bash

set -e
DIR="$( cd "$(dirname "$0")" ; pwd -P )"
cd $DIR
docker build  --rm -t pontus-grafana-react-panel .
