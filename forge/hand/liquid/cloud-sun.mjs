// forge/hand/liquid/cloud-sun.mjs: a full coloured-glass sun disc with five short, evenly spaced rays, half hidden
// behind a clear glass cloud. The generated sun was a thin crescent dwarfed by its fat ray pills, so at 16px the cluster
// read as a paw print or a flower; a solid disc on one ring of rays reads as the sun.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const CLOUD = 'M11.06 20.5 A3.24 3.24 0 0 1 10.48 14.09 A4.46 4.46 0 0 1 19.05 14.45 A3.06 3.06 0 0 1 18.44 20.5 Z'
// the sun: centre (9.5 9.5), r 3.25; an inner arc keeps the disc on plate A
const SUN = 'M12.75 9.5 A3.25 3.25 0 1 1 6.25 9.5 A3.25 3.25 0 1 1 12.75 9.5 Z'
const SUN_CORE = 'M7.75 9.5 A1.75 1.75 0 0 1 9.5 7.75'
// rays on radii 5.9 to 7.15 from the centre: up, up-left, left, down-left, up-right
const RAYS = 'M9.5 3.6 L9.5 2.35 M5.33 5.33 L4.44 4.44 M3.6 9.5 L2.35 9.5 M5.33 13.67 L4.44 14.56 M13.67 5.33 L14.56 4.44'

export default function render(icon) {
  const nodes = build({
    name: (icon && icon.name) || 'cloud-sun', paths: [],
    lines: [...lines(CLOUD, 'K'), ...lines(SUN_CORE, 'A'), ...lines(RAYS, 'A')],
    fills: [fill(CLOUD), fill(SUN)],
    cutouts: [],
  })
  if (!nodes) return []
  // paint the coloured sun first so the clear cloud lies over it: the sun peeks out from behind
  const isA = n => n[1] && n[1].class === 'wm-a'
  const head = nodes.filter(n => n[0] === 'defs' || (n[1] && n[1].class === 'wm-shadow'))
  return [...head, ...nodes.filter(isA), ...nodes.filter(n => !head.includes(n) && !isA(n))]
}
