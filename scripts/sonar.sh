#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker run --rm \
  --network sonar_net \
  --env-file "$ROOT_DIR/.env.sonar" \
  -v "$ROOT_DIR:/usr/src" \
  sonarsource/sonar-scanner-cli:latest
