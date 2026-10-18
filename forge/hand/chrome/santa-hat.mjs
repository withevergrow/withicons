// forge/hand/chrome/santa-hat.mjs — gunmetal-free santa hat: an enamel cone, a bright chrome trim band and a distinct round chrome pompom.
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 1, OX = 0, OY = -0.6, M0 = 0.7
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
  // the pompom is bright chrome (a K plate) but is the swaying part: retag its chrome loops wm-a
  for (const l of Ls.list) if (l.cls === 'wm-k') { const ys = l.loops.flat().map(p => p[1]); if (Math.max(...ys) < 14.6) l.cls = 'wm-a' }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 7000; t++) out = emit(Ls, name, t)
  return out
}

export default function render(icon) {
  const name = (icon && icon.name) || 'santa-hat'
  const body = reg('M4.2 17C3.8 8.8 8 3 13.2 3.2C17 3.4 19.4 6.4 19.2 10.2C17.2 9.6 16 8.8 15.2 7.8C15.4 11.6 18 14.4 19.6 17Z')
  const trim = reg('M3.6 15.6H20.4A2.6 2.6 0 0 1 20.4 20.8H3.6A2.6 2.6 0 0 1 3.6 15.6Z')
  const pom = reg(disc(19.2, 10.8, 3))
  return draw(name, [[minus(body, grow(U(F.copy(trim), F.copy(pom)), 0.4)), 'S', 'wm-s'], [trim, 'K', 'wm-k'], [pom, 'K', 'wm-a']])
}
