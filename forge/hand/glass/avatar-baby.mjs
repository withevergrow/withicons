// forge/hand/glass/avatar-baby.mjs - Glass baby after the Line design: a big round head (not a teardrop) with a clear frosted topknot
// curl on top, solid etch eyes, a wide smile and soft pink cheeks, over small rounded shoulders with a pink bib. Face marks are
// deep etch at high opacity so they read at 16px. Roles: back/shadow body, pane/frost glass, accent bib + cheeks, etch face,
// shine rim. Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLCZ])([^MLCZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${f2(cy - ry)} C${f2(cx + kx)} ${f2(cy - ry)} ${f2(cx + rx)} ${f2(cy - ky)} ${f2(cx + rx)} ${cy} C${f2(cx + rx)} ${f2(cy + ky)} ${f2(cx + kx)} ${f2(cy + ry)} ${cx} ${f2(cy + ry)} C${f2(cx - kx)} ${f2(cy + ry)} ${f2(cx - rx)} ${f2(cy + ky)} ${f2(cx - rx)} ${cy} C${f2(cx - rx)} ${f2(cy - ky)} ${f2(cx - kx)} ${f2(cy - ry)} ${cx} ${f2(cy - ry)} Z` }

const HEAD = oval(12, 10.9, 6.3, 6.4)
const KNOT = oval(12.3, 3.9, 2.0, 1.85)
const BODY = 'M4.8 22 C4.8 19.6 6.8 17.9 9.3 17.9 C10.5 17.9 11 18.5 12 18.5 C13 18.5 13.5 17.9 14.7 17.9 C17.2 17.9 19.2 19.6 19.2 22 Z'
const BIB = 'M9.4 18.6 C9.4 20.3 10.4 21.4 12 21.4 C13.6 21.4 14.6 20.3 14.6 18.6 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-baby'
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 17, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gHead = grad('linearGradient', { x1: 5, y1: 4, x2: 19, y2: 18 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.6), stop(1, V.tint, 0.46)])
  const gBody = grad('linearGradient', { x1: 4, y1: 17, x2: 20, y2: 22 }, [stop(0, V.frost, 0.62), stop(0.5, V.tint, 0.52), stop(1, V.tint, 0.42)])
  const gKnot = grad('linearGradient', { x1: 10, y1: 2, x2: 15, y2: 6 }, [stop(0, V.frost, 0.95), stop(1, V.tint, 0.8)])

  const head = place(area(HEAD)), knot = place(area(KNOT)), body = place(area(BODY)), bib = place(area(BIB))
  const bodyVis = tidy(differenceSets(body, head))
  const knotVis = tidy(differenceSets(knot, head))
  const all = tidy(unionSets([head, body, knot].map(s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8))))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(bodyVis), fill: gBody, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(tidy(differenceSets(bib, head))), fill: V.accent, 'fill-opacity': 0.8, stroke: V.etch, 'stroke-opacity': 0.25, 'stroke-width': 0.4, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bodyVis)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  out.push(['path', { d: D(knotVis), fill: gKnot, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(head), fill: gHead, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(head)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  out.push(['path', { d: D(rimOf(knotVis)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  // face
  for (const x of [9.5, 14.5]) {
    out.push(['ellipse', { cx: X(x), cy: X(10.9), rx: 0.95, ry: 1.2, fill: V.etch, 'fill-opacity': 0.96, class: 'wm-a' }])
    out.push(['circle', { cx: X(x - 0.3), cy: X(10.4), r: 0.3, fill: V.shine, 'fill-opacity': 0.95, class: 'wm-a' }])
  }
  for (const x of [7.9, 16.1]) out.push(['ellipse', { cx: X(x), cy: X(13.3), rx: 1.1, ry: 0.7, fill: V.accent, 'fill-opacity': 0.5, class: 'wm-a' }])
  out.push(['path', { d: tf('M9.6 13.4 C10.8 15 13.2 15 14.4 13.4'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.95, 'stroke-width': 1.05, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
