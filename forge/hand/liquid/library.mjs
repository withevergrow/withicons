// forge/hand/liquid/library.mjs: a bookshelf that reads as books. Four separate glass books with clear gaps, uneven
// heights (tall-short-mid, not a staircase) and different widths and tints, each with spine bands, one with a label,
// and a coloured (A, wm-a) book leaning on the row. A shelf board runs underneath. Same liquid recipe as the style.
const r2 = (n) => Math.round(n * 100) / 100
const C1 = 'var(--with-liquid-c1, #4A9DFF)', C2 = 'var(--with-liquid-c2, #A77BFF)', C3 = 'var(--with-liquid-c3, #1C3F9E)'
const C4 = 'var(--with-liquid-c4, #FF7EC1)', SH = 'var(--with-liquid-shine, #FFFFFF)', EDGE = 'var(--with-liquid-edge, #B9E6FF)'
const ACC = 'var(--with-liquid-accent, #FF5F8F)', SHD = 'var(--with-liquid-shadow, #0C1A3A)'
const g = (i) => `wg-liquid-library-${i}`
const u = (i) => `url(#${g(i)})`

function defs() {
  const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: g(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])]
  return ['defs', {}, [
    lin(0, 3, 3, 21, 21, [[0, C1, 0.3], [0.6, C1, 0.52], [1, C1, 0.78]]),
    lin(1, 3, 3, 21, 21, [[0, C2, 0.4], [1, C2, 0.85]]),
    lin(2, 3, 3, 21, 21, [[0, C3, 0.5], [1, C3, 0.95]]),
    lin(3, 3, 3, 21, 21, [[0, C4, 0.4], [1, C4, 0.8]]),
    ['radialGradient', { id: g(4), cx: 9, cy: 8, r: 10, gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: 0, 'stop-color': SH, 'stop-opacity': 0.5 }], ['stop', { offset: 1, 'stop-color': SH, 'stop-opacity': 0 }]]],
    lin(5, 3, 10, 9, 23, [[0, SHD, 0.1], [1, C4, 0.32]]),
  ]]
}

// rounded polygon through points (corner radius r), as a closed path
function rpoly(pts, r) {
  const n = pts.length, out = []
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const va = [a[0] - p[0], a[1] - p[1]], vb = [b[0] - p[0], b[1] - p[1]]
    const la = Math.hypot(...va), lb = Math.hypot(...vb), k = Math.min(r, la / 2, lb / 2)
    out.push([[p[0] + va[0] / la * k, p[1] + va[1] / la * k], p, [p[0] + vb[0] / lb * k, p[1] + vb[1] / lb * k]])
  }
  const f = (q) => `${r2(q[0])} ${r2(q[1])}`
  return out.map(([s, c, e], i) => `${i ? 'L' : 'M'}${f(s)}Q${f(c)} ${f(e)}`).join('') + 'Z'
}
const poly = (pts) => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
// counter-clockwise lean about O: local (dx, dy up negative) -> grid
const lean = (O, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return ([dx, dy]) => [O[0] + dx * c + dy * s, O[1] - dx * s + dy * c] }

// an upright book: shadow first (returned separately), then glass body
function upright(x, y, w, fill, bands, label) {
  const h = 20.4 - y
  const shape = (dx, dy, a) => ['path', { d: rpoly(box(x + dx, y + dy, w, h).map((p, i) => p), 0.9), ...a }]
  const body = [
    shape(0, 0, { fill, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: 'wm-k' }),
    shape(0, 0, { stroke: u(2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }),
    shape(0, 0, { fill: u(4), class: 'wm-shine' }),
    ['rect', { x: r2(x + 0.7), y: r2(y + 1), width: 0.7, height: r2(h - 2), rx: 0.35, fill: SH, 'fill-opacity': 0.5, class: 'wm-shine' }],
  ]
  const deco = bands.map(([by, col]) => ['rect', { x: r2(x + 0.5), y: r2(y + by), width: r2(w - 1), height: 0.9, rx: 0.3, fill: col, 'fill-opacity': 0.75, class: 'wm-deco' }])
  if (label) deco.push(['rect', { x: r2(x + (w - label[0]) / 2), y: r2(y + label[1]), width: label[0], height: label[2], rx: 0.5, fill: EDGE, 'fill-opacity': 0.9, stroke: C3, 'stroke-opacity': 0.55, 'stroke-width': 0.3, class: 'wm-shine' }])
  return { shadow: ['path', { d: rpoly(box(x + 0.4, y + 0.8, w, h), 0.9), fill: u(5), class: 'wm-shadow' }], body, deco }
}

export default function render() {
  const books = [
    upright(2.2, 5.4, 4.0, u(0), [[1.6, C3], [3.2, C3], [h(5.4) - 3, C3]], null),
    upright(7.1, 4.0, 3.0, u(3), [[1.6, C3], [3.2, C3]], null),
    upright(11.0, 6.2, 4.4, u(0), [[1.4, C3], [h(6.2) - 2.6, C3]], [2.8, 4.0, 3.0]),
  ]
  function h(y) { return 20.4 - y }
  const O = [18.3, 20.4], T = lean(O, 14), W = 3.8, H = 13
  const lb = [[0, -H], [W, -H], [W, 0], [0, 0]].map(T)
  const lband = (a, b) => poly([[0.5, a], [W - 0.5, a], [W - 0.5, b], [0.5, b]].map(T))
  const lshape = (a) => ['path', { d: rpoly(lb, 0.9), ...a }]
  const nodes = [defs()]
  nodes.push(['path', { d: rpoly(box(2.4, 21.2, 19.6, 1.6), 0.8), fill: u(5), class: 'wm-shadow' }])
  for (const b of books) nodes.push(b.shadow)
  nodes.push(['path', { d: rpoly(lb.map(p => [p[0] + 0.4, p[1] + 0.8]), 0.9), fill: u(5), class: 'wm-shadow' }])
  // shelf board
  nodes.push(['rect', { x: 1.8, y: 20.4, width: 20.4, height: 1.8, rx: 0.9, fill: u(0), stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: 'wm-k' }])
  nodes.push(['rect', { x: 1.8, y: 20.4, width: 20.4, height: 1.8, rx: 0.9, fill: 'none', stroke: u(2), 'stroke-width': 0.5, class: 'wm-k' }])
  nodes.push(['rect', { x: 3, y: 20.8, width: 17, height: 0.5, rx: 0.25, fill: SH, 'fill-opacity': 0.5, class: 'wm-shine' }])
  for (const b of books) nodes.push(...b.body)
  for (const b of books) nodes.push(...b.deco)
  // leaning book (A)
  nodes.push(lshape({ fill: u(1), stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: 'wm-a' }))
  nodes.push(lshape({ stroke: u(2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }))
  nodes.push(lshape({ fill: u(4), class: 'wm-shine' }))
  nodes.push(['path', { d: lband(-11.2, -10.3) + lband(-9.2, -8.3) + lband(-2.6, -1.7), fill: C3, 'fill-opacity': 0.7, class: 'wm-a' }])
  return nodes
}
