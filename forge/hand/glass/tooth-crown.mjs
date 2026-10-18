// forge/hand/glass/tooth-crown.mjs — Glass tooth with its crown lifted off, hand-drawn: the generated drawing frosted
// crown and tooth alike in pale glass with a faint edge, so on white the two parts washed out and the crown did not stand
// apart as its own piece. Here the crown cap is deep, saturated glass (thin frost, firm hairline, accent glow) floating
// clear above a frosted white tooth, whose concave top echoes the crown's underside; a shine stroke marks the crown.
// Roles: back/shadow body, pane/frost glass, accent glow, shine rim. Motion: crown wm-k, tooth wm-a (parts.A pulse).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'tooth-crown'
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const area = d => unionSets(parsePath(d, 0.12).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-linejoin': 'round', 'stroke-width': 0.5 }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // crown cap: two rounded cusps with a soft dip, a gently sagging underside
  const crown = tidy(area('M3.75 9.5 C2.75 6.75 3.5 3.75 6.25 2.75 C8.25 2 10.25 2.75 12 4 C13.75 2.75 15.75 2 17.75 2.75 C20.5 3.75 21.25 6.75 20.25 9.5 C17.5 10.75 6.5 10.75 3.75 9.5 Z'))
  // the prepared tooth: a concave top that follows the crown's underside, two roots
  const tooth = tidy(area('M5.25 13 C8.25 14.25 15.75 14.25 18.75 13 C18.5 15.5 18 17.5 17.5 19 C17.25 20.5 16.5 21.5 15.5 21.5 C14.25 21.5 13.75 20.25 13.5 19 C13.25 17.75 12.75 17 12 17 C11.25 17 10.75 17.75 10.5 19 C10.25 20.25 9.75 21.5 8.5 21.5 C7.5 21.5 6.75 20.5 6.5 19 C6 17.5 5.5 15.5 5.25 13 Z'))
  const crownB = translateSet(tidy(erode(crown, 0.3)), 0.7, 0.7)
  const toothB = translateSet(tidy(erode(tooth, 0.25)), 0.6, 0.45)
  const all = tidy(unionSets([crownB, toothB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])

  // the tooth: frosted white glass over the colour body
  out.push(['path', { d: D(toothB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(tooth), fill: grad('linearGradient', { x1: 5, y1: 13, x2: 18.5, y2: 21.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.54), stop(1, V.tint, 0.42)]), ...EDGE, 'stroke-opacity': 0.34, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(tooth)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the crown: deep saturated glass with an accent glow, a firm edge and a shine stroke on its left cusp
  out.push(['path', { d: D(crownB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(crownB), fill: grad('radialGradient', { cx: 16.5, cy: 8.5, r: 7 }, [stop(0, V.accent, 0.65), stop(0.5, V.accent, 0.25), stop(1, V.accent, 0)]), 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(crown), fill: grad('linearGradient', { x1: 3.5, y1: 2.5, x2: 20.5, y2: 10.5 }, [stop(0, V.frost, 0.5), stop(0.45, V.tint, 0.26), stop(1, V.tint, 0.16)]), ...EDGE, 'stroke-opacity': 0.36, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(crown)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: 'M6.5 7.5C6.5 6.25 7.25 5.25 8.5 4.9', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
