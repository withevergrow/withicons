// forge/hand/valentine/black-cat.mjs — a sitting black cat in deep plum: two pointed pink-lined ears, glowing eyes,
// whiskers and a tail curling up the side; the generated one was a pink blob that read as a pig.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const BODY = 'M7.6 13 C5.6 15.2 5.2 17.6 5.6 19.6 C5.9 20.9 7 21.5 8.4 21.5 H15.6 C17 21.5 18.1 20.9 18.4 19.6 C18.8 17.6 18.4 15.2 16.4 13 Z'
const HEAD = 'M5.4 2.8 L9.3 5.2 C11 4.8 13 4.8 14.7 5.2 L18.6 2.8 C19.2 5.2 19.3 7.4 19 9.6 C18.6 13.2 15.6 15 12 15 C8.4 15 5.4 13.2 5 9.6 C4.7 7.4 4.8 5.2 5.4 2.8 Z'
// tail: a thick curl from the haunch up the left side, tip flicking inward
const TAIL = 'M6 20 C3.2 20 2.2 17.6 2.6 15.2 C2.9 13.4 4 12.4 4.8 12.6'
// heart, top right
const HEART = 'M20.93 4.97C20.45 4.27 20.09 3.61 20.28 3.09C20.44 2.62 20.91 2.48 21.22 2.59C21.47 2.68 21.6 2.9 21.57 3.16C21.71 2.94 21.94 2.85 22.2 2.94C22.5 3.05 22.78 3.45 22.62 3.92C22.43 4.45 21.74 4.73 20.93 4.97z'
const EYE = (cx) => `M${cx} 8.2 C${cx - 1.5} 8.7 ${cx - 1.5} 10.9 ${cx} 11.4 C${cx + 1.5} 10.9 ${cx + 1.5} 8.7 ${cx} 8.2 Z`

export default function render() {
  return [
    ['path', { d: TAIL, fill: 'none', stroke: C4, 'stroke-width': 3.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BODY, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: HEAD, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: HEART, fill: C2, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: TAIL, fill: 'none', stroke: INK, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BODY, fill: INK, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M9 21 V17.6 M15 21 V17.6', fill: 'none', stroke: SH, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['path', { d: HEAD, fill: INK, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M6.2 5 L8.4 6.4 C7.6 6.7 6.8 7.4 6.4 8.4 C6.1 7.4 6 6.2 6.2 5 Z', fill: C1, class: 'wm-k' }],
    ['path', { d: 'M17.8 5 L15.6 6.4 C16.4 6.7 17.2 7.4 17.6 8.4 C17.9 7.4 18 6.2 17.8 5 Z', fill: C1, class: 'wm-k' }],
    ['path', { d: EYE(9.2), fill: C4, class: 'wm-k' }],
    ['path', { d: EYE(14.8), fill: C4, class: 'wm-k' }],
    ['path', { d: 'M9.2 9 V10.6 M14.8 9 V10.6', fill: 'none', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M11.2 12.3 H12.8 L12 13.2 Z', fill: C1, stroke: C1, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M5.4 11.6 L2.6 11 M5.5 13 L3 13.6 M18.6 11.6 L21.4 11 M18.5 13 L21 13.6', fill: 'none', stroke: INK, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.2 14.9 C9.4 16.2 14.6 16.2 16.8 14.9', fill: 'none', stroke: SH, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['path', { d: 'M6.6 9.6 C6.6 8.8 6.7 8 6.9 7.4', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-shine' }],
    ['circle', { cx: 8.4, cy: 9, r: 0.4, fill: SHINE, 'fill-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 14, cy: 9, r: 0.4, fill: SHINE, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}
