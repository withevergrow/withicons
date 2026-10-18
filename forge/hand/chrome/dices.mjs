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
function rsq(cx, cy, h, r, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const P = (x, y) => [cx + x * c - y * s, cy + x * s + y * c];
  const pts = [[-h, -h], [h, -h], [h, h], [-h, h]];
  let d = '';
  pts.forEach(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % 4];
    const ux = Math.sign(nx - x), uy = Math.sign(ny - y);
    const a1 = P(x + ux * r, y + uy * r), a2 = P(nx - ux * r, ny - uy * r);
    const [qx, qy] = pts[(i + 2) % 4];
    const vx = Math.sign(qx - nx), vy = Math.sign(qy - ny);
    const cc = P(nx, ny), b = P(nx + vx * r, ny + vy * r);
    d += (i ? 'L' : 'M') + f(a1[0]) + ' ' + f(a1[1]) + 'L' + f(a2[0]) + ' ' + f(a2[1]) + 'Q' + f(cc[0]) + ' ' + f(cc[1]) + ' ' + f(b[0]) + ' ' + f(b[1]);
  });
  return { d: d + 'Z', P };
}
export default function render() {
  const g = 'wg-chrome-dices-';
  const back = rsq(15.6, 8.4, 5, 1.8, 0.26);
  const p1 = back.P(-2.3, -2.3), p2 = back.P(2.3, 2.3);
  const pip = (x, y) => ink('circle', { cx: f(x), cy: f(y), r: '1.15' });
  return [
    ['defs', {}, [grad(g + '0', 3, 14), grad(g + '1', 9, 21)]],
    shadow(12, 21.4, 8.5, 0.9),
    metal('path', { d: back.d }, g + '0'),
    pip(p1[0], p1[1]), pip(p2[0], p2[1]),
    ['rect', { x: '2.5', y: '9', width: '11.5', height: '11.5', rx: '2.4', fill: V('shadow'), 'fill-opacity': '0.35' }],
    metal('rect', { x: '3', y: '9.5', width: '10.5', height: '10.5', rx: '2.2' }, g + '1'),
    pip(5.8, 12.3), pip(10.7, 12.3), pip(8.25, 14.75), pip(5.8, 17.2), pip(10.7, 17.2),
    shine(6, 10.6, 1.6, 0.4),
  ];
}
