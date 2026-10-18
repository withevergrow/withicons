// Hand-drawn gothic chocolate strawberry: an upright ruby berry, dark chocolate dipped top with a pale drip edge, green leaf crown and gold seeds.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const BODY = 'M12 21.5C7.5 19.5 4.75 15 5 11C5.25 8.25 8 7 12 7C16 7 18.75 8.25 19 11C19.25 15 16.5 19.5 12 21.5Z';
const WAVE = 'M5.2 12.4C6.75 11.9 7.5 14.4 9 14.4C10.5 14.4 10.5 12.15 12 12.15C13.5 12.15 13.75 15.4 15.25 15.4C16.75 15.4 17.25 11.9 18.8 12.4';
export default function render() {
  return [
    ['path', { d: 'M12.7 22.3C8.2 20.3 5.5 15.8 5.7 11.8C5.9 9.2 8.6 7.8 12.7 7.8C16.7 7.8 19.4 9.2 19.7 11.8C19.9 15.8 17.2 20.3 12.7 22.3Z', fill: V('shadow', '#140F18'), 'fill-opacity': '.22', class: 'wm-shadow' }],
    ['path', { d: BODY, fill: V('c1', '#B3163B'), stroke: INK, 'stroke-width': '1.2', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // chocolate cap
    ['path', { d: WAVE + 'C19.05 11.8 19.02 11.4 19 11C18.75 8.25 16 7 12 7C8 7 5.25 8.25 5 11C4.98 11.4 5.05 11.9 5.2 12.4Z', fill: INK, class: 'wm-k' }],
    ['path', { d: 'M7 11.6C7.2 9.9 8.6 8.9 10.4 8.5', fill: 'none', stroke: V('edge', '#837A6F'), 'stroke-width': '.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: WAVE, fill: 'none', stroke: V('tint', '#D3CDC0'), 'stroke-width': '1.1', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // berry shine + shade
    ['path', { d: 'M6.7 14.6C7 16 7.6 17.2 8.5 18.2', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.8', 'stroke-linecap': 'round', 'stroke-opacity': '.8', class: 'wm-shine' }],
    ['path', { d: 'M16.6 17.6C15.8 18.8 14.7 19.8 13.5 20.5', fill: 'none', stroke: V('shadow', '#140F18'), 'stroke-width': '.8', 'stroke-linecap': 'round', 'stroke-opacity': '.4', class: 'wm-k' }],
    // seeds
    ...[[8.9, 18], [12, 17.8], [15.1, 18.2], [10.5, 20], [13.7, 20.2]].map(([cx, cy]) => ['ellipse', { cx, cy, rx: '.45', ry: '.65', fill: V('c3', '#E6A421'), class: 'wm-deco' }]),
    // stem + leaf crown
    ['path', { d: 'M12 6.8C12 5.2 12.5 3.8 13.6 2.7', fill: 'none', stroke: INK, 'stroke-width': '3', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M12 6.8C12 5.2 12.5 3.8 13.6 2.7', fill: 'none', stroke: V('c4', '#1C8A5F'), 'stroke-width': '1.4', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M7.4 8.4L8.7 4.7L12 6.6L15.3 4.7L16.6 8.4C14.4 9.3 9.6 9.3 7.4 8.4Z', fill: V('c4', '#1C8A5F'), stroke: INK, 'stroke-width': '1', 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: 'M9 6.6L9.5 5.6M15 6.6L14.5 5.6', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.6', 'stroke-linecap': 'round', 'stroke-opacity': '.8', class: 'wm-shine' }],
  ];
}
