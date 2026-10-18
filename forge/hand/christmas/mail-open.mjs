// forge/hand/christmas/mail-open.mjs — an opened envelope: a snow-cream inner flap standing up, a letter peeking out with two
// cranberry lines, and a solid cranberry front pocket with a bold ink outline and a snow tuft on the flap tip. Replaces the
// generated drawing, which was nearly all pale grey on the cream page. Roles: pocket c1, flap/inside c4+tint, letter shine, lines c1.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const spark = (x, y, r) => { const q = r * 0.22; return `M${x} ${y - r}Q${x + q} ${y - q} ${x + r} ${y}Q${x + q} ${y + q} ${x} ${y + r}Q${x - q} ${y + q} ${x - r} ${y}Q${x - q} ${y - q} ${x} ${y - r}Z` }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const BACK = 'M2.5 10.2L10.4 3.9Q12 2.7 13.6 3.9L21.5 10.2V18.5Q21.5 20.5 19.5 20.5H4.5Q2.5 20.5 2.5 18.5Z'
  const FRONT = 'M2.5 10.2L12 16.2L21.5 10.2V18.5Q21.5 20.5 19.5 20.5H4.5Q2.5 20.5 2.5 18.5Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 5, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // inside of the envelope with its flap up
    ['path', { d: BACK, fill: C.tint, ...INK, class: 'wm-k' }],
    // the letter
    ['path', { d: 'M6.2 9V7.2Q6.2 6.2 7.2 6.2H16.8Q17.8 6.2 17.8 7.2V12H6.2Z', fill: C.c4, ...INK, class: 'wm-a' }],
    ['path', { d: 'M8.4 8.5H15.6M8.4 10.5H13', fill: 'none', stroke: C.c1, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-a' }],
    // the pocket
    ['path', { d: FRONT, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BACK, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M4.6 12.4L10.6 16.2', fill: 'none', stroke: C.shine, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-shine' }],
    // a little snow on the flap tip
    ['path', { d: 'M9.1 5.4Q10.6 2.5 12 2.7Q13.4 2.5 14.9 5.4Q14.4 6 13.8 5.6Q13.2 6.3 12.5 5.7Q11.8 6.4 11.1 5.7Q10.4 6.3 9.8 5.6Q9.3 5.9 9.1 5.4Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: spark(20.2, 4, 1.6), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
