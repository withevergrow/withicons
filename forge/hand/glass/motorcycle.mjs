// forge/hand/glass/motorcycle.mjs: a side-on motorcycle in frosted glass built from distinct parts: hollow glass wheels, a dark
// violet engine block and swingarm, a dark seat, a bright accent-glow fuel tank, an indigo fork and handlebar, accent headlight.
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
  const k = kit((icon && icon.name) || 'motorcycle')
  const T = s => translateSet(s, 0, -0.4)
  const RW = [5.2, 16.2], FW = [18.8, 16.2]
  const ring = ([cx, cy]) => differenceSets(disc(cx, cy, 3.8), disc(cx, cy, 2.2))
  const wheels = T(unionSets([ring(RW), ring(FW)]))
  const dark = k.grad('linearGradient', { x1: 4, y1: 8, x2: 16, y2: 18 }, [stop(0, V.c1), stop(1, V.shadow)])
  const tankBody = k.grad('linearGradient', { x1: 9, y1: 7, x2: 15, y2: 12 }, [stop(0, V.frost, 0.9), stop(1, V.tint, 0.7)])
  const engine = T(unionSets([rr(8.6, 12.4, 13.8, 16.8, 1.2), stroke([[5.2, 16.2], [9.4, 14]], 1.7)]))
  const seat = T(rr(3.2, 9.8, 10.2, 11.8, 1))
  const tank = T(area('M9.2 10.8Q9 7.6 11.6 7.4H13.4Q15.2 7.5 15.2 9.4V10.8Q15.2 11.9 14.2 11.9H10.3Q9.3 11.9 9.2 10.8Z'))
  const fork = T(unionSets([stroke([[15.6, 9.2], [18.8, 16.2]], 1.8), stroke([[15.9, 8.4], [15.4, 6.2], [13.2, 5.6]], 1.6)]))
  const hubs = T(unionSets([disc(RW[0], RW[1], 0.95), disc(FW[0], FW[1], 0.95)]))
  const lamp = T(disc(17.6, 8.2, 1.25))
  k.shadow(unionSets([wheels, engine, seat, tank, fork]))
  k.piece(wheels)
  // engine block + swingarm and seat: deep violet glass so they stand apart from the pale tank
  k.piece(engine, { body: dark })
  k.out.push(['path', { d: D(engine), fill: V.c1, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-k' }])
  // cooling fins cut as light slits across the engine
  k.out.push(['path', { d: D(unionSets([stroke([[9.6, 14.4], [12.8, 14.4]], 0.4), stroke([[9.6, 15.7], [12.8, 15.7]], 0.4)])), fill: V.shine, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  k.piece(seat, { body: dark })
  k.out.push(['path', { d: D(seat), fill: V.c1, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-k' }])
  // tank: bright frost with the accent glow
  k.piece(tank, { body: tankBody, glow: k.glowOf(12.4, 9.6, 4.5) })
  const g = k.grad('linearGradient', { x1: 13, y1: 5, x2: 19, y2: 16 }, [stop(0, V.etch), stop(1, V.shadow)])
  k.out.push(['path', { d: D(fork), fill: g, stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.4, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-k' }])
  k.out.push(['path', { d: D(rimOf(fork)), fill: V.shine, 'fill-opacity': 0.5, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  k.bead(hubs, V.accent, 'wm-k')
  k.bead(lamp, V.accent, 'wm-k')
  return k.done()
}
