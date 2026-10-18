// hand-drawn halloween shield: a witch-purple shield with a bright inner shine, a small pumpkin crest and a midnight outline.
// Body wm-k, pumpkin crest wm-a, stem wm-s, shine wm-shine, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'shield'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const SHIELD = 'M12 21.5C7.5 19.8 4.5 16.5 4.5 12V5.5L12 2.5L19.5 5.5V12C19.5 16.5 16.5 19.8 12 21.5Z'
const oval = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0z`

export default function render() {
  const shadow = setD(translateSet(setOf(parsePath(SHIELD, 0.12).map(s => s.pts)), 0.15, 0.85))
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 11, fx: 8.6, fy: 7.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13.2, r: 4.2, fx: 10.6, fy: 11.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.4, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: SHIELD, fill: url(0), ...INK, class: 'wm-k' }],
    // inner bevel line and lit shoulder
    ['path', { d: 'M7 7.2L12 5.1L17 7.2V12C17 14.9 15.2 17.2 12 18.9C8.8 17.2 7 14.9 7 12Z', ...ROUND, stroke: C.edge, 'stroke-width': 0.6, 'stroke-opacity': 0.75, class: 'wm-k' }],
    ['path', { d: 'M6.2 11.6V6.6L11.2 4.5', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-shine' }],
    // the pumpkin crest: two side lobes behind, one centre lobe in front, a slime stem
    ['path', { d: 'M12 9.4C12 8.6 12.3 8 12.9 7.6', ...ROUND, stroke: C.ink, 'stroke-width': 2.1, class: 'wm-s' }],
    ['path', { d: 'M12 9.4C12 8.6 12.3 8 12.9 7.6', ...ROUND, stroke: C.c4, 'stroke-width': 0.9, class: 'wm-s' }],
    ['path', { d: oval(9.6, 13.2, 2.6, 3.3), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: oval(14.4, 13.2, 2.6, 3.3), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: oval(12, 13.2, 2.1, 3.7), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M9 11.8Q9.3 11 10 10.7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
