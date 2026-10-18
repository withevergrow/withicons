// forge/hand/chrome/building-2.mjs: a tall chrome office tower with a clearly shorter second block beside it, parted by a
// groove, and real windows: square holes cut clean through the chrome and filled with dark glass (a pale glint in each),
// two columns of three on the tower, an arched door, two on the low block. The generated windows were dark rings with pale
// middles that merged with the horizon, so the two silhouettes and the window grid were hard to read.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tx = x => (x - 12) * S + 12 + OX, ty = y => (y - 12) * S + 12 + OY
const tf = p => [tx(p[0]), ty(p[1])]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const minus = (A, B) => F.subtract(F.copy(A), B)
// rounded rect path in drawing units
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
// the same rounded rect in output units (for the painted inlays)
const orr = (x, y, w, h, r) => { const X = tx(x), Y = ty(y), W = r2(w * S), H = r2(h * S), R = r2(r * S); return `M${r2(X + R)} ${r2(Y)}H${r2(X + W - R)}A${R} ${R} 0 0 1 ${r2(X + W)} ${r2(Y + R)}V${r2(Y + H - R)}A${R} ${R} 0 0 1 ${r2(X + W - R)} ${r2(Y + H)}H${r2(X + R)}A${R} ${R} 0 0 1 ${r2(X)} ${r2(Y + H - R)}V${r2(Y + R)}A${R} ${R} 0 0 1 ${r2(X + R)} ${r2(Y)}Z` }

// windows: [x, y, w, h] in drawing units
const W = [
  [5.6, 5.3, 2.3, 2.5], [9.0, 5.3, 2.3, 2.5],
  [5.6, 9.6, 2.3, 2.5], [9.0, 9.6, 2.3, 2.5],
  [15.2, 12.7, 2.6, 2.5], [15.2, 16.6, 2.6, 2.5],
]
// arched door at the foot of the tower
const DOOR = 'M7.7 21.5V17.9A1.3 1.3 0 0 1 10.3 17.9V21.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'building-2'
  const tower = 'M3.5 21.5V4.5A2 2 0 0 1 5.5 2.5H10.5A2 2 0 0 1 12.5 4.5V21.5Z'
  const block = 'M13 9.5H18.5A2 2 0 0 1 20.5 11.5V21.5H13Z'
  const base = 'M2 21.5H22'
  const fK = F.strokes([...lines(tower), ...lines(block), ...lines(base)], 2.55, M0)
  F.region(rings(tower), M0, fK); F.region(rings(block), M0, fK)
  const rec = F.field(M0)
  for (const [x, y, w, h] of W) F.region(rings(rr(x, y, w, h, 0.5)), M0, rec)
  F.region(rings(DOOR), M0, rec)
  // groove between the tower and the low block
  F.strokes(lines('M12.75 12.4V20.4'), 0.8, M0, rec)
  const sil = F.copy(fK)
  let K = F.open(minus(fK, rec), 0.3)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const glint = Ls.glint
  if (glint) out.pop()
  const glass = { fill: col('c3'), class: 'wm-a' }
  const ink = { fill: col('ink'), class: 'wm-a' }
  const sheen = { fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }
  for (const [x, y, w, h] of W) {
    out.push(['path', { d: orr(x, y, w, h, 0.5), ...glass }])
    out.push(['path', { d: orr(x, y + h * 0.5, w, h * 0.5, 0.5), ...ink }])
    out.push(['path', { d: orr(x + 0.35, y + 0.3, 0.7, h * 0.55, 0.3), ...sheen }])
  }
  const dx = tx(7.7), dy = ty(17.9)
  const door = `M${r2(dx)} ${r2(ty(21.5))}V${r2(dy)}A${r2(1.3 * S)} ${r2(1.3 * S)} 0 0 1 ${r2(tx(10.3))} ${r2(dy)}V${r2(ty(21.5))}Z`
  out.push(['path', { d: door, ...ink }])
  if (glint) out.push(glint)
  return out
}
