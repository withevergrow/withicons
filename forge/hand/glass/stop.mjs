// forge/hand/glass/stop.mjs: a frosted glass stop button, rounded-square pane with a deep etched rounded-square stop mark.
const f = (n) => (Math.round(n * 100) / 100).toString();
const V = (r, h) => `var(--with-glass-${r}, ${h})`;
// shapes: array of (dx, dy) => d. Returns [defs, shadow, body, glow, frost pane, shine] nodes.
function glass(name, shapes, shine, box, kclass = 'wm-k') {
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
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: kclass }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(1)})`, 'fill-rule': 'evenodd', class: kclass }]);
  for (const s of shapes) out.push(['path', { d: s(0, 0), fill: `url(#${id(2)})`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', 'fill-rule': 'evenodd', class: kclass }]);
  if (shine) out.push(['path', { d: shine, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.85', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
const etchLine = (d, w, op, cls) => ['path', { d, fill: 'none', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': String(op), 'stroke-width': String(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }];
const rr = (x, y, w, h, r) => (dx, dy) => { const X = x + dx, Y = y + dy; return `M${f(X + r)} ${f(Y)}H${f(X + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w)} ${f(Y + r)}V${f(Y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w - r)} ${f(Y + h)}H${f(X + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X)} ${f(Y + h - r)}V${f(Y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + r)} ${f(Y)}Z`; };
export default function render() {
  return [...glass('stop', [rr(3.6, 3.6, 16.8, 16.8, 4.4)], 'M5.6 9.2C5.6 7 7 5.6 9.2 5.6', [3.6, 3.6, 20.4, 20.4]),
    ['path', { d: rr(8, 8, 8, 8, 1.8)(0, 0), fill: V('etch', '#3E3A8C'), 'fill-opacity': '0.7', class: 'wm-s' }],
    ['path', { d: 'M8.9 9.8C8.9 9.3 9.3 8.9 9.8 8.9', fill: 'none', stroke: V('frost', '#FFFFFF'), 'stroke-opacity': '0.5', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-s' }]];
}
