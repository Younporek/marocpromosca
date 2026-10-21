#!/usr/bin/env python3
"""Resume lisible des deux rapports de securite du laboratoire."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_report(name):
    path = ROOT / 'reports' / name
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except FileNotFoundError:
        print(f'ERREUR : rapport absent : {name}')
        return None
    except json.JSONDecodeError:
        print(f'ERREUR : rapport JSON illisible : {name}')
        return None


sast = read_report('sast.json')
sca = read_report('sca.json')
errors = 0
print('=== SYNTHESE DE SECURITE : MAROCPROMO ===')

if not isinstance(sast, dict):
    errors += 1
else:
    findings = sast.get('results', [])
    tool_errors = sast.get('errors', [])
    print(f'SAST / Semgrep : {len(findings)} alerte(s)')
    for issue in findings:
        where = issue.get('path', '?')
        line = issue.get('start', {}).get('line', '?')
        rule = issue.get('check_id', '?')
        print(f'  - {where}:{line} | {rule}')
    if findings or tool_errors:
        errors += 1
    if tool_errors:
        print(f'  ERREURS SEMGREP : {len(tool_errors)}')

if not isinstance(sca, dict):
    errors += 1
elif sca.get('error'):
    print('SCA / npm audit : ERREUR de consultation du registre ou du lockfile')
    print(f"  Detail : {sca['error']}")
    errors += 1
else:
    vulns = sca.get('vulnerabilities', {})
    blocking = [(pkg, info) for pkg, info in vulns.items()
                if info.get('severity') in ('high', 'critical')]
    print(f'SCA / npm audit : {len(blocking)} paquet(s) avec alerte HIGH/CRITICAL')
    for package, info in blocking:
        print(f"  - {package} | niveau : {info.get('severity', '?')}")
    if blocking:
        errors += 1

print('SECURITY GATE : ' + ('FAIL - livraison interdite' if errors else 'PASS - analyses conformes au seuil'))
raise SystemExit(1 if errors else 0)
