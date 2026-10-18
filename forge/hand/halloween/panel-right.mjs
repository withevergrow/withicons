// hand-drawn halloween panel-right: a pumpkin window with a distinct witch-purple sidebar pane on the right.
import { unionSets, differenceSets, intersectSets, translateSet, erode, dilate, roundStrokeSet, normalize, setOf } from '../../kernel/bool.mjs'
import { area, setD, circle, parsePath } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

const disc = (x, y, r) => normalize(circle(x, y, r, 0.15))
const shape = d => setOf(parsePath(d, 0.15).map(s => s.pts))
const rrect = (x0, y0, x1, y1, r) => { const k = r * 0.45; return shape(`M${x0 + r} ${y0}H${x1 - r}C${x1 - k} ${y0} ${x1} ${y0 + k} ${x1} ${y0 + r}V${y1 - r}C${x1} ${y1 - k} ${x1 - k} ${y1} ${x1 - r} ${y1}H${x0 + r}C${x0 + k} ${y1} ${x0} ${y1 - k} ${x0} ${y1 - r}V${y0 + r}C${x0} ${y0 + k} ${x0 + k} ${y0} ${x0 + r} ${y0}Z`) }
const oval = (cx, cy, rx, ry, deg) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), pts = []
  for (let i = 0; i < 64; i++) { const t = i / 64 * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t); pts.push([cx + x * c - y * s, cy + x * s + y * c]) }
  return normalize(pts)
}

// --- the style's layer recipe (_halloween-core.mjs), drawn from hand-made region sets ---------------------------
const MAT = { pumpkin: { stops: [C.c1, C.c1, C.c2], shine: 0.55 }, witch: { stops: [C.c3, C.c3, C.edge], shine: 0.45 }, slime: { stops: [C.c4, C.c4, C.c4], shine: 0.4 }, bone: { stops: [C.shine, C.tint, C.accent], shine: 0.6 } }
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
export default function render(icon) {
  const name = (icon && icon.name) || 'panel-right'
  const frame = rrect(2, 3, 22, 21, 3)
  const pane = rrect(13.6, 5, 20, 19, 1.2)
  return paint(name, [{ set: frame, mat: 'pumpkin' }, { set: pane, mat: 'witch', cls: 'wm-a' }])
}
