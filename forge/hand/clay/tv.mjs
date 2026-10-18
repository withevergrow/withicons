// forge/hand/clay/tv.mjs — a violet clay TV set with a recessed screen and rabbit-ear antennae: two thin splayed orange
// rods that rise from apart on the cabinet's top, each ending in a fat round clay ball. The generated antenna was a
// short fat V meeting in one point, so in clay it read as a ribbon bow and the TV as a gift box; the house 2.3 tube
// also made the rods as fat as the tips (crossed bones), so here the rods are drawn as slim rods by hand and only the
// cabinet and the ball tips go through the clay model (_clay-core.mjs, same light).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

const BODY = 'M4 9H20A2 2 0 0 1 22 11V18.5A2 2 0 0 1 20 20.5H4A2 2 0 0 1 2 18.5V11A2 2 0 0 1 4 9Z'
const SCREEN = 'M5 11H19A1 1 0 0 1 20 12V17A1 1 0 0 1 19 18H5A1 1 0 0 1 4 17V12A1 1 0 0 1 5 11Z'
// ball tips: the 0.85 cores swell (with the 2.3 tube) into balls about 3.4u across, far rounder than the 1.2u rods
const TIPS = [[7.5, 2.9], [16.5, 2.9]]
// rod feet sit apart behind the cabinet's top (hidden), so the ears leave open space between and beside them
const FEET = [[11.1, 9.6], [12.9, 9.6]]
const ROD_R = 0.6                      // rod half-width in output units (1.2u rods)

// a capsule from a to b with radius r (output coordinates), optionally shifted sideways by off along its normal
function capsule(a, b, r, off = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off]
  const p = (P, s) => r2(P[0] + nx * r * s) + ' ' + r2(P[1] + ny * r * s)
  return `M${p(A, 1)}L${p(B, 1)}A${r} ${r} 0 0 0 ${p(B, -1)}L${p(A, -1)}A${r} ${r} 0 0 0 ${p(A, 1)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'tv'
  const sk = skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: TIPS.map(([x, y]) => disc(x, y, 0.85)).join(''), plate: 'A', fill: true },
  ], [SCREEN])
  const nodes = build(sk)
  if (!nodes) return nodes
  const { col } = colorsFor(sk)
  const tf = (x, y) => [(x - 12) * K.SCALE + 12 + K.TX, (y - 12) * K.SCALE + 12 + K.TY]
  // the rods' own gradient, added to the one defs node with the next free id
  const defs = nodes[0][0] === 'defs' ? nodes[0] : null
  let fill = col('c2')
  if (defs) {
    const id = `wg-clay-${name}-${defs[2].length}`
    defs[2].push(['linearGradient', { id, x1: 0, y1: 2, x2: 0, y2: 12, gradientUnits: 'userSpaceOnUse' },
      [['stop', { offset: 0, 'stop-color': col('c2') }], ['stop', { offset: 0.55, 'stop-color': col('c2') }], ['stop', { offset: 1, 'stop-color': col('c3') }]]])
    fill = `url(#${id})`
  }
  const rods = TIPS.map((t, i) => [tf(...FEET[i]), tf(...t)])
  // light comes from the top-left: on both rods the +normal flank faces down-right (shade), the -normal flank up-left (shine)
  const body = rods.map(([a, b]) => capsule(a, b, ROD_R)).join('')
  const shade = rods.map(([a, b]) => capsule(a, b, 0.22, 0.36)).join('')
  const shine = rods.map(([a, b]) => capsule(a, b, 0.13, -0.3)).join('')
  const rodNodes = [
    ['path', { d: body, fill, class: 'wm-a' }],
    ['path', { d: shade, fill: col('shadow'), 'fill-opacity': 0.22, class: 'wm-a' }],
    ['path', { d: shine, fill: col('shine'), 'fill-opacity': 0.55, class: 'wm-shine' }],
  ]
  // behind everything but the ground shadow
  let at = defs ? 1 : 0
  while (at < nodes.length && /wm-shadow/.test(nodes[at][1].class || '')) at++
  nodes.splice(at, 0, ...rodNodes)
  return nodes
}
