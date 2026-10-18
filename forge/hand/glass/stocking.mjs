// forge/hand/glass/stocking.mjs — a Christmas stocking in frosted glass. Generated Glass merged cuff, leg and foot into one
// lumpy mass with a stray darker circle at the toe. Here the cuff is its own bold, near-white band over a coloured boot with a
// clean classic silhouette (straight leg, round heel, round toe). No heel or toe patches.
// Roles: back/shadow body, pane/frost glass, accent orb, etch patch seams, shine rim. Motion: boot wm-k, cuff wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { setOf, translateSet, unionSets } from '../../kernel/bool.mjs'

const NAME = 'stocking'
const LEG = 'M7.5 7V15.5A5.5 5.5 0 0 0 13 21H17.5A3 3 0 0 0 17.5 15H16V7Z'
const CUFF = 'M7 2.8H16.5A1.5 1.5 0 0 1 18 4.3V6.7A1.5 1.5 0 0 1 16.5 8.2H7A1.5 1.5 0 0 1 5.5 6.7V4.3A1.5 1.5 0 0 1 7 2.8Z'
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const area = d => setOf(parsePath(d).map(s => s.pts))

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const leg = area(LEG), cuff = area(CUFF)
  const FR = s => translateSet(s, -0.3, -0.4)
  const back = translateSet(unionSets([leg, cuff]), 0.7, 0.7)
  const out = []

  const drop = D(translateSet(back, 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  // colour body behind both pieces
  const bd = D(back)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 5.5, y1: 3, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 16, cy: 17.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])

  // the boot pane
  const pane = grad('linearGradient', { x1: 7, y1: 8, x2: 20, y2: 21 }, [stop(0, V.frost, 0.5), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.38)])
  out.push(['path', { d: D(FR(leg)), fill: pane, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // the cuff: a whiter, clearer band
  out.push(['path', {
    d: D(FR(cuff)), fill: grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 8 }, [stop(0, V.frost, 1), stop(1, V.frost, 0.86)]),
    stroke: 'currentColor', 'stroke-opacity': 0.34, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a',
  }])
  out.push(['path', { d: 'M7.6 5.5H15.9', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.45, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }])
  // lit rim: cuff top, leg left edge
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M15.6 2.5H7Q5.6 2.5 5.4 4', ...rim }])
  out.push(['path', { d: 'M7.4 9.4V15.4Q7.4 16.5 7.8 17.3', ...rim }])
  return [['defs', {}, defs], ...out]
}
