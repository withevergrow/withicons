// forge/hand/glass/kite.mjs — Glass kite, hand-drawn: the generated diamond was a pale frosted pane with a faint edge
// that dissolved on white, its spars were thin, and an oversized hard pink triangle under it stole the read (it looked
// like a play badge under a window). Here the diamond is a sturdier glass sail with eased corners, a firm hairline and
// the violet body close behind it, the spine and the bowed cross spar are etched bold, and the tail is a smaller
// rounded accent glass tassel tied under the bottom corner. Motion: sail wm-k (rocks about 12 10), tail wm-s (sways).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'kite'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const soften = (set, r) => tidy(dilate(tidy(erode(set, r)), r))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.38, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: the diamond sail (corners eased) and the tassel under its bottom corner
  const sail = place(soften(area('M12 2.2 L19.9 10 L12 17.8 L4.1 10 Z'), 0.7))
  const B = translateSet(tidy(erode(sail, 0.3)), 0.7, 0.7)
  const tail = place(soften(unionSets([area('M12 17.4 L9.2 21.8 H14.8 Z'), roundStrokeSet([[12, 16.8], [12, 18.6]], 1.1)]), 0.45))

  const out = []
  const all = tidy(unionSets([B, translateSet(tail, 0.3, 0.3)]))
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  // tail first, tucked behind the bottom corner: luminous accent glass with a lit face and a hairline
  out.push(['path', { d: D(tail), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: D(tail), fill: grad('linearGradient', { x1: 9.5, y1: 17, x2: 13, y2: 21.5 }, [stop(0, V.shine, 0.55), stop(0.55, V.shine, 0), stop(1, V.shadow, 0.3)]), class: 'wm-s' }])
  // sail: violet body close behind, accent orb low right, frosted pane, firm hairline
  out.push(['path', { d: D(B), fill: grad('linearGradient', { x1: 4, y1: 2, x2: 20, y2: 19 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: grad('radialGradient', { cx: 15.2, cy: 13.4, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(sail), fill: grad('linearGradient', { x1: 4, y1: 2, x2: 18, y2: 17 }, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.42), stop(1, V.tint, 0.28)]),
    ...EDGE, class: 'wm-k',
  }])
  // spine and bowed cross spar, etched bold
  out.push(['path', {
    d: `M${X(12)} ${X(3.7)}V${X(16.3)}M${X(5.6)} ${X(9.75)}C${X(9)} ${X(6.9)} ${X(15)} ${X(6.9)} ${X(18.4)} ${X(9.75)}`,
    fill: 'none', stroke: V.etch, 'stroke-opacity': 0.66, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k',
  }])
  out.push(['path', { d: D(rimOf(sail)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
