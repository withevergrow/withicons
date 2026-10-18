// forge/hand/chrome/tennis.mjs — a big chrome racket head with a clean gunmetal cross-hatch, a thick handle and an enamel ball with a chrome-sphere highlight.
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
  const name = (icon && icon.name) || 'tennis'
  const head = reg('M10 1.75A6.75 7.5 0 1 1 9.99 1.75Z'.replace('A6.75 7.5 0 1 1 9.99 1.75', 'A6.75 7.5 0 1 1 10 16.75A6.75 7.5 0 1 1 10 1.75'))
  const inner = reg('M10 3.5A5 5.75 0 1 1 10 15A5 5.75 0 1 1 10 3.5Z')
  const frame = minus(head, inner)
  const strings = F.intersect(st('M7.5 2V17M10 2V17M12.5 2V17M3 6.75H17M3 9.25H17M3 11.75H17', 0.8), inner)
  const neck = st('M7.5 16.5L4 21.75', 2.6)
  const ball = reg(disc(18.25, 18.25, 3.25))
  return draw(name, [[minus(U(frame, neck), grow(ball, 0.45)), 'K', 'wm-k'], [strings, 'A', 'wm-a'], [ball, 'S', 'wm-s']])
}
