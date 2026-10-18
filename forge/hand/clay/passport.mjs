// forge/hand/clay/passport.mjs: an upright rounded passport cover in sky clay with a plump gold
// globe emblem (equator and one meridian pressed into it) and a gold pill bar along the foot. The generated drawing
// merged the emblem's lines into the gold disc, so the cover read as a glowing orb on a pedestal; here the globe keeps
// its latitude and longitude. Cover, emblem and bar are the generator's model and light (_clay-core.mjs); the globe
// lines are laid on through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const COVER = 'M7 2.5H17A2 2 0 0 1 19 4.5V19.5A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
const EMBLEM = 'M15.4 9.8A3.4 3.4 0 1 1 8.6 9.8A3.4 3.4 0 1 1 15.4 9.8Z'
const BAR = 'M10.2 17.8H13.8'

export default function render(icon) {
  const name = (icon && icon.name) || 'passport'
  const nodes = build(skeleton(name, [
    { d: COVER, plate: 'K', fill: true },
    { d: EMBLEM, plate: 'A', fill: true },
    { d: BAR, plate: 'A' },
  ])) || []
  const SH = 'var(--with-clay-shadow, #0E2D70)', SN = 'var(--with-clay-shine, #FFFFFF)'
  // globe lines pressed into the gold disc: equator and a meridian, each with a lit lip below
  const [cx, cy] = tf(12, 9.8), R = r2(3.4 * s)
  const eq = d => ({ d, stroke: SH, 'stroke-opacity': 0.5, 'stroke-width': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' })
  const lit = d => ({ d, stroke: SN, 'stroke-opacity': 0.55, 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' })
  const equator = y => `M${r2(cx - R + 0.45)} ${y}H${r2(cx + R - 0.45)}`
  const merid = dy => `M${cx} ${r2(cy - R + 0.45 + dy)}A${r2(R * 0.5)} ${r2(R - 0.45)} 0 0 1 ${cx} ${r2(cy + R - 0.45 + dy)}A${r2(R * 0.5)} ${r2(R - 0.45)} 0 0 1 ${cx} ${r2(cy - R + 0.45 + dy)}Z`
  nodes.push(['path', lit(equator(r2(cy + 0.22)))])
  nodes.push(['path', lit(merid(0.22))])
  nodes.push(['path', eq(equator(cy))])
  nodes.push(['path', eq(merid(0))])
  void ellD
  return nodes
}
