// forge/hand/glass/hard-drive.mjs — a frosted glass hard drive: a lighter top face and a front face split by a clear
// gap that lets the colour body show through, a deep etched slot and a luminous accent activity LED.
// The generated drawing was one smooth rounded slab with a hairline slot, so it read as a card; the two separated
// faces, the visible colour underside and the glowing LED make it an unmistakable drive at 16-24px.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD, parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const fillOf = d => setOf(parsePath(d, 0.15).filter(s => s.pts.length > 2).map(s => s.pts))
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

export default function render(icon) {
  const name = (icon && icon.name) || 'hard-drive'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // top face (a low sloped lid) and front face, parted by a 0.9u gap
  const top = fillOf('M2.9 9.9 L4.6 6.6 Q5.4 5.1 7.1 5.1 H16.9 Q18.6 5.1 19.4 6.6 L21.1 9.9 Z')
  const front = fillOf('M2.6 10.8 H21.4 V16.9 A2.5 2.5 0 0 1 18.9 19.4 H5.1 A2.5 2.5 0 0 1 2.6 16.9 Z')
  const all = unionSets([top, front])
  const back = unionSets([backOf(top, 0.4, 0.8), backOf(front, 0.4, 0.9), translateSet(erode(fillOf('M3 9 H21 V11.4 H3 Z'), 0.1), 0.8, 0.8)])

  const out = []
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(back)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = add(['radialGradient', { id: id(), cx: 17.5, cy: 15.5, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  const [x0, y0, x1, y1] = box(all)
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const gLid = lin(x0, y0, x1 - 3, y0 + 6, [stop(0, V.frost, 0.8), stop(1, V.tint, 0.55)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }

  out.push(['path', { d: D(back), fill: gBack, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(back), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(top), fill: gLid, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(front), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(front), fill: V.frost, 'fill-opacity': 0.25, 'fill-rule': 'evenodd' }])
  // a faint etched platter arc on the lid
  out.push(['path', { d: 'M8.2 8.6A4.2 1.9 0 0 1 15.8 8.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.3, 'stroke-width': 0.6, 'stroke-linecap': 'round' }])
  out.push(['path', { d: D(rimOf(top)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: D(rimOf(front)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the slot: a deep etched pill with its own lit lip
  out.push(['path', { d: 'M5.6 14.45H12.6A.85 .85 0 0 1 12.6 16.15H5.6A.85 .85 0 0 1 5.6 14.45Z', fill: V.etch, 'fill-opacity': 0.82, class: 'wm-a' }])
  out.push(['path', { d: 'M6 14.7H12.2', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-a' }])
  // the activity LED: a luminous accent bead
  out.push(['path', { d: D(disc(18.1, 15.3, 1.55)), fill: V.accent, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(disc(17.65, 14.85, 0.45)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
