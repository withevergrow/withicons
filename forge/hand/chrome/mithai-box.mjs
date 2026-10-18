// forge/hand/chrome/mithai-box.mjs: a rounded chrome sweet box with an accent ribbon band, two round sweets flanking a
// central diamond sweet on top.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
function defs(n, y0, y1, ya0, ya1) {
  const g = (i, a, b, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: a, x2: 0, y2: b, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, y0, y1, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(1, y0, y1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
    g(2, ya0, ya1, [[0, 'shine', '#FFFFFF'], [0.3, 'accent', '#FF3E9E'], [1, 'accent', '#FF3E9E']]),
    g(3, 14.2, 16.8, [[0, 'shine', '#FFFFFF'], [0.35, 'accent', '#FF3E9E'], [1, 'accent', '#FF3E9E']]),
  ]]
}
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.5)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.5)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.5)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.5)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.5)}Z`, fill: SHINE, class: 'wm-shine' }]
const hi = (d, w = 0.9) => ['path', { d, stroke: SHINE, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
function metal(n, tag, a, shadowAttrs, cls = 'wm-k', g = 1, rim = 1.7) {
  return [
    [tag, { ...shadowAttrs, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }],
    [tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': rim, 'stroke-linejoin': 'round', class: cls }],
    [tag, { ...a, fill: `url(#wg-chrome-${n}-${g})`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }],
  ]
}
export default function render(icon) {
  const n = 'mithai-box'
  const dia = (dy = 0) => `M12 ${f(4.4 + dy)}L14.8 ${f(7.8 + dy)}L12 ${f(11.2 + dy)}L9.2 ${f(7.8 + dy)}Z`
  return [defs(n, 2.4, 22, 5.5, 11),
    ...metal(n, 'circle', { cx: 5.6, cy: 8.6, r: 2.3 }, { cx: 5.6, cy: 9.2, r: 2.3 }, 'wm-a', 2, 1.3),
    ...metal(n, 'circle', { cx: 18.4, cy: 8.6, r: 2.3 }, { cx: 18.4, cy: 9.2, r: 2.3 }, 'wm-a', 2, 1.3),
    ...metal(n, 'path', { d: dia() }, { d: dia(0.6) }, 'wm-a', 1, 1.3),
    ...metal(n, 'rect', { x: 3, y: 11, width: 18, height: 10.5, rx: 2.2 }, { x: 3, y: 11.6, width: 18, height: 10.5, rx: 2.2 }),
    ['rect', { x: 3.3, y: 14.2, width: 17.4, height: 2.6, fill: 'url(#wg-chrome-mithai-box-3)', stroke: SH, 'stroke-width': 0.5 }],
    hi('M5.2 12.6H12'), hi('M4.4 7.6A1.4 1.4 0 0 1 5.6 6.6', 0.7), hi('M17.2 7.6A1.4 1.4 0 0 1 18.4 6.6', 0.7), glint(20, 12.4)]
}
