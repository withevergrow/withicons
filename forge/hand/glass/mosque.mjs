// forge/hand/glass/mosque.mjs: a frosted mosque in three tinted pieces (rose dome, violet hall, slim minaret), a deep arched door and a crisp accent crescent on top.
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
  const k = kit('mosque')
  const dome = area('M4.6 12.4C4.6 9.4 7 7.6 9.6 6C12.2 7.6 14.6 9.4 14.6 12.4Z')
  const hall = area('M4 13.2H15.6A0.8 0.8 0 0 1 16.4 14V20.6H3.2V14A0.8 0.8 0 0 1 4 13.2Z')
  const minaret = area('M17.9 20.6V9.6L19.35 5.6L20.8 9.6V20.6Z')
  const moon = differenceSets(circ(9.6, 3.6, 1.55), circ(10.35, 3.05, 1.25))
  k.shadow(unionSets([dome, hall, minaret]))
  k.piece(minaret, k.blue, 'wm-s')
  k.piece(hall, k.blue, 'wm-k')
  k.piece(dome, k.pink, 'wm-k')
  k.out.push(['path', { d: 'M8.1 20.6V17.3A1.5 1.5 0 0 1 11.1 17.3V20.6Z', fill: V.etch, class: 'wm-k' }])
  k.out.push(['path', { d: 'M18.4 11.6H20.3', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  k.bead(moon, V.accent, 'wm-a')
  return k.done()
}
