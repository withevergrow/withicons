// forge/hand/glass/meh.mjs: frosted glass face with two solid etch-ink eyes and a thick straight mouth bar, so the neutral face reads at 16px.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const stroke = (pts, w) => roundStrokeSet(pts, w)
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

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
    out.push(['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
    out.push(['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  }
  const piece = (F, body = blue, cls = 'wm-k', glow = null) => {
    const B = translateSet(erode(F, 0.3), 0.55, 0.55)
    out.push(['path', { d: D(B), fill: body, class: cls }])
    if (glow) out.push(['path', { d: D(B), fill: glow, class: cls }])
    out.push(['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  }
  // a solid glass bead (berry, crescent): saturated body with hairline and a specular tick
  const bead = (F, body, cls) => {
    out.push(['path', { d: D(F), fill: body, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  }
  return { defs, out, grad, blue, pink, frost, shadow, piece, bead, done: () => [['defs', {}, defs], ...out] }
}
const circ = (cx, cy, r) => area(`M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`)

export default function render() {
  const k = kit('meh')
  const face = circ(11.6, 11.6, 9.3)
  k.shadow(face)
  const glow = k.grad('radialGradient', { cx: 16, cy: 16.5, r: 8 }, [stop(0, V.accent, 0.55), stop(1, V.accent, 0)])
  k.piece(face, k.blue, 'wm-k', glow)
  k.out.push(['circle', { cx: 8.5, cy: 9.5, r: 1.8, fill: 'currentColor', class: 'wm-a' }])
  k.out.push(['circle', { cx: 14.7, cy: 9.5, r: 1.8, fill: 'currentColor', class: 'wm-a' }])
  k.out.push(['rect', { x: 7.6, y: 14.3, width: 8, height: 1.8, rx: 0.9, fill: 'currentColor', class: 'wm-a' }])
  return k.done()
}
