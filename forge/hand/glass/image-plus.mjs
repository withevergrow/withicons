// forge/hand/glass/image-plus.mjs - the picture as one whole frosted frame with a clear mountain and sun cut in as deep colour
// windows (as on image), and a luminous accent badge in the lower-right corner carrying a crisp frost plus; the generated drawing
// left the badge a blank disc and the picture a generic tile. Roles: back/shadow body, pane/frost glass, accent badge, shine rim.
// Motion: frame wm-k, badge wm-s.
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { NN, N, H, X0, maxFilter, contours, ringsToD, sample } from '../../styles/_glass-field.mjs'
import { softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath, simplify, fmt, resample } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// ---- drawing (skeleton coordinates, 24 grid) --------------------------------------------------------------------
const FRAME = 'M4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H4 A2 2 0 0 1 2 18 V6 A2 2 0 0 1 4 4 Z'
// the mountain low-left, the sun high-right; the badge takes the lower-right corner
const HILL = 'M3.6 17.4 L6.4 13.4 A1.2 1.2 0 0 1 8.3 13.4 L11.2 18.4 H4.8 A1.2 1.2 0 0 1 3.6 17.4 Z'
const SUN = 'M18.4 8.2 A2.1 2.1 0 1 1 14.2 8.2 A2.1 2.1 0 1 1 18.4 8.2 Z'
const BADGE = 'M22 17.6 A4.5 4.5 0 1 1 13 17.6 A4.5 4.5 0 1 1 22 17.6 Z'

export default function render() {
  const icon = skel({ paths: [[FRAME, 'K'], [BADGE, 'S']], fills: [FRAME, BADGE], cutouts: [HILL, SUN] })
  const L = layers(icon, { noParting: true, through: false }, { frost: 0.9, edge: 0.28 })
  const { defs, out } = softPaint(L, 'image-plus')
  const bar = (d, w, stroke, extra = {}) => ['path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra, class: 'wm-s' }]
  const plus = 'M17.5 15.2 V20 M15.1 17.6 H19.9'
  const glint = d => ['path', { d, fill: 'none', stroke: 'var(--with-glass-shine, #FFFFFF)', 'stroke-opacity': '0.8', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-a' }]
  return [['defs', {}, defs], ...out,
    glint('M4.9 16 L6.3 14.1'), glint('M15.3 7.5 Q15.6 6.8 16.3 6.6'),
    bar(plus, '1.7', 'var(--with-glass-frost, #FFFFFF)', { 'stroke-opacity': '0.98' })]
}

// ---- a prepared skeleton (as forge/lib/load.mjs prepares one) ------------------------------------------------
function skel({ paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'hand', paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

// ---- the style's own layering (_glass-soft softLayers), with this drawing's build options ---------------------
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
function bboxF(f) {
  let i0 = N, j0 = N, i1 = -1, j1 = -1
  for (let k = 0; k < NN; k++) if (f[k] > 0) { const i = k % N, j = (k - i) / N; if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j }
  return i1 < 0 ? null : [X0 + i0 * H, X0 + j0 * H, X0 + i1 * H, X0 + j1 * H]
}
function centroid(f) {
  let sx = 0, sy = 0, n = 0
  for (let k = 0; k < NN; k++) if (f[k] > 0) { const i = k % N; sx += i; sy += (k - i) / N; n++ }
  return n ? [X0 + sx / n * H, X0 + sy / n * H, n * H * H] : null
}
function down(f, dj, fillV) {
  const o = new Float32Array(NN).fill(fillV)
  for (let j = dj; j < N; j++) for (let i = 0; i < N; i++) o[j * N + i] = f[(j - dj) * N + i]
  return o
}
function rimField(D, inset, width) {
  const TH = maxFilter(D, 12), hl = new Float32Array(NN).fill(-1)
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i, v = D[k]
    if (v < inset - 0.05 || v > inset + width + 0.1) continue
    const gx = D[k + 1] - D[k - 1], gy = D[k + N] - D[k - N], gl = Math.hypot(gx, gy)
    if (gl < 1e-6) continue
    const g = sstep(0.05, 0.8, -(gx * LIGHT[0] + gy * LIGHT[1]) / gl)
    if (g <= 0) continue
    const w = Math.min(width, 0.3 * TH[k]) * g
    if (w < 0.05) continue
    hl[k] = Math.min(v - inset, inset + w - v)
  }
  prune(hl, 0.12)
  return hl
}
function etchD(lines, D) {
  let d = ''
  const q = p => fmt(p[0]) + ' ' + fmt(p[1])
  for (const l of lines) {
    const P = resample(l.closed ? [...l.pts, l.pts[0]] : l.pts, 0.1).map(o => o.p)
    let run = []
    const flush = () => { if (run.length > 2) { const s = simplify(run, 0.03, false); d += 'M' + q(s[0]) + 'L' + s.slice(1).map(q).join('L') } run = [] }
    for (const p of P) { if (sample(D, p[0], p[1]) > 0.62) run.push(p); else flush() }
    flush()
  }
  return d
}
function layers(icon, opt, paint = {}) {
  const B = build(icon, { shiftRod: 0.35, shiftMass: 1.0, erodeMin: 0.3, erodeMax: 0.4, ...opt })
  let kf = B.front
  if (B.sPane) { kf = new Float32Array(NN); for (let k = 0; k < NN; k++) kf[k] = Math.min(B.front[k], -B.sPane[k]) }
  const { rings, D } = exact(kf, G.BAND)
  const L = { box: bboxF(D), frost: paint.frost ?? 1, edge: paint.edge ?? 0.2, front: ringsToD(rings, 0.035) }
  L.back = ringsToD(contours(B.back, 0), 0.05)
  const sh = down(B.back, 5, -G.BAND)
  L.halo = [ringsToD(contours(sh, -0.35), 0.1, 0.05), ringsToD(contours(sh, -0.9), 0.14, 0.05)]
  L.backBox = bboxF(B.back)
  L.backC = centroid(B.back)
  L.backS = B.backS ? ringsToD(contours(B.backS, 0), 0.05) : ''
  if (B.aPane && !paint.noA) {
    const a = new Float32Array(NN)
    for (let k = 0; k < NN; k++) a[k] = Math.min(B.aPane[k], D[k] - 0.15)
    L.a = ringsToD(contours(a, 0), 0.05, 0.2)
  }
  if (B.sPane) {
    const s = exact(B.sPane, G.BAND)
    if (s.D) { L.s = ringsToD(s.rings, 0.04); L.sBox = bboxF(s.D); L.sRim = ringsToD(contours(rimField(s.D, 0.12, 0.3), 0), 0.05, 0.03) }
  }
  L.rim = ringsToD(contours(rimField(D, 0.1, 0.34), 0), 0.04, 0.03)
  L.etch = etchD(B.etch, D)
  return L
}
