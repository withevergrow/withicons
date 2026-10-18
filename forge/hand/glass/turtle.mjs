// forge/hand/glass/turtle.mjs — a frosted glass turtle: domed shell with hex plates, separate head with eye, two feet.
const f = (n) => (Math.round(n * 100) / 100).toString();
const V = (r, h) => `var(--with-glass-${r}, ${h})`;
// shapes: array of (dx, dy) => d ; etch: array of [d, attrs]; shine: d
function glass(name, shapes, etch, shine, box) {
  const [x1, y1, x2, y2] = box;
  const id = (n) => `wg-glass-${name}-${n}`;
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: f(x1 + 1.5), y1: f(y1 + 1.5), x2: f(x2 + 1.5), y2: f(y2 + 1.5), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }],
      ['stop', { offset: '1', 'stop-color': V('shadow', '#6A45D6') }]]],
    ['radialGradient', { id: id(1), cx: f(x2 - 3), cy: f(y2 - 3), r: '8', gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.5', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.22' }],
      ['stop', { offset: '1', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0' }]]],
    ['linearGradient', { id: id(2), x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }],
      ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
  ]];
  const out = [defs];
  for (const s of shapes) out.push(['path', { d: s(1.2, 1.4), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.1', 'fill-rule': 'evenodd', class: 'wm-shadow' }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(1)})`, 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const s of shapes) out.push(['path', { d: s(0, 0), fill: `url(#${id(2)})`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const [d, a] of etch) out.push(['path', { d, fill: 'none', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.62', 'stroke-width': '0.9', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a }]);
  if (shine) out.push(['path', { d: shine, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.85', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
// helpers
const rr = (x, y, w, h, r) => (dx, dy) => { x += 0; const X = x + dx, Y = y + dy; return `M${f(X + r)} ${f(Y)}H${f(X + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w)} ${f(Y + r)}V${f(Y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w - r)} ${f(Y + h)}H${f(X + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X)} ${f(Y + h - r)}V${f(Y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + r)} ${f(Y)}Z`; };
const ci = (cx, cy, r) => (dx, dy) => `M${f(cx + dx - r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx + r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx - r)} ${f(cy + dy)}Z`;
const P = (s) => (dx, dy) => s.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, a, b) => `${f(+a + dx)} ${f(+b + dy)}`)
export default function render() {
  return [...glass('turtle', [
    rr(4.4, 13.2, 3.2, 5, 1.4), rr(13, 13.2, 3.2, 5, 1.4), ci(19.6, 11.6, 2.4),
    P('M2.6 15.2C2.6 9.6 6.2 5.6 10.4 5.6C14.6 5.6 18.2 9.6 18.2 15.2Z'),
  ], [
    ['M7 15V11.4L10.4 9.4L13.8 11.4V15'],
    ['M10.4 5.9V9.4'],
    ['M3.2 15.2H17.6'],
  ], 'M5 11.2C5.8 8.8 7.6 7.2 9.4 6.7', [2.6, 5.6, 22, 18.2]),
  ['circle', { cx: '20.1', cy: '11', r: '0.75', fill: V('etch', '#3E3A8C'), class: 'wm-a' }]]
}
