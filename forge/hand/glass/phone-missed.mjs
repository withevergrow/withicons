// forge/hand/glass/phone-missed.mjs: a frosted telephone handset with a crisp accent missed-call arrow (bent head, straight shaft)
// in the clear upper right, well away from the receiver, so the badge no longer lumps into the handset. Arrow is wm-s.
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
  const k = kit((icon && icon.name) || 'phone-missed')
  const H0 = area('M3 5A2 2 0 0 1 5 3H8A1.5 1.5 0 0 1 9.5 4.5V6C9.5 7.25 8.5 7.25 8.5 8.5A7 7 0 0 0 15.5 15.5C16.75 15.5 16.75 14.5 18 14.5H19.5A1.5 1.5 0 0 1 21 16V19A2 2 0 0 1 19 21A16 16 0 0 1 3 5Z')
  const H = tidy(translateSet(H0, 0, 0))
  const arrow = unionSets([stroke([[20.4, 3.6], [15.2, 8.8]], 2.4), stroke([[14.9, 4.6], [14.9, 9.1], [19.4, 9.1]], 2.4)])
  const A = soften(arrow, 0.2)
  k.shadow(unionSets([H, A]))
  k.piece(H, { glow: k.glowOf(17, 18, 8) })
  k.bead(A, V.accent)
  return k.done()
}
