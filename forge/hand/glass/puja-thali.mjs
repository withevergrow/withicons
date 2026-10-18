// forge/hand/glass/puja-thali.mjs — Glass puja thali, hand-drawn: the generated drawing fused plate, diya and flame into
// one mound. Here a wide, flat frosted plate (a thick glass disc seen from above, with a recessed well) carries a
// separate violet-glass diya bowl with curled lip, a bright accent flame floating clear above it, and two small accent
// flowers on the plate rim. Plate, diya and flame are three distinct masses with air between flame and bowl.
// Motion: plate, diya and flowers wm-k, flame wm-a (flickers about 12 9).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'puja-thali'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.12).map(s => setOf([s.pts])))
const P = d => place(area(d))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, dx, dy)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coordinates
const PLATE_TOP = oval(12, 17.2, 10, 3.5)
const PLATE_UNDER = oval(12, 18.5, 10, 3.5)
const WELL = oval(12, 17.2, 7.6, 2.2)
const DIYA = 'M6 12.1 C6.9 12.6 7.8 12.7 8.4 12.7 H15.6 C16.2 12.7 17.1 12.6 18 12.1 C17.7 15.2 15.4 17.2 12 17.2 C8.6 17.2 6.3 15.2 6 12.1 Z'
const FLAME = 'M12 2.6 C13.3 4.8 15.1 6 15.1 8.1 C15.1 9.9 13.8 11 12 11 C10.2 11 8.9 9.9 8.9 8.1 C8.9 6 10.7 4.8 12 2.6 Z'
const FLAME_CORE = 'M12 6.2 C12.7 7.3 13.4 7.9 13.4 8.8 C13.4 9.6 12.8 10.2 12 10.2 C11.2 10.2 10.6 9.6 10.6 8.8 C10.6 7.9 11.3 7.3 12 6.2 Z'
const FLOWERS = [[5.8, 16.9], [18.2, 16.9]]

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const top = P(PLATE_TOP), under = P(PLATE_UNDER), well = P(WELL), diya = P(DIYA), flame = P(FLAME), core = P(FLAME_CORE)
  const plate = tidy(unionSets([top, under]))
  const plateB = translateSet(tidy(erode(plate, 0.3)), 0.6, 0.7)
  const diyaB = translateSet(tidy(erode(diya, 0.3)), 0.6, 0.7)
  const all = tidy(unionSets([plateB, diyaB]))

  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gPane = grad('linearGradient', { x1: 2, y1: 12, x2: 20, y2: 21, }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const gGlow = grad('radialGradient', { cx: 17, cy: 19, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])

  // the plate: a colour body glowing through a thick frosted disc, a recessed well, a bright lit rim
  out.push(['path', { d: D(plateB), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(plateB), fill: gGlow, class: 'wm-k' }])
  out.push(['path', { d: D(plate), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(top), fill: V.frost, 'fill-opacity': 0.35, class: 'wm-k' }])
  out.push(['path', { d: D(well), fill: V.c1, 'fill-opacity': 0.3, stroke: V.etch, 'stroke-opacity': 0.3, 'stroke-width': 0.45, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(top, 0.2, 0.4)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])

  // two small flowers on the plate rim (accent glass dots with a glint)
  for (const [x, y] of FLOWERS) {
    out.push(['circle', { cx: X(x), cy: X(y), r: 1.25, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-k' }])
    out.push(['circle', { cx: f2(X(x) - 0.35), cy: f2(X(y) - 0.4), r: 0.35, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-k' }])
  }

  // the diya: a deep violet glass bowl with curled lip, standing on the plate
  out.push(['path', { d: D(diyaB), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(diya), fill: grad('linearGradient', { x1: 6, y1: 12, x2: 17, y2: 17 }, [stop(0, V.c1), stop(1, V.shadow)]), ...EDGE, 'stroke-opacity': 0.3, class: 'wm-k' }])
  out.push(['path', { d: D(diya), fill: grad('linearGradient', { x1: 7, y1: 12, x2: 11, y2: 17 }, [stop(0, V.frost, 0.5), stop(1, V.frost, 0.06)]), class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(diya, 0.25, 0.45)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the flame: accent glass drop with a pale hot core, floating clear above the bowl
  out.push(['path', { d: D(translateSet(flame, 0.25, 0.35)), fill: V.shadow, 'fill-opacity': 0.4, class: 'wm-a' }])
  out.push(['path', { d: D(flame), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(core), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
