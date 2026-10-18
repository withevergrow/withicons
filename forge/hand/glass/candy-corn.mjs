// forge/hand/glass/candy-corn.mjs — the glass candy corn. Generated Glass drew one frosted cone with two faint etched
// hairlines, so in a one-colour palette the three bands were lost and it read as a traffic cone. Here the kernel is
// still one frosted pane (rim, shadow, colour body behind), but its three bands are real glass tones laid over it:
// a pale frost tip, an accent middle, a deep body-colour base, split by soft smile-shaped seams, and the tip is
// narrower and pointier. Bands are wm-a (the skeleton's A plate), the pane is the body.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'

const NAME = 'candy-corn'
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// the kernel, in skeleton coordinates: a pointed tip, straight sides, a rounded base
const OUT = 'M12 2.3 C12.85 2.3 13.55 2.95 14.1 4.2 L19.45 16.4 C20.4 19.3 17 21.6 12 21.6 C7 21.6 3.6 19.3 4.55 16.4 L9.9 4.2 C10.45 2.95 11.15 2.3 12 2.3 Z'
// seams (smiles) at the two band boundaries
const TIP = 'M12 2.3 C12.85 2.3 13.55 2.95 14.1 4.2 L16.21 9 Q12 11.2 7.79 9 L9.9 4.2 C10.45 2.95 11.15 2.3 12 2.3 Z'
const MID = 'M7.79 9 Q12 11.2 16.21 9 L18.49 14.2 Q12 16.4 5.51 14.2 Z'
const BASE = 'M5.51 14.2 Q12 16.4 18.49 14.2 L19.45 16.4 C20.4 19.3 17 21.6 12 21.6 C7 21.6 3.6 19.3 4.55 16.4 Z'

export default function render() {
  const subs = parsePath(OUT)
  const set = setOf(subs.map(s => s.pts))
  const icon = { name: NAME, paths: [], lines: [], cutouts: [], fills: [{ d: OUT, subs, set }], fillSet: set }
  const L = softLayers(icon)
  if (!L) return null
  L.edge = 0.34
  const { defs, out } = softPaint(L, NAME)
  const g = (a, stops) => { const n = ['linearGradient', { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const tipG = g({ x1: F(8), y1: F(2.5), x2: F(15), y2: F(9.5) }, [stop(0, V.frost, 0.95), stop(1, V.tint, 0.85)])
  const midG = g({ x1: F(6), y1: F(9), x2: F(18), y2: F(15) }, [stop(0, V.accent, 0.78), stop(1, V.accent, 0.95)])
  const baseG = g({ x1: F(5), y1: F(14), x2: F(19), y2: F(22) }, [stop(0, V.c1, 0.9), stop(1, V.shadow, 0.95)])
  const seam = { fill: 'none', stroke: V.etch, 'stroke-opacity': 0.2, 'stroke-width': 0.4, 'stroke-linecap': 'round' }
  const marks = [
    ['path', { d: T(BASE), fill: baseG, class: 'wm-a' }],
    ['path', { d: T(MID), fill: midG, class: 'wm-a' }],
    ['path', { d: T(TIP), fill: tipG, class: 'wm-a' }],
    // soft seams, with a light lip just above each (the lit edge of the lower band)
    ['path', { d: T('M7.79 9 Q12 11.2 16.21 9'), ...seam, class: 'wm-a' }],
    ['path', { d: T('M5.51 14.2 Q12 16.4 18.49 14.2'), ...seam, class: 'wm-a' }],
    ['path', { d: T('M8.2 10 Q12 12 15.8 10'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: T('M6.4 15.2 Q12 17.2 17.6 15.2'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    // edge of the pane again, over the bands
    ['path', { d: T(OUT), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
