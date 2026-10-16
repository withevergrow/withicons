// @withicons/loaders — runtime tests (run after `node forge/lib/emit-loaders.mjs`).
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const L = await import(new URL('../dist/index.js', import.meta.url))
const catalog = JSON.parse(fs.readFileSync(path.join(DIST, 'catalog.json'), 'utf8'))

test('catalog: names, groups, every loader drawn in every style', () => {
  assert.ok(catalog.length >= 15)
  const groups = new Set(catalog.map(l => l.group))
  for (const g of groups) assert.ok(['common', 'creative', 'festival', 'morph'].includes(g))
  for (const l of catalog) {
    assert.match(l.name, /^[a-z][a-z0-9-]*$/)
    assert.ok(l.title && l.description && l.aliases.length >= 3, l.name)
    for (const s of L.styles()) assert.ok(fs.existsSync(path.join(DIST, 'svg', s, l.name + '.svg')), `${s}/${l.name}.svg`)
  }
  assert.deepEqual(L.list(), catalog.map(l => l.name))
})

test('svg(): line is built in, options land on the root', () => {
  const name = L.list()[0]
  const s = L.svg(name, { size: 40, color: '#ff0000', speed: 2, label: 'Saving' })
  assert.match(s, /^<svg [^>]*width="40" height="40"/)
  assert.match(s, /style="color:#ff0000;--wl-speed:2"/)
  assert.match(s, /aria-label="Saving"/)
  assert.match(s, /@keyframes/)
  assert.match(L.svg(name, { label: '' }), /aria-hidden="true"/)
  assert.match(L.svg(name, { paused: true }), /--wl-state:paused/)
})

test('svg(): unknown names suggest, unloaded styles explain', () => {
  assert.throws(() => L.svg('no-such-loader'), e => e.code === 'WITH_LOADER_UNKNOWN')
  const other = L.styles().find(s => s !== 'line')
  if (other) assert.throws(() => L.svg(L.list()[0], { style: other }), e => e.code === 'WITH_LOADER_STYLE')
})

test('aliases resolve, search ranks', () => {
  const l = catalog[0]
  assert.equal(L.get(l.aliases[0]).name, l.name)
  const hits = L.search(l.name.replace(/-/g, ' '))
  assert.equal(hits[0].name, l.name)
  assert.deepEqual(L.search(''), [])
})

test('svgAsync loads another style', async () => {
  const other = L.styles().find(s => s !== 'line')
  if (!other) return
  const s = await L.svgAsync(L.list()[0], { style: other })
  assert.match(s, new RegExp(`wl-${L.list()[0]}-${other}`))
  assert.ok(L.loaded(other))
})

test('idSuffix makes gradient ids unique', async () => {
  const rich = L.styles().find(s => s === 'glass')
  if (!rich) return
  await L.load(rich)
  const s = L.svg(L.list()[0], { style: rich, idSuffix: 'x1' })
  if (s.includes(' id="')) for (const m of s.matchAll(/ id="([^"]+)"/g)) assert.ok(m[1].endsWith('-x1'), m[1])
})

test('url() and flat output', () => {
  assert.match(L.url('spinner', 'glass'), /@withicons\/loaders@[^/]+\/dist\/svg\/glass\/spinner\.svg$/)
  const flat = L.svg(L.list()[0], { flat: true, color: '#123456' })
  assert.ok(!flat.includes('currentColor'))
})

test('morph(): items hand over in a loop; one item arrives once', () => {
  const icon = n => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M${n} 4 L12 20"/></svg>`
  const s = L.morph([icon(4), icon(8), L.list()[0]], { effect: 'spin', hold: 1 })
  assert.equal((s.match(/@keyframes wl-m/g) || []).length, 3)
  assert.match(s, /stroke-width="2"/)          // the icon's root attributes survive on its group
  assert.match(s, /calc\(3s\*/)                 // 3 items x 1 s
  const one = L.morph([icon(4)], {})
  assert.match(one, /animation:[^;]*\.6s both/)
  assert.throws(() => L.morph(['not-a-loader-or-svg']), e => e.code === 'WITH_LOADER_MORPH')
  for (const e of L.effects()) assert.ok(L.morph([icon(1), icon(2)], { effect: e.name }).includes('@keyframes'), e.name)
})

test('standalone files: self-contained, no external refs, under the size cap', () => {
  for (const s of L.styles()) for (const l of catalog) {
    const t = fs.readFileSync(path.join(DIST, 'svg', s, l.name + '.svg'), 'utf8')
    assert.ok(t.length < (l.group === 'morph' ? 64 : 48) * 1024, `${s}/${l.name} ${t.length}`)   // morphs hold 3-4 whole icons
    assert.ok(!/(?:href|src)="(?!#)/.test(t), `${s}/${l.name} external ref`)
    assert.ok(!/var\(--with-/.test(t), `${s}/${l.name} unflattened colour`)
    assert.ok(/prefers-reduced-motion/.test(t))
  }
})
