// Lunar drum: a barrel drum (purple rim, cream skin, orange body, stud row, one purple band) beaten by a big angled stick.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
export default function render() {
  const g = 'wg-halloween-lunar-drum-0';
  const S = { stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round' };
  const body = 'M3.6 10.8C3 13.4 3 16.4 4.2 18.8C5.6 21.8 16.4 21.8 17.8 18.8C19 16.4 19 13.4 18.4 10.8Z';
  const studs = [5.8, 8.4, 11, 13.6, 16.2].map((x) => {
    const y = 10.8 + 2.9 * Math.sqrt(1 - ((x - 11) / 7.4) ** 2) + 1.5;
    return ['circle', { cx: x, cy: n(y), r: 0.7, fill: V('tint', '#FFF1B8'), stroke: INK, 'stroke-width': 0.4, class: 'wm-k' }];
  });
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 9, cy: 15, r: 11, fx: 7, fy: 13.5, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 0.4, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]]]],
    ['path', { d: body, fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: body, fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: 'M3.4 16.6C5.4 19.6 16.6 19.6 18.6 16.6', stroke: V('c3', '#8B55E0'), 'stroke-width': 1.3, 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }],
    ['ellipse', { cx: 11, cy: 10.8, rx: 7.9, ry: 3, fill: V('c3', '#8B55E0'), ...S, class: 'wm-k' }],
    ['ellipse', { cx: 11, cy: 10.8, rx: 6.2, ry: 2.1, fill: V('tint', '#FFF1B8'), stroke: INK, 'stroke-width': 0.5, class: 'wm-k' }],
    ...studs,
    ['path', { d: 'M4.6 14.2C4.4 15.2 4.4 16.2 4.7 17', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-shine' }],
    ['path', { d: 'M20.6 2.6L14.6 8.4', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M20.6 2.6L14.6 8.4', stroke: V('c3', '#8B55E0'), 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 14.1, cy: 8.8, r: 1.9, fill: V('c4', '#86D13A'), ...S, class: 'wm-a' }],
  ];
}
