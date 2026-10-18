// forge/hand/halloween/cat.mjs — a black cat's head with pointed ears and witch-purple inner ears, big candle-lit almond
// eyes with slit pupils and a small purple nose, in the purple night outline on the warm halo. Replaces the generated
// head, whose moon peeking out behind the ear crowded the silhouette and whose small eyes faded at 16px.
import { unionSets, differenceSets, translateSet, erode, strokeSet, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
import { area, setD, parsePath, circle } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

// --- the style's layer recipe (_halloween-core.mjs), drawn from hand-made region sets ---------------------------
const MAT = {
  pumpkin: { stops: [C.c1, C.c1, C.c2], line: C.ink, shine: 0.55 },
  witch: { stops: [C.c3, C.c3, C.edge], line: C.ink, shine: 0.45 },
  midnight: { stops: [C.shadow, C.shadow, C.ink], line: C.edge, shine: 0.22 },
  slime: { stops: [C.c4, C.c4, C.c4], line: C.ink, shine: 0.5 },
}
const f2 = v => Math.round(v * 100) / 100
const bboxOf = set => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of set) for (const [x, y] of r) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return [x0, y0, x1, y1]
}
const crescent = set => {
  const inner = erode(set, 0.62)
  return differenceSets(inner, translateSet(inner, 0.5, 0.62)).filter(r => Math.abs(area(r)) > 0.12)
}
// bodies: [{ set, mat, cls }] back to front; holes: carved details lit by the candle (outlined where they leave the body)
function paint(name, bodies, holes = null) {
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const all = unionSets(bodies.map(b => b.set))
  const [x0, y0, x1, y1] = bboxOf(all)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const defs = [['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]]
  if (holes) defs.push(['radialGradient', { id: id(1), cx: f2(cx), cy: f2(cy + h * 0.1), r: f2(R * 0.62), gradientUnits: 'userSpaceOnUse' },
    [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]])
  const gi = {}
  for (const m of new Set(bodies.map(b => b.mat))) {
    gi[m] = defs.length
    const s = MAT[m].stops
    defs.push(['radialGradient', { id: id(defs.length), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
      [st(0, s[0]), st(0.45, s[1]), st(1, s[2])]])
  }
  const line = MAT[bodies[0].mat].line
  const out = [['defs', {}, defs]]
  out.push(['path', { d: 'M0 0H24V24H0Z', fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: setD(translateSet(all, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  if (holes) out.push(['path', { d: setD(all.filter(r => area(r) * area(all[0]) > 0)), fill: url(1), stroke: line, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  for (const b of bodies) {
    const set = holes ? differenceSets(b.set, holes) : b.set
    out.push(['path', { d: setD(set), fill: url(gi[b.mat]), 'fill-rule': 'evenodd', stroke: MAT[b.mat].line, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: b.cls || 'wm-k' }])
    const sh = crescent(set)
    if (sh.length) out.push(['path', { d: setD(sh), fill: C.shine, 'fill-opacity': MAT[b.mat].shine, class: 'wm-shine' }])
  }
  return out
}

// --- the drawing -------------------------------------------------------------------------------------------------
export default function render(icon) {
  const name = (icon && icon.name) || 'cat'
  const head = normalize(parsePath('M12 20.75C6.9 20.75 3.25 18.15 3.25 13.75C3.25 11.75 3.65 10.25 4.25 9L3.92 4.3C3.9 3.95 4.25 3.75 4.6 3.92L9.5 6.25C10.25 6 11.25 5.75 12 5.75C12.75 5.75 13.75 6 14.5 6.25L19.4 3.92C19.75 3.75 20.1 3.95 20.08 4.3L19.75 9C20.35 10.25 20.75 11.75 20.75 13.75C20.75 18.15 17.1 20.75 12 20.75Z', 0.15)[0].pts)
  const out = paint(name, [{ set: head, mat: 'midnight' }])
  const id = n => `wg-halloween-${name}-${n}`
  // the candle light for the eyes (same recipe as the carved details)
  out[0][2].push(['radialGradient', { id: id(9), cx: 12, cy: 13.4, r: 5.2, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': C.tint }], ['stop', { offset: 0.5, 'stop-color': C.accent }], ['stop', { offset: 1, 'stop-color': C.c1 }]]])
  const ear = (sx) => `M${f2(12 + sx * 6.7)} 5.35L${f2(12 + sx * 3.6)} 7.1L${f2(12 + sx * 6.6)} 8.6Z`
  out.push(['path', { d: ear(-1) + ear(1), fill: C.c3, 'fill-opacity': 0.9, stroke: C.c3, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // almond eyes, outer corners lifted
  const eye = (x, sx) => `M${f2(x - sx * 1.95)} 13.4C${f2(x - sx * 1.2)} 11.35 ${f2(x + sx * 0.7)} 10.95 ${f2(x + sx * 1.95)} 11.95C${f2(x + sx * 1.45)} 14.05 ${f2(x - sx * 0.4)} 14.95 ${f2(x - sx * 1.95)} 13.4Z`
  out.push(['path', { d: eye(8.6, -1) + eye(15.4, 1), fill: `url(#${id(9)})`, stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  const slit = x => `M${x} 11.5C${f2(x + 0.5)} 12.4 ${f2(x + 0.5)} 13.4 ${x} 14.3C${f2(x - 0.5)} 13.4 ${f2(x - 0.5)} 12.4 ${x} 11.5Z`
  out.push(['path', { d: slit(8.6) + slit(15.4), fill: C.ink, class: 'wm-a' }])
  // nose
  out.push(['path', { d: 'M10.9 16.1H13.1L12 17.3Z', fill: C.c3, stroke: C.c3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  return out
}
