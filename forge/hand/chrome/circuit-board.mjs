const HEX = { edge: '#F4F7FC', tint: '#DCE5F2', c1: '#8794AA', c3: '#3E4556', c4: '#CDB9A4', shine: '#FFFFFF', shadow: '#1A1E2A', ink: '#10131B' };
const V = (r) => `var(--with-chrome-${r}, ${HEX[r]})`;
const f = (n) => String(Math.round(n * 100) / 100);
function grad(id, y1, y2) {
  const st = [[0, 'edge'], [0.42, 'tint'], [0.56, 'c1'], [0.78, 'c4'], [1, 'edge']];
  return ['linearGradient', { id, x1: '0', y1: f(y1), x2: '0', y2: f(y2), gradientUnits: 'userSpaceOnUse' },
    st.map(([o, r]) => ['stop', { offset: String(o), 'stop-color': V(r) }])];
}
const OUT = { stroke: V('shadow'), 'stroke-width': '1', 'stroke-linejoin': 'round' };
const metal = (tag, a, g, cls = 'wm-k') => [tag, { ...a, fill: `url(#${g})`, ...OUT, class: cls }];
const ink = (tag, a) => [tag, { ...a, fill: V('ink') }];
const inkLine = (d, w = 0.9) => ['path', { d, fill: 'none', stroke: V('ink'), 'stroke-width': f(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }];
const shine = (cx, cy, rx, ry) => ['ellipse', { cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), fill: V('shine'), 'fill-opacity': '0.75', class: 'wm-shine' }];
const shadow = (cx, cy, rx, ry) => ['ellipse', { cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), fill: V('shadow'), 'fill-opacity': '0.2', class: 'wm-shadow' }];
export default function render() {
  const g = 'wg-chrome-circuit-board-';
  return [
    ['defs', {}, [grad(g + '0', 3, 21)]],
    shadow(12, 21.3, 8.5, 0.9),
    metal('rect', { x: '3', y: '3', width: '18', height: '18', rx: '3' }, g + '0'),
    inkLine('M7.5 7.5V12H12V16.5', 1.8),
    inkLine('M16.5 7.5V12.8L12 16.5', 1.8),
    inkLine('M16.5 12.8H20.5', 1.8),
    ink('circle', { cx: '7.5', cy: '7.5', r: '2.2' }),
    ink('circle', { cx: '16.5', cy: '7.5', r: '2.2' }),
    ['circle', { cx: '12', cy: '16.5', r: '2.2', fill: V('ink'), class: 'wm-a' }],
    ['circle', { cx: '7.5', cy: '7.5', r: '0.9', fill: V('tint') }],
    ['circle', { cx: '16.5', cy: '7.5', r: '0.9', fill: V('tint') }],
    ['circle', { cx: '12', cy: '16.5', r: '0.9', fill: V('tint') }],
    shine(6, 4.6, 2, 0.5),
  ];
}
