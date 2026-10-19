#!/bin/bash
# Prepares Claude Code cloud sessions: installs dependencies and points
# Playwright at the preinstalled Chromium, whose build rarely matches the
# one expected by the pinned @playwright/test version.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
pnpm install --frozen-lockfile

chromium="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}/chromium"
if [ -x "$chromium" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=\"$chromium\"" >> "$CLAUDE_ENV_FILE"
fi
