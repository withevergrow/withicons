// forge/hand/glass/star-half.mjs — a rating star split down the middle: the left half is solid frosted glass over the
// violet colour body (lit rim, shadow side), the right half is an empty vessel, a clear faint pane inside a crisp
// colour outline with no body behind it. Generated Glass drew the split as a faint inner hairline over a star whose
// halves were the same strength, so "half" never read; the contrast between full and empty is the whole icon now.
// Roles: back/shadow body, pane/frost glass, accent orb, shine rim. Motion: both halves wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { setOf, intersectSets, translateSet } from '../../kernel/bool.mjs'

const NAME = 'star-half'
// the family's star (skeleton points, scaled 0.94 about the centre) with softened tips
const f2 = v => +v.toFixed(2)
function star() {
  const SK = [[12, 2.95], [14.79, 9.11], [21.51, 9.86], [16.52, 14.42], [17.88, 21.04], [12, 17.7], [6.12, 21.04], [7.48, 14.42], [2.49, 9.86], [9.21, 9.11]]
  const pts = SK.map(([x, y]) => [12 + (x - 12) * 1.06, 12 + (y - 12) * 1.06])
  let d = ''
  for (let i = 0; i < 10; i++) {
    const p = pts[i], a = pts[(i + 9) % 10], b = pts[(i + 1) % 10], k = i % 2 ? 0.7 : 1.5
    const t = (q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (q[0] - p[0]) * k / l, p[1] + (q[1] - p[1]) * k / l] }
    const s = t(a), e = t(b)
    d += (i ? 'L' : 'M') + `${f2(s[0])} ${f2(s[1])}Q${f2(p[0])} ${f2(p[1])} ${f2(e[0])} ${f2(e[1])}`
  }
  return d + 'Z'
}
const rect = (x0, y0, x1, y1) => [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]]
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const full = setOf(parsePath(star()).map(s => s.pts))
  const left = intersectSets(full, rect(0, 0, 12, 24))
  const right = intersectSets(full, rect(12, 0, 24, 24))
  const out = []
  const FR = s => translateSet(s, -0.3, -0.3)
  const back = translateSet(left, 0.45, 0.7)

  // diffuse shadow under the filled half
  const drop = D(translateSet(back, 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  // the empty half: a clear pane in a crisp colour outline (nothing behind it)
  const rd = D(FR(right))
  out.push(['path', {
    d: rd, fill: grad('linearGradient', { x1: 12, y1: 3, x2: 21, y2: 21 }, [stop(0, V.frost, 0.42), stop(1, V.tint, 0.2)]),
    stroke: V.c1, 'stroke-opacity': 0.75, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k',
  }])

  // the full half: colour body with an accent orb, then the frosted pane in front
  const bd = D(back)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 2.5, y1: 3, x2: 13, y2: 22.5 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 8.5, cy: 17.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(FR(left)), fill: grad('linearGradient', { x1: 2.2, y1: 2.6, x2: 12, y2: 20.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k',
  }])
  // lit rim along the top-left edges, and a bright lip down the crisp divider
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M10.9 4.3L8.6 9Q8.5 9.3 8.1 9.3L3.6 9.7', ...rim }])
  out.push(['path', { d: 'M11.15 5.6V15.6', ...rim, 'stroke-width': 0.4, 'stroke-opacity': 0.6 }])
  return [['defs', {}, defs], ...out]
}
