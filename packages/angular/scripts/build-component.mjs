#!/usr/bin/env node
// Compiles packages/angular/src (WithIconComponent, WithAttrsDirective, provideWithIcons) to
// Angular Package Format with ng-packagr — partial Ivy, linked by the consumer's Angular CLI —
// and stores the result in packages/angular/prebuilt/.
//
// The Angular toolchain is installed in an ISOLATED directory (never the repo root), by
// default <repo>/.tmp/angular-toolchain (override with WITH_ANGULAR_TOOLCHAIN=<dir>).
// forge/lib/emit-angular.mjs then combines prebuilt/ with the generated icon data, so the
// normal icon build (`node forge/build.mjs`) needs no Angular toolchain at all.
// Rerun this only when something in src/ changes:  node packages/angular/scripts/build-component.mjs
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(PKG, '..', '..')
const TOOL = path.resolve(process.env.WITH_ANGULAR_TOOLCHAIN || path.join(ROOT, '.tmp', 'angular-toolchain'))
const ANGULAR = process.env.WITH_ANGULAR_VERSION || '^22.0.0'
const DEPS = {
  '@angular/core': ANGULAR, '@angular/common': ANGULAR, '@angular/compiler': ANGULAR, '@angular/compiler-cli': ANGULAR,
  '@angular/platform-browser': ANGULAR, 'ng-packagr': ANGULAR, rxjs: '^7.8.0', tslib: '^2.6.0',
}

export function srcHash() {
  const h = crypto.createHash('sha256')
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .forEach(e => e.isDirectory() ? walk(path.join(d, e.name)) : h.update(e.name + '\0' + fs.readFileSync(path.join(d, e.name), 'utf8').replace(/\r\n/g, '\n')))
  walk(path.join(PKG, 'src'))
  return h.digest('hex').slice(0, 16)
}

const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' })
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const t0 = Date.now()
  if (!fs.existsSync(path.join(TOOL, 'node_modules', 'ng-packagr', 'package.json'))) {
    console.log(`installing Angular toolchain into ${TOOL} (isolated)`)
    fs.mkdirSync(TOOL, { recursive: true })
    fs.writeFileSync(path.join(TOOL, 'package.json'), JSON.stringify({ name: 'withicons-angular-toolchain', private: true, devDependencies: DEPS }, null, 2))
    sh('npm install --no-audit --no-fund --loglevel=error', TOOL)
  }
  const ver = n => JSON.parse(fs.readFileSync(path.join(TOOL, 'node_modules', n, 'package.json'), 'utf8')).version
  const WORK = path.join(TOOL, 'work')
  fs.rmSync(WORK, { recursive: true, force: true })
  fs.mkdirSync(WORK, { recursive: true })
  fs.cpSync(path.join(PKG, 'src'), path.join(WORK, 'src'), { recursive: true })
  fs.writeFileSync(path.join(WORK, 'package.json'), JSON.stringify({
    name: '@withicons/angular', version: '0.0.0-prebuilt', sideEffects: false,
    peerDependencies: { '@angular/core': '*' },
  }, null, 2))
  fs.writeFileSync(path.join(WORK, 'ng-package.json'), JSON.stringify({ dest: 'dist', lib: { entryFile: 'src/public-api.ts' } }, null, 2))
  sh(`node "${path.join(TOOL, 'node_modules', 'ng-packagr', 'src', 'cli', 'main.js')}" -p ng-package.json`, WORK)

  const DIST = path.join(WORK, 'dist')
  const fesm = path.join(DIST, 'fesm2022', 'withicons-angular.mjs')
  const dts = ['index.d.ts', 'types/withicons-angular.d.ts'].map(f => path.join(DIST, f)).find(f => fs.existsSync(f))
  if (!fs.existsSync(fesm) || !dts) throw new Error('ng-packagr output not found in ' + DIST)
  const OUT = path.join(PKG, 'prebuilt')
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })
  fs.writeFileSync(path.join(OUT, 'withicons-angular.mjs'), fs.readFileSync(fesm, 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/m, '\n'))
  fs.writeFileSync(path.join(OUT, 'withicons-angular.d.ts'), fs.readFileSync(dts, 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/m, '\n'))
  const code = fs.readFileSync(fesm, 'utf8')
  const minVersions = [...code.matchAll(/minVersion: "([\d.]+)"/g)].map(m => m[1])
  const minVersion = minVersions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0] || null
  fs.writeFileSync(path.join(OUT, 'build-info.json'), JSON.stringify({
    srcHash: srcHash(), angular: ver('@angular/compiler-cli'), ngPackagr: ver('ng-packagr'), typescript: ver('typescript'),
    partialMinVersion: minVersion,
  }, null, 2) + '\n')
  console.log(`prebuilt/ written (angular ${ver('@angular/compiler-cli')}, ng-packagr ${ver('ng-packagr')}, linker minVersion ${minVersion}) in ${Date.now() - t0} ms`)
}
