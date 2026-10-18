// forge/hand/liquid/route.mjs — two clear glass stops joined by a bold coloured-glass S road that plugs into each stop
// through a hairline moat. The generator ran the 2.3u road's round caps into the stops' glass, so a purple tongue sat
// inside each clear disc and the junctions smeared together at 16px; its road was also thinner than the stops' rims.
// Here the stops are 6u discs, the road a 2.8u c2 tube whose ends are cut back around each disc by a hairline gap, so
// both stops and the S hold as three clean glass pieces. Same model and paint as the generator (_liquid-core.mjs
// build); only the geometry is drawn here. Motion: the road is the A part (wm-a, filled by the motion spec).
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, roundStrokeSet, erode, normalize } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const disc = (x, y, r) => normalize(circle(x, y, r, 0.15))

const A0 = [5.6, 18.4], B0 = [18.4, 5.6], R = 3.0, GAP = 0.32
// the road's centreline from the bottom stop's centre to the top stop's centre
const ROAD = 'M5.6 18.4H15.1A3.2 3.2 0 0 0 15.1 12H8.9A3.2 3.2 0 0 1 8.9 5.6H18.4'

function skeleton(name) {
  const stops = unionSets([disc(...A0, R), disc(...B0, R)])
  const road0 = parsePath(ROAD, 0.15)[0].pts
  const clear = unionSets([disc(...A0, R + GAP), disc(...B0, R + GAP)])
  const road = differenceSets(roundStrokeSet(road0, 2.8), clear)
  // the road's tube only where it is clear of the stops (with room for its own 1.15u half-width)
  const far = p => Math.hypot(p[0] - A0[0], p[1] - A0[1]) > R + GAP + 1.2 && Math.hypot(p[0] - B0[0], p[1] - B0[1]) > R + GAP + 1.2
  const kLines = erode(stops, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' }))
  return {
    name, paths: [], cutouts: [],
    fills: [fill(stops), fill(road)],
    lines: [{ pts: road0.filter(far), closed: false, plate: 'A' }, ...kLines],
  }
}

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'route'))
}
