// forge/hand/glass/love-lock.mjs — a frosted glass heart padlock with a thick shackle in deep coloured glass (the
// body's violet ramp, a lit inner lip) that stops cleanly at the heart's top with a seam, and a bold inked keyhole. The
// generated drawing ran a pale shackle rod straight into the pale heart outline, so the lock lost its shackle at 16px.
// Roles: back/shadow colour body and shackle, pane/frost glass, etch keyhole, accent orb, shine rims.
// Motion: the shackle is the moving part (wm-a, it nods about 12 8.5); the heart is the body (wm-k).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, translateSet, setOf, roundStrokeSet, dilate } from '../../kernel/bool.mjs'

const NAME = 'love-lock'
const HEART = 'M12 21.25C12 21.25 4.75 17 4.75 12C4.75 10 6.5 8.25 8.75 8.25C10 8.25 11.25 9 12 10.25C12.75 9 14 8.25 15.25 8.25C17.5 8.25 19.25 10 19.25 12C19.25 17 12 21.25 12 21.25Z'
// the skeleton's heart grown to the style's optical size (the generated glass swells every shape by its rod)
const grow = (d, s, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${+(12 + (x - 12) * s + dx).toFixed(2)} ${+(14.5 + (y - 14.5) * s + dy).toFixed(2)}`)

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const D = (set, t = 0.035) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const T = (set, d) => translateSet(set, d, d)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const BODY = area(grow(HEART, 1.12, 0, -0.35))
const BACK = area(grow(HEART, 1.04, 0.85, 0.65))
// the shackle: a 2.3u tube on a round arch, legs landing on the heart's lobes, cut back from the heart by a seam
const ARCH = parsePath('M8.6 9.5V6.85A3.4 3.4 0 0 1 15.4 6.85V9.5')[0].pts
const SHACKLE = differenceSets(roundStrokeSet(ARCH, 2.3), dilate(BODY, 0.45))

export default function render() {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const K = { class: 'wm-k' }, A = { class: 'wm-a' }
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  const ramp = grad('linearGradient', { x1: 4, y1: 3, x2: 20, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])

  // soft diffuse shadow, dropped down-right
  const drop = D(translateSet(unionSets([BODY, SHACKLE]), 0.7, 1.2), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  // the shackle in deep coloured glass: the body's ramp, a frosty sheen, a hairline, a lit inner lip
  const sd = D(T(SHACKLE, -0.3), 0.02)
  out.push(['path', { d: D(translateSet(SHACKLE, 0.15, 0.3), 0.02), fill: V.shadow, 'fill-opacity': 0.3, ...A }])
  out.push(['path', { d: sd, fill: ramp, ...A }])
  out.push(['path', { d: sd, fill: grad('linearGradient', { x1: 8, y1: 2.5, x2: 13, y2: 8 }, [stop(0, V.frost, 0.42), stop(1, V.frost, 0)]), ...edge, 'stroke-opacity': 0.3, ...A }])
  out.push(['path', { d: 'M7.7 7.4V6.55A4 4 0 0 1 10.33 2.79', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])

  // the heart: colour body behind with an accent orb low right, a frosted pane in front with a currentColor hairline
  const back = D(BACK)
  out.push(['path', { d: back, fill: ramp, ...K }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 15.5, cy: 17, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), ...K }])
  out.push(['path', { d: D(T(BODY, -0.3)), fill: grad('linearGradient', { x1: 4, y1: 7, x2: 18, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.56), stop(1, V.tint, 0.44)]), ...edge, ...K }])

  // the keyhole, inked bold with a lit lower lip
  out.push(['path', { d: 'M12 11.45A1.25 1.25 0 0 1 12.65 13.75L13.05 16.05H10.95L11.35 13.75A1.25 1.25 0 0 1 12 11.45Z', fill: V.etch, 'fill-opacity': 0.88, ...K }])
  out.push(['path', { d: 'M12.75 12.15A1.05 1.05 0 0 1 12.85 13.25', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.3, 'stroke-linecap': 'round', class: 'wm-shine' }])

  // lit rims along the heart's top-left lobe
  out.push(['path', { d: 'M4.2 12.1C4.2 10.15 5.65 8.25 7.95 7.95', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
