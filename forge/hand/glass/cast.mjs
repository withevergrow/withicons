// forge/hand/glass/cast.mjs — the glass cast icon. Generated Glass flooded the screen with the pink glow and drew the
// waves as hairline arcs that sank into it. Here the screen is a calm frosted pane with a flat violet inset display (a
// bezel you can read), cut away in a clean quarter-disc at its lower left, and the broadcast is three bold accent glass
// rods (a dot and two arcs, each with a frost halo) sitting in that clear corner, well apart from the pane.
// Pane is the body; dot and arcs are wm-a (they pulse outward in motion).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'

const NAME = 'cast'
const r2 = v => +v.toFixed(2)
const F = v => r2(12 + (v - 12) * G.SCALE - 0.5)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
const S = G.SCALE
const P = (x, y) => `${F(x)} ${F(y)}`
const R = v => r2(v * S)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const OUT = 'M2 7.5 V6 A2 2 0 0 1 4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H14.5 A12.5 12.5 0 0 0 2 7.5 Z'
// arcs about the corner (2, 20): radius -> end points on the left edge and bottom edge
const arc = rad => `M${F(2.0)} ${F(20 - rad)} A${r2(rad * S)} ${r2(rad * S)} 0 0 1 ${F(2 + rad)} ${F(20)}`

export default function render() {
  const subs = parsePath(OUT)
  const set = setOf(subs.map(s => s.pts))
  const icon = { name: NAME, paths: [], lines: [], cutouts: [], fills: [{ d: OUT, subs, set }], fillSet: set }
  const L = softLayers(icon)
  if (!L) return null
  L.edge = 0.3; L.frost = 0.9
  const { defs, out } = softPaint(L, NAME)
  const g = (a, stops) => { const n = ['linearGradient', { id: `wg-glass-${NAME}-${defs.length}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(n); return `url(#${n[1].id})` }
  const disp = g({ x1: F(4), y1: F(6), x2: F(20), y2: F(18) }, [stop(0, V.c1, 0.8), stop(1, V.shadow, 0.9)])
  const rod = g({ x1: F(2), y1: F(11), x2: F(11), y2: F(20) }, [stop(0, V.accent, 0.92), stop(1, V.accent, 1)])
  const rodStyle = { fill: 'none', 'stroke-linecap': 'round' }
  const marks = [
    // the display: a flat violet glass inset in the frosted bezel, lit at its top-left edge
    ['path', { d: `M${P(4, 7)}A${R(1)} ${R(1)} 0 0 1 ${P(5, 6)}H${F(19)}A${R(1)} ${R(1)} 0 0 1 ${P(20, 7)}V${F(17)}A${R(1)} ${R(1)} 0 0 1 ${P(19, 18)}H${F(13)}A${R(11.18)} ${R(11.18)} 0 0 0 ${P(4, 9)}Z`, fill: disp, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.4, class: 'wm-k' }],
  ]
  const sig = []
  for (const w of [4.9, 8.9]) {
    sig.push(['path', { d: arc(w), ...rodStyle, stroke: V.frost, 'stroke-opacity': 0.85, 'stroke-width': 3.6, class: 'wm-a' }])
    sig.push(['path', { d: arc(w), ...rodStyle, stroke: rod, 'stroke-width': 2.2, class: 'wm-a' }])
    sig.push(['path', { d: arc(w - 0.45), ...rodStyle, stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.4, class: 'wm-shine' }])
  }
  sig.push(['circle', { cx: F(2.6), cy: F(19.4), r: 2.2, fill: V.frost, 'fill-opacity': 0.85, class: 'wm-a' }])
  sig.push(['circle', { cx: F(2.6), cy: F(19.4), r: 1.3, fill: V.accent, class: 'wm-a' }])
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks, ...sig)
  return [['defs', {}, defs], ...out]
}
