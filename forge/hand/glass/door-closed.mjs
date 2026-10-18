// forge/hand/glass/door-closed.mjs — the glass closed door. Generated Glass drew a plain rounded slab, which read as
// a tombstone. Here the door is a tall frosted slab standing on a deeper violet threshold, with two recessed panels
// pressed into its face (a tall upper, a lower) and a bright accent knob with a frost halo on its latch side. The panels
// are inset glass with a dark upper-left lip and a light lower-right lip, like carved wood. Door is the body (wm-k),
// panels and knob are wm-a, the threshold is wm-k.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'door-closed'
const r2 = v => +v.toFixed(2)
const F = v => r2(12 + (v - 12) * G.SCALE - 0.5)
const R = v => r2(v * G.SCALE)
const P = (x, y) => `${F(x)} ${F(y)}`
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
// a rounded rectangle in the pane frame (corner radius r, skeleton units)
const rr = (x0, y0, x1, y1, r) => `M${P(x0 + r, y0)}H${F(x1 - r)}A${R(r)} ${R(r)} 0 0 1 ${P(x1, y0 + r)}V${F(y1 - r)}A${R(r)} ${R(r)} 0 0 1 ${P(x1 - r, y1)}H${F(x0 + r)}A${R(r)} ${R(r)} 0 0 1 ${P(x0, y1 - r)}V${F(y0 + r)}A${R(r)} ${R(r)} 0 0 1 ${P(x0 + r, y0)}Z`

const DOOR = 'M5 20 V5 A2 2 0 0 1 7 3 H17 A2 2 0 0 1 19 5 V20 Z'
const LEDGE = 'M3.5 20 H20.5 A1 1 0 0 1 21.5 21 A1 1 0 0 1 20.5 22 H3.5 A1 1 0 0 1 2.5 21 A1 1 0 0 1 3.5 20 Z'

export default function render() {
  const ds = parsePath(DOOR), ls = parsePath(LEDGE)
  const sets = [setOf(ds.map(s => s.pts)), setOf(ls.map(s => s.pts))]
  const set = unionSets(sets)
  const icon = { name: NAME, paths: [], lines: [], cutouts: [], fills: [{ d: DOOR, subs: [...ds, ...ls], set }], fillSet: set }
  const L = softLayers(icon)
  if (!L) return null
  L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const g = (tag, a, stops) => { const n = [tag, { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const deep = g('linearGradient', { x1: F(3), y1: F(20), x2: F(21), y2: F(22) }, [stop(0, V.c1, 0.9), stop(1, V.shadow, 0.95)])
  const panel = g('linearGradient', { x1: F(8), y1: F(5), x2: F(16), y2: F(19) }, [stop(0, V.c1, 0.28), stop(1, V.shadow, 0.4)])
  const knob = g('radialGradient', { cx: F(15.2), cy: F(12.1), r: 1.5 }, [stop(0, V.shine, 0.95), stop(0.45, V.accent, 1), stop(1, V.accent, 1)])
  const marks = [
    // the threshold: a deeper violet ledge the door stands on, with a light lip
    ['path', { d: `M${P(3.6, 20.1)}H${F(20.4)}A${R(0.9)} ${R(0.9)} 0 0 1 ${P(21.3, 21)}A${R(0.9)} ${R(0.9)} 0 0 1 ${P(20.4, 21.9)}H${F(3.6)}A${R(0.9)} ${R(0.9)} 0 0 1 ${P(2.7, 21)}A${R(0.9)} ${R(0.9)} 0 0 1 ${P(3.6, 20.1)}Z`, fill: deep, class: 'wm-k' }],
    ['path', { d: `M${P(4, 20.3)}H${F(19)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-k' }],
    // recessed panels: upper tall, lower shorter; dark lip upper-left, light lip lower-right
    ['path', { d: rr(7.8, 5.6, 16.2, 10.8, 1.1), fill: panel, class: 'wm-a' }],
    ['path', { d: rr(7.8, 14.4, 16.2, 18.4, 1.1), fill: panel, class: 'wm-a' }],
    ['path', { d: `M${P(7.9, 10.2)}V${F(6.7)}Q${P(7.9, 5.7)} ${P(8.9, 5.7)}H${F(15)}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: `M${P(7.9, 18)}V${F(15.4)}Q${P(7.9, 14.5)} ${P(8.9, 14.5)}H${F(15)}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: `M${P(16.1, 6.9)}V${F(9.8)}Q${P(16.1, 10.7)} ${P(15.2, 10.7)}H${F(9)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: `M${P(16.1, 15.5)}V${F(17.3)}Q${P(16.1, 18.3)} ${P(15.2, 18.3)}H${F(9)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    // the knob: accent ball with a frost halo, and a back plate
    ['path', { d: rr(14.3, 10.6, 17.1, 14.6, 1.3), fill: V.frost, 'fill-opacity': 0.55, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-a' }],
    ['circle', { cx: F(15.7), cy: F(12.6), r: 1.25, fill: knob, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
