// forge/hand/glass/avatar-woman-hijab.mjs - Glass woman in a hijab after the Line design: a deep violet glass hood draping into the
// shoulders, a clear frosted oval face opening (solid etch eyes, a smile) and the scarf's diagonal band, a lighter frosted fold
// swept from the right cheek across the chest to the lower left. Roles: back/shadow body, pane/frost glass, accent glow, etch
// face, shine rim. Motion: hood + band wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-woman-hijab'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.38, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLCZ])([^MLCZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }

const HIJAB = 'M3.5 22 C3.5 19.2 4.8 17.6 6.6 16.6 C5.4 15 4.8 13 4.8 10.9 C4.8 6.4 8 3 12 3 C16 3 19.2 6.4 19.2 10.9 C19.2 13 18.6 15 17.4 16.6 C19.2 17.6 20.5 19.2 20.5 22 Z'
const FACE = oval(12, 11.1, 4.1, 4.7)
// the scarf's diagonal band: from behind the right cheek, across the chest, down to the lower left
const BAND = 'M17.8 15.4 C15.8 18.4 12.2 19.4 5.8 20.6 L3 22 L11.4 22 C15.2 21.2 18.8 19.6 21 17.4 Z'

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 7, y1: 6, x2: 16, y2: 17 }, [stop(0, V.frost, 0.82), stop(0.4, V.tint, 0.74), stop(1, V.tint, 0.62)])
  const gHood = grad('linearGradient', { x1: 3, y1: 2, x2: 20, y2: 20 }, [stop(0, V.frost, 0.42), stop(0.5, V.tint, 0.18), stop(1, V.tint, 0.08)])
  const gBand = grad('linearGradient', { x1: 4, y1: 22, x2: 20, y2: 15 }, [stop(0, V.frost, 0.62), stop(0.5, V.tint, 0.55), stop(1, V.frost, 0.7)])

  const hood = place(area(HIJAB)), face = place(area(FACE))
  const band = tidy(intersectSets(place(area(BAND)), hood))
  const hoodVis = tidy(differenceSets(differenceSets(hood, band), face))
  const bandVis = tidy(differenceSets(band, face))
  const all = tidy(translateSet(tidy(erode(hood, 0.3)), 0.8, 0.8))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(hoodVis), fill: gHood, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(hoodVis), fill: V.c1, 'fill-opacity': 0.62, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(hoodVis)), fill: V.shine, 'fill-opacity': 0.7, class: 'wm-shine' }])
  out.push(['path', { d: D(bandVis), fill: gBand, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bandVis)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: D(face), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(face)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  for (const x of [10.4, 13.6]) out.push(['ellipse', { cx: X(x), cy: X(10.9), rx: 0.72, ry: 0.92, fill: V.etch, 'fill-opacity': 0.96, class: 'wm-a' }])
  out.push(['path', { d: tf('M10.2 13.3 C11.2 14.5 12.8 14.5 13.8 13.3'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.92, 'stroke-width': 0.95, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
