// Hand-drawn gothic baby: the line baby face (curl, dot eyes, smile, side ears) in a gold glass face set in a stone rim.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const k = { class: 'wm-k' };
const circ = (cx, cy, r, fill, extra = {}) => ['circle', { cx, cy, r, fill, ...extra }];
export default function render() {
  return [
    circ(12.6, 13.8, 8.6, V('shadow', '#140F18'), { 'fill-opacity': '.22', class: 'wm-shadow' }),
    // ears
    circ(3.9, 13.2, 2, V('tint', '#D3CDC0'), { stroke: INK, 'stroke-width': '1', ...k }),
    circ(20.1, 13.2, 2, V('tint', '#D3CDC0'), { stroke: INK, 'stroke-width': '1', ...k }),
    // head: ink, stone rim, gold glass
    circ(12, 13, 8.5, INK, k),
    circ(12, 13, 7.7, V('tint', '#D3CDC0'), k),
    circ(12, 13, 6.5, V('c3', '#E6A421'), { stroke: INK, 'stroke-width': '.6', ...k }),
    ['path', { d: 'M5.6 12.2A6.5 6.5 0 0 1 10 7', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.9', 'stroke-linecap': 'round', 'stroke-opacity': '.85', class: 'wm-shine' }],
    ['path', { d: 'M18.6 15.5A6.9 6.9 0 0 1 14.5 19.2', fill: 'none', stroke: V('edge', '#837A6F'), 'stroke-width': '.8', 'stroke-linecap': 'round', 'stroke-opacity': '.7', class: 'wm-k' }],
    // curl
    ['path', { d: 'M12.2 6.9C14.4 7.5 14.3 9.9 12.1 9.7', fill: 'none', stroke: INK, 'stroke-width': '1.1', 'stroke-linecap': 'round', class: 'wm-a' }],
    // cheeks
    circ(7.5, 15.7, 1.2, V('c1', '#B3163B'), { 'fill-opacity': '.55', class: 'wm-deco' }),
    circ(16.5, 15.7, 1.2, V('c1', '#B3163B'), { 'fill-opacity': '.55', class: 'wm-deco' }),
    // eyes + smile
    circ(9.2, 12.8, 1.15, INK, { class: 'wm-a' }),
    circ(14.8, 12.8, 1.15, INK, { class: 'wm-a' }),
    ['path', { d: 'M9.8 16A2.8 2.8 0 0 0 14.2 16', fill: 'none', stroke: INK, 'stroke-width': '1.15', 'stroke-linecap': 'round', class: 'wm-a' }],
  ];
}
