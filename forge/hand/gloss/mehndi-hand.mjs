// forge/hand/gloss/mehndi-hand.mjs — an open palm in soft vinyl: four rounded fingers split by clean gaps, a thumb out to
// the right, and one henna flower stamped in the middle of the palm inside its own moat (wm-a, it twinkles). The
// generated drawing carved the finger grooves as stripes in a fused mitten and scattered a cut-out flower and tip
// dots across it, so the pattern fought the hand at 16px; here the hand silhouette leads and one flower says mehndi.
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



// ---- mehndi hand ---------------------------------------------------------------------------------------------
const FINGERS = 'M4.5 10.75V15M8.5 6.5V15M12.5 4.75V15M16.5 6.25V15'
const PALM = 'M3.05 12.5H17.95V17.25C17.95 19.75 16.25 21.5 13.5 21.5H8.25A5.2 5.2 0 0 1 3.05 16.3Z'
// the thumb: a full finger-width (2.6u) capsule leaving the palm up and to the right, no gap cut into it
const THUMB = 'M15.25 18.5L20.6 13.9'
const GAPS = 'M6.5 1V12.1M10.5 1V12.1M14.5 1V12.1'
const FX = 10.5, FY = 16.75
const PETALS = [0, 60, 120, 180, 240, 300].map(a => disc(f2(FX + 1.45 * Math.cos(a * Math.PI / 180)), f2(FY + 1.45 * Math.sin(a * Math.PI / 180)), 0.95))
// the thumb crotch, between the index finger and the thumb: rounded into a smooth concave fillet
const inCrotch = (x, y) => x > 16.6 && x < 20.5 && y > 11.5 && y < 16.5

export default function render() {
  let hand = closing(union(tube(FINGERS, 1.45), area(PALM), tube(THUMB, 1.3)), 0.45)
  hand = cut(hand, tube(GAPS, 0.55))
  hand = opening(hand, 0.3)
  { const soft = closing(hand, 1.5); for (let k = 0; k < NN; k++) if (inCrotch(gx(k % N), gx(Math.floor(k / N)))) hand[k] = soft[k] }
  hand = level(hand, 0)
  const sil = hand                                   // the hand before the rosette moat: the rim never runs round the moat
  const flower = cut(union(...PETALS.map(area), area(disc(FX, FY, 1.3))), area(disc(FX, FY, 0.45)))
  hand = cut(hand, union(...PETALS.map(area), area(disc(FX, FY, 1.3))), 0.75)
  const dh = level(hand, 0), hh = fld(9)
  // one streak down the lit side of the tallest finger, a bean round the lower-left palm curve (it starts below the
  // moat's reach), a glint under the streak, and a rim along the bottom of the palm that stops at the wrist before the thumb
  bean(hh, dh, 'M11.88 4.9L11.88 7.3', 0.28)
  bean(hh, dh, 'M4.05 16.1Q4.1 18.6 5.85 19.85', 0.5)
  splat(hh, dh, 11.88, 8.5, 0.26)
  rim(hh, dh, sil, (x, y) => y > 17.5 && x < 14.6)
  const dfl = level(flower, 0)
  return [...paint(dh, hh, 'wm-k'), ...paint(dfl, fld(9), 'wm-a')]
}
