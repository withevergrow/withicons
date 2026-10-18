// forge/hand/glass/avatar-older-man.mjs — a frosted glass older man: a bald pale dome with a bright crown glint, fluffy
// grey side tufts and a full grey moustache set in a smoky grey glass, and short bushy brows over ink eyes. The
// generated drawing painted head, tufts and moustache in one pale lavender, so the bald head and brow vanished at 16px.
// Roles: back/shadow colour body, pane/frost glass, etch for the grey hair tone and the face, accent orb, shine rims.
// Motion: the whole avatar is the body (wm-k); the spec animates no parts.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, rect, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-older-man'
const ell = (x, y, rx, ry) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
const SHOULDERS = 'M4.4 22.25A1.6 1.6 0 0 1 2.8 20.65C2.8 18.1 5.2 16.5 8.25 16.5C9.6 16.5 10.7 17.3 12 17.3C13.3 17.3 14.4 16.5 15.75 16.5C18.8 16.5 21.2 18.1 21.2 20.65A1.6 1.6 0 0 1 19.6 22.25Z'
const MOUSTACHE = 'M8.6 14.75C9.35 13.3 10.9 12.75 12 13.45C13.1 12.75 14.65 13.3 15.4 14.75C14.1 15.55 12.85 15.3 12 14.8C11.15 15.3 9.9 15.55 8.6 14.75Z'

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const disc = (x, y, r) => setOf([circle(x, y, r)])
const D = (set, t = 0.035) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const T = (set, d) => translateSet(set, d, d)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const mirror = set => set.map(r => r.map(p => [24 - p[0], p[1]]).reverse())

// the style's optical size: the skeleton's head and shoulders swollen like the generated glass rods, a seam between;
// the colour body sits smaller and lower-right inside, so the pane frosts white at the top-left like the siblings
const HEADS = area(ell(12, 10.3, 6.5, 6.9))
const BODY = differenceSets(area(SHOULDERS), area(ell(12, 10.3, 7.1, 7.5)))
const BACK = unionSets([area(ell(12.85, 11.15, 6, 6.4)), intersectSets(translateSet(BODY, 0.8, 1.25), setOf([rect(2, 15, 22.6, 22.6)]))])
// a fluffy side tuft: three puffs over the ear, hugging the head's edge
const TUFT_L = unionSets([disc(6.85, 6.85, 1.35), disc(5.55, 8.75, 1.45), disc(5.45, 10.9, 1.35), disc(6.3, 12.5, 1.05), setOf([[[7.4, 6.1], [5.6, 7.9], [4.9, 10.8], [6.1, 13.3], [7.6, 12.4], [7.3, 8.4]]])])
const TUFTS = unionSets([translateSet(TUFT_L, -0.3, 0), mirror(translateSet(TUFT_L, -0.3, 0))])

export default function render() {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const K = { class: 'wm-k' }

  const mass = unionSets([HEADS, BODY, TUFTS])
  // soft diffuse shadow, dropped down-right
  const drop = D(translateSet(mass, 0.7, 1.2), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // the colour body behind (head, shoulders, tufts), with an accent orb low in the chest
  const back = D(BACK)
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 4, y1: 4, x2: 20, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), ...K }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 14, cy: 20.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), ...K }])
  // frosted panes: the bald head and the shoulders, with a currentColor hairline
  const pane = grad('linearGradient', { x1: 5, y1: 3.5, x2: 18, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.56), stop(1, V.tint, 0.44)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: D(T(HEADS, -0.3)) + D(T(BODY, -0.3)), fill: pane, ...edge, 'fill-rule': ev, ...K }])

  // grey hair glass: an opaque pale base smoked with etch (a touch darker low), its own small drop and a hairline
  const hair = unionSets([T(TUFTS, -0.3), area(MOUSTACHE)])
  const hd = D(hair, 0.03)
  out.push(['path', { d: D(translateSet(hair, 0.3, 0.45), 0.03), fill: V.shadow, 'fill-opacity': 0.3, ...K }])
  out.push(['path', { d: hd, fill: V.tint, ...K }])
  out.push(['path', { d: hd, fill: grad('linearGradient', { x1: 6, y1: 6, x2: 8, y2: 15.5 }, [stop(0, V.etch, 0.3), stop(1, V.etch, 0.52)]), ...edge, 'stroke-opacity': 0.3, ...K }])

  // the face: bushy brows and ink eyes
  out.push(['path', { d: 'M8.35 8.7C9.05 8.15 9.95 8.1 10.65 8.5M13.35 8.5C14.05 8.1 14.95 8.15 15.65 8.7', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.82, 'stroke-width': 1.05, 'stroke-linecap': 'round', ...K }])
  out.push(['path', { d: 'M9.5 9.8A0.8 1 0 1 1 9.5 11.8A0.8 1 0 1 1 9.5 9.8ZM14.5 9.8A0.8 1 0 1 1 14.5 11.8A0.8 1 0 1 1 14.5 9.8Z', fill: V.etch, 'fill-opacity': 0.92, ...K }])

  // lit rims: the bald crown's glint (the signature of a bare head), the shoulders' top-left, the tufts' tops
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M8.2 5.55C9.3 4.55 10.8 4.1 12.4 4.2', ...rim, 'stroke-width': 0.95 }])
  out.push(['path', { d: 'M14.1 4.75A0.5 0.5 0 1 1 14.1 5.75A0.5 0.5 0 1 1 14.1 4.75Z', fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  out.push(['path', { d: 'M3.4 20.1C3.6 17.9 5.6 16.75 8.1 16.7', ...rim, 'stroke-width': 0.6 }])
  out.push(['path', { d: 'M4.55 8.3C4.8 7.3 5.55 6.45 6.45 6.05M9.55 13.6C10.35 13.1 11.2 13.1 11.75 13.5', ...rim, 'stroke-opacity': 0.75, 'stroke-width': 0.45 }])
  return [['defs', {}, defs], ...out]
}
