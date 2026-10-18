// forge/hand/christmas/image-off.mjs — a framed picture (ice-blue sky, gold sun, pine mountain with a snow cap) struck through by one
// bold cranberry slash with an ink outline, a clean diagonal in a contrasting colour. Replaces the generated drawing, where the slash
// left a pale halo and the green picture and snow cap muddled together. Roles: sky tint, sun c3, mountain c2, slash c1. Motion: slash wm-s.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const FRAME = 'M5.5 3.5H18.5Q21.5 3.5 21.5 6.5V17.5Q21.5 20.5 18.5 20.5H5.5Q2.5 20.5 2.5 17.5V6.5Q2.5 3.5 5.5 3.5Z'
  const HILL = 'M2.5 20.5V16.6L8.2 10.6Q9 9.8 9.8 10.6L14.2 15.2L16.4 13Q17.2 12.2 18 13L21.5 16.6V17.5Q21.5 20.5 18.5 20.5Z'
  const SNOW = 'M6.6 12.4L8.2 10.8Q9 10 9.8 10.8L11.4 12.5L10.2 12.2L9 13L8 12.1Z'
  const SLASH = 'M5 5.5L19 18.5'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 17, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 10, x2: 0, y2: 13.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: FRAME, fill: C.tint, ...INK, class: 'wm-k' }],
    ['path', { d: disc(17.4, 8.3, 2), fill: C.accent, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: HILL, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: FRAME, fill: url(0), class: 'wm-shine' }],
    // one clean slash: ink edge, cranberry body, a bright glint
    ['path', { d: SLASH, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SLASH, fill: 'none', stroke: C.c1, 'stroke-width': 2.8, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M5.9 6.2L12 11.8', fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.6, class: 'wm-shine' }],
  ]
}
