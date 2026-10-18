// forge/hand/halloween/hotel.mjs - the line hotel in Halloween colours: a witch-purple building with a candle-lit sign bar and a guest
// asleep in a pumpkin-orange bed (headboard, mattress, blanket hump, head), standing on a midnight ground line.
// Roles: building c3 -> edge, bed c1 -> c2, sign and head tint -> accent, outline ink, halo accent, shine shine, shadow shadow.
// Motion: building and ground wm-k, the sleeping bed wm-a (breathes about 12,17.5), halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'hotel'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const BODY = 'M3.5 21.5V5A2 2 0 0 1 5.5 3H18.5A2 2 0 0 1 20.5 5V21.5Z'
const BODY_SH = 'M3.65 22.35V5.85A2 2 0 0 1 5.65 3.85H18.65A2 2 0 0 1 20.65 5.85V22.35Z'
const BED = 'M6.5 21V17.5H12V16.5A2 2 0 0 1 14 14.5H15.5A2 2 0 0 1 17.5 16.5V17.5V21Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3, x2: 0, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 18, r: 8, fx: 8.5, fy: 14.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 1, y2: 1 }, [st(0, C.tint), st(0.55, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(3), class: 'wm-deco' }],
    ['path', { d: BODY_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.6 20.4V5.4A1.2 1.2 0 0 1 5.8 4.2H12', ...R, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.7, class: 'wm-shine' }],
    // sign bar
    ['rect', { x: 8.6, y: 6, width: 6.8, height: 2, rx: 1, fill: url(2), ...INK, 'stroke-width': 0.6, class: 'wm-k' }],
    // headboard
    ['rect', { x: 5.9, y: 11, width: 1.8, height: 10, rx: 0.9, fill: url(1), ...INK, 'stroke-width': 0.6, class: 'wm-k' }],
    // bed with the sleeping hump
    ['path', { d: BED, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M7.7 17.5H17.5', ...R, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-a' }],
    ['circle', { cx: 9.8, cy: 15.2, r: 1.15, fill: url(2), ...INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: 'M12.8 16.4A1.2 1.2 0 0 1 14 15.3', ...R, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
    // ground
    ['rect', { x: 2, y: 20.8, width: 20, height: 1.5, rx: 0.75, fill: C.ink, class: 'wm-k' }],
  ]
}
