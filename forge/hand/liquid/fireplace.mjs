// forge/hand/liquid/fireplace.mjs: a hearth in glass: a violet mantel slab on a clear surround, a deep arched opening with a
// bright coral flame (white core), and a violet hearth base. No bricks, so it holds at 16px.
const HEX = { c1: '#4A9DFF', c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1', accent: '#FF5F8F', shine: '#FFFFFF', shadow: '#0C1A3A', edge: '#B9E6FF' }
const V = r => `var(--with-liquid-${r}, ${HEX[r]})`
const r2 = n => String(Math.round(n * 100) / 100)
const shiftD = (d, dx, dy) => { let i = 0; return d.replace(/-?\d*\.?\d+/g, m => r2(+m + (i++ % 2 ? dy : dx))) }
function shift([tag, a], dx, dy) {
  const o = { ...a }
  if (o.d) o.d = shiftD(o.d, dx, dy)
  for (const k of ['x', 'cx']) if (k in o) o[k] = +r2(+o[k] + dx)
  for (const k of ['y', 'cy']) if (k in o) o[k] = +r2(+o[k] + dy)
  return [tag, o]
}
// glass kit: gradients 0 clear, 1 violet, 2 refraction, 3 rim, 4 lens, 5 ground, 6 accent
function kit(name) {
  const id = n => `wg-liquid-${name}-${n}`
  const lin = (n, stops, x1 = 2, y1 = 2, x2 = 22, y2 = 22) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': V(c) } : { offset: o, 'stop-color': V(c), 'stop-opacity': op }])]
  const defs = ['defs', {}, [
    lin(0, [[0, 'c1', 0.14], [0.6, 'c1', 0.36], [1, 'c1', 0.62]]),
    lin(1, [[0, 'c2', 0.3], [1, 'c2', 0.75]]),
    lin(2, [[0, 'c3', 0.36], [1, 'c3', 0.95]]),
    lin(3, [[0, 'shine'], [1, 'shine', 0.15]], 6, 6),
    ['radialGradient', { id: id(4), cx: 9, cy: 8, r: 10, gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: 0, 'stop-color': V('shine'), 'stop-opacity': 0.8 }], ['stop', { offset: 1, 'stop-color': V('shine'), 'stop-opacity': 0 }]]],
    lin(5, [[0, 'shadow', 0.1], [1, 'c4', 0.32]], 2, 10, 8, 22),
    lin(6, [[0, 'accent', 0.7], [1, 'accent', 1]]),
  ]]
  const u = n => `url(#${id(n)})`
  const glass = (s, cls, fill) => {
    const [t, a] = s
    return [
      [t, { ...a, fill, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: cls }],
      [t, { ...a, fill: 'none', stroke: u(2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: cls }],
      [t, { ...a, fill: u(4), class: cls === 'wm-k' ? 'wm-shine' : cls }],
    ]
  }
  return {
    defs, u,
    shadow: s => { const [t, a] = shift(s, 0.5, 0.8); return [t, { ...a, fill: u(5), class: 'wm-shadow' }] },
    body: (s, cls = 'wm-k') => glass(s, cls, u(0)),
    part: (s, cls = 'wm-a') => glass(s, cls, u(1)),
    hot: (s, cls = 'wm-a') => glass(s, cls, u(6)),
    dark: (s, cls = 'wm-a', op = 0.9) => [[s[0], { ...s[1], fill: V('c3'), 'fill-opacity': op, class: cls }]],
    line: (d, cls = 'wm-shine', w = 0.5, c = 'edge', op = 0.9) => ['path', { d, fill: 'none', stroke: V(c), 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }],
    stroke: (d, cls, w, c, op = 0.8) => ['path', { d, fill: 'none', stroke: V(c), 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }],
  }
}
const P = d => ['path', { d }]
const C = (cx, cy, r) => ['circle', { cx: r2(cx), cy: r2(cy), r: r }]
const E = (cx, cy, rx, ry) => ['ellipse', { cx: r2(cx), cy: r2(cy), rx, ry }]
// mirror an absolute-coordinate path (M L C Z only) about x = 12
const mirror = d => { let i = 0; return d.replace(/-?\d*\.?\d+/g, m => r2(i++ % 2 ? +m : 24 - +m)) }
function compose(k, items) {
  const out = [k.defs]
  for (const it of items) if (!it.nosh && it.kind !== 'dark' && it.kind !== 'raw') out.push(k.shadow(it.s))
  for (const it of items) {
    if (it.kind === 'raw') { out.push(...it.n); continue }
    out.push(...k[it.kind](it.s, it.cls))
    for (const e of it.extra || []) out.push(e)
  }
  return out
}
const MANTEL = ['rect', { x: 2.6, y: 3.4, width: 18.8, height: 3.2, rx: 1.4 }]
const SURROUND = ['rect', { x: 4.4, y: 6.4, width: 15.2, height: 13.6, rx: 0.8 }]
const BASE = ['rect', { x: 2.4, y: 19.4, width: 19.2, height: 2.8, rx: 1.2 }]
const OPEN = P('M7.6 19.4 V13.4 C7.6 9.4 16.4 9.4 16.4 13.4 V19.4 Z')
const FLAME = P('M12 10.8 C13.6 12.6 15.4 14.2 15.4 16.6 C15.4 18.4 13.9 19.4 12 19.4 C10.1 19.4 8.6 18.4 8.6 16.6 C8.6 15.2 9.4 14.2 10.4 13.2 C10.5 14.3 11 14.9 11.7 15.1 C11.4 13.6 11.5 12.2 12 10.8 Z')
const CORE = P('M12 14.6 C13 15.6 13.6 16.4 13.6 17.3 C13.6 18.1 12.9 18.6 12 18.6 C11.1 18.6 10.4 18.1 10.4 17.3 C10.4 16.5 11 15.7 12 14.6 Z')
export default function render(icon) {
  const k = kit((icon && icon.name) || 'fireplace')
  return compose(k, [
    { kind: 'body', s: SURROUND, cls: 'wm-k', extra: [k.line('M5.4 8 V18.6', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'dark', s: OPEN, cls: 'wm-k' },
    { kind: 'part', s: BASE, cls: 'wm-k', extra: [k.line('M3.4 20.2 H12', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: MANTEL, cls: 'wm-a', extra: [k.line('M3.8 4.5 H14', 'wm-shine', 0.5, 'shine', 0.85)] },
    { kind: 'hot', s: FLAME, cls: 'wm-a', nosh: true },
    { kind: 'raw', n: [['path', { d: CORE[1].d, fill: V('shine'), 'fill-opacity': 0.9, class: 'wm-a' }]] },
  ])
}
