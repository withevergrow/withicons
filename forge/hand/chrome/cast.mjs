// forge/hand/chrome/cast.mjs: a heavy polished chrome screen bezel (open at the lower left) with three bold steel-blue
// broadcast arcs and a solid corner dot, all stroked as wide metal bands so the icon matches the weight of film/image.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const C = {
  edge: v('edge', '#F4F7FC'), tint: v('tint', '#DCE5F2'), c1: v('c1', '#8794AA'), c2: v('c2', '#5E6A82'),
  c3: v('c3', '#3E4556'), c4: v('c4', '#CDB9A4'), ink: v('ink', '#10131B'), shadow: v('shadow', '#1A1E2A'),
  shine: v('shine', '#FFFFFF')
}
const st = (o, c) => ['stop', { offset: String(o), 'stop-color': c }]
const lg = (n, name, y1, y2, stops) => ['linearGradient',
  { id: `wg-chrome-${name}-${n}`, x1: '0', y1: String(y1), x2: '0', y2: String(y2), gradientUnits: 'userSpaceOnUse' }, stops]

export default function render(icon) {
  const name = (icon && icon.name) || 'cast'
  const g = n => `url(#wg-chrome-${name}-${n})`
  const FRAME = 'M2.6 7.6V6.4A2 2 0 0 1 4.6 4.4H19.4A2 2 0 0 1 21.4 6.4V17.4A2 2 0 0 1 19.4 19.4H14.6'
  const W1 = 'M2.6 15.2A4.2 4.2 0 0 1 6.8 19.4', W2 = 'M2.6 11.2A8.2 8.2 0 0 1 10.8 19.4'
  const off = (d, dx, dy) => d.replace(/([MLH])(-?[\d.]+)(?:\s+(-?[\d.]+))?/g, (m, c, a, b) =>
    c === 'H' ? `H${(+a + dx).toFixed(2) * 1}` : `${c}${(+a + dx).toFixed(2) * 1} ${(+b + dy).toFixed(2) * 1}`)
  const stroke = (d, color, w, cls, extra = {}) => ['path',
    { d, fill: 'none', stroke: color, 'stroke-width': String(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls, ...extra }]
  const dot = (cx, cy, r, fill, cls, extra = {}) => ['circle', { cx: String(cx), cy: String(cy), r: String(r), fill, class: cls, ...extra }]
  return [
    ['defs', {}, [
      lg(0, name, 3.2, 20.6, [st(0, C.edge), st(0.4, C.tint), st(0.55, C.c1), st(0.8, C.c4), st(1, C.edge)]),
      lg(1, name, 10, 20.6, [st(0, C.tint), st(0.45, C.c2), st(1, C.c3)])
    ]],
    // shadow
    stroke(off(FRAME, 0.35, 0.55), C.shadow, 3.1, 'wm-shadow', { 'stroke-opacity': '0.25' }),
    stroke('M2.95 16.25A3.7 3.7 0 0 1 6.65 19.95', C.shadow, 2.9, 'wm-shadow', { 'stroke-opacity': '0.25' }),
    // bezel: dark rim, chrome band, shine
    stroke(FRAME, C.ink, 3.1, 'wm-k'),
    stroke(FRAME, g(0), 2.1, 'wm-k'),
    stroke('M3.4 6.6A1.4 1.4 0 0 1 4.8 5.1H19', C.shine, 0.55, 'wm-shine', { 'stroke-opacity': '0.9' }),
    // broadcast arcs
    stroke(W2, C.ink, 3, 'wm-a'),
    stroke(W2, g(1), 2, 'wm-a'),
    stroke(W1, C.ink, 3, 'wm-a'),
    stroke(W1, g(1), 2, 'wm-a'),
    dot(3.1, 18.9, 1.55, C.ink, 'wm-a'),
    dot(3.1, 18.9, 1.05, g(1), 'wm-a'),
    stroke('M3.2 10.6A8.8 8.8 0 0 1 7.4 12', C.shine, 0.5, 'wm-shine', { 'stroke-opacity': '0.8' })
  ]
}
