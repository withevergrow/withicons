// forge/hand/gothic/egg.mjs — a warm cream egg girdled by a gilt filigree band with dark speckles and a candlelit highlight.
const EGG = 'M12 2.5C14.75 2.5 18.5 8 18.5 13.5C18.5 18.5 15.5 21.5 12 21.5C8.5 21.5 5.5 18.5 5.5 13.5C5.5 8 9.25 2.5 12 2.5Z'
const IN = 'M12 3.9C14.2 3.9 17.1 8.5 17.1 13.4C17.1 17.6 14.8 20.1 12 20.1C9.2 20.1 6.9 17.6 6.9 13.4C6.9 8.5 9.8 3.9 12 3.9Z'
const V = (r, h) => `var(--with-gothic-${r}, ${h})`
export default function render() {
  return [
    ['ellipse', { cx: 12.6, cy: 21.2, rx: 6, ry: 1.3, fill: V('shadow', '#140F18'), 'fill-opacity': 0.25, class: 'wm-shadow' }],
    ['path', { d: EGG, fill: V('ink', '#221A26'), class: 'wm-k' }],
    ['path', { d: IN, fill: V('c3', '#F1E2C0'), class: 'wm-k' }],
    ['path', { d: 'M15.2 6.2C16.6 8.3 17.1 11 17.1 13.4C17.1 17.6 14.8 20.1 12 20.1C10.9 20.1 9.9 19.7 9.1 19.1C13.6 19.6 16.4 14.4 15.2 6.2Z', fill: V('edge', '#B08A5A'), 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: 'M6.95 12.2C10.3 13.3 13.7 13.3 17.05 12.2L17.1 14.6C13.7 15.7 10.3 15.7 6.9 14.6Z', fill: V('accent', '#D9A23A'), class: 'wm-s' }],
    ['path', { d: 'M8.4 13.9L9.4 13.1L10.4 14.1L11.4 13.3L12.4 14.2L13.4 13.3L14.4 14.1L15.4 13.1', stroke: V('ink', '#221A26'), 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['circle', { cx: 13.8, cy: 8.2, r: 0.55, fill: V('c1', '#7A4E3A'), class: 'wm-deco' }],
    ['circle', { cx: 11.2, cy: 9.9, r: 0.4, fill: V('c1', '#7A4E3A'), class: 'wm-deco' }],
    ['circle', { cx: 15.1, cy: 10.6, r: 0.4, fill: V('c1', '#7A4E3A'), class: 'wm-deco' }],
    ['circle', { cx: 10.2, cy: 17.4, r: 0.45, fill: V('c1', '#7A4E3A'), class: 'wm-deco' }],
    ['circle', { cx: 13.9, cy: 17.9, r: 0.55, fill: V('c1', '#7A4E3A'), class: 'wm-deco' }],
    ['path', { d: 'M8.9 11.2C8.9 9.4 9.7 7.6 10.8 6.4', stroke: V('shine', '#FFF6DE'), 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
