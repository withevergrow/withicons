// Lucky coin: a gold coin with a raised rim, a clear square hole and four rim ticks; no dark fill.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
export default function render() {
  const g = 'wg-halloween-lucky-coin-0';
  const S = { stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round' };
  const disc = 'M12 2.6A9.4 9.4 0 1 1 11.99 2.6ZM9.2 9.2V14.8H14.8V9.2Z';
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 12, cy: 12, r: 12, fx: 8.6, fy: 7.6, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('tint', '#FFF1B8') }], ['stop', { offset: 0.35, 'stop-color': V('accent', '#FFB52E') }], ['stop', { offset: 1, 'stop-color': V('c1', '#FF9F2E') }]]]]],
    ['ellipse', { cx: 12, cy: 22, rx: 6.4, ry: 0.9, fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: disc, fill: `url(#${g})`, 'fill-rule': 'evenodd', ...S, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 7.4, stroke: V('c2', '#E5530F'), 'stroke-width': 0.8, fill: 'none', class: 'wm-deco' }],
    ['path', { d: 'M12 4.8V6.4M12 17.6V19.2M4.8 12H6.4M17.6 12H19.2', stroke: V('c2', '#E5530F'), 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: 'M5.6 8.6C6.2 7 7.4 5.9 8.8 5.2', stroke: V('shine', '#FFF6E2'), 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-shine' }],
  ];
}
