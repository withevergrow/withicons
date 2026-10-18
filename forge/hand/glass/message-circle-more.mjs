// forge/hand/glass/message-circle-more.mjs: a round frosted chat bubble with a rounded tail; the three typing dots are punched
// clean through the pane and filled with solid deep indigo glass beads, so they stay dark and legible at 16px. Dots are wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const tidy = s => s
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const disc = (cx, cy, r) => setOf([circle(cx, cy, r, 0.12)])
const stroke = (pts, w) => roundStrokeSet(pts, w)
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const soften = (s, r) => { try { return dilate(erode(s, r), r) } catch { return s } }
const close = (s, r) => { try { return erode(dilate(s, r), r) } catch { return s } }
const rr = (x0, y0, x1, y1, r) => area(`M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`)
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

function kit(NAME) {
  let n = 0
  const defs = [], out = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const blue = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 2, y1: 2, x2: 21, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.45, V.tint, 0.5), stop(1, V.tint, 0.36)])
  const shadow = all => {
    const h = translateSet(all, 0.55, 1)
    out.push(['path', { d: D(dilate(h, 0.8), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
    out.push(['path', { d: D(dilate(h, 0.3), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  }
  const glowOf = (cx, cy, r = 7.5) => grad('radialGradient', { cx, cy, r }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const piece = (F, o = {}) => {
    const cls = o.cls || 'wm-k'
    const B = translateSet(tidy(erode(F, 0.3)), 0.55, 0.55)
    out.push(['path', { d: D(B), fill: o.body || blue, 'fill-rule': 'evenodd', class: cls }])
    if (o.glow) out.push(['path', { d: D(B), fill: o.glow, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(F), fill: frost, ...EDGE, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  }
  const bead = (F, fill, cls = 'wm-s') => {
    out.push(['path', { d: D(F), fill, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.8, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  }
  return { defs, out, grad, blue, frost, shadow, glowOf, piece, bead, done: () => [['defs', {}, defs], ...out] }
}

export default function render(icon) {
  const k = kit((icon && icon.name) || 'message-circle-more')
  const F0 = soften(area('M4.81 15.9A9 9 0 1 1 10.27 20.09L2.8 21.2Z'), 0.55)
  const dots = [[8.1, 11.6], [12.6, 11.6], [17.1, 11.6]].map(([x, y]) => disc(x, y, 1.6))
  const holes = unionSets(dots)
  const F = differenceSets(F0, holes)
  k.shadow(F0)
  const B0 = translateSet(tidy(erode(F0, 0.3)), 0.55, 0.55)
  const B = differenceSets(B0, holes)
  k.out.push(['path', { d: D(B), fill: k.blue, 'fill-rule': 'evenodd' }])
  k.out.push(['path', { d: D(B), fill: k.glowOf(16.5, 15, 8), 'fill-rule': 'evenodd' }])
  k.out.push(['path', { d: D(F), fill: k.frost, ...EDGE, 'fill-rule': 'evenodd' }])
  k.out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  const g = k.grad('linearGradient', { x1: 6, y1: 9.5, x2: 19, y2: 13.5 }, [stop(0, V.etch), stop(1, V.shadow)])
  k.out.push(['path', { d: D(holes), fill: g, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.35, 'fill-rule': 'evenodd', class: 'wm-a' }])
  const ticks = unionSets(dots.map(d => differenceSets(erode(d, 0.1), translateSet(erode(d, 0.1), 0.35, 0.5))))
  k.out.push(['path', { d: D(ticks), fill: V.shine, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-a' }])
  return k.done()
}
