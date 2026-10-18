// forge/hand/gloss/holly.mjs — two big spiky holly leaves in a V with a carved midrib each, under three bold round
// berries set apart on a clear gap. The generated drawing inflated the toothed leaf outlines into scalloped lumps and
// fused the berries into one knob, so the sprig read as a tangle; here every tooth stays a crisp point, the leaves
// are one pillowy mass and each berry is its own glossy bead (wm-a, they bob), lit from the upper left like the family.
import { N, NN, gx, segsOf, distField, evenOddMask, contours, ringsToD } from '../../styles/_gloss-field.mjs'
import { parsePath } from '../../kernel/geom.mjs'

// ---- the gloss kit: signed fields (inside > 0) on the style's own grid, carved highlights, one light ----------
const BAND = 4.2, RIM = 0.5, LL = Math.hypot(0.55, 0.835), LX = -0.55 / LL, LY = -0.835 / LL
const fld = v => new Float32Array(NN).fill(v)
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const ci = v => Math.max(1, Math.min(N - 2, Math.round((v + 0.8) / 0.1)))
const disc = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
function area(d) {
  const rs = parsePath(d, 0.1).map(s => s.pts).filter(r => r.length > 2)
  const m = evenOddMask(rs), df = distField(segsOf(rs.map(pts => ({ pts, closed: true }))), BAND), f = fld(0)
  for (let k = 0; k < NN; k++) f[k] = m[k] ? df[k] : -df[k]
  return f
}
function tube(d, r) {
  const df = distField(segsOf(parsePath(d, 0.1).map(s => ({ pts: s.pts, closed: s.closed }))), BAND), f = fld(0)
  for (let k = 0; k < NN; k++) f[k] = r - df[k]
  return f
}
function union(...fs) { const o = Float32Array.from(fs[0]); for (const f of fs.slice(1)) for (let k = 0; k < NN; k++) if (f[k] > o[k]) o[k] = f[k]; return o }
function cut(a, b, gap = 0) { const o = Float32Array.from(a); for (let k = 0; k < NN; k++) { const v = -b[k] - gap; if (v < o[k]) o[k] = v } return o }
function level(f, lvl) {
  const D = distField(segsOf(contours(f, lvl).map(pts => ({ pts, closed: true }))), BAND), o = fld(0)
  for (let k = 0; k < NN; k++) o[k] = f[k] > lvl ? D[k] : -D[k]
  return o
}
const closing = (f, r) => level(level(f, -r), r)     // inner corners rounded by r
const opening = (f, r) => level(level(f, r), -r)     // outer corners rounded by r
// carve a disc of highlight, never closer than RIM to the body's edge
function splat(hl, d, x, y, r) {
  for (let j = ci(y - r - 0.3); j <= ci(y + r + 0.3); j++) for (let i = ci(x - r - 0.3); i <= ci(x + r + 0.3); i++) {
    const k = j * N + i, v = Math.max(Math.hypot(gx(i) - x, gx(j) - y) - r, RIM - d[k])
    if (v < hl[k]) hl[k] = v
  }
}
// a tapered bean along a path: tips BT, belly w
function bean(hl, d, path, w, BT = 0.16) {
  const P = [], L = [0]
  for (const s of parsePath(path, 0.05)) for (const p of s.pts) {
    const a = P[P.length - 1], n = a ? Math.ceil(Math.hypot(p[0] - a[0], p[1] - a[1]) / 0.05) : 1
    for (let q = 1; q <= n; q++) P.push(a ? [a[0] + (p[0] - a[0]) * q / n, a[1] + (p[1] - a[1]) * q / n] : p)
  }
  for (let q = 1; q < P.length; q++) L.push(L[q - 1] + Math.hypot(P[q][0] - P[q - 1][0], P[q][1] - P[q - 1][1]))
  const T = L[L.length - 1] || 1
  P.forEach((p, q) => splat(hl, d, p[0], p[1], BT + (w - BT) * Math.pow(Math.sin(Math.PI * L[q] / T), 0.5)))
}
// reflected light: a hairline 0.5u inside the shadow-side silhouette (sil = the form before cutouts)
function rim(hl, d, sil, ok = () => true) {
  const r = fld(9)
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i, sv = sil[k]
    if (sv < 0.2 || sv > 0.9 || d[k] < 0.25 || !ok(gx(i), gx(j))) continue
    const ox = sil[k - 1] - sil[k + 1], oy = sil[k - N] - sil[k + N], ol = Math.hypot(ox, oy)
    if (ol < 1e-6) continue
    const g = sstep(0.3, 0.8, -(ox * LX + oy * LY) / ol)
    if (g > 0) r[k] = Math.abs(sv - 0.5) - 0.15 * g + 0.02
  }
  prune(r, d, 0.45)
  for (let k = 0; k < NN; k++) if (r[k] < hl[k]) hl[k] = r[k]
}
function prune(h, d, minArea) {
  const seen = new Uint8Array(NN), st = []
  for (let k = 0; k < NN; k++) {
    if (seen[k] || !(h[k] < 0 && d[k] > 0)) continue
    const list = []; seen[k] = 1; st.push(k)
    while (st.length) {
      const c = st.pop(); list.push(c)
      for (const q of [c - 1, c + 1, c - N, c + N]) if (q >= 0 && q < NN && !seen[q] && h[q] < 0 && d[q] > 0) { seen[q] = 1; st.push(q) }
    }
    if (list.length * 0.01 < minArea) for (const c of list) h[c] = 9
  }
}
function paint(d, hl, cls) {
  const s = new Float32Array(NN)
  for (let k = 0; k < NN; k++) s[k] = Math.min(d[k], hl[k])
  const p = ringsToD(contours(s, 0))
  return p ? [['path', { d: p, 'fill-rule': 'evenodd', class: cls }]] : []
}
const f2 = v => Math.round(v * 100) / 100



// ---- holly ---------------------------------------------------------------------------------------------------
// a holly leaf from base b to tip t: [u (0..1 along), half-width] stations; between two spine stations the outline
// dips into a concave bay, so every spine stays a crisp point and the leaf ends in a sharp tip
function leaf(b, t, st) {
  const L = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / L, uy = (t[1] - b[1]) / L
  const P = (u, w) => `${f2(b[0] + ux * u * L - uy * w)} ${f2(b[1] + uy * u * L + ux * w)}`
  let d = `M${P(0, 0)}`
  for (const s of [1, -1]) {
    const pts = s > 0 ? st : [...st].reverse()
    for (let q = 1; q < pts.length; q++) {
      const [u0, w0] = pts[q - 1], [u1, w1] = pts[q]
      const dip = w0 > 0.5 && w1 > 0.5 ? 0.95 : 0.1
      d += `Q${P((u0 + u1) / 2, s * ((w0 + w1) / 2 - dip))} ${P(u1, s * w1)}`
    }
  }
  return d + 'Z'
}
// a pointed ellipse with three spines a side, widest at the middle, then a sharp tip
const SPINES = [[0, 0.3], [0.22, 2.45], [0.47, 3.15], [0.71, 2.4], [1, 0]]
// two leaves fanning out 30 degrees below level; their bases (2u apart, so they never fuse into a knob) tuck under
// the berries, whose moats bite them in clean round arcs
const LEAVES = [[[11, 13.5], [1.75, 18.85]], [[13, 13.5], [22.25, 18.85]]]
// three berries over the leaf joint, each its own bead on a 1u moat
const BERRIES = [[12, 7.1], [9.4, 11.35], [14.6, 11.35]], BR = 2
// a point in a leaf's frame: u along base->tip (0..1), w across (w > 0 = the upper side)
function at([b, t], u, w) {
  const L = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / L, uy = (t[1] - b[1]) / L
  let nx = -uy, ny = ux
  if (ny > 0) { nx = -nx; ny = -ny }
  return [b[0] + ux * u * L + nx * w, b[1] + uy * u * L + ny * w]
}
const pt = p => f2(p[0]) + ' ' + f2(p[1])
const arc = (a, c, b) => 'M' + pt(a) + 'Q' + pt(c) + ' ' + pt(b)

export default function render() {
  // leaves: spines kept sharp (only a 0.25u round on the points), bays softened, a carved midrib each as the shine
  let leaves = union(...LEAVES.map(([b, t]) => area(leaf(b, t, SPINES))))
  leaves = closing(opening(leaves, 0.25), 0.5)
  const berries = union(...BERRIES.map(([x, y]) => area(disc(x, y, BR))))
  leaves = cut(leaves, berries, 1)
  const ribs = union(...LEAVES.map(lf => tube('M' + pt(at(lf, 0.3, 0)) + 'L' + pt(at(lf, 0.76, 0)), 0.42)))
  const dk = level(cut(leaves, ribs), 0)
  // berries: each a bead with a curved shine toward the light and a pin-prick
  const db = level(berries, 0), hb = fld(9)
  for (const [x, y] of BERRIES) {
    bean(hb, db, arc([x - 1.08, y - 0.05], [x - 1.02, y - 1.02], [x - 0.05, y - 1.1]), 0.34)
    splat(hb, db, x - 0.98, y + 0.7, 0.17)
  }
  return [...paint(dk, fld(9), 'wm-k'), ...paint(db, hb, 'wm-a')]
}
