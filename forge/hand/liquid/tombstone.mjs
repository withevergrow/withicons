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
  const slab = ['path', { d: 'M6 20 L6 9.5 C6 5.6 8.7 3 12 3 C15.3 3 18 5.6 18 9.5 L18 20 Z' }];
  const cross = ['path', { d: 'M11 6.5 L13 6.5 L13 8.8 L15.2 8.8 L15.2 10.8 L13 10.8 L13 15 L11 15 L11 10.8 L8.8 10.8 L8.8 8.8 L11 8.8 Z' }];
  const mound = ['path', { d: 'M2.5 21.5 C2.5 19.4 6.5 18.4 12 18.4 C17.5 18.4 21.5 19.4 21.5 21.5 Z' }];
  return [k.defs, k.shadow(slab), ...k.body(slab), k.line('M7.6 9.2 C7.8 6.6 9.6 4.8 11.6 4.6', 'wm-shine', 0.7, 'shine', 0.85),
    ...k.part(cross), k.line('M11.5 7.2 L11.5 14.3', 'wm-a', 0.4, 'shine', 0.7),
    ...k.tint(mound, 'wm-s')];
}
