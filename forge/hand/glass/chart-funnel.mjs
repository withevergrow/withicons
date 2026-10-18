// forge/hand/glass/chart-funnel.mjs — the funnel chart as three stacked slabs of glass, each narrower than the one
// above, set apart by clear gaps. The generated drawing was one pale frosted silhouette whose stages were only two
// faint etched lines, so at 16px it melted into a grey blob on white; here every stage is its own pane with its own
// colour body glowing through, so the stepped funnel holds at 24px and 16px.
import { build, exact, prune, G, LIGHT } from '../../styles/_glass-core.mjs'
import { N, NN, H, X0, maxFilter, contours, ringsToD, sample } from '../../styles/_glass-field.mjs'
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, simplify, fmt } from '../../kernel/geom.mjs'

// ---- drawing (skeleton coordinates, 24 grid; fills sized to Line's outer edge) -----------------------------------
// one continuous V-taper cut into three bands: each band is a trapezoid, corners softened
const K = 7.5 / 19, xl = y => 2 + (y - 2.5) * K, xr = y => 22 - (y - 2.5) * K
// a polygon with every corner rounded (a quadratic through the corner, r along each edge)
const roundPoly = (P, r) => {
  const q = v => +v.toFixed(2), at = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  let d = ''
  P.forEach((c, i) => {
    const a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length]
    const la = Math.hypot(c[0] - a[0], c[1] - a[1]), lb = Math.hypot(b[0] - c[0], b[1] - c[1])
    const p0 = at(c, a, Math.min(0.45, r / la)), p1 = at(c, b, Math.min(0.45, r / lb))
    d += (i ? 'L' : 'M') + q(p0[0]) + ' ' + q(p0[1]) + 'Q' + q(c[0]) + ' ' + q(c[1]) + ' ' + q(p1[0]) + ' ' + q(p1[1])
  })
  return d + 'Z'
}
const band = (y0, y1) => roundPoly([[xl(y0), y0], [xr(y0), y0], [xr(y1), y1], [xl(y1), y1]], 1.6)
const TOP = { fills: [band(2.5, 8)] }
const MID = { fills: [band(9.5, 14.75)] }
const LOW = { fills: [band(16.25, 21.5)] }

export default function render() {
  const pieces = [TOP, MID, LOW].map(s => ({ B: glass({ shift: 0.7, erodeMax: 0.35, ...s }), mode: 'glass', cls: 'wm-k' }))
  return paint(pieces, 'chart-funnel', { frost: 0.9, edge: 0.22 })
}

// ---- glass engine: the style's own geometry (_glass-core) and paint recipe (_glass-soft), per piece --------------
function glass(s) {
  const P = (s.paths || []).map((d, i) => ({ id: 'p' + i, d, plate: 'K' }))
  const lines = P.flatMap(p => parsePath(p.d).map(q => ({ pts: q.pts, closed: q.closed, plate: 'K' })))
  const fills = (s.fills || []).map(d => ({ subs: parsePath(d) }))
  const cutouts = (s.cutouts || []).map(d => ({ subs: parsePath(d) }))
  return build({ name: 'hand', paths: P, lines, fills, cutouts }, {
    r: s.r ?? G.R, shiftRod: s.shiftRod ?? 0.35, shiftMass: s.shift ?? 1.0, erodeMin: s.erode ?? 0.25, erodeMax: s.erodeMax ?? 0.4,
    noKeepOpen: true, noParting: true, keepInterior: true, through: s.through ?? false,
  })
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
function paint(pieces, name, o) {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${name}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops.map(([offset, c, op]) => ['stop', op == null ? { offset, 'stop-color': c } : { offset, 'stop-color': c, 'stop-opacity': op }])]; defs.push(g); return `url(#${g[1].id})` }
  const tag = (p, a, extra) => { const c = [p.cls, extra].filter(Boolean).join(' '); return c ? { ...a, class: c } : a }
  for (const p of pieces) {
    const { rings, D } = exact(p.B.front, G.BAND)
    p.D = D; p.front = ringsToD(rings, 0.035)
    if (p.mode === 'glass') { p.back = ringsToD(contours(p.B.back, 0), 0.05); p.rim = ringsToD(contours(rimField(D, 0.1, 0.34), 0), 0.04, 0.03); p.etch = etchD(p.B.etch || [], D) }
    else { p.box = bboxF(D); p.rim = ringsToD(contours(rimField(D, 0.12, 0.3), 0), 0.05, 0.03) }
  }
  const G1 = pieces.filter(p => p.mode === 'glass'), A1 = pieces.filter(p => p.mode !== 'glass')
  // one object, lit as one: one soft shadow, one colour ramp, one accent orb, one frost ramp
  const back = new Float32Array(NN).fill(-G.BAND), front = new Float32Array(NN).fill(-G.BAND), cast = new Float32Array(NN).fill(-G.BAND)
  for (const p of G1) for (let k = 0; k < NN; k++) { if (p.B.back[k] > back[k]) back[k] = p.B.back[k]; if (p.D[k] > front[k]) front[k] = p.D[k] }
  for (let k = 0; k < NN; k++) cast[k] = back[k]
  for (const p of A1) for (let k = 0; k < NN; k++) if (p.D[k] > cast[k]) cast[k] = p.D[k]
  const sh = down(cast, 5, -G.BAND)
  out.push(['path', { d: ringsToD(contours(sh, -0.9), 0.14, 0.05), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': ev, class: 'wm-shadow' }])
  out.push(['path', { d: ringsToD(contours(sh, -0.35), 0.1, 0.05), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': ev, class: 'wm-shadow' }])
  if (G1.length) {
    const [a, b, c, d] = bboxF(back)
    let sx = 0, sy = 0, m = 0
    for (let k = 0; k < NN; k++) if (back[k] > 0) { const i = k % N; sx += i; sy += (k - i) / N; m++ }
    const cx = X0 + sx / m * H, cy = X0 + sy / m * H, r = Math.max(3, Math.min(8, Math.sqrt(m * H * H) * 0.75))
    const g0 = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [[0, V.c1], [1, V.shadow]])
    const g1 = grad('radialGradient', { cx: f2((cx + c) / 2 + 0.2), cy: f2((cy + d) / 2 + 0.2), r: f2(r) }, [[0, V.accent, 0.6], [0.5, V.accent, 0.22], [1, V.accent, 0]])
    const [x0, y0, x1, y1] = bboxF(front), F = o.frost
    const g2 = grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [[0, V.frost, f2(0.6 * F)], [0.4, V.tint, f2(0.55 * F)], [1, V.tint, f2(0.42 * F)]])
    G1.forEach(p => { out.push(['path', tag(p, { d: p.back, fill: g0, 'fill-rule': ev })]); out.push(['path', tag(p, { d: p.back, fill: g1, 'fill-rule': ev })]) })
    G1.forEach(p => out.push(['path', tag(p, { d: p.front, fill: g2, stroke: 'currentColor', 'stroke-opacity': o.edge, 'stroke-width': 0.5, 'fill-rule': ev })]))
    G1.forEach(p => { if (p.etch) out.push(['path', tag(p, { d: p.etch, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
  }
  // signals: small luminous accent glass with a specular sheen and a lit rim (as _glass-soft paints plate S)
  A1.forEach(p => {
    const [a, b, c, d] = p.box
    const gs = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2((a + c) / 2), y2: f2(d) }, [[0, V.shine, 0.7], [1, V.shine, 0]])
    out.push(['path', tag(p, { d: p.front, fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.4 })])
    out.push(['path', tag(p, { d: p.front, fill: gs, 'fill-rule': ev })])
    if (p.rim) out.push(['path', tag(p, { d: p.rim, fill: V.shine, 'fill-opacity': 0.9 })])
  })
  // the lit rim: wm-shine on the body; a moving part's rim moves with it
  G1.forEach(p => { if (p.rim) out.push(['path', { d: p.rim, fill: V.shine, 'fill-opacity': 0.85, class: p.cls && p.cls !== 'wm-k' ? p.cls : 'wm-shine' }]) })
  return [['defs', {}, defs], ...out]
}
