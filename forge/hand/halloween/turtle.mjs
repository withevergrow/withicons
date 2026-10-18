const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const g = (n) => `url(#wg-halloween-turtle-${n})`;
const K = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' };
const SHELL = 'M3.5 15.5C3.5 10.2 6.8 7 11 7S18.5 10.2 18.5 15.5Z';
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: 'wg-halloween-turtle-0', cx: 10, cy: 13, r: 10, fx: 8, fy: 9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 0.45, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]],
      ['radialGradient', { id: 'wg-halloween-turtle-1', cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0.16 }], ['stop', { offset: 1, 'stop-color': V('accent', '#FFB52E'), 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: g(1), class: 'wm-deco' }],
    ['path', { d: 'M3.65 16.35C3.65 11.05 6.95 7.85 11.15 7.85S18.65 11.05 18.65 16.35Z', fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M2.6 14.6L1.4 15.6', stroke: INK, 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M17 12.2C17.6 10.4 18.8 9.5 20.4 9.5C21.7 9.5 22.6 10.5 22.6 11.8C22.6 13.2 21.6 14 20.2 14H17.5Z', fill: V('c4', '#86D13A'), ...K, class: 'wm-k' }],
    ['circle', { cx: 20.6, cy: 11.4, r: 0.65, fill: INK, class: 'wm-k' }],
    ['path', { d: 'M2.5 15.5H19.5A1 1 0 0 1 19.5 17.5H2.5A1 1 0 0 1 2.5 15.5Z', fill: V('c3', '#8B55E0'), ...K, class: 'wm-k' }],
    ['rect', { x: 4.5, y: 16, width: 3, height: 4, rx: 1.4, fill: V('c4', '#86D13A'), ...K, class: 'wm-a' }],
    ['rect', { x: 14.5, y: 16, width: 3, height: 4, rx: 1.4, fill: V('c4', '#86D13A'), ...K, class: 'wm-a' }],
    ['path', { d: SHELL, fill: g(0), ...K, class: 'wm-k' }],
    ['path', { d: 'M9 10.6H13L14.2 12.9L13 15.4H9L7.8 12.9ZM9 10.6L7.6 8.4M13 10.6L14.4 8.4M7.8 12.9H4.2M14.2 12.9H17.8', stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', fill: V('accent', '#FFB52E'), class: 'wm-deco' }],
    ['path', { d: 'M6.2 11C7 9.4 8.3 8.4 9.8 8.1', stroke: V('shine', '#FFF6E2'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
