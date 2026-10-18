// forge/hand/chrome/plane-landing.mjs: a chrome airliner tilted nose-down, clearly separated from a thin chrome runway bar.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
function defs(n) {
  const g = (i, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: 2.4, x2: 0, y2: 20.6, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
  ]]
}
// one chrome part: a bright rim stroke, the polished body with a dark keyline, and a soft cast shadow below
function metal(n, tag, a, cls = 'wm-k') {
  const sh = { ...a }
  if ('cy' in sh) sh.cy = f(sh.cy + 0.6); else if ('y' in sh) sh.y = f(sh.y + 0.6)
  const out = []
  if (tag !== 'path') out.push([tag, { ...sh, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }])
  out.push([tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': 1.7, 'stroke-linejoin': 'round', class: cls }])
  out.push([tag, { ...a, fill: `url(#wg-chrome-${n}-1)`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }])
  return out
}
const inkS = (d, w = 2) => ['path', { d, stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }]
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.5)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.5)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.5)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.5)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.5)}Z`, fill: SHINE, class: 'wm-shine' }]
const arcHi = (cx, cy, r) => ['path', { d: `M${f(cx - r * 0.82)} ${f(cy - r * 0.2)}A${r} ${r} 0 0 1 ${f(cx - r * 0.2)} ${f(cy - r * 0.82)}`, stroke: SHINE, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
export default function render(icon) {
  const n = 'plane-landing'
  const half = [[8.5, 0], [7.2, 0.85], [2.6, 0.85], [-2.1, 7], [-3.7, 7], [-1.3, 0.85], [-5.1, 0.85], [-6.8, 3.2], [-7.9, 3.2], [-7.1, 0.6], [-7.3, 0]]
  const pts = [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
  const a = Math.PI / 6, c = Math.cos(a), s = Math.sin(a)
  const d = 'M' + pts.map(([x, y]) => `${f(11.6 + 0.92 * (x * c - y * s))} ${f(10.2 + 0.92 * (x * s + y * c))}`).join('L') + 'Z'
  return [defs(n), ...metal(n, 'path', { d, 'stroke-linejoin': 'round' }, 'wm-a'),
    ...metal(n, 'rect', { x: 3, y: 19.6, width: 18, height: 1.3, rx: 0.65 }),
    glint(9.4, 7.4)]
}
