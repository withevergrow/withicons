// skeuo / camera-off: a graphite camera body with a viewfinder bump and a chrome-ringed glass lens, struck through by a
// red enamel slash laid on top (the generated slash cut the lens away, leaving a grey folder shape). Same pipeline,
// materials and light as the generator (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
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

const BODY = 'M4 7H7.5L8.8 4.5A1 1 0 0 1 9.7 4H14.3A1 1 0 0 1 15.2 4.5L16.5 7H20A2 2 0 0 1 22 9V18.5A2 2 0 0 1 20 20.5H4A2 2 0 0 1 2 18.5V9A2 2 0 0 1 4 7Z'
const LENS = 'M15.7 13.7A3.7 3.7 0 1 1 8.3 13.7A3.7 3.7 0 1 1 15.7 13.7Z'
const SLASH = 'M4.5 4L19.5 20'

// the lens (whatever the bare body lacks) moves as motion part A
function tagA(full, base) {
  const seen = new Set(base.map(n => JSON.stringify(n)))
  return full.map(n => seen.has(JSON.stringify(n)) ? n : [n[0], { ...n[1], class: 'wm-a' }, ...n.slice(2)])
}

export default function render(icon) {
  const base = { name: 'camera-off', category: 'devices', ...(icon || {}) }
  const cam = skeleton(base, [{ d: BODY }], [BODY], [LENS])
  const T = { screen: true, screenMin: 2, lens: {} }
  const slash = skeleton(base, [{ d: SLASH, plate: 'S' }], [], [])
  const T2 = { wS: 2.4 }
  const top = paint(build(slash, T2), materials(slash, { sig: 'red', body: 'red', part: 'red' }), T2)
  const bare = skeleton(base, [{ d: BODY }], [BODY], [])
  const body = paint(build(bare, T), materials(bare, T), T)
  return [...tagA(paint(build(cam, T), materials(cam, T), T), body), ...top]
}
