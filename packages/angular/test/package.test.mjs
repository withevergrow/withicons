// @withicons/angular: checks that need no Angular install (the component itself is exercised in a real
// Angular app; see the package README, "Maintainers"). Run: npm test -w packages/angular
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(PKG, '..', '..')
const read = f => fs.readFileSync(path.join(PKG, f), 'utf8')
const load = f => import(pathToFileURL(path.join(PKG, f)).href)
const pkg = JSON.parse(read('package.json'))
const root = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const { styleNames, iconNames } = await load('dist/meta.mjs')
const { styles } = await load('dist/styles.mjs')

test('package.json: name, lockstep version, entry points', () => {
  assert.equal(pkg.name, '@withicons/angular')
  assert.equal(pkg.version, root.withiconsVersion || root.version)
  assert.equal(pkg.license, 'MIT')
  assert.equal(pkg.sideEffects, false)
  assert.equal(pkg.repository.directory, 'packages/angular')
  assert.deepEqual(pkg.files.sort(), ['LICENSE', 'README.md', 'dist'])
  assert.ok(pkg.peerDependencies['@angular/core'])
  assert.ok(!pkg.dependencies, 'no runtime dependencies')
  for (const [key, entry] of Object.entries(pkg.exports)) {
    if (typeof entry === 'string') { assert.ok(fs.existsSync(path.join(PKG, entry)), key); continue }
    const t = entry.types.replace('*', 'home'), d = entry.default.replace('*', 'home')
    assert.ok(fs.existsSync(path.join(PKG, t)), `${key} types ${t}`)
    assert.ok(fs.existsSync(path.join(PKG, d)), `${key} default ${d}`)
  }
  for (const s of styleNames) {
    assert.ok(pkg.exports['./' + s] && pkg.exports[`./${s}/icons/*`], `exports for ${s}`)
    assert.ok(pkg.keywords.includes(`${s}-icons`), `keyword ${s}-icons`)
  }
})

test('every style exports every icon with matching data', async () => {
  assert.equal(styleNames.length, Object.keys(styles).length)
  const pascal = n => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
  // every index lists every icon (text check: importing 6,000 modules is slow); a sample is loaded for real
  const sample = [...new Set([iconNames[0], 'home', 'heart', 'pizza', iconNames[iconNames.length - 1]])].filter(n => iconNames.includes(n))
  for (const s of styleNames) {
    const idx = read(`dist/${s}/index.mjs`), dts = read(`dist/${s}/index.d.ts`)
    for (const name of iconNames) {
      const P = pascal(name)
      assert.ok(idx.includes(`export { ${P}, ${P}Icon } from './icons/${name}.mjs'`), `${s} index exports ${P}`)
      assert.ok(dts.includes(`export declare const ${P}: WithIconData`), `${s} index.d.ts declares ${P}`)
      assert.ok(fs.existsSync(path.join(PKG, `dist/${s}/icons/${name}.mjs`)), `${s}/${name} files`)
    }
    assert.ok(fs.existsSync(path.join(PKG, `dist/${s}/deep.d.ts`)), `${s}/deep.d.ts`)
    for (const name of sample) {
      const mod = await load(`dist/${s}/icons/${name}.mjs`), P = pascal(name), icon = mod[P]
      assert.equal(mod.default, icon)
      assert.equal(mod[P + 'Icon'], icon)
      assert.equal(icon.name, name)
      assert.equal(icon.variant, s)
      assert.ok(Array.isArray(icon.node) && icon.node.length, `${s}/${name} has nodes`)
      assert.ok(styles[icon.style.name], `${s}/${name} style`)
    }
  }
  assert.match(read('dist/index.mjs'), /export \* from '\.\/line\/index\.mjs'/)
})

test('types: the variant union lists every style', () => {
  const dts = read('dist/types/withicons-angular.d.ts')
  const m = dts.match(/type WithIconVariant = ([^;]+);/)
  assert.ok(m)
  assert.deepEqual(m[1].split('|').map(s => s.trim().replace(/'/g, '')), styleNames)
  for (const input of ['icon', 'name', 'variant', 'size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'title', 'ariaLabel', 'ariaLabelledby'])
    assert.match(dts, new RegExp(`\\b${input}\\??:`), `input ${input}`)
})

test('component: partial Ivy, a11y names moved to the svg, prebuilt matches src', async () => {
  const js = read('dist/fesm2022/withicons-angular.mjs')
  assert.match(js, /ɵɵngDeclareComponent/)
  assert.match(js, /ariaLabel: \["aria-label", "ariaLabel"\]/)
  assert.match(js, /"attr\.aria-label": "null"/)
  assert.doesNotMatch(js, /split\(\/\[s,\]\+\//, 'points must split on whitespace')
  const info = JSON.parse(read('prebuilt/build-info.json'))
  const { srcHash } = await load('scripts/build-component.mjs')
  assert.equal(srcHash(), info.srcHash, 'prebuilt/ is stale: run node packages/angular/scripts/build-component.mjs')
  assert.equal(js, read('prebuilt/withicons-angular.mjs'), 'dist/ is stale: run node forge/build.mjs angular')
})

test('README: counts and every style import', () => {
  const md = read('README.md')
  assert.match(md, new RegExp(`${iconNames.length} icons x ${styleNames.length} styles`))
  for (const s of styleNames) assert.ok(md.includes('`' + s + '`'), `README mentions ${s}`)
  assert.doesNotMatch(md, /egopenicons|Evergrow Open Icons|\bseven\b/i)
})
