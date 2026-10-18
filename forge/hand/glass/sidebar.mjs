// forge/hand/glass/sidebar.mjs — a slim frosted window frame with the left rail filled in glowing accent glass.
// The generated drawing was a thick white frame around a pale panel (an empty door). Here the frame is thin so the
// split reads at 16px, the rail is the one saturated part, and the main area stays clear glass with etched content lines.
// Roles: back/shadow body, pane/frost frame, accent rail, etch content lines, shine rim. Motion: frame wm-k, rail wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, translateSet, setOf, differenceSets } from '../../kernel/bool.mjs'

const NAME = 'sidebar'
const X0 = 2.5, Y0 = 2.5, X1 = 20.7, Y1 = 20.7, R = 3.4      // outer window
const T = 1.5                                                 // frame thickness
const DX = 9.6                                                // rail / main split

const f = v => +v.toFixed(2)
const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const rr = (x0, y0, x1, y1, r) => `M${f(x0 + r)} ${f(y0)}H${f(x1 - r)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y0 + r)}V${f(y1 - r)}A${r} ${r} 0 0 1 ${f(x1 - r)} ${f(y1)}H${f(x0 + r)}A${r} ${r} 0 0 1 ${f(x0)} ${f(y1 - r)}V${f(y0 + r)}A${r} ${r} 0 0 1 ${f(x0 + r)} ${f(y0)}Z`
const D = (set, t = 0.04) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.04), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  const outer = area(rr(X0, Y0, X1, Y1, R))
  const inner = area(rr(X0 + T, Y0 + T, X1 - T, Y1 - T, R - T + 0.2))
  const frame = differenceSets(outer, inner)
  // the rail: the inner area's left part, inset by the divider
  const railArea = area(`M${f(X0 + T + R - T + 0.2)} ${f(Y0 + T)}H${DX}V${f(Y1 - T)}H${f(X0 + T + R - T + 0.2)}A${f(R - T + 0.2)} ${f(R - T + 0.2)} 0 0 1 ${f(X0 + T)} ${f(Y1 - T - (R - T + 0.2))}V${f(Y0 + T + (R - T + 0.2))}A${f(R - T + 0.2)} ${f(R - T + 0.2)} 0 0 1 ${f(X0 + T + R - T + 0.2)} ${f(Y0 + T)}Z`)
  const mainArea = differenceSets(inner, area(`M0 0H${DX + 1.2}V24H0Z`))
  const divider = differenceSets(area(`M${DX} ${Y0}H${f(DX + 1.2)}V${Y1}H${DX}Z`), differenceSets(outer, outer))
  const out = []

  const back = translateSet(outer, 0.7, 0.7)
  out.push(['path', { d: D(translateSet(back, 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-shadow' }])
  out.push(['path', { d: D(back), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), 'fill-rule': ev, class: 'wm-k' }])
  // clear main area: faint frosted glass over the colour behind
  out.push(['path', { d: D(mainArea), fill: grad('linearGradient', { x1: 10, y1: 3, x2: 20, y2: 21 }, [stop(0, V.frost, 0.8), stop(1, V.tint, 0.5)]), 'fill-rule': ev, class: 'wm-k' }])
  // the rail: accent glass
  out.push(['path', { d: D(translateSet(railArea, 0.3, 0.45)), fill: V.shadow, 'fill-opacity': 0.4, 'fill-rule': ev, class: 'wm-a' }])
  out.push(['path', { d: D(railArea), fill: V.accent, 'fill-rule': ev, class: 'wm-a' }])
  out.push(['path', { d: D(railArea), fill: grad('linearGradient', { x1: 4, y1: 4, x2: 9.5, y2: 20 }, [stop(0, V.shine, 0.5), stop(0.6, V.shine, 0.08), stop(1, V.shine, 0)]), 'fill-rule': ev, class: 'wm-a' }])
  // frame + divider in frosted pane
  out.push(['path', {
    d: D(unionSets([frame, divider])), fill: grad('linearGradient', { x1: 2, y1: 2.5, x2: 19, y2: 21 }, [stop(0, V.frost, 0.78), stop(0.45, V.tint, 0.7), stop(1, V.tint, 0.55)]),
    'fill-rule': ev, class: 'wm-k',
  }])
  out.push(['path', { d: D(outer), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // lit rims: the frame's top-left edge and the divider's left edge
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: `M3.3 ${Y1 - R}V${Y0 + R}A${R - 0.8} ${R - 0.8} 0 0 1 ${f(X0 + R)} 3.3H${f(X1 - R)}`, ...rim }])
  out.push(['path', { d: `M${f(DX + 0.25)} ${Y0 + T + 0.4}V${Y1 - T - 0.4}`, ...rim, 'stroke-opacity': 0.8 }])
  // rail items: three little lit dashes; main area: etched content lines
  const dash = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.92, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-a' }
  out.push(['path', { d: 'M5.3 7.6H7.9M5.3 10.8H7.9M5.3 14H7.9', ...dash }])
  out.push(['path', { d: 'M13.1 7.6H18M13.1 11.2H16.3', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
  return [['defs', {}, defs], ...out]
}
