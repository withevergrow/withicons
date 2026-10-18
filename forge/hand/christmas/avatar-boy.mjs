// forge/hand/christmas/avatar-boy.mjs — a boy with a big friendly face, short dark hair swept into a fringe, ears,
// ink eyes with catch-lights and a smile, wide shoulders in a cranberry jumper; snow and holly on his hair. The
// generated drawing shrank the face under a hair cap and a bow, which read as a girl with a bun.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const disc = (cx, cy, r) => `M${n(cx - r)} ${cy}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0z`
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const SKIN = V('c1', '#A0673F'), HAIR = V('c2', '#2A2120'), TOP = V('c4', '#A3123A'), SH = V('shadow', '#5E3518'), TINT = V('tint', '#DDB89C')

export default function render(icon) {
  const name = icon.name || 'avatar-boy'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const FACE = disc(12, 11.6, 6.1)
  const EARS = disc(5.8, 12.2, 1.15) + disc(18.2, 12.2, 1.15)
  const HAIRD = 'M5.95 11.4C5 6.9 7.6 4.3 12 4.3C16.4 4.3 19 6.9 18.05 11.4C17.7 10 17 9.1 16.1 8.6C14.6 9.6 11.4 9.7 9.6 8.1C8 8.8 6.6 9.8 5.95 11.4Z'
  const BODY = 'M3.4 22.6C3.4 19.7 6.6 18.2 12 18.2C17.4 18.2 20.6 19.7 20.6 22.6Z'
  const NECK = 'M10.3 16.2H13.7V19H10.3Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, SH, 0), st(1, SH, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: BODY, fill: TOP, ...INK, class: 'wm-a' }],
    ['path', { d: 'M9.6 18.5Q12 20.6 14.4 18.5', fill: 'none', stroke: C.ink, 'stroke-width': 0.4, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: NECK, fill: SKIN, ...INK, 'stroke-width': 0.42, class: 'wm-k' }],
    ['path', { d: NECK, fill: SH, 'fill-opacity': 0.32, class: 'wm-k' }],
    ['path', { d: EARS, fill: SKIN, ...INK, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: FACE, fill: SKIN, ...INK, class: 'wm-k' }],
    ['path', { d: HAIRD, fill: HAIR, ...INK, class: 'wm-k' }],
    ['path', { d: FACE + HAIRD + BODY, fill: url(0), 'fill-rule': 'nonzero', class: 'wm-shine' }],
    // face: eyes with catch-lights, soft cheeks, a smile
    ['path', { d: disc(9.4, 12.5, 0.8) + disc(14.6, 12.5, 0.8), fill: C.ink, class: 'wm-k' }],
    ['path', { d: disc(9.7, 12.2, 0.28) + disc(14.9, 12.2, 0.28), fill: C.shine, class: 'wm-k' }],
    ['path', { d: 'M10.1 15Q12 16.7 13.9 15', fill: 'none', stroke: C.ink, 'stroke-width': 0.65, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.4 14.6a1 .6 0 1 0 2 0a1 .6 0 1 0 -2 0zM14.6 14.6a1 .6 0 1 0 2 0a1 .6 0 1 0 -2 0z', fill: SH, 'fill-opacity': 0.25, class: 'wm-k' }],
    // snow resting on the crown, holly tucked beside it
    ['path', { d: 'M8.1 4.9C8.5 2.9 10.2 1.9 12 2C13.8 1.9 15.5 2.9 15.9 4.9Q15.2 5.7 14.5 5.1Q13.8 6 13 5.2Q12 6 11 5.2Q10.2 6 9.5 5.1Q8.8 5.7 8.1 4.9Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M17.9 4.1q-1.2-1-2.4-.1q1.1 1 2.4 .1zM17.9 4.1q1.2-1 2.4-.1q-1.1 1-2.4 .1z', fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(17.4, 3.9, 0.5) + disc(18.4, 3.9, 0.5) + disc(17.9, 3.25, 0.5), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
  ]
}
