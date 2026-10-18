// Hand-drawn gothic tombstone: a plain round-topped headstone in carved stone with two inscription bars, set in grass.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const BODY = 'M6 20.5V9.5A6 6 0 0 1 18 9.5V20.5Z';
export default function render() {
  return [
    ['path', { d: 'M6.7 21.3V10.2A6 6 0 0 1 18.7 10.2V21.3Z', fill: V('shadow', '#140F18'), 'fill-opacity': '.22', class: 'wm-shadow' }],
    ['path', { d: BODY, fill: V('tint', '#D3CDC0'), stroke: INK, 'stroke-width': '1.2', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shaded right side and inner bevel
    ['path', { d: 'M16.2 20.2V9.6A4.2 4.2 0 0 0 15 6.6A6 6 0 0 1 18 9.5V20.5H16.2Z', fill: V('edge', '#837A6F'), 'fill-opacity': '.5', class: 'wm-k' }],
    ['path', { d: 'M7.5 19V9.6A4.6 4.6 0 0 1 10.6 5.3', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.9', 'stroke-linecap': 'round', 'stroke-opacity': '.9', class: 'wm-shine' }],
    // inscription
    ['path', { d: 'M10 10.5H14M9 14.5H15', fill: 'none', stroke: INK, 'stroke-width': '1.4', 'stroke-linecap': 'round', class: 'wm-a' }],
    // grass
    ['path', { d: 'M3.4 19.4H20.6A1.1 1.1 0 0 1 21.7 20.5V20.6A1.2 1.2 0 0 1 20.5 21.8H3.5A1.2 1.2 0 0 1 2.3 20.6V20.5A1.1 1.1 0 0 1 3.4 19.4Z', fill: V('c4', '#1C8A5F'), stroke: INK, 'stroke-width': '1', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.6 19.4L3 16.9L4.7 18.3L5.4 17L6.2 19.4Z', fill: V('c4', '#1C8A5F'), stroke: INK, 'stroke-width': '.8', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M17.8 19.4L18.6 17L19.4 18.3L21 16.9L20.5 19.4Z', fill: V('c4', '#1C8A5F'), stroke: INK, 'stroke-width': '.8', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M4 20.5H9', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.5', 'stroke-linecap': 'round', 'stroke-opacity': '.6', class: 'wm-shine' }],
  ];
}
