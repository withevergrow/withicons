// Parts choreography (forge/MOTION.md): tagged nodes move on their own — decorations never play the main preset,
// cast shadows travel with the object (lagging / fading as it lifts), plates take their overrides.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, read } from './_setup.mjs'

const M = await load('meta.js')
const P = await load('parts.js')
const X = await load('export.js')
const PC = await load('parts-css.js')
const css = read('motion.css')

const TAGGED = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect class="wm-deco" x="3" y="3" width="18" height="18"/>' +
  '<ellipse class="wm-shadow" cx="12" cy="21" rx="6" ry="1"/><circle cx="12" cy="12" r="5"/><path class="wm-a" d="M12 1v3"/></svg>'

test('partRole / hasParts read renderer tags', () => {
  assert.equal(M.partRole('wm-deco'), 'deco')
  assert.equal(M.partRole('foo wm-shadow'), 'shadow')
  assert.equal(M.partRole('wm-a'), 'a')
  assert.equal(M.partRole('wm-k'), 'obj')
  assert.equal(M.partRole('wm-shine'), 'obj')
  assert.equal(M.partRole(undefined), 'obj')
  assert.ok(M.hasParts(TAGGED))
  assert.ok(!M.hasParts('<path class="wm-k" d="M0 0"/>'))
})

test('partsPlan: deco has its own counter-phased loop, lifting presets give the shadow its own lag + fade keyframes', () => {
  const spin = P.resolveSpecMotion(null, { preset: 'spin', duration: 6 })
  const plan = P.partsPlan(spin, null)
  assert.equal(plan.deco.preset, 'breathe')
  assert.equal(plan.deco.box, 'fill-box')
  assert.ok(plan.deco.delay < 0, 'counter-phased')
  assert.equal(plan.shadow, plan.obj, 'attached shadow turns with the object')
  const beat = P.partsPlan(P.resolveSpecMotion(null, { preset: 'beat', duration: 1.4 }), null)
  assert.equal(beat.deco.preset, 'twinkle')
  assert.equal(beat.deco.duration, 2.8)
  assert.equal(beat.cycle, 2.8)
  const rise = P.partsPlan(P.resolveSpecMotion(null, { preset: 'rise' }), { deco: 'still' })
  assert.equal(rise.deco, null)
  assert.notEqual(rise.shadow, rise.obj)
  // the cast shadow travels with the object (an offset print shadow left behind read as a hollow ghost of the icon),
  // a little behind it on the way up: same stops, translate x SHADOW_LAG, same origin
  const objStops = rise.obj.stops({ k: 1 }), shStops = rise.shadow.stops({ k: 1 })
  assert.deepEqual(shStops.map(s => s[0]), objStops.map(s => s[0]))
  assert.match(shStops[1][1].transform, /translateY\(-33\.44%\)/)
  assert.deepEqual(rise.shadow.origin, rise.obj.origin)
  for (const p of ['drop', 'jelly', 'tada', 'wiggle', 'spin', 'pop', 'nudge']) {
    const pl = P.partsPlan(P.resolveSpecMotion(null, { preset: p }), null)
    assert.equal(pl.shadow, pl.obj, p + ': the shadow plays the object keyframes')
  }
  assert.equal(P.partsPlan(P.resolveSpecMotion(null, { preset: 'beat' }), null, { deco: false }).deco, null)
})

test('partsPlan: plate overrides (preset, origin, delay); one-shots keep the object time', () => {
  const spec = { loop: { preset: 'ring', duration: 2.4 }, hover: { preset: 'ring', duration: 0.9 }, parts: { A: { preset: 'wiggle', origin: [12, 18], delay: 0.1, duration: 2.4 } } }
  const loop = P.partsPlan(P.resolveSpecMotion(spec, { trigger: 'loop' }), spec)
  assert.equal(loop.a.preset, 'wiggle')
  assert.deepEqual(loop.a.origin, [12, 18])
  assert.equal(loop.a.delay, 0.1)
  const shot = P.partsPlan(P.resolveSpecMotion(spec, { trigger: 'once' }), spec)
  assert.equal(shot.a.duration, 0.9)
  assert.equal(shot.s, shot.obj)
})

test('sampleRole matches the keyframes: spin is a quarter turn at a quarter, deco breathe never rotates', () => {
  const plan = P.partsPlan(P.resolveSpecMotion(null, { preset: 'spin', duration: 4 }), null)
  const s = P.sampleRole(plan.obj, { k: 1 }, 1)
  const m = P.sampleMatrix(s, [12, 12], [0, 0, 24, 24])
  assert.ok(Math.abs(m[0]) < 1e-6 && Math.abs(m[1] - 1) < 1e-6, 'rotate(90deg)')
  for (let t = 0; t < plan.cycle; t += 0.37) {
    const d = P.sampleMatrix(P.sampleRole(plan.deco, { k: 1 }, t), [12, 12], [3, 3, 18, 18])
    assert.ok(Math.abs(d[1]) < 1e-9 && Math.abs(d[2]) < 1e-9, 'no rotation at ' + t)
  }
  assert.equal(P.easeFn('steps(4)')(0.3), 0.25)
  assert.ok(Math.abs(P.easeFn('cubic-bezier(.37,0,.63,1)')(0.5) - 0.5) < 1e-3)
})

test('partVars: icons.css carries deco, deco length, ground shadow and plate overrides', () => {
  const v = M.partVars({ loop: { preset: 'bounce' }, hover: { preset: 'pop' }, deco: 'float', parts: { A: { preset: 'ring', delay: 0.1 } } }, 'L')
  assert.equal(v['--wmL-dc'], 'wm-deco-float')
  assert.equal(v['--wmL-sh'], 'wm-shadow-bounce-loop')
  assert.equal(v['--wmL-a'], 'wm-ring-loop')
  assert.equal(v['--wmL-a-dl'], '.1s')
  assert.equal(v['--wmL-a-ox'], '50%')
  assert.equal(v['--wmL-a-oy'], '12.5%')
  assert.deepEqual(M.partVars({ loop: { preset: 'spin', duration: 1.4 }, hover: { preset: 'pop' } }, 'L'), {}, 'defaults cost nothing')
  assert.equal(M.partVars({ loop: { preset: 'spin', duration: 6 }, hover: { preset: 'pop' } }, 'L')['--wmL-dd'], '6s')
  assert.equal(M.specVars({ loop: { preset: 'spin', duration: 6 }, hover: { preset: 'pop' }, deco: 'still' })['--wmL-dc'], 'none')
})

test('motion.css: parts rules, deco and shadow keyframes, wrapper stands still in parts mode', () => {
  for (const k of ['wm-deco-breathe', 'wm-deco-float', 'wm-deco-twinkle', 'wm-shadow-bounce', 'wm-shadow-bounce-loop', 'wm-shadow-rise', 'wm-shadow-float']) assert.ok(css.includes(`@keyframes ${k}{`), k)
  assert.ok(css.includes(':where(.wm,.wm-loop,.wm-hover,.wm-once,.wm-run,with-icon){--_an:initial}'), 'idle wrappers hand no animation down')
  assert.ok(css.includes('.wm-parts{animation-name:none!important}'), 'beats the more specific one-shot trigger list')
  assert.ok(css.includes(':has(>svg>:is(.wm-deco,.wm-shadow,.wm-a,.wm-s))'), 'CSS-only via :has()')
  assert.match(css, /\.wm-deco\{transform-box:fill-box;transform-origin:50% 50%;animation:var\(--_dk\)/)
  assert.ok(css.includes('.wm-shadow{animation-name:var(--_sh)}'))
  assert.ok(/:not\(\.wm-swap,\.wm-drawing\)/.test(css), 'swaps and draw keep their own behaviour')
  // plate variables never collide with the object's (--_ad / --_ae / --_sd)
  assert.ok(!/--_ad:var\(--wm-dur, var\(--wmP-dl, var\(--wmL-a-d/.test(css))
  assert.ok(css.includes('--_pad:var(--wm-dur, var(--wmP-dl, var(--wmL-a-d, var(--_dur))))'))
  assert.ok(PC.shadowPartsCss().includes('@keyframes wm-spin{'), 'shadow roots carry their own keyframes')
  assert.ok(PC.shadowPartsCss().includes(':host(.wm-parts:not(.wm-drawing))>svg>.wm-deco'))
})

test('animatedSvg with tagged parts: the group stands still, each role animates, frames freeze every part', () => {
  const a = X.animatedSvg(TAGGED, { spec: { name: 'x', intent: 'x', loop: { preset: 'bounce' }, hover: { preset: 'pop' } } })
  assert.match(a, /-g>\.wm-deco\{transform-box:fill-box/)
  assert.match(a, /-g>\.wm-shadow\{transform-box:view-box/)
  assert.ok(!/-g\{animation:/.test(a), 'the wrapper group does not move')
  assert.ok(!/transform-origin:50% 92%/.test(a), 'no ground pivot: the shadow pivots where the object does')
  assert.match(a, /translateY\(-26\.4%\) scale\(0\.95, 1\.06\);opacity:0\.76/, 'shadow lifts with the object (lag 0.88) and fades')
  const f = X.frameSvg(TAGGED, { preset: 'spin', duration: 1.4 }, 0.5)
  assert.equal((f.match(/animation-play-state:paused/g) || []).length, 5)
  assert.equal(X.exportDuration({ preset: 'spin', duration: 1.4 }, TAGGED), 2.8, 'records until the decoration loop closes')
  assert.equal(X.exportDuration({ preset: 'spin', duration: 1.4 }, TAGGED.replace('class="wm-deco" ', '')), 1.4)
})

test('fades scale with amount: a 0.3 breathe dims to 92%, not 72%', async () => {
  const K = await load('keyframes.js')
  const mid = k => Number(K.presetStops('breathe', false, { k })[1][1].opacity)
  assert.equal(mid(1), 0.72)
  assert.ok(Math.abs(mid(0.3) - 0.916) < 1e-9)
  assert.ok(Math.min(...K.presetStops('flicker', false, { k: 0.3 }).map(s => Number(s[1].opacity))) > 0.93)
})

test('exports of fading presets fade the icon as one picture: opacity on the group, parts keep transforms only', () => {
  const a = X.animatedSvg(TAGGED, { spec: { name: 'x', intent: 'x', loop: { preset: 'rise' }, hover: { preset: 'pop' } }, time: 0.5 })
  const id = /class="(wm\w+)"/.exec(a)[1]
  assert.match(a, new RegExp(String.raw`\.${id}-g\{animation:${id}-op `), 'the group carries the opacity track')
  const kf = name => (new RegExp(String.raw`@keyframes ${name}\{(.*?)\}\}`).exec(a) || [])[1] || ''
  assert.match(kf(id + '-op'), /opacity:0/)
  // object and shadow keyframes: transforms, no opacity (the shadow's fade equals the object's, so nothing is left)
  const used = [...a.matchAll(new RegExp(String.raw`-g>(?::not\([^)]*\)|\.wm-shadow)\{animation:(${id}-\d+) `, 'g'))].map(m => m[1])
  assert.equal(used.length, 2)
  for (const n of used) { assert.ok(kf(n).includes('transform'), n); assert.ok(!/opacity/.test(kf(n)), n) }
  // a non-fading preset leaves the group still
  assert.ok(!/-g\{animation:/.test(X.animatedSvg(TAGGED, { preset: 'float' })))
})
