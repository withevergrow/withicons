const HEX = { c1: '#4A9DFF', c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1', shine: '#FFFFFF', shadow: '#0C1A3A', edge: '#B9E6FF' };
const V = (r) => `var(--with-liquid-${r}, ${HEX[r]})`;
const r2 = (n) => String(Math.round(n * 100) / 100);
const shiftD = (d, dx, dy) => { let i = 0; return d.replace(/-?\d*\.?\d+/g, (m) => r2(+m + (i++ % 2 ? dy : dx))); };
function shift([tag, a], dx, dy) {
  const o = { ...a };
  if (o.d) o.d = shiftD(o.d, dx, dy);
  for (const k of ['x', 'cx']) if (k in o) o[k] = r2(+o[k] + dx);
  for (const k of ['y', 'cy']) if (k in o) o[k] = r2(+o[k] + dy);
  return [tag, o];
}
function kit(name) {
  const id = (n) => `wg-liquid-${name}-${n}`;
  const lin = (n, stops, x1 = 2, y1 = 2, x2 = 22, y2 = 22) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': V(c) } : { offset: o, 'stop-color': V(c), 'stop-opacity': op }])];
  const defs = ['defs', {}, [
    lin(0, [[0, 'c1', 0.14], [0.6, 'c1', 0.36], [1, 'c1', 0.62]]),
    lin(1, [[0, 'c2', 0.3], [1, 'c2', 0.75]]),
    lin(2, [[0, 'c3', 0.36], [1, 'c3', 0.95]]),
    lin(3, [[0, 'shine'], [1, 'shine', 0.15]], 6, 6),
    ['radialGradient', { id: id(4), cx: 9, cy: 8, r: 10, gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: 0, 'stop-color': V('shine'), 'stop-opacity': 0.8 }], ['stop', { offset: 1, 'stop-color': V('shine'), 'stop-opacity': 0 }]]],
    lin(5, [[0, 'shadow', 0.1], [1, 'c4', 0.32]], 2, 10, 8, 22),
  ]];
  const u = (n) => `url(#${id(n)})`;
  const glass = (s, cls, fill) => {
    const [t, a] = s;
    return [
      [t, { ...a, fill, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: cls }],
      [t, { ...a, fill: 'none', stroke: u(2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: cls }],
      [t, { ...a, fill: u(4), class: cls === 'wm-k' ? 'wm-shine' : cls }],
    ];
  };
  return {
    defs, u, V,
    shadow: (s) => { const [t, a] = shift(s, 0.5, 0.8); return [t, { ...a, fill: u(5), class: 'wm-shadow' }]; },
    body: (s, cls = 'wm-k') => glass(s, cls, u(0)),
    part: (s, cls = 'wm-a') => glass(s, cls, u(1)),
    tint: (s, cls = 'wm-a') => glass(s, cls, V('c4')),
    line: (d, cls, w = 0.5, c = 'edge', op = 0.9) => ['path', { d, fill: 'none', stroke: V(c), 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }],
  };
}

export default function render(icon) {
  const k = kit(icon.name);
  const track = ['rect', { x: 2, y: 6.5, width: 20, height: 11, rx: 5.5 }];
  const knob = ['circle', { cx: 16.5, cy: 12, r: 4.2 }];
  return [k.defs, k.shadow(track), ...k.body(track), k.line('M6 8.2 L14 8.2', 'wm-shine', 0.6, 'shine', 0.85),
    k.shadow(knob), ['circle', { cx: 16.5, cy: 12, r: 4.2, fill: k.V('shine'), 'fill-opacity': 0.95, stroke: k.u(2), 'stroke-width': 0.6, class: 'wm-a' }],
    ['circle', { cx: 16.5, cy: 12, r: 3.1, fill: k.u(1), 'fill-opacity': 0.55, class: 'wm-a' }],
    ['circle', { cx: 15.3, cy: 10.6, r: 1.1, fill: k.V('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }]];
}
