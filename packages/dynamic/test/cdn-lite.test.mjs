// The CDN lite script (dist/cdn/lite.js): every name / param / example up front, each live icon's drawing code fetched
// on demand (cdn/gens/<name>.js), output identical to the full build. Runs the classic script in a worker-like VM scope
// (no document, importScripts reads the sibling files), which is exactly how its render workers load it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dist, exists, load } from './_setup.mjs'

const full = await load('index.js')
const src = pathToFileURL(path.join(dist, 'cdn', 'lite.js')).href
const fetched = []
function scope() {
  const g = { console, setTimeout, clearTimeout, performance, URL, WITH_LIVE_SRC: src }
  g.self = g
  g.importScripts = u => { fetched.push(u.slice(src.length - 'lite.js'.length)); vm.runInContext(fs.readFileSync(fileURLToPath(u), 'utf8'), ctx, { filename: u }) }
  const ctx = vm.createContext(g)
  return { g, ctx }
}
const { g, ctx } = scope()
vm.runInContext(fs.readFileSync(path.join(dist, 'cdn', 'lite.js'), 'utf8'), ctx, { filename: src })
const W = g.WithLive

test('lite.js ships every live icon as metadata, without its drawing code', () => {
  assert.ok(exists('cdn/lite.js'))
  assert.deepEqual([...W.list()], full.list())   // (arrays from the VM realm: spread into this one)
  assert.deepEqual(JSON.parse(JSON.stringify(W.catalog())), JSON.parse(JSON.stringify(full.catalog())))
  for (const n of W.list()) assert.ok(exists(`cdn/gens/${n}.js`), `cdn/gens/${n}.js missing`)
  assert.equal(W.iconLoaded('calendar-date'), false)
  assert.equal(fs.statSync(path.join(dist, 'cdn', 'lite.js')).size < fs.statSync(path.join(dist, 'cdn', 'dynamic.js')).size * 0.8, true, 'lite.js is clearly smaller than dynamic.js')
})

test('render() before loadIcon() explains itself; after it, output equals the full build', async () => {
  assert.throws(() => W.render('calendar-date', { day: 9 }), e => e.code === 'WITH_ICON_NOT_LOADED')
  assert.equal(await W.loadIcon('calendar-date'), 'calendar-date')
  assert.ok(W.iconLoaded('calendar-date'))
  assert.equal(W.render('calendar-date', { day: 9, month: 'MAY' }), full.render('calendar-date', { day: 9, month: 'MAY' }))
  assert.deepEqual(fetched, ['gens/calendar-date.js'], 'only that icon was fetched')
})

test('renderAsync() loads the icon and the style by itself; aliases resolve; unknown names reject', async () => {
  const name = W.list().find(n => n !== 'calendar-date')
  const ex = W.get(name).examples[0] || {}
  assert.equal(await W.renderAsync(name, ex, 'duo'), full.render(name, ex, 'duo'))
  assert.ok(fetched.includes(`gens/${name}.js`) && fetched.includes('styles/duo.js'))
  await assert.rejects(W.loadIcon('no-such-live-icon'), e => e.code === 'WITH_UNKNOWN_ICON')
})
