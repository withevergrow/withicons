// forge/hand/glass/bell-ring.mjs — Glass ringing bell, hand-drawn: the generated drawing had two heavy pink arcs that
// touched the bell and muddled its silhouette. Here the bell is the plain Glass bell (violet body under thin frost, a
// separate clapper bead), drawn a little smaller, with two thin pink ring marks detached by a clear gap. Roles:
// back/shadow body + clapper, pane/frost glass, accent glow + marks, shine rim. Motion: body wm-k, clapper wm-a, marks wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'bell-ring'
const K = 0.88
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12.6 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const soften = (set, r) => dilate(erode(set, r), r)
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // the bell: dome, straight shoulders, a flared lip on a flat rim (the skeleton's shape, corners softened)
  const bell = dilate(area('M6 16 V11 C6 7.5 8.7 4.9 12 4.9 C15.3 4.9 18 7.5 18 11 V16 C18 16.5 18.2 16.9 18.55 17.25 L19.35 18 C19.85 18.5 19.55 19.1 18.85 19.1 H5.15 C4.45 19.1 4.15 18.5 4.65 18 L5.45 17.25 C5.8 16.9 6 16.5 6 16 Z'), 0.9)
  const F = place(bell, -0.45)
  const B = translateSet(place(erode(bell, 0.4), 0), 0.55, 0.5)
  // the clapper: a bead hanging under the rim, clear of the lip
  const bead = area('M9.5 20.65 H14.5 A2.5 2.05 0 0 1 9.5 20.65 Z')
  const C = place(bead, -0.2)
  const out = []
  const h = translateSet(unionSets([B, C]), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 5, y1: 4.5, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.6, cy: 16.4, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // clapper: deep violet glass bead with a hairline and a specular dot
  out.push(['path', { d: D(C), fill: body, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['path', { d: 'M10.3 20.35Q10.55 21.05 11.25 21.35', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a' }])
  // frosted pane, thinner frost so the violet glows through, firm hairline
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 3.5, y1: 4, x2: 19, y2: 18.5 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // ring marks: thin pink arcs either side, clear of the bell
  const mark = { fill: 'none', stroke: V.accent, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-s' }
  out.push(['path', { d: 'M2.7 10.1C2.6 8 3.1 6.2 4.2 4.7', ...mark }])
  out.push(['path', { d: 'M21.3 10.1C21.4 8 20.9 6.2 19.8 4.7', ...mark }])
  return [['defs', {}, defs], ...out]
}
