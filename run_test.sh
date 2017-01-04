#!/usr/bin/env bash
set -ex

. ~/.nvm/nvm.sh

NODE_VERSIONS="
6
stable
"

for node_version in $NODE_VERSIONS
do
    nvm use $node_version
    rm -rf node_modules
    yarn install
    yarn run cover -- --reporter=cobertura
    mv *results*.xml ../results
done
