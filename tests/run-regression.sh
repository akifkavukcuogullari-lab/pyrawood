#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0

echo "=== Pyra Wood Regression Suite ==="
echo "Root: $ROOT_DIR"
echo ""

run_suite() {
  local name="$1"
  local dir="$2"
  local cmd="$3"

  echo "--- $name ---"
  if (cd "$ROOT_DIR/$dir" && eval "$cmd"); then
    PASS=$((PASS + 1))
    echo "PASSED: $name"
  else
    FAIL=$((FAIL + 1))
    echo "FAILED: $name"
  fi
  echo ""
}

run_suite "Backend Unit Tests" "backend" "npm run test:unit"
run_suite "Backend Integration Tests" "backend" "npm run test:integration"
run_suite "Frontend Unit Tests" "frontend" "npm test -- --passWithNoTests"
run_suite "Frontend E2E Tests" "frontend" "npx playwright test"

echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  echo "Some suites failed."
  exit 1
fi

echo "All suites passed."
exit 0
