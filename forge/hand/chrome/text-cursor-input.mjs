// forge/hand/chrome/text-cursor-input.mjs — a thin chrome-outlined input field with a bold enamel I-beam cursor and its serifs.
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
  const name = (icon && icon.name) || 'text-cursor-input'
  const field = minus(reg('M4 7H20A2 2 0 0 1 22 9V15A2 2 0 0 1 20 17H4A2 2 0 0 1 2 15V9A2 2 0 0 1 4 7Z'), reg('M4.9 9.1H19.1A.6.6 0 0 1 19.7 9.7V14.3A.6.6 0 0 1 19.1 14.9H4.9A.6.6 0 0 1 4.3 14.3V9.7A.6.6 0 0 1 4.9 9.1Z'))
  const beam = st('M12 3.5V20.5M9.5 3.5H14.5M9.5 20.5H14.5', 1.9)
  const dots = st('M6.5 12H6.6', 1.8)
  return draw(name, [[minus(U(field, dots), grow(beam, 0.5)), 'K', 'wm-k'], [beam, 'S', 'wm-s']])
}
