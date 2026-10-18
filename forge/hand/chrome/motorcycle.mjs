// forge/hand/chrome/motorcycle.mjs: chrome motorbike: two clear rimmed wheels, tank-and-seat body, diagonal fork and bar.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF'), ACC = v('accent', '#E0457B')
const f = x => Math.round(x * 100) / 100
function defs(n) {
  const g = (i, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: 2.4, x2: 0, y2: 20.6, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
    g(2, [[0, 'c3', '#3E4556'], [0.7, 'c1', '#8794AA'], [1, 'c4', '#CDB9A4']]),
  ]]
}
function metal(n, tag, a, cls = 'wm-k', grad = 1) {
  const sh = { ...a }
  if ('cy' in sh) sh.cy = f(sh.cy + 0.6); else if ('y' in sh) sh.y = f(sh.y + 0.6)
  const out = []
  if (tag !== 'path') out.push([tag, { ...sh, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }])
  out.push([tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': 1.7, 'stroke-linejoin': 'round', class: cls }])
  out.push([tag, { ...a, fill: `url(#wg-chrome-${n}-${grad})`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }])
  return out
}
const inkS = (d, w = 2, cls) => ['path', { d, stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', ...(cls ? { class: cls } : {}) }]
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.5)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.5)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.5)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.5)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.5)}Z`, fill: SHINE, class: 'wm-shine' }]
const hiS = d => ['path', { d, stroke: SHINE, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
export default function render(icon) {
  const n = 'motorcycle'
  const wheel = cx => [...metal(n, 'circle', { cx, cy: 16.6, r: 3.8 }),
    ['circle', { cx, cy: 16.6, r: 2.2, fill: INK }],
    ['path', { d: `M${f(cx - 2.9)} ${15.2}A3.2 3.2 0 0 1 ${f(cx + 1.4)} 13.7`, stroke: SHINE, 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['circle', { cx, cy: 16.6, r: 0.9, fill: SHINE, class: 'wm-shine' }]]
  return [defs(n), ...wheel(5.2), ...wheel(18.8),
    inkS('M18.8 16.6L15.4 7.2', 2.6), inkS('M13.4 6.4L15.4 7.2L17.8 5.8', 2.4),
    ...metal(n, 'rect', { x: 8.6, y: 12.2, width: 5.2, height: 4.2, rx: 1 }, 'wm-k', 2),
    inkS('M9.6 13.6H12.8M9.6 15H12.8', 0.8),
    ...metal(n, 'path', { d: 'M3.4 11.2L8.4 10.2L10 8.2H14.8L16.6 10.6L14.2 12.6H8L4.4 12.8Z' }),
    inkS('M5.2 16.6L8.6 15.4', 1.8), inkS('M13.8 15.8L16.8 17.4', 1.4),
    hiS('M10.4 9.2H14.2'), glint(3, 5.6)]
}
