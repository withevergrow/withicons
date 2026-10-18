// forge/hand/glass/folder-open.mjs — Glass open folder, hand-drawn: the generated folder fused the back panel and the
// open flap into one frosted blob, the flap's top edge survived only as a thin etch line and stray frost dots sat in
// the corners, so at 16px it read as a plain folder. Here the back panel with its tab is the violet colour body (its
// own clear glass, hairline and rim) and the open flap is a separate frosted pane leaning forward in front of it, with
// a firm hairline and a lit top edge, so the opening reads at once. The flap's bottom sits a clear 1u above the
// panel's base (no near-tangent double line), and the panel's hairline is a ring cut away behind the frosted flap.
// Roles: back/shadow panel, pane/frost flap, accent orb, shine rim. Motion: panel wm-a (parts.A sway), flap wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'folder-open'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const soften = (set, r) => dilate(erode(set, r), r)
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // back panel with its tab (plate A), and the open flap leaning forward (plate K)
  const panel = dilate(soften(area('M3 18 V7 A2 2 0 0 1 5 5 H9 L11 7 H17 A2 2 0 0 1 19 9 V18 A2 2 0 0 1 17 20 H5 A2 2 0 0 1 3 18 Z'), 0.3), 0.85)
  const flap = dilate(soften(area('M5.18 19.4 L7.18 12.58 A1.5 1.5 0 0 1 8.62 11.5 L19.5 11.5 A1.5 1.5 0 0 1 20.93 13.42 L19.6 17.96 A2 2 0 0 1 17.68 19.4 Z'), 0.45), 0.85)
  const P = place(panel, 0.15)
  const F = place(flap, -0.35)
  const out = []
  const h = translateSet(unionSets([P, F]), 0.3, 0.8)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  // the panel: violet colour glass with an accent orb, a hairline and a lit rim
  const pd = D(P)
  out.push(['path', { d: pd, fill: grad('linearGradient', { x1: 3, y1: 5, x2: 20, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-a' }])
  out.push(['path', { d: pd, fill: grad('radialGradient', { cx: 15.5, cy: 17, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-a' }])
  out.push(['path', { d: pd, fill: grad('linearGradient', { x1: 3, y1: 5, x2: 17, y2: 17 }, [stop(0, V.frost, 0.5), stop(1, V.tint, 0.12)]), class: 'wm-a' }])
  // panel hairline as a ring, stopped where it goes behind the flap
  const behind = dilate(F, 0.1)
  out.push(['path', { d: D(differenceSets(differenceSets(dilate(P, 0.22), erode(P, 0.23)), behind)), fill: 'currentColor', 'fill-opacity': 0.22, class: 'wm-a' }])
  out.push(['path', { d: D(differenceSets(rimOf(P, 0.4), behind)), fill: V.shine, 'fill-opacity': 0.6, class: 'wm-a' }])
  // the flap: a frosted pane in front, firm hairline, bright lit top edge
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 6, y1: 10.5, x2: 18, y2: 20 }, [stop(0, V.frost, 0.72), stop(0.4, V.tint, 0.6), stop(1, V.tint, 0.45)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
