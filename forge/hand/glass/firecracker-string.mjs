// forge/hand/glass/firecracker-string.mjs — a sagging cord with three separate frosted glass firecrackers hanging from
// short fuses, each with its own accent band and a clear gap between tubes, the middle one bursting with a starburst.
// The generated drawing fused the tubes into one pink-blue strip and lost the string; here the cord is a clean etched
// curve and every cracker keeps its own glass silhouette.
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
// an upright rounded tube, 4.8 wide, from y0 to y1, centred on cx
const tubeAt = (cx, y0, y1) => { const l = cx - 2.4, r = cx + 2.4; return fillOf(`M${l + 1.3} ${y0}H${r - 1.3}A1.3 1.3 0 0 1 ${r} ${y0 + 1.3}V${y1 - 1.3}A1.3 1.3 0 0 1 ${r - 1.3} ${y1}H${l + 1.3}A1.3 1.3 0 0 1 ${l} ${y1 - 1.3}V${y0 + 1.3}A1.3 1.3 0 0 1 ${l + 1.3} ${y0}Z`) }

export default function render(icon) {
  const name = (icon && icon.name) || 'firecracker-string'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // three crackers hang from the sagging cord (cord y at x=4.7 / 12 / 19.3 is about 4.2 / 5.4 / 4.2)
  const T = [[4.7, 6.2, 14.2], [12, 7.4, 15.4], [19.3, 6.2, 14.2]]
  const tubes = T.map(([x, a, b]) => tubeAt(x, a, b))
  const bands = T.map(([x, a], i) => intersectSets(tubes[i], fillOf(`M${x - 3} ${a + 3}H${x + 3}V${a + 5.2}H${x - 3}Z`)))
  const all = unionSets(tubes), band = unionSets(bands)
  const back = unionSets(tubes.map(t => backOf(t, 0.4, 0.75)))
  const burst = soft(star(12, 19.6, 3, 1.2, 8, -Math.PI / 2), 0.18)

  const out = []
  out.push(['path', { d: D(translateSet(dilate(back, 0.8), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.3), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(back)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const [x0, y0, x1, y1] = box(all)
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const gBand = lin(x0, 9, x1, 17, [stop(0, V.accent), stop(1, V.shadow)])
  const gGlow = add(['radialGradient', { id: id(), cx: 12, cy: 15, r: 9, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.2), stop(1, V.accent, 0)]])
  const gSpark = add(['radialGradient', { id: id(), cx: 12, cy: 19.6, r: 3.2, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost), stop(0.35, V.accent), stop(1, V.accent)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }

  // the cord and the fuses: etch ink
  out.push(['path', { d: 'M2.6 3.4Q12 7.5 21.4 3.4', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.88, 'stroke-width': 1.15, 'stroke-linecap': 'round' }])
  out.push(['path', { d: 'M4.7 4.3V6.6M12 5.5V7.8M19.3 4.3V6.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.88, 'stroke-width': 1, 'stroke-linecap': 'round' }])
  out.push(['path', { d: D(back), fill: gBack, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(back), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(all), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(all), fill: V.frost, 'fill-opacity': 0.25, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(band), fill: gBand, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(band), fill: V.frost, 'fill-opacity': 0.18, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rimOf(all)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the spark burst under the middle cracker (plate S)
  out.push(['path', { d: D(burst), fill: gSpark, stroke: V.etch, 'stroke-opacity': 0.4, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: D(disc(11.7, 19.3, 0.6)), fill: V.shine, 'fill-opacity': 0.95, class: 'wm-s' }])
  out.push(['path', { d: D(unionSets([disc(6.6, 20.3, 0.75), disc(17.4, 20.3, 0.75)])), fill: V.accent, 'fill-opacity': 0.9, class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
