// hand-drawn halloween api: a witch-purple rounded block with cream code brackets, a pumpkin port on the left and two on
// the right, each on a midnight connector stub, and a little spider hanging in the corner.
// Block wm-k, ports wm-a, spider wm-deco, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'api'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const PORTS = [[3.6, 12], [20.4, 8.4], [20.4, 15.6]]
const BX = 7.5, BY = 6, BW = 9, BH = 12

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.8, r: 9, fx: 9.4, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    // connector stubs
    ['path', { d: 'M5.4 12H7.6M16.4 8.4H18.6M16.4 15.6H18.6', ...ROUND, stroke: C.ink, 'stroke-width': 1.7, class: 'wm-k' }],
    // block
    ['rect', { x: BX + 0.15, y: BY + 0.85, width: BW, height: BH, rx: 2.6, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['rect', { x: BX, y: BY, width: BW, height: BH, rx: 2.6, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M8.9 9V8.8Q8.9 8 9.8 8H11.5', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    // code brackets, midnight under cream
    ['path', { d: 'M10.6 9.6L8.9 12L10.6 14.4M13.4 9.6L15.1 12L13.4 14.4', ...ROUND, stroke: C.ink, 'stroke-width': 2.3, class: 'wm-k' }],
    ['path', { d: 'M10.6 9.6L8.9 12L10.6 14.4M13.4 9.6L15.1 12L13.4 14.4', ...ROUND, stroke: C.shine, 'stroke-width': 1.0, class: 'wm-k' }],
    // pumpkin ports
    ...PORTS.map(([x, y]) => ['circle', { cx: x, cy: y, r: 2.1, fill: C.c1, ...INK, class: 'wm-a' }]),
    ...PORTS.map(([x, y]) => ['circle', { cx: x - 0.6, cy: y - 0.6, r: 0.5, fill: C.shine, 'fill-opacity': 0.8, class: 'wm-shine' }]),
    // the spider
    ['path', { d: 'M3.5 .6V2.33M2.98 3.14Q1.87 1.92 1.38 2M2.98 3.39Q1.87 2.52 1.14 3.04M2.98 3.64Q1.87 3.11 1.14 4.07M2.98 3.88Q1.87 3.71 1.38 5.11M4.02 3.14Q5.13 1.92 5.62 2M4.02 3.39Q5.13 2.52 5.86 3.04M4.02 3.64Q5.13 3.11 5.86 4.07M4.02 3.88Q5.13 3.71 5.62 5.11', stroke: C.edge, 'stroke-width': 0.34, 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }],
    ['circle', { cx: 3.5, cy: 3.5, r: 1.24, fill: C.edge, stroke: C.ink, 'stroke-width': 0.26, class: 'wm-deco' }],
    ['path', { d: 'M2.89 3.3a.18 .18 0 1 0 .36 0a.18 .18 0 1 0 -.36 0zM3.75 3.3a.18 .18 0 1 0 .36 0a.18 .18 0 1 0 -.36 0z', fill: C.tint, class: 'wm-deco' }],
  ]
}
