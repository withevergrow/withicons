// forge/hand/chrome/mosque.mjs: chrome mosque: big onion dome with a small accent crescent, separate tall minaret.
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
  const n = 'mosque'
  return [defs(n), ...metal(n, 'rect', { x: 2.6, y: 13.4, width: 14, height: 7.2, rx: 1 }),
    ...metal(n, 'path', { d: 'M3.6 13.4C3.6 9.6 6.6 8.2 9.6 5.6C12.6 8.2 15.6 9.6 15.6 13.4Z' }),
    ['path', { d: 'M10 1A1.8 1.8 0 1 0 10 4.6A1.4 1.4 0 0 1 10 1Z', fill: ACC, stroke: SH, 'stroke-width': 0.4, class: 'wm-s' }],
    ...metal(n, 'rect', { x: 18.4, y: 7, width: 2.8, height: 13.6, rx: 0.6 }),
    ...metal(n, 'path', { d: 'M18.2 7L19.8 2.6L21.4 7Z' }),
    ['path', { d: 'M7.8 20.6V17.6A1.8 1.8 0 0 1 11.4 17.6V20.6Z', fill: INK }],
    hiS('M5.6 11.6C6.2 10.2 7.4 9.2 8.6 8.2'), hiS('M19.2 9V13.6')]
}
