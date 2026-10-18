// forge/hand/glass/sun-dim.mjs — the dimmed sun as a full frosted disc with eight short, slim beads of tinted glass
// set well clear of it; the generated rays were fat stubs each dragging its own dark offset body, so the ring of
// sixteen blobs crowded a small core and read as a gear or a virus at 16px. Core and rays share one light and palette.
// Roles: back/shadow bodies, pane/frost glass, accent glow, shine rim. Motion: the sun breathes (core wm-k, rays wm-a).
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { NN, N, H, X0, maxFilter, contours, ringsToD, sample } from '../../styles/_glass-field.mjs'
import { softPaint, V } from '../../styles/_glass-soft.mjs'
import { parsePath, simplify, fmt, resample, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet, differenceSets, erode, dilate, translateSet } from '../../kernel/bool.mjs'

// ---- drawing (skeleton coordinates, 24 grid) ----------------------------------------------------------------
const CORE = 'M16.5 12 A4.5 4.5 0 1 1 7.5 12 A4.5 4.5 0 1 1 16.5 12 Z'
const RAYS = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  return [[12 + c * 7.6, 12 + s * 7.6], [12 + c * 8.4, 12 + s * 8.4]]
})

const K = G.SCALE
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const Dd = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, 0.22, 0.34)) }

export default function render() {
  // the core: glass's own frosted mass
  const L = layers(skel({ paths: [[CORE, 'K']], fills: [CORE], cutouts: [] }), {}, { edge: 0.26 })
  const { defs, out } = softPaint(L, 'sun-dim')
  for (const n of out) if (!n[1].class) n[1] = { ...n[1], class: 'wm-k' }
  // the rays: short rods of tinted glass (the colour body right behind a thin frost), like paperclip's wire
  let n = defs.length
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-sun-dim-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const body = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.frost, 0.5), stop(0.4, V.tint, 0.38), stop(1, V.tint, 0.26)])
  const rods = unionSets(RAYS.map(r => roundStrokeSet(r, 2.15)))
  const F = place(rods, -0.3), B = place(unionSets(RAYS.map(r => roundStrokeSet(r, 1.95))), 0.2)
  const sh = translateSet(B, 0, 0.4)
  const rays = [
    ['path', { d: Dd(dilate(sh, 0.3)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: Dd(B), fill: body, class: 'wm-a' }],
    ['path', { d: Dd(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, class: 'wm-a' }],
    ['path', { d: Dd(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine wm-a' }],
  ]
  const shadows = out.filter(x => x[1].class === 'wm-shadow'), rest = out.filter(x => x[1].class !== 'wm-shadow')
  return [['defs', {}, defs], ...shadows, rays[0], ...rays.slice(1), ...rest]
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
