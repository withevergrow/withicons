// forge/hand/halloween/keyboard.mjs — a pumpkin keyboard with fewer, bigger candle-lit keys (a staggered row of four, a
// row of three and a long spacebar), each cap sitting in a dark carved well so it reads as a key at 16px; the
// generated board had seven pin-hole keys that blurred into dots and slime goo dripping off its bottom edge.
import { C } from '../../styles/_halloween-palettes.mjs'

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = v => Math.round(v * 100) / 100
const rr = (x0, y0, x1, y1, r) => {
  ;[x0, y0, x1, y1] = [x0, y0, x1, y1].map(r2)
  return `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}` +
    `H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}Z`
}

// key caps [x0, y0, x1, y1]
const KEYS = [
  [3.75, 7, 6.75, 9.5], [8.25, 7, 11.25, 9.5], [12.75, 7, 15.75, 9.5], [17.25, 7, 20.25, 9.5],
  [6, 11, 9, 13.5], [10.5, 11, 13.5, 13.5], [15, 11, 18, 13.5],
  [7, 15, 17, 17],
]

export default function render(icon) {
  const id = n => `wg-halloween-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const ink = { stroke: C.ink, 'stroke-linejoin': 'round' }
  const wells = KEYS.map(([a, b, c, d]) => rr(a, b + 0.55, c, d + 0.55, 0.8)).join('')
  const caps = KEYS.map(([a, b, c, d]) => rr(a, b, c, d, 0.8)).join('')
  // a soft lit glint on each cap's top-left
  const glint = KEYS.map(([a, b, c]) => rr(a + 0.55, b + 0.5, Math.min(c - 0.55, a + 1.6), b + 0.95, 0.22)).join('')
  return [
    ['defs', {}, [
      // body: pumpkin, lit from inside and from the upper left
      ['radialGradient', { id: id(0), cx: 12, cy: 13.2, r: 13.2, fx: 8.8, fy: 9.3, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      // candle light in the keys: a hot centre, warm edges
      ['radialGradient', { id: id(1), cx: 12, cy: 12.3, r: 10.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      // halo
      ['radialGradient', { id: id(2), cx: 12, cy: 12.75, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: rr(2.15, 5.35, 22.15, 20.35, 2), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: rr(2, 4.5, 22, 19.5, 2), fill: url(0), ...ink, 'stroke-width': 0.72, class: 'wm-k' }],
    // shine on the lit top-left shoulder of the board
    ['path', { d: 'M2.62 12V6.4A1.28 1.28 0 0 1 3.9 5.12H13.5Q12.4 5.67 11.2 5.67H4.4A1.23 1.23 0 0 0 3.17 6.9V9.6Q3.17 10.9 2.62 12Z',
      fill: C.shine, 'fill-opacity': 0.55, class: 'wm-shine' }],
    // carved wells the keys sit in
    ['path', { d: wells, fill: C.ink, class: 'wm-k' }],
    // the keys, glowing
    ['path', { d: caps, fill: url(1), ...ink, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: glint, fill: C.shine, 'fill-opacity': 0.8, class: 'wm-a' }],
  ]
}
