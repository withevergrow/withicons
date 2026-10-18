// forge/hand/halloween/dental-chair.mjs - the line dental chair in Halloween colours: a pumpkin-orange chair laid back diagonally (backrest
// top-left, seat in the middle, leg rest down to the lower right), a witch-purple pedestal and foot, and a purple overhead lamp on its
// arm at the top right with a candle-lit glow. Replaces the upright chair with the lamp at the left.
// Roles: chair c1 -> c2, pedestal and lamp c3 -> edge, lamp light tint -> accent, outline ink, halo accent, shine shine, shadow shadow.
// Motion: chair and pedestal wm-k, lamp wm-a (sways about 15.5,2.5), halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'dental-chair'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const CHAIR = (dx = 0, dy = 0) => {
  const p = (x, y) => `${+(x + dx).toFixed(2)} ${+(y + dy).toFixed(2)}`
  return `M${p(6.5, 3.75)}L${p(9.5, 10.25)}H${+(15.25 + dx).toFixed(2)}L${p(19.75, 15.25)}A1.75 1.75 0 0 1 ${p(17.25, 17.75)}L${p(13.75, 13.75)}H${+(7.5 + dx).toFixed(2)}L${p(3.5, 5.25)}A1.75 1.75 0 0 1 ${p(6.5, 3.75)}Z`
}
const DOME = 'M12.5 6.5A3 2.5 0 0 1 18.5 6.5Z'
const SHADOW = CHAIR(0.15, 0.85) + 'M7.15 20.35H15.15V22.35H7.15ZM10.35 13.85H12.35V20.4H10.35Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 11, cy: 10, r: 11, fx: 6.5, fy: 5.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 13, x2: 0, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 15.5, cy: 5, r: 4, fx: 14, fy: 4.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['linearGradient', { id: id(3), x1: 0, y1: 0, x2: 1, y2: 1 }, [st(0, C.tint), st(0.55, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(4), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(4), class: 'wm-deco' }],
    ['path', { d: SHADOW, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // pedestal and foot
    ['rect', { x: 10.2, y: 13, width: 1.8, height: 7.5, rx: 0.5, fill: url(1), ...INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['rect', { x: 7, y: 19.5, width: 8, height: 2, rx: 1, fill: url(1), ...INK, class: 'wm-k' }],
    // the laid-back chair
    ['path', { d: CHAIR(), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M9.5 10.25L7.5 13.75M15.25 10.25L13.75 13.75', ...R, stroke: C.ink, 'stroke-opacity': 0.7, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M4.9 5.4L7.5 11', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
    // lamp on its arm
    ['path', { d: 'M15.5 4V2.6', ...R, stroke: C.ink, 'stroke-width': 1.3, class: 'wm-a' }],
    ['path', { d: DOME, fill: url(2), ...INK, class: 'wm-a' }],
    ['path', { d: 'M14 6.5A1.5 1 0 0 0 17 6.5Z', fill: url(3), stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M13.5 6A2.2 1.6 0 0 1 15.2 4.7', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
