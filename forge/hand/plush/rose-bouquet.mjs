// forge/hand/plush/rose-bouquet.mjs: plush bouquet, three big spiral roses, two leaves, a wrapped cone with a bow (new design).
const V = (r, h) => `var(--with-plush-${r}, ${h})`;
const INK = V('ink', '#4A2C3D'), SH = V('shadow', '#3A1E46'), SHINE = V('shine', '#FFFFFF'), EDGE = V('edge', '#FFF9F0');
const body = (d, fill, cls = 'wm-k') => ['path', { d, fill, stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: cls }];
const line = (d, cls, w = 1) => ['path', { d, fill: 'none', stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }];
const stitch = (d, cls) => ['path', { d, fill: 'none', stroke: EDGE, 'stroke-width': 0.42, 'stroke-linecap': 'round', 'stroke-dasharray': '0.8 0.6', 'stroke-opacity': 0.92, class: cls }];

function rose(cx, cy, r) {
  const f = (n) => Math.round(n * 100) / 100;
  return [
    ['circle', { cx, cy, r, fill: V('c1', '#F4695E'), stroke: INK, 'stroke-width': 1.2, class: 'wm-a' }],
    ['path', { d: `M${f(cx - r * 0.6)} ${f(cy + r * 0.1)}a${f(r * 0.6)} ${f(r * 0.6)} 0 0 0 ${f(r * 1.2)} 0`, fill: 'none', stroke: SH, 'stroke-opacity': 0.2, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: `M${f(cx - r * 0.5)} ${f(cy - r * 0.55)}a${f(r * 0.7)} ${f(r * 0.7)} 0 0 1 ${f(r * 0.6)} -${f(r * 0.3)}`, fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // spiral
    line(`M${f(cx)} ${f(cy)}a${f(r * 0.3)} ${f(r * 0.3)} 0 0 1 ${f(r * 0.6)} 0a${f(r * 0.55)} ${f(r * 0.55)} 0 0 1 -${f(r * 1.1)} 0a${f(r * 0.6)} ${f(r * 0.6)} 0 0 1 ${f(r * 1.2)} 0`, 'wm-a', 0.75),
  ];
}

export default function render() {
  return [
    ['path', { d: 'M10 22.6h5.5l.4.8H9.6z', fill: SH, 'fill-opacity': 0.16, class: 'wm-shadow' }],
    // leaves
    body('M5 13C2.6 13 1.2 11.2 1.25 9 3.6 8.6 5.6 9.8 6.2 12z', V('c4', '#4FBF8A')),
    body('M19 13c2.4 0 3.8-1.8 3.75-4-2.35-.4-4.35.8-4.95 3z', V('c4', '#4FBF8A')),
    line('M2.4 9.9L5 12.2', 'wm-k', 0.6),
    line('M21.6 9.9L19 12.2', 'wm-k', 0.6),
    // wrap cone
    body('M5.5 12.5h13l-4.25 9.5h-4.5z', V('tint', '#FFF0D9')),
    ['path', { d: 'M15.5 12.5h3l-4.25 9.5H13z', fill: SH, 'fill-opacity': 0.17, class: 'wm-k' }],
    stitch('M7 13.4h10', 'wm-k'),
    // roses
    ...rose(7.25, 11, 3.5),
    ...rose(16.75, 11, 3.5),
    ...rose(12, 6.25, 3.75),
    // bow
    body('M12 17.5c-1.5-1.3-3.5-1.4-3.5.1s2 1.3 3.5-.1c1.5 1.4 3.5 1.6 3.5.1s-2-1.4-3.5-.1z', V('c2', '#FFC53D')),
    ['circle', { cx: 12, cy: 17.5, r: 0.75, fill: V('c2', '#FFC53D'), stroke: INK, 'stroke-width': 0.8, class: 'wm-k' }],
  ];
}
