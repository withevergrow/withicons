// forge/hand/glass/avatar-man-turban.mjs — a frosted glass man in a tall violet glass turban: a domed crown, a clear
// pointed front fold dipping into a V over the forehead with a lit lip on both sides, and two wrap creases crossing
// above the point as diagonals to the opposite sides, with a dark seam and a cast shadow where the wrap meets a pale
// frosted face (ink eyes, a smile). The generated drawing painted the wrap and face in one pale lavender.
// Roles: back/shadow colour body and turban (violet leads), accent only on the lit fold and the top-left sheen,
// pane/frost glass, etch face, shine rims. Motion: the whole avatar is the body (wm-k); the spec animates no parts.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, rect, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-man-turban'
const ell = (x, y, rx, ry) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
const SHOULDERS = 'M4.4 22.25A1.6 1.6 0 0 1 2.8 20.65C2.8 18.1 5.2 16.5 8.25 16.5C9.6 16.5 10.7 17.3 12 17.3C13.3 17.3 14.4 16.5 15.75 16.5C18.8 16.5 21.2 18.1 21.2 20.65A1.6 1.6 0 0 1 19.6 22.25Z'
// the turban: a tall domed crown down over the temples, its front edge dipping to a point over the forehead
const TURBAN = 'M5.6 9.9C4.3 8.6 4.1 6.2 5.1 4.6C6.3 2.8 8.9 2 12 2C15.1 2 17.7 2.8 18.9 4.6C19.9 6.2 19.7 8.6 18.4 9.9C17.6 8.3 16.4 7.4 15.2 7.15C14.1 7.4 12.9 7.9 12 8.75C11.1 7.9 9.9 7.4 8.8 7.15C7.6 7.4 6.4 8.3 5.6 9.9Z'

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const D = (set, t = 0.035) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const T = (set, d) => translateSet(set, d, d)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const HEADS = area(ell(12, 10.9, 6.2, 6.4))
const BODY = differenceSets(area(SHOULDERS), area(ell(12, 10.9, 6.85, 7.05)))
const BACK = unionSets([area(ell(12.85, 11.75, 5.7, 5.9)), intersectSets(translateSet(BODY, 0.8, 1.25), setOf([rect(2, 15, 22.6, 22.6)]))])
const WRAP = area(TURBAN)

export default function render() {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const K = { class: 'wm-k' }

  const mass = unionSets([HEADS, BODY, WRAP])
  // soft diffuse shadow, dropped down-right
  const drop = D(translateSet(mass, 0.7, 1.2), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // the colour body behind (face, shoulders), with an accent orb low in the chest
  const back = D(BACK)
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 4, y1: 3, x2: 20, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), ...K }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 14, cy: 20.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), ...K }])
  // frosted panes: the face and the shoulders, with a currentColor hairline
  const pane = grad('linearGradient', { x1: 5, y1: 3.5, x2: 18, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.56), stop(1, V.tint, 0.44)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: D(T(HEADS, -0.3)) + D(T(BODY, -0.3)), fill: pane, ...edge, 'fill-rule': ev, ...K }])

  // the turban in violet glass: a cast shadow onto the brow, a back-to-shadow ramp, an accent sheen at the top-left,
  // a frosty sheen, a hairline
  const wd = D(WRAP, 0.03)
  out.push(['path', { d: D(translateSet(WRAP, 0.15, 0.5), 0.03), fill: V.shadow, 'fill-opacity': 0.5, ...K }])
  out.push(['path', { d: wd, fill: grad('linearGradient', { x1: 6, y1: 2, x2: 17, y2: 10 }, [stop(0, V.c1), stop(1, V.shadow)]), ...K }])
  out.push(['path', { d: wd, fill: grad('radialGradient', { cx: 7.5, cy: 3.8, r: 5 }, [stop(0, V.accent, 0.62), stop(0.55, V.accent, 0.2), stop(1, V.accent, 0)]), ...K }])
  out.push(['path', { d: wd, fill: grad('linearGradient', { x1: 5, y1: 1.5, x2: 12, y2: 9 }, [stop(0, V.frost, 0.42), stop(0.6, V.frost, 0.1), stop(1, V.frost, 0)]), ...edge, 'stroke-opacity': 0.3, ...K }])
  // the wrap's crossing creases: they cross just above the point and rise as diagonals to the opposite sides,
  // each a deep crease; the left, lit fold carries an accent lip above it
  out.push(['path', { d: 'M11.55 8.05C13.15 5.95 15.85 4.45 19.05 4.75M12.45 8.05C10.85 5.95 8.15 4.45 4.95 4.75', fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.9, 'stroke-width': 0.8, 'stroke-linecap': 'round', ...K }])
  out.push(['path', { d: 'M11.6 7.1C10.2 5.45 7.95 4.1 5.25 4.05', fill: 'none', stroke: V.accent, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // a lit lip along both sides of the V
  out.push(['path', { d: 'M8.85 6.75C9.85 7 10.75 7.4 11.45 7.95M15.15 6.75C14.15 7 13.25 7.4 12.55 7.95', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])

  // the face: ink eyes and a smile
  out.push(['path', { d: ell(9.55, 11.85, 0.8, 1) + ell(14.45, 11.85, 0.8, 1), fill: V.etch, 'fill-opacity': 0.92, ...K }])
  out.push(['path', { d: 'M9.9 14.55C11 15.6 13 15.6 14.1 14.55', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.82, 'stroke-width': 0.85, 'stroke-linecap': 'round', ...K }])

  // lit rims along the turban's dome and the shoulders
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M4.75 6.6C4.85 4.6 6.9 2.85 10.2 2.45', ...rim, 'stroke-width': 0.7 }])
  out.push(['path', { d: 'M3.4 20.1C3.6 17.9 5.6 16.75 8.1 16.7', ...rim, 'stroke-width': 0.6 }])
  return [['defs', {}, defs], ...out]
}
