// forge/hand/clay/syringe.mjs — a teal clay syringe on the diagonal: a long wide barrel (8u by 4.5u, the icon's main mass) with three pressed graduation marks,
// a round nozzle hub, a fine steel needle with a sharp tip, and a short orange plunger (2u rod) with a wide finger flange and a
// clearly narrower thumb pad, so the barrel dominates and the plunger never reads as a crossguard. The generator drew a narrow barrel whose two graduation slots became dark pits (it grew a face) and a needle as
// fat as the plunger, so it read as a dagger or a creature; here the barrel is wide, the marks are creases, the flange
// and thumb pad give the 16px silhouette its syringe cross and the needle is thin. Same model, light and colour as the
// generator (_clay-core.mjs) for the clay; the needle is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { BASE } from '../../styles/_clay-color.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const col = r => `var(--with-clay-${r}, ${BASE[r]})`
const r2 = n => Math.round(n * 100) / 100

// drawn upright (needle down) and baked onto the skeleton's diagonal: 45 degrees about the centre, needle bottom-left,
// stretched 1.1 so the long thin object carries the same optical weight as its square siblings
const C = Math.SQRT1_2 * 1.1
const rot = (x, y) => [12 + (x - 12) * C - (y - 12) * C, 12 + (x - 12) * C + (y - 12) * C]
// the clay model's placement (scale 0.84 about the centre, lifted 0.95): skeleton point -> drawing point
const place = ([x, y]) => [(x - 12) * 0.84 + 12, (y - 12) * 0.84 + 12 - 0.95]
const pt = (p, f = q => q) => { const [x, y] = f(rot(...p)); return `${r2(x)} ${r2(y)}` }
const line = (a, b) => `M${pt(a)} L${pt(b)}`
// rounded rectangle (upright coordinates), corner radius r
function rrect(x0, y0, x1, y1, r) {
  const ar = r2(r * 1.1)
  return `M${pt([x0 + r, y0])} L${pt([x1 - r, y0])} A${ar} ${ar} 0 0 1 ${pt([x1, y0 + r])} L${pt([x1, y1 - r])} A${ar} ${ar} 0 0 1 ${pt([x1 - r, y1])}` +
    ` L${pt([x0 + r, y1])} A${ar} ${ar} 0 0 1 ${pt([x0, y1 - r])} L${pt([x0, y0 + r])} A${ar} ${ar} 0 0 1 ${pt([x0 + r, y0])} Z`
}

const BARREL = rrect(9.75, 8.5, 14.25, 16.5, 0.75)

export default function render(icon) {
  const name = (icon && icon.name) || 'syringe'
  const nodes = build(skeleton(name, [
    { d: BARREL, plate: 'K', fill: true },
    // graduation marks: K lines deep inside the barrel are pressed creases
    { d: line([10.75, 10.5], [12.5, 10.5]) + line([10.75, 12.5], [13, 12.5]) + line([10.75, 14.5], [12.5, 14.5]), plate: 'K' },
    { d: line([12, 17.9], [12, 18.8]), plate: 'K' },                  // nozzle hub
    { d: line([8.5, 7.5], [15.5, 7.5]), plate: 'A' },                   // finger flange, 7u
    { d: line([12, 7.5], [12, 4]), plate: 'A' },                  // plunger rod, 2u exposed
    { d: line([10.25, 3.9], [13.75, 3.9]), plate: 'A' },             // thumb pad, 3.5u
  ]))
  // the needle: a fine steel spike out of the hub, behind it, with a lit edge and a sharp tip
  const P = q => pt(q, place)
  const needle = `M${P([11.4, 19.4])} L${P([12.6, 19.4])} L${P([12.4, 23])} L${P([12, 24.6])} L${P([11.6, 23])} Z`
  const at = nodes.findIndex(n => n[0] !== 'defs' && !(n[1].class || '').includes('wm-shadow'))
  nodes.splice(at < 0 ? nodes.length : at, 0,
    ['path', { d: needle, fill: col('tint'), stroke: col('shadow'), 'stroke-opacity': 0.85, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: needle, fill: col('shadow'), 'fill-opacity': 0.32, class: 'wm-k' }],   // steel tone over the tint
    ['path', { d: `M${P([11.75, 20])} L${P([11.8, 22.9])}`, stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.22, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return nodes
}
