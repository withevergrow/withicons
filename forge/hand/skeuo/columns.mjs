// forge/hand/skeuo/columns.mjs — a brushed aluminium tray holding two raised blue enamel panes side by side with an
// aluminium channel between them. The generated tray was pale alu split only by a hairline groove, so at 16px the two
// columns vanished into one grey tile. Same model, materials and light as the generator (_skeuo-core / _skeuo-mat /
// _skeuo-render); only the geometry is drawn here.
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

const FRAME = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const pane = (x0, x1) => `M${x0 + 1} 5.25H${x1 - 1}A1 1 0 0 1 ${x1} 6.25V17.75A1 1 0 0 1 ${x1 - 1} 18.75H${x0 + 1}A1 1 0 0 1 ${x0} 17.75V6.25A1 1 0 0 1 ${x0 + 1} 5.25Z`

// the detail (whatever the base drawing lacks) moves as motion part A
function tagA(full, base) {
  const seen = new Set(base.map(n => JSON.stringify(n)))
  return full.map(n => seen.has(JSON.stringify(n)) ? n : [n[0], { ...n[1], class: 'wm-a' }, ...n.slice(2)])
}

export default function render(icon) {
  const S = skeleton({ name: 'columns', category: 'layout', ...(icon || {}) },
    [{ d: FRAME }], [FRAME], [pane(5.25, 10.75) + pane(13.25, 18.75)])
  const T = { decal: { 0: 'blue' } }, T0 = { noCutouts: true }
  return tagA(paint(build(S, T), materials(S, T), T), paint(build(S, T0), materials(S, T0), T0))
}
