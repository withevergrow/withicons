// forge/hand/christmas/heart-handshake.mjs — a solid cranberry heart with a bold snow-cream handshake across it: two pine cuffs,
// two cream hands meeting in a clasp with three curled fingers and a thumb, all ink-outlined. Replaces the generated drawing,
// where a pale heart and thin interior lines washed out. Roles: heart c1, hands c4, cuffs c2, snow shine->tint. Motion: whole icon.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const spark = (x, y, r) => { const q = r * 0.22; return `M${x} ${y - r}Q${x + q} ${y - q} ${x + r} ${y}Q${x + q} ${y + q} ${x} ${y + r}Q${x - q} ${y + q} ${x - r} ${y}Q${x - q} ${y - q} ${x} ${y - r}Z` }
const HEART = 'M12 20.5C12 20.5 3 15.2 3 8.9C3 6.2 5.1 4 7.8 4C9.6 4 11.1 5 12 6.5C12.9 5 14.4 4 16.2 4C18.9 4 21 6.2 21 8.9C21 15.2 12 20.5 12 20.5Z'

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  // left hand (behind) and right hand (in front, fingers curling under the left)
  const LH = 'M7.4 9.8H11.2Q12.5 8.4 14 9.8L15.2 11.2L10.6 16Q9.6 16.4 8.9 15.6L7.4 14Z'
  const RH = 'M16.6 9.8H14.4L11.2 12.4Q10.2 13.4 11.2 14.4Q12 15 12.8 14.4Q13 15.4 14 15.6Q14.9 15.7 15.3 14.8Q16.2 15 16.6 14.2Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 4, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 5.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: HEART, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: HEART, fill: url(0), class: 'wm-shine' }],
    // cuffs
    ['path', { d: 'M5.4 9.2H7.4V14H5.4Z', fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: 'M16.6 9.2H18.6V14H16.6Z', fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: LH, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: RH, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: 'M12.7 12.7L14.4 14.4M13.9 11.7L15.6 13.4', fill: 'none', stroke: C.ink, 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.6, class: 'wm-k' }],
    ['path', { d: 'M4.3 5.3Q5.8 2.6 8.2 3.1Q9.8 2.9 10.7 4.3Q10.5 5.2 9.8 5Q9.2 5.7 8.5 5.2Q7.8 5.9 7.1 5.3Q6.4 5.8 5.8 5.4Q5.3 5.9 4.3 5.3Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: spark(20.4, 3.4, 1.7), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
