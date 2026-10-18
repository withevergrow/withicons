const W = 'var(--with-brutal-shine, #FFFDF5)';
const K = 'var(--with-brutal-ink, #16130F)';
const Y = 'var(--with-brutal-c1, #FFD23F)';
const P = 'var(--with-brutal-c2, #FF6BA8)';
const S = { stroke: K, 'stroke-width': '.9', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const f = (n) => Number(n.toFixed(2));
// silhouette pieces in paint order (back to front), with fills
const parts = (d) => [
  ['circle', { cx: f(7.3 + d), cy: f(12.6 + d), r: '1.3' }, Y],
  ['circle', { cx: f(16.7 + d), cy: f(12.6 + d), r: '1.3' }, Y],
  ['rect', { x: f(7 + d), y: f(17.6 + d), width: '10', height: '4.8', rx: '1.2' }, Y],
  ['rect', { x: f(8 + d), y: f(9.8 + d), width: '8', height: '8.4', rx: '1.2' }, W],
  ['rect', { x: f(8.6 + d), y: f(3.4 + d), width: '6.8', height: '6', rx: '.5' }, P],
  ['rect', { x: f(7.4 + d), y: f(8.8 + d), width: '9.2', height: '1.6', rx: '.5' }, K],
  ['path', { d: `M${f(12 + d)} ${f(3.6 + d)}c-1.2-.4-1.6-1.6-.9-2.5.4.6 1 .7 1.6.3.5.8.3 1.8-.7 2.2z` }, W],
];
export default function render() {
  const halo = parts(0).concat(parts(1.2)).map(([t, a]) => [t, { ...a, fill: W, stroke: W, 'stroke-width': '2', 'stroke-linejoin': 'round', class: 'wm-shadow' }]);
  const shadow = parts(1.2).map(([t, a]) => [t, { ...a, fill: K, class: 'wm-shadow' }]);
  const body = parts(0).map(([t, a, fill]) => [t, { ...a, fill, ...S, class: 'wm-k' }]);
  return [
    ...halo,
    ...shadow,
    ...body,
    // shako band
    ['rect', { x: '8.6', y: '6.6', width: '6.8', height: '1.5', fill: Y, ...S, 'stroke-width': '.7' }],
    // eyes
    ['circle', { cx: '10.4', cy: '12', r: '.6', fill: K }],
    ['circle', { cx: '13.6', cy: '12', r: '.6', fill: K }],
    // rosy cheeks
    ['circle', { cx: '9.3', cy: '13.4', r: '.5', fill: P, class: 'wm-deco' }],
    ['circle', { cx: '14.7', cy: '13.4', r: '.5', fill: P, class: 'wm-deco' }],
    // moustache
    ['path', { d: 'M12 13.7c-.9-.8-2.4-.9-3.4.2.5.9 1.8 1.2 3.4.1 1.6 1.1 2.9.8 3.4-.1-1-1.1-2.5-1-3.4-.2z', fill: K, ...S, 'stroke-width': '.3' }],
    // jaw with teeth
    ['path', { d: 'M9.6 15.7h4.8', fill: 'none', ...S, 'stroke-width': '1' }],
    ['path', { d: 'M11 15.7v1.3M12 15.7v1.3M13 15.7v1.3', fill: 'none', stroke: K, 'stroke-width': '.3' }],
    // jacket buttons + belt
    ['line', { x1: '7.4', y1: '20.6', x2: '16.6', y2: '20.6', stroke: K, 'stroke-width': '.8' }],
    ['circle', { cx: '12', cy: '19.1', r: '.55', fill: K }],
  ];
}
