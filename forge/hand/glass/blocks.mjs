// forge/hand/glass/blocks.mjs — three identical frosted rounded squares stacked one on top, two below (as the line icon).
// Each block is its own glass pane over an offset colour body with a soft accent glow, a lit rim and an etched inner
// facet; the generated drawing swapped them for a triangle and a sphere, so it no longer read as building blocks.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) => {
  const pts = []
  for (const [cx, cy, a0] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let i = 0; i <= 12; i++) { const a = (a0 + 90 * i / 12) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return setOf([pts])
}
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

export default function render(icon) {
  const name = (icon && icon.name) || 'blocks'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const S = 7.6, R = 2.2
  const sq = (x, y) => rr(x, y, x + S, y + S, R)
  const blocks = [sq(8.2, 2.6), sq(2.6, 13.6), sq(13.8, 13.6)]
  const all = unionSets(blocks)
  const out = []
  out.push(['path', { d: D(translateSet(dilate(unionSets(blocks.map(b => backOf(b, 0.45, 1.25))), 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(unionSets(blocks.map(b => backOf(b, 0.45, 1.25))), 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }
  blocks.forEach((b, i) => {
    const bx = i === 0 ? 8.2 : i === 1 ? 2.6 : 13.8, by = i === 0 ? 2.6 : 13.6
    const back = backOf(b, 0.45, 1.25)
    const gBack = add(['linearGradient', { id: id(), x1: f2(bx), y1: f2(by), x2: f2(bx + S + 2), y2: f2(by + S + 2), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]])
    const gGlow = add(['radialGradient', { id: id(), cx: f2(bx + S * 0.78), cy: f2(by + S * 0.8), r: 5.2, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
    const gPane = add(['linearGradient', { id: id(), x1: f2(bx), y1: f2(by), x2: f2(bx + S), y2: f2(by + S), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]])
    out.push(['path', { d: D(back), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(back), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(b), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(b), fill: V.frost, 'fill-opacity': 0.25, 'fill-rule': 'evenodd', class: 'wm-k' }])
    // etched inner facet
    out.push(['path', { d: D(differenceSets(erode(b, 2.0), erode(b, 2.5))), fill: V.etch, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }])
    out.push(['path', { d: D(rimOf(b)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  })
  return [['defs', {}, defs], ...out]
}
