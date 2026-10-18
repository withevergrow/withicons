// chrome git-commit: a thick chrome ring node with a dark hollow centre and two stubs of the same weight entering left and right.
const V = (r, h) => `var(--with-chrome-${r}, ${h})`;
const SH = V('shadow', '#1A1E2A'), INK = V('ink', '#10131B'), SHINE = V('shine', '#FFFFFF');
const f = (n) => Math.round(n * 100) / 100;
const st = (o, r, h) => ['stop', { offset: String(o), 'stop-color': V(r, h) }];
const lin = (id, stops) => ['linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' }, stops];
function grads(name) {
  const g = (n) => `wg-chrome-${name}-${n}`;
  return ['defs', {}, [
    lin(g(0), [st(0, 'edge', '#F4F7FC'), st(0.42, 'tint', '#DCE5F2'), st(0.56, 'c1', '#8794AA'), st(0.78, 'c4', '#CDB9A4'), st(1, 'edge', '#F4F7FC')]),
    lin(g(1), [st(0, 'shine', '#FFFFFF'), st(0.24, 'tint', '#DCE5F2'), st(0.5, 'c1', '#8794AA'), st(1, 'c4', '#CDB9A4')]),
    lin(g(2), [st(0, 'c3', '#3E4556'), st(0.5, 'c4', '#CDB9A4'), st(1, 'shine', '#FFFFFF')]),
    lin(g(3), [st(0, 'shine', '#FFFFFF'), st(0.38, 'accent', '#FF3E9E'), st(1, 'accent', '#FF3E9E')]),
  ]];
}
// chrome rounded rect: dark rim, mirror body, inner sky, ground below an ink horizon, top glint
function rr(name, x, y, w, h, r, cls, hz = 0.56) {
  const u = (n) => `url(#wg-chrome-${name}-${n})`, c = cls ? { class: cls } : {};
  const R = (X, Y, W, H, Rr, fill) => ['rect', { x: f(X), y: f(Y), width: f(W), height: f(H), rx: f(Math.max(Rr, 0)), fill, ...c }];
  const yh = y + h * hz, ir = Math.max(r - 0.35, 0.2), gh = y + h - 0.35 - yh, k = Math.min(ir, 0.6);
  return [
    R(x - 0.45, y - 0.45, w + 0.9, h + 0.9, r + 0.45, SH),
    R(x, y, w, h, r, u(0)),
    R(x + 0.35, y + 0.35, w - 0.7, h - 0.7, ir, u(1)),
    R(x + 0.35, yh, w - 0.7, gh, Math.min(ir, gh / 2), u(2)),
    R(x + 0.35 + k, yh - 0.2, w - 0.7 - 2 * k, 0.4, 0.2, INK),
    ['rect', { x: f(x + Math.max(r * 0.6, 0.6)), y: f(y + 0.55), width: f(Math.max(w * 0.42, 0.5)), height: 0.5, rx: 0.25, fill: SHINE, 'fill-opacity': '0.85', class: 'wm-shine' }],
  ];
}

export default function render() {
  const N = 'git-commit', u = (n) => `url(#wg-chrome-${N}-${n})`;
  return [
    grads(N),
    ['ellipse', { cx: 12, cy: 18.6, rx: 7, ry: 0.9, fill: SH, 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ...rr(N, 1.5, 10.9, 6, 2.2, 1.1, 'wm-k', 0.55),
    ...rr(N, 16.5, 10.9, 6, 2.2, 1.1, 'wm-k', 0.55),
    ['circle', { cx: 12, cy: 12, r: 5.75, fill: SH, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 5.3, fill: u(0), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 4.95, fill: u(1), class: 'wm-k' }],
    ['path', { d: 'M7.1 12.6A4.95 4.95 0 0 0 16.9 12.6Z', fill: u(2), class: 'wm-k' }],
    ['rect', { x: 7.1, y: 12.4, width: 9.8, height: 0.4, rx: 0.2, fill: INK, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 2.7, fill: SH, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 2.25, fill: INK, class: 'wm-k' }],
    ['path', { d: 'M8.6 9.2A4.4 4.4 0 0 1 12.6 7.6', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.9', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
