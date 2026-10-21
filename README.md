# TP n°4 - TeamCity : SAST + SCA avec MarocPromo

**Laboratoire isolé uniquement** : les sources initiales contiennent volontairement
un appel à `eval()` et utilisent `lodash@4.17.15` (version vulnérable).
Ne pas exposer ce mini-service en production.

## VMs
- VM 1 Ubuntu : TeamCity Server (orchestration).
- VM 2 Ubuntu : TeamCity Build Agent (Node.js, npm, Python 3, Semgrep).

## Préparer le dépôt Git
1. Décompresser le kit et ouvrir un terminal dans `marocpromo-lab`.
2. Créer le **lockfile officiel** (accès Internet au registre npm requis) :
   `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`
3. Vérifier : `npm ci --ignore-scripts --no-audit --no-fund && npm test`.
4. Pousser vers un dépôt Git distant et connecter TeamCity au VCS Root.

**Pourquoi pas de package-lock.json dans le ZIP ?** Il est généré par npm lui-même
avant le premier commit, pour éviter de distribuer un lockfile reconstruit sans accès
au registre. TeamCity utilise ensuite `npm ci` pour respecter ce lockfile versionné.

## TeamCity
Consulter `TEAMCITY_STEPS_A_COPIER.txt` et le guide Word/PDF.

## Démonstration attendue
1. Première analyse : SAST FAIL (`eval`), SCA FAIL (`lodash@4.17.15`).
2. Copier `solution/promo.fixed.js` vers `src/promo.js` ; commit/push : SAST PASS, SCA FAIL.
3. Exécuter :
   `npm install --save-exact lodash@4.18.1 --package-lock-only --ignore-scripts --no-audit --no-fund`
   puis commit/push des fichiers `package.json` et `package-lock.json` : les deux gates passent.

Les sorties scanner dépendent de leurs versions, de la base d'avis et de la connectivité.
Les règles Semgrep fournies sont volontairement ciblées sur `eval()` ; un scan PASS
n'est pas un audit exhaustif de sécurité.
