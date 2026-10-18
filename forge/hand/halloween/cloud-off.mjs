// forge/hand/halloween/cloud-off.mjs
const NAME = 'cloud-off'
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
// a plump bone cloud in one clean outline, struck by the slime-green slash with a clear gap; cloud wm-k, slash wm-s
function shape() {
  return unionSets([normalize(circle(7.2, 13.2, 4.3, 0.1)), normalize(circle(12.3, 10.4, 5.8, 0.1)),
    normalize(circle(17.1, 13.4, 4.1, 0.1)), normalize(rect(7.2, 12, 17.1, 17.5))])
}
export default function render() {
  const cl = differenceSets(shape(), normalize(band(2.3)))
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 10.2, r: 12, fx: 9, fy: 6.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine), st(0.5, C.shine), st(1, C.tint)]],
      HALO()]],
    BG(),
    ['path', { d: setD(translateSet(cl, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(cl), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M15 6.4C16.4 7.2 17.3 8.4 17.6 9.6', ...ROUND, stroke: C.accent, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ...slashNodes(),
  ]
}
