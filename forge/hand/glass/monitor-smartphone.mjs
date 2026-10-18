// forge/hand/glass/monitor-smartphone.mjs — a frosted monitor (deep colour screen window, glass stand) with the phone
// as its own frosted pane in front, screen and chin like smartphone, set off the monitor by a clean notch; the
// generated drawing made the phone a flat hot-accent slab with no screen that outweighed the monitor, whose screen
// shrank to a sliver, so at 16px it read as a pink block on a box rather than two devices.
// Roles: back/shadow bodies, pane/frost glass, accent glow, shine rim. Motion: the phone pops (wm-s), monitor wm-k.
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { NN, N, H, X0, maxFilter, contours, ringsToD, sample } from '../../styles/_glass-field.mjs'
import { softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath, simplify, fmt, resample } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// ---- drawing (skeleton coordinates, 24 grid) ----------------------------------------------------------------
// the monitor: a landscape frame round a landscape screen, notched round the phone with a 3u gap so its colour body,
// set down-right, still clears the phone
const MON = 'M4 3.5 H18 A2 2 0 0 1 20 5.5 V7 H15.5 A2 2 0 0 0 13.5 9 V11.5 A2 2 0 0 1 11.5 13.5 H4 A2 2 0 0 1 2 11.5 V5.5 A2 2 0 0 1 4 3.5 Z'
const SCREEN = 'M4.75 5.25 H11.25 A1 1 0 0 1 12.25 6.25 V10.75 A1 1 0 0 1 11.25 11.75 H4.75 A1 1 0 0 1 3.75 10.75 V6.25 A1 1 0 0 1 4.75 5.25 Z'
// the stand: neck and foot as one solid glass piece of its own, standing on the monitor's bottom edge (never behind it)
const STAND = 'M7.25 13.5 H8.25 V19.5 H10.25 A0.75 0.75 0 0 1 11 20.25 A0.75 0.75 0 0 1 10.25 21 H5.25 A0.75 0.75 0 0 1 4.5 20.25 A0.75 0.75 0 0 1 5.25 19.5 H7.25 Z'
// the phone in front, lower right: screen window and a chin bar like smartphone
const PHONE = 'M18 10 H20 A1.5 1.5 0 0 1 21.5 11.5 V20 A1.5 1.5 0 0 1 20 21.5 H18 A1.5 1.5 0 0 1 16.5 20 V11.5 A1.5 1.5 0 0 1 18 10 Z'
const PSCREEN = 'M18.25 11.5 H19.75 A0.75 0.75 0 0 1 20.5 12.25 V17.25 A0.75 0.75 0 0 1 19.75 18 H18.25 A0.75 0.75 0 0 1 17.5 17.25 V12.25 A0.75 0.75 0 0 1 18.25 11.5 Z'
const CHIN = 'M18.5 19.75 H19.5'

function pane(icon, n0, cls, paint) {
  const L = layers(icon, { through: false }, paint)
  const { defs, out } = softPaint(L, 'monitor-smartphone')
  const re = s => typeof s === 'string' ? s.replace(/wg-glass-monitor-smartphone-(\d+)/g, (_, k) => `wg-glass-monitor-smartphone-${+k + n0}`) : s
  const fix = node => [node[0], Object.fromEntries(Object.entries(node[1]).map(([k, v]) => [k, re(v)])), ...(node[2] ? [node[2].map(fix)] : [])]
  return {
    defs: defs.map(fix),
    out: out.map(fix).map(([t, a]) => [t, a.class === 'wm-shadow' ? a : { ...a, class: a.class === 'wm-shine' ? `wm-shine ${cls}` : cls }]),
  }
}

export default function render() {
  const mon = pane(skel({ paths: [[MON, 'K']], fills: [MON], cutouts: [SCREEN] }), 0, 'wm-k', { edge: 0.26 })
  const st = pane(skel({ paths: [[STAND, 'K']], fills: [STAND], cutouts: [] }), mon.defs.length, 'wm-k', { edge: 0.26 })
  const ph = pane(skel({ paths: [[PHONE, 'K'], [CHIN, 'K']], fills: [PHONE], cutouts: [PSCREEN] }), mon.defs.length + st.defs.length, 'wm-s', { edge: 0.34 })
  const sh = n => n[1].class === 'wm-shadow'
  const all = [mon, st, ph]
  return [['defs', {}, all.flatMap(p => p.defs)], ...all.flatMap(p => p.out.filter(sh)), ...all.flatMap(p => p.out.filter(n => !sh(n)))]
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
