// LUNAR core: the geometry behind forge/styles/lunar.mjs (Lunar New Year).
//
// Layers, back to front:
//   BODY      the Solid mass (fills + round strokes, crisp knockouts). K pieces are red lacquer: a
//             vertical gradient from lucky red to deep crimson, rimmed with a gold-foil line      wm-k
//   GOLD      A pieces (parts) are gold foil with a fine lacquer outline                          wm-a
//   JADE      S pieces (badges, modifiers, slashes) are jade with the gold-foil rim               wm-s
//   PAPERCUT  a fine gold line inside the edge of every broad red shape (the paper-cut border)    wm-shine
//   CLOUD     a graphic auspicious cloud (xiangyun: two spiral heads and a tail) centred on broad bodies only  wm-shine
//   GLINT     one small four-point foil glint on the rim's upper left                              wm-shine
//   TASSEL    a gold cord, a knot and a red silk tassel hanging under objects that hang
//             (lanterns, bells, keys, tags, knots, coins, fans), only where there is room         wm-deco
//   BLOSSOM   one plum blossom in free space, only on celebration icons (gift, cake, red envelope ...)    wm-deco
// Materials vary by category and icon (_lunar-tune.mjs): red lacquer (default), gold foil (money, metal, prizes),
// jade (nature, health, charts) and cream rice paper with a red rim (documents, mail, avatars).
// Live icons (icon.params) keep a plain red body with the outer gold rim only: values stay clean.
// No text or characters anywhere.
import { solidPlates, LAST } from './_lunar-solid.mjs'
import * as F from './_lunar-sfield.mjs'
import { ringsD } from './_lunar-path.mjs'
import { area, simplify, pointInRing } from '../kernel/geom.mjs'
import { DEFAULT } from './_lunar-palettes.mjs'
import { tuneFor } from './_lunar-tune.mjs'
import { isPerson, personColors, personPaint } from './_lunar-people.mjs'

export const U = {
  RIM: 0.6,         // gold-foil rim width (centred on the edge)
  RIM_A: 0.42,      // lacquer outline of gold parts
  IN: 1.05,         // the paper-cut line runs this far inside the edge ...
  IN_W: 0.3,        // ... this thick
  IN_MIN: 0.62,     // shapes thinner than 2x this carry no paper-cut line
  IN_LOOP: 3.2,     // and loops smaller than this (bbox min side) are dropped
  DEEP: 5.8,          // reach of the exact inner distance
  CLOUD_CLEAR: 1.5,  // the cloud keeps this clear of the edge
  CLOUD_MAX: 4.2,   // cloud half-width cap ...
  CLOUD_MIN: 2.8,
  CLOUD_AREA: 150,  // ... and only on a broad body piece (outer loop area, u^2)  // ... and the smallest worth drawing
  FIT: 0.06,        // curve-fit tolerance of traced contours
}

export const col = r => `var(--with-lunar-${r}, ${DEFAULT[r]})`
export const C = Object.fromEntries(Object.keys(DEFAULT).map(r => [r, col(r)]))
const C0 = { ...C }

// ---------------------------------------------------------------------------
// compact numbers
export const num = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  if (s.startsWith('0.')) s = s.slice(1)
  else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
const f2 = v => +(+v).toFixed(2)
const P = (x, y) => num(x) + ' ' + num(y)
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
export function bboxOf(loops) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const l of loops) for (const [x, y] of l) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y }
  return isFinite(x0) ? [x0, y0, x1, y1] : [4, 4, 20, 20]
}
const loopsD = loops => { try { return ringsD(loops, U.FIT) } catch { return '' } }

// signed distance sample (nearest node; outside the grid counts as far outside)
const sAt = (G, x, y) => {
  const i = Math.round(x / F.H), j = Math.round(y / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 9 : G[j * F.N + i]
}
// the mass offset inward by `inset`, with parts thinner than 2*minHalf dropped
function inner(sdf, inset, minHalf, minArea = 0.8) {
  const G = new Float32Array(sdf.length)
  for (let k = 0; k < G.length; k++) G[k] = sdf[k] + inset
  return F.trace(F.open(G, minHalf), 0.04, minArea)
}
// is p inside the even-odd region of these loops
const inLoops = (loops, p) => { let c = 0; for (const l of loops) if (pointInRing(p, l)) c++; return c % 2 === 1 }

// ---------------------------------------------------------------------------
// free space outside the glyph (never in a hole)
function outsideMask(mass) {
  const N = F.N, NN = N * N, out = new Uint8Array(NN), st = []
  const push = k => { if (!out[k] && mass[k] > 0) { out[k] = 1; st.push(k) } }
  for (let q = 0; q < N; q++) { push(q); push(NN - N + q); push(q * N); push(q * N + N - 1) }
  while (st.length) {
    const k = st.pop(), j = (k / N) | 0, i = k - j * N
    if (i > 0) push(k - 1); if (i < N - 1) push(k + 1); if (j > 0) push(k - N); if (j < N - 1) push(k + N)
  }
  return out
}
// the best spot for a blossom: roomy, toward the upper right
function blossomSpot(mass, loops) {
  const D = F.redistance(mass, loops, 3.4), O = outsideMask(mass)
  let best = null, bs = -Infinity
  for (let y = 2.4; y <= 21.6; y += 0.2) for (let x = 2.4; x <= 21.6; x += 0.2) {
    const i = Math.round(x / F.H), j = Math.round(y / F.H), k = j * F.N + i
    if (!O[k]) continue
    const d = D[k]
    const r = Math.min(d - 0.75, 2.1, x - 1.2, 22.8 - x, y - 1.2, 22.8 - y)
    if (r < 1.25) continue
    const s = r * 1.8 + 0.08 * (x - 12) - 0.12 * (y - 12)
    if (s > bs) { bs = s; best = { x, y, r } }
  }
  return best
}

// ---------------------------------------------------------------------------
// motifs

// a five-petal plum blossom: round petals with a notch, a gold heart and stamen dots
function blossom(x, y, r) {
  r = Math.min(r, 2.0)
  const pr = r * 0.46, pd = r * 0.54
  let d = ''
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + k * Math.PI * 2 / 5
    d += discD(x + Math.cos(a) * pd, y + Math.sin(a) * pd, pr)
  }
  let dots = ''
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k + 0.5) * Math.PI * 2 / 5
    dots += discD(x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42, r * 0.075)
  }
  return [
    ['path', { d, fill: C.c4, stroke: C.c2, 'stroke-width': f2(Math.max(0.24, r * 0.13)), class: 'wm-deco' }],
    ['path', { d: discD(x, y, r * 0.27) + dots, fill: C.accent, class: 'wm-deco' }],
  ]
}

// an auspicious cloud (xiangyun), paper-cut and graphic: a big spiral head and a smaller one on one base line,
// with a tail sweeping up to the right. The spirals are bold cuts in the body colour, so the motif reads as two
// curls even small. Unit space: x -.9..1.05, y -.55...46; scaled to R.
function cloud(cx, cy, R, body = C.accent, cut = C.c2) {
  const X = u => cx + u * R, Y = v => cy + v * R
  let d = discD(X(-0.36), Y(-0.04), 0.5 * R) + discD(X(0.36), Y(0.12), 0.34 * R)
  d += `M${P(X(-0.36), Y(0.1))}H${num(X(0.36))}V${num(Y(0.46))}H${num(X(-0.36))}z`
  d += `M${P(X(0.5), Y(0.46))}Q${P(X(0.95), Y(0.46))} ${P(X(1.06), Y(0.04))}Q${P(X(0.92), Y(0.3))} ${P(X(0.58), Y(0.2))}z`
  const curl = (u, v, r0, r1, a0, turns, dir) => {
    const n = Math.max(12, Math.round(26 * turns)), pts = []
    for (let q = 0; q <= n; q++) { const t = q / n, a = a0 + dir * t * turns * Math.PI * 2, r = (r0 + (r1 - r0) * t) * R; pts.push([X(u) + Math.cos(a) * r, Y(v) + Math.sin(a) * r]) }
    return simplify(pts, 0.012, false).map((p, i) => (i ? 'L' : 'M') + P(p[0], p[1])).join('')
  }
  const curls = curl(-0.36, -0.04, 0.1, 0.3, 0.6, 0.95, 1) + curl(0.36, 0.12, 0.06, 0.17, Math.PI - 0.6, 0.85, -1)
  return [
    ['path', { d, fill: body, class: 'wm-shine' }],
    ['path', { d: curls, fill: 'none', stroke: cut, 'stroke-width': f2(R * 0.11), 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}

// a four-point foil glint
function glintD(x, y, r) {
  const w = r * 0.26
  return `M${P(x, y - r)}Q${P(x + w * 0.35, y - w * 0.35)} ${P(x + r, y)}Q${P(x + w * 0.35, y + w * 0.35)} ${P(x, y + r)}` +
    `Q${P(x - w * 0.35, y + w * 0.35)} ${P(x - r, y)}Q${P(x - w * 0.35, y - w * 0.35)} ${P(x, y - r)}z`
}

// objects that hang get a cord, a knot and a silk tassel
const HANG = new Set(['red-lantern', 'chinese-knot', 'lucky-coin', 'paper-fan', 'firecracker-string', 'sky-lantern', 'lamp',
  'bell', 'bell-ring', 'bell-plus', 'tag', 'key', 'key-round', 'medal', 'award', 'bauble', 'jingle-bells', 'lunar-drum', 'gem', 'red-envelope'])
// a blossom where it means something (plus every Lunar New Year icon)
const BLOOM = new Set(['gift', 'gift-stack', 'party-popper', 'cake', 'balloon', 'sparkles', 'heart-gift', 'champagne-toast',
  'red-envelope', 'mandarin-orange', 'teapot', 'lunar-drum', 'dumpling'])

function tassel(mass, loops, kLoops) {
  // the hanging point: the lowest K ink near the vertical centre line of the object
  const [x0, , x1] = bboxOf(kLoops.length ? kLoops : loops)
  const cx0 = (x0 + x1) / 2
  let ax = null, ay = -1
  for (let dx = 0; dx <= 1.6; dx += 0.1) for (const sx of dx ? [cx0 - dx, cx0 + dx] : [cx0]) {
    for (let y = 22; y > 6; y -= 0.08) if (sAt(mass, sx, y) < 0) { if (y > ay + 0.3) { ay = y; ax = sx } break }
    if (ax !== null && dx > 0.6) break
  }
  if (ax === null) return null
  const top = ay - 0.15, len = 22.6 - top
  if (len < 3.1) return null
  // room: nothing below the anchor across the tassel's width
  for (let y = top + 0.5; y < 22.4; y += 0.1) for (const sx of [ax - 1, ax, ax + 1]) if (sAt(mass, sx, y) < 0.15) return null
  const k = Math.min(1, (len - 0.2) / 4.6)
  const knotY = top + 0.75 * k + 0.45, kr = 0.48 * Math.max(0.8, k)
  const capY = knotY + kr + 0.25, tw = 0.62 * Math.max(0.85, k), endY = Math.min(22.6, capY + 3.0 * k + 0.4)
  const flare = tw * 1.45
  const fringe = `M${P(ax - tw, capY)}H${num(ax + tw)}L${P(ax + flare, endY - 0.25)}Q${P(ax + flare * 0.5, endY + 0.1)} ${P(ax, endY - 0.1)}` +
    `Q${P(ax - flare * 0.5, endY + 0.1)} ${P(ax - flare, endY - 0.25)}z`
  const knot = `M${P(ax, knotY - kr)}L${P(ax + kr, knotY)}L${P(ax, knotY + kr)}L${P(ax - kr, knotY)}z`
  return [
    ['path', { d: `M${P(ax, top)}V${num(capY)}`, stroke: C.accent, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: fringe, fill: C.c1, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: `M${P(ax - tw - 0.12, capY - 0.05)}H${num(ax + tw + 0.12)}`, stroke: C.accent, 'stroke-width': 0.62, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: knot, fill: C.accent, stroke: C.ink, 'stroke-width': 0.26, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}

// ---------------------------------------------------------------------------
// people avatars: natural skin (c1 lit by tint, shaded by shadow), natural hair (c2), a lucky lacquer jacket (c4)
// with the paper-cut gold line inside it, ink features with catch-lights, the gold-foil rim round the figure.
// C is swapped for the call (synchronous, restored in finally) so every var() carries the person's defaults.
export function build(icon) {
  const pc = !icon.params && isPerson(icon) ? personColors(icon) : null
  if (!pc) return build0(icon)
  for (const [k, v] of Object.entries(pc)) C[k] = col(k).replace(DEFAULT[k], v)
  try { return person(icon) || build0(icon) } finally { Object.assign(C, C0) }
}

function person(icon) {
  const name = icon.name
  const id = n => `wg-lunar-${name}-${n}`, url = n => `url(#${id(n)})`
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { return null }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length || !mass) return null
  const pp = personPaint(icon, mass, loops, F)
  if (!pp.regions.length) return null
  const [x0, y0, x1, y1] = bboxOf(pp.outline.length ? pp.outline : loops)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const out = [['defs', {}, [
    // gold foil: banded diagonal shimmer (the rim, headphone cups)
    ['linearGradient', { id: id(1), x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    // soft light: the skin's light from above, its shade pooling low
    ['linearGradient', { id: id(2), x1: 0, y1: f2(y0), x2: 0, y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.tint, 0.5), st(0.35, C.tint, 0), st(0.62, C.shadow, 0), st(1, C.shadow, 0.38)]],
  ]]]
  for (const r of pp.regions) {
    out.push(['path', { d: loopsD(r.loops), fill: r.role === 'accent' ? url(1) : C[r.role], 'fill-rule': 'evenodd',
      stroke: C.ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: r.role === 'c1' ? 'wm-k' : 'wm-a' }])
  }
  const fig = pp.outline.length ? pp.outline : loops
  out.push(['path', { d: loopsD(fig), fill: url(2), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  if (pp.features.length) out.push(['path', { d: loopsD(pp.features), fill: C.ink, class: 'wm-k' }])
  // the paper-cut gold line inside the jacket
  try {
    const cl = pp.regions.filter(r => r.role === 'c4').flatMap(r => r.loops)
    if (cl.length) {
      const R = F.redistance(F.region(cl, 3), cl, 3)
      const gold = inner(R, 0.75, 0.45, 0.6).map(l => simplify(l, 0.03, true))
      if (gold.length) out.push(['path', { d: loopsD(gold), fill: 'none', stroke: C.accent, 'stroke-width': U.IN_W, 'stroke-linejoin': 'round', class: 'wm-shine' }])
    }
  } catch { /* no paper-cut line */ }
  out.push(['path', { d: loopsD(fig), fill: 'none', stroke: url(1), 'stroke-width': U.RIM, 'stroke-linejoin': 'round', class: 'wm-k' }])
  const cl = pp.eyes.map(e => discD(e.x + e.r * 0.3, e.y - e.r * 0.35, Math.max(0.2, Math.min(0.32, e.r * 0.4)))).join('')
  if (cl) out.push(['path', { d: cl, fill: C.shine, class: 'wm-shine' }])
  // a foil glint on the rim, upper left
  try {
    let g = null, gs = Infinity
    for (const l of fig) { if (area(l) >= 0) continue; for (const p of l) { const s = p[0] + p[1] * 1.15; if (s < gs) { gs = s; g = p } } }
    if (g) out.push(['path', { d: glintD(g[0] + 0.15, g[1] + 0.15, 0.95), fill: C.shine, class: 'wm-shine' }])
  } catch { /* no glint */ }
  return out
}

function build0(icon) {
  const name = icon.name || 'icon'
  const id = n => `wg-lunar-${name}-${n}`, url = n => `url(#${id(n)})`
  const T0 = tuneFor(name, icon.category)
  if (T0.noFills) icon = { ...icon, fills: [], fillSet: [], cutouts: [] }
  let plates = [], mass = null
  try { LAST.mass = null; plates = solidPlates(icon); mass = LAST.mass } catch { plates = []; mass = null }
  const loops = plates.flatMap(p => p.loops)
  if (!loops.length) return null
  const live = !!icon.params
  const [x0, y0, x1, y1] = live ? [3, 3, 21, 21] : bboxOf(loops)
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const defs = ['defs', {}, [
    // red lacquer: lit top, deep foot
    ['linearGradient', { id: id(0), x1: 0, y1: f2(y0), x2: 0, y2: f2(y1), gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
    // gold foil: banded diagonal shimmer
    ['linearGradient', { id: id(1), x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), gradientUnits: 'userSpaceOnUse' },
      [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
  ]]
  const out = [defs]
  const rim = { stroke: url(1), 'stroke-width': U.RIM, 'stroke-linejoin': 'round' }
  const kLoops = []
  // the body material: red lacquer (default), gold foil or jade
  const T = tuneFor(name, icon.category), mode = T.body || 'red'
  const M = mode === 'gold'
    ? { body: url(1), rim: C.c2, line: C.c2, part: C.c1, partLine: C.c2, signal: C.c3, cloud: C.c2, curl: C.accent }
    : mode === 'cream'
      ? { body: C.tint, rim: C.c2, line: C.c1, part: url(1), partLine: C.c2, signal: C.c1, cloud: C.c1, curl: C.tint }
      : { body: mode === 'jade' ? C.c3 : url(0), rim: url(1), line: C.accent, part: url(1), partLine: C.c2, signal: mode === 'jade' ? C.c1 : C.c3, cloud: C.accent, curl: mode === 'jade' ? C.c3 : C.c2 }
  if (T.parts === 'jade') { M.part = C.c3; M.partLine = C.ink }
  if (T.parts === 'red') { M.part = C.c1; M.partLine = C.c2 }
  if (T.parts === 'gold') { M.part = url(1); M.partLine = C.c2 }
  M.sRim = rim
  if (T.signal === 'gold') { M.signal = url(1); M.sRim = { stroke: C.c2, 'stroke-width': U.RIM_A, 'stroke-linejoin': 'round' } }
  if (T.signal === 'red') { M.signal = C.c1; M.sRim = { ...rim, stroke: mode === 'gold' ? C.c2 : url(1) } }
  for (const p of plates) {
    if (p.plate === 'K') kLoops.push(...p.loops)
    const d = loopsD(p.loops)
    if (!d) continue
    if (live) {
      out.push(['path', { d, fill: p.plate === 'S' ? C.c3 : C.c2, 'fill-rule': 'evenodd', class: p.plate === 'A' ? 'wm-a' : p.plate === 'S' ? 'wm-s' : 'wm-k' }])
      continue
    }
    if (p.plate === 'A') out.push(['path', { d, fill: M.part, 'fill-rule': 'evenodd', stroke: M.partLine, 'stroke-width': U.RIM_A, 'stroke-linejoin': 'round', class: 'wm-a' }])
    else if (p.plate === 'S') out.push(['path', { d, fill: M.signal, 'fill-rule': 'evenodd', ...M.sRim, class: 'wm-s' }])
    else out.push(['path', { d, fill: M.body, 'fill-rule': 'evenodd', ...rim, stroke: M.rim, class: 'wm-k' }])
  }
  if (live) {
    // the gold rim round the outside only (a rim round every knocked-out letter would close its counters)
    const holes = loops.filter(l => area(l) > 0)
    const outer = loops.filter(l => area(l) < 0 && !holes.some(h => pointInRing(l[0], h)))
    if (outer.length) out.push(['path', { d: loopsD(outer), fill: 'none', ...rim, class: 'wm-k' }])
    return out
  }
  if (!mass) return out
  let sdf = null
  try { sdf = F.redistance(mass, loops.map(l => simplify(l, 0.05, true)), U.DEEP) } catch { return out }
  // paper-cut border: a fine gold line inside broad red shapes
  try {
    const gold = inner(sdf, U.IN, U.IN_MIN).map(l => simplify(l, 0.03, true)).filter(l => {
      const [a, b, c, d] = bboxOf([l])
      return Math.min(c - a, d - b) >= U.IN_LOOP && inLoops(kLoops, l[0])
    })
    if (gold.length) out.push(['path', { d: loopsD(gold), fill: 'none', stroke: M.line, 'stroke-width': U.IN_W, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  } catch { /* no paper-cut line */ }
  // the cloud medallion in the deepest open part of the red body
  try {
    // the deepest point, then the most central point that is nearly as deep (a centred motif, not a stray one)
    let top = 0
    for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) { const v = -sdf[j * F.N + i]; if (v > top) top = v }
    const [kx0, ky0, kx1, ky1] = bboxOf(kLoops), mx = (kx0 + kx1) / 2, my = (ky0 + ky1) / 2 + 0.6
    let best = 0, bx = 12, by = 12, bs = Infinity
    const need = Math.max(top * 0.86, U.CLOUD_MIN + U.CLOUD_CLEAR)
    for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) {
      const v = -sdf[j * F.N + i]
      if (v < need) continue
      const x = i * F.H, y = j * F.H, sc = Math.hypot(x - mx, y - my) - v * 0.6
      if (sc < bs && inLoops(kLoops, [x, y])) { bs = sc; best = v; bx = x; by = y }
    }
    const R = Math.min(best - U.CLOUD_CLEAR, U.CLOUD_MAX)
    const host = kLoops.filter(l => area(l) < 0 && pointInRing([bx, by], l)).reduce((m, l) => Math.max(m, Math.abs(area(l))), 0)
    if (R >= U.CLOUD_MIN && host >= U.CLOUD_AREA && T.cloud !== false) {
      out.push(...cloud(bx - R * 0.08, by, R, M.cloud, M.curl))
    }
  } catch { /* no cloud */ }
  // a foil glint on the rim, upper left
  try {
    let g = null, gs = Infinity
    for (const l of kLoops) { if (area(l) >= 0) continue; for (const p of l) { const s = p[0] + p[1] * 1.15; if (s < gs) { gs = s; g = p } } }
    if (g && kLoops.length) out.push(['path', { d: glintD(g[0] + 0.15, g[1] + 0.15, 0.95), fill: C.shine, class: 'wm-shine' }])
  } catch { /* no glint */ }
  // tassel
  if (T.tassel ?? HANG.has(name)) {
    try { const t = tassel(mass, loops, kLoops); if (t) out.push(...t) } catch { /* no tassel */ }
  }
  // blossom
  if (T.bloom ?? BLOOM.has(name)) {
    try { const sp = blossomSpot(mass, loops); if (sp) out.push(...blossom(sp.x, sp.y, sp.r)) } catch { /* no blossom */ }
  }
  return out
}

// never render empty: the centrelines in red with the gold rim under them
export function fallback(icon) {
  const ps = (icon.paths || []).filter(p => p && p.d)
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.accent, 'stroke-width': 2.6, class: 'wm-k' }]),
    ...ps.map(p => ['path', { d: p.d, ...round, stroke: C.c1, 'stroke-width': 1.6, class: 'wm-k' }]),
  ]
}
