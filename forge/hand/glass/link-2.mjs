// forge/hand/glass/link-2.mjs — Glass chain link, hand-drawn: the generated links were fat, mostly white frosted rods
// whose violet showed only as a thin offset, so the pair read pale and washed out (worst on white at 24px). Here each
// loop and the bar are slimmer rods of tinted glass (the violet body sits right behind a thinner frost) with a firm
// hairline, a light rim along the lit side and an accent glow, so the two links and their bar read at 16px.
// Roles: back/shadow rod body, pane/frost glass, accent glow, shine rim. Motion: the links wm-k, the bar pulses (wm-a).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet } from '../../kernel/bool.mjs'

const NAME = 'link-2'
const K = 0.96
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const tube = (d, w) => unionSets(parsePath(d, 0.15).map(s => roundStrokeSet(s.pts, w, s.closed)))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, 0.26, 0.4)) }

// the loop ends stop well short of the centre (about 2.9u apart after the caps) so the two links never close into one pill
const LOOPS = 'M9.25 6.5 H7.5 A5.5 5.5 0 0 0 7.5 17.5 H9.25 M14.75 6.5 H16.5 A5.5 5.5 0 0 1 16.5 17.5 H14.75'
const BAR = 'M8.5 12 H15.5'

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const body = grad('linearGradient', { x1: 3, y1: 6, x2: 20, y2: 19 }, [stop(0, V.c1), stop(1, V.shadow)])
  const glow = grad('radialGradient', { cx: 15.5, cy: 15, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const frost = grad('linearGradient', { x1: 3, y1: 5, x2: 19, y2: 19 }, [stop(0, V.frost, 0.5), stop(0.4, V.tint, 0.38), stop(1, V.tint, 0.26)])

  const out = []
  const parts = [[LOOPS, 'wm-k'], [BAR, 'wm-a']].map(([d, cls]) => ({ cls, F: place(tube(d, 2.6), -0.3), B: place(tube(d, 2.35), 0.25) }))
  const h = translateSet(unionSets(parts.map(p => p.B)), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  for (const { cls, F, B } of parts) {
    const bd = D(B)
    out.push(['path', { d: bd, fill: body, class: cls }])
    out.push(['path', { d: bd, fill: glow, class: cls }])
    out.push(['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.45, class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: `wm-shine ${cls}` }])
  }
  return [['defs', {}, defs], ...out]
}
