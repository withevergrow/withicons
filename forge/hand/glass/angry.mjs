// forge/hand/glass/angry.mjs: a frosted glass face tinted warm (rose body glowing through the pane), with two heavy slanted
// etch-ink brows diving toward the nose, two solid eyes under them and a bold frown, so the temper reads at 16px.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, w * 0.66, w)) }
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const circ = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`
const EO = { 'fill-rule': 'evenodd' }

// one glass kit: shadow under everything, a colour body peeking down-right, a frosted pane with hairline and rim light
function kit(NAME) {
  let n = 0
  const defs = [], out = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const blue = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const pink = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.accent), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 3, y1: 3, x2: 19, y2: 19 }, [stop(0, V.frost, 0.62), stop(0.45, V.tint, 0.48), stop(1, V.tint, 0.34)])
  const shadow = all => {
    const h = translateSet(all, 0.55, 1)
    out.push(['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, ...EO, class: 'wm-shadow' }])
    out.push(['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.09, ...EO, class: 'wm-shadow' }])
  }
  const piece = (F, body = blue, cls = 'wm-k', glow = null) => {
    const B = translateSet(erode(F, 0.3), 0.55, 0.55)
    out.push(['path', { d: D(B), fill: body, ...EO, class: cls }])
    if (glow) out.push(['path', { d: D(B), fill: glow, ...EO, class: cls }])
    out.push(['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, ...EO, class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, ...EO, class: 'wm-shine' }])
  }
  // a solid glass bead: saturated body with hairline and a lit rim
  const bead = (F, body, cls = 'wm-k') => {
    out.push(['path', { d: D(F), fill: body, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, ...EO, class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.8, ...EO, class: 'wm-shine' }])
  }
  return { defs, out, grad, blue, pink, frost, shadow, piece, bead, done: () => [['defs', {}, defs], ...out] }
}

export default function render() {
  const k = kit('angry')
  const face = area(circ(11.6, 11.6, 9.3))
  k.shadow(face)
  const glow = k.grad('radialGradient', { cx: 16, cy: 17, r: 8 }, [stop(0, V.accent, 0.7), stop(1, V.accent, 0)])
  k.piece(face, k.pink, 'wm-k', glow)
  const ink = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  k.out.push(['path', { d: 'M5.9 7.2L10.3 9.3', ...ink, 'stroke-width': 2.1 }])
  k.out.push(['path', { d: 'M17.3 7.2L12.9 9.3', ...ink, 'stroke-width': 2.1 }])
  k.out.push(['circle', { cx: 8.6, cy: 12.2, r: 1.3, fill: 'currentColor', class: 'wm-a' }])
  k.out.push(['circle', { cx: 14.6, cy: 12.2, r: 1.3, fill: 'currentColor', class: 'wm-a' }])
  k.out.push(['path', { d: 'M7.9 17.6Q11.6 14 15.3 17.6', ...ink, 'stroke-width': 1.9 }])
  return k.done()
}
