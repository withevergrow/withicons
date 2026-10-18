// forge/hand/glass/chopsticks.mjs: a glass rice bowl with a clear rim ellipse (deep violet inside) under a frosted front wall on
// a small foot, and two thick tapered chopsticks, one rose and one violet, rising at an angle out of it so they stay
// visible at 16px. Chopsticks are plate A (wm-a, nod at 19 2.5).
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
  const k = kit('chopsticks')
  const front = area('M3.3 12.6A8.7 2.2 0 0 0 20.7 12.6C20.7 17.5 17.4 19.7 14.4 19.9L14.9 21.3H9.1L9.6 19.9C6.6 19.7 3.3 17.5 3.3 12.6Z')
  const rim = area('M3.3 12.6A8.7 2.2 0 0 1 20.7 12.6A8.7 2.2 0 0 1 3.3 12.6Z')
  const r1 = dilate(area('M9.3 12.9L16.1 3.4L17.2 4.2L10.1 13.2Z'), 0.35)
  const r2 = dilate(area('M12.8 13.1L19.9 4.5L21 5.3L13.6 13.3Z'), 0.35)
  k.shadow(unionSets([front, rim, r1, r2]))
  const inside = k.grad('linearGradient', { x1: 3, y1: 10, x2: 20, y2: 15 }, [stop(0, V.shadow), stop(1, V.c1)])
  const backBody = translateSet(erode(unionSets([front, rim]), 0.3), 0.55, 0.55)
  k.out.push(['path', { d: D(backBody), fill: k.blue, ...EO, class: 'wm-k' }])
  k.out.push(['path', { d: D(rim), fill: inside, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k' }])
  const rodStyle = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }
  k.out.push(['path', { d: D(r2), fill: k.blue, ...rodStyle }])
  k.out.push(['path', { d: D(r1), fill: k.pink, ...rodStyle }])
  k.out.push(['path', { d: D(unionSets([rimOf(r1, 0.3), rimOf(r2, 0.3)])), fill: V.shine, 'fill-opacity': 0.8, ...EO, class: 'wm-a wm-shine' }])
  const glow = k.grad('radialGradient', { cx: 15.5, cy: 17, r: 6.5 }, [stop(0, V.accent, 0.55), stop(1, V.accent, 0)])
  k.out.push(['path', { d: D(translateSet(erode(front, 0.3), 0.4, 0.5)), fill: glow, ...EO, class: 'wm-k' }])
  k.out.push(['path', { d: D(front), fill: k.frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, ...EO, class: 'wm-k' }])
  k.out.push(['path', { d: D(rimOf(front)), fill: V.shine, 'fill-opacity': 0.85, ...EO, class: 'wm-shine' }])
  return k.done()
}
