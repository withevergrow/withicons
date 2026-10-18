// forge/hand/liquid/nutcracker.mjs: a toy soldier head in glass: coral shako with a clear pom, violet brim, clear face with
// two dark eyes, violet moustache and chin beard, violet side curls. Same silhouette as the line icon.
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
const HAT = P('M8 9.2 L7 4.8 C6.9 4.3 7.2 4 7.7 4 H16.3 C16.8 4 17.1 4.3 17 4.8 L16 9.2 Z')
const POM = C(12, 3.2, 1.5)
const BRIM = ['rect', { x: 5.8, y: 8.8, width: 12.4, height: 2.2, rx: 1 }]
const FACE = ['rect', { x: 7, y: 10.8, width: 10, height: 6.8, rx: 2.6 }]
const CURL_L = E(6.4, 14.2, 1.3, 2.4)
const CURL_R = E(17.6, 14.2, 1.3, 2.4)
const BEARD = P('M7.6 16 C7.4 19.4 9.4 21.6 12 21.6 C14.6 21.6 16.6 19.4 16.4 16 C15 17.2 13.4 17.4 12 17.4 C10.6 17.4 9 17.2 7.6 16 Z')
const MOUSTACHE = P('M12 14.9 C11.2 16.4 9 16.8 7.8 15.8 C7.4 15.4 7.6 14.8 8.2 14.7 C9.4 14.5 10.8 14.4 12 14.9 Z M12 14.9 C12.8 16.4 15 16.8 16.2 15.8 C16.6 15.4 16.4 14.8 15.8 14.7 C14.6 14.5 13.2 14.4 12 14.9 Z')
export default function render(icon) {
  const k = kit((icon && icon.name) || 'nutcracker')
  return compose(k, [
    { kind: 'part', s: CURL_L, cls: 'wm-a' },
    { kind: 'part', s: CURL_R, cls: 'wm-a' },
    { kind: 'body', s: FACE, cls: 'wm-k', extra: [k.line('M8.2 13.6 V15.6', 'wm-shine', 0.5, 'shine', 0.8)] },
    { kind: 'part', s: BEARD, cls: 'wm-a' },
    { kind: 'dark', s: MOUSTACHE, cls: 'wm-a', nosh: true },
    { kind: 'hot', s: HAT, cls: 'wm-a', extra: [k.line('M8.6 5.4 L9.2 8', 'wm-shine', 0.5, 'shine', 0.85)] },
    { kind: 'part', s: BRIM, cls: 'wm-a' },
    { kind: 'body', s: POM, cls: 'wm-k' },
    { kind: 'dark', s: C(9.9, 12.7, 0.85), cls: 'wm-a' },
    { kind: 'dark', s: C(14.1, 12.7, 0.85), cls: 'wm-a' },
  ])
}
