// forge/hand/gloss/reindeer.mjs — a reindeer head in soft vinyl: a shield-shaped face narrowing to the muzzle, two leaf
// ears, slim branching antlers with one clear tine each, two eye holes, and a big round nose sitting in a notch at the
// tip of the muzzle (wm-s, it glows). The generated drawing fused thick antler tubes into webbed paddles and boxed the
// nose in a ring moat inside the face, so the head read as a skull or a target; here the nose caps the muzzle.
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



// ---- reindeer ------------------------------------------------------------------------------------------------
const HEAD = 'M7.75 11.5C7.75 9 9.5 8 12 8C14.5 8 16.25 9 16.25 11.5C16.25 13.5 14.75 14.5 14.75 16.5A2.75 2.75 0 0 1 9.25 16.5C9.25 14.5 7.75 13.5 7.75 11.5Z'
const EARS = 'M8.25 11.4C6.5 11.9 4.25 11.4 3.25 9.9C5 8.6 7 8.6 8.5 9.6ZM15.75 11.4C17.5 11.9 19.75 11.4 20.75 9.9C19 8.6 17 8.6 15.5 9.6Z'
const ANTLERS = 'M10.25 8.75C9.75 6.25 8.25 4.75 5.25 4M8.65 5.55C9.15 4.6 9.2 3.5 8.85 2.5M13.75 8.75C14.25 6.25 15.75 4.75 18.75 4M15.35 5.55C14.85 4.6 14.8 3.5 15.15 2.5'
const NX = 12, NY = 19.25, NR = 2.05

export default function render() {
  const nose = area(disc(NX, NY, NR))
  let head = closing(union(area(HEAD), area(EARS), tube(ANTLERS, 1)), 0.6)
  head = opening(cut(head, nose, 0.75), 0.4)
  const sil = head
  const eyes = area(disc(10.15, 12.4, 0.8) + disc(13.85, 12.4, 0.8))
  const dh = level(cut(head, eyes), 0), hh = fld(9)
  // forehead bean between the antlers and the left eye, a glint below it, the reflected rim down the right cheek
  bean(hh, dh, 'M8.85 11.15Q9.15 9.45 11.3 9.2', 0.45)
  splat(hh, dh, 8.75, 12.45, 0.26)
  rim(hh, dh, sil, (x, y) => y > 10.5 && x > 12.5)
  // the nose: a glossy bead, shine toward the light and a pin-prick
  const dn = level(nose, 0), hn = fld(9)
  bean(hn, dn, 'M10.8 19.3Q10.85 18.05 12.05 17.95', 0.38)
  splat(hn, dn, 10.95, 20.25, 0.17)
  return [...paint(dh, hh, 'wm-k'), ...paint(dn, hn, 'wm-s')]
}
