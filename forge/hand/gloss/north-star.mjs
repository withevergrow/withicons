// forge/hand/gloss/north-star.mjs — a plump four-point star with the long lower ray, a small crisp diamond window at
// its heart and four short sparkle dashes standing clear of it on a real gap. The generated drawing inflated the thin
// rays and fused the four dashes onto the body, so it read as an eight-armed blot with a hole; here the star keeps
// its pointed rays, the window is small enough to stay open at 16px, and the dashes twinkle on their own (wm-a).
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



// ---- north star ----------------------------------------------------------------------------------------------
const STAR = 'M12 2.25Q13.75 9.25 19.75 11Q13.75 12.75 12 21.75Q10.25 12.75 4.25 11Q10.25 9.25 12 2.25Z'
const GEM = 'M12 9.05L13.1 11L12 12.95L10.9 11Z'
// two short sparkle dashes out in the upper-right and lower-left corners, well clear of the rays, so the four-point
// star stays the silhouette at 16px instead of an eight-armed asterisk
const DASHES = 'M17 6L17.45 5.55M7 16.6L6.55 17.05'

export default function render() {
  const dashes = tube(DASHES, 0.75)
  let star = opening(area(STAR), 0.55)
  star = cut(star, dashes, 0.9)
  const sil = star
  const ds = level(cut(star, gem()), 0), hs = fld(9)
  // a short fat bean set well inside the lit upper-left curve, a glint on the left ray, and a thin reflected rim
  // along the lower-right concave edge between the right and bottom rays
  bean(hs, ds, 'M10.85 8.3Q10.35 8.85 9.75 9.3', 0.5)
  splat(hs, ds, 7.2, 10.55, 0.26)
  rim(hs, ds, sil, (x, y) => x > 12.9 && x < 17.6 && y > 12.1 && y < 17)
  const dd = level(dashes, 0)
  return [...paint(ds, hs, 'wm-k'), ...paint(dd, fld(9), 'wm-a')]
}
const gem = () => opening(area(GEM), 0.2)
