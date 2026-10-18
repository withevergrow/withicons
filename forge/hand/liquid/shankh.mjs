// forge/hand/liquid/shankh.mjs: a conch in glass, drawn on the diagonal. A stepped spire tapers to a tip at top-left,
// a fat body whorl swells to the lower right and ends in an open pink mouth with a dark throat. Violet whorl bands
// (wm-a) wrap the body and two ridge lines cross the spire, so it reads as a spiral shell and not a blob.
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
    lin(0, [[0, 'c1', 0.3], [0.55, 'c1', 0.55], [1, 'c3', 0.85]]),
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
const BODY = 'M2.6 2.6 C4.4 2.4 5.8 3 6.2 4.4 C7.6 4.2 8.6 4.8 8.8 6 C11.8 5 15.4 5.8 18 8.8 C20.6 11.8 21.4 14.4 20.6 16.6 C19.6 19 17.6 20.8 15 21.4 C11.4 22 7.2 19 6 14.6 C5.8 13.2 5.2 12 4.6 11 C3.8 9.8 4.8 8.8 4.6 7.6 C4.4 6.4 3 5.2 2.6 2.6 Z'
const MOUTH = 'M15 21.4 C13.6 18.4 15.2 14.6 20 13.2 C21.6 14.4 21.6 16.2 20.6 16.6 C19.6 19 17.6 20.8 15 21.4 Z'
const THROAT = 'M16.2 20 C15.8 18 17 16 19.6 14.8 C20.2 15.8 19.8 17 19.2 17.8 C18.6 18.8 17.6 19.6 16.2 20 Z'
const BAND1 = 'M8.8 6 C10 8.2 9.2 11.4 6.8 13.2'
const BAND2 = 'M12.6 5.8 C14.6 8.2 14 12.2 10.4 16.4'
const BAND3 = 'M16.8 7.8 C18.4 10.4 17.4 14.4 14.2 18'
export default function render(icon) {
  const k = kit((icon && icon.name) || 'shankh')
  const out = [k.defs, k.shadow(P(BODY))]
  out.push(...k.body(P(BODY), 'wm-k'))
  out.push(k.stroke(BAND1, 'wm-a', 1.1, 'c2', 0.9), k.stroke(BAND2, 'wm-a', 1.1, 'c2', 0.9), k.stroke(BAND3, 'wm-a', 1.1, 'c2', 0.85))
  out.push(...k.hot(P(MOUTH), 'wm-a'))
  out.push(...k.dark(P(THROAT), 'wm-k', 0.9))
  out.push(k.stroke('M6.2 4.4 C5.6 5.4 4.8 6.2 4.6 7.6', 'wm-k', 0.5, 'c3', 0.6))
  out.push(k.line('M9.6 7.6 C11.6 6.8 14.2 7 16 8.8', 'wm-shine', 0.55, 'shine', 0.85))
  return out
}
