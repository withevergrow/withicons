// forge/hand/glass/firecracker.mjs — a fat frosted glass firecracker tube with a bold accent (red) band, a curved fuse
// rising from its top and a bright starburst spark attached to the fuse tip, with two small twinkles.
// The generated drawing was a dull lozenge with a tiny detached spark; the squat tube, the colour band, the visible
// fuse and the big spark joined to it read at once as a lit cracker at 16-24px.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD, parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, intersectSets, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const fillOf = d => setOf(parsePath(d, 0.12).filter(s => s.pts.length > 2).map(s => s.pts))
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const soft = (s, r) => dilate(erode(s, r), r)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const star = (cx, cy, R, r, n, rot) => { const p = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r : R; p.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]) } return setOf([p]) }

export default function render(icon) {
  const name = (icon && icon.name) || 'firecracker'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // the tube and its red band (cut from the tube so it stays inside the glass)
  const tube = fillOf('M7.6 8.9H12A2 2 0 0 1 14 10.9V19.5A2 2 0 0 1 12 21.5H7.6A2 2 0 0 1 5.6 19.5V10.9A2 2 0 0 1 7.6 8.9Z')
  const band = intersectSets(tube, fillOf('M5 12.6H15V16.6H5Z'))
  const back = backOf(tube, 0.5, 0.9)
  const sx = 15.2, sy = 4.9
  const burst = soft(star(sx, sy, 3.8, 1.15, 8, -Math.PI / 2), 0.2)
  const deco = unionSets([disc(19.2, 9.4, 0.85), disc(10.6, 2.4, 0.7)])

  const out = []
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(back)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = add(['radialGradient', { id: id(), cx: 12, cy: 17, r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.2), stop(1, V.accent, 0)]])
  const [x0, y0, x1, y1] = box(tube)
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const gBand = lin(x0, 12.6, x1, 16.6, [stop(0, V.accent), stop(1, V.shadow)])
  const gSpark = add(['radialGradient', { id: id(), cx: sx, cy: sy, r: 3.8, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost), stop(0.35, V.accent), stop(1, V.accent)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }

  out.push(['path', { d: D(back), fill: gBack, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(back), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(tube), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(tube), fill: V.frost, 'fill-opacity': 0.25, 'fill-rule': 'evenodd' }])
  // the band: accent glass with etched edges
  out.push(['path', { d: D(band), fill: gBand, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(band), fill: V.frost, 'fill-opacity': 0.18, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: 'M5.9 12.6H13.7M5.9 16.6H13.7', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.45, 'stroke-width': 0.45 }])
  out.push(['path', { d: 'M8.4 14.6H11.4', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.9, 'stroke-linecap': 'round' }])
  out.push(['path', { d: D(rimOf(tube)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the fuse: deep etch ink rising from the cap, curling to the spark (plate A)
  out.push(['path', { d: 'M9.8 8.9C9.8 7 11.2 6 13.9 5.3', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.9, 'stroke-width': 1.15, 'stroke-linecap': 'round', class: 'wm-a' }])
  // the spark: a luminous accent starburst joined to the fuse tip
  out.push(['path', { d: D(burst), fill: gSpark, stroke: V.etch, 'stroke-opacity': 0.4, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(disc(sx - 0.3, sy - 0.3, 0.75)), fill: V.shine, 'fill-opacity': 0.95, class: 'wm-a' }])
  out.push(['path', { d: D(deco), fill: V.accent, 'fill-opacity': 0.9, class: 'wm-deco' }])
  return [['defs', {}, defs], ...out]
}
