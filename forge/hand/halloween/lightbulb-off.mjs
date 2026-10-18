const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
const bulb = (x, y) => {
  const p = (a, b) => `${n(a + x)} ${n(b + y)}`;
  return `M${p(12, 1.5)}C${p(7.8, 1.5)} ${p(4.8, 4.6)} ${p(4.8, 8.6)}C${p(4.8, 11.4)} ${p(6.4, 13)} ${p(7.8, 14.5)}C${p(8.5, 15.3)} ${p(8.6, 16)} ${p(8.6, 16.8)}L${p(15.4, 16.8)}C${p(15.4, 16)} ${p(15.5, 15.3)} ${p(16.2, 14.5)}C${p(17.6, 13)} ${p(19.2, 11.4)} ${p(19.2, 8.6)}C${p(19.2, 4.6)} ${p(16.2, 1.5)} ${p(12, 1.5)}Z`;
};
const base = (x, y) => {
  const p = (a, b) => `${n(a + x)} ${n(b + y)}`;
  return `M${p(8.6, 17.8)}L${p(15.4, 17.8)}L${p(15.4, 19.4)}A3 3 0 0 1 ${p(12.4, 22.4)}L${p(11.6, 22.4)}A3 3 0 0 1 ${p(8.6, 19.4)}Z`;
};
export default function render() {
  const g = 'wg-halloween-lightbulb-off-0';
  const S = { stroke: INK, 'stroke-width': 1.3, 'stroke-linejoin': 'round' };
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 10, cy: 7, r: 12, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('tint', '#FFE3B8') }], ['stop', { offset: 1, 'stop-color': V('c1', '#FF9F2E') }]]]]],
    ['path', { d: bulb(0.15, 0.85) + base(0.15, 0.85), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: bulb(0, 0), fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: base(0, 0), fill: V('c3', '#8B55E0'), ...S, class: 'wm-k' }],
    ['path', { d: 'M8.6 20H15.4', stroke: INK, 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M7 5.6C7.6 4.3 8.7 3.4 10 3', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-shine' }],
    ['path', { d: 'M3.6 2.6L20.4 21.4', stroke: V('tint', '#FFE3B8'), 'stroke-width': 2.8, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M3.6 2.6L20.4 21.4', stroke: INK, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
