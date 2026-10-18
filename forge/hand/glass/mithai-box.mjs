// forge/hand/glass/mithai-box.mjs — Glass mithai box, hand-drawn: the generated drawing melted the two laddoos and the
// barfi into one frosted cloud sitting on a slab with a plain seam, so it read as a cake or a cloud over a crate. Here
// three separate sweets sit down inside an open glass box (two round accent laddoos, a violet diamond barfi with a
// silver-leaf shine), the box front rises over their bases, a lid seam is etched under the rim and a small accent
// diamond motif marks the front. Motion: box wm-k (breathes from its base), sweets wm-a (bounce about 12 11).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'mithai-box'
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
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.34, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const HAIR = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: an open box (rounded, landscape) and three sweets sunk into it
  const box = place(area('M3 12.5 H21 V19.5 A2 2 0 0 1 19 21.5 H5 A2 2 0 0 1 3 19.5 Z'))
  const B = translateSet(tidy(erode(box, 0.3)), 0.7, 0.7)
  const L1 = [6.2, 11], L2 = [17.8, 11], LR = 2.75
  const laddoos = place(unionSets([setOf([circle(L1[0], L1[1], LR)]), setOf([circle(L2[0], L2[1], LR)])]))
  const barfi = place(soften(area('M12 5.2 L15.3 8.5 L12 11.8 L8.7 8.5 Z'), 0.5))

  const out = []
  const all = tidy(unionSets([B, laddoos, barfi]))
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 3, y1: 5, x2: 22, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])

  // the sweets, behind the box front: accent laddoos (shaded round), a violet barfi with a silver-leaf pane
  out.push(['path', { d: D(laddoos), fill: V.accent, ...HAIR, class: 'wm-a' }])
  for (const [cx, cy] of [L1, L2]) {
    out.push(['circle', { cx: X(cx), cy: X(cy), r: f2(LR * S), fill: grad('radialGradient', { cx: f2(X(cx) - 0.9), cy: f2(X(cy) - 1), r: 3 }, [stop(0, V.shine, 0.45), stop(0.45, V.shine, 0), stop(1, V.shadow, 0.4)]), class: 'wm-a' }])
    out.push(['circle', { cx: f2(X(cx) - 0.8), cy: f2(X(cy) - 0.95), r: 0.45, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a wm-shine' }])
  }
  out.push(['path', { d: D(barfi), fill: gBack, ...HAIR, class: 'wm-a' }])
  out.push(['path', { d: D(translateSet(tidy(erode(barfi, 0.75)), -0.15, -0.15)), fill: grad('linearGradient', { x1: 9.5, y1: 5.5, x2: 13.5, y2: 10.5 }, [stop(0, V.frost, 0.75), stop(1, V.tint, 0.25)]), class: 'wm-a' }])

  // the box: colour body with an accent orb low right, frosted front over the sweets' bases, firm hairline
  out.push(['path', { d: D(B), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: grad('radialGradient', { cx: 16.6, cy: 19, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(box), fill: grad('linearGradient', { x1: 2.5, y1: 11, x2: 20, y2: 21.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.38)]),
    ...EDGE, class: 'wm-k',
  }])
  // lid seam under the rim, and an accent diamond motif on the front
  out.push(['path', { d: `M${X(4.4)} ${X(15.2)}H${X(19.6)}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }])
  const m = place(area('M12 16.7 L13.6 18.3 L12 19.9 L10.4 18.3 Z'))
  out.push(['path', { d: D(m), fill: V.accent, 'fill-opacity': 0.9, stroke: V.etch, 'stroke-opacity': 0.35, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(box)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
