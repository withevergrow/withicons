// @withicons/motion — the keyframes of every preset and swap effect, as data.
// One definition produces both the variable-driven CSS in motion.css (mode = null) and
// the literal, self-contained keyframes in exported animated SVGs (mode = { k, dx, dy }).
import { PRESET_DEFAULTS, EFFECT_DEFAULTS, hasLoopVariant } from './meta.js'

// ---- easing vocabulary (tuned by eye on 16-96px icons)
export const EASE = {
  out: 'cubic-bezier(.22,1,.36,1)',        // quick start, long soft landing
  in: 'cubic-bezier(.55,0,.85,.35)',       // accelerate away
  inOut: 'cubic-bezier(.65,0,.35,1)',
  sineIn: 'cubic-bezier(.12,0,.39,0)',
  sineOut: 'cubic-bezier(.61,1,.88,1)',
  sine: 'cubic-bezier(.37,0,.63,1)',
  back: 'cubic-bezier(.34,1.56,.64,1)',    // springy overshoot
  softBack: 'cubic-bezier(.3,1.35,.55,1)',
  snap: 'cubic-bezier(.2,.9,.3,1.2)',
  fall: 'cubic-bezier(.55,0,.9,.45)',      // gravity
  lift: 'cubic-bezier(.15,.55,.4,1)',      // decelerating rise
}
const E = EASE

const r = n => { const v = Math.round(n * 1000) / 1000; return String(Object.is(v, -0) ? 0 : v) }

// Value helpers. CSS mode keeps var() references so one @keyframes serves every icon; numeric mode bakes them.
//   mode = null or { css: true, legacyGlow? }  -> CSS mode;  { k, dx, dy, em } -> numeric mode.
export function valuesFor(mode) {
  if (!mode || mode.css) {
    const kd = (n, u) => `calc(${n}${u} * var(--_k))`
    return {
      deg: n => kd(n, 'deg'),
      sc: n => `calc(1 + ${n} * var(--_k))`,
      scMin: (n, m) => `max(${m}, calc(1 + ${n} * var(--_k)))`,
      len: n => kd(n, '%'),
      em: n => kd(n, 'em'),
      dx: n => `calc(var(--_dx) * ${n}% * var(--_k))`,
      dy: n => `calc(var(--_dy) * ${n}% * var(--_k))`,
      clip: t => `inset(max(0%, calc(var(--_dy) * ${-t}% * var(--_k))) max(0%, calc(var(--_dx) * ${t}% * var(--_k))) max(0%, calc(var(--_dy) * ${t}% * var(--_k))) max(0%, calc(var(--_dx) * ${-t}% * var(--_k))))`,
      legacyGlow: !!(mode && mode.legacyGlow),
    }
  }
  const k = mode.k == null ? 1 : mode.k, dx = mode.dx == null ? 1 : mode.dx, dy = mode.dy == null ? 0 : mode.dy
  const em = mode.em || 16
  const p = v => r(v) + '%'
  return {
    deg: n => r(n * k) + 'deg',
    sc: n => r(1 + n * k),
    scMin: (n, m) => r(Math.max(m, 1 + n * k)),
    len: n => p(n * k),
    em: n => r(n * k * em) + 'px',
    dx: n => p(dx * n * k),
    dy: n => p(dy * n * k),
    clip: t => `inset(${p(Math.max(0, -dy * t * k))} ${p(Math.max(0, dx * t * k))} ${p(Math.max(0, dy * t * k))} ${p(Math.max(0, -dx * t * k))})`,
  }
}

// helpers to keep stop lists readable
const T = s => ({ transform: s })
// Halo of glow / twinkle: two soft drop-shadows tinted with --wm-glow (default currentColor) at 42% and 22% alpha.
// [inner, outer] blur radius in em, per preset (exports rebuild the same halo as an SVG filter, see export.js).
export const GLOW_HALO = { glow: [0.05, 0.3], twinkle: [0.06, 0.28], alpha: [0.42, 0.22] }
export const GLOW0 = 'drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent)'
// legacyGlow: for engines without color-mix() (Safari < 16.2, Chromium < 111) motion.css re-declares the two keyframes
// inside @supports not (color-mix) with one solid-colour shadow (a little tighter) instead of the translucent pair.
const GLOW0_LEGACY = 'drop-shadow(0 0 0 transparent)'
const glow0 = v => v.legacyGlow ? GLOW0_LEGACY : GLOW0
const glow = (v, a, b) => v.legacyGlow
  ? `drop-shadow(0 0 ${v.em(b * 0.8)} var(--wm-glow, currentColor))`
  : `drop-shadow(0 0 ${v.em(a)} color-mix(in srgb, var(--wm-glow, currentColor) 42%, transparent)) drop-shadow(0 0 ${v.em(b)} color-mix(in srgb, var(--wm-glow, currentColor) 22%, transparent))`
// pendulum: angles alternate, each swing eased like a real pendulum (still at the extremes)
function swings(v, pts) {
  return pts.map(([at, deg], i) => [at, T(`rotate(${deg ? v.deg(deg) : '0deg'})`), i === 0 ? E.sineOut : E.sine])
}
// a symmetric sine oscillation 0 -> +a -> 0 -> -a -> 0 (constant energy, no stall at the centre)
function osc(v, fn) {
  return [[0, T(fn(0)), E.sineOut], [25, T(fn(1)), E.sineIn], [50, T(fn(0)), E.sineOut], [75, T(fn(-1)), E.sineIn], [100, T(fn(0))]]
}

// Each preset: v => [[percent, { css props }, easing to the next stop], ...]. Every list starts and ends at rest,
// so loops are seamless and one-shots hand back a still icon.
export const PRESET_STOPS = {
  'spin': v => [[0, T('rotate(0deg)')], [100, T('rotate(360deg)')]],
  'tick': v => [[0, T('rotate(0deg)')], [100, T('rotate(360deg)')]],
  'spin-once': v => [[0, T('rotate(0deg)'), 'cubic-bezier(.6,0,.25,1)'], [72, T(`rotate(calc(360deg + ${v.deg(14)}))`), E.inOut], [100, T('rotate(360deg)')]],
  'pulse': v => [[0, T('scale(1)'), E.sine], [50, T(`scale(${v.sc(0.1)})`), E.sine], [100, T('scale(1)')]],
  'beat': v => [[0, T('scale(1)'), E.out], [20, T(`scale(${v.sc(0.16)})`), E.inOut], [40, T(`scale(${v.sc(-0.02)})`), E.out],
    [58, T(`scale(${v.sc(0.1)})`), E.sine], [100, T('scale(1)')]],
  'breathe': v => [[0, { transform: 'scale(1)', opacity: 1 }, E.sine], [50, { transform: `scale(${v.sc(0.07)})`, opacity: 0.72 }, E.sine], [100, { transform: 'scale(1)', opacity: 1 }]],
  'float': v => [[0, T('translateY(0%)'), E.sineIn], [25, T(`translateY(${v.len(-5)})`), E.sineOut], [50, T(`translateY(${v.len(-10)})`), E.sineIn],
    [75, T(`translateY(${v.len(-5)})`), E.sineOut], [100, T('translateY(0%)')]],
  'bounce': v => {
    const b = (y, sx, sy) => T(`translateY(${y ? v.len(y) : '0%'}) scale(${sx === 1 ? 1 : v.sc(sx - 1)}, ${sy === 1 ? 1 : v.sc(sy - 1)})`)
    return [[0, b(0, 1, 1), E.out], [9, b(0, 1.07, 0.9), E.lift], [36, b(-30, 0.95, 1.06), E.fall], [58, b(0, 1.1, 0.88), E.out],
      [70, b(-7, 0.98, 1.02), E.fall], [81, b(0, 1.03, 0.97), E.out], [100, b(0, 1, 1)]]
  },
  'sway': v => osc(v, s => `rotate(${s ? v.deg(6 * s) : '0deg'})`),
  'rock': v => osc(v, s => `rotate(${s ? v.deg(10 * s) : '0deg'})`),
  'ring': v => swings(v, [[0, 0], [9, 16], [21, -14], [33, 11], [45, -8], [57, 5], [69, -2.5], [81, 1], [100, 0]]),
  'wiggle': v => swings(v, [[0, 0], [12, -9], [26, 8], [40, -6], [54, 4], [68, -2], [82, 0.8], [100, 0]]),
  'shake': v => {
    const xs = [[0, 0], [10, -11], [22, 10], [34, -8], [46, 6], [58, -3.5], [70, 1.5], [84, 0], [100, 0]]
    return xs.map(([at, x], i) => [at, T(`translateX(${x ? v.len(x) : '0%'})`), i === 0 ? E.out : E.sine])
  },
  'nod': v => {
    const ys = [[0, 0], [18, 10], [38, -3], [58, 6], [78, -1], [100, 0]]
    return ys.map(([at, y], i) => [at, T(`translateY(${y ? v.len(y) : '0%'}) scaleY(${y > 0 ? v.sc(-0.03 * y / 10) : 1})`), i === 0 ? E.out : E.sine])
  },
  'nudge': v => [[0, T('translate(0%, 0%)'), 'cubic-bezier(.4,0,.2,1)'], [36, T(`translate(${v.dx(15)}, ${v.dy(15)})`), E.inOut],
    [66, T(`translate(${v.dx(-2)}, ${v.dy(-2)})`), E.sine], [86, T('translate(0%, 0%)'), E.sine], [100, T('translate(0%, 0%)')]],
  'pass': v => [
    [0, { transform: 'translate(0%, 0%)', 'clip-path': 'inset(0% 0% 0% 0%)' }, E.in],
    [44, { transform: `translate(${v.dx(78)}, ${v.dy(78)})`, 'clip-path': v.clip(78) }, 'step-end'],
    [44.01, { transform: `translate(${v.dx(-78)}, ${v.dy(-78)})`, 'clip-path': v.clip(-78) }, E.softBack],
    [90, { transform: 'translate(0%, 0%)', 'clip-path': 'inset(0% 0% 0% 0%)' }],
    [100, { transform: 'translate(0%, 0%)', 'clip-path': 'inset(0% 0% 0% 0%)' }]],
  'rise': v => [[0, { transform: 'translateY(0%) scale(1)', opacity: 1 }, E.in], [44, { transform: `translateY(${v.len(-38)}) scale(.92)`, opacity: 0 }, 'step-end'],
    [44.01, { transform: 'translateY(0%) scale(.4)', opacity: 0 }, E.back], [86, { transform: 'translateY(0%) scale(1)', opacity: 1 }], [100, { transform: 'translateY(0%) scale(1)', opacity: 1 }]],
  'drop': v => [[0, { transform: 'translateY(0%) scaleY(1)', opacity: 1 }, E.fall], [44, { transform: `translateY(${v.len(40)}) scaleY(1.08)`, opacity: 0 }, 'step-end'],
    [44.01, { transform: `translateY(${v.len(-30)}) scaleY(1)`, opacity: 0 }, E.out], [86, { transform: 'translateY(0%) scaleY(1)', opacity: 1 }], [100, { transform: 'translateY(0%) scaleY(1)', opacity: 1 }]],
  'blink': v => [[0, T('scaleY(1)'), 'cubic-bezier(.5,0,.9,.4)'], [34, T(`scaleY(${v.scMin(-0.9, 0.06)})`), E.out], [74, T(`scaleY(${v.sc(0.04)})`), E.sine], [100, T('scaleY(1)')]],
  'flicker': v => {
    const f = (sx, sy, rot, o) => ({ transform: `scale(${sx ? v.sc(sx) : 1}, ${sy ? v.sc(sy) : 1}) rotate(${rot ? v.deg(rot) : '0deg'})`, opacity: o })
    return [[0, f(0, 0, 0, 1), E.sine], [9, f(0.025, -0.05, -1.5, 0.84), E.sine], [17, f(-0.02, 0.045, 1, 1), E.sine], [30, f(0.01, -0.02, 0, 0.93), E.sine],
      [37, f(0, 0.035, -1, 1), E.sine], [53, f(0.03, -0.06, 1.5, 0.78), E.sine], [61, f(-0.01, 0.025, 0, 1), E.sine], [76, f(0.012, -0.02, -0.5, 0.9), E.sine],
      [85, f(0, 0.02, 0, 1), E.sine], [100, f(0, 0, 0, 1)]]
  },
  'twinkle': v => [
    [0, { transform: 'scale(1) rotate(0deg)', filter: glow0(v) }, E.out],
    [20, { transform: `scale(${v.sc(-0.12)}) rotate(${v.deg(-8)})`, filter: glow0(v) }, E.back],
    [48, { transform: `scale(${v.sc(0.16)}) rotate(${v.deg(12)})`, filter: glow(v, ...GLOW_HALO.twinkle) }, E.inOut],
    [100, { transform: 'scale(1) rotate(0deg)', filter: glow0(v) }]],
  'pop': v => [[0, T('scale(1)'), E.out], [16, T(`scale(${v.sc(-0.14)})`), E.back], [56, T(`scale(${v.sc(0.12)})`), E.sine],
    [78, T(`scale(${v.sc(-0.03)})`), E.sine], [100, T('scale(1)')]],
  'tada': v => {
    const s = (sc, deg) => T(`scale(${sc ? v.sc(sc) : 1}) rotate(${deg ? v.deg(deg) : '0deg'})`)
    return [[0, s(0, 0), E.out], [12, s(-0.1, -4), E.sine], [22, s(-0.1, -4), E.back], [34, s(0.12, 5), E.sine], [46, s(0.12, -5), E.sine],
      [58, s(0.12, 5), E.sine], [70, s(0.12, -4), E.sine], [84, s(0.04, 1), E.sine], [100, s(0, 0)]]
  },
  'jelly': v => {
    const j = (a) => T(`scale(${a ? v.sc(a) : 1}, ${a ? v.sc(-a) : 1})`)
    return [[0, j(0), E.out], [24, j(0.2), E.sine], [42, j(-0.15), E.sine], [58, j(0.08), E.sine], [72, j(-0.04), E.sine], [86, j(0.015), E.sine], [100, j(0)]]
  },
  'flip': v => [[0, T('rotateY(0deg) scale(1)'), 'cubic-bezier(.6,-.15,.7,.4)'], [50, T(`rotateY(180deg) scale(${v.sc(-0.08)})`), 'cubic-bezier(.3,.6,.4,1.15)'], [100, T('rotateY(360deg) scale(1)')]],
  'tilt': v => [[0, T('rotate(0deg)'), E.out], [24, T(`rotate(${v.deg(-11)})`), E.sine], [36, T(`rotate(${v.deg(-8)})`)], [70, T(`rotate(${v.deg(-8)})`), E.softBack], [100, T('rotate(0deg)')]],
  'zoom': v => [[0, T('scale(1)'), E.out], [38, T(`scale(${v.sc(0.18)})`)], [58, T(`scale(${v.sc(0.18)})`), E.inOut], [88, T(`scale(${v.sc(-0.015)})`), E.sine], [100, T('scale(1)')]],
  'orbit': v => [[0, T(`translateX(${v.len(-6)}) rotate(0deg) translateX(${v.len(6)}) rotate(0deg)`)], [100, T(`translateX(${v.len(-6)}) rotate(360deg) translateX(${v.len(6)}) rotate(-360deg)`)]],
  'glow': v => [[0, { transform: 'scale(1)', filter: glow0(v) }, E.sine], [50, { transform: `scale(${v.sc(0.04)})`, filter: glow(v, ...GLOW_HALO.glow) }, E.sine], [100, { transform: 'scale(1)', filter: glow0(v) }]],
  'type': v => {
    const k = (x, y, deg) => T(`translate(${x ? v.len(x) : '0%'}, ${y ? v.len(y) : '0%'}) rotate(${deg ? v.deg(deg) : '0deg'})`)
    return [[0, k(0, 0, 0), E.out], [7, k(-1.5, 5, -2), E.out], [18, k(0, 0, 0), E.out], [26, k(1.5, 4, 1.5), E.out], [37, k(0, 0, 0), E.out],
      [46, k(-1, 5, -1), E.out], [57, k(0, 0, 0), E.out], [66, k(2, 4, 2), E.out], [80, k(0, 0, 0)], [100, k(0, 0, 0)]]
  },
  'fill': v => [[0, { opacity: 1, transform: 'scale(1)' }, E.out], [12, { opacity: 0.32, transform: `scale(${v.sc(-0.04)})` }, 'cubic-bezier(.45,0,.4,1)'],
    [80, { opacity: 1, transform: `scale(${v.sc(0.03)})` }, E.back], [100, { opacity: 1, transform: 'scale(1)' }]],
}
// draw: the element-level fallback (non-stroked styles, or no JS) is pop
PRESET_STOPS.draw = PRESET_STOPS.pop

// stroke draw-on for paths that carry pathLength="1" (prepared by the runtime)
export const DRAW_KEYFRAMES = {
  'wm-draw-path': [[0, { 'stroke-dashoffset': 1.01 }, 'cubic-bezier(.55,.05,.35,1)'], [100, { 'stroke-dashoffset': 0 }]],
  'wm-draw-path-loop': [[0, { 'stroke-dashoffset': 1.01, opacity: 1 }, 'cubic-bezier(.55,.05,.35,1)'], [50, { 'stroke-dashoffset': 0, opacity: 1 }],
    [80, { 'stroke-dashoffset': 0, opacity: 1 }, E.sine], [94, { 'stroke-dashoffset': 0, opacity: 0 }], [100, { 'stroke-dashoffset': 0, opacity: 0 }]],
  'wm-draw-fill': [[0, { opacity: 0 }], [55, { opacity: 0 }, E.sine], [100, { opacity: 1 }]],
  'wm-draw-fill-loop': [[0, { opacity: 0 }], [30, { opacity: 0 }, E.sine], [50, { opacity: 1 }], [80, { opacity: 1 }, E.sine], [94, { opacity: 0 }], [100, { opacity: 0 }]],
}

// compress an action into [0, act] and rest afterwards
export function loopStops(stops, act) {
  const out = stops.map(([at, props, ease]) => [at * act, props, ease])
  const last = stops[stops.length - 1]
  out.push([100, last[1]])
  return out
}
export function presetStops(preset, loop, mode) {
  const v = valuesFor(mode)
  const stops = PRESET_STOPS[preset](v)
  if (!loop || !hasLoopVariant(preset)) return stops
  const d = PRESET_DEFAULTS[preset]
  return loopStops(stops, d.shot / d.cycle)
}

const fmtPct = n => r(n) + '%'
export function propsCss(props) {
  return Object.keys(props).map(k => k + ':' + props[k]).join(';')
}
export function keyframesCss(name, stops) {
  return '@keyframes ' + name + '{' + stops.map(([at, props, ease]) =>
    fmtPct(at) + '{' + propsCss(props) + (ease && at < 100 ? ';animation-timing-function:' + ease : '') + '}').join('') + '}'
}

// ---- swap effects: the hidden state of the outgoing (a) and incoming (b) icon.
// visible = { transform: none, opacity: 1, filter: none }
export const EFFECT_STATES = {
  'fade': { a: { opacity: 0 }, b: { opacity: 0 } },
  'scale': { a: { transform: 'scale(.35)', opacity: 0 }, b: { transform: 'scale(.35)', opacity: 0 }, spring: true },
  'rotate': { a: { transform: 'rotate(90deg) scale(.5)', opacity: 0 }, b: { transform: 'rotate(-90deg) scale(.5)', opacity: 0 }, spring: true },
  'flip': { a: { transform: 'rotateY(180deg)', opacity: 0 }, b: { transform: 'rotateY(-180deg)', opacity: 0 }, flip: true },
  'slide-up': { a: { transform: 'translateY(-100%)', opacity: 0 }, b: { transform: 'translateY(100%)', opacity: 0 }, clip: true },
  'slide-down': { a: { transform: 'translateY(100%)', opacity: 0 }, b: { transform: 'translateY(-100%)', opacity: 0 }, clip: true },
  'slide-left': { a: { transform: 'translateX(-100%)', opacity: 0 }, b: { transform: 'translateX(100%)', opacity: 0 }, clip: true },
  'slide-right': { a: { transform: 'translateX(100%)', opacity: 0 }, b: { transform: 'translateX(-100%)', opacity: 0 }, clip: true },
  'blur': { a: { transform: 'scale(1.18)', filter: 'blur(3px)', opacity: 0 }, b: { transform: 'scale(.82)', filter: 'blur(3px)', opacity: 0 } },
  'spin': { a: { transform: 'rotate(180deg) scale(.3)', opacity: 0 }, b: { transform: 'rotate(-180deg) scale(.3)', opacity: 0 }, spring: true },
  'morph': { a: { transform: 'scale(.55) rotate(40deg)', filter: 'blur(2.5px)', opacity: 0 }, b: { transform: 'scale(.55) rotate(-40deg)', filter: 'blur(2.5px)', opacity: 0 }, spring: true },
  'draw': { a: { opacity: 0 }, b: { opacity: 0 }, draw: true },
}
export const VISIBLE = { transform: 'none', opacity: 1, filter: 'none' }
// the visible counterpart of a hidden state, with matching properties (so keyframes interpolate cleanly)
export function visibleOf(hidden) {
  const o = {}
  for (const k in hidden) o[k] = VISIBLE[k]
  return o
}
export const SWAP_EASE = { enter: E.out, spring: 'cubic-bezier(.3,1.45,.55,1)', exit: 'cubic-bezier(.4,0,.6,1)', flip: 'cubic-bezier(.45,0,.2,1)' }

// Continuous A -> B -> A cycle for one effect (used by .wm-swap.wm-loop / .wm-swap-auto, exports and the editor).
// cycle and d in seconds. o (optional): { hold: true | seconds — the cycle was built from a hold (swapCycle), so a
// transition may take up to half of it instead of 24%; ease: CSS easing of the incoming icon (else the effect's own) }.
// Returns { a: stops, b: stops }.
export function swapLoopStops(effect, cycle, d, o) {
  o = o || {}
  const st = EFFECT_STATES[effect] || EFFECT_STATES.fade
  d = d || (EFFECT_DEFAULTS[effect] || EFFECT_DEFAULTS.fade).dur
  const f = Math.min(o.hold != null && o.hold !== false ? 0.5 : 0.24, d / cycle)   // one transition as a fraction of the cycle
  const ex = st.flip ? f : f * 0.62, lag = st.flip ? 0 : f * 0.14
  const enterEase = o.ease || (st.flip ? SWAP_EASE.flip : st.spring ? SWAP_EASE.spring : SWAP_EASE.enter)
  const exitEase = st.flip ? (o.ease || SWAP_EASE.flip) : SWAP_EASE.exit
  const P = x => x * 100
  const h1 = 0.5 - f, h2 = 1 - f                // A leaves at h1, B leaves at h2
  const va = visibleOf(st.a), vb = visibleOf(st.b)
  const a = [[0, va], [P(h1), va, exitEase], [P(h1 + ex), st.a], [P(h2 + lag), st.a, enterEase], [100, va]]
  const b = [[0, st.b], [P(h1 + lag), st.b, enterEase], [P(h1 + f), vb], [P(h2), vb, exitEase], [P(h2 + ex), st.b], [100, st.b]]
  return { a, b }
}

// ---- parts choreography (forge/MOTION.md "Parts choreography"): decorations and cast shadows move on their own.
// Deco loops: gentle, never the main preset. Values are literal (no --_k): a sparkle twinkles the same however hard
// the object moves. They run on `transform-box: fill-box` about each decoration's own centre; lengths are in user
// units of the 24 grid (CSS px inside an SVG).
export const DECO_STOPS = {
  'breathe': [[0, { transform: 'scale(1)', opacity: 1 }, E.sine], [50, { transform: 'scale(1.07)', opacity: 0.78 }, E.sine], [100, { transform: 'scale(1)', opacity: 1 }]],
  'float': [[0, T('translate(0px, 0px) rotate(0deg)'), E.sine], [25, T('translate(.25px, -.55px) rotate(2deg)'), E.sine], [50, T('translate(0px, -1.1px) rotate(0deg)'), E.sine],
    [75, T('translate(-.25px, -.55px) rotate(-2deg)'), E.sine], [100, T('translate(0px, 0px) rotate(0deg)')]],
  'twinkle': [[0, { transform: 'scale(1) rotate(0deg)', opacity: 1 }, E.sine], [34, { transform: 'scale(.62) rotate(-14deg)', opacity: 0.45 }, E.back],
    [66, { transform: 'scale(1.16) rotate(10deg)', opacity: 1 }, E.sine], [100, { transform: 'scale(1) rotate(0deg)', opacity: 1 }]],
}
export const DECOS = Object.keys(DECO_STOPS)

// Ground shadows: for presets that lift the object off the ground the shadow stays on the ground (it never travels
// with the object) and shrinks / fades as the object rises, widens as it squashes. Same stops as the object's preset,
// so they stay in sync; scaled about a point on the ground (transform-origin in the keyframes, % of the 24 grid).
const G = '50% 92%'
const gs = (v, s, o, sy) => ({ 'transform-origin': G, transform: `scale(${s ? v.sc(s) : 1}, ${sy ? v.sc(sy) : (s ? v.sc(s) : 1)})`, opacity: o ? v.sc(o) : 1 })
export const SHADOW_STOPS = {
  'bounce': v => {
    const b = (y, sx) => gs(v, (sx - 1) + y * 0.011, y * 0.013, (sx - 1) * 0.4 + y * 0.011)
    return [[0, b(0, 1), E.out], [9, b(0, 1.07), E.lift], [36, b(-30, 0.95), E.fall], [58, b(0, 1.1), E.out],
      [70, b(-7, 0.98), E.fall], [81, b(0, 1.03), E.out], [100, b(0, 1)]]
  },
  'float': v => [[0, gs(v, 0, 0), E.sineIn], [25, gs(v, -0.06, -0.08), E.sineOut], [50, gs(v, -0.12, -0.16), E.sineIn],
    [75, gs(v, -0.06, -0.08), E.sineOut], [100, gs(v, 0, 0)]],
  'rise': v => [[0, gs(v, 0, 0), E.in], [44, gs(v, -0.5, -1), 'step-end'], [44.01, gs(v, -0.6, -1), E.back], [86, gs(v, 0, 0)], [100, gs(v, 0, 0)]],
  'drop': v => [[0, gs(v, 0, 0), E.fall], [44, gs(v, 0.12, -1), 'step-end'], [44.01, gs(v, -0.35, -1), E.out], [86, gs(v, 0, 0)], [100, gs(v, 0, 0)]],
  'jelly': v => {
    const j = a => gs(v, a, 0, a ? -a * 0.2 : 0)
    return [[0, j(0), E.out], [24, j(0.2), E.sine], [42, j(-0.15), E.sine], [58, j(0.08), E.sine], [72, j(-0.04), E.sine], [86, j(0.015), E.sine], [100, j(0)]]
  },
}
export const GROUND = Object.keys(SHADOW_STOPS)
export function shadowStops(preset, loop, mode) {
  if (!SHADOW_STOPS[preset]) return null
  const stops = SHADOW_STOPS[preset](valuesFor(mode))
  if (!loop || !hasLoopVariant(preset)) return stops
  const d = PRESET_DEFAULTS[preset]
  return loopStops(stops, d.shot / d.cycle)
}
