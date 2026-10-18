// forge/hand/chrome/nutcracker.mjs: chrome nutcracker soldier: tall hat with accent band, bold eyes, white beard, dark jaw.
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
  const n = 'nutcracker'
  return [defs(n), ...metal(n, 'rect', { x: 7.2, y: 7.6, width: 9.6, height: 9.6, rx: 2.6 }),
    ...metal(n, 'rect', { x: 7.6, y: 1.4, width: 8.8, height: 6.4, rx: 1 }, 'wm-a'),
    ['rect', { x: 7.6, y: 5.6, width: 8.8, height: 1.6, fill: ACC, stroke: SH, 'stroke-width': 0.5, class: 'wm-s' }],
    ['circle', { cx: 9.9, cy: 10.4, r: 1.2, fill: INK }], ['circle', { cx: 14.1, cy: 10.4, r: 1.2, fill: INK }],
    ['path', { d: 'M6.6 13.2C6.6 19 9.2 22 12 22C14.8 22 17.4 19 17.4 13.2L15.2 14.6H8.8Z', fill: SHINE, stroke: SH, 'stroke-width': 0.7, 'stroke-linejoin': 'round' }],
    ['rect', { x: 9.4, y: 15.4, width: 5.2, height: 1.9, rx: 0.5, fill: INK, class: 'wm-a' }],
    inkS('M9.2 13.4Q12 12.2 14.8 13.4', 1.3), hiS('M8.8 2.8H12.4'), glint(19.4, 4)]
}
