// forge/hand/glass/teapot.mjs — Glass teapot, hand-drawn: the generated pot swallowed its thin spout and handle into the
// frosted pane (the handle vanished, the spout was a faint nub) and fused lid and knob into a cream-topped dome, so it
// read as a cupcake or a bowl. Here the round body is a frosted pane, the lid is its own small frosted dome with a seam,
// the knob is an accent glass bead, and the spout and handle are solid violet glass rods with an open handle loop, so the
// teapot silhouette reads at 16px.
// Roles: back/shadow body, spout and handle, pane/frost glass, etch band, accent knob + orb, shine rim.
// Motion: pot wm-k (breathes, tips from 12 20.5), knob plate S (wm-s, bounces at 12 4.5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'teapot'
const K = 0.94
const f = v => +v.toFixed(2)
const pt = (x, y, d) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]
const place = (set, d) => set.map(r => r.map(([x, y]) => pt(x, y, d)))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const tube = (d, w) => unionSets(parsePath(d, 0.2).map(s => roundStrokeSet(s.pts, w, s.closed)))
const D = set => setD(set, 0.05)
const onPane = (d, dd = -0.45) => d.replace(/-?\d*\.?\d+/g, v => String(f(12 + (+v - 12) * K + dd)))
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  const pot = area('M7.1 20.6H16.9C18.5 19.1 19.1 17.1 19.1 14.6C19.1 11 16 8.4 12 8.4C8 8.4 4.9 11 4.9 14.6C4.9 17.1 5.5 19.1 7.1 20.6Z')
  const lid = area('M8.4 9.3C8.6 7.4 10 6.3 12 6.3C14 6.3 15.4 7.4 15.6 9.3Q12 8.4 8.4 9.3Z')
  const spout = area('M6.3 18.5C4 17.9 2.8 15.6 2.25 12.4L2.1 11.25C2.05 10.6 2.7 10.25 3.2 10.65L3.5 10.95C4.25 12.75 5.15 14.15 6.7 14.65Z')
  const handle = tube('M18.4 11.2C20.95 10.45 22.05 12.45 21.75 14.45C21.45 16.45 20.15 17.75 18.6 17.85', 1.75)
  const F = place(pot, -0.45), Ld = place(lid, -0.45)
  const S = place(spout, -0.3), Hd = place(handle, -0.3)
  // back body: pot and lid as one silhouette with filleted shoulders, so the violet under the lid follows the dome
  const back = area('M7.1 20.6H16.9C18.5 19.1 19.1 17.1 19.1 14.6C19.1 12.3 18 10.6 16.6 9.75C16 9.4 15.65 8.85 15.45 8.3C15 7 13.7 6.3 12 6.3C10.3 6.3 9 7 8.55 8.3C8.35 8.85 8 9.4 7.4 9.75C6 10.6 4.9 12.3 4.9 14.6C4.9 17.1 5.5 19.1 7.1 20.6Z')
  const B = translateSet(place(erode(back, 0.35), 0), 0.55, 0.5)
  const out = []
  const h = translateSet(unionSets([B, S, Hd]), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 2.5, y1: 4, x2: 21.5, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const rod = { fill: body, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }
  // spout and handle: solid violet glass rods running in under the pane
  out.push(['path', { d: D(S), ...rod }])
  out.push(['path', { d: D(Hd), ...rod }])
  // colour body with the accent orb
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.4, cy: 17, r: 6.8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // frosted pot, then the lid as its own small dome over it
  const pane = grad('linearGradient', { x1: 4, y1: 6, x2: 18, y2: 20 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: D(F), fill: pane, ...edge, class: 'wm-k' }])
  out.push(['path', { d: onPane('M5.4 13.7C9.1 14.75 14.9 14.75 18.6 13.7'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(Ld), fill: pane, ...edge, class: 'wm-k' }])
  // knob: an accent glass bead with a specular arc
  const [kx, ky] = pt(12, 5.15, -0.45)
  out.push(['circle', { cx: f(kx), cy: f(ky), r: 1.2, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: `M${f(kx - 0.75)} ${f(ky + 0.05)}A0.8 0.8 0 0 1 ${f(kx - 0.05)} ${f(ky - 0.75)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-s wm-shine' }])
  // lit rims: pot (kept off the lid), lid, spout and handle (stopping at the pot outline)
  out.push(['path', { d: D(unionSets([differenceSets(rimOf(F), dilate(Ld, 0.3)), rimOf(Ld, 0.35), differenceSets(rimOf(S, 0.35), F), differenceSets(rimOf(Hd, 0.32), F)])), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
