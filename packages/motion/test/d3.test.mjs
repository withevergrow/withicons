// 3D motion (forge/MOTION.md "3D motion"): the 3D presets, the style profile (3D styles play an icon's 3D counterpart,
// backdrop styles keep their tile still) and the 2D-affine keyframes every renderer shares.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, read } from './_setup.mjs'

const M = await load('meta.js')
const K = await load('keyframes.js')
const P = await load('parts.js')
const X = await load('export.js')
const I = await load('index.js')
const css = read('motion.css')
const icons = read('icons.css')

const TAGGED = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect class="wm-deco" x="2" y="2" width="20" height="20"/>' +
  '<ellipse class="wm-shadow" cx="12" cy="21" rx="6" ry="1"/><circle cx="12" cy="12" r="6"/><circle class="wm-shine" cx="10" cy="9" r="2"/></svg>'
const SOLID = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>'
const near = (a, b, e = 1e-3) => a.every((v, i) => Math.abs(v - b[i]) < e)
const ID = [1, 0, 0, 1, 0, 0]

test('the 3D presets are part of the closed vocabulary, with defaults, keyframes and explicit classes', () => {
  assert.deepEqual(M.PRESETS_3D, ['turn', 'turn-once', 'wobble', 'chime', 'swivel', 'bow', 'lean', 'lift', 'pump', 'squish', 'drift', 'gleam', 'pop-up', 'press', 'hop'])
  for (const p of M.PRESETS_3D) {
    assert.ok(M.PRESET_DEFAULTS[p].d3, p)
    assert.ok(css.includes(`@keyframes wm-${p}{`), p)
    assert.ok(css.includes(`.wm-p-${p},with-icon[preset="${p}"]{`), p)
    if (M.SHINE_PRESETS.includes(p)) assert.ok(css.includes(`@keyframes wm-shine-${p}{`), p + ' highlight keyframes')
  }
  for (const p of ['turn', 'lift', 'squish', 'drift', 'pump']) assert.ok(css.includes(`@keyframes wm-shadow-${p}{`), p + ' ground shadow')
  // no flat preset was renamed or lost
  for (const p of ['spin', 'flip', 'tilt', 'pop', 'bounce', 'ring']) assert.ok(M.PRESETS.includes(p) && !M.PRESET_DEFAULTS[p].d3)
})

test('3D keyframes: plain 2D affine functions, the same list at every stop, at rest at 0% and 100%', () => {
  const restOf = s => { const fns = P.sampleMatrix({ fns: parseFns(s), opacity: 1 }, [12, 12], [0, 0, 24, 24]); return fns }
  for (const p of M.PRESETS_3D) {
    for (const track of ['obj', 'shine', 'shadow']) {
      if (track === 'shadow' && !M.GROUND_PRESETS.includes(p)) continue
      for (const loop of [false, true]) {
        const mode = { k: 1, dx: 1, dy: 0 }
        const stops = track === 'obj' ? K.presetStops(p, loop, mode) : track === 'shine' ? K.shineStops(p, loop, mode) : K.shadowStops(p, loop, mode)
        const names = stops.map(s => s[1].transform.match(/[a-zA-Z]+(?=\()/g).join(' '))
        assert.equal(new Set(names).size, 1, `${p}/${track}: one function list`)
        assert.ok(!/rotate[XY]|perspective|matrix3d|translateZ/.test(names[0]), `${p}/${track}: no CSS 3D (exports flatten it)`)
        for (const s of [stops[0], stops[stops.length - 1]]) {
          assert.ok(near(restOf(s[1].transform), ID), `${p}/${track} ${loop ? 'loop' : 'shot'}: rest at ${s[0]}%`)
          assert.equal(Number(s[1].opacity == null ? 1 : s[1].opacity), 1)
        }
        // CSS mode keeps the amount (and direction) live
        const c = (track === 'obj' ? K.presetStops(p, loop) : track === 'shine' ? K.shineStops(p, loop) : K.shadowStops(p, loop))
        assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(c)), p)
      }
    }
  }
  assert.match(K.keyframesCss('x', K.presetStops('lean', false)), /var\(--_dx\)/, 'lean reads the direction')
  assert.match(K.keyframesCss('x', K.presetStops('swivel', false)), /var\(--_k\)/, 'amount scales the motion')
})
function parseFns(s) {
  const out = []
  String(s).replace(/([a-zA-Z]+)\(([^()]*)\)/g, (_, fn, a) => { const v = a.split(',').map(x => parseFloat(x)); out.push([fn, v, a.split(',').map(x => /%/.test(x) ? '%' : '')]); return '' })
  return out
}

test('turn: a real turntable — edge-on at a quarter, mirrored at half, the near side dipping', () => {
  const plan = P.partsPlan(P.resolveSpecMotion(null, { preset: 'turn', duration: 2 }), null)
  const at = t => P.sampleMatrix(P.sampleRole(plan.obj, { k: 1 }, t), [12, 12], [0, 0, 24, 24])
  assert.ok(Math.abs(at(0.5)[0]) < 1e-3, 'scaleX 0 edge-on')
  assert.ok(Math.abs(at(1)[0] + 1) < 1e-3, 'mirrored back at half a turn')
  assert.ok(Math.abs(at(0.5)[1]) > 0.2, 'skewY from the camera above')
  assert.ok(near(at(0), ID) && near(at(1.999), at(0), 0.02), 'seamless loop')
  // the highlight dims on the back, the shadow dims edge-on
  assert.ok(P.sampleRole(plan.shine, { k: 1 }, 1).opacity < 0.5)
  assert.ok(P.sampleRole(plan.shadow, { k: 1 }, 0.5).opacity < 0.7)
})

test('lift / squish: the object rises while its ground shadow stays lower, shrinks and fades', () => {
  for (const p of ['lift', 'squish']) {
    const plan = P.partsPlan(P.resolveSpecMotion(null, { preset: p, trigger: 'once' }), null)
    const t = plan.obj.duration * 0.4
    const o = P.sampleMatrix(P.sampleRole(plan.obj, { k: 1 }, t), plan.obj.origin, [0, 0, 24, 24])
    const sr = P.sampleRole(plan.shadow, { k: 1 }, t), s = P.sampleMatrix(sr, plan.obj.origin, [0, 0, 24, 24])
    assert.ok(o[5] < -1, p + ': object up')
    assert.ok(s[5] > o[5] + 0.5, p + ': shadow lower than the object')
    assert.ok(sr.opacity < 0.8, p + ': shadow fades')
  }
})

test('style profile: 3D styles map an icon\'s own motion, flat styles keep it exactly', () => {
  const spec = { name: 'x', intent: 'x', loop: { preset: 'spin', duration: 6 }, hover: { preset: 'pop', duration: 0.5 },
    alt: [{ preset: 'ring', origin: [12, 3] }, { preset: 'tick', steps: 8 }], parts: { A: { preset: 'ring', delay: 0.1 } } }
  assert.equal(M.styleSpec(spec, 'line'), spec, 'flat: the same object')
  assert.equal(I.motionFor('bell', 'solid'), I.motionFor('bell'))
  const c = M.styleSpec(spec, 'clay')
  assert.equal(c.loop.preset, 'turn'); assert.equal(c.loop.duration, 6)
  assert.equal(c.hover.preset, 'squish'); assert.equal(c.hover.amount, 0.8); assert.equal(c.hover.duration, 0.8)
  assert.deepEqual(c.alt[0], { preset: 'chime', origin: [12, 3] })
  assert.deepEqual(c.alt[1], { preset: 'tick', steps: 8 }, 'stepped motion is never mapped')
  assert.equal(c.parts.A.preset, 'chime')
  assert.deepEqual(M.styleSpec(c, 'luxe'), c, 'idempotent')
  for (const s of M.STYLES_3D) assert.ok(M.is3dStyle(s), s)
  for (const s of ['line', 'solid', 'kawaii', 'bento', 'brutal']) assert.ok(!M.is3dStyle(s), s)
  // every mapping target is a 3D preset, every source a flat one
  for (const [from, to] of Object.entries(M.PROFILE_3D)) { assert.ok(!M.PRESET_DEFAULTS[from].d3, from); assert.ok(M.PRESET_DEFAULTS[to.preset].d3, to.preset) }
  // a direction survives only into a directional preset
  assert.equal(M.motion3d({ preset: 'nudge', dir: 315 }).dir, 315)
  assert.equal(M.motion3d({ preset: 'spin', dir: 90 }).dir, undefined)
})

test('backdrop styles (bento, dock) keep their tile still; dock is also 3D', () => {
  const spec = { name: 'x', intent: 'x', loop: { preset: 'float' }, hover: { preset: 'pop' }, deco: 'twinkle' }
  const b = M.styleSpec(spec, 'bento')
  assert.equal(b.deco, 'still'); assert.equal(b.loop.preset, 'float', 'bento is flat')
  const d = M.styleSpec(spec, 'dock')
  assert.equal(d.deco, 'still'); assert.equal(d.loop.preset, 'drift')
  assert.equal(M.styleSpec(spec, 'clay').deco, 'twinkle', 'other styles keep their decoration loop')
  const plan = P.partsPlan(P.resolveSpecMotion(spec, { style: 'bento' }), spec)
  assert.equal(plan.deco, null, 'no deco role: the tile does not move')
  const a = X.animatedSvg(TAGGED, { spec, style: 'dock' })
  assert.ok(!/\.wm-deco\{animation/.test(a), 'export: the tile stays still')
  assert.ok(/\.wm-deco\{animation/.test(X.animatedSvg(TAGGED, { spec })), 'without the style it still loops')
  assert.ok(css.includes('.wm-backdrop{--wm-deco:none}'))
  assert.match(I.motionAttrs('bell', { style: 'bento' }).class, /\bwm-backdrop\b/)
  assert.doesNotMatch(I.motionAttrs('bell', { style: 'bento', deco: 'float' }).class, /wm-backdrop/, 'an explicit deco opts back in')
})

test('API: resolveMotion / motionAttrs / icons.css take the style', () => {
  assert.equal(X.resolveMotion({ name: 'bell', style: 'clay' }).preset, 'chime')
  assert.equal(X.resolveMotion({ name: 'bell' }).preset, I.motionFor('bell').loop.preset)
  assert.equal(X.resolveMotion({ name: 'bell', style: 'clay', preset: 'spin' }).preset, 'spin', 'an explicit preset is literal')
  assert.equal(I.motionAttrs('bell', { style: 'skeuo' }).class, 'wm wm-loop wm-3d')
  assert.equal(I.motionAttrs('bell', { style: 'line' }).class, 'wm wm-loop')
  const inline = I.motionAttrs({ name: 'x', intent: 'x', loop: { preset: 'beat' }, hover: { preset: 'pop' } }, { style: 'luxe' })
  assert.match(inline.style, /--wmL:wm-pump-loop/)
  assert.match(inline.style, /--wmL-sn:wm-shine-pump-loop/)
  // icons.css: the bell's 3D counterpart on .wm-3d wrappers (and <with-icon class="wm-3d">, set from variant by the element)
  const rule = /\.wm-3d\[data-wm="bell"\],with-icon\.wm-3d\[name="bell"\]\{([^}]*)\}/.exec(icons)
  assert.ok(rule, '3D rule for bell')
  assert.match(rule[1], /--wmL:wm-chime-loop/)
  // motion.css: highlights follow --_sn, explicit presets always set it (so a flat explicit preset beats a 3D slot)
  assert.ok(css.includes('.wm-shine{animation-name:var(--_sn, var(--_an))}'))
  assert.match(css, /\.wm-p-spin,with-icon\[preset="spin"\]\{[^}]*--wmP-snl:wm-spin;/)
  assert.match(css, /\.wm-p-turn,with-icon\[preset="turn"\]\{[^}]*--wmP-snl:wm-shine-turn;/)
})

test('exports: deterministic, flat styles byte-identical, 3D parts get highlight + ground tracks, loops close', () => {
  const spec = { name: 'x', intent: 'x', loop: { preset: 'bounce' }, hover: { preset: 'pop' } }
  assert.equal(X.animatedSvg(TAGGED, { spec, style: 'line' }), X.animatedSvg(TAGGED, { spec }), 'flat style = no style')
  const a = X.animatedSvg(TAGGED, { spec, style: 'clay' })
  assert.equal(a, X.animatedSvg(TAGGED, { spec, style: 'clay' }), 'deterministic')
  const id = /class="(wm\w+)"/.exec(a)[1]
  assert.match(a, new RegExp(String.raw`\.${id}-g>\.wm-shine\{animation:${id}-\d+ `), 'the highlight has its own track')
  assert.match(a, /scale\(1\.12, 0\.86\)/, 'bounce plays squish: the crouch')
  assert.match(X.animatedSvg(TAGGED, { preset: 'turn' }), /skewY\(/, 'turn: the camera above')
  assert.ok(!/rotateY|perspective/.test(a), 'no CSS 3D in exports')
  assert.ok(a.includes('prefers-reduced-motion:reduce'), 'reduced motion stops the export too')
  // whole-icon export (no part tags) of every 3D preset: one literal keyframes block
  for (const p of M.PRESETS_3D) {
    const s = X.animatedSvg(SOLID, { preset: p })
    assert.equal((s.match(/@keyframes/g) || []).length, 1, p)
    assert.ok(!/var\(--_|NaN|undefined/.test(s), p)
  }
  // frames: first and last of a loop match (seamless GIF / video), and frozen frames are repeatable
  for (const p of ['turn', 'wobble', 'drift', 'chime']) {
    const m = P.resolveSpecMotion(null, { preset: p })
    const plan = P.partsPlan(m, null)
    for (const r of [plan.obj, plan.shine, plan.shadow]) {
      const s0 = P.sampleMatrix(P.sampleRole(r, { k: 1, dx: 1, dy: 0 }, 0), m.origin, [0, 0, 24, 24])
      const s1 = P.sampleMatrix(P.sampleRole(r, { k: 1, dx: 1, dy: 0 }, m.duration - 1e-4), m.origin, [0, 0, 24, 24])
      assert.ok(near(s0, s1, 0.01), p + ' loop closes')
    }
    assert.equal(X.frameSvg(TAGGED, { preset: p, style: 'clay' }, 0.3), X.frameSvg(TAGGED, { preset: p, style: 'clay' }, 0.3))
  }
  assert.equal(X.exportDuration({ name: 'bell', style: 'clay' }), X.resolveMotion({ name: 'bell', style: 'clay' }).duration)
})

test('sampleMatrix understands skews (Lottie, previews and the CLI freezer agree with the browser)', () => {
  const m = P.sampleMatrix({ fns: [['skewY', [45], ['deg']]], opacity: 1 }, [0, 0], [0, 0, 24, 24])
  assert.ok(near(m, [1, 1, 0, 1, 0, 0]))
  const n = P.sampleMatrix({ fns: [['skewX', [45], ['deg']]], opacity: 1 }, [0, 0], [0, 0, 24, 24])
  assert.ok(near(n, [1, 0, 1, 1, 0, 0]))
  assert.equal(M.partRole('wm-shine'), 'obj')
  assert.equal(M.partRole('wm-shine', { shine: true }), 'shine')
})

// ---- soft3d: part moves and per-style move lists
const PLATED = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse class="wm-shadow" cx="12" cy="21" rx="7" ry="1.2"/>' +
  '<path class="wm-k" d="M4 10h16v9H4z"/><circle class="wm-a" cx="12" cy="9" r="3"/><rect class="wm-s" x="16" y="5" width="3" height="3"/></svg>'

test('part moves: plates play their own track, the body gives, the shadow stays and softens', () => {
  for (const p of M.PLATE_PRESETS) {
    assert.ok(css.includes(`@keyframes wm-plate-${p}{`) && css.includes(`@keyframes wm-plate-${p}-loop{`), p)
    const rule = css.slice(css.indexOf(`.wm-p-${p},with-icon[preset="${p}"]{`)).split('}')[0]
    assert.ok(rule.includes(`--wmP-pl:wm-plate-${p}-loop;`), p + ' explicit class')
    const plan = P.partsPlan(P.resolveSpecMotion(null, { preset: p, trigger: 'once' }), null)
    assert.notEqual(plan.a, plan.obj, p + ': plates have their own track'); assert.equal(plan.a, plan.s)
    for (const loop of [false, true]) {
      const st = K.plateStops(p, loop, { k: 1 })
      assert.ok(near(P.sampleMatrix({ fns: parseFns(st[0][1].transform) }, [12, 12], [0, 0, 24, 24]), ID) && near(P.sampleMatrix({ fns: parseFns(st[st.length - 1][1].transform) }, [12, 12], [0, 0, 24, 24]), ID), p + ' rests')
    }
  }
  const pop = P.partsPlan(P.resolveSpecMotion(null, { preset: 'pop-up', trigger: 'once' }), null)
  const t = pop.obj.duration * 0.4
  const a = P.sampleMatrix(P.sampleRole(pop.a, { k: 1 }, t), [12, 12], [0, 0, 24, 24])
  const b = P.sampleMatrix(P.sampleRole(pop.obj, { k: 1 }, t), [12, 12], [0, 0, 24, 24])
  assert.ok(a[5] < -3 && Math.abs(b[5]) < 0.5, 'the raised parts are up, the body is home')
  assert.ok(P.sampleRole(pop.shadow, { k: 1 }, t).opacity < 0.8, 'shadow softens')
  const press = P.partsPlan(P.resolveSpecMotion(null, { preset: 'press', trigger: 'once' }), null)
  assert.ok(P.sampleMatrix(P.sampleRole(press.a, { k: 1 }, press.obj.duration * 0.22), [12, 12], [0, 0, 24, 24])[5] > 1, 'press pushes the parts down')
  // a part move is the plates' own motion: the spec's plate overrides do not apply to it (live CSS: --wmP-pl wins)
  const spec = { name: 'x', intent: 'x', loop: { preset: 'pop-up' }, hover: { preset: 'press' }, parts: { S: { preset: 'chime' } } }
  const pl = P.partsPlan(P.resolveSpecMotion(spec), spec)
  assert.equal(pl.s, pl.a); assert.equal(pl.a.key.slice(0, 3), 'pl:')
  assert.equal(M.partVars(spec, 'L')['--wmL-s'], undefined)
  assert.equal(P.partsPlan(P.resolveSpecMotion({ ...spec, loop: { preset: 'ring' } }), { ...spec, loop: { preset: 'ring' } }).s.preset, 'chime', 'other presets keep the override')
  // exports: the plates get their own keyframes
  const svg = X.animatedSvg(PLATED, { preset: 'pop-up' })
  const id = /class="(wm\w+)"/.exec(svg)[1]
  const used = sel => { const k = `.${id}-g>${sel}{animation:`, i = svg.indexOf(k); return i < 0 ? null : svg.slice(i + k.length).split(' ')[0] }
  assert.ok(used('.wm-a') && used('.wm-a') !== used(':not(.wm-deco,.wm-shadow,.wm-a,.wm-s,defs,title,desc,style)'), 'export: plates animate on their own')
  assert.equal(used('.wm-a'), used('.wm-s'))
  assert.ok(!/rotate[XY]|perspective/.test(svg))
  // CSS: plates fall back to the part move's track (--wm<S>-p), below an explicit preset and a plate override
  assert.ok(css.includes('--_pan:var(--wmP-pl, var(--wmL-a, var(--wmL-p, var(--_an))))'))
  assert.equal(M.specVars({ loop: { preset: 'pop-up' }, hover: { preset: 'press' } })['--wmL-p'], 'wm-plate-pop-up-loop')
})

test('styleMoves: soft3d offers 3-5 moves per icon, flat styles exactly their own', async () => {
  const bell = I.motionFor('bell')
  const own = [bell.loop, bell.hover, ...(bell.alt || [])].filter((m, i, a) => a.findIndex(x => x.preset === m.preset) === i)
  assert.deepEqual(M.styleMoves(bell, 'line'), own, 'flat: unchanged')
  assert.deepEqual(M.styleMoves(bell, 'clay').map(m => m.preset), M.styleMoves(M.styleSpec(bell, 'clay'), 'line').map(m => m.preset), '3D: own, mapped')
  const specs = (await import('../dist/icons.js')).default
  for (const n of Object.keys(specs)) for (const parts of [true, false]) {
    const mv = M.styleMoves(specs[n], 'soft3d', { parts })
    assert.ok(mv.length >= 3 && mv.length <= 5, `${n}: ${mv.length} moves`)
    assert.equal(new Set(mv.map(m => m.preset)).size, mv.length, n + ' no repeats')
    for (const m of mv) assert.ok(M.PRESET_DEFAULTS[m.preset], n)
    assert.equal(mv[0].preset, M.styleSpec(specs[n], 'soft3d').loop.preset, n + ': its own loop first')
    if (!parts) assert.ok(!mv.some(m => M.PLATE_PRESETS.includes(m.preset) && m.preset !== 'hop') || [specs[n].loop, specs[n].hover, ...(specs[n].alt || [])].some(m => M.PLATE_PRESETS.includes(m.preset)), n)
  }
  const plain = { name: 'x', intent: 'x', loop: { preset: 'float' }, hover: { preset: 'float' } }
  assert.deepEqual(M.styleMoves(plain, 'soft3d', { parts: true }).map(m => m.preset), ['drift', 'pop-up', 'press'])
  assert.deepEqual(M.styleMoves(plain, 'soft3d', { parts: false }).map(m => m.preset), ['drift', 'hop', 'turn'])
  assert.deepEqual(M.styleMoves(plain, 'line').map(m => m.preset), ['float'])
})
