// forge/hand/glass/shield-check.mjs — the frosted glass shield with a bold check (wm-a, it nods) set into the pane in
// the deep colour of the body behind, like a window the colour glows through, instead of a faint hairline etch, so
// the tick survives at 16px on white and on dark.
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { N, NN, H, X0, maxFilter, contours, ringsToD, sample } from '../../styles/_glass-field.mjs'
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, simplify, fmt } from '../../kernel/geom.mjs'

// ---- drawing (skeleton coordinates, 24 grid) ----------------------------------------------------------------
const SHIELD_D = 'M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'
const SHIELD = { paths: [SHIELD_D], fills: [SHIELD_D], erode: 0.3 }
const CHECK = [[8.25, 12], [11, 14.75], [15.75, 9.5]]

// skeleton point -> the front pane's frame (the drawing's 0.94 scale, 0.5u up-left)
const fp = p => fmt(12 + (p[0] - 12) * G.SCALE - 0.5) + ' ' + fmt(12 + (p[1] - 12) * G.SCALE - 0.5)
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const out = paint([layers(glass(SHIELD))], 'shield-check', [''], { frost: 1, edge: 0.2 })
  const d = 'M' + CHECK.map(fp).join('L')
  // the tick: the body's own colour ramp (gradient 0) with a soft deep edge, and a fine light rim on its lit side
  out.push(['path', { d, stroke: V.etch, 'stroke-opacity': 0.3, 'stroke-width': 2.9, ...round, class: 'wm-a' }])
  out.push(['path', { d, stroke: 'url(#wg-glass-shield-check-0)', 'stroke-width': 2.3, ...round, class: 'wm-a' }])
  return out
}

// ---- glass engine: the style's own geometry (_glass-core) and paint recipe (_glass-soft), per piece --------
function glass(s) {
  const P = (s.paths || []).map((d, i) => ({ id: 'p' + i, d, plate: 'K' }))
  const lines = P.flatMap(p => parsePath(p.d).map(q => ({ pts: q.pts, closed: q.closed, plate: 'K' })))
  const fills = (s.fills || []).map(d => ({ subs: parsePath(d) }))
  const cutouts = (s.cutouts || []).map(d => ({ subs: parsePath(d) }))
  return build({ name: 'hand', paths: P, lines, fills, cutouts }, { r: s.r ?? G.R, shiftRod: s.shiftRod ?? 0.35, shiftMass: s.shift ?? 1.0, erodeMin: s.erode ?? 0.22, erodeMax: 0.4, noKeepOpen: true })
}
// the earlier piece gives way to the later one by a constant seam (both panes)
function seam(a, b, g) {
  for (const k of ['back', 'front']) { const fa = a[k], fb = b[k]; for (let i = 0; i < NN; i++) fa[i] = Math.min(fa[i], -(fb[i] + g)) }
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const f2 = v => +v.toFixed(2)
function bboxF(f) {
  let i0 = N, j0 = N, i1 = -1, j1 = -1
  for (let k = 0; k < NN; k++) if (f[k] > 0) { const i = k % N, j = (k - i) / N; if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j }
  return i1 < 0 ? null : [X0 + i0 * H, X0 + j0 * H, X0 + i1 * H, X0 + j1 * H]
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
  for (const l of lines) {
    const pts = l.pts.filter(p => sample(D, p[0], p[1]) > 0.62)
    if (pts.length < 2) continue
    const q = simplify(pts, 0.03, false).map(p => fmt(p[0]) + ' ' + fmt(p[1]))
    d += 'M' + q[0] + 'L' + q.slice(1).join('L')
  }
  return d
}
function layers(B) {
  const { rings, D } = exact(B.front, G.BAND)
  return { B, D, front: ringsToD(rings, 0.035), back: ringsToD(contours(B.back, 0), 0.05), rim: ringsToD(contours(rimField(D, 0.1, 0.34), 0), 0.04, 0.03), etch: etchD(B.etch || [], D) }
}
function paint(Ls, name, cls, o) {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${name}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops.map(([offset, c, op]) => ['stop', op == null ? { offset, 'stop-color': c } : { offset, 'stop-color': c, 'stop-opacity': op }])]; defs.push(g); return `url(#${g[1].id})` }
  const tag = (i, a, extra) => { const c = [cls[i], extra].filter(Boolean).join(' '); return c ? { ...a, class: c } : a }
  // the whole object is lit as one: one shadow, one colour ramp, one orb, one frost ramp
  const back = new Float32Array(NN).fill(-G.BAND), front = new Float32Array(NN).fill(-G.BAND)
  for (const L of Ls) for (let k = 0; k < NN; k++) { if (L.B.back[k] > back[k]) back[k] = L.B.back[k]; if (L.D[k] > front[k]) front[k] = L.D[k] }
  const sh = down(back, 5, -G.BAND)
  out.push(['path', { d: ringsToD(contours(sh, -0.9), 0.14, 0.05), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': ev, class: 'wm-shadow' }])
  out.push(['path', { d: ringsToD(contours(sh, -0.35), 0.1, 0.05), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': ev, class: 'wm-shadow' }])
  const [a, b, c, d] = bboxF(back)
  let sx = 0, sy = 0, m = 0
  for (let k = 0; k < NN; k++) if (back[k] > 0) { const i = k % N; sx += i; sy += (k - i) / N; m++ }
  const cx = X0 + sx / m * H, cy = X0 + sy / m * H, r = Math.max(3, Math.min(8, Math.sqrt(m * H * H) * 0.75))
  const g0 = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [[0, V.c1], [1, V.shadow]])
  const g1 = grad('radialGradient', { cx: f2((cx + c) / 2 + 0.2), cy: f2((cy + d) / 2 + 0.2), r: f2(r) }, [[0, V.accent, 0.6], [0.5, V.accent, 0.22], [1, V.accent, 0]])
  const [x0, y0, x1, y1] = bboxF(front), F = o.frost
  const g2 = grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [[0, V.frost, f2(0.6 * F)], [0.4, V.tint, f2(0.55 * F)], [1, V.tint, f2(0.42 * F)]])
  Ls.forEach((L, i) => { out.push(['path', tag(i, { d: L.back, fill: g0, 'fill-rule': ev })]); out.push(['path', tag(i, { d: L.back, fill: g1, 'fill-rule': ev })]) })
  Ls.forEach((L, i) => out.push(['path', tag(i, { d: L.front, fill: g2, stroke: 'currentColor', 'stroke-opacity': o.edge, 'stroke-width': 0.5, 'fill-rule': ev })]))
  Ls.forEach((L, i) => { if (L.etch) out.push(['path', tag(i, { d: L.etch, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
  Ls.forEach((L, i) => { if (L.rim) out.push(['path', tag(i, { d: L.rim, fill: V.shine, 'fill-opacity': 0.85 }, 'wm-shine')]) })
  return [['defs', {}, defs], ...out]
}
