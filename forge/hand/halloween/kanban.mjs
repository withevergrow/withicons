const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const board = (x, y) => `M${x + 4.5} ${y + 2.5}H${x + 19.5}A2.5 2.5 0 0 1 ${x + 22} ${y + 5}V${y + 19}A2.5 2.5 0 0 1 ${x + 19.5} ${y + 21.5}H${x + 4.5}A2.5 2.5 0 0 1 ${x + 2} ${y + 19}V${y + 5}A2.5 2.5 0 0 1 ${x + 4.5} ${y + 2.5}Z`;
export default function render() {
  const g = 'wg-halloween-kanban-0';
  const card = (x, h, fill) => ['rect', { x, y: 5.5, width: 4, height: h, rx: 1.2, fill, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }];
  return [
    ['defs', {}, [['linearGradient', { id: g, x1: 12, y1: 2.5, x2: 12, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('shine', '#FFF6E2') }], ['stop', { offset: 1, 'stop-color': V('tint', '#FFF1B8') }]]]]],
    ['path', { d: board(0.15, 0.85), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: board(0, 0), fill: `url(#${g})`, stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: 'wm-k' }],
    card(5, 13, V('c1', '#FF9F2E')),
    card(10, 9, V('c3', '#8B55E0')),
    card(15, 5.5, V('c2', '#E5530F')),
    ['path', { d: 'M6.1 6.8V10M11.1 6.8V8.6M16.1 6.8V7.8', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ];
}
