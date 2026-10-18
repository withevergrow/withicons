// forge/hand/glass/git-compare.mjs — two branches as separate glass tubes, as in the line icon: from the top-left node a path
// runs down and right to an arrowhead at the bottom, and from the bottom-right node a path runs up and left to an arrowhead
// at the top. Both nodes are full-size frosted discs with an accent glow; the tubes are frosted over an offset colour body.
// The generated drawing closed the paths into one ring and shrank the nodes; here the two routes stay open and distinct.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD, parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const disc = (x, y, r) => setOf([circle(x, y, r, 0.25)])
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const grow = (s, r) => { for (const q of [r, r + 0.03, r - 0.03, r + 0.06]) { try { return dilate(s, q) } catch {} } return s }
const line = (d, w) => unionSets(parsePath(d, 0.15).map(s => roundStrokeSet(s.pts, w)))

export default function render(icon) {
  const name = (icon && icon.name) || 'git-compare'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const NR = 3.2
  const n1 = disc(5.2, 5.6, NR), n2 = disc(18.8, 18.4, NR)
  const W = 2.2
  // route one: down from the top-left node, round the corner, right to an arrowhead at the bottom
  const r1 = line('M5.2 8.8V16A2.4 2.4 0 0 0 7.6 18.4H12.2M9.6 15.6L12.6 18.4L9.6 21.2', W)
  // route two: up from the bottom-right node, round the corner, left to an arrowhead at the top
  const r2 = line('M18.8 15.2V8A2.4 2.4 0 0 0 16.4 5.6H11.8M14.4 2.8L11.4 5.6L14.4 8.4', W)
  const tubes = unionSets([r1, r2])
  const nodes = unionSets([n1, n2])
  const tubesFront = differenceSets(tubes, grow(nodes, 0.5))
  const all = unionSets([tubesFront, nodes])
  const tubesBack = differenceSets(backOf(tubes, 0.25, 0.9), grow(nodes, 0.3))
  const nodesBack = unionSets([backOf(n1, 0.35, 0.9), backOf(n2, 0.35, 0.9)])
  const allBack = unionSets([tubesBack, nodesBack])

  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = add(['linearGradient', { id: id(), x1: 2, y1: 2, x2: 23, y2: 23, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]])
  const gPane = add(['linearGradient', { id: id(), x1: 2, y1: 2, x2: 22, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]])
  const glow = (cx, cy) => add(['radialGradient', { id: id(), cx, cy, r: 4.4, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // the two routes (plate A: the arrows travel)
  out.push(['path', { d: D(tubesBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(tubesFront), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(tubesFront), fill: V.frost, 'fill-opacity': 0.25, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(tubesFront)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the two nodes: colour body with an orb of accent light, frosted disc in front
  for (const [nd, cx, cy] of [[n1, 6.4, 6.9], [n2, 20, 19.7]]) {
    const bk = backOf(nd, 0.35, 0.9)
    out.push(['path', { d: D(bk), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(bk), fill: glow(cx, cy), 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(nd), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(nd), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(rimOf(nd)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  }
  return [['defs', {}, defs], ...out]
}
