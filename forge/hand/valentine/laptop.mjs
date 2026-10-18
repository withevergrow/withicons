// forge/hand/valentine/laptop.mjs — a short rosy lid with a cream screen over a wider trapezoid keyboard deck, the ink
// hinge line between them; the generated cream frame on a red bar read as a toaster or cake.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const LID = 'M6 4 H18 A2 2 0 0 1 20 6 V15.5 H4 V6 A2 2 0 0 1 6 4 Z'
const DECK = 'M4 15.5 H20 L22.4 18.9 A1 1 0 0 1 21.6 20.5 H2.4 A1 1 0 0 1 1.6 18.9 Z'
const SCREEN = 'M6.75 6.25 H17.25 A0.75 0.75 0 0 1 18 7 V13.5 H6 V7 A0.75 0.75 0 0 1 6.75 6.25 Z'

const halo = (d, cls) => ['path', { d, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: cls }]
const body = (d, fill, cls) => ['path', { d, fill, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: cls }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-laptop-0', x1: 10, y1: 4, x2: 14, y2: 20.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.45, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    halo(LID, 'wm-k'),
    halo(DECK, 'wm-a'),
    body(LID, 'url(#wg-valentine-laptop-0)', 'wm-k'),
    body(SCREEN, C4, 'wm-k'),
    ['path', { d: 'M17.6 13.15 H6.4 V12.4 H16.4 A0.8 0.8 0 0 0 17.2 11.6 V7 A0.5 0.5 0 0 1 17.6 7.3 Z', fill: SH, 'fill-opacity': 0.25, class: 'wm-shadow' }],
    ['path', { d: 'M8.6 11.2 L12.4 7.4 M11.2 11.2 L13.4 9', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    body(DECK, 'url(#wg-valentine-laptop-0)', 'wm-a'),
    ['path', { d: 'M10 15.5 H14 V16.1 A0.6 0.6 0 0 1 13.4 16.7 H10.6 A0.6 0.6 0 0 1 10 16.1 Z', fill: C4, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M2.1 19.5 H21.9 L21.95 19.6 A0.6 0.6 0 0 1 21.4 20.15 H2.6 A0.6 0.6 0 0 1 2.05 19.6 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M4.95 9 V6.4 A1.2 1.2 0 0 1 5.9 5.05', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
