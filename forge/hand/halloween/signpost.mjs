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

// hand-drawn halloween signpost: a dark post with two arrow boards (pumpkin right, witch-purple left) and one slime drip
export default function render(icon) {
  const name = (icon && icon.name) || 'signpost'
  const post = unionSets([rrect(10.8, 1.8, 13.2, 21.8, 1), rrect(9, 20.6, 15, 22.6, 0.9)])
  const top = shape('M3.8 4.6H17.6L21.2 7.8L17.6 11H3.8A1 1 0 0 1 2.8 10V5.6A1 1 0 0 1 3.8 4.6Z')
  const low = shape('M20.2 13H6.4L2.8 16.2L6.4 19.4H20.2A1 1 0 0 0 21.2 18.4V14A1 1 0 0 0 20.2 13Z')
  const goo = unionSets([rrect(16.2, 18.3, 20, 19.7, 0.7), shape('M17.6 19.2H18.8V21H17.6Z'), disc(18.2, 21.3, 1.1)])
  return paint(name, [
    { set: post, mat: 'dark' },
    { set: top, mat: 'pumpkin' },
    { set: low, mat: 'witch' },
    { nodes: [
      line('M6.2 7.1H14', { 'stroke-width': 0.9 }), line('M6.2 8.9H11', { 'stroke-width': 0.9 }),
      line('M8.4 15.2H17.4', { stroke: C.tint, 'stroke-width': 0.9, class: 'wm-deco' }), line('M8.4 17H13.4', { stroke: C.tint, 'stroke-width': 0.9, class: 'wm-deco' }),
    ] },
    { set: goo, mat: 'slime', cls: 'wm-deco' },
  ])
}
