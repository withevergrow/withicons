// forge/hand/glass/avatar-woman-bun.mjs - Glass woman with a top bun, hand-drawn: a head-and-shoulders portrait so it reads as a
// person at 16px (the earlier head-only drawing read as a vase). A deep violet glass hair cap with a swept fringe and a round
// bun on top (pinched at the base with a glass hair-tie ring so it is clearly a bun), a clear frosted oval face with solid etch
// eyes and a smile, over its own shoulder pane. The hair is thinly frosted so its deep colour shows and keeps contrast on white.
// Roles: back/shadow body, pane/frost glass, accent glow + hair tie, etch face, shine rim. Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-woman-bun'
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

// ---- drawing (skeleton coordinates, 24 grid) ----
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'
const FACE = oval(12, 12.2, 5.5, 6.2)
const EYE_Y = 13.2
const SMILE = 'M10.3 15.9 C11.2 16.7 12.8 16.7 13.7 15.9'
// the hair cap: wider than the face, its lower edge a swept fringe that parts at the left
const HAIR = 'M5.2 13.6 C4.4 8 7.4 4.9 12 4.9 C16.6 4.9 19.6 8 18.8 13.6 C18.2 12.4 17 11.3 15.2 10.7 C13.6 10.2 12.5 9.5 11.9 8.5 C11.3 10 9.4 11.1 7.4 11.3 C6.4 11.4 5.7 12.3 5.2 13.6 Z'
// the bun: a round knot standing clear above the crown
const BUN = oval(12, 3.5, 2.7, 2.6)
const TIE = 'M9.7 5.6 C11 6.3 13 6.3 14.3 5.6'

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  const gHair = grad('linearGradient', { x1: 3, y1: 2, x2: 20, y2: 16 }, [stop(0, V.frost, 0.34), stop(0.5, V.tint, 0.14), stop(1, V.tint, 0.06)])

  const hair = place(unionSets([area(HAIR), area(BUN)]))
  const face = place(area(FACE))
  const shoulders = place(area(SHOULDERS))
  const faceVis = tidy(differenceSets(face, hair))
  const shVis = tidy(differenceSets(shoulders, face))
  const sets = [shVis, hair, faceVis]
  const back = s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8)
  const all = tidy(unionSets([shoulders, face, hair].map(back)))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  // order: shoulders, face (clear pane), hair on top
  out.push(['path', { d: D(shVis), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(faceVis), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(hair), fill: gHair, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  sets.forEach(s => out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }]))
  // the hair tie where the bun meets the crown
  out.push(['path', { d: tf(TIE), fill: 'none', stroke: V.accent, 'stroke-opacity': 0.95, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-k' }])
  // face: solid etch eyes, a smile, specular dots
  for (const x of [9.7, 14.3]) out.push(['ellipse', { cx: X(x), cy: X(EYE_Y), rx: 0.75, ry: 0.95, fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: tf(SMILE), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: tf(`M9.45 ${EYE_Y - 0.35} L9.5 ${EYE_Y - 0.4} M14.05 ${EYE_Y - 0.35} L14.1 ${EYE_Y - 0.4}`), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
