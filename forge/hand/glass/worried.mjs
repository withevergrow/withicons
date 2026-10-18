// forge/hand/glass/worried.mjs — the worried face. Generated Glass left the features as hairline etches on a pale pane
// (the face read blank) and the sweat drop as a pink blob. Here the face is one round glass pane with bold deep-ink
// features: two tall eyes with catch lights, brows slanting up toward the middle, a wavy mouth, and a clean accent
// sweat drop at the temple. Face wm-k, features wm-a (they fidget), drop wm-s (it drips).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const F = v => f2(12 + (v - 12) * G.SCALE - 0.5)
const P = ([x, y]) => `${F(x)} ${F(y)}`
const R = r => f2(r * G.SCALE)

const FX = 10.8, FY = 13.2, FR = 8.6
const FACE = `M${FX + FR} ${FY} A${FR} ${FR} 0 1 1 ${FX - FR} ${FY} A${FR} ${FR} 0 1 1 ${FX + FR} ${FY} Z`

function skel(shapes) {
  const fills = shapes.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name: 'hand', paths: [], fills, cutouts: [], lines: [], fillSet: fills.flatMap(f => f.set) }
}

export default function render() {
  const L = softLayers(skel([FACE]))
  if (!L) return null
  const { defs, out } = softPaint(L, 'worried')
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  const lit = { fill: 'none', stroke: V.shine, 'stroke-linecap': 'round', 'stroke-opacity': 0.95, class: 'wm-a' }
  // eyes sit low, brows high and slanted: the inner ends up
  const eyes = [[7.9, 13], [13.7, 13]]
  const marks = [
    ['path', { d: `M${P([5.7, 10.4])}L${P([9.6, 8.3])}`, ...ink, 'stroke-width': 1.5 }],
    ['path', { d: `M${P([15.9, 10.4])}L${P([12, 8.3])}`, ...ink, 'stroke-width': 1.5 }],
    ...eyes.map(([x, y]) => ['ellipse', { cx: F(x), cy: F(y), rx: R(1.3), ry: R(1.75), fill: V.etch, class: 'wm-a' }]),
    ...eyes.map(([x, y]) => ['path', { d: `M${F(x - 0.35)} ${F(y - 0.7)}h0`, ...lit, 'stroke-width': 0.85 }]),
    ['path', { d: `M${P([7.3, 18.6])}Q${P([9, 16.6])} ${P([10.8, 18.6])}T${P([14.3, 18.6])}`, ...ink, 'stroke-width': 1.5 }],
  ]
  // the sweat drop: an accent glass teardrop at the temple, outside the face
  const dx = 19.5, dy = 5.3
  const drop = `M${P([dx, dy - 3])}C${P([dx + 0.9, dy - 1.7])} ${P([dx + 1.75, dy - 0.5])} ${P([dx + 1.75, dy + 0.55])}A${R(1.75)} ${R(1.75)} 0 0 1 ${P([dx - 1.75, dy + 0.55])}C${P([dx - 1.75, dy - 0.5])} ${P([dx - 0.9, dy - 1.7])} ${P([dx, dy - 3])}Z`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4 }
  const sweat = [
    ['path', { d: drop, fill: V.accent, ...edge, class: 'wm-s' }],
    ['path', { d: `M${P([dx - 0.65, dy + 0.5])}C${P([dx - 0.7, dy - 0.2])} ${P([dx - 0.35, dy - 0.8])} ${P([dx, dy - 1.4])}`, fill: 'none', stroke: V.shine, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, 'stroke-width': 0.6, class: 'wm-s' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks, ...sweat)
  return [['defs', {}, defs], ...out]
}
