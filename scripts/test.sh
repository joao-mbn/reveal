#!/bin/bash

set -e

project="${1:-platypus,platypus-core,platypus-common-utils}"

FORCE_COLOR=true nx run-many --target=test --projects=${project} "$@" \
  --ci \
  --verbose \
  --parallel \
  --runInBand \
  --detectOpenHandles \
  --reporters=default \
  --reporters=jest-junit \
  --coverageReporters=html,lcov,json,text-summary,cobertura \
  --collectCoverage \
  --watchAll=false