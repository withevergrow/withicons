// forge/hand/skeuo/cup-soda.mjs — a white takeaway soda cup: a domed lid over a lip that overhangs the cup, a cup that
// tapers hard towards its base, a red printed band, and a red straw rising from the dome. The generated cup was a
// straight-sided pail under a flat bar with a loose straw, so it read as a bucket. Same model, materials and light as
// the generator (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
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

// lid: dome on a lip (3.5..20.5, y 8..10.25); cup: 13 wide under the lip, 8.5 wide at the base
const CUP = 'M6.5 8C7 6.25 9 5.25 12 5.25S17 6.25 17.5 8H19.75A0.75 0.75 0 0 1 20.5 8.75V9.5A0.75 0.75 0 0 1 19.75 10.25H18.5' +
  'L17.1 20.1A1.6 1.6 0 0 1 15.5 21.5H8.5A1.6 1.6 0 0 1 6.9 20.1L5.5 10.25H4.25A0.75 0.75 0 0 1 3.5 9.5V8.75A0.75 0.75 0 0 1 4.25 8Z'
// the seam where the lip meets the cup, and where the dome sits on the lip
const SEAM = 'M6 10.25H18'
const DOME = 'M7 8H17'
const STRAW = 'M12.75 6L14.25 2.25H17.5'

export default function render(icon) {
  const S = skeleton({ name: 'cup-soda', category: 'food', ...(icon || {}) },
    [{ d: CUP }, { d: STRAW, plate: 'A' }], [CUP], [SEAM, DOME])
  const T = { part: 'red', front: false, wA: 1.6, zones: [{ y0: 13.25, y1: 17.25, mat: 'red', role: 'c3' }] }
  return paint(build(S, T), materials(S, T), T)
}
