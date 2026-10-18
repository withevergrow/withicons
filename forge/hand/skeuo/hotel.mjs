// skeuo / hotel: a stone hotel block on a plinth with a red enamel sign band and a raised white sign bar, and a lit
// guest room inlaid in the glass below it, holding a wooden bed with a white pillow and a red blanket. The generated
// building was a pale slab with a bed grooved into it, which read as a room or a door rather than a hotel.
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

const BLOCK = 'M3.5 21.5V5A2 2 0 0 1 5.5 3H18.5A2 2 0 0 1 20.5 5V21.5Z'
const GROUND = 'M2 21.5H22'
const SIGN = 'M8.5 6.2H15.5'
const ROOM = 'M7 11.2H17A1 1 0 0 1 18 12.2V18.8A1 1 0 0 1 17 19.8H7A1 1 0 0 1 6 18.8V12.2A1 1 0 0 1 7 11.2Z'
// the bed, three layers: a wooden frame, a white pillow, a red blanket
const FRAME = 'M7.4 13.4A0.8 0.8 0 0 1 8.2 12.6H8.4A0.8 0.8 0 0 1 9.2 13.4V17.8H16.8V19.4H7.4Z'
const PILLOW = 'M10.2 15.5H10.9A1 1 0 0 1 10.9 17.5H10.2A1 1 0 0 1 10.2 15.5Z'
const BLANKET = 'M12.4 17.8V17.2A1.9 1.9 0 0 1 14.3 15.3H15.1A1.7 1.7 0 0 1 16.8 17V17.8Z'

const layer = (base, d, T) => {
  const S = skeleton(base, [{ d }], [d], [])
  return paint(build(S, T), materials(S, T), T)
}
const tagA = nodes => nodes.map(n => (n[1] && n[1].class === 'wm-shadow') ? n : [n[0], { ...n[1], class: 'wm-a' }, ...n.slice(2)])

export default function render(icon) {
  const base = { name: 'hotel', category: 'travel', ...(icon || {}) }
  const S = skeleton(base, [{ d: BLOCK }, { d: GROUND }], [BLOCK], [SIGN, ROOM])
  const T = { screen: true, screenMin: 3, groove: 1.5, zones: [{ y1: 9.2, mat: 'red', role: 'c3', text: 'white' }] }
  const bed = [
    ...layer(base, FRAME, { body: 'wood', w: 0.5, shadow: 0 }),
    ...layer(base, PILLOW, { body: 'ceramic', w: 0.5, shadow: 0 }),
    ...layer(base, BLANKET, { body: 'red', w: 0.5, shadow: 0 }),
  ]
  return [...paint(build(S, T), materials(S, T), T), ...tagA(bed)]
}
