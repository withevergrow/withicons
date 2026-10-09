// 1. The bare CDN URL (<script src="https://cdn.jsdelivr.net/npm/@withicons/classes">) serves dist/with-loader.js from
//    outside dist/: the per-icon CSS must still come from this version's dist/, not …/npm/@withicons/line/home.css.
// 2. with-all.css: a one-layer rule (line, solid, …) sets --with-p:none, so the palette files' zero-specificity
//    `:where(.with-home){--with-p:…}` never paints a palette style behind a line icon.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const read = f => fs.readFileSync(path.join(dist, f), 'utf8')
const skip = !fs.existsSync(path.join(dist, 'with-loader.js')) && 'dist/ not built (node forge/build.mjs classes --no-site)'

// the newest styles' files live in companion packages (STYLE_HOME / HOME_DIR in the loader): packages/<pkg>/<dir>/
const homeOf = () => { const js = fs.readFileSync(path.join(dist, 'with-loader.js'), 'utf8'); return [JSON.parse(/var STYLE_HOME = (\{[^\n]*\})/.exec(js)[1]), JSON.parse(/var HOME_DIR = (\{[^\n]*\})/.exec(js)[1])] }
const styleDir = s => { const [H, D] = homeOf(); return H[s] ? path.join(root, '..', H[s], D[H[s]]) : dist }
const readStyle = (s, f) => fs.readFileSync(path.join(styleDir(s), f), 'utf8')
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version

function runLoader(src, style = 'duo') {
  const links = []
  const document = {
    currentScript: { src, getAttribute: () => null },
    readyState: 'loading', addEventListener() {}, querySelector: () => null,
    createElement: () => ({ setAttribute() {} }),
    head: { appendChild(l) { links.push(l.href) } },
  }
  const g = { document, console, URL, Promise }
  g.window = g
  vm.runInContext(read('with-loader.js'), vm.createContext(g))
  g.WithIconsLoader.load(style, 'home')
  return links[0]
}

test('with-loader.js: bare and file URLs load per-icon CSS from the right dist/', { skip }, () => {
  const pinned = `https://cdn.jsdelivr.net/npm/@withicons/classes@${version}/dist/duo/home.css`
  assert.equal(runLoader('https://cdn.jsdelivr.net/npm/@withicons/classes'), pinned)
  assert.equal(runLoader('https://cdn.jsdelivr.net/npm/@withicons/classes@latest'), pinned)
  assert.equal(runLoader('https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js'), 'https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/duo/home.css')
  assert.equal(runLoader('http://localhost:3000/node_modules/@withicons/classes/dist/with-loader.js'), 'http://localhost:3000/node_modules/@withicons/classes/dist/duo/home.css')
  assert.equal(runLoader('https://example.com/vendor/with/with-loader.js'), 'https://example.com/vendor/with/duo/home.css')
})

test('with-loader.js: the newest styles load from their companion package (same CDN version / folder)', { skip }, () => {
  const [H, D] = homeOf()
  const [s, p] = Object.entries(H)[0] || []
  if (!s) return
  const pinned = `https://cdn.jsdelivr.net/npm/@withicons/${p}@${version}/${D[p]}${s}/home.css`
  assert.equal(runLoader('https://cdn.jsdelivr.net/npm/@withicons/classes', s), pinned)
  assert.equal(runLoader('https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js', s), `https://cdn.jsdelivr.net/npm/@withicons/${p}@latest/${D[p]}${s}/home.css`)
  assert.equal(runLoader('http://localhost:3000/node_modules/@withicons/classes/dist/with-loader.js', s), `http://localhost:3000/node_modules/@withicons/${p}/${D[p]}${s}/home.css`)
  assert.equal(runLoader('https://example.com/vendor/with/with-loader.js', s), `https://example.com/vendor/with/${s}/home.css`)
  // every companion style resolves to a file that exists
  for (const [st, pk] of Object.entries(H)) assert.ok(fs.existsSync(path.join(root, '..', pk, D[pk], st, 'home.css')), `${pk}: ${st}/home.css`)
})

test('with-icons.js resolves bare URLs through withBareBase too', { skip }, () => {
  const js = read('with-icons.js')
  assert.ok(js.includes('function withBareBase(') && js.includes("withBareBase(me.src, 'classes', VERSION, 'dist/')"))
})

test('every rule sets --with-p (none for one-layer icons): no palette layer leaks into line / solid', { skip }, () => {
  const styles = JSON.parse(/var STYLE_NAMES = (\[[^\]]*\])/.exec(read('with-loader.js'))[1])
  for (const s of styles) {
    const rules = readStyle(s, `with-${s}.css`).split('\n').filter(l => l.includes('{--with-i:'))
    assert.ok(rules.length >= 100, s)
    for (const r of rules) assert.match(r, /;--with-p:[^;}]+\}$/, `${s}: ${r.slice(0, 80)}`)
    if (s === 'line' || s === 'solid') assert.ok(rules.every(r => r.endsWith(';--with-p:none}')), `${s}: one layer only`)
  }
  assert.ok(read('line/home.css').endsWith(';--with-p:none}\n'))
})
