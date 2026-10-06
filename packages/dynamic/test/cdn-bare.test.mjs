// The bare CDN URL (https://cdn.jsdelivr.net/npm/@withicons/dynamic) serves dist/cdn/lite.js from outside dist/cdn/:
// its gens/ and styles/ must load from this version's dist/cdn/, not from …/npm/@withicons/gens/…
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { dist, pkgDir } from './_setup.mjs'

const version = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version
const pinned = `https://cdn.jsdelivr.net/npm/@withicons/dynamic@${version}/dist/cdn/`

for (const [entry, src] of [['lite.js', 'https://cdn.jsdelivr.net/npm/@withicons/dynamic'], ['lite.js', 'https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest'],
  ['lite.js', pinned + 'lite.js'], ['dynamic.js', 'https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/dynamic.js']]) {
  test(`${src}: chunks load from ${src.includes('/dist/') ? 'next to the script' : 'the pinned dist/cdn/'}`, async () => {
    const fetched = []
    const g = { console, setTimeout, clearTimeout, performance, URL, WITH_LIVE_SRC: src }
    g.self = g
    const ctx = vm.createContext(g)
    const base = src.includes('/dist/') ? src.replace(/[^/]*$/, '') : pinned
    g.importScripts = u => {
      fetched.push(u)
      assert.ok(u.startsWith(base), `${u} is not under ${base}`)
      vm.runInContext(fs.readFileSync(path.join(dist, 'cdn', u.slice(base.length)), 'utf8'), ctx, { filename: u })
    }
    vm.runInContext(fs.readFileSync(path.join(dist, 'cdn', entry), 'utf8'), ctx, { filename: src })
    const W = g.WithLive
    const name = W.list()[0]
    const ex = W.get(name).examples?.[0] || {}
    const svg = await W.renderAsync(name, ex, 'duo')
    assert.match(svg, /^<svg/)
    assert.ok(fetched.some(u => u.endsWith('styles/duo.js')), 'loaded the duo chunk')
    if (entry === 'lite.js') assert.ok(fetched.some(u => u.endsWith(`gens/${name}.js`)), 'loaded the icon chunk')
  })
}
