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
  const g = 'wg-chrome-cupid-bow-';
  const k = Math.SQRT1_2;
  const R = (x, y) => [18.3 + (x * k - y * k) * 1.15, 5.7 + (x * k + y * k) * 1.15];
  const H = [[0, 2.6], [-1, 1.8], [-3, 0.6], [-3, -1], [-3, -2.4], [-1.8, -3], [-1, -3], [-0.4, -3], [0, -2.5], [0, -2], [0, -2.5], [0.4, -3], [1, -3], [1.8, -3], [3, -2.4], [3, -1], [3, 0.6], [1, 1.8], [0, 2.6]].map(([x, y]) => R(x, y).map(f).join(' '));
  let hd = 'M' + H[0];
  for (let i = 1; i < H.length; i += 3) hd += 'C' + H[i] + ' ' + H[i + 1] + ' ' + H[i + 2];
  const bow = 'M4.2 7.2C9 4.5 15.2 6 16.6 8.4C18.8 10 19.5 15 16.8 19.8';
  const shaft = 'M4.6 19.4L16.5 7.5';
  return [
    ['defs', {}, [grad(g + '0', 4.5, 20), grad(g + '1', 7, 22), grad(g + '2', 1.5, 9.5)]],
    shadow(12, 21.6, 8, 0.7),
    inkLine('M4.2 7.2L16.8 19.8', 0.9),
    ['path', { d: bow, fill: 'none', stroke: V('shadow'), 'stroke-width': '3.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    ['path', { d: bow, fill: 'none', stroke: 'url(#' + g + '0)', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: shaft, fill: 'none', stroke: V('shadow'), 'stroke-width': '2.6', 'stroke-linecap': 'round' }],
    ['path', { d: shaft, fill: 'none', stroke: 'url(#' + g + '1)', 'stroke-width': '1.2', 'stroke-linecap': 'round', class: 'wm-a' }],
    metal('path', { d: 'M5.4 18.6L3.3 16.7L1.9 17.4L3 19.4Z' }, g + '1', 'wm-a'),
    metal('path', { d: 'M5.4 18.6L7.3 20.7L6.6 22.1L4.6 21Z' }, g + '1', 'wm-a'),
    metal('path', { d: hd + 'Z' }, g + '2', 'wm-a'),
    shine(17, 3.6, 0.8, 0.4),
  ];
}
