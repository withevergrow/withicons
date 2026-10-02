// @withicons/motion — parts choreography (forge/MOTION.md "Parts choreography"): which motion each tagged part of an
// icon plays. Shared by exports (export.js), the website (Lottie, frames) and the node frame-strip previewer
// (forge/tools/preview-motion.mjs), so all of them move exactly like motion.css does inline.
import { PRESET_DEFAULTS, DIRECTIONAL, decoOf, decoTimes } from './meta.js'
import { presetStops, shadowStops, DECO_STOPS } from './keyframes.js'

/** Resolves preset, timing and geometry for one trigger of a spec (or explicit options): the motion `m` of partsPlan. */
export function resolveSpecMotion(spec, o) {
  o = o || {}
  const trigger = ['loop', 'hover', 'once'].includes(o.trigger) ? o.trigger : 'loop'
  const slot = spec ? (trigger === 'loop' ? spec.loop : spec.hover) : null
  const preset = PRESET_DEFAULTS[o.preset] ? o.preset : (slot && PRESET_DEFAULTS[slot.preset] ? slot.preset : 'pop')
  const base = slot && slot.preset === preset ? slot : {}
  const d = PRESET_DEFAULTS[preset]
  const loop = trigger === 'loop'
  const pick = (a, b, c) => a != null && a !== '' ? Number(a) : b != null ? b : c
  let dir = o.dir != null ? Number(o.dir) : base.dir
  if (dir == null && DIRECTIONAL.includes(preset) && slot && slot.dir != null) dir = slot.dir
  if (dir == null) dir = d.dir || 0
  const steps = pick(o.steps, base.steps, 0)
  return {
    preset, trigger, loop,
    // d.min: flicker never exports faster than its flash-safe minimum (WCAG 2.3.1, large GIFs / slides)
    duration: Math.max(d.min || 0, pick(o.duration, base.duration, loop ? d.cycle : d.shot)),
    k: pick(o.amount, base.amount, 1),
    origin: o.origin || base.origin || d.origin || [12, 12],
    dir, steps,
    ease: steps > 0 ? `steps(${Math.round(steps)})` : (d.ease || 'linear'),
    delay: pick(o.delay, null, 0),
  }
}

const isNum = v => v != null && v !== '' && isFinite(Number(v))
/** A part override ({ preset?, origin?, amount?, dir?, duration?, steps?, delay? }) resolved against the main motion. */
function partMotion(m, p) {
  if (!p || typeof p !== 'object') return null
  const preset = PRESET_DEFAULTS[p.preset] ? p.preset : m.preset
  const d = PRESET_DEFAULTS[preset]
  const steps = isNum(p.steps) ? Number(p.steps) : (preset === m.preset ? m.steps : 0)
  return {
    preset, trigger: m.trigger, loop: m.loop,
    // a part's own duration is a loop length; one-shots keep every part in the object's time
    duration: m.loop && isNum(p.duration) ? Math.max(d.min || 0, Number(p.duration)) : m.duration,
    k: isNum(p.amount) ? Number(p.amount) : (preset === m.preset ? m.k : 1),
    origin: p.origin || (preset === m.preset ? m.origin : d.origin) || m.origin,
    dir: isNum(p.dir) ? Number(p.dir) : m.dir,
    steps, ease: steps > 0 ? `steps(${Math.round(steps)})` : (d.ease || 'linear'),
    delay: m.delay + (isNum(p.delay) ? Number(p.delay) : 0),
  }
}

/**
 * The per-role plan for a resolved motion m (resolveMotion() in export.js: { preset, trigger, loop, duration, k, origin,
 * dir, steps, ease, delay }) and the icon's spec (for `parts` / `deco`). Each role is
 *   { preset, loop, duration, delay, iter: 'infinite' | 1, ease, origin: [x, y] | null, box: 'view-box' | 'fill-box',
 *     stops(mode) -> keyframe stops, key: string (same key = same keyframes) }
 * Roles: obj (untagged, wm-k, wm-shine), a, s (plates), deco, shadow. deco is null for "still".
 * `cycle` is the length after which every role is back where it started (loops: duration x deco multiple).
 * o.deco === false: the icon has no decoration nodes (no deco role, cycle = one object cycle).
 */
export function partsPlan(m, spec, o) {
  const iter = m.loop ? 'infinite' : 1
  const role = (mm, extra) => Object.assign({
    preset: mm.preset, loop: mm.loop, duration: mm.duration, delay: mm.delay, iter, ease: mm.ease, origin: mm.origin, box: 'view-box',
    stops: mode => presetStops(mm.preset, mm.loop, mode),
    key: [mm.preset, mm.loop ? 'l' : 's', mm.k, mm.dir].join(':'), k: mm.k, dir: mm.dir,
  }, extra)
  const obj = role(m)
  const parts = spec && spec.parts
  const pa = partMotion(m, parts && parts.A), ps = partMotion(m, parts && parts.S)
  const out = { obj, a: pa ? role(pa) : obj, s: ps ? role(ps) : obj, shadow: obj, deco: null, cycle: m.duration }
  // shadow: stays on the ground and squashes / fades for presets that lift the object; otherwise it is attached
  if (shadowStops(m.preset, m.loop, { k: 1 })) {
    out.shadow = role(m, { stops: mode => shadowStops(m.preset, m.loop, mode), key: 'sh:' + obj.key, origin: null })
  }
  const kind = decoOf(m.preset, spec && spec.deco)
  if (kind !== 'still' && DECO_STOPS[kind] && !(o && o.deco === false)) {
    if (m.loop) {
      const n = decoTimes(m.duration), dur = m.duration * n
      // counter-phased: the decoration starts half a breath in, so it is never in step with the object
      out.deco = { preset: kind, loop: true, duration: dur, delay: m.delay - dur / 2, iter, ease: 'linear', origin: null, box: 'fill-box',
        stops: () => DECO_STOPS[kind], key: 'deco:' + kind }
      out.cycle = dur
    } else {
      // one-shot: the decoration answers once, a beat after the object
      out.deco = { preset: kind, loop: false, duration: m.duration, delay: m.delay + Math.min(0.12, m.duration * 0.1), iter, ease: 'linear', origin: null, box: 'fill-box',
        stops: () => DECO_STOPS[kind], key: 'deco:' + kind }
    }
  }
  return out
}

// ---- sampling (node previewer, Lottie, tests): the value of keyframe stops at a moment, as the browser computes it.
function bezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = a => 3 * a
  const at = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a)
  return x => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (at(t, x1, x2) - x) / s }
    if (t < 0 || t > 1 || Math.abs(at(t, x1, x2) - x) > 1e-4) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 40; i++) { const v = at(t, x1, x2); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2 } }
    return at(t, y1, y2)
  }
}
const NAMED = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] }
/** A CSS timing function -> f(progress 0..1). */
export function easeFn(e) {
  e = String(e || 'linear').trim()
  if (NAMED[e]) return e === 'linear' ? x => x : bezier(...NAMED[e])
  let m = /^cubic-bezier\(([^)]*)\)$/.exec(e)
  if (m) { const p = m[1].split(',').map(Number); return bezier(p[0], p[1], p[2], p[3]) }
  if (e === 'step-end') return x => (x >= 1 ? 1 : 0)
  if (e === 'step-start') return x => (x > 0 ? 1 : 0)
  m = /^steps\(\s*(\d+)\s*(?:,\s*([\w-]+))?\)$/.exec(e)
  if (m) {
    const n = Number(m[1]), pos = m[2] || 'end'
    if (pos === 'start' || pos === 'jump-start') return x => Math.min(1, Math.ceil(x * n) / n)
    if (pos === 'jump-none') return x => Math.min(1, Math.floor(x * n) / (n - 1 || 1))
    return x => (x >= 1 ? 1 : Math.floor(x * n) / n)
  }
  return x => x
}

// transform strings: a list of [fn, [numbers], [units]]; calc(a + b) of like units is summed
function parseTransform(s) {
  const out = []
  String(s || 'none').replace(/([a-zA-Z]+)\(((?:[^()]|\([^()]*\))*)\)/g, (_, fn, args) => {
    const vals = [], units = []
    for (const a of args.split(/,(?![^(]*\))|\s+(?![^(]*\))/).filter(Boolean)) {
      const calc = /^calc\((.*)\)$/.exec(a)
      const terms = calc ? calc[1].split(/\s*\+\s*/) : [a]
      let v = 0, u = ''
      for (const t of terms) { const m = /^(-?[\d.]+(?:e-?\d+)?)([a-z%]*)$/i.exec(t.trim()); if (m) { v += Number(m[1]); u = m[2] || u } }
      vals.push(v); units.push(u)
    }
    out.push([fn, vals, units])
    return ''
  })
  return out
}
function lerpTransform(a, b, f) {
  const A = parseTransform(a), B = parseTransform(b)
  const same = A.length === B.length && A.every((x, i) => x[0] === B[i][0] && x[1].length === B[i][1].length)
  if (!same) return f < 0.5 ? A : B
  return A.map((x, i) => [x[0], x[1].map((v, j) => v + (B[i][1][j] - v) * f), x[2]])
}
function lerpShadows(a, b, f) {
  const p = s => [...String(s || '').matchAll(/drop-shadow\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)].map(m => { const n = /0 0 (-?[\d.]+)px/.exec(m[1]); return n ? Number(n[1]) : 0 })
  const A = p(a), B = p(b)
  return A.map((v, i) => v + ((B[i] || 0) - v) * f)
}
const clipVals = s => { const m = /inset\(([^)]*)\)/.exec(String(s || '')); return m ? m[1].trim().split(/\s+/).map(parseFloat) : [0, 0, 0, 0] }

/**
 * The animated values of one role at time t (seconds since the animation started, before any delay):
 * { fns: [[fn, values, units]], opacity, glow: [blur...] | null, clip: [t r b l] % | null, origin: '% %' | null }.
 * Matches CSS: fill-mode both, per-stop timing functions, the element easing where a stop has none.
 */
export function sampleRole(r, mode, t) {
  const stops = r.stops(mode)
  let p = (t - r.delay) / r.duration
  if (r.iter === 'infinite') p = p - Math.floor(p)
  else p = Math.max(0, Math.min(1, p))
  const at = p * 100
  let i = 0
  while (i < stops.length - 2 && stops[i + 1][0] <= at) i++
  const [a0, pa, ea] = stops[i], [a1, pb] = stops[Math.min(i + 1, stops.length - 1)]
  const local = a1 > a0 ? Math.max(0, Math.min(1, (at - a0) / (a1 - a0))) : 1
  const f = easeFn(ea || r.ease)(local)
  const get = (k, d) => [pa[k] != null ? pa[k] : d, pb[k] != null ? pb[k] : d]
  const [ta, tb] = get('transform', 'none'), [oa, ob] = get('opacity', 1)
  const out = { fns: lerpTransform(ta, tb, f), opacity: Number(oa) + (Number(ob) - Number(oa)) * f, glow: null, clip: null, origin: pa['transform-origin'] || null }
  if (pa.filter || pb.filter) out.glow = lerpShadows(pa.filter, pb.filter || pa.filter, f)
  if (pa['clip-path'] || pb['clip-path']) { const ca = clipVals(pa['clip-path']), cb = clipVals(pb['clip-path']); out.clip = ca.map((v, j) => v + (cb[j] - v) * f) }
  return out
}

/** A sampled role -> an SVG transform matrix [a b c d e f] in user units. box = [x, y, w, h] of the reference box. */
export function sampleMatrix(s, origin, box) {
  const [bx, by, bw, bh] = box
  const len = (v, u, ref) => (u === '%' ? v / 100 * ref : v)
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]
  let o = origin
  if (s.origin) { const q = s.origin.split(/\s+/); o = [bx + len(parseFloat(q[0]), '%', bw), by + len(parseFloat(q[1]), '%', bh)] }
  let M = [1, 0, 0, 1, o[0], o[1]]
  for (const [fn, v, u] of s.fns) {
    let n = null
    if (fn === 'translate') n = [1, 0, 0, 1, len(v[0], u[0], bw), len(v[1] || 0, u[1], bh)]
    else if (fn === 'translateX') n = [1, 0, 0, 1, len(v[0], u[0], bw), 0]
    else if (fn === 'translateY') n = [1, 0, 0, 1, 0, len(v[0], u[0], bh)]
    else if (fn === 'scale') n = [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]
    else if (fn === 'scaleX') n = [v[0], 0, 0, 1, 0, 0]
    else if (fn === 'scaleY') n = [1, 0, 0, v[0], 0, 0]
    else if (fn === 'rotate') { const a = v[0] * Math.PI / 180; n = [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0] }
    else if (fn === 'rotateY') n = [Math.cos(v[0] * Math.PI / 180), 0, 0, 1, 0, 0]
    if (n) M = mul(M, n)
  }
  return mul(M, [1, 0, 0, 1, -o[0], -o[1]])
}
