// forge/hand/glass/avatar-woman-braids.mjs — Glass woman with braids, hand-drawn: the generated drawing was one pale
// frosted pane where the braids, the hair and the face washed together on white and the face had no contour. Here the
// hair is solid deep violet glass (a centre-parted cap and two plaits of three round beads hanging well clear of the face,
// the top bead tucked under the cap in one smooth outline, tipped with accent ties), over a clear frosted face oval with a
// crisp edge, solid etch eyes and a smile. The hair has its own opaque violet base, so it stays in register.
// Roles: back/shadow body + hair, pane/frost glass, accent ties + glow, etch face, shine rim. Motion: body wm-k, face wm-a, ties wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-woman-braids'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.06) => setD(s.filter(r => Math.abs(ringArea(r)) > 0.08), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }
const mirror = ([x, y, rx, ry]) => [f2(24 - x), y, rx, ry]

// ---- drawing (skeleton coordinates, 24 grid) ----
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'
const FACE = oval(12, 11, 6.3, 6.6)
const EYE_Y = 11.9
const SMILE = 'M10 14.6 C11 15.6 13 15.6 14 14.6'
// the hair: a centre-parted cap whose side locks come down outside the temples into the top bead of each plait
const CAP = 'M5.2 11.6 C4.6 6.8 8.1 3.5 12 3.5 C15.9 3.5 19.4 6.8 18.8 11.6 C17.8 9.9 16.3 9 14.8 8.7 C13.6 8.5 12.6 8 12 7.3 C11.4 8 10.4 8.5 9.2 8.7 C7.7 9 6.2 9.9 5.2 11.6 Z'
// the plaits: three beads each, about 3.5u clear of the face edge; the top bead starts under the cap edge (y 11.2)
const TOP = [4.3, 12.9, 2.05, 1.7]
const BEADS = [[4.2, 15.85, 2, 1.65], [4.3, 18.6, 1.75, 1.45]]
// the accent hair ties at the plait tips
const TIES = [4.3, 19.7].map(x => `M${x - 0.75} 19.55 H${x + 0.75} C${x + 1.2} 19.55 ${x + 1.45} 19.85 ${x + 1.45} 20.2 C${x + 1.45} 20.55 ${x + 1.2} 20.85 ${x + 0.75} 20.85 H${x - 0.75} C${x - 1.2} 20.85 ${x - 1.45} 20.55 ${x - 1.45} 20.2 C${x - 1.45} 19.85 ${x - 1.2} 19.55 ${x - 0.75} 19.55 Z`).join(' ')

// the side lock: leaves the cap's outer edge on its own tangent and sweeps out onto the top bead, so cap and plait share
// one continuous outline and one shine rim (no notch where they meet)
const LOCK = 'M5.3 8.9 C5 10.2 2.9 10.7 2.42 12.4 L5.6 12.3 L5.6 10.6 Z'
const LOCK_R = 'M18.7 8.9 C19 10.2 21.1 10.7 21.58 12.4 L18.4 12.3 L18.4 10.6 Z'

function hairSet() {
  const beads = [TOP, ...BEADS].flatMap(b => [b, mirror(b)]).map(b => area(oval(...b)))
  return tidy(unionSets([area(CAP), area(LOCK), area(LOCK_R), ...beads]))
}

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gTie = grad('linearGradient', { x1: 12, y1: 19.4, x2: 12, y2: 20.1 }, [stop(0, V.shine, 0.45), stop(1, V.shine, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  // the hair's own opaque violet base, and a frosty sheen on its lit top-left
  const gHair = grad('linearGradient', { x1: 5, y1: 3, x2: 14, y2: 20 }, [stop(0, V.c1), stop(0.55, V.shadow)])
  const gSheen = grad('linearGradient', { x1: 4, y1: 3, x2: 11, y2: 11 }, [stop(0, V.frost, 0.42), stop(0.55, V.frost, 0.1), stop(1, V.frost, 0)])

  const hair = place(hairSet())
  const sh = place(area(SHOULDERS)), face = place(area(FACE))
  const skinVis = [tidy(differenceSets(sh, unionSets([face, hair]))), tidy(differenceSets(face, hair))]
  const back = s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8)
  const body = tidy(unionSets([back(sh), back(face)]))
  const all = tidy(unionSets([body, hair]))
  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.35), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.3), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  // the skin is lit as one: one colour body behind face and shoulders, with an accent glow low in the chest
  const bd = D(body, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  skinVis.forEach(s => out.push(['path', { d: D(s), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }]))
  // the hair: a soft drop onto the face, the opaque violet base, the sheen with a hairline
  out.push(['path', { d: D(intersectSets(translateSet(hair, 0.05, 0.25), unionSets([face, sh])), 0.15), fill: V.shadow, 'fill-opacity': 0.3, class: 'wm-k' }])
  out.push(['path', { d: D(hair, 0.09), fill: gHair, ...EDGE, 'stroke-opacity': 0.3, class: 'wm-k' }])
  out.push(['path', { d: D(intersectSets(erode(hair, 0.25), area('M0 0H13V11.5H0Z')), 0.1), fill: gSheen, class: 'wm-k' }])
  for (const s of [...skinVis, hair]) out.push(['path', { d: D(rimOf(s), 0.1), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: tf(TIES), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: tf(TIES), fill: gTie, class: 'wm-s' }])
  // face: solid etch eyes, a smile, specular dots
  for (const x of [9.5, 14.5]) out.push(['ellipse', { cx: X(x), cy: X(EYE_Y), rx: 0.78, ry: 0.98, fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: tf(SMILE), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: tf(`M9.25 ${EYE_Y - 0.35} L9.3 ${EYE_Y - 0.4} M14.25 ${EYE_Y - 0.35} L14.3 ${EYE_Y - 0.4}`), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
