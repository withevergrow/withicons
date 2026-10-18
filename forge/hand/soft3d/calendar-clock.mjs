// forge/hand/soft3d/calendar-clock.mjs: a soft 3D desk calendar (white page, red header band, two dark binder rings, a few red date
// dots) with a round amber clock badge, white face and dark hands, overlapping its bottom-right corner. The generated one fused the
// page and the clock into an unreadable blob; the page and the badge are separate lit solids here.
const N = 'calendar-clock'
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

C.c1 = v('c1', '#EEF1F5'); C.c2 = v('c2', '#E5483F'); C.c3 = v('c3', '#3A404C'); C.accent = v('accent', '#F5A524')

export default function render() {
  const body = dy => rr(3, 4.6 + dy, 17.5, 15.4, [2.4, 2.4, 2.4, 2.4])
  const head = rr(3, 4.6, 17.5, 3.9, [2.4, 2.4, 0, 0])
  const ring = x => rr(x, 2.5, 1.9, 4.4, [0.95, 0.95, 0.95, 0.95])
  const dots = [[6.6, 11.8], [10.2, 11.8], [13.8, 11.8], [17.4, 11.8], [6.6, 15.2], [10.2, 15.2], [6.6, 18.4], [10.2, 18.4]]
  return [
    DEFS,
    ...shadow(12, 21.6, 9.6, 1.3),
    fill(body(0.9), C.c1, 'wm-k'),
    fill(body(0.9), C.shadow, 'wm-k', 0.36),
    fill(body(0), C.c1, 'wm-k'),
    lit(body(0), 'wm-k'),
    fill(head, C.c2, 'wm-k'),
    lit(head, 'wm-k'),
    ln('M3.9 7.2C3.7 5.5 4.8 4.9 6.2 4.9H12', C.shine, 0.6, 0.6, 'wm-shine'),
    ln('M3.4 8.5H20.1', C.shadow, 0.5, 0.25, 'wm-k'),
    ...dots.map(([x, y]) => fill(disc(x, y, 0.85), C.c2, 'wm-k')),
    ln('M3.45 9.6V17.8', C.shine, 0.5, 0.35, 'wm-shine'),
    // binder rings
    fill(ring(6.4), C.shadow, 'wm-a', 0.45), fill(ring(14.6), C.shadow, 'wm-a', 0.45),
    fill(ring(6.2), C.c3, 'wm-a'), fill(ring(14.4), C.c3, 'wm-a'),
    lit(ring(6.2), 'wm-a'), lit(ring(14.4), 'wm-a'),
    ln('M7.05 3.5V5.4M15.25 3.5V5.4', C.shine, 0.4, 0.5, 'wm-shine'),
    // clock badge
    fill(disc(16.9, 17.5, 5.1), C.shadow, 'wm-s', 0.3),
    fill(disc(16.8, 16.9, 4.9), C.accent, 'wm-s'),
    lit(disc(16.8, 16.9, 4.9), 'wm-s'),
    fill(disc(16.8, 16.9, 3.7), C.shadow, 'wm-s', 0.3),
    fill(disc(16.8, 16.95, 3.6), C.c1, 'wm-s'),
    lit(disc(16.8, 16.95, 3.6), 'wm-s'),
    ln('M16.8 14.6V17L18.5 18.2', C.ink, 1.1, 1, 'wm-s'),
    ln('M13.3 15.4A4.9 4.9 0 0 1 16.2 12.3', C.shine, 0.55, 0.6, 'wm-shine'),
  ]
}
