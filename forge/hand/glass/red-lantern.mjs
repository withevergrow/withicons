// forge/hand/glass/red-lantern.mjs — Glass red lantern, hand-drawn: the generated lantern froze body, caps and tassel
// into one pale frosted blob, so the caps were lost, the tassel was a frosty drip and the whole thing washed out on white.
// Here a thinner frost lets the coloured body glow through the round paper body with its etched ribs, the top and
// bottom caps are solid deep glass bands in front of it, and the tassel is a bold accent cord with a knot and a flared
// fringe, so the silhouette (cap, ball, cap, tassel) holds at 16px.
// Roles: back/shadow body + caps, pane/frost glass, etch ribs, accent tassel + glow, shine rim.
// Motion: lantern wm-k (sways from 12 3), tassel plate A (wm-a, sways from 12 19).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'red-lantern'
const K = 0.94
const f = v => +v.toFixed(2)
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = set => setD(set, 0.05)
// bake the pane placement into an absolute path written in skeleton coordinates
const onPane = (d, dd = -0.45) => d.replace(/-?\d*\.?\d+/g, v => String(f(12 + (+v - 12) * K + dd)))
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  const ball = area('M12 4.9C17.2 4.9 20.6 7.7 20.6 11.1C20.6 14.5 17.2 17.3 12 17.3C6.8 17.3 3.4 14.5 3.4 11.1C3.4 7.7 6.8 4.9 12 4.9Z')
  const top = area('M9.6 2.9H14.4A1 1 0 0 1 15.4 3.9V6.3H8.6V3.9A1 1 0 0 1 9.6 2.9Z')
  const bot = area('M8.6 15.9H15.4V18.1A1 1 0 0 1 14.4 19.1H9.6A1 1 0 0 1 8.6 18.1Z')
  const tassel = area('M11.5 18.8H12.5V19.9L13.75 22.05A0.5 0.5 0 0 1 13.3 22.75H10.7A0.5 0.5 0 0 1 10.25 22.05L11.5 19.9Z')
  const F = place(ball, -0.45)
  const T = place(top, -0.45), Bt = place(bot, -0.45), Ts = place(tassel, -0.45)
  const B = translateSet(place(erode(ball, 0.35), 0), 0.55, 0.5)
  const out = []
  const h = translateSet(unionSets([B, translateSet(unionSets([T, Bt, Ts]), 0.3, 0.3)]), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 13.6, cy: 12.4, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // tassel: a bold accent cord and fringe hanging under the bottom cap
  out.push(['path', { d: D(Ts), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: onPane('M11.6 20.9L11.3 22.25M12.4 20.9L12.7 22.25'), fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.45, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }])
  // the paper ball: thinner frost so the colour glows through, firm hairline, etched ribs
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 3, y1: 4.5, x2: 19, y2: 17 }, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.4), stop(1, V.tint, 0.26)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  out.push(['path', { d: onPane('M10.1 6.1Q7.1 11.1 10.1 16.1M13.9 6.1Q16.9 11.1 13.9 16.1M8.9 6.1C5.4 7.3 4.6 9.2 4.6 11.1C4.6 13 5.4 14.9 8.9 16.1M15.1 6.1C18.6 7.3 19.4 9.2 19.4 11.1C19.4 13 18.6 14.9 15.1 16.1'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: onPane('M12 6.4V15.8'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.35, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the caps: solid deep glass bands in front of the ball
  const cap = { fill: body, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }
  out.push(['path', { d: D(T), ...cap }])
  out.push(['path', { d: D(Bt), ...cap }])
  // lit rims: ball (kept off the caps, which sit in front), caps
  out.push(['path', { d: D(unionSets([differenceSets(rimOf(F), dilate(unionSets([T, Bt]), 0.25)), rimOf(T, 0.35), rimOf(Bt, 0.35)])), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
