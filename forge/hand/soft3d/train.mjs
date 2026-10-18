// forge/hand/soft3d/train.mjs: a front-facing soft 3D train: a blue rounded-top cab with a two-pane dark windscreen split by a
// centre pillar, a belt stripe, two cream round headlights, and two dark bogies underneath. The generated one was an angled
// block with a single pole; this one is face-on like the line design and matches the style's lit clay recipe.
const N = 'train'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#3D7EE0'), c2: v('c2', '#3A404C'), c3: v('c3', '#F3E7D3'), c4: v('c4', '#BFC7D2'), ink: v('ink', '#232733'), tint: v('tint', '#A9D8F2'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
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
const ln = (d, c, w, o, cls) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-opacity': o, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls })

export default function render() {
  const body = dy => rr(4, 2 + dy, 16, 15.5, [4.5, 4.5, 2, 2])
  const winL = rr(5.6, 4.1, 5.5, 5.5, [3, 0.9, 0.9, 0.9])
  const winR = rr(12.9, 4.1, 5.5, 5.5, [0.9, 3, 0.9, 0.9])
  const rimL = rr(5.3, 3.8, 6.1, 6.1, [3.3, 1.1, 1.1, 1.1])
  const rimR = rr(12.6, 3.8, 6.1, 6.1, [1.1, 3.3, 1.1, 1.1])
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, C.shine, 0.58), stop(0.38, C.shine, 0.06), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.26)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0.4, y2: 1 }, [stop(0, C.tint), stop(1, C.ink)]],
    ]],
    ['ellipse', { cx: 12, cy: 20.9, rx: 9.4, ry: 1.5, fill: C.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 20.9, rx: 7.4, ry: 1.2, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 20.9, rx: 5.4, ry: 0.9, fill: C.shadow, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    // rail under the bogies
    fill(rr(3, 20.3, 18, 1, [0.5, 0.5, 0.5, 0.5]), C.c4, 'wm-k'),
    fill(rr(3, 20.3, 18, 1, [0.5, 0.5, 0.5, 0.5]), G, 'wm-k'),
    // bogies
    fill(rr(6, 17, 3.8, 3.7, [1, 1, 1.5, 1.5]), C.c2, 'wm-a'),
    fill(rr(14.2, 17, 3.8, 3.7, [1, 1, 1.5, 1.5]), C.c2, 'wm-a'),
    lit(rr(6, 17, 3.8, 3.7, [1, 1, 1.5, 1.5]), 'wm-a'),
    lit(rr(14.2, 17, 3.8, 3.7, [1, 1, 1.5, 1.5]), 'wm-a'),
    ln('M6.6 17.9V19.6M14.8 17.9V19.6', C.shine, 0.45, 0.35, 'wm-a'),
    // body: underside then lit top
    fill(body(1.1), C.c1, 'wm-k'),
    fill(body(1.1), C.shadow, 'wm-k', 0.34),
    fill(body(0), C.c1, 'wm-k'),
    lit(body(0), 'wm-k'),
    // roof lamp
    fill(rr(10.3, 0.9, 3.4, 1.5, [0.8, 0.8, 0.2, 0.2]), C.c3, 'wm-s'),
    fill(rr(10.3, 0.9, 3.4, 1.5, [0.8, 0.8, 0.2, 0.2]), G, 'wm-s'),
    // belt stripe
    fill('M4 10.7H20V11.6H4Z', C.shadow, 'wm-k', 0.2),
    ln('M4.2 11.9H19.8', C.shine, 0.4, 0.3, 'wm-shine'),
    // windscreen panes
    fill(rimL, C.shadow, 'wm-k', 0.5), fill(rimR, C.shadow, 'wm-k', 0.5),
    fill(winL, C.ink, 'wm-k'), fill(winR, C.ink, 'wm-k'),
    fill(winL, GL, 'wm-k'), fill(winR, GL, 'wm-k'),
    fill('M6.4 8.8L8.6 4.9H10.2L7.8 8.8Z', C.shine, 'wm-shine', 0.3),
    fill('M13.7 8.8L15.9 4.9H17.5L15.1 8.8Z', C.shine, 'wm-shine', 0.3),
    // headlights
    fill(disc(8.2, 14.4, 1.95), C.shadow, 'wm-k', 0.45),
    fill(disc(15.8, 14.4, 1.95), C.shadow, 'wm-k', 0.45),
    fill(disc(8.2, 14.3, 1.6), C.c3, 'wm-s'), fill(disc(15.8, 14.3, 1.6), C.c3, 'wm-s'),
    fill(disc(8.2, 14.3, 1.6), G, 'wm-s'), fill(disc(15.8, 14.3, 1.6), G, 'wm-s'),
    fill(disc(7.6, 13.7, 0.45), C.shine, 'wm-shine', 0.8), fill(disc(15.2, 13.7, 0.45), C.shine, 'wm-shine', 0.8),
    // rim light
    ln('M4.45 6.6A4.15 4.15 0 0 1 8.6 2.5H12', C.shine, 0.6, 0.6, 'wm-shine'),
    ln('M19.5 7.2V15.6', C.shadow, 0.6, 0.35, 'wm-k'),
  ]
}
