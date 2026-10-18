const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const g = (n) => `url(#wg-halloween-truck-${n})`;
const K = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' };
const BOX = 'M3.5 4.5H13.5A1 1 0 0 1 14.5 5.5V16.5H3.5A1 1 0 0 1 2.5 15.5V5.5A1 1 0 0 1 3.5 4.5Z';
const CAB = 'M15.5 8.5H18.6A1 1 0 0 1 19.4 8.9L21.3 11.6A1 1 0 0 1 21.5 12.2V15.5A1 1 0 0 1 20.5 16.5H15.5Z';
const WIN = 'M16.6 9.8H18.3L19.8 12.1H16.6Z';
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: 'wg-halloween-truck-0', cx: 9, cy: 12, r: 13, fx: 6, fy: 7, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 0.45, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]],
      ['radialGradient', { id: 'wg-halloween-truck-1', cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0.16 }], ['stop', { offset: 1, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: g(1), class: 'wm-deco' }],
    ['path', { d: 'M3.65 5.35H13.65A1 1 0 0 1 14.65 6.35V17.35H3.65A1 1 0 0 1 2.65 16.35V6.35A1 1 0 0 1 3.65 5.35ZM15.65 9.35H18.75L21.65 13.05V16.35A1 1 0 0 1 20.65 17.35H15.65Z', fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BOX, fill: g(0), ...K, class: 'wm-k' }],
    ['path', { d: CAB, fill: g(0), ...K, class: 'wm-k' }],
    ['path', { d: WIN, fill: V('c3', '#8B55E0'), ...K, class: 'wm-k' }],
    ['path', { d: 'M4 6.2H12.6', stroke: V('shine', '#FFF6E2'), 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M5.5 10.5H11.5', stroke: V('c2', '#E5530F'), 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['circle', { cx: 6.5, cy: 17.5, r: 2.3, fill: V('c3', '#8B55E0'), ...K, class: 'wm-a' }],
    ['circle', { cx: 17.5, cy: 17.5, r: 2.3, fill: V('c3', '#8B55E0'), ...K, class: 'wm-a' }],
    ['circle', { cx: 6.5, cy: 17.5, r: 0.8, fill: V('tint', '#FFF1B8'), class: 'wm-shine' }],
    ['circle', { cx: 17.5, cy: 17.5, r: 0.8, fill: V('tint', '#FFF1B8'), class: 'wm-shine' }],
  ];
}
