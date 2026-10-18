// forge/hand/glass/paperclip.mjs — Glass paperclip, hand-drawn: the generated clip was a fat, mostly white frosted rod
// whose violet showed only as a thin offset, so it read pale and the inner wire crowded the outer loop. Here the wire is
// a slimmer rod of tinted glass (the violet body sits right behind a thinner frost), with a firm hairline, a light rim
// along its lit side and an accent glow in the big loop, so it reads as one bent wire at 16px.
// Roles: back/shadow wire body, pane/frost glass, accent glow, shine rim. Motion: the whole clip sways (wm-k).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet } from '../../kernel/bool.mjs'

const NAME = 'paperclip'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const tube = (d, w) => unionSets(parsePath(d, 0.15).map(s => roundStrokeSet(s.pts, w, s.closed)))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, 0.26, 0.4)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  const WIRE = 'M9.25 13.5 L17.25 5.5 A2.12 2.12 0 0 1 20.25 8.5 L10.25 18.5 A4.24 4.24 0 0 1 4.25 12.5 L12.25 4.5'
  const F = place(tube(WIRE, 2.45), -0.3)
  const B = place(tube(WIRE, 2.2), 0.25)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const bd = D(B)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 4, y1: 4, x2: 20, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 8.4, cy: 16.4, r: 5.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 4, y1: 4, x2: 19, y2: 19 }, [stop(0, V.frost, 0.5), stop(0.4, V.tint, 0.38), stop(1, V.tint, 0.26)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.45, class: 'wm-k',
  }])
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
