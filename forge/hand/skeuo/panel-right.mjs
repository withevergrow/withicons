// skeuo / panel-right: a brushed-steel window frame holding a wide inlaid glass pane on the left and a narrow raised
// light-blue sidebar on the right, parted by a steel divider (the generated icon was one big hole beside a thin rail).
// Same pipeline, materials and light as the generator (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
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

const FRAME = 'M5.5 3H18.5A2.5 2.5 0 0 1 21 5.5V18.5A2.5 2.5 0 0 1 18.5 21H5.5A2.5 2.5 0 0 1 3 18.5V5.5A2.5 2.5 0 0 1 5.5 3Z'
const LEFT = 'M6.5 5.5H11.5A1 1 0 0 1 12.5 6.5V17.5A1 1 0 0 1 11.5 18.5H6.5A1 1 0 0 1 5.5 17.5V6.5A1 1 0 0 1 6.5 5.5Z'
const RIGHT = 'M16 5.5H17.5A1 1 0 0 1 18.5 6.5V17.5A1 1 0 0 1 17.5 18.5H16A1 1 0 0 1 15 17.5V6.5A1 1 0 0 1 16 5.5Z'

export default function render(icon) {
  const S = skeleton({ name: 'panel-right', category: 'layout', ...(icon || {}) }, [{ d: FRAME }], [FRAME], [LEFT, RIGHT])
  const T = { screen: true, screenMin: 3, decal: { 1: 'sky' } }
  return paint(build(S, T), materials(S, T), T)
}
