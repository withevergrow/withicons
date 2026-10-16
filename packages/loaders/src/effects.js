// @withicons/loaders — morph effects and the tiny keyframe compiler shared by the build (forge/lib/loader-compile.mjs
// morph presets) and the runtime morph(). Pure, dependency-free, deterministic.

export const EASE = {
  linear: 'linear',
  ease: 'cubic-bezier(.45,0,.55,1)',
  in: 'cubic-bezier(.55,0,1,.45)',
  out: 'cubic-bezier(0,.55,.45,1)',
  inOut: 'cubic-bezier(.65,0,.35,1)',
  expoOut: 'cubic-bezier(.16,1,.3,1)',
  spring: 'cubic-bezier(.34,1.56,.64,1)',
  gravity: 'cubic-bezier(.33,0,.67,0)',
}
// how one step of a morph comes on stage (enter) and leaves (exit); e eases the entrance, eOut the exit
export const EFFECTS = {
  bloom: { title: 'Bloom', say: 'folds into a dot and blooms out as the next', enter: { s: 0.2, r: -30, o: 0 }, exit: { s: 0.2, r: 30, o: 0 }, e: EASE.spring, eOut: EASE.in, fade: 0.26 },
  spin: { title: 'Spin', say: 'spins away and the next spins in', enter: { s: 0.4, r: -180, o: 0 }, exit: { s: 0.4, r: 180, o: 0 }, e: EASE.expoOut, eOut: EASE.in, fade: 0.3 },
  flip: { title: 'Flip', say: 'flips like a card to its other side', enter: { sx: 0, o: 1 }, exit: { sx: 0, o: 1 }, e: EASE.out, eOut: EASE.in, fade: 0.2 },
  'slide-up': { title: 'Slide up', say: 'slides up and away as the next rises in', enter: { y: 9, o: 0 }, exit: { y: -9, o: 0 }, e: EASE.expoOut, eOut: EASE.in, fade: 0.24 },
  'slide-left': { title: 'Slide left', say: 'slides left like a carousel', enter: { x: 10, o: 0 }, exit: { x: -10, o: 0 }, e: EASE.expoOut, eOut: EASE.in, fade: 0.24 },
  drop: { title: 'Drop', say: 'drops in from above and bounces', enter: { y: -12, sy: 1.1, sx: 0.92, o: 0 }, exit: { s: 0.6, o: 0 }, e: EASE.spring, eOut: EASE.in, fade: 0.3 },
  zoom: { title: 'Zoom', say: 'zooms through to the next', enter: { s: 1.7, o: 0 }, exit: { s: 0.4, o: 0 }, e: EASE.expoOut, eOut: EASE.in, fade: 0.24 },
  fade: { title: 'Cross-fade', say: 'dissolves softly into the next', enter: { s: 0.94, o: 0 }, exit: { s: 1.04, o: 0 }, e: EASE.ease, eOut: EASE.ease, fade: 0.3 },
}
export const effectNames = () => Object.keys(EFFECTS)

const DEF = { x: 0, y: 0, r: 0, sx: 1, sy: 1, o: 1 }
const P = ['x', 'y', 'r', 'sx', 'sy', 'o']
const r4 = t => Math.round(t * 10000) / 10000
const n3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }
const full = k => { const o = { ...DEF, ...k }; if (k.s != null) { o.sx = k.sx ?? k.s; o.sy = k.sy ?? k.s } delete o.s; return o }

/** Keys for step i of n: on stage for its slot of the cycle, entering and leaving with the effect. */
export function morphKeys(i, n, effect = 'bloom', fadeOverride) {
  const fx = EFFECTS[effect] || EFFECTS.bloom
  const w = 1 / n, a = i * w, F = (fadeOverride != null ? fadeOverride : fx.fade) * w
  const hidden = k => ({ ...full(k), o: 0 })
  const rest = { ...DEF }
  const ks = []
  if (a > 0) ks.push([0, hidden(fx.exit)])
  ks.push([a, { ...full(fx.enter), e: fx.e }], [a + F, rest], [a + w - F, { ...rest, e: fx.eOut }], [a + w, full(fx.exit)])
  if (a + w < 1) ks.push([1, hidden(fx.exit)])
  return ks.map(([t, k]) => [r4(t), k])
}

/** @keyframes text for keys (full key objects) -> { css, used } */
export function keyframes(name, keys, ease = 'linear') {
  const used = { t: false, r: false, s: false, o: false }
  for (const [, k] of keys) { if (k.x || k.y) used.t = true; if (k.r) used.r = true; if (k.sx !== 1 || k.sy !== 1) used.s = true; if (k.o !== 1) used.o = true }
  const tf = k => {
    const t = []
    if (used.t) t.push(`translate(${n3(k.x)}px,${n3(k.y)}px)`)
    if (used.r) t.push(`rotate(${n3(k.r)}deg)`)
    if (used.s) t.push(k.sx === k.sy ? `scale(${n3(k.sx)})` : `scale(${n3(k.sx)},${n3(k.sy)})`)
    return t.join(' ') || 'none'
  }
  const body = keys.map(([t, k], i) => {
    const d = []
    if (used.t || used.r || used.s) d.push('transform:' + tf(k))
    if (used.o) d.push('opacity:' + n3(k.o))
    const e = i < keys.length - 1 ? (k.e || ease) : null
    if (e && e !== 'linear') d.push('animation-timing-function:' + e)
    return `${n3(t * 100)}%{${d.join(';')}}`
  }).join('')
  return `@keyframes ${name}{${body}}`
}
export { DEF as KEY_DEFAULTS, P as KEY_PROPS }
