import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { pathToFileURL } from 'node:url'
import { read, load, repo, inRepo } from './_setup.mjs'

const specs = (await load('icons.js')).default
const { PRESET_DEFAULTS, EFFECTS, specVars } = await load('index.js')
const css = read('icons.css')
const names = Object.keys(specs)

test('icons.js has a spec for every icon (hand-written or derived)', () => {
  assert.ok(names.length >= 300, `${names.length} specs`)
  if (!inRepo) return
  const onDisk = fs.readdirSync(path.join(repo, 'forge', 'icons')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
  const missing = onDisk.filter(n => !specs[n])
  assert.deepEqual(missing, [], 'icons without a motion spec in dist (re-run node forge/lib/emit-motion.mjs)')
})

test('every spec is valid: known presets, ranges, swap effects', () => {
  for (const n of names) {
    const s = specs[n]
    assert.equal(s.name, n)
    assert.ok(typeof s.intent === 'string' && s.intent.length > 0 && s.intent.length <= 80, `${n} intent`)
    for (const m of [s.loop, s.hover, ...(s.alt || [])]) {
      assert.ok(PRESET_DEFAULTS[m.preset], `${n}: preset ${m.preset}`)
      if (m.amount != null) assert.ok(m.amount >= 0.25 && m.amount <= 2, `${n} amount`)
      if (m.duration != null) assert.ok(m.duration >= 0.3 && m.duration <= 6, `${n} duration`)
      if (m.dir != null) assert.ok(m.dir >= 0 && m.dir < 360, `${n} dir`)
    }
    for (const w of s.swap || []) assert.ok(EFFECTS.includes(w.effect), `${n} swap effect ${w.effect}`)
  }
})

test('hand-written specs are passed through unchanged (except dropped swaps to missing icons)', () => {
  if (!inRepo) return
  const dir = path.join(repo, 'forge', 'motion')
  let checked = 0
  for (const n of names) {
    const f = path.join(dir, n + '.json')
    if (!fs.existsSync(f) || specs[n].auto) continue
    const raw = JSON.parse(fs.readFileSync(f, 'utf8'))
    assert.deepEqual(specs[n].loop, raw.loop, n + ' loop')
    assert.deepEqual(specs[n].hover, raw.hover, n + ' hover')
    assert.equal(specs[n].intent, raw.intent)
    checked++
  }
  assert.ok(checked > 0)
})

test('icons.css covers every icon with its loop and hover variables', () => {
  for (const n of names) {
    const rule = new RegExp(`\\[data-wm="${n}"\\],with-icon\\[name="${n}"\\]\\{([^}]*)\\}`).exec(css)
    assert.ok(rule, `rule for ${n}`)
    const v = specVars(specs[n])
    for (const k in v) assert.ok(rule[1].includes(`${k}:${v[k]}`), `${n} ${k}`)
    assert.match(rule[1], /--wmL:wm-[\w-]+/)
    assert.match(rule[1], /--wmH:wm-[\w-]+/)
  }
})

test('site/data/motion.js exposes the same specs', () => {
  if (!inRepo) return
  const code = fs.readFileSync(path.join(repo, 'site', 'data', 'motion.js'), 'utf8')
  const ctx = { window: {} }
  vm.runInNewContext(code, ctx)
  assert.deepEqual(Object.keys(ctx.window.WITH_MOTION).sort(), [...names].sort())
})

test('auto specs are derived sensibly', async () => {
  if (!inRepo) return
  const { autoSpec } = await import(pathToFileURL(path.join(repo, 'forge', 'lib', 'emit-motion.mjs')).href)
  const a = autoSpec('arrow-down-left', 'arrows', PRESET_DEFAULTS)
  assert.equal(a.loop.preset, 'nudge'); assert.equal(a.loop.dir, 135); assert.equal(a.hover.preset, 'pass'); assert.equal(a.auto, true)
  assert.equal(autoSpec('heart-crack', 'objects', PRESET_DEFAULTS).loop.preset, 'beat')
  assert.equal(autoSpec('bell-dot', 'communication', PRESET_DEFAULTS).loop.preset, 'ring')
  assert.equal(autoSpec('zzz-unknown', 'nope', PRESET_DEFAULTS).loop.preset, 'breathe')
})
