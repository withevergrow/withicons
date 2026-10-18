// forge/hand/valentine/phone.mjs — a rosy gradient handset with an ink outline, bottom shade and shine; the generated
// one was all pale cream and faded into light backgrounds.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const BODY = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
// shade: a crescent hugging the outer curve (centre 19,5), plus the earpiece bottom
const SHADE = 'M17.39 20.92 A16 16 0 0 1 5.14 13 L6.37 12.29 A14.6 14.6 0 0 0 17.53 19.53 Z M20.6 17 V19 A1.6 1.6 0 0 1 19 20.6 L18.9 19.6 A1.2 1.2 0 0 0 19.6 18.6 V17 Z'
const HEARTS = 'M14.24 5.39C13.66 4.49 13.24 3.66 13.49 3C13.72 2.42 14.31 2.26 14.69 2.41C15.01 2.54 15.16 2.81 15.11 3.15C15.3 2.87 15.6 2.76 15.92 2.89C16.3 3.04 16.63 3.55 16.41 4.14C16.15 4.79 15.27 5.12 14.24 5.39zM19.63 7.87C19.15 7.17 18.79 6.51 18.98 5.99C19.14 5.52 19.61 5.38 19.92 5.49C20.17 5.58 20.3 5.8 20.27 6.06C20.41 5.84 20.64 5.75 20.9 5.84C21.2 5.95 21.48 6.35 21.32 6.82C21.13 7.35 20.44 7.63 19.63 7.87z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-phone-0', x1: 8, y1: 3, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.4, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { d: BODY, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: HEARTS, fill: C2, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BODY, fill: 'url(#wg-valentine-phone-0)', stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SHADE, fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M4.1 8.2 V5.1 A1.1 1.1 0 0 1 5.2 4 H6.6', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 4.3, cy: 9.9, r: 0.4, fill: SHINE, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}
