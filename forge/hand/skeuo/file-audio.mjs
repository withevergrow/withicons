// skeuo / file-audio: the cream paper page with its folded corner, and a big raised violet-lacquer music note that
// fills the page (the generated note was a tiny ring and a hairline stem). Same pipeline, materials and light as the
// generator (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_skeuo-core.mjs'
import { materials } from '../../styles/_skeuo-mat.mjs'
import { paint } from '../../styles/_skeuo-render.mjs'

function skeleton(base, paths, fills, cuts) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  return {
    ...base, paths: ps,
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
// the note: a round head, a stem and a flag
const HEAD = 'M11.3 16.8A1.9 1.9 0 1 1 7.5 16.8A1.9 1.9 0 1 1 11.3 16.8Z'
const STEM = 'M11.3 16.4V9.9C12 11.8 16 11.6 16 14.6'

export default function render(icon) {
  const S = skeleton({ name: 'file-audio', category: 'files', ...(icon || {}) },
    [{ d: PAGE }, { d: HEAD, plate: 'A' }, { d: STEM, plate: 'A' }], [PAGE], [FOLD])
  const T = { lift: ['p1', 'p2'], liftMat: 'violet', wLift: 1.9 }
  return paint(build(S, T), materials(S, T), T)
}
