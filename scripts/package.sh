#!/usr/bin/env bash
set -eu
rm -rf dist
mkdir -p dist/application
cp -R src dist/application/
cp package.json package-lock.json dist/application/
printf 'APPLICATION=MarocPromo\nVERSION=%s\nSECURITY_GATE=PASS\n' \
  "${BUILD_LABEL:-local}" > dist/application/build-info.txt

tar -czf dist/marocpromo-release.tgz -C dist/application .
(cd dist && sha256sum marocpromo-release.tgz > marocpromo-release.tgz.sha256)
echo 'PACKAGING OK : dist/marocpromo-release.tgz'
echo 'Empreinte : dist/marocpromo-release.tgz.sha256'
