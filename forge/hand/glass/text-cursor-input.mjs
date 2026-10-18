// forge/hand/glass/text-cursor-input.mjs — an input field split into two frosted halves (rounded on the outside, open in the
// middle) with an accent I-beam caret overlapping the gap and an etched placeholder dash on the left half, as in line.
// The generated drawing was one whole box with a small centred caret; the split halves are what make it a text field.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
// rounded rectangle with a radius per corner [tl, tr, br, bl]
const rr = (x0, y0, x1, y1, [tl, tr, br, bl]) => {
  const pts = []
  for (const [cx, cy, a0, r] of [[x1 - tr, y0 + tr, -90, tr], [x1 - br, y1 - br, 0, br], [x0 + bl, y1 - bl, 90, bl], [x0 + tl, y0 + tl, 180, tl]])
    for (let i = 0; i <= 12; i++) { const a = (a0 + 90 * i / 12) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return setOf([pts])
}
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

export default function render(icon) {
  const name = (icon && icon.name) || 'text-cursor-input'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const left = rr(2.2, 6.6, 11.8, 17.0, [2.4, 0.8, 0.8, 2.4])
  const right = rr(17.2, 6.6, 21.8, 17.0, [0.8, 2.4, 2.4, 0.8])
  const halves = unionSets([left, right])
  const back = unionSets([backOf(left, 0.55, 1.2), backOf(right, 0.55, 1.2)])
  const out = []
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(back)
  const gBack = add(['linearGradient', { id: id(), x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]])
  const gGlow = add(['radialGradient', { id: id(), cx: 7, cy: 14, r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.18), stop(1, V.accent, 0)]])
  const gPane = add(['linearGradient', { id: id(), x1: 2.2, y1: 6.6, x2: 21.8, y2: 17, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]])
  out.push(['path', { d: D(back), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(back), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(halves), fill: gPane, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(halves), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(halves)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // placeholder dash etched on the left half
  out.push(['path', { d: 'M5.4 11.8H8.8', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the I-beam caret: accent glass over the gap, with a hairline of etch ink so it holds on the pale panes
  const caret = 'M12.5 3.8H16.5M14.5 3.8V20.2M12.5 20.2H16.5'
  out.push(['path', { d: caret, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.28, 'stroke-width': 2.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: caret, fill: 'none', stroke: V.accent, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M14.15 6.2V17.8', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])
  return [['defs', {}, defs], ...out]
}
