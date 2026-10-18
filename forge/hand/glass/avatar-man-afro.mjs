// forge/hand/glass/avatar-man-afro.mjs — a frosted glass man with a big round afro set in deep coloured glass (the
// body's own violet ramp, a frosty sheen on its lit top-left and a bright rim along the puffs) framing a pale frosted
// face with ink eyes and a smile. The generated drawing painted hair and face in one pale lavender, so the afro and the
// face merged and the icon washed out on white.
// Roles: back/shadow colour body and hair, pane/frost glass, etch face, accent orb, shine rims.
// Motion: the whole avatar is the body (wm-k); the spec animates no parts.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, rect, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-man-afro'
const ell = (x, y, rx, ry) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
const SHOULDERS = 'M4.4 22.25A1.6 1.6 0 0 1 2.8 20.65C2.8 18.1 5.2 16.5 8.25 16.5C9.6 16.5 10.7 17.3 12 17.3C13.3 17.3 14.4 16.5 15.75 16.5C18.8 16.5 21.2 18.1 21.2 20.65A1.6 1.6 0 0 1 19.6 22.25Z'
// the face shows below a soft hairline arc
const BELOW = 'M5 9.75C7.5 7.95 16.5 7.95 19 9.75V19H5Z'

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const disc = (x, y, r) => setOf([circle(x, y, r)])
const D = (set, t = 0.035) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const T = (set, d) => translateSet(set, d, d)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const HEADS = area(ell(12, 11.1, 5.85, 6.2))
const BODY = differenceSets(area(SHOULDERS), area(ell(12, 11.1, 6.5, 6.85)))
const BACK = unionSets([area(ell(12.8, 11.9, 5.35, 5.7)), intersectSets(translateSet(BODY, 0.8, 1.25), setOf([rect(2, 15, 22.6, 22.6)]))])
// the afro: nine puffs on a round crown, a core to fill it, the face cut out below the hairline
const PUFFS = [[5.35, 11.75, 1.85], [4.85, 8.7, 2.05], [6.35, 5.7, 2.15], [9.15, 4.1, 2.15], [12, 3.95, 2], [14.85, 4.1, 2.15], [17.65, 5.7, 2.15], [19.15, 8.7, 2.05], [18.65, 11.75, 1.85]]
const AFRO = unionSets([...PUFFS.map(([x, y, r]) => disc(x, y, r)), area(ell(12, 8.6, 6.6, 4.6))])
const HAIR = differenceSets(AFRO, intersectSets(T(HEADS, -0.3), area(BELOW)))

export default function render() {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const K = { class: 'wm-k' }

  const mass = unionSets([HEADS, BODY, AFRO])
  // soft diffuse shadow, dropped down-right
  const drop = D(translateSet(mass, 0.7, 1.2), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // the colour body behind (face, shoulders), with an accent orb low in the chest
  const ramp = grad('linearGradient', { x1: 4, y1: 3, x2: 20, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const back = D(BACK)
  out.push(['path', { d: back, fill: ramp, ...K }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 14, cy: 20.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), ...K }])
  // frosted panes: the face and the shoulders, with a currentColor hairline
  const pane = grad('linearGradient', { x1: 5, y1: 3.5, x2: 18, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.56), stop(1, V.tint, 0.44)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: D(T(HEADS, -0.3)) + D(T(BODY, -0.3)), fill: pane, ...edge, 'fill-rule': ev, ...K }])

  // the afro in deep coloured glass: a drop onto the face, the body's ramp, a frosty sheen top-left, a hairline
  const hd = D(T(HAIR, -0.3), 0.03)
  out.push(['path', { d: D(translateSet(HAIR, 0.05, 0.2), 0.03), fill: V.shadow, 'fill-opacity': 0.3, ...K }])
  out.push(['path', { d: hd, fill: ramp, ...K }])
  out.push(['path', { d: hd, fill: grad('linearGradient', { x1: 5, y1: 2, x2: 13, y2: 11 }, [stop(0, V.frost, 0.42), stop(0.55, V.frost, 0.1), stop(1, V.frost, 0)]), ...edge, 'stroke-opacity': 0.3, ...K }])

  // the face: ink eyes and a smile
  out.push(['path', { d: ell(9.55, 11.55, 0.8, 1) + ell(14.45, 11.55, 0.8, 1), fill: V.etch, 'fill-opacity': 0.92, ...K }])
  out.push(['path', { d: 'M9.9 14.3C11 15.35 13 15.35 14.1 14.3', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.82, 'stroke-width': 0.85, 'stroke-linecap': 'round', ...K }])

  // lit rims along the top-left puffs and the shoulders; a soft glint on the hairline's lip
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M3.25 8.1C3.45 7.15 4.05 6.5 4.75 6.25M4.75 4.85C5.25 4.05 6 3.6 6.75 3.55M8 2.25C8.85 1.8 9.6 1.75 10.25 2', ...rim, 'stroke-width': 0.7 }])
  out.push(['path', { d: 'M3.4 20.1C3.6 17.9 5.6 16.75 8.1 16.7', ...rim, 'stroke-width': 0.6 }])
  out.push(['path', { d: 'M7.6 9.35C9.4 8.45 11.2 8.2 12.6 8.2', ...rim, 'stroke-opacity': 0.55, 'stroke-width': 0.4 }])
  return [['defs', {}, defs], ...out]
}
