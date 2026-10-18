// forge/hand/chrome/shopping-cart.mjs — a polished chrome shopping cart: a fat handle tube with a square-ended grip
// running into a deep wire basket parted into three panels by two slots, rolling on two solid gunmetal wheels with
// small punched hubs. The generated basket was a plain pale tub on pea-sized wheels, a bucket more than a cart at 16px;
// the slots, the grip and the dark solid wheels make it read as a cart in both themes. The glint sits on the basket's
// top-left corner, not on the grip. Same placement, model and paint as the generator (_chrome-core.mjs).
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const smooth = r => r.length < 5 ? r : r.map((p, i) => {
  const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
  return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]
})
const flat = (Fd, role, cls) => ({ loops: F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), fill: col(role), cls, q: 'body' })
const r2 = v => Math.round(v * 100) / 100

// a short square-ended grip, then the handle runs down the basket's rear edge (slope 0.25)
const GRIP = 'M1.75 2.25H3.25V4.75H1.75Z'
const HANDLE = 'M3 3.5H3.25A1.25 1.25 0 0 1 4.46 4.44L7.25 15'
const BASKET = 'M5.1 6H21.6A0.6 0.6 0 0 1 22.17 6.79L19.5 15.5H7.4Z'
const SLOTS = 'M10.75 8.75V13.25M16.25 8.75V13.25'
const WHEELS = [[8.75, 20], [17.75, 20]]
const GLINT = [7.25, 7.75]

function glint() {
  const [x, y] = tf(GLINT), r = 1.7, w = 0.3
  const d = `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}Z`
  return ['path', { d, fill: col('shine'), class: 'wm-shine' }]
}

export default function render(icon) {
  const name = (icon && icon.name) || 'shopping-cart'
  const body = F.strokes(lines(HANDLE), 2.55, M0)
  reg(GRIP, body)
  reg(BASKET, body)
  const K = F.open(minus(body, F.strokes(lines(SLOTS), 1.5, M0)), 0.32)
  // solid gunmetal wheels, each with a small bright hub on a dark collar
  const Ab = F.open(reg(WHEELS.map(([x, y]) => disc(x, y, 2.4)).join('')), 0.2)
  const sil = F.copy(K); F.union(sil, Ab)
  const L = layers({ T: { noGlint: true }, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  const hub = r => reg(WHEELS.map(([x, y]) => disc(x, y, r)).join(''))
  // the tyres keep their dark edge but drop the pale bevel ring, so the wheels read as dark masses
  const list = L.list.filter(l => !(l.cls === 'wm-a' && Array.isArray(l.fill) && l.fill[0] === 'bevel'))
  const Ls = { list: [...list, flat(hub(0.95), 'shadow', 'wm-k'), flat(hub(0.6), 'tint', 'wm-k')], glint: glint() }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
