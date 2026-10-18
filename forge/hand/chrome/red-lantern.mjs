// forge/hand/chrome/red-lantern.mjs — a chrome Chinese lantern: a plump polished chrome body with two LIGHT curved ribs
// laid over it (a bright inlay on a dark keyline, not cut grooves), a gunmetal cap and base cleared from the body by
// dark seams, a hanging loop on top and a gunmetal tassel (the part that sways) under it. The generated lantern cut its
// ribs as two dark brackets that read as a face; light ribs, two caps and a tassel read as a lantern. Painted with the
// style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const r2 = v => Math.round(v * 100) / 100
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
// a quadratic rib in skeleton coordinates, as a placed path
const rib = (a, c, b) => `M${tf(a).map(r2).join(' ')}Q${tf(c).map(r2).join(' ')} ${tf(b).map(r2).join(' ')}`

const BODY = 'M12 4.9C16.8 4.9 20.9 7.5 20.9 11.4C20.9 15.3 16.8 17.9 12 17.9C7.2 17.9 3.1 15.3 3.1 11.4C3.1 7.5 7.2 4.9 12 4.9Z'
// cap and base: short flat collars; the loop on top is a small ring stroked on the cap
const CAP = 'M8.4 3.1H15.6A.9.9 0 0 1 16.5 4V5.9H7.5V4A.9.9 0 0 1 8.4 3.1Z'
const BASE = 'M7.5 16.9H16.5V18.6A.9.9 0 0 1 15.6 19.5H8.4A.9.9 0 0 1 7.5 18.6Z'
const LOOP = 'M10.6 3.3C10.6 1.4 13.4 1.4 13.4 3.3'
// the tassel: a short cord and a flared fringe
const TASSEL = 'M11.5 19.2H12.5V20.5H11.5Z M12 20.2C13.5 20.2 14.2 21.3 14.4 22.9H9.6C9.8 21.3 10.5 20.2 12 20.2Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'red-lantern'
  const body = reg(BODY)
  const caps = reg(CAP); reg(BASE, caps); F.union(caps, F.strokes(lines(LOOP), 1.3, M0))
  const g = grow(caps, 0.42)
  const seam = F.intersect(F.copy(g), body)
  const round = x => F.open(F.copy(x), 0.3)
  const tassel = round(reg(TASSEL))
  const sil = F.union(F.union(F.copy(body), caps), tassel)
  const Lb = layers({ T: { noGlint: true }, K: round(minus(body, g)), Af: round(caps), Ab: null, S: null, sil, txt: null, seam })
  const Lt = layers({ T: { noGlint: true }, K: null, Af: null, Ab: tassel, S: null, sil, txt: null, seam: null })
  // body and caps are the body (wm-k); the tassel is the part that sways (wm-a)
  const list = [
    ...Lt.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: l.cls === 'wm-shine' ? l.cls : 'wm-a' })),
    ...Lb.list.map(l => ({ ...l, cls: l.cls === 'wm-shadow' || l.cls === 'wm-shine' ? l.cls : 'wm-k' })),
  ]
  // shadow first
  list.sort((a, b) => (b.cls === 'wm-shadow') - (a.cls === 'wm-shadow'))
  const Ls = { list, glint: Lb.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  // the ribs: a dark keyline under a bright tube, set over the body
  const ribs = [rib([9.4, 6.3], [5.4, 11.4], [9.4, 16.5]), rib([14.6, 6.3], [18.6, 11.4], [14.6, 16.5])]
  const base = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }
  const glint = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const tail = glint >= 0 ? out.splice(glint, 1) : []
  for (const d of ribs) out.push(['path', { d, ...base, stroke: col('shadow'), 'stroke-width': 1.7, 'stroke-opacity': 0.55 }])
  for (const d of ribs) out.push(['path', { d, ...base, stroke: col('edge'), 'stroke-width': 0.9 }])
  return [...out, ...tail]
}
