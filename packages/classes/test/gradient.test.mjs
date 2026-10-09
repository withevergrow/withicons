// Rich styles (gradients) in @withicons/classes:
// 1. CSS icons: the gradients travel inside the palette layer's data URI (flattened: no var() in a data URI).
// 2. with-icons.js (inline <svg> runtime): every copy it puts in the page gets its own gradient ids.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const repo = path.resolve(root, '..', '..')
const read = f => fs.readFileSync(path.join(dist, f), 'utf8')
const skip = !fs.existsSync(path.join(dist, 'with-icons.js')) && 'dist/ not built (node forge/build.mjs classes --no-site)'

// the newest styles' files live in companion packages (STYLE_HOME / HOME_DIR in the loader): packages/<pkg>/<dir>/
const homeOf = () => { const js = fs.readFileSync(path.join(dist, 'with-loader.js'), 'utf8'); return [JSON.parse(/var STYLE_HOME = (\{[^\n]*\})/.exec(js)[1]), JSON.parse(/var HOME_DIR = (\{[^\n]*\})/.exec(js)[1])] }
const styleDir = s => { const [H, D] = homeOf(); return H[s] ? path.join(root, '..', H[s], D[H[s]]) : dist }
const readStyle = (s, f) => fs.readFileSync(path.join(styleDir(s), f), 'utf8')

test('layerUris: a defs node goes into the palette picture, flattened; the ink mask stays gradient-free', { skip }, async () => {
  const { layerUris } = await import(pathToFileURL(path.join(repo, 'forge', 'lib', 'emit-classes.mjs')).href)
  const nodes = [
    ['defs', {}, [['linearGradient', { id: 'wg-t-x-0', x1: 0, y1: 0, x2: 24, y2: 0, gradientUnits: 'userSpaceOnUse' },
      [['stop', { offset: 0, 'stop-color': 'var(--with-t-c1, #ff0000)' }], ['stop', { offset: 1, 'stop-color': 'var(--with-t-c2, #0000ff)' }]]]]],
    ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-t-x-0)' }],
    ['path', { d: 'M8 8h8', stroke: 'currentColor', fill: 'none' }],
  ]
  const L = layerUris({ name: 't', root: {} }, nodes)
  const p = decodeURIComponent(L.p), i = decodeURIComponent(L.i)
  assert.match(p, /<defs><linearGradient id='wg-t-x-0'[^>]*><stop offset='0' stop-color='#ff0000'\/><stop offset='1' stop-color='#0000ff'\/><\/linearGradient><\/defs>/)
  assert.ok(p.includes("fill='url(#wg-t-x-0)'"))
  assert.ok(!p.includes('var('))
  assert.ok(!i.includes('Gradient') && !i.includes('<defs'), 'ink mask has no gradients')
})

test('with-icons.js gives every inline copy of a gradient icon its own ids', { skip }, () => {
  const src = read('with-icons.js')
  assert.ok(src.includes('function withUniqMarkup('))
  // run the helper exactly as shipped
  const fn = vm.runInNewContext(`(${/function withUniqMarkup\([\s\S]*?\n\}/.exec(src)[0]})`)
  const inner = '<defs><linearGradient id="wg-a-b-0"><stop offset="0" stop-color="#f00"/></linearGradient></defs><path fill="url(#wg-a-b-0)" stroke="currentColor"/>'
  const a = fn(inner, 'wi1'), b = fn(inner, 'wi2')
  assert.ok(a.includes('id="wg-a-b-0-wi1"') && a.includes('url(#wg-a-b-0-wi1)'))
  assert.ok(b.includes('id="wg-a-b-0-wi2"') && b.includes('url(#wg-a-b-0-wi2)'))
  assert.equal(fn('<path d="M1 1"/>', 'wi3'), '<path d="M1 1"/>')
  assert.match(src, /withUniqMarkup\(inner, 'wi' \+ \(\+\+UID\)\)/)
})

test('rich-style rules carry their gradients in the palette layer', { skip }, () => {
  const styles = JSON.parse(/var STYLE_NAMES = (\[[^\]]*\])/.exec(read('with-loader.js'))[1])
  for (const s of styles) {
    const css = readStyle(s, `with-${s}.css`)
    if (!css.includes('Gradient')) continue
    for (const rule of css.split('\n').filter(l => l.includes('Gradient'))) {
      const p = /--with-p:url\("([^"]+)"\)/.exec(rule)
      assert.ok(p && decodeURIComponent(p[1]).includes('<defs>'), `${s}: gradients live in --with-p`)
      assert.ok(!decodeURIComponent(p[1]).includes('var('), `${s}: flattened`)
    }
  }
})
