// GLASS soft paint (rich style): frosted glass in the macOS Big Sur / iOS 15 manner.
//
//   GLOW    a soft colour blob behind the object (radial gradient fading to clear), offset down-right
//   BACK    the object's colour body, offset down-right, a calm tonal gradient (c1 -> its shade)
//   PANE    the frosted body in front: white-to-tint gradient, translucent, so the colour behind shows soft
//   PARTS   plate A as a second, clearer layer of glass; plate S as small luminous accent badges
//   RIM     a fine light rim along the lit (top-left) edges, fading out
//   ETCH    interior detail etched on the pane in a deep ink; a currentColor hairline edges the pane
// Geometry comes from _glass-core.mjs (signed distance fields); this file only decides how it is painted.
import { build, exact, components, prune, G, LIGHT } from './_glass-core.mjs'
import { N, NN, H, X0, maxFilter, contours, ringsToD, sample } from './_glass-field.mjs'
import { simplify, fmt, resample } from '../kernel/geom.mjs'
import { tuneFor } from './_glass-tune.mjs'

export const V = {
  c1: 'var(--with-glass-back, #7484FF)',
  shadow: 'var(--with-glass-shadow, #6A45D6)',
  tint: 'var(--with-glass-pane, #E4E8FF)',
  frost: 'var(--with-glass-frost, #FFFFFF)',
  shine: 'var(--with-glass-shine, #FFFFFF)',
  accent: 'var(--with-glass-accent, #F2679E)',
  etch: 'var(--with-glass-etch, #3E3A8C)',
}
export const P = {
  SHIFT_ROD: 0.35, SHIFT_MASS: 1.0, ERODE_MIN: 0.3, ERODE_MAX: 0.4,
}

const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const f2 = v => +v.toFixed(2)
function bboxF(f, lvl = 0) {
  let i0 = N, j0 = N, i1 = -1, j1 = -1
  for (let k = 0; k < NN; k++) if (f[k] > lvl) { const i = k % N, j = (k - i) / N; if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j }
  if (i1 < 0) return null
  return [X0 + i0 * H, X0 + j0 * H, X0 + i1 * H, X0 + j1 * H]
}
function centroid(f) {
  let sx = 0, sy = 0, n = 0
  for (let k = 0; k < NN; k++) if (f[k] > 0) { const i = k % N, j = (k - i) / N; sx += i; sy += j; n++ }
  return n ? [X0 + sx / n * H, X0 + sy / n * H, n * H * H] : null
}
function shiftXY(f, di, dj, fillV) {
  const o = new Float32Array(NN).fill(fillV)
  for (let j = 0; j < N; j++) {
    const sj = j - dj; if (sj < 0 || sj >= N) continue
    for (let i = 0; i < N; i++) { const si = i - di; if (si >= 0 && si < N) o[j * N + i] = f[sj * N + si] }
  }
  return o
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx: f2(cx), cy: f2(cy), r: f2(r), gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// specular rim: a tapered sliver right inside the edge wherever the edge faces the light
function rimField(D, inset, width) {
  const TH = maxFilter(D, 12)
  const hl = new Float32Array(NN).fill(-1)
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i, v = D[k]
    if (v < inset - 0.05 || v > inset + width + 0.1) continue
    const gxv = D[k + 1] - D[k - 1], gyv = D[k + N] - D[k - N], gl = Math.hypot(gxv, gyv)
    if (gl < 1e-6) continue
    const fct = -(gxv * LIGHT[0] + gyv * LIGHT[1]) / gl
    const g = sstep(0.05, 0.8, fct)
    if (g <= 0) continue
    const w = Math.min(width, 0.3 * TH[k]) * g
    if (w < 0.05) continue
    hl[k] = Math.min(v - inset, inset + w - v)
  }
  prune(hl, 0.12)
  return hl
}

export function softLayers(icon) {
  const B = build(icon, { shiftRod: P.SHIFT_ROD, shiftMass: P.SHIFT_MASS, erodeMin: P.ERODE_MIN, erodeMax: P.ERODE_MAX })
  // the signals (plate S) are their own luminous badges: the main pane is the object without them
  let kf = B.front
  if (B.sPane) { kf = new Float32Array(NN); for (let k = 0; k < NN; k++) kf[k] = Math.min(B.front[k], -B.sPane[k]) }
  let { rings: frontRings, D } = exact(kf, G.BAND)
  if (!D && B.sPane) ({ rings: frontRings, D } = exact(B.front, G.BAND))
  if (!D) return null
  const T = tuneFor(icon.name)
  const L = { box: bboxF(D), frost: T.frost ?? 1, edge: T.edge ?? 0.2 }
  L.front = ringsToD(frontRings, 0.035)
  const back = B.back
  L.back = ringsToD(contours(back, 0), 0.05)
  const sh = shiftXY(back, 0, 5, -G.BAND)
  L.halo = [ringsToD(contours(sh, -0.35), 0.1, 0.05), ringsToD(contours(sh, -0.9), 0.14, 0.05)]
  L.backBox = bboxF(back)
  L.backC = centroid(back)
  L.backS = B.backS ? ringsToD(contours(B.backS, 0), 0.05) : ''
  // the attached parts: a clearer second layer of glass, inset a touch so the main pane's rim stays whole
  if (B.aPane) {
    const a = new Float32Array(NN)
    for (let k = 0; k < NN; k++) a[k] = Math.min(B.aPane[k], D[k] - 0.15)
    L.a = ringsToD(contours(a, 0), 0.05, 0.2)
  }
  if (B.sPane) {
    const s = exact(B.sPane, G.BAND)
    if (s.D) { L.s = ringsToD(s.rings, 0.04); L.sBox = bboxF(s.D); L.sRim = ringsToD(contours(rimField(s.D, 0.12, 0.3), 0), 0.05, 0.03) }
  }
  L.rim = T.noRim ? '' : ringsToD(contours(rimField(D, 0.1, 0.34), 0), 0.04, 0.03)
  L.etch = etchD(trimEtch(B.etch, D))
  return L
}

// etched detail stays on the glass: keep only the runs well inside the pane (round caps never poke out)
function trimEtch(lines, D) {
  const out = []
  for (const l of lines) {
    if (l.pts.length === 1) { if (sample(D, l.pts[0][0], l.pts[0][1]) > 0.5) out.push(l); continue }
    const P = resample(l.closed ? [...l.pts, l.pts[0]] : l.pts, 0.1).map(o => o.p)
    let run = []
    const flush = () => { if (run.length > 2) out.push({ pts: run, closed: false }); run = [] }
    for (const p of P) { if (sample(D, p[0], p[1]) > 0.62) run.push(p); else flush() }
    if (run.length === P.length && l.closed) { out.push({ pts: l.pts, closed: true }); run = [] } else flush()
  }
  return out
}

function etchD(lines) {
  let d = ''
  for (const l of lines) {
    const pts = l.pts.length > 2 ? simplify(l.pts, 0.03, l.closed) : l.pts
    if (!pts.length) continue
    const q = p => fmt(p[0]) + ' ' + fmt(p[1])
    d += 'M' + q(pts[0]) + (pts.length === 1 ? 'h0' : 'L' + pts.slice(1).map(q).join('L')) + (l.closed ? 'Z' : '')
  }
  return d
}

export function softPaint(L, name) {
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`, url = g => `url(#${g[1].id})`
  const defs = [], out = []
  const ev = 'evenodd'
  const [x0, y0, x1, y1] = L.box
  // shadow: a very soft diffuse shadow under the colour body (stacked, fading dilations)
  if (L.halo) {
    if (L.halo[1]) out.push(['path', { d: L.halo[1], fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': ev, class: 'wm-shadow' }])
    if (L.halo[0]) out.push(['path', { d: L.halo[0], fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': ev, class: 'wm-shadow' }])
  }
  // back: the colour body, a calm tonal gradient, with a soft orb of accent light inside it (radial, fading to clear):
  // seen through the frosted pane it reads as blurred colour
  if (L.back) {
    const [a, b, c, d] = L.backBox || L.box
    const g0 = lin(id(), a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
    defs.push(g0)
    out.push(['path', { d: L.back, fill: url(g0), 'fill-rule': ev }])
    const [cx, cy, area] = L.backC
    const r = Math.max(3, Math.min(8, Math.sqrt(area) * 0.75))
    const bx = (cx + c) / 2 + 0.2, by = (cy + d) / 2 + 0.2
    const g1 = rad(id(), bx, by, r, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
    defs.push(g1)
    out.push(['path', { d: L.back, fill: url(g1), 'fill-rule': ev }])
  }
  if (L.backS) out.push(['path', { d: L.backS, fill: V.accent, 'fill-opacity': 0.85, 'fill-rule': ev, class: 'wm-s' }])
  // pane: frosted, tinted, translucent; a hairline in currentColor gives it an edge on white
  const g2 = lin(id(), x0, y0, x1, y1, [stop(0, V.frost, f2(0.6 * L.frost)), stop(0.4, V.tint, f2(0.55 * L.frost)), stop(1, V.tint, f2(0.42 * L.frost))])
  defs.push(g2)
  out.push(['path', { d: L.front, fill: url(g2), stroke: 'currentColor', 'stroke-opacity': L.edge, 'stroke-width': 0.5, 'fill-rule': ev }])
  if (L.a) out.push(['path', { d: L.a, fill: V.frost, 'fill-opacity': 0.35, 'fill-rule': ev }])
  if (L.etch) out.push(['path', { d: L.etch, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
  if (L.s) {
    const [a, b, c, d] = L.sBox
    const g4 = lin(id(), a, b, (a + c) / 2, d, [stop(0, V.shine, 0.7), stop(1, V.shine, 0)])
    defs.push(g4)
    out.push(['path', { d: L.s, fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.4, class: 'wm-s' }])
    out.push(['path', { d: L.s, fill: url(g4), 'fill-rule': ev, class: 'wm-s' }])
    if (L.sRim) out.push(['path', { d: L.sRim, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-s' }])
  }
  if (L.rim) out.push(['path', { d: L.rim, fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return { defs, out }
}

export function renderSoft(icon) {
  const L = softLayers(icon)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  return [['defs', {}, defs], ...out]
}
