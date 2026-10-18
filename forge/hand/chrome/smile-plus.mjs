// forge/hand/chrome/smile-plus.mjs: a chrome smiley (dot eyes, one smile) with an accent plus badge at its top right.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
function defs(n, y0, y1, ya0, ya1) {
  const g = (i, a, b, stops) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: a, x2: 0, y2: b, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])]
  return ['defs', {}, [
    g(0, y0, y1, [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]),
    g(1, y0, y1, [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#B7C2D4'], [1, 'c4', '#CDB9A4']]),
    g(2, ya0, ya1, [[0, 'shine', '#FFFFFF'], [0.3, 'accent', '#FF3E9E'], [1, 'accent', '#FF3E9E']]),
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
  const n = 'smile-plus'
  const plus = (dy = 0) => `M19.4 ${f(2.4 + dy)}V${f(8 + dy)}M16.6 ${f(5.2 + dy)}H22.2`
  return [defs(n, 5.1, 21.9, 1.6, 8.8),
    ...metal(n, 'circle', { cx: 10.5, cy: 13.5, r: 8.4 }, { cx: 10.5, cy: 14.1, r: 8.4 }),
    ['circle', { cx: 7.6, cy: 11.6, r: 1.3, fill: INK, class: 'wm-a' }], ['circle', { cx: 13.4, cy: 11.6, r: 1.3, fill: INK, class: 'wm-a' }],
    inkS('M6.8 15.2Q10.5 19.2 14.2 15.2', 1.8, 'wm-a'),
    hi('M4.6 11.4A6.2 6.2 0 0 1 8.6 7.6'),
    ['path', { d: plus(0.5), stroke: SH, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.2, fill: 'none', class: 'wm-shadow' }],
    ['path', { d: plus(), stroke: SH, 'stroke-width': 3.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
    ['path', { d: plus(), stroke: 'url(#wg-chrome-smile-plus-2)', 'stroke-width': 2.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
    glint(5.2, 8.2)]
}
