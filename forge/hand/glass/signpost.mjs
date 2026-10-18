// forge/hand/glass/signpost.mjs — a dark glass post carrying two arrow boards that point opposite ways.
// The generated drawing was one pale lavender stack where boards and post merged. Here the post is a deep violet
// column that peeks above and between the boards, the top board is frosted glass pointing right, the lower board is
// accent glass pointing left, and a clear gap separates them so each reads at 16-24px.
// Roles: back/shadow post and board undersides, pane/frost top board, accent lower board, etch text lines, shine rim.
// Motion: post wm-k, top board wm-k, lower board wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { translateSet, setOf, dilate, erode, roundStrokeSet, unionSets } from '../../kernel/bool.mjs'

const NAME = 'signpost'
const f = v => +v.toFixed(2)
const poly = pts => setOf([pts])
const round = (set, r) => dilate(erode(set, r), r)
// polygon with rounded corners (quadratic bends), as a point set
const rnd = (pts, rs) => {
  let d = ''
  const m = pts.length
  for (let i = 0; i < m; i++) {
    const p = pts[i], a = pts[(i + m - 1) % m], b = pts[(i + 1) % m], r = rs[i]
    const un = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }
    const ua = un(a), ub = un(b)
    d += (i ? 'L' : 'M') + f(p[0] + ua[0] * r) + ' ' + f(p[1] + ua[1] * r) + 'Q' + p[0] + ' ' + p[1] + ' ' + f(p[0] + ub[0] * r) + ' ' + f(p[1] + ub[1] * r)
  }
  return setOf(parsePath(d + 'Z').map(q => q.pts))
}
const D = (set, t = 0.04) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.04), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  // geometry (front plane; the colour bodies are the same shapes nudged down-right)
  const post = unionSets([roundStrokeSet([[11.4, 2.4], [11.4, 20.6]], 2.2), round(poly([[8.2, 19.6], [14.6, 19.6], [15.2, 21.8], [7.6, 21.8]]), 0.3)])
  const top = rnd([[3.4, 3.4], [17.4, 3.4], [21.4, 6.8], [17.4, 10.2], [3.4, 10.2]], [1.2, 1.4, 1.2, 1.4, 1.2])
  const low = rnd([[19.6, 12.6], [5.8, 12.6], [1.8, 16], [5.8, 19.4], [19.6, 19.4]], [1.2, 1.4, 1.2, 1.4, 1.2])
  // the post sits behind: boards slightly cover it
  const nudge = (s, d = 0.7) => translateSet(s, d, d)
  const out = []

  // post (deep glass column)
  out.push(['path', { d: D(translateSet(post, 0.8, 1.2)), fill: V.shadow, 'fill-opacity': 0.08, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: D(post), fill: grad('linearGradient', { x1: 8, y1: 2, x2: 15, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: 'M10.6 3.4V19', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])

  // top board: frosted glass, pointing right
  out.push(['path', { d: D(nudge(top, 0.8)), fill: V.shadow, 'fill-opacity': 0.08, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: D(nudge(top)), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 11 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(top), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 18, y2: 10.5 }, [stop(0, V.frost, 0.85), stop(0.5, V.tint, 0.75), stop(1, V.tint, 0.6)]), stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: 'M5.4 6.8H12.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.9, 'stroke-linecap': 'round' }])
  out.push(['path', { d: 'M4.5 8.6V5.8A1.5 1.5 0 0 1 6 4.3H16.6', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }])

  // lower board: accent glass, pointing left
  out.push(['path', { d: D(nudge(low, 0.8)), fill: V.shadow, 'fill-opacity': 0.08, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: D(nudge(low)), fill: V.shadow, 'fill-opacity': 0.55, class: 'wm-a' }])
  out.push(['path', { d: D(low), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(low), fill: grad('linearGradient', { x1: 3, y1: 12.5, x2: 14, y2: 19.5 }, [stop(0, V.shine, 0.6), stop(0.55, V.shine, 0.1), stop(1, V.shine, 0)]), class: 'wm-a' }])
  out.push(['path', { d: 'M11.2 16H18.4', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.92, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M6 13.8H18.6', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
