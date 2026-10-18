// Kite: a bold four-panel diamond kite with a light two-layer string tail and two chunky green bow-ties that stay readable on dark.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const bow = (x, y) => `M${x} ${y}L${x - 2.3} ${y - 1.3}V${y + 1.3}ZM${x} ${y}L${x + 2.3} ${y - 1.3}V${y + 1.3}Z`;
const tri = (a, b, c) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}Z`;
export default function render() {
  const g = 'wg-halloween-kite-0';
  const S = { stroke: INK, 'stroke-width': 1, 'stroke-linejoin': 'round' };
  const T = [12, 1.2], R = [20, 8], B = [12, 16.2], L = [4, 8], C = [12, 8];
  const tail = 'M12 16.2C10.4 17.4 13.6 18.6 12 19.8C10.6 21 12.6 22.2 12.2 23';
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 12, cy: 8.5, r: 9.5, fx: 9.5, fy: 5, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 0.45, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]]]],
    ['path', { d: tri(T, R, B) + tri(T, B, L), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: tail, stroke: INK, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-s' }],
    ['path', { d: tail, stroke: V('tint', '#FFF1B8'), 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-s' }],
    ['path', { d: bow(12.1, 18.3) + bow(12.2, 21.4), fill: V('c4', '#86D13A'), stroke: INK, 'stroke-width': 0.65, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: tri(T, C, L), fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: tri(T, R, C), fill: V('c3', '#8B55E0'), ...S, class: 'wm-k' }],
    ['path', { d: tri(B, L, C), fill: V('c3', '#8B55E0'), ...S, class: 'wm-k' }],
    ['path', { d: tri(B, C, R), fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: 'M8 6.6C8.6 5.2 9.6 4 10.6 3.3', stroke: V('shine', '#FFF6E2'), 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, fill: 'none', class: 'wm-shine' }],
  ];
}
