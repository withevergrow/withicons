// The render worker starts only when a rich style needs it, and transitions take the duration they are given.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const L = await load('lite.js')
const name = L.list().includes('battery-level') ? 'battery-level' : L.list()[0]
const levelKey = Object.keys(L.get(name).params).find(k => L.get(name).params[k].type === 'level')

test('cheap styles never start the render worker (render, renderAsync, warm, transitions)', async () => {
  let made = 0
  L.setWorker(() => { made++; return { postMessage() {}, terminate() {} } })
  try {
    const cheap = L.styleNames().filter(s => L.cost(s) <= 16)
    assert.ok(cheap.includes('line'))
    for (const s of cheap.slice(0, 3)) {
      L.clearCache()
      await L.renderAsync(name, { [levelKey]: 0.42 }, s)
      await L.warm(name, { [levelKey]: 0.43 }, s)
    }
    L.render(name, { [levelKey]: 0.44 }, 'line')
    assert.equal(made, 0, 'no worker for cheap styles')
    assert.equal(L.workers(), false)
  } finally { L.setWorker(null) }
})

test('plan() spreads its frames over the whole duration (the last frame lands at t = 1)', { skip: !levelKey && 'no level param' }, () => {
  const pl = L.plan(name, { [levelKey]: 0.1 }, { [levelKey]: 0.9 }, 'line', { ms: 900 })
  assert.equal(pl.ms, 900)
  assert.equal(pl.frames[pl.frames.length - 1].t, 1)
  assert.deepEqual(pl.frames[pl.frames.length - 1].params, pl.to)
  assert.ok(pl.frames.length >= 10, `frames: ${pl.frames.length}`)
  for (let i = 1; i < pl.frames.length; i++) assert.ok(pl.frames[i].t > pl.frames[i - 1].t, 'times increase')
  // finer than quarter steps: the level moves in small increments
  const levels = pl.frames.map(f => f.params[levelKey])
  const steps = levels.slice(1).map((v, i) => Math.abs(v - levels[i]))
  assert.ok(Math.max(...steps) < 0.25, `largest step ${Math.max(...steps)}`)
})

test('transition({ ms: 900 }) takes about 900 ms, not the time the easing settles in', { skip: !levelKey && 'no level param' }, async () => {
  let clockNow = 0
  const queue = []
  L.setMotion({ reduced: false, raf: f => queue.push(f) })
  const realNow = performance.now.bind(performance)
  const start = realNow()
  try {
    const painted = []
    const tr = L.transition(name, { [levelKey]: 0.1 }, { [levelKey]: 0.9 }, 'line', { ms: 900, paint: (p, info) => painted.push([realNow() - start, info.final]) })
    // drive the animation-frame loop in real time (16 ms ticks)
    let done = false
    tr.done.then(() => { done = true })
    while (!done && clockNow < 3000) {
      await new Promise(r => setTimeout(r, 16))
      clockNow += 16
      const f = queue.shift(); if (f) f(realNow())
    }
    const elapsed = realNow() - start
    assert.ok(done, 'finished')
    assert.ok(elapsed >= 800, `took ${Math.round(elapsed)} ms`)
    assert.ok(painted.length >= 5, `${painted.length} frames painted`)
    assert.equal(painted[painted.length - 1][1], true, 'the last paint is the final frame')
  } finally { L.setMotion({ reduced: null, raf: null }) }
})
