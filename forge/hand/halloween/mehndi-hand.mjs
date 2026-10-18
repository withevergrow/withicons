const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
// open palm: thumb out left, four separated fingers
const hand = (x, y) => {
  const p = (a, b) => `${n(a + x)} ${n(b + y)}`;
  const A = 'A1.2 1.2 0 0 1';
  return `M${p(7, 21.8)}L${p(6.4, 16.2)}L${p(3.3, 12.6)}${A} ${p(5.1, 11)}L${p(7.2, 13)}`
    + `L${p(7.2, 5.6)}${A} ${p(9.6, 5.6)}L${p(9.6, 11)}`
    + `L${p(10, 11)}L${p(10, 3.6)}${A} ${p(12.4, 3.6)}L${p(12.4, 11)}`
    + `L${p(12.8, 11)}L${p(12.8, 4.4)}${A} ${p(15.2, 4.4)}L${p(15.2, 11.4)}`
    + `L${p(15.6, 11.4)}L${p(15.6, 6.6)}${A} ${p(18, 6.6)}L${p(18, 15.8)}`
    + `C${p(18, 18.4)} ${p(17.2, 20)} ${p(16, 21.8)}Z`;
};
export default function render() {
  const g = 'wg-halloween-mehndi-hand-0';
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 11, cy: 12, r: 11, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('c3', '#8B55E0') }], ['stop', { offset: 1, 'stop-color': V('edge', '#7344C9') }]]]]],
    ['path', { d: hand(0.15, 0.85), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: hand(0, 0), fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12.6 13.4C13.4 12.4 14.6 13 14 14.2C15.2 14.2 15.2 15.8 14 15.8C14.6 17 13.4 17.6 12.6 16.6C11.8 17.6 10.6 17 11.2 15.8C10 15.8 10 14.2 11.2 14.2C10.6 13 11.8 12.4 12.6 13.4Z', fill: V('c1', '#FF9F2E'), stroke: INK, 'stroke-width': 0.55, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: 12.6, cy: 15, r: 0.6, fill: V('tint', '#FFF1B8'), class: 'wm-a' }],
    ['path', { d: 'M8 6V9M10.8 4.2V7', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.6, class: 'wm-shine' }],
  ];
}
