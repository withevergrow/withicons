// forge/hand/chrome/meh.mjs: a plain neutral face on a round chrome disc: two small dot eyes and one flat mouth.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
function defs(n, y0, y1) {
  const g = (i, a, b, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: a, x2: 0, y2: b, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, y0, y1, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(1, y0, y1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
  ]]
}
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.5)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.5)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.5)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.5)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.5)}Z`, fill: SHINE, class: 'wm-shine' }]
const hi = (d, w = 0.9) => ['path', { d, stroke: SHINE, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
const inkS = (d, w, cls) => ['path', { d, stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: cls }]
function metal(n, tag, a, shadowAttrs, cls = 'wm-k', g = 1, rim = 1.7) {
  return [
    [tag, { ...shadowAttrs, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }],
    [tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': rim, 'stroke-linejoin': 'round', class: cls }],
    [tag, { ...a, fill: `url(#wg-chrome-${n}-${g})`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }],
  ]
}
export default function render(icon) {
  const n = 'meh'
  return [defs(n, 2.4, 20.6),
    ...metal(n, 'circle', { cx: 12, cy: 12, r: 9.3 }, { cx: 12, cy: 12.6, r: 9.3 }),
    ['circle', { cx: 8.8, cy: 10, r: 1.4, fill: INK, class: 'wm-a' }], ['circle', { cx: 15.2, cy: 10, r: 1.4, fill: INK, class: 'wm-a' }],
    inkS('M8.4 15.6H15.6', 1.9, 'wm-a'),
    hi('M5.9 10.6A6.3 6.3 0 0 1 10.4 5.8'), glint(5.6, 5.4)]
}
