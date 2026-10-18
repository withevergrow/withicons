// forge/hand/soft3d/paintbrush.mjs: a round artist brush lying on the diagonal: a pointed teardrop bristle tuft dipped in
// paint, a silver ferrule with two ridges, and a tapered handle with a rounded end. Drawn in a local frame (u along the
// brush from the tip, w across) and mapped onto the 24 grid; light from the upper left, no ground shadow.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E5483F'), c2: v('c2', '#2F6FD0'), c3: v('c3', '#C3CBD6'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const r2 = n => +n.toFixed(2)
const K = Math.SQRT1_2
const W = (u, w) => [r2(3 + K * (u + w)), r2(21 - K * (u - w))]
const P = pts => pts.map(([u, w]) => W(u, w).join(' ')).join(' ')
const D = segs => segs.map(([c, ...pts]) => c + P(pts)).join('') + 'Z'
const fillN = (d, fill, cls, op) => ['path', { d, fill, ...(op ? { 'fill-opacity': op } : {}), class: cls }]
const line = (a, b, stroke, w, op, cls) => ['path', { d: `M${P([a])}L${P([b])}`, stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', fill: 'none', class: cls }]
export default function render() {
  const BRISTLE = D([['M', [0, 0]], ['C', [1.6, -1.5], [5.2, -2.5], [9.2, -2.1]], ['L', [9.2, 2.1]], ['C', [5.2, 2.5], [1.6, 1.5], [0, 0]]])
  const FERRULE = D([['M', [9, -2.1]], ['L', [13.4, -1.8]], ['L', [13.4, 1.8]], ['L', [9, 2.1]]])
  const HANDLE = D([['M', [13.2, -1.6]], ['L', [22.4, -1.05]], ['C', [24.6, -0.9], [24.6, 0.9], [22.4, 1.05]], ['L', [13.2, 1.6]]])
  const SHADE_B = D([['M', [0, 0]], ['C', [1.6, 0.2], [5, 0.6], [9.2, 0.5]], ['L', [9.2, 2.1]], ['C', [5.2, 2.5], [1.6, 1.5], [0, 0]]])
  const SHADE_H = D([['M', [13.2, 0.3]], ['L', [22.4, 0.2]], ['C', [24.6, 0.3], [24.6, 0.9], [22.4, 1.05]], ['L', [13.2, 1.6]]])
  const SHADE_F = D([['M', [9, 0.4]], ['L', [13.4, 0.4]], ['L', [13.4, 1.8]], ['L', [9, 2.1]]])
  return [
    ['ellipse', { cx: 5.2, cy: 22.4, rx: 3, ry: 0.55, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    fillN(HANDLE, C.c2, 'wm-a'),
    fillN(SHADE_H, C.shadow, 'wm-a', 0.22),
    line([14.2, -0.95], [22, -0.6], C.shine, 0.7, 0.55, 'wm-shine'),
    fillN(FERRULE, C.c3, 'wm-k'),
    fillN(SHADE_F, C.shadow, 'wm-k', 0.2),
    line([10.5, -1.9], [10.5, 1.9], C.shadow, 0.5, 0.3, 'wm-k'),
    line([12, -1.7], [12, 1.7], C.shadow, 0.5, 0.3, 'wm-k'),
    line([9.6, -1.5], [13, -1.3], C.shine, 0.7, 0.7, 'wm-shine'),
    fillN(BRISTLE, C.c1, 'wm-k'),
    fillN(SHADE_B, C.shadow, 'wm-k', 0.2),
    line([2.4, -0.7], [8.2, -1.5], C.shine, 0.8, 0.55, 'wm-shine'),
  ]
}
