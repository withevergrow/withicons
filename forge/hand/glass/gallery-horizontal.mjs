// forge/hand/glass/gallery-horizontal.mjs — Glass gallery-horizontal, hand-drawn. One wide centre frame with a shorter, narrower frame peeking at each side, clear gaps between them.
// Roles: back/shadow bodies, pane/frost glass, etch detail, accent parts, shine rims. Motion: body wm-k, accent wm-s/wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'gallery-horizontal'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const disc = (cx, cy, r) => setOf([circle(cx, cy, r, 0.15)])
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

function kit(glow) {
  let n = 0
  const defs = [], out = []
  const grad = (tag, a, stops) => { const g = [tag, { id: 'wg-glass-' + NAME + '-' + n++, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return 'url(#' + g[1].id + ')' }
  const body = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const warm = grad('radialGradient', { cx: glow[0], cy: glow[1], r: glow[2] }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const frost = grad('linearGradient', { x1: 3, y1: 3, x2: 19, y2: 19 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.48), stop(1, V.tint, 0.34)])
  const bead = grad('linearGradient', { x1: 12, y1: 6, x2: 20, y2: 22 }, [stop(0, V.accent), stop(1, V.accent, 0.8)])
  const glass = (sets, k = 'wm-k') => {
    const Fs = sets.map(s => place(s, -0.45))
    const Bs = sets.map(s => translateSet(place(erode(s, 0.4), 0), 0.55, 0.5))
    const h = translateSet(unionSets(Bs), 0, 0.5)
    out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
    out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
    for (const B of Bs) { const d = D(B); out.push(['path', { d, fill: body, class: k }]); out.push(['path', { d, fill: warm, class: k }]) }
    for (const F of Fs) {
      out.push(['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, class: k }])
      out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
    }
  }
  const etch = (d, w = 0.8, op = 0.72, k = 'wm-k') => out.push(['path', { d, fill: 'none', stroke: V.etch, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: k }])
  const etchFill = (set, op = 0.6, k = 'wm-k') => out.push(['path', { d: D(set), fill: V.etch, 'fill-opacity': op, class: k }])
  const gem = (set, k = 'wm-s', fill = bead) => {
    out.push(['path', { d: D(set), fill, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: k }])
    out.push(['path', { d: D(rimOf(set)), fill: V.shine, 'fill-opacity': 0.9, class: k }])
  }
  const halo = (set, r = 0.6) => out.push(['path', { d: D(dilate(set, r)), fill: V.frost, 'fill-opacity': 0.92, class: 'wm-s' }])
  return { out, defs, glass, etch, etchFill, gem, halo, body, done: () => [['defs', {}, defs], ...out] }
}

const rr = (x0, y0, x1, y1, r) => area('M' + (x0 + r) + ' ' + y0 + ' H' + (x1 - r) + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) + ' V' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 + ' H' + (x0 + r) + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) + ' V' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z')
export default function render() {
  const g = kit([15, 15, 7])
  g.glass([rr(1.6, 7, 5, 17, 1.2), rr(19.6, 7, 23, 17, 1.2), rr(6.6, 4, 18, 20, 2)])
  // a little landscape in the centre frame
  g.etch('M8.6 16.6 L11.2 13.4 L13 15.2 L14.4 13.9 L16.2 16.6', 0.8)
  g.gem(disc(14.6, 8.9, 1.35), 'wm-a')
  return g.done()
}
