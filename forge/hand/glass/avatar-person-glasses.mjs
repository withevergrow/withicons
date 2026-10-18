// forge/hand/glass/avatar-person-glasses.mjs — Glass person with glasses, hand-drawn: the generated drawing faded the
// hair, face and shoulders into one pale pane and thinned the glasses to a faint etched wire that vanished at 16px. Here
// the short hair is a solid deep violet glass cap on its own opaque base (rounded tucks at the temples), the face a clear frosted oval with a crisp edge, and the glasses are two
// bright clear lenses with a bold etch-ink frame, bridge and temples and eye dots inside, over a small smile.
// Roles: back/shadow body + hair, pane/frost glass + lenses, accent glow, etch frame and face, shine rim. Motion: body wm-k, face + glasses wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-person-glasses'
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

// ---- drawing (skeleton coordinates, 24 grid) ----
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'
const FACE = oval(12, 11, 6.3, 6.6)
// short hair: a cap with a soft side-swept hairline; each lower tip ends in a rounded tuck that crosses the face edge
// at a clear angle (a deliberate overlap, no tangent sliver at the temple)
const CAP = 'M6.4 10.3 C6 11.05 5.2 10.85 5.1 10 C4.85 6.3 7.9 3.6 12 3.6 C16.1 3.6 19.15 6.3 18.9 10 C18.8 10.85 18 11.05 17.6 10.3 C17 9 16.2 8.2 14.6 7.9 C12.9 7.6 11.3 7.9 9.6 7.3 C8.3 7.9 7.1 8.8 6.4 10.3 Z'
// the glasses: two rounded lenses on a bridge, short temples to the face edge
const lens = (x0, x1) => `M${x0 + 1.2} 10.1 H${x1 - 1.2} C${x1 - 0.5} 10.1 ${x1} 10.6 ${x1} 11.3 V12.4 C${x1} 13.1 ${x1 - 0.5} 13.6 ${x1 - 1.2} 13.6 H${x0 + 1.2} C${x0 + 0.5} 13.6 ${x0} 13.1 ${x0} 12.4 V11.3 C${x0} 10.6 ${x0 + 0.5} 10.1 ${x0 + 1.2} 10.1 Z`
const LENSES = lens(6.8, 11.2) + ' ' + lens(12.8, 17.2)
const FRAME_BITS = 'M11.2 11.3 C11.7 10.85 12.3 10.85 12.8 11.3 M6.8 11.1 H5.9 M17.2 11.1 H18.1'
const EYE_Y = 11.95
const SMILE = 'M10.5 15.1 C11.4 15.85 12.6 15.85 13.5 15.1'
export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  // the hair's own opaque violet base, and a frosty sheen on its lit top-left
  const gHair = grad('linearGradient', { x1: 6, y1: 2, x2: 15, y2: 12 }, [stop(0, V.c1), stop(0.7, V.shadow)])
  const gSheen = grad('linearGradient', { x1: 5, y1: 2, x2: 12, y2: 9 }, [stop(0, V.frost, 0.42), stop(0.55, V.frost, 0.1), stop(1, V.frost, 0)])

  const hair = place(area(CAP))
  const sh = place(area(SHOULDERS)), face = place(area(FACE))
  const skinVis = [tidy(differenceSets(sh, face)), tidy(differenceSets(face, hair))]
  const back = s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8)
  const body = tidy(unionSets([back(sh), back(face)]))
  const all = tidy(unionSets([body, hair]))
  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.3), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.25), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  // the skin is lit as one: one colour body behind face and shoulders, with an accent glow low in the chest
  const bd = D(body, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  skinVis.forEach(s => out.push(['path', { d: D(s), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }]))
  // the hair: a soft drop onto the face, the opaque violet base, the sheen with a hairline
  out.push(['path', { d: D(intersectSets(translateSet(hair, 0.05, 0.25), face), 0.12), fill: V.shadow, 'fill-opacity': 0.3, class: 'wm-k' }])
  const hd = D(hair)
  out.push(['path', { d: hd, fill: gHair, class: 'wm-k' }])
  out.push(['path', { d: hd, fill: gSheen, ...EDGE, 'stroke-opacity': 0.3, class: 'wm-k' }])
  for (const s of [...skinVis, hair]) out.push(['path', { d: D(rimOf(s), 0.08), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the glasses: bright clear lenses with a bold etch frame, eyes behind
  const ink = { fill: 'none', stroke: V.etch, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  out.push(['path', { d: tf(LENSES), fill: V.frost, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-a' }])
  for (const x of [9, 15]) out.push(['ellipse', { cx: X(x), cy: X(EYE_Y), rx: 0.68, ry: 0.85, fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: tf(LENSES + ' ' + FRAME_BITS), ...ink, 'stroke-opacity': 0.92, 'stroke-width': 0.95 }])
  out.push(['path', { d: tf(SMILE), ...ink, 'stroke-opacity': 0.85, 'stroke-width': 0.85 }])
  return [['defs', {}, defs], ...out]
}
