// forge/hand/glass/book.mjs: a closed glass book. A deep violet spine band runs down the left with a hinge groove, the frosted
// cover carries a rose bookmark ribbon and two etched title lines, and a bright block of pages with etched leaf lines shows
// below the cover, so it cannot be mistaken for a tablet or a card.
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
  const k = kit('book')
  const whole = area(rr(4.6, 2.5, 19.2, 20.6, 2.2))
  const cover = area(rr(4.6, 2.5, 19.2, 16.8, 2.2))
  const pages = area(rr(6.2, 14, 18.4, 20.6, 1.5))
  const spine = area('M6.8 2.5H8.9V16.8H6.8A2.2 2.2 0 0 1 4.6 14.6V4.7A2.2 2.2 0 0 1 6.8 2.5Z')
  k.shadow(whole)
  k.bead(pages, k.grad('linearGradient', { x1: 6, y1: 14, x2: 18, y2: 21 }, [stop(0, V.frost, 0.98), stop(1, V.tint)]))
  const leaf = { fill: 'none', stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linecap': 'round' }
  k.out.push(['path', { d: 'M8.2 18.1H16.2', ...leaf }])
  k.out.push(['path', { d: 'M8.2 19.4H16.2', ...leaf }])
  const glow = k.grad('radialGradient', { cx: 16, cy: 15, r: 7 }, [stop(0, V.accent, 0.55), stop(1, V.accent, 0)])
  k.piece(cover, k.blue, 'wm-k', glow)
  k.bead(area('M13.9 2.5H16.7V8.4L15.3 7.1L13.9 8.4Z'), k.pink, 'wm-a')
  k.bead(spine, k.grad('linearGradient', { x1: 4.6, y1: 2.5, x2: 9, y2: 16.8 }, [stop(0, V.c1), stop(1, V.shadow)]))
  k.out.push(['path', { d: 'M9.4 3.4V15.9', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.6, 'stroke-linecap': 'round' }])
  const ttl = { fill: 'none', stroke: V.etch, 'stroke-opacity': 0.75, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-a' }
  k.out.push(['path', { d: 'M11.2 10.2H15.6', ...ttl }])
  k.out.push(['path', { d: 'M11.2 12.6H14', ...ttl }])
  return k.done()
}
