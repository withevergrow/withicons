// forge/hand/chrome/shield-off.mjs: a chrome shield cut cleanly in two along a chrome slash, with an even gap on both sides.
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
  const n = 'shield-off'
  return [defs(n),
    ...metal(n, 'path', { d: 'M6.25 4.65L12 2.5L19.5 5.3V11C19.5 13.3 18.9 15 18 16.4Z' }),
    ...metal(n, 'path', { d: 'M4.5 6.1V11C4.5 15.8 7.7 19.5 12 21.2C14 20.4 15.4 19.4 16.5 18.1Z' }),
    ['path', { d: 'M3.4 3.4L20.6 20.6', stroke: SH, 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M3.4 3.4L20.6 20.6', stroke: `url(#wg-chrome-${n}-1)`, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M13 4L18.4 6', stroke: SHINE, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }],
    glint(7.4, 10.4)]
}
