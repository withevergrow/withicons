// Hand-drawn gothic laddoo: three gold sweets stacked in a pyramid on a sapphire dish with a stone rim.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const f = (n) => Math.round(n * 100) / 100;
const ball = (cx, cy, r) => [
  ['circle', { cx, cy: f(cy + 0.7), r, fill: V('shadow', '#140F18'), 'fill-opacity': '.22', class: 'wm-shadow' }],
  ['circle', { cx, cy, r, fill: V('c3', '#E6A421'), stroke: INK, 'stroke-width': '1', class: 'wm-k' }],
  ['path', { d: `M${f(cx + r * 0.62)} ${f(cy + r * 0.45)}A${f(r * 0.78)} ${f(r * 0.78)} 0 0 1 ${f(cx - r * 0.1)} ${f(cy + r * 0.78)}`, fill: 'none', stroke: V('edge', '#837A6F'), 'stroke-width': '.8', 'stroke-linecap': 'round', 'stroke-opacity': '.7', class: 'wm-k' }],
  ['path', { d: `M${f(cx - r * 0.68)} ${f(cy - r * 0.1)}A${f(r * 0.72)} ${f(r * 0.72)} 0 0 1 ${f(cx - r * 0.1)} ${f(cy - r * 0.68)}`, fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.9', 'stroke-linecap': 'round', 'stroke-opacity': '.9', class: 'wm-shine' }],
  ...[[0.25, -0.1], [-0.2, 0.3], [0.35, 0.4]].map(([dx, dy]) => ['circle', { cx: f(cx + dx * r), cy: f(cy + dy * r), r: '.4', fill: V('c1', '#B3163B'), class: 'wm-deco' }]),
];
export default function render() {
  return [
    ...ball(7.6, 14.2, 3.9),
    ...ball(16.4, 14.2, 3.9),
    ...ball(12, 8.4, 3.9),
    // dish
    ['path', { d: 'M3.2 19.2H20.8C20 21.4 18.4 22.4 16.6 22.4H7.4C5.6 22.4 4 21.4 3.2 19.2Z', fill: V('shadow', '#140F18'), 'fill-opacity': '.22', class: 'wm-shadow' }],
    ['path', { d: 'M2.6 18.2H21.4C20.7 20.4 19 21.7 17 21.7H7C5 21.7 3.3 20.4 2.6 18.2Z', fill: V('c2', '#2552B4'), stroke: INK, 'stroke-width': '1', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['rect', { x: '2.2', y: '17.3', width: '19.6', height: '1.9', rx: '.95', fill: V('tint', '#D3CDC0'), stroke: INK, 'stroke-width': '.9', class: 'wm-k' }],
    ['path', { d: 'M4.5 18.1H10', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.5', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M5.4 19.9C6.4 20.5 7.4 20.7 8.4 20.7', fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.6', 'stroke-linecap': 'round', 'stroke-opacity': '.6', class: 'wm-shine' }],
  ];
}
