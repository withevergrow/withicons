// forge/hand/liquid/warehouse.mjs: a depot in liquid glass: clear-glass walls under a separate coloured-glass pitched
// roof (parted from the walls by a clean moat, so roof and walls never merge into one box) and a wide roller door of
// coloured glass with two thin slats cut through it. The earlier drawing stacked three bars in a plain pentagon, which
// read as a layered box. Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn here.
// Motion: walls wm-k, roof and door the A part (wm-a).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, strokeSet, differenceSets, unionSets, dilate, erode } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)

function skeleton(name) {
  // roof: a thick chevron with a flat-cut overhang
  const roofLine = [[1.9, 11], [12, 5.2], [22.1, 11]]
  const roof = strokeSet(roofLine, 2.9)
  // walls: the gable pentagon, trimmed to a moat below the roof
  const wallsFull = setOf([[[3.4, 21.5], [3.4, 9.4], [12, 4.6], [20.6, 9.4], [20.6, 21.5]]])
  const walls = differenceSets(wallsFull, dilate(roof, 0.6))
  // door: one wide slab with two thin slots (the slats), standing on the floor
  const doorBox = setOf(ringsOf('M7.2 13.6H16.8V21.5H7.2Z'))
  const slots = [setOf(ringsOf('M6.6 16.2H17.4V16.8H6.6Z')), setOf(ringsOf('M6.6 18.8H17.4V19.4H6.6Z'))]
  const door = differenceSets(doorBox, unionSets(slots))
  return {
    name, paths: [], cutouts: [],
    fills: [fill(walls), fill(roof), fill(door)],
    lines: [
      ...erode(walls, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      { pts: roofLine, closed: false, plate: 'A' },
      ...erode(doorBox, 1.15).map(r => ({ pts: r, closed: true, plate: 'A' })),
    ],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'warehouse'))
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.5 : 0.88 }])
  return out
}
