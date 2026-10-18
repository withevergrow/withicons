// forge/hand/clay/user-search.mjs — the violet clay person with a pink candy magnifier: a round rim around a pale,
// recessed glass lens and a chunky handle running out to the corner. The generator filled the lens solid pink and kept
// only a short stub of handle, so the badge read as a speech bubble (chat); here the lens is glass inside a rim and the
// handle is long, so the magnifier reads at 16px. Same model, light and colour as the generator (_clay-core.mjs) for
// the clay; the glass is drawn here on top of the candy disc.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { BASE } from '../../styles/_clay-color.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const col = r => `var(--with-clay-${r}, ${BASE[r]})`
// the clay model's placement (scale 0.84 about the centre, lifted 0.95): skeleton point -> drawing point
const tf = (x, y) => [(x - 12) * 0.84 + 12, (y - 12) * 0.84 + 12 - 0.95]
const r2 = n => Math.round(n * 100) / 100

const HEAD = 'M12.25 7.5 A3.75 3.75 0 1 1 4.75 7.5 A3.75 3.75 0 1 1 12.25 7.5 Z'
const BUST = 'M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H9.5'
const BUST_FILL = 'M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H9.5 V21 Z'
const LX = 16.25, LY = 15.25, LR = 2.6
const LENS = `M${LX + LR} ${LY} A${LR} ${LR} 0 1 1 ${LX - LR} ${LY} A${LR} ${LR} 0 1 1 ${LX + LR} ${LY} Z`
const HANDLE = 'M18.25 17.25 L20.75 19.75'

export default function render(icon) {
  const name = (icon && icon.name) || 'user-search'
  const nodes = build(skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: BUST, plate: 'K' },
    { d: BUST_FILL, plate: 'K', fill: true },
    { d: LENS, plate: 'S' },        // a closed S ring: a candy disc (the rim)
    { d: HANDLE, plate: 'S' },
  ]))
  // the glass: a pale recessed lens inside the rim, shaded under the rim's upper-left edge, with a crisp glint
  const defs = nodes[0][0] === 'defs' ? nodes[0] : null
  const n0 = defs ? defs[2].length : 0
  const gid = k => `wg-clay-${name}-${n0 + k}`
  const [cx, cy] = tf(LX, LY), g = 1.95
  const grads = [
    ['radialGradient', { id: gid(0), cx: r2(cx + 0.7), cy: r2(cy + 0.8), r: r2(g * 1.6), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': col('shine') }], ['stop', { offset: 0.55, 'stop-color': col('tint') }],
      ['stop', { offset: 1, 'stop-color': col('c1'), 'stop-opacity': 0.9 }]]],
  ]
  if (defs) defs[2].push(...grads); else nodes.unshift(['defs', {}, grads])
  nodes.push(['path', { d: ellD(cx, cy, g, g), fill: `url(#${gid(0)})`, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(cx, cy, g, g), fill: 'none', stroke: col('shadow'), 'stroke-opacity': 0.28, 'stroke-width': 0.3, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(cx - 0.62, cy - 0.7, 0.62, 0.3, -40), fill: col('shine'), 'fill-opacity': 0.92, class: 'wm-shine' }])
  nodes.push(['path', { d: ellD(cx + 0.95, cy + 0.85, 0.32, 0.16, -40), fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }])
  return nodes
}
