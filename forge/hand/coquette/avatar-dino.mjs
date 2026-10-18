// forge/hand/coquette/avatar-dino.mjs: hand-drawn coquette dino (head, snout, eye, spines, tail) with a bow on its head.
const INK = 'var(--with-coquette-ink, #7E2443)'
const C1 = 'var(--with-coquette-c1, #F8BCCB)'
const C2 = 'var(--with-coquette-c2, #EC8DA6)'
const C3 = 'var(--with-coquette-c3, #D7385F)'
const SH = 'var(--with-coquette-shadow, #A8345C)'
const SHINE = 'var(--with-coquette-shine, #FFFFFF)'
const BODY = 'M2.2 15.8C4.5 16.6 5.4 13.2 8.5 12.4C10.4 11.9 12 11.6 13 10.6L13.4 9.6C12.3 8.6 12.6 5.4 15.6 4.9C18.6 4.4 21.6 5.6 21.8 8.1C22 9.9 20.3 10.5 18.6 10.6L17 10.8C16.8 12.5 17.6 14.8 16.6 17L16.2 20.2C16.1 21 14.6 21 14.5 20.2L14.3 18.6L10 18.8L9.8 20.2C9.7 21 8.2 21 8.1 20.2L7.9 18.4C5.8 17.8 4 17.4 2.2 15.8Z'
export default function render() {
  return [
    ['ellipse', { cx: 11.5, cy: 21.2, rx: 6.5, ry: 0.9, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }],
    ['path', { d: 'M5.8 13.6L6.4 11.9L7.6 12.9M8.6 12.3L9.4 10.6L10.4 11.9M11.2 11.4L12.2 9.8L12.8 11', fill: C2, stroke: INK, 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BODY, fill: C1, stroke: INK, 'stroke-width': 1.3, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M9.6 15.2C11 16.6 13.4 16.6 14.8 15.2', fill: 'none', stroke: C2, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M14.6 6.4C15.4 5.7 16.6 5.6 17.6 5.9', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 17.6, cy: 7.6, r: 1.05, fill: INK, class: 'wm-k' }],
    ['circle', { cx: 17.9, cy: 7.3, r: 0.35, fill: SHINE, class: 'wm-shine' }],
    ['circle', { cx: 20.6, cy: 7.4, r: 0.35, fill: INK, class: 'wm-k' }],
    ['path', { d: 'M18.6 9.4C19.4 9.8 20.4 9.7 21 9.2', fill: 'none', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['ellipse', { cx: 16.6, cy: 9.2, rx: 0.8, ry: 0.45, fill: C2, 'fill-opacity': 0.8, class: 'wm-k' }],
    ['path', { d: 'M14.6 4.6L12.2 3C11.4 2.5 10.8 3.4 11 4.1C11.2 5 12.4 5.2 14.6 4.6ZM14.6 4.6L17 2.6C17.8 2 18.5 2.9 18.3 3.6C18.1 4.5 16.8 4.9 14.6 4.6Z', fill: C3, stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['circle', { cx: 14.6, cy: 4.6, r: 0.8, fill: C3, stroke: INK, 'stroke-width': 0.9, class: 'wm-deco' }],
  ]
}
