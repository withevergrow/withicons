// forge/hand/halloween/choco-strawberry.mjs - a red-orange strawberry with seeds and a green leaf cap,
// its lower half dipped in a dark chocolate drip band.

const NAME = 'choco-strawberry'
import { C } from '../../styles/_halloween-palettes.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SH = { fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }

const BERRY = 'M12 21.5C7 19.2 4 14.2 4.5 10.6C5 7.6 8 6.6 12 7.1C16 6.6 19 7.6 19.5 10.6C20 14.2 17 19.2 12 21.5Z'
const BERRY_SH = 'M12.15 22.35C7.15 20.05 4.15 15.05 4.65 11.45C5.15 8.45 8.15 7.45 12.15 7.95C16.15 7.45 19.15 8.45 19.65 11.45C20.15 15.05 17.15 20.05 12.15 22.35Z'
const CHOC = 'M4.75 13.2Q6.4 15.4 8 13.8Q8.6 16.4 9.6 14.2Q10.8 15.2 12 14Q13.2 15.2 14.4 14.2Q15.4 16.4 16 13.8Q17.6 15.4 19.25 13.2C18.6 16.6 16 19.6 12 21.5C8 19.6 5.4 16.6 4.75 13.2Z'
const LEAF = 'M7.4 8.4Q9.2 5.6 12 7.3Q14.8 5.6 16.6 8.4Q14.6 8.4 13.6 9.6Q12.8 8.6 12 9.8Q11.2 8.6 10.4 9.6Q9.4 8.4 7.4 8.4Z'
const SEEDS = [[8.4, 10.4], [12, 10.9], [15.6, 10.4], [10.2, 12.4], [13.8, 12.4], [6.6, 12]]
const STEM = 'M12 7.4Q12.2 5.4 13.6 4'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 13.6, fx: 8.8, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.4, C.c2), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(4), x1: 6, y1: 13, x2: 16, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(1, C.ink)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: BERRY_SH, ...SH }],
    ['path', { d: BERRY, fill: url(0), ...INK, class: 'wm-k' }],
    ...SEEDS.map(([x, y]) => ['ellipse', { cx: x, cy: y, rx: 0.4, ry: 0.6, fill: C.tint, class: 'wm-k' }]),
    ['path', { d: CHOC, fill: url(4), stroke: C.edge, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.4 15.6Q7.4 17.8 9.4 19.2', ...R, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: STEM, ...R, stroke: C.ink, 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: STEM, ...R, stroke: C.c4, 'stroke-width': 0.7, class: 'wm-k' }],
    ['path', { d: LEAF, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: 'M6 9.6A3 3 0 0 1 8 8.2', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
