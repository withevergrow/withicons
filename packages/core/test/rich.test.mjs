// Rich styles (gradients) in @withicons/core: nested IconNode data, toSvg (nested markup, idSuffix, flat), flattened
// standalone files (stop-color included), and palette-map on gradient stops.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve(import.meta.dirname, '..', 'dist')
const skip = !fs.existsSync(path.join(dist, 'index.js')) && 'build first: node forge/build.mjs core palettes --no-site'
const load = f => import(pathToFileURL(path.join(dist, f)).href)
const RICH = [
  ['defs', {}, [['linearGradient', { id: 'wg-test-x-0', x1: 0, y1: 0, x2: 24, y2: 24, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': 'var(--with-luxe-c1, #ff0000)' }], ['stop', { offset: 1, 'stop-color': 'var(--with-luxe-shine, #0000ff)', 'stop-opacity': 0.5 }]]]]],
  ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-test-x-0)', stroke: 'currentColor' }],
]

test('toSvg renders nested nodes; idSuffix renames ids and their url(#…) together; flat resolves stop colours', { skip }, async () => {
  const { toSvg } = await load('index.js')
  const s = toSvg(RICH, 'line')
  assert.match(s, /<defs><linearGradient id="wg-test-x-0"[^>]*><stop offset="0" stop-color="var\(--with-luxe-c1, #ff0000\)"\/><stop [^>]*\/><\/linearGradient><\/defs>/)
  const u = toSvg(RICH, 'line', { idSuffix: 'a1' })
  assert.ok(u.includes('id="wg-test-x-0-a1"') && u.includes('fill="url(#wg-test-x-0-a1)"') && !u.includes('wg-test-x-0"'))
  const f = toSvg(RICH, 'line', { flat: true })
  assert.ok(!f.includes('var('), f)
  assert.ok(f.includes('stop-color="#ff0000"') && f.includes('stop-color="#0000ff"'))
  assert.equal(RICH[0][2][0][1].id, 'wg-test-x-0', 'data unchanged')
})

test('standalone SVG files and node data of rich styles: unique ids per icon, flattened files, references resolve', { skip }, async () => {
  const meta = JSON.parse(fs.readFileSync(path.join(dist, 'styles.json'), 'utf8'))
  const styles = meta.map(s => s.name)
  // the newest styles' files live in companion packages (styles.json: package)
  const pkgDist = s => path.resolve(dist, '..', '..', meta.find(m => m.name === s).package.split('/')[1], 'dist')
  let checked = 0
  for (const s of styles) {
    const dir = path.join(pkgDist(s), 'svg', s)
    if (!fs.existsSync(dir)) assert.fail(`${s}: no ${dir}`)
    for (const f of fs.readdirSync(dir)) {
      const svg = fs.readFileSync(path.join(dir, f), 'utf8')
      if (!svg.includes('<defs>')) continue
      checked++
      assert.ok(!/var\(/.test(svg), `${s}/${f}: variables flattened (stop-color too)`)
      const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])
      assert.equal(new Set(ids).size, ids.length, `${s}/${f}: ids unique`)
      for (const id of ids) assert.match(id, new RegExp(`^wg-${s}-${f.slice(0, -4)}-\\d+$`), `${s}/${f}: id ${id} follows wg-<style>-<icon>-<n>`)
      for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(m[1]), `${s}/${f}: url(#${m[1]}) resolves`)
    }
  }
  if (!checked) console.log('  (no rich style rendered in this build)')
})

test('palette-map maps role variables inside stop-color, and bakes them', { skip }, async () => {
  const { rolesFor, applyPalette, bakePalette } = await load('palettes/palette-map.mjs')
  const { toSvg } = await load('index.js')
  const svg = toSvg(RICH, 'line')
  assert.deepEqual(rolesFor(svg), { '--with-luxe-c1': 'c1', '--with-luxe-shine': 'shine' })
  for (const s of JSON.parse(fs.readFileSync(path.join(dist, 'styles.json'), 'utf8')).map(x => x.name).filter(x => !['line', 'solid', 'duo'].includes(x))) {
    const m = `<stop stop-color="var(--with-${s}-c2, #123456)"/><path fill="var(--with-${s}-edge, #000)"/>`
    assert.deepEqual(rolesFor(m), { [`--with-${s}-c2`]: 'c2', [`--with-${s}-edge`]: 'edge' }, s)
  }
  const { vars } = applyPalette(svg, { c1: '#00ff00', shine: '#ffffff' })
  assert.deepEqual(vars, { '--with-luxe-c1': '#00ff00', '--with-luxe-shine': '#ffffff' })
  const baked = bakePalette(svg, { c1: '#00ff00', ink: '#111111' })
  assert.ok(baked.includes('stop-color="#00ff00"') && baked.includes('stop-color="#0000ff"') && baked.includes('stroke="#111111"'))
})

test('every style lives in exactly one package; companions export their styles and depend on core', { skip }, () => {
  const meta = JSON.parse(fs.readFileSync(path.join(dist, 'styles.json'), 'utf8'))
  const core = JSON.parse(fs.readFileSync(path.join(dist, '..', 'package.json'), 'utf8'))
  for (const st of meta) {
    const name = st.package.split('/')[1], dir = path.resolve(dist, '..', '..', name)
    assert.ok(fs.existsSync(path.join(dir, 'dist', 'nodes', st.name + '.js')), st.name + ' nodes in ' + name)
    if (name === 'core') { assert.ok(core.exports['./nodes/' + st.name], st.name); continue }
    assert.ok(!core.exports['./nodes/' + st.name], st.name + ' is not exported by core')
    assert.ok(!fs.existsSync(path.join(dist, 'svg', st.name)), st.name + ' svgs are not in core')
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    assert.equal(pkg.version, core.version, 'lockstep')
    assert.equal(pkg.dependencies['@withicons/core'], core.version)
    assert.ok(pkg.exports['./nodes/' + st.name] && pkg.exports['./svg/*'], name + ' exports')
  }
  assert.ok(meta.slice(0, 20).every(st => st.package === '@withicons/core'), 'the 20 older styles stay in core')
})

test('every package a CDN serves stays under jsDelivr limits with a margin (150 MB per package, 20 MB per file)', { skip }, () => {
  const pk = path.resolve(dist, '..', '..')
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  const names = ['core', 'core-plus', 'classes', 'classes-plus', 'web', 'web-plus', 'static', 'static-plus', 'soft3d', 'holiday']
  for (const n of names) {
    const d = path.join(pk, n, 'dist')
    if (!fs.existsSync(d)) continue
    const files = walk(d)
    assert.deepEqual(files.filter(f => fs.statSync(f).size > 20 * 1024 * 1024), [], n)
    const mb = files.reduce((a, f) => a + fs.statSync(f).size, 0) / 1048576
    assert.ok(mb < 120, `${n}/dist is ${mb.toFixed(1)} MB (keep 30 MB of headroom under 150)`)
  }
})
