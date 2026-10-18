// forge/hand/halloween/pandal.mjs - the line pandal in Halloween colours: a flat-sided pumpkin-orange peaked roof, a witch-purple scalloped
// valance along the eave, two dark posts with midnight swag curtains, and a candle-lit diamond pendant on a stem between them.
// Replaces the generated circus tent with a flag and orb.
// Roles: roof c1 -> c2, valance c3 -> edge, curtains shadow -> ink, posts edge, pendant tint -> accent, outline ink, halo accent, shine shine.
// Motion: roof and posts wm-k, valance + curtains + pendant wm-a (sway about 12,9), halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'pandal'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const R = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const ROOF = 'M2.5 9L12 3L21.5 9Z'
const VAL = 'M3.5 9A2.125 2.125 0 0 0 7.75 9A2.125 2.125 0 0 0 12 9A2.125 2.125 0 0 0 16.25 9A2.125 2.125 0 0 0 20.5 9Z'
const CURT_L = 'M5 11H9C8.75 13.5 7.25 15.25 5 15.75Z'
const CURT_R = 'M19 11H15C15.25 13.5 16.75 15.25 19 15.75Z'
const DIAMOND = 'M12 13L13.5 15L12 17L10.5 15Z'
const SHADOW = 'M2.65 9.85L12.15 3.85L21.65 9.85ZM3.65 9.85A2.125 2.125 0 0 0 7.9 9.85A2.125 2.125 0 0 0 12.15 9.85A2.125 2.125 0 0 0 16.4 9.85A2.125 2.125 0 0 0 20.65 9.85ZM4.15 11.85H6.15V22.35H4.15ZM18.15 11.85H20.15V22.35H18.15Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 8, r: 11, fx: 8.5, fy: 4.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 10, r: 10, fx: 8.5, fy: 8.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 14, r: 10, fx: 9, fy: 11, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(0.45, C.shadow), st(1, C.ink)]],
      ['linearGradient', { id: id(3), x1: 0, y1: 0, x2: 1, y2: 1 }, [st(0, C.tint), st(0.55, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(4), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(4), class: 'wm-deco' }],
    ['path', { d: SHADOW, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // posts
    ['rect', { x: 4, y: 11, width: 2, height: 10.5, rx: 0.6, fill: C.edge, ...INK, class: 'wm-k' }],
    ['rect', { x: 18, y: 11, width: 2, height: 10.5, rx: 0.6, fill: C.edge, ...INK, class: 'wm-k' }],
    // swag curtains
    ['path', { d: CURT_L, fill: url(2), ...INK, class: 'wm-a' }],
    ['path', { d: CURT_R, fill: url(2), ...INK, class: 'wm-a' }],
    // pendant on its stem
    ['path', { d: 'M12 9V13', ...R, stroke: C.ink, 'stroke-width': 0.9, class: 'wm-a' }],
    ['path', { d: DIAMOND, fill: url(3), ...INK, class: 'wm-a' }],
    // scalloped valance, tucked under the roof
    ['path', { d: VAL, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M5.2 9.9A1 1 0 0 0 6 10.5M9.7 9.9A1 1 0 0 0 10.5 10.5M14 9.9A1 1 0 0 0 14.8 10.5M18.5 9.9A1 1 0 0 0 19.3 10.5', ...R, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
    // roof
    ['path', { d: ROOF, fill: url(0), ...INK, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 6.6, r: 0.8, fill: C.tint, class: 'wm-k' }],
    ['path', { d: 'M5.4 8L11 4.6', ...R, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
