// The newest styles' data lives in @withicons/web-plus (jsDelivr serves at most 150 MB per package): the runtimes must
// find it by themselves, from the same CDN version / node_modules folder, and bundled apps import it as a dependency.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..'), dist = path.join(root, 'dist'), plus = path.join(root, '..', 'web-plus')
const skip = !fs.existsSync(path.join(dist, 'cdn.js')) && 'dist/ not built (node forge/build.mjs web --no-site)'
const read = f => fs.readFileSync(path.join(dist, f), 'utf8')
const homes = () => JSON.parse(/const STYLE_HOME = (\{[^\n]*\})/.exec(read('cdn.js'))[1])

test('every style has its data and per-icon files in exactly one package', { skip }, () => {
  const H = homes(), styles = JSON.parse(/const styleNames = (\[[^\n]*\])/.exec(read('cdn.js'))[1])
  for (const s of styles) {
    const inPlus = fs.existsSync(path.join(plus, 'dist', 'data', s + '.js')), inWeb = fs.existsSync(path.join(dist, 'data', s + '.js'))
    assert.equal(inPlus, !!H[s], s + ' in web-plus')
    assert.equal(inWeb, !H[s], s + ' in web')
    assert.ok(fs.existsSync(path.join(H[s] ? plus : root, 'dist', 'icons', s, 'home.js')), s + ' home.js')
  }
  if (Object.keys(H).length) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
    assert.equal(pkg.dependencies['@withicons/web-plus'], pkg.version)
    for (const s of Object.keys(H)) assert.ok(read('index.js').includes(`import('@withicons/web-plus/data/${s}`), s + ' chunk import')
  }
})

test('withHomeBase: CDN and node_modules URLs -> the sibling package, self-hosted copies -> the same folder', { skip }, () => {
  const src = read('cdn.js')
  const fn = /function withHomeBase\(v\) \{[\s\S]*?\n\}/.exec(src)[0]
  const H = homes(), s = Object.keys(H)[0]
  if (!s) return
  const run = base => vm.runInNewContext(`const WITH_BASE = { url: ${JSON.stringify(base)} }; const STYLE_HOME = ${JSON.stringify(H)}; function withHas(o, k) { return Object.prototype.hasOwnProperty.call(o, k) }; ${fn}; withHomeBase(${JSON.stringify(s)})`)
  assert.equal(run('https://cdn.jsdelivr.net/npm/@withicons/web@1.2.3/dist/'), 'https://cdn.jsdelivr.net/npm/@withicons/web-plus@1.2.3/dist/')
  assert.equal(run('http://localhost:5173/node_modules/@withicons/web/dist/'), 'http://localhost:5173/node_modules/@withicons/web-plus/dist/')
  assert.equal(run('https://example.com/vendor/with/'), 'https://example.com/vendor/with/')
  assert.ok(src.includes("withHomeBase(v) + 'icons/'") && src.includes("withHomeBase(s) + 'data/'"))
})
