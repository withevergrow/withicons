// forge/hand/glass/baby.mjs — a baby's face in glass: a round frosted head with little ears, one bold curl of hair on
// the forehead, wide-set eyes low on the face, pink cheeks and a small open smile. The generated glass etched the curl as
// a faint ring and the eyes and mouth as pale hairlines, so the face read as a plain smiley or a bulb. Here the curl and
// features are in deep etch ink and the cheeks glow, so it reads as a baby at 16px, in the same pane recipe as smile.
// Roles: back/shadow body, pane/frost glass, accent glow + cheeks, etch features, shine rim. Motion: head wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, translateSet, erode, dilate, setOf } from '../../kernel/bool.mjs'

const NAME = 'baby'
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2 && Math.abs(ringArea(r)) > 0.04)
const D = (set, t = 0.03) => setD(tidy(set), t)
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

const HEAD = 'M20 13 A8 8 0 1 1 4 13 A8 8 0 1 1 20 13 Z'
const EARS = 'M4.6 10.9 A2.1 2.1 0 0 0 4.6 15.1 Z M19.4 10.9 A2.1 2.1 0 0 1 19.4 15.1 Z'
const CURL = 'M10.6 5.2 C12.4 4.3 14.6 5.2 14.3 7.1 C14.1 8.4 12.4 8.7 11.7 7.8 C11.2 7.1 11.7 6.3 12.5 6.5'
const SMILE = 'M10.2 16.6 C11.2 17.8 12.8 17.8 13.8 16.6'

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBody = grad('linearGradient', { x1: 3, y1: 4, x2: 22, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 17.5, cy: 18.5, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 2, y1: 4, x2: 21, y2: 22 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  const head = unionSets([area(HEAD), area(EARS)])
  const out = []
  out.push(['path', { d: D(translateSet(dilate(head, 0.8), 0.3, 0.7), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(head, 0.3), 0.3, 0.6), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const back = D(translateSet(erode(head, 0.3), 0.6, 0.6))
  out.push(['path', { d: back, fill: gBody, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: back, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  const pane = translateSet(head, -0.3, -0.3)
  out.push(['path', { d: D(pane), fill: gPane, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(pane)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the face: cheeks, eyes, smile, and the curl of hair
  for (const x of [7.6, 16.4]) out.push(['ellipse', { cx: x, cy: 15.3, rx: 1.35, ry: 0.95, fill: V.accent, 'fill-opacity': 0.5, class: 'wm-a' }])
  for (const x of [9, 15]) {
    out.push(['ellipse', { cx: x, cy: 13, rx: 0.95, ry: 1.15, fill: V.etch, 'fill-opacity': 0.88, class: 'wm-a' }])
    out.push(['circle', { cx: x - 0.3, cy: 12.6, r: 0.32, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a' }])
  }
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  out.push(['path', { d: SMILE, ...ink, 'stroke-opacity': 0.85, 'stroke-width': 0.95 }])
  out.push(['path', { d: CURL, ...ink, 'stroke-opacity': 0.88, 'stroke-width': 1.1 }])
  return [['defs', {}, defs], ...out]
}
