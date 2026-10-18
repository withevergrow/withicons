// forge/hand/chrome/bell-ring.mjs: the bell as the common silhouette: a crown knob, a dome that flares to a lip, and a
// gunmetal clapper hanging clear below it, with two slim chrome ring arcs standing off its shoulders (the two ring marks
// every other style draws, tagged wm-s so motion can flicker them). The bell itself is the chrome bell's construction
// (bell.mjs); the arcs are thin tubes on the skeleton's arcs, parted from the shoulders by clear paper.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const BODY = 'M12 5.1C8.9 5.1 7 7.5 7 10.9V14C7 15.7 6 16.7 4.7 17.2V18.2H19.3V17.2C18 16.7 17 15.7 17 14V10.9C17 7.5 15.1 5.1 12 5.1Z'
const KNOB = disc(12, 3.9, 1.0)
const CLAPPER = disc(12, 20.6, 1.3)
const ARCS = 'M2.4 10.6 A9.6 9.6 0 0 1 4.9 5.3 M21.6 10.6 A9.6 9.6 0 0 0 19.1 5.3'
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

function skeleton(name) {
  const paths = [
    { id: 'p0', d: BODY, plate: 'K' }, { id: 'p1', d: KNOB, plate: 'A' }, { id: 'p3', d: CLAPPER, plate: 'A' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BODY), fill(KNOB), fill(CLAPPER)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'bell-ring'
  const M = model(skeleton(name))
  const arcs = F.strokes(lines(ARCS), 2, 0.7)
  F.union(M.sil, arcs)
  const L1 = layers(M)
  for (const L of L1.list) if (!L.cls) L.cls = 'wm-k'
  const L2 = layers({ T: { noGlint: true }, K: arcs, Af: null, Ab: null, S: null, sil: M.sil, txt: null, seam: null })
  const ring = L2.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: 'wm-s' }))
  const Ls = { list: [...L1.list, ...ring], glint: L1.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
