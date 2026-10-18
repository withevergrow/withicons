// forge/hand/soft3d/motorcycle.mjs: a side-on soft 3D motorcycle facing right: two dark tyres with silver rims, a red tank and
// front fender, a dark seat, a grey engine block, a silver fork, handlebar and a cream headlight. The generated one was a
// three-quarter view with an oversized red body; this keeps the line design's side view and its wheel-body-fork layout.
const N = 'motorcycle'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E5483F'), c2: v('c2', '#3A404C'), c3: v('c3', '#F3E7D3'), c4: v('c4', '#BFC7D2'), ink: v('ink', '#232733'), tint: v('tint', '#A9D8F2'), accent: v('accent', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
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

const wheel = (cx, cy) => [
  fill(disc(cx, cy, 3.6), C.ink, 'wm-a'),
  lit(disc(cx, cy, 3.6), 'wm-a'),
  fill(disc(cx, cy, 2.1), C.c4, 'wm-a'),
  lit(disc(cx, cy, 2.1), 'wm-a'),
  fill(disc(cx, cy, 0.8), C.c2, 'wm-a'),
  ln(`M${f(cx - 2.8)} ${f(cy - 1.2)}A3 3 0 0 1 ${f(cx - 1)} ${f(cy - 2.9)}`, C.shine, 0.5, 0.5, 'wm-shine'),
]

export default function render() {
  const tank = 'M8.3 10.7C8.4 8.9 9.7 8.4 11.2 8.4H13.2C14.6 8.4 15.3 9.2 15.4 10.4L14.5 12.9H9.6C8.7 12.9 8.3 12 8.3 10.7Z'
  const seat = rr(3, 9.9, 6.2, 2.1, [1.1, 0.5, 0.5, 1.1])
  const engine = rr(8.6, 12.6, 5.4, 4.6, [0.8, 0.8, 1.6, 1.6])
  return [
    DEFS,
    ...shadow(12, 20.6, 10, 1.5),
    ...wheel(5.4, 16.6),
    ...wheel(18.6, 16.6),
    // swingarm and engine
    ln('M5.4 16.6L10 14.6', C.c2, 1.3, 1, 'wm-k'),
    fill(engine, C.c2, 'wm-k'),
    lit(engine, 'wm-k'),
    ln('M9.6 14.2H13M9.6 15.4H13', C.shine, 0.4, 0.3, 'wm-shine'),
    // seat and tank
    fill(seat, C.ink, 'wm-k'),
    lit(seat, 'wm-k'),
    fill(tank, C.c1, 'wm-k'),
    lit(tank, 'wm-k'),
    ln('M9.2 10.6C9.4 9.4 10.3 9.1 11.4 9.1H13', C.shine, 0.6, 0.6, 'wm-shine'),
    // fork, front fender, handlebar, headlight
    ln('M15.4 10.8L18.5 16.4', C.c4, 1.7, 1, 'wm-k'),
    ln('M15.1 10.9L18.2 16.5', C.shine, 0.5, 0.45, 'wm-shine'),
    ln('M14.6 14.7A4.4 4.4 0 0 1 22.6 14.7', C.c1, 1.2, 1, 'wm-k'),
    ln('M15.3 14A4.2 4.2 0 0 1 19.2 12.3', C.shine, 0.5, 0.45, 'wm-shine'),
    ln('M14.8 8.4L13.2 6.9', C.c2, 1.4, 1, 'wm-k'),
    fill(disc(16.9, 9.9, 1.35), C.shadow, 'wm-k', 0.4),
    fill(disc(16.8, 9.8, 1.15), C.c3, 'wm-s'),
    fill(disc(16.8, 9.8, 1.15), G, 'wm-s'),
  ]
}
