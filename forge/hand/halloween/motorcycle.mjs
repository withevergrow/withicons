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

// hand-drawn halloween motorcycle: dark tyres with a glowing pumpkin rim ring, a big pumpkin tank over a purple engine block, seat, fork and bars
export default function render(icon) {
  const name = (icon && icon.name) || 'motorcycle'
  const rear = disc(4.9, 16.9, 3.9), front = disc(19.1, 16.9, 3.9)
  const swing = soften(shape('M4.35 16.2L9.55 12.2L10.65 13.6L5.45 17.6Z'), 0.3)
  const engine = rrect(8.8, 11.2, 15.4, 17, 1.3)
  const tank = shape('M8.4 8.4C8.4 6.8 9.8 5.8 11.4 6L15.6 6.6C16.8 6.8 17.2 7.8 16.7 8.9L15.6 11.6H8.9C8.5 10.6 8.4 9.6 8.4 8.4Z')
  const seat = shape('M3 11.2C3 10.1 3.9 9.5 5 9.5H8.8C9.3 9.5 9.5 10 9.3 10.4L8.6 12.1H3.9C3.3 12.1 3 11.8 3 11.2Z')
  const fork = soften(shape('M15.9 6.2L17.4 5.8L20 16.7L18.5 17.1Z'), 0.3)
  const bar = rrect(13.6, 4.2, 18.2, 6.2, 1)
  const lamp = disc(19.9, 8.3, 1.5)
  const ring = (x, y) => ['circle', { cx: x, cy: y, r: 3.3, fill: 'none', stroke: C.c1, 'stroke-width': 0.9, class: 'wm-a' }]
  const hub = (x, y) => [
    ['circle', { cx: x, cy: y, r: 1.8, fill: C.tint, stroke: INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['circle', { cx: x, cy: y, r: 0.6, fill: INK, class: 'wm-a' }],
  ]
  return paint(name, [
    { set: rear, mat: 'dark', cls: 'wm-a', shine: false },
    { set: front, mat: 'dark', cls: 'wm-a', shine: false },
    { nodes: [ring(4.9, 16.9), ring(19.1, 16.9), ...hub(4.9, 16.9), ...hub(19.1, 16.9)] },
    { set: swing, mat: 'pumpkin', shine: false },
    { set: seat, mat: 'dark' },
    { set: engine, mat: 'witch' },
    { nodes: [line('M10.2 13.9H14', { 'stroke-width': 0.6 }), line('M10.2 15.5H14', { 'stroke-width': 0.6 })] },
    { set: fork, mat: 'pumpkin', shine: false },
    { set: tank, mat: 'pumpkin' },
    { set: bar, mat: 'witch', shine: false },
    { set: lamp, mat: 'bone', shine: false },
  ])
}
