// forge/hand/chrome/mandarin-orange.mjs: a squat polished chrome mandarin with a stem, a leaf, three rind dots and a bright upper highlight.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
function defs(n) {
  const g = (i, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: 2.4, x2: 0, y2: 20.6, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(2, [[0, 'tint', '#DCE5F2'], [0.45, 'c2', '#5E6A82'], [0.56, 'c3', '#3E4556'], [0.9, 'c2', '#5E6A82'], [1, 'tint', '#DCE5F2']]),
    g(1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
  ]]
}
// one chrome part: a bright rim stroke, the polished body with a dark keyline, and a soft cast shadow below
function metal(n, tag, a, cls = 'wm-k', gi = 1) {
  const sh = { ...a }
  if ('cy' in sh) sh.cy = f(sh.cy + 0.6); else if ('y' in sh) sh.y = f(sh.y + 0.6)
  const out = []
  if (tag !== 'path') out.push([tag, { ...sh, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }])
  out.push([tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': 1.7, 'stroke-linejoin': 'round', class: cls }])
  out.push([tag, { ...a, fill: `url(#wg-chrome-${n}-${gi})`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }])
  return out
}
const inkS = (d, w = 2) => ['path', { d, stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }]
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.5)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.5)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.5)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.5)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.5)}Z`, fill: SHINE, class: 'wm-shine' }]
const arcHi = (cx, cy, r) => ['path', { d: `M${f(cx - r * 0.82)} ${f(cy - r * 0.2)}A${r} ${r} 0 0 1 ${f(cx - r * 0.2)} ${f(cy - r * 0.82)}`, stroke: SHINE, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
export default function render(icon) {
  const n = 'mandarin-orange'
  const dot = (cx, cy) => ['ellipse', { cx, cy, rx: 0.55, ry: 0.45, fill: INK, 'fill-opacity': 0.75, class: 'wm-k' }]
  return [defs(n),
    ['path', { d: 'M12 8.4C11.8 6.8 12.1 5.4 12.6 4.4', stroke: INK, 'stroke-width': 1.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ...metal(n, 'path', { d: 'M12.7 6.2C13.1 3.7 15.7 2.3 19.8 2.8C19.3 5.7 16.4 7.2 12.7 6.2Z' }, 'wm-a', 2),
    ['path', { d: 'M14 5.7Q16.3 4.7 18.5 3.6', stroke: SHINE, 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ...metal(n, 'ellipse', { cx: 12, cy: 14.4, rx: 9, ry: 6.9 }),
    ['circle', { cx: 12, cy: 8.9, r: 0.8, fill: INK, 'fill-opacity': 0.85, class: 'wm-k' }],
    dot(15.2, 13.6), dot(17.4, 16.2), dot(11.6, 17.7), dot(8.2, 15.6),
    ['path', { d: 'M5.4 13.6A7.6 5.5 0 0 1 10 9.3', stroke: SHINE, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, fill: 'none', class: 'wm-shine' }],
    glint(7.6, 12.6)]
}
