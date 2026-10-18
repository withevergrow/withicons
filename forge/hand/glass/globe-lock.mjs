// forge/hand/glass/globe-lock.mjs — Glass globe-lock, hand-drawn. Clear globe with firm meridians and equator; a smaller lock with a visible shackle on a frost halo.
// Roles: back/shadow bodies, pane/frost glass, etch detail, accent parts, shine rims. Motion: body wm-k, accent wm-s/wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'globe-lock'
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

export default function render() {
  const g = kit([9, 9, 9])
  g.glass([disc(10.4, 10.4, 8.4)])
  g.etch('M2.3 10.6 H18.6 M3.6 6.4 H17.2 M3.6 14.8 H14.2 M10.4 2.4 C6.4 6.6 6.4 15 10.4 19.2 M10.4 2.4 C14 6 14.4 10.6 13.4 13.6')
  const lock = area('M16.4 17.6 Q16.4 16.8 17.2 16.8 H21.6 Q22.4 16.8 22.4 17.6 V21.4 Q22.4 22.2 21.6 22.2 H17.2 Q16.4 22.2 16.4 21.4 Z')
  const shackle = 'M17.8 17 V15.4 A1.6 1.6 0 0 1 21 15.4 V17'
  g.out.push(['path', { d: shackle, fill: 'none', stroke: V.frost, 'stroke-opacity': 0.92, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'wm-s' }])
  g.halo(lock, 0.6)
  g.out.push(['path', { d: shackle, fill: 'none', stroke: g.body, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-s' }])
  g.gem(lock)
  g.out.push(['circle', { cx: 19.4, cy: 19.4, r: 0.8, fill: V.etch, 'fill-opacity': 0.75, class: 'wm-s' }])
  return g.done()
}
