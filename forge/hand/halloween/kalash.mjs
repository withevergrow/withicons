const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
const pot = (x, y) => {
  const p = (a, b) => `${n(a + x)} ${n(b + y)}`;
  return `M${p(9.4, 11.6)}L${p(14.6, 11.6)}C${p(14.6, 12.6)} ${p(15.2, 13.1)} ${p(16.2, 13.6)}C${p(18.4, 14.7)} ${p(19.4, 16.4)} ${p(19.4, 18)}C${p(19.4, 20.6)} ${p(16.4, 22.4)} ${p(12, 22.4)}C${p(7.6, 22.4)} ${p(4.6, 20.6)} ${p(4.6, 18)}C${p(4.6, 16.4)} ${p(5.6, 14.7)} ${p(7.8, 13.6)}C${p(8.8, 13.1)} ${p(9.4, 12.6)} ${p(9.4, 11.6)}Z`;
};
const rim = 'M8.2 10H15.8A0.9 0.9 0 0 1 15.8 11.8H8.2A0.9 0.9 0 0 1 8.2 10Z';
const leaf = (cx, cy, deg) => {
  const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const P = [[0, 0], [-1.7, -1.6], [-1.7, -4.2], [0, -6], [1.7, -4.2], [1.7, -1.6]]
    .map(([px, py]) => `${n(cx + px * c - py * s)} ${n(cy + px * s + py * c)}`);
  return `M${P[0]}C${P[1]} ${P[2]} ${P[3]}C${P[4]} ${P[5]} ${P[0]}Z`;
};
export default function render() {
  const g = 'wg-halloween-kalash-0';
  const S = { stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round' };
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 10, cy: 16, r: 10, fx: 9, fy: 15, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 0.45, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]]]],
    ['path', { d: pot(0.15, 0.85), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: leaf(10.2, 9.2, -58) + leaf(12, 8.2, 0) + leaf(13.8, 9.2, 58), fill: V('c3', '#8B55E0'), ...S, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 8, r: 2.4, fill: V('c2', '#E5530F'), ...S, class: 'wm-a' }],
    ['path', { d: 'M11.3 6.9L12 5.9L12.7 6.9', stroke: INK, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: pot(0, 0), fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: rim, fill: V('c1', '#FF9F2E'), ...S, class: 'wm-k' }],
    ['path', { d: 'M5.4 17.6H18.6', stroke: V('c3', '#8B55E0'), 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: 'M7 15.6C7.6 15 8.3 14.6 9 14.4', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-shine' }],
  ];
}
