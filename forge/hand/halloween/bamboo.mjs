// forge/hand/halloween/bamboo.mjs
const NAME = 'bamboo'
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
// two segmented violet canes with dark node bands and two slime-green leaves; canes wm-k, leaves wm-a
const CANES = [[6.2, 3, 3.4, 19], [12.6, 5.5, 3.4, 16.5]]
const NODES = [[8.2, 13.6, 18.2], [10.2, 15.6]]
export default function render() {
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 0, x2: 17, y2: 0, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.35, C.c3), st(1, C.edge)]],
      HALO()]],
    BG(),
  ]
  for (const [x, y, w, h] of CANES) out.push(['path', { d: setD(translateSet([rect(x, y, x + w, y + h)], 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  CANES.forEach(([x, y, w, h], i) => {
    out.push(['rect', { x, y, width: w, height: h, rx: 1.2, fill: url(0), ...INK, class: 'wm-k' }])
    out.push(['path', { d: `M${x + 0.9} ${y + 1}V${y + h - 1}`, ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.55, class: 'wm-shine' }])
    out.push(['path', { d: NODES[i].map(n => `M${x - 0.3} ${n}H${x + w + 0.3}`).join(''), ...ROUND, stroke: C.ink, 'stroke-width': 1.1, class: 'wm-k' }])
  })
  out.push(['path', { d: 'M16 9.8C17.4 7.2 19.6 6 22 6C21 8.6 19 10.2 16 9.8Z', fill: C.c4, ...INK, class: 'wm-a' }])
  out.push(['path', { d: 'M6.2 8.2C5.2 5.8 3.6 4.6 1.8 4.4C2.4 7 4 8.6 6.2 8.2Z', fill: C.c4, ...INK, class: 'wm-a' }])
  out.push(['path', { d: 'M16.9 9.2L20.2 7.2M5.4 7.5L3 5.4', ...ROUND, stroke: C.ink, 'stroke-opacity': 0.6, 'stroke-width': 0.45, class: 'wm-a' }])
  return out
}
