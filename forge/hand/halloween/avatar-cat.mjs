// forge/hand/halloween/avatar-cat.mjs — a black cat head on a witch-purple avatar disc: candle-orange inner ears,
// bright slime-green eyes with slit pupils, an orange nose and light whiskers. No spider.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'avatar-cat'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const HEAD = 'M5.2 13.6C5.2 11.2 5.6 9.2 6.3 7.9L5.9 3.6L9.6 6.1C10.4 5.9 11.2 5.8 12 5.8C12.8 5.8 13.6 5.9 14.4 6.1L18.1 3.6L17.7 7.9C18.4 9.2 18.8 11.2 18.8 13.6C18.8 17.6 15.8 20 12 20C8.2 20 5.2 17.6 5.2 13.6Z'
const HEAD_SH = 'M5.35 14.45C5.35 12.05 5.75 10.05 6.45 8.75L6.05 4.45L9.75 6.95C10.55 6.75 11.35 6.65 12.15 6.65C12.95 6.65 13.75 6.75 14.55 6.95L18.25 4.45L17.85 8.75C18.55 10.05 18.95 12.05 18.95 14.45C18.95 18.45 15.95 20.85 12.15 20.85C8.35 20.85 5.35 18.45 5.35 14.45Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 10, fx: 9, fy: 9, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shadow), st(0.5, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12, r: 11, fx: 9, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['circle', { cx: 12, cy: 12.4, r: 10.4, fill: url(1), ...INK, class: 'wm-deco' }],
    ['path', { d: HEAD_SH, fill: C.ink, 'fill-opacity': 0.35, class: 'wm-shadow' }],
    ['path', { d: HEAD, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M7.05 7.6L6.85 5.2L8.85 6.55ZM16.95 7.6L17.15 5.2L15.15 6.55Z', fill: C.c1, class: 'wm-k' }],
    ['ellipse', { cx: 9.3, cy: 12.3, rx: 1.5, ry: 1.3, fill: C.c4, ...INK, class: 'wm-a' }],
    ['ellipse', { cx: 14.7, cy: 12.3, rx: 1.5, ry: 1.3, fill: C.c4, ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.3 11.3V13.3M14.7 11.3V13.3', ...ROUND, stroke: C.ink, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: 'M11.1 15H12.9L12 16Z', fill: C.c1, ...INK, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: 'M8.6 15.5L4.4 14.9M8.6 16.4L4.6 17.2M15.4 15.5L19.6 14.9M15.4 16.4L19.4 17.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.45, class: 'wm-deco' }],
    ['path', { d: 'M6.6 11.2C6.8 9.9 7.2 9 7.7 8.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
