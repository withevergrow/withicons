// forge/hand/glass/plug.mjs — the glass power plug. Generated Glass merged the prongs, body and cord into one pale
// blob. Here the three read as separate parts: two vivid violet glass prongs (plate A) standing clear of each other,
// a wide frosted body with its colour glowing through, and a short thick cord (also solid colour glass) leaving the
// bottom. The prongs and cord sit behind the body so they plug into it; each has its own lit rim.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const NAME = 'plug'
const f2 = v => +v.toFixed(2)
const D = (s, t = 0.04) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const grow = (s, r) => unionSets([s, ...Array.from({ length: 12 }, (_, k) => translateSet(s, r * Math.cos(k * Math.PI / 6), r * Math.sin(k * Math.PI / 6)))])
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const rr = (x0, y0, x1, y1, r) => area(`M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`)

export default function render() {
  let n = 0
  const defs = [], gr = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${NAME}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => gr(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // body: wide shoulders, a deep round belly toward the cord
  const body = area('M7 5.6H17A2.2 2.2 0 0 1 19.2 7.8V10.4A6.3 6.3 0 0 1 12.9 16.7H11.1A6.3 6.3 0 0 1 4.8 10.4V7.8A2.2 2.2 0 0 1 7 5.6Z')
  const pL = rr(7.9, 1.6, 10.3, 7.4, 1.2), pR = rr(13.7, 1.6, 16.1, 7.4, 1.2)
  const prongs = unionSets([pL, pR])
  const cord = rr(10.7, 15.4, 13.3, 22.4, 1.3)

  const pane = s => translateSet(erode(s, 0.1), -0.25, -0.25)
  const back = s => translateSet(erode(s, 0.1), 0.5, 0.5)
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }
  const all = unionSets([body, prongs, cord])
  const halo = translateSet(back(all), 0, 0.5)
  const [a, b, c, d] = box(back(all))
  const out = []
  out.push(['path', { d: D(grow(halo, 0.9), 0.1), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(grow(halo, 0.35), 0.08), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  // prongs and cord: solid colour glass, in a deep tone so they stand clear of the pale body
  const gSolid = lin(a, b, c, d, [stop(0, V.c1), stop(1, V.shadow)])
  const solid = (set, cls) => {
    const p = pane(set)
    out.push(['path', { d: D(back(set)), fill: V.shadow, 'fill-opacity': 0.5, class: cls }])
    out.push(['path', { d: D(p), fill: gSolid, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.45, class: cls }])
    out.push(['path', { d: D(rimOf(p)), fill: V.shine, 'fill-opacity': 0.75, class: cls + ' wm-shine' }])
  }
  solid(cord, 'wm-k')
  solid(prongs, 'wm-a')

  // body: colour body with an orb of accent light, frosted pane in front
  const bb = back(body), bp = pane(body)
  out.push(['path', { d: D(bb), fill: lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(bb), fill: gr(['radialGradient', { id: id(), cx: 15.8, cy: 13.2, r: 7.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]]), class: 'wm-k' }])
  out.push(['path', { d: D(bp), fill: lin(4.8, 5.6, 19.2, 16.7, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), ...edge, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bp)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
