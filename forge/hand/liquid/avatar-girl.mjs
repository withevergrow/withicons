// forge/hand/liquid/avatar-girl.mjs: a girl with pigtails in glass: two violet pigtails with coral ties hang behind a clear
// round face, a violet fringe with a centre peak sits on top, two dark eyes and a smile, small shoulders below.
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
const BODY = P('M6.2 22 C6.2 19.6 8.2 18.4 10.4 18.4 C11.2 18.4 11.6 18.9 12 18.9 C12.4 18.9 12.8 18.4 13.6 18.4 C15.8 18.4 17.8 19.6 17.8 22 Z')
const TAIL_L = 'M7.4 10.6 C4.6 10.8 2.9 13.4 3.1 16.4 C3.2 18 3.7 19.2 4.5 19.9 C5.9 19.1 7.1 17.3 7.9 15 Z'
const FACE = C(12, 11.6, 6)
const FRINGE = P('M5.9 11.4 C5.6 6.8 8.4 4 12 4 C15.6 4 18.4 6.8 18.1 11.4 C17.4 9.4 16 8.2 14.4 7.8 C13.4 7.6 12.6 7.2 12 6.6 C11.4 7.2 10.6 7.6 9.6 7.8 C8 8.2 6.6 9.4 5.9 11.4 Z')
const SMILE = P('M9.8 14.2 C10.8 15.5 13.2 15.5 14.2 14.2 C13.2 14.6 10.8 14.6 9.8 14.2 Z')
export default function render(icon) {
  const k = kit((icon && icon.name) || 'avatar-girl')
  return compose(k, [
    { kind: 'body', s: BODY, cls: 'wm-k', extra: [k.line('M7.6 20.4 C8 19.8 8.8 19.4 9.8 19.3', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: P(TAIL_L), cls: 'wm-a' },
    { kind: 'part', s: P(mirror(TAIL_L)), cls: 'wm-a' },
    { kind: 'body', s: FACE, cls: 'wm-k', extra: [k.line('M7.4 12 C7.6 10.8 8 10 8.6 9.4', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: FRINGE, cls: 'wm-a', extra: [k.line('M7.6 9.4 C8.2 6.8 9.8 5.4 11.4 5', 'wm-shine', 0.5, 'shine', 0.85)] },
    { kind: 'hot', s: C(5.6, 10.6, 1.15), cls: 'wm-s' },
    { kind: 'hot', s: C(18.4, 10.6, 1.15), cls: 'wm-s' },
    { kind: 'dark', s: E(9.9, 12.4, 0.75, 0.95), cls: 'wm-a' },
    { kind: 'dark', s: E(14.1, 12.4, 0.75, 0.95), cls: 'wm-a' },
    { kind: 'dark', s: SMILE, cls: 'wm-a' },
  ])
}
