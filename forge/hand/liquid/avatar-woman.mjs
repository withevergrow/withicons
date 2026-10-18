// forge/hand/liquid/avatar-woman.mjs: a woman with shoulder-length hair in glass: violet hair falls past a clear oval face to
// the shoulders (centre-parted fringe), two dark eyes and a smile, clear shoulders and an open neck below.
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
const BODY = P('M4.6 22 C4.6 19.6 6.8 18.2 9 18.2 C10 18.2 10.8 18.9 12 18.9 C13.2 18.9 14 18.2 15 18.2 C17.2 18.2 19.4 19.6 19.4 22 Z')
const HAIR = P('M4.2 17.6 C3.5 8.6 6.8 2.8 12 2.8 C17.2 2.8 20.5 8.6 19.8 17.6 C19.7 18.4 19 18.7 18.3 18.6 C16.8 18.5 15.9 17.6 15.4 16.4 L8.6 16.4 C8.1 17.6 7.2 18.5 5.7 18.6 C5 18.7 4.3 18.4 4.2 17.6 Z')
const FACE = E(12, 10.8, 5.3, 5.8)
const FRINGE = P('M6.7 10.6 C6.4 6.2 8.6 4 12 4 C15.4 4 17.6 6.2 17.3 10.6 C15 9.8 12.8 8.8 12 6.9 C11.2 8.8 9 9.8 6.7 10.6 Z')
const SMILE = P('M10.2 13.6 C11.1 14.8 12.9 14.8 13.8 13.6 C12.9 14 11.1 14 10.2 13.6 Z')
export default function render(icon) {
  const k = kit((icon && icon.name) || 'avatar-woman')
  return compose(k, [
    { kind: 'body', s: BODY, cls: 'wm-k', extra: [k.line('M6 20.4 C6.5 19.7 7.4 19.3 8.4 19.2', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: HAIR, cls: 'wm-a', extra: [k.line('M5.4 14 C5.1 9.6 6.6 5.8 9.6 4', 'wm-shine', 0.5, 'shine', 0.85)] },
    { kind: 'body', s: FACE, cls: 'wm-k', extra: [k.line('M7.6 11.6 C7.7 10.4 8.2 9.6 8.8 9.2', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: FRINGE, cls: 'wm-a', nosh: true },
    { kind: 'dark', s: E(9.8, 11.4, 0.75, 0.95), cls: 'wm-a' },
    { kind: 'dark', s: E(14.2, 11.4, 0.75, 0.95), cls: 'wm-a' },
    { kind: 'dark', s: SMILE, cls: 'wm-a' },
  ])
}
