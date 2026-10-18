// forge/hand/halloween/angry.mjs
const NAME = 'angry'
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD, circle, rect } from '../../kernel/geom.mjs'
import { normalize, unionSets, differenceSets, translateSet } from '../../kernel/bool.mjs'

const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const HALO = () => ['radialGradient', { id: id(9), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]
const BG = () => ['path', { d: 'M0 0H24V24H0Z', fill: url(9), class: 'wm-deco' }]
const band = h => { const k = h * 0.7071; return [[-4 + k, -4 - k], [28 + k, 28 - k], [28 - k, 28 + k], [-4 - k, -4 + k]] }
const SLASH = 'M3.85 2.15L21.85 20.15A1.2 1.2 0 0 1 20.15 21.85L2.15 3.85A1.2 1.2 0 0 1 3.85 2.15Z'
const SLASH_SH = 'M4 3L22 21A1.2 1.2 0 0 1 20.3 22.7L2.3 4.7A1.2 1.2 0 0 1 4 3Z'
const slashNodes = () => [
  ['path', { d: SLASH_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
  ['path', { d: SLASH, fill: C.c4, ...INK, class: 'wm-s' }],
  ['path', { d: 'M4.3 3.6L17.6 16.9', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
]
// a violet face with cream eye whites, steep pumpkin brows and a cream grimace; face wm-k, brows wm-a
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 11, fx: 9, fy: 8.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      HALO()]],
    BG(),
    ['circle', { cx: 12.15, cy: 12.85, r: 9.6, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 9.6, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M5.4 7.2C6.8 4.9 8.8 3.6 11.2 3.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['ellipse', { cx: 8.7, cy: 11.6, rx: 1.75, ry: 1.45, fill: C.shine, ...INK, class: 'wm-k' }],
    ['ellipse', { cx: 15.3, cy: 11.6, rx: 1.75, ry: 1.45, fill: C.shine, ...INK, class: 'wm-k' }],
    ['circle', { cx: 9.1, cy: 11.9, r: 0.8, fill: C.ink, class: 'wm-k' }],
    ['circle', { cx: 14.9, cy: 11.9, r: 0.8, fill: C.ink, class: 'wm-k' }],
    ['path', { d: 'M5.9 7.4L11 9.3L10.6 10.5L5.5 8.6Z', fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: 'M18.1 7.4L13 9.3L13.4 10.5L18.5 8.6Z', fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: 'M8.2 17.7C9.3 15.4 14.7 15.4 15.8 17.7C16 18.2 15.6 18.6 15.1 18.3C13.4 17.3 10.6 17.3 8.9 18.3C8.4 18.6 8 18.2 8.2 17.7Z', fill: C.tint, ...INK, class: 'wm-k' }],
  ]
}
