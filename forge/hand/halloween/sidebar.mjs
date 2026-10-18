import { unionSets, differenceSets, intersectSets, translateSet, erode, dilate, normalize, setOf } from '../../kernel/bool.mjs'
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
const soften = (s, r) => dilate(erode(s, r), r)

// the style's layer recipe (_halloween-core.mjs) drawn from hand-made region sets
const MAT = {
  pumpkin: { stops: [C.c1, C.c1, C.c2], shine: 0.55 }, witch: { stops: [C.c3, C.c3, C.edge], shine: 0.45 },
  slime: { stops: [C.c4, C.c4, C.c4], shine: 0.4 }, bone: { stops: [C.shine, C.tint, C.accent], shine: 0.6 },
  dark: { stops: [C.shadow, C.shadow, C.ink], shine: 0.3 },
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
// bodies back to front: { set, mat, cls, shine:false } or { nodes } (emitted as they are)
function paint(name, bodies) {
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const sets = bodies.filter(b => b.set)
  const all = unionSets(sets.map(b => b.set))
  const [x0, y0, x1, y1] = bboxOf(all)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const mats = [...new Set(sets.map(b => b.mat))]
  const defs = [['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]]
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
  for (const b of bodies) {
    if (b.nodes) { out.push(...b.nodes); continue }
    out.push(['path', { d: setD(b.set), fill: url(gi[b.mat]), 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: b.cls || 'wm-k' }])
    if (b.shine === false) continue
    const sh = crescent(b.set)
    if (sh.length) out.push(['path', { d: setD(sh), fill: C.shine, 'fill-opacity': MAT[b.mat].shine, class: 'wm-shine' }])
  }
  return out
}
const INK = C.ink
const line = (d, o = {}) => ['path', { d, fill: 'none', stroke: INK, 'stroke-width': 0.72, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k', ...o }]
const dot = (x, y, r, fill, o = {}) => ['circle', { cx: x, cy: y, r, fill, class: 'wm-deco', ...o }]

// hand-drawn halloween sidebar: a cream window whose left column is a distinct witch-purple rail with menu dashes
export default function render(icon) {
  const name = (icon && icon.name) || 'sidebar'
  const frame = rrect(2.5, 3.5, 21.5, 20.5, 3.2)
  const rail = intersectSets(frame, shape('M0 0H9.2V24H0Z'))
  return paint(name, [
    { set: frame, mat: 'bone' },
    { set: rail, mat: 'witch', cls: 'wm-a' },
    { nodes: [
      line('M4.7 8.2H7.5', { stroke: C.tint, 'stroke-width': 1.1, class: 'wm-a' }),
      line('M4.7 11.6H7.5', { stroke: C.tint, 'stroke-width': 1.1, class: 'wm-a' }),
      line('M4.7 15H6.4', { stroke: C.tint, 'stroke-width': 1.1, class: 'wm-a' }),
      ['rect', { x: 11.8, y: 6.3, width: 7.6, height: 2.8, rx: 1.2, fill: C.c1, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
      line('M11.9 12.4H19.3', { stroke: C.c2, 'stroke-width': 1.1, 'stroke-opacity': 0.6, class: 'wm-deco' }),
      line('M11.9 15.2H19.3', { stroke: C.c2, 'stroke-width': 1.1, 'stroke-opacity': 0.6, class: 'wm-deco' }),
      line('M11.9 18H16.4', { stroke: C.c2, 'stroke-width': 1.1, 'stroke-opacity': 0.6, class: 'wm-deco' }),
    ] },
  ])
}
