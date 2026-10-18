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
  const tank = ['rect', { x: 4.2, y: 2.6, width: 6.6, height: 8.6, rx: 1.6 }];
  const bowl = ['path', { d: 'M3 11.4 L21 11.4 C21 15 18.4 17.4 14.4 17.8 L15 19.6 C15.2 20.5 14.8 21.2 13.8 21.2 L8.4 21.2 C7.4 21.2 7 20.5 7.2 19.6 L7.8 17 C4.9 15.9 3 14 3 11.4 Z' }];
  const seat = ['rect', { x: 2.6, y: 10.2, width: 18.8, height: 2.4, rx: 1.2 }];
  return [k.defs, k.shadow(bowl), k.shadow(tank), ...k.body(tank), ...k.body(bowl),
    k.line('M5.8 4.4 L5.8 9.2', 'wm-shine', 0.6, 'shine', 0.8),
    k.line('M5.2 13.8 C6 15.2 7.4 16 9 16.4', 'wm-shine', 0.5, 'shine', 0.8),
    ['rect', { x: 6.2, y: 4.2, width: 2.8, height: 1.1, rx: 0.55, fill: k.V('c3'), 'fill-opacity': 0.7, class: 'wm-deco' }],
    ...k.tint(seat)];
}
