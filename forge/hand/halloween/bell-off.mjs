// forge/hand/halloween/bell-off.mjs
const NAME = 'bell-off'
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
// the orange pumpkin-glow bell dome of 'bell', with a purple clapper and the slime-green slash; bell wm-k, clapper wm-a, slash wm-s
const BELL = 'M12 3.6C8.4 3.6 6.4 6.3 6.4 9.8V14.6L4.4 17.4C4.1 17.9 4.4 18.4 5 18.4H19C19.6 18.4 19.9 17.9 19.6 17.4L17.6 14.6V9.8C17.6 6.3 15.6 3.6 12 3.6Z'
export default function render() {
  const gap = normalize(band(2.3))
  const bell = differenceSets(normalize(parsePath(BELL, 0.1)[0].pts), gap)
  const clap = differenceSets(normalize(parsePath('M9.6 19.3H14.4A2.4 2.4 0 0 1 9.6 19.3Z', 0.1)[0].pts), gap)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.5, r: 11, fx: 9.3, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      HALO()]],
    BG(),
    ['path', { d: setD(translateSet(bell, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(clap), fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: setD(bell), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M12.6 4.9C14.8 5.2 16.1 6.8 16.3 8.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ...slashNodes(),
  ]
}
