// forge/hand/halloween/passport.mjs - a witch-purple passport booklet: dark stitched spine, cream page block peeking out, and a pumpkin-orange
// globe emblem with meridians over a candle-light text line. Replaces the generated plain rounded card that read as an ID badge.
// Roles: cover c3 -> edge, spine edge, pages tint, globe c1 -> c2, text line accent, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: booklet wm-k, emblem wm-a (globe), text line wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'passport'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const COVER = 'M6 2.5H16.5A2 2 0 0 1 18.5 4.5V19.5A2 2 0 0 1 16.5 21.5H6A2 2 0 0 1 4 19.5V4.5A2 2 0 0 1 6 2.5Z'
const PAGES = 'M17 3.9H18.5A2 2 0 0 1 20.5 5.9V18.1A2 2 0 0 1 18.5 20.1H17Z'
const SPINE = 'M6 2.5H7.1V21.5H6A2 2 0 0 1 4 19.5V4.5A2 2 0 0 1 6 2.5Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12, r: 13, fx: 8.5, fy: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(1), cx: 12.9, cy: 10.4, r: 4.4, fx: 11.4, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: 'M4.15 3.35H18.65A2 2 0 0 1 20.65 5.35V19.85A2 2 0 0 1 18.65 21.85H6.15A2 2 0 0 1 4.15 19.85Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: PAGES, fill: C.tint, ...INK, class: 'wm-k' }],
    ['path', { d: 'M17 7.2H19.4M17 10H19.4M17 12.8H19.4M17 15.6H19.4', ...ROUND, stroke: C.accent, 'stroke-width': 0.5, 'stroke-opacity': 0.8, class: 'wm-k' }],
    ['path', { d: COVER, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: SPINE, fill: C.edge, 'fill-opacity': 0.85, class: 'wm-k' }],
    ['path', { d: 'M7.1 2.5V21.5', ...ROUND, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M5.55 5.5V7M5.55 10.5V12M5.55 15.5V17', ...ROUND, stroke: C.tint, 'stroke-width': 0.7, 'stroke-opacity': 0.75, class: 'wm-k' }],
    // globe emblem
    ['circle', { cx: 12.9, cy: 10.4, r: 4.2, fill: url(1), ...INK, class: 'wm-a' }],
    ['ellipse', { cx: 12.9, cy: 10.4, rx: 1.8, ry: 4.2, ...ROUND, stroke: C.ink, 'stroke-width': 0.5, 'stroke-opacity': 0.55, class: 'wm-a' }],
    ['path', { d: 'M8.7 10.4H17.1M9.5 8H16.3M9.5 12.8H16.3', ...ROUND, stroke: C.ink, 'stroke-width': 0.5, 'stroke-opacity': 0.55, class: 'wm-a' }],
    ['path', { d: 'M10.1 8.2A3.2 3.2 0 0 1 12 7', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    // text lines
    ['path', { d: 'M9.9 17.3H15.9', ...ROUND, stroke: C.ink, 'stroke-width': 2.2, class: 'wm-s' }],
    ['path', { d: 'M9.9 17.3H15.9', ...ROUND, stroke: C.accent, 'stroke-width': 0.9, class: 'wm-s' }],
    ['path', { d: 'M6.6 4.2A1.2 1.2 0 0 1 7.6 3.5H11', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
