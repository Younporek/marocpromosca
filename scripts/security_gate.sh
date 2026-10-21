#!/usr/bin/env bash
# Lance les deux scanners, meme si le premier trouve une vulnerabilite.
set -u
set -o pipefail
mkdir -p reports

printf '\n==== 1/2 : SAST - Semgrep ====\n'
if command -v semgrep >/dev/null 2>&1; then
  semgrep scan --config rules/no-eval.yml --error --json \
    --output reports/sast.json --metrics=off src
  sast_rc=$?
else
  printf '{"results":[],"errors":[{"message":"Semgrep absent sur l agent"}]}\n' > reports/sast.json
  sast_rc=2
fi

printf '\n==== 2/2 : SCA - npm audit ====\n'
npm audit --omit=dev --audit-level=high --json > reports/sca.json
sca_rc=$?

printf '\n==== 3/3 : Rapport commun ====\n'
python3 scripts/security_summary.py | tee reports/security-summary.txt
summary_rc=${PIPESTATUS[0]}

if [ "$sast_rc" -ne 0 ] || [ "$sca_rc" -ne 0 ] || [ "$summary_rc" -ne 0 ]; then
  printf 'SECURITY GATE : FAIL (semgrep=%s, npm-audit=%s, synthese=%s)\n' \
    "$sast_rc" "$sca_rc" "$summary_rc"
  exit 1
fi
printf 'SECURITY GATE : PASS\n'
