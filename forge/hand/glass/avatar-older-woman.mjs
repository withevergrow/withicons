// forge/hand/glass/avatar-older-woman.mjs — a frosted glass older woman whose grey hair is the dominant shape: a smoky
// grey glass cap and a large round bun on top, cut apart by a clear gap and a shadow seam, each with its own lit rim,
// over a pale face with ink round glasses and a smile. The hair is lit a tone lighter at the top-left and haloed with
// shine so its silhouette holds on dark. The generated drawing painted hair, bun and face in one pale lavender.
// Roles: back/shadow colour body, pane/frost glass, etch for the grey hair tone and the face, accent orb, shine rims.
// Motion: the whole avatar is the body (wm-k); the spec animates no parts.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, rect, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-older-woman'
const ell = (x, y, rx, ry) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
const SHOULDERS = 'M4.4 22.25A1.6 1.6 0 0 1 2.8 20.65C2.8 18.1 5.2 16.5 8.25 16.5C9.6 16.5 10.7 17.3 12 17.3C13.3 17.3 14.4 16.5 15.75 16.5C18.8 16.5 21.2 18.1 21.2 20.65A1.6 1.6 0 0 1 19.6 22.25Z'
// the hair: everything above a soft hairline swept down over the temples (no centre part: cap and bun are the shapes)
const ABOVE = 'M5 12.6C5.4 9.4 7.7 7.7 12 7.7C16.3 7.7 18.6 9.4 19 12.6L19 1H5Z'

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const disc = (x, y, r) => setOf([circle(x, y, r)])
const D = (set, t = 0.035) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const T = (set, d) => translateSet(set, d, d)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// the style's optical size: the skeleton's head and shoulders swollen like the generated glass rods, a seam between;
// the colour body sits smaller and lower-right inside, so the pane frosts white at the top-left like the siblings
const HEADS = area(ell(12, 10.6, 6.4, 6.75))
const BODY = differenceSets(area(SHOULDERS), area(ell(12, 10.6, 7, 7.35)))
const BACK = unionSets([area(ell(12.85, 11.45, 5.9, 6.2)), intersectSets(translateSet(BODY, 0.8, 1.25), setOf([rect(2, 15, 22.6, 22.6)]))])
// the bun: a round knot (r 2.7, top at y 2.05), the cap cut back from it by a 0.65u gap all round
const BX = 12, BY = 4.75, BR = 2.7
const BUN = disc(BX, BY, BR)
const CAP = differenceSets(intersectSets(area(ell(11.85, 10.45, 6.75, 7.05)), area(ABOVE)), disc(BX, BY, BR + 0.65))

export default function render() {
  let n = 0
  const defs = [], out = [], ev = 'evenodd'
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const K = { class: 'wm-k' }

  const mass = unionSets([HEADS, BODY, CAP, BUN])
  // soft diffuse shadow, dropped down-right
  const drop = D(translateSet(mass, 0.7, 1.2), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // the colour body behind (head, shoulders), with an accent orb low in the chest
  const back = D(BACK)
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 4, y1: 4, x2: 20, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), ...K }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 14, cy: 20.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), ...K }])
  // frosted panes: the face and the shoulders, with a currentColor hairline
  const pane = grad('linearGradient', { x1: 5, y1: 3.5, x2: 18, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.56), stop(1, V.tint, 0.44)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: D(T(HEADS, -0.3)) + D(T(BODY, -0.3)), fill: pane, ...edge, 'fill-rule': ev, ...K }])

  // grey hair glass, cap and bun each: a small drop, a shine halo (holds the silhouette on dark), an opaque pale base
  // smoked with etch (light at the top-left, deeper low-right) and a hairline
  const smoke = grad('linearGradient', { x1: 7, y1: 2.5, x2: 15, y2: 12.5 }, [stop(0, V.etch, 0.2), stop(0.5, V.etch, 0.42), stop(1, V.etch, 0.6)])
  for (const part of [CAP, BUN]) {
    const d = D(T(part, -0.3), 0.03)
    out.push(['path', { d: D(translateSet(part, 0.05, 0.25), 0.03), fill: V.shadow, 'fill-opacity': 0.32, ...K }])
    out.push(['path', { d, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 1.1, 'stroke-linejoin': 'round', class: 'wm-shine' }])
    out.push(['path', { d, fill: V.tint, ...K }])
    out.push(['path', { d, fill: smoke, ...edge, 'stroke-opacity': 0.32, ...K }])
  }
  // the bun's own shading: a deep seam inside its lower edge, so it reads as a separate round knot
  const bx = BX - 0.3, by = BY - 0.3, br = BR - 0.45
  out.push(['path', { d: `M${bx - br * 0.92} ${by + br * 0.4}A${br} ${br} 0 0 0 ${bx + br * 0.92} ${by + br * 0.4}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linecap': 'round', ...K }])

  // the face: ink round glasses with the eyes behind, and a gentle smile
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...K }
  out.push(['path', { d: ell(9.25, 11.35, 1.95, 1.95) + ell(14.75, 11.35, 1.95, 1.95) + 'M11.2 11.1C11.75 10.8 12.25 10.8 12.8 11.1', ...ink, 'stroke-opacity': 0.85, 'stroke-width': 0.75 }])
  out.push(['path', { d: ell(9.25, 11.45, 0.6, 0.7) + ell(14.75, 11.45, 0.6, 0.7), fill: V.etch, 'fill-opacity': 0.9, ...K }])
  out.push(['path', { d: 'M10.4 14.65C11.35 15.55 12.65 15.55 13.6 14.65', ...ink, 'stroke-opacity': 0.8, 'stroke-width': 0.8 }])

  // lit rims along the top-left: the bun, the cap's outer edge, the shoulders; a glint on each lens
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 1, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M9.65 4.1C9.9 3.05 10.7 2.35 11.75 2.25', ...rim, 'stroke-width': 0.75 }])
  out.push(['path', { d: 'M5.25 11.2C5.4 8.6 6.75 6.4 8.55 5.25', ...rim, 'stroke-width': 0.8 }])
  out.push(['path', { d: 'M3.4 20.1C3.6 17.9 5.6 16.75 8.1 16.7', ...rim, 'stroke-opacity': 0.9, 'stroke-width': 0.6 }])
  out.push(['path', { d: 'M8.1 10.65C8.35 10.25 8.7 10.05 9.1 10M13.6 10.65C13.85 10.25 14.2 10.05 14.6 10', ...rim, 'stroke-opacity': 0.8, 'stroke-width': 0.4 }])
  return [['defs', {}, defs], ...out]
}
