// Hand-drawn gothic gift stack: a wide sapphire box with a stone lid, a ruby box with a gilded bow and a small emerald box, all tied with gold ribbon.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const rect = (x, y, w, h, r, fill, extra = {}) => ['rect', { x, y, width: w, height: h, rx: r, fill, stroke: INK, 'stroke-width': '1', 'stroke-linejoin': 'round', ...extra }];
export default function render() {
  return [
    ['path', { d: 'M3.7 22.3H21.7V15.5H17.2V11.3H14.7V9H5.2V15.2H3.7Z', fill: V('shadow', '#140F18'), 'fill-opacity': '.22', class: 'wm-shadow' }],
    // right small box (behind)
    rect(16.5, 10.5, 4.5, 4.2, 0.9, V('c4', '#1C8A5F'), { class: 'wm-k' }),
    rect(18.1, 10.5, 1.3, 4.2, 0, V('c3', '#E6A421'), { 'stroke-width': '.7', class: 'wm-k' }),
    // left ruby box
    rect(4.5, 8, 9.5, 6.8, 1.2, V('c1', '#B3163B'), { class: 'wm-k' }),
    ['path', { d: 'M6 9.6V13', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.7', 'stroke-linecap': 'round', 'stroke-opacity': '.8', class: 'wm-shine' }],
    rect(8.6, 8, 1.3, 6.8, 0, V('c3', '#E6A421'), { 'stroke-width': '.7', class: 'wm-k' }),
    // bottom sapphire box
    rect(3, 14.5, 18, 7, 1.6, V('c2', '#2552B4'), { class: 'wm-k' }),
    rect(3, 14.5, 18, 2.2, 1.1, V('tint', '#D3CDC0'), { 'stroke-width': '.9', class: 'wm-k' }),
    ['path', { d: 'M4.8 15.6H9', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.5', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M5 18.6V20', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.7', 'stroke-linecap': 'round', 'stroke-opacity': '.7', class: 'wm-shine' }],
    rect(10.8, 14.5, 2.4, 7, 0, V('c3', '#E6A421'), { 'stroke-width': '.8', class: 'wm-k' }),
    // bow
    ['path', { d: 'M9.25 8C8.2 5.7 5.9 4.9 5.6 6.2C5.4 7.4 7.3 8 9.25 8C11.2 8 13.1 7.4 12.9 6.2C12.6 4.9 10.3 5.7 9.25 8Z', fill: V('c3', '#E6A421'), stroke: INK, 'stroke-width': '1', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: '9.25', cy: '7.7', r: '.9', fill: V('accent', '#C79A38'), stroke: INK, 'stroke-width': '.7', class: 'wm-a' }],
    ['path', { d: 'M6.6 6.2C7.2 5.8 7.9 6.2 8.2 6.8', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.5', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
