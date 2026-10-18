// forge/hand/soft3d/command.mjs: the command knot as one continuous thick rounded clay ribbon: four round loops joined by two
// crossing bars that leave a small square window in the centre, lit from the upper left with a darker underside. The generated
// one broke the knot into separate chunks with gaps; here a single stroked path keeps it connected.
const N = 'command'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F5A524'), c2: v('c2', '#3A404C'), c3: v('c3', '#F3E7D3'), c4: v('c4', '#BFC7D2'), ink: v('ink', '#232733'), tint: v('tint', '#A9D8F2'), accent: v('accent', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const G = `url(#wg-soft3d-${N}-0)`, GL = `url(#wg-soft3d-${N}-1)`
const f = n => (Math.round(n * 100) / 100).toString()
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, ...(a === undefined ? {} : { 'stop-opacity': a }) }]
// rounded rect with per-corner radii [tl, tr, br, bl]
function rr(x, y, w, h, [a, b, c, d]) {
  const arc = (r, X, Y) => (r ? `A${f(r)} ${f(r)} 0 0 1 ${f(X)} ${f(Y)}` : '')
  return `M${f(x + a)} ${f(y)}H${f(x + w - b)}${arc(b, x + w, y + b)}V${f(y + h - c)}${arc(c, x + w - c, y + h)}H${f(x + d)}${arc(d, x, y + h - d)}V${f(y + a)}${arc(a, x + a, y)}Z`
}
const disc = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0z`
const P = (d, a) => ['path', { d, ...a }]
const fill = (d, c, cls, o) => P(d, { fill: c, ...(o ? { 'fill-opacity': o } : {}), class: cls })
const lit = (d, cls) => P(d, { fill: G, class: cls })
const ln = (d, c, w, o, cls) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, ...(o === 1 ? {} : { 'stroke-opacity': o }), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls })
const DEFS = ['defs', {}, [
  ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.26)]],
  ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0.4, y2: 1 }, [stop(0, C.tint), stop(1, C.ink)]],
]]
const shadow = (cx, cy, rx, ry) => [0.06, 0.08, 0.11].map((o, i) => ['ellipse', { cx, cy, rx: f(rx * (1 - i * 0.22)), ry: f(ry * (1 - i * 0.22)), fill: C.shadow, 'fill-opacity': o, class: 'wm-shadow' }])

const R = 2.9, XL = 9.6, XR = 14.4, YT = 8.9, YB = 13.7
const knot = dy => {
  const t = YT + dy, u = YB + dy, r = R
  return `M${f(XL)} ${f(t)}V${f(t - r)}A${r} ${r} 0 1 0 ${f(XL - r)} ${f(t)}H${f(XR + r)}A${r} ${r} 0 1 0 ${f(XR)} ${f(t - r)}V${f(u + r)}A${r} ${r} 0 1 0 ${f(XR + r)} ${f(u)}H${f(XL - r)}A${r} ${r} 0 1 0 ${f(XL)} ${f(u + r)}Z`
}
const stroke = (d, c, w, cls, o) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linejoin': 'round', ...(o ? { 'stroke-opacity': o } : {}), class: cls })
const arcAt = (cx, cy, r, a0, a1) => {
  const p = a => `${f(cx + r * Math.cos(a * Math.PI / 180))} ${f(cy + r * Math.sin(a * Math.PI / 180))}`
  return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`
}

export default function render() {
  const W = 2.5
  const cs = [[XL - R, YT - R], [XR + R, YT - R], [XR + R, YB + R], [XL - R, YB + R]]
  const hl = cs.map(([cx, cy]) => arcAt(cx, cy, R - 0.35, 195, 265)).join('')
  return [
    DEFS,
    ...shadow(12, 21.1, 9.2, 1.3),
    stroke(knot(1), C.c1, W, 'wm-k'),
    stroke(knot(1), C.shadow, W, 'wm-k', 0.36),
    stroke(knot(0), C.c1, W, 'wm-k'),
    stroke(knot(0), G, W, 'wm-k'),
    ln(hl + `M${f(XL + 0.5)} ${f(YT - 0.7)}H${f(XR - 0.5)}M${f(XL - 0.7)} ${f(YT + 0.5)}V${f(YB - 0.5)}`, C.shine, 0.55, 0.55, 'wm-shine'),
    ln(`M${f(XL + 0.8)} ${f(YB + 0.75)}H${f(XR - 0.4)}M${f(XR + 0.75)} ${f(YT + 0.8)}V${f(YB - 0.4)}`, C.shadow, 0.5, 0.3, 'wm-k'),
  ]
}
