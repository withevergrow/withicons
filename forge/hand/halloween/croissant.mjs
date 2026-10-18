// forge/hand/halloween/croissant.mjs — a fat pumpkin-orange croissant: one crescent silhouette whose five lobes
// (crown, two shoulders, two curled horns) are split by four bold midnight seams, replacing the generated blob with
// a green smear. Style recipe: halo, drop shadow, ink outline 0.72, candle-lit c1 -> c2 gradient, top-left shine.
// Motion: body wm-k (the spec breathes it from [12, 19]); halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'croissant'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100
const pt = (x, y, dx, dy) => `${r(x + dx)} ${r(y + dy)}`

// the crescent: right half from the crown down to the inner edge, then mirrored back (x -> 24 - x)
const R = [
  ['M', 12, 4.1],
  ['C', 14.7, 4.1, 16.4, 5.5, 16.8, 7.6],
  ['C', 18.7, 6.7, 20.7, 8, 20.9, 10.7],
  ['C', 22.4, 11.6, 22.7, 14.6, 21.9, 17.2],
  ['C', 21.6, 18.2, 21.2, 19, 20.6, 19.6],
  ['C', 19.5, 19.2, 18.4, 18.4, 17.6, 17.4],
  ['C', 16.3, 15.8, 14.4, 15, 12, 15],
]
const silhouette = (dx, dy) => {
  let d = ''
  for (const [c, ...n] of R) d += c + n.map((v, i) => i % 2 ? r(v + dy) : r(v + dx)).join(' ')
  // walk back along the left half: the same curves, reversed and mirrored
  for (let i = R.length - 1; i >= 1; i--) {
    const [c, a, b, e, f] = R[i], prev = R[i - 1], px = prev[prev.length - 2], py = prev[prev.length - 1]
    const s = (X, Y) => pt(24 - X, Y, dx, dy)
    d += `C${s(e, f)} ${s(a, b)} ${s(px, py)}`
  }
  return d + 'Z'
}

export default function render() {
  const grad = `url(#${id(0)})`
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.4, r: 11.6, fx: 9.2, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.1, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: silhouette(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: silhouette(0, 0), fill: grad, ...INK, class: 'wm-k' }],
    // four bold seams, running from each notch down toward the inner edge
    ['path', { d: 'M16.8 7.6Q16.6 11.4 14.7 15.1M20.9 10.7Q20.4 14.2 18 16.8M7.2 7.6Q7.4 11.4 9.3 15.1M3.1 10.7Q3.6 14.2 6 16.8', ...ROUND, stroke: C.ink, 'stroke-width': 0.72, class: 'wm-k' }],
    // buttery shine on the crown and the left shoulder
    ['path', { d: 'M9 5.9Q10 5 11.8 5', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M4.3 9.6Q5 8.3 6.4 8.1', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
