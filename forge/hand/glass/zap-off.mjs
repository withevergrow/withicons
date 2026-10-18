// forge/hand/glass/zap-off.mjs — the bolt as one clear zigzag pane, the slash a thin separate rod cut through it by a seam.
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { N, NN, H, X0, maxFilter, contours, ringsToD } from '../../styles/_glass-field.mjs'
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'

export default function render() {
  const P = [glass({ paths: ['M15 1 L5 14 H11.5 L9 23 L19 10 H12.5 L15 1 Z'], fills: ['M15 1 L5 14 H11.5 L9 23 L19 10 H12.5 L15 1 Z'] }, { erodeMax: 0.8, erodeMin: 0.3 }), glass({ paths: ['M3 3 L21 21'] }, { r: 1.2 })]
  seam(P[0], P[1], 1.4)
  const L = P.map(layers); 
  return paint(L, 'zap-off', ['', 'wm-a'], { frost: 0.6, edge: 0.32 })
}

// ---- glass engine: the style's own geometry (_glass-core) and paint recipe (_glass-soft), per piece --------
function glass(s, opt = {}) {
  const paths = s.paths.map((p, i) => { const [d, plate] = Array.isArray(p) ? p : [p, 'K']; return { id: 'p' + i, d, plate, subs: parsePath(d) } })
  const lines = paths.flatMap(p => p.subs.map(q => ({ pts: q.pts, closed: q.closed, plate: p.plate })))
  const fills = (s.fills || []).map(d => ({ d, subs: parsePath(d), set: [] }))
  return build({ paths, lines, fills, cutouts: [] }, { shiftRod: 0.35, shiftMass: 1.0, erodeMin: 0.1, r: 1.5, erodeMax: 0.4, ...opt })
}
// the earlier piece gives way to the later one by a constant seam (both panes)
function seam(a, b, g) {
  for (const k of ['back', 'front', 'aPane']) { const fa = a[k], fb = b[k]; if (!fa || !fb) continue; for (let i = 0; i < NN; i++) fa[i] = Math.min(fa[i], -(fb[i] + g)) }
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const f2 = v => +v.toFixed(2)
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
function layers(B) {
  const { rings, D } = exact(B.front, G.BAND)
  return { B, box: bboxF(D), front: ringsToD(rings, 0.035), back: ringsToD(contours(B.back, 0), 0.05), backBox: bboxF(B.back), backC: centroid(B.back), rim: ringsToD(contours(rimField(D, 0.1, 0.34), 0), 0.04, 0.03), a: B.aPane ? ringsToD(contours(B.aPane.map((v, k) => Math.min(v, D[k] - 0.15)), 0), 0.05, 0.2) : '' }
}
function paint(Ls, name, cls, o) {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${name}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops.map(([offset, c, op]) => ['stop', op == null ? { offset, 'stop-color': c } : { offset, 'stop-color': c, 'stop-opacity': op }])]; defs.push(g); return `url(#${g[1].id})` }
  const tag = (i, a) => cls[i] ? { ...a, class: cls[i] } : a
  // one soft shadow under every piece
  const all = new Float32Array(NN).fill(-G.BAND)
  for (const L of Ls) for (let k = 0; k < NN; k++) if (L.B.back[k] > all[k]) all[k] = L.B.back[k]
  const sh = down(all, 5, -G.BAND)
  out.push(['path', { d: ringsToD(contours(sh, -0.9), 0.14, 0.05), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': ev, class: 'wm-shadow' }])
  out.push(['path', { d: ringsToD(contours(sh, -0.35), 0.1, 0.05), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': ev, class: 'wm-shadow' }])
  // colour bodies behind, each with its soft orb of accent light
  Ls.forEach((L, i) => {
    const [a, b, c, d] = L.backBox
    out.push(['path', tag(i, { d: L.back, fill: grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [[0, V.c1], [1, V.shadow]]), 'fill-rule': ev })])
    const [cx, cy, area] = L.backC, r = Math.max(3, Math.min(8, Math.sqrt(area) * 0.75))
    out.push(['path', tag(i, { d: L.back, fill: grad('radialGradient', { cx: f2((cx + c) / 2 + 0.2), cy: f2((cy + d) / 2 + 0.2), r: f2(r) }, [[0, V.accent, 0.6], [0.5, V.accent, 0.22], [1, V.accent, 0]]), 'fill-rule': ev })])
  })
  // frosted panes in front, a currentColor hairline edge, the light rim on the lit edges
  Ls.forEach((L, i) => {
    const [x0, y0, x1, y1] = L.box, F = o.frost
    out.push(['path', tag(i, { d: L.front, fill: grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [[0, V.frost, f2(0.6 * F)], [0.4, V.tint, f2(0.55 * F)], [1, V.tint, f2(0.42 * F)]]), stroke: 'currentColor', 'stroke-opacity': o.edge, 'stroke-width': 0.5, 'fill-rule': ev })])
  })
  Ls.forEach((L, i) => { if (L.a) out.push(['path', tag(i, { d: L.a, fill: V.frost, 'fill-opacity': 0.35, 'fill-rule': ev })]) })
  Ls.forEach((L, i) => { if (L.rim) out.push(['path', { d: L.rim, fill: V.shine, 'fill-opacity': 0.85, class: cls[i] ? cls[i] + ' wm-shine' : 'wm-shine' }]) })
  return [['defs', {}, defs], ...out]
}
