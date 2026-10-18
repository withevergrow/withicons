// forge/hand/soft3d/satellite-dish.mjs: a soft 3D satellite dish: an open concave bowl (silver rim, dark lit interior) tilted up
// and to the right with its feed arm and red feed horn, a short neck on a dark base, and two red signal arcs at the top right.
// The generated one was a closed helmet-like blob; the bowl is open here and its inside is visible.
const N = 'satellite-dish'
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

const S = Math.SQRT1_2
// ellipse centred (cx, cy), semi-axis a along the down-right diagonal and b along the up-right diagonal
const ell = (cx, cy, a, b) => {
  const p1 = `${f(cx - a * S)} ${f(cy - a * S)}`, p2 = `${f(cx + a * S)} ${f(cy + a * S)}`
  return `M${p1}A${f(a)} ${f(b)} 45 1 1 ${p2}A${f(a)} ${f(b)} 45 1 1 ${p1}Z`
}
const SHELL = dy => `M3.5 ${f(7.5 + dy)}A7.5 7.5 0 0 0 13.5 ${f(17.5 + dy)}Z`

export default function render() {
  const rim = ell(8.9, 12.1, 7.1, 2.9)
  const inner = ell(8.6, 12.4, 6.3, 2.15)
  const base = rr(4.4, 19.4, 7.2, 1.8, [0.9, 0.9, 0.9, 0.9])
  return [
    DEFS,
    ...shadow(8.2, 21.2, 7.4, 1.2),
    fill(base, C.c2, 'wm-k'),
    lit(base, 'wm-k'),
    ln('M7.6 15.2L7.8 19.6', C.c2, 2, 1, 'wm-k'),
    ln('M7.1 15.4L7.3 19', C.shine, 0.4, 0.3, 'wm-shine'),
    // bowl shell, underside then lit top
    fill(SHELL(0.9), C.c4, 'wm-a'),
    fill(SHELL(0.9), C.shadow, 'wm-a', 0.38),
    fill(SHELL(0), C.c4, 'wm-a'),
    lit(SHELL(0), 'wm-a'),
    // open face: rim, then the dark concave inside
    fill(rim, C.c4, 'wm-a'),
    lit(rim, 'wm-a'),
    fill(inner, C.c2, 'wm-a'),
    fill(inner, GL, 'wm-a', 0.55),
    ln('M4.9 14.2A6.3 2.15 45 0 0 8.6 14.6', C.shine, 0.5, 0.3, 'wm-shine'),
    ln('M5.1 9.1C6.6 6.9 8.9 6.7 10.3 7.5', C.shine, 0.6, 0.55, 'wm-shine'),
    // feed arm and horn
    ln('M8.9 12.2L12.4 8.6', C.c2, 1.1, 1, 'wm-k'),
    fill(disc(12.7, 8.3, 1.25), C.shadow, 'wm-k', 0.4),
    fill(disc(12.6, 8.2, 1.1), C.accent, 'wm-k'),
    fill(disc(12.6, 8.2, 1.1), G, 'wm-k'),
    // signal arcs
    ln('M12.9 4.6A3.7 3.7 0 0 1 16.6 8.3', C.shadow, 1.5, 0.3, 'wm-s'),
    ln('M12.9 2.1A6.2 6.2 0 0 1 19.1 8.3', C.shadow, 1.5, 0.3, 'wm-s'),
    ln('M12.9 4.3A3.7 3.7 0 0 1 16.6 8', C.accent, 1.5, 1, 'wm-s'),
    ln('M12.9 1.8A6.2 6.2 0 0 1 19.1 8', C.accent, 1.5, 1, 'wm-s'),
    ln('M13.4 3.9A3.7 3.7 0 0 1 15.4 5', C.shine, 0.4, 0.5, 'wm-shine'),
  ]
}
