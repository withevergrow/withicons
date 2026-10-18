// forge/hand/chrome/sun-moon.mjs — a disc split down the middle: a bright chrome sun half with evenly spaced rays on the left, a gunmetal crescent moon half on the right.
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = d => F.region(rings(d), M0)
const minus = (A, B) => F.subtract(F.copy(A), B)
// grow keeps the far field at the margin, so a cut never thins the plate it cuts
const grow = (A, e) => A.map(v => v >= M0 - 1e-6 ? M0 : v - e)
const st = (d, w) => F.strokes(lines(d), w, M0)
const U = (...a) => a.reduce((x, y) => F.union(x, y))
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const only = (L, cls, shadow = false) => L.list.filter(l => shadow === (l.cls === 'wm-shadow')).map(l => ({ ...l, cls: shadow ? l.cls : cls }))
// one plate per part, back to front: [field, plate kind 'K'|'A'|'S', class]
function draw(name, parts) {
  const sil = U(...parts.map(p => F.copy(p[0])))
  const M = { T: {}, K: null, Af: null, Ab: null, S: null, sil, txt: null, seam: null }
  for (const [Fd, kind] of parts) { const k = kind === 'A' ? 'Af' : kind; M[k] = M[k] ? U(M[k], F.copy(Fd)) : Fd }
  const Ls = layers(M)
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 7000; t++) out = emit(Ls, name, t)
  return out
}

export default function render(icon) {
  const name = (icon && icon.name) || 'sun-moon'
  const half = reg('M11.25 5.5A6.5 6.5 0 0 0 11.25 18.5Z')
  const moon = minus(reg('M12.75 5.5A6.5 6.5 0 0 1 12.75 18.5Z'), reg(disc(12.25, 9.5, 3.4)))
  const rays = []
  for (let k = 0; k < 5; k++) {
    const a = Math.PI / 2 + Math.PI * (k + 0.5) / 5
    const c = Math.cos(a), s = Math.sin(a), f = n => Math.round(n * 100) / 100
    rays.push(`M${f(11.25 + c * 8.25)} ${f(12 - s * 8.25)}L${f(11.25 + c * 10.5)} ${f(12 - s * 10.5)}`)
  }
  return draw(name, [[U(half, st(rays.join(''), 1.7)), 'K', 'wm-k'], [moon, 'A', 'wm-a']])
}
