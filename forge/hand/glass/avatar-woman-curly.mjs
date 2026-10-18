// forge/hand/glass/avatar-woman-curly.mjs — Glass woman with curly hair, hand-drawn: the generated drawing melted the curl
// cloud, the face and the shoulders into one pale frosted blob, with a busy etched hairline competing with the face. Here
// the curls are one deep violet glass mass with seven big round lobes (no inner curl lines), a scalloped three-curl fringe,
// and a clear frosted face with a crisp edge, solid etch eyes and a smile, set over its own shoulder pane.
// Roles: back/shadow body, pane/frost glass, accent glow, etch face, shine rim. Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-woman-curly'
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
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }
const blob = list => tidy(unionSets(list.map(a => area(oval(...a)))))

// ---- drawing (skeleton coordinates, 24 grid) ----
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'
const FACE = oval(12, 11, 6.3, 6.6)
const EYE_Y = 11.9
const SMILE = 'M10 14.6 C11 15.6 13 15.6 14 14.6'
// paint order, each piece hidden where a later one overlaps it
function pieces() {
  const face = area(FACE)
  // the curl cloud: seven round lobes around the head, filled in behind it
  const cloud = blob([[12, 5.1, 3.1], [7.6, 6.3, 2.9], [16.4, 6.3, 2.9], [5.3, 10.5, 2.7], [18.7, 10.5, 2.7], [5.6, 15, 2.4], [18.4, 15, 2.4], [12, 10.5, 6.2]])
  // the fringe: three fat curls across the forehead
  const fringe = intersectSets(face, blob([[8.4, 7.3, 2.3], [12, 6.6, 2.4], [15.6, 7.3, 2.3], [12, 3.5, 6.5, 3]]))
  return [
    [unionSets([cloud, fringe]), 'hair'],
    [area(SHOULDERS), 'skin'],
    [tidy(differenceSets(face, fringe)), 'skin'],
  ]
}

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  const gHair = grad('linearGradient', { x1: 3, y1: 2, x2: 20, y2: 18 }, [stop(0, V.frost, 0.36), stop(0.5, V.tint, 0.15), stop(1, V.tint, 0.07)])

  const P = pieces()
  const sets = P.map(([s]) => place(s))
  const vis = sets.map((s, i) => i < sets.length - 1 ? tidy(differenceSets(s, unionSets(sets.slice(i + 1)))) : s)
  const back = s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8)
  const all = tidy(unionSets(sets.map(back)))
  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  // the whole figure is lit as one: one colour body behind, with an accent glow low in the chest
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  // frosted panes in front: clear skin, thin frost on the hair so its deep violet shows
  vis.forEach((s, i) => out.push(['path', { d: D(s), fill: P[i][1] === 'skin' ? gPane : gHair, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }]))
  vis.forEach(s => out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }]))
  // face: solid etch eyes, a smile, specular dots
  for (const x of [9.5, 14.5]) out.push(['ellipse', { cx: X(x), cy: X(EYE_Y), rx: 0.78, ry: 0.98, fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: tf(SMILE), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: tf(`M9.25 ${EYE_Y - 0.35} L9.3 ${EYE_Y - 0.4} M14.25 ${EYE_Y - 0.35} L14.3 ${EYE_Y - 0.4}`), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
