// forge/hand/glass/fireplace.mjs — Glass fireplace, hand-drawn: the generated drawing froze mantel, chimney breast and
// hearth into one pale pane, so the mantel top was only a faint etched line and the firebox a small violet arch with a
// tiny frosted drop for a flame that vanished at 16px. Here the mantel is its own overhanging glass slab with a soft
// shadow under it, the chimney breast stands on a wider hearth step, and the firebox is a deep, dark opening with a warm
// accent glow, so one big luminous accent flame on a log is the single focal point.
// Roles: back/shadow body, pane/frost glass, etch firebox, accent flame + glow, shine rim. Motion: body wm-k (glows),
// flame and log are plate A (wm-a, flicker about 12 20.5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'fireplace'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.25).map(s => setOf([s.pts])))
const tube = (d, w) => unionSets(parsePath(d, 0.25).map(s => roundStrokeSet(s.pts, w, s.closed)))
const D = set => setD(set, 0.06)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // chimney breast on a wider hearth step, the arched firebox opening, the mantel slab on top
  const breast = area('M4.7 6.5 H19.3 V19.8 H4.7 Z')
  const step = area('M3.6 19.2 H20.4 A0.9 0.9 0 0 1 21.3 20.1 V20.6 A0.9 0.9 0 0 1 20.4 21.5 H3.6 A0.9 0.9 0 0 1 2.7 20.6 V20.1 A0.9 0.9 0 0 1 3.6 19.2 Z')
  const hole = area('M7.9 19.4 V15.3 A4.1 4.1 0 0 1 16.1 15.3 V19.4 Z')
  const mantel = area('M3.6 3.6 H20.4 A1.45 1.45 0 0 1 20.4 6.5 H3.6 A1.45 1.45 0 0 1 3.6 3.6 Z')
  const frame = differenceSets(unionSets([breast, step]), hole)
  const F = place(frame, -0.45)
  const M = place(mantel, -0.45)
  const H = place(hole, -0.45)
  const B = translateSet(place(erode(unionSets([breast, step, mantel]), 0.35), 0), 0.55, 0.5)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 12.6, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  // firebox: a deep dark opening with warm accent light rising from the fire
  const hd = D(H)
  out.push(['path', { d: hd, fill: grad('linearGradient', { x1: 12, y1: 10.8, x2: 12, y2: 19.2 }, [stop(0, V.etch, 0.95), stop(1, V.shadow, 0.9)]), class: 'wm-k' }])
  out.push(['path', { d: hd, fill: grad('radialGradient', { cx: 11.6, cy: 19.2, r: 3.6 }, [stop(0, V.accent, 0.7), stop(0.55, V.accent, 0.2), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // the frosted chimney breast and hearth step around the opening
  const pane = grad('linearGradient', { x1: 3.5, y1: 3, x2: 19, y2: 21 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.48), stop(1, V.tint, 0.34)])
  out.push(['path', { d: D(F), fill: pane, 'fill-rule': 'evenodd', ...edge, class: 'wm-k' }])
  // soft shadow the mantel casts on the breast, then the mantel slab itself
  out.push(['path', { d: D(translateSet(erode(M, 0.3), 0.35, 0.75)), fill: V.shadow, 'fill-opacity': 0.22, class: 'wm-shadow' }])
  out.push(['path', { d: D(M), fill: pane, ...edge, 'stroke-opacity': 0.36, class: 'wm-k' }])
  // the fire: one bold accent flame with a hot pale core, on a violet glass log
  const flame = place(area('M12 19.1C10.15 19.1 9.35 17.75 9.8 16.35C10.25 14.95 11.5 14.1 12.1 12.3C12.75 14.1 13.85 14.95 14.25 16.35C14.65 17.75 13.85 19.1 12 19.1Z'), -0.45)
  const fd = D(flame)
  out.push(['path', { d: fd, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.35, class: 'wm-a' }])
  out.push(['path', { d: fd, fill: grad('linearGradient', { x1: 12, y1: 12, x2: 12, y2: 18.6 }, [stop(0, V.shadow, 0.25), stop(0.5, V.shine, 0), stop(1, V.shine, 0.7)]), class: 'wm-a' }])
  const log = place(tube('M9.6 19.15H14.4', 1.4), -0.45)
  out.push(['path', { d: D(log), fill: body, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.35, class: 'wm-a' }])
  // lit rims: mantel, breast, the fire's flank
  out.push(['path', { d: D(unionSets([rimOf(M, 0.5), rimOf(F)])), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
