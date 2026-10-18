// forge/hand/halloween/refresh.mjs — two chunky pumpkin arrows chasing each other round a circle, each a 2.8u arc ending
// in a broad filled arrowhead, in the midnight outline on the warm halo. The generated pair was bone-white (it vanished
// on white) with thin chevron heads; solid pumpkin with filled heads reads as a reload at 16px and sits with the arrows.
import { unionSets, differenceSets, intersectSets, translateSet, erode, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
import { area, setD, circle } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

// --- the style's layer recipe (_halloween-core.mjs), drawn from hand-made region sets ---------------------------
const MAT = { pumpkin: { stops: [C.c1, C.c1, C.c2], shine: 0.55 }, witch: { stops: [C.c3, C.c3, C.edge], shine: 0.45 } }
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
// bodies: [{ set, mat, cls }] back to front; holes: set of carved details lit by the candle (optional)
function paint(name, bodies, holes = null) {
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const all = unionSets(bodies.map(b => b.set))
  const [x0, y0, x1, y1] = bboxOf(all)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const mats = [...new Set(bodies.map(b => b.mat))]
  const defs = [['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]]
  if (holes) defs.push(['radialGradient', { id: id(1), cx: f2(cx), cy: f2(cy + h * 0.1), r: f2(R * 0.62), gradientUnits: 'userSpaceOnUse' },
    [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]])
  const gi = {}
  for (const m of mats) {
    gi[m] = defs.length
    const s = MAT[m].stops
    defs.push(['radialGradient', { id: id(defs.length), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
      [st(0, s[0]), st(0.45, s[1]), st(1, s[2])]])
  }
  const out = [['defs', {}, defs]]
  out.push(['path', { d: 'M0 0H24V24H0Z', fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: setD(translateSet(all, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  if (holes) out.push(['path', { d: setD(all.filter(r => area(r) * area(all[0]) > 0)), fill: url(1), class: 'wm-shine' }])
  for (const b of bodies) {
    const set = holes ? differenceSets(b.set, holes) : b.set
    out.push(['path', { d: setD(set), fill: url(gi[b.mat]), 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: b.cls || 'wm-k' }])
    const sh = crescent(set)
    if (sh.length) out.push(['path', { d: setD(sh), fill: C.shine, 'fill-opacity': MAT[b.mat].shine, class: 'wm-shine' }])
  }
  return out
}

// --- the drawing -------------------------------------------------------------------------------------------------
// one arrow: an arc of radius RA round the centre from angle a0 to a1 (degrees, y down), then a filled head
const RA = 7.9, WA = 2.8
function arrow(a0, a1) {
  const pts = []
  for (let a = a0; a <= a1 + 1e-6; a += 3) { const t = a * Math.PI / 180; pts.push([12 + RA * Math.cos(t), 12 + RA * Math.sin(t)]) }
  const t = a1 * Math.PI / 180, n = [Math.cos(t), Math.sin(t)], g = [-Math.sin(t), Math.cos(t)]
  const E = [12 + RA * n[0], 12 + RA * n[1]], B = [E[0] - g[0] * 0.6, E[1] - g[1] * 0.6]
  const head = normalize([[B[0] + n[0] * 3.3, B[1] + n[1] * 3.3], [E[0] + g[0] * 3.6, E[1] + g[1] * 3.6], [B[0] - n[0] * 3.3, B[1] - n[1] * 3.3]])
  return unionSets([roundStrokeSet(pts, WA), head])
}

// --- the drawing -------------------------------------------------------------------------------------------------
export default function render(icon) {
  const name = (icon && icon.name) || 'refresh'
  const set = unionSets([arrow(190, 312), arrow(10, 132)])
  return paint(name, [{ set, mat: 'pumpkin' }])
}
