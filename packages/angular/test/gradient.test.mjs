// Rich styles (gradients) in the prebuilt <with-icon>: the template draws the defs (linear and radial gradients with their
// stops) and every component instance suffixes the gradient ids and url(#…) references. No Angular install needed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const PKG = path.resolve(import.meta.dirname, '..')
const fesm = fs.readFileSync(path.join(PKG, 'prebuilt', 'withicons-angular.mjs'), 'utf8')
const src = fs.readFileSync(path.join(PKG, 'src', 'lib', 'with-icon.component.ts'), 'utf8')

test('prebuilt component draws gradient definitions', () => {
  for (const tag of ['svg:defs', 'svg:linearGradient', 'svg:radialGradient', 'svg:stop']) assert.ok(fesm.includes(tag), tag)
  assert.ok(fesm.includes('gradsOf'), 'gradient extraction compiled in')
})

test('ids are made unique per instance (and url(#…) follows)', () => {
  assert.match(src, /private readonly uid = '-w' \+ \(\+\+uidCounter\)/)
  assert.match(fesm, /url\(#\$1["'] \+ sfx \+ ["']\)/)
})

test('the prebuilt component matches src/ (rebuild: node packages/angular/scripts/build-component.mjs)', async () => {
  const { srcHash } = await import(new URL('../scripts/build-component.mjs', import.meta.url).href)
  const info = JSON.parse(fs.readFileSync(path.join(PKG, 'prebuilt', 'build-info.json'), 'utf8'))
  assert.equal(info.srcHash, srcHash())
})

test('rich styles ship their nested gradient data', async () => {
  const dist = path.join(PKG, 'dist')
  if (!fs.existsSync(path.join(dist, 'meta.mjs'))) return
  const { styleNames } = await import(new URL('../dist/meta.mjs', import.meta.url).href)
  for (const s of styleNames) {
    const f = path.join(dist, s, 'icons', 'home.mjs')
    if (!fs.existsSync(f)) continue
    const { Home } = await import(new URL(`../dist/${s}/icons/home.mjs`, import.meta.url).href)
    const defs = Home.node.filter(n => n[0] === 'defs')
    for (const d of defs) for (const g of d[2]) {
      assert.ok(g[0] === 'linearGradient' || g[0] === 'radialGradient', `${s}: ${g[0]}`)
      assert.ok(/^wg-/.test(g[1].id), `${s}: id ${g[1].id}`)
      assert.ok(g[2].every(x => x[0] === 'stop'), `${s}: stops`)
    }
  }
})
