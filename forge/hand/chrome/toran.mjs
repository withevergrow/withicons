// forge/hand/chrome/toran.mjs: a door garland: a chrome bar as wide as the row of three equal teardrop leaves hanging
// from it (chrome, accent, chrome).
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
  const n = 'toran'
  const leaf = (cx, dy = 0) => `M${cx} ${f(19.8 + dy)}C${f(cx - 1.1)} ${f(17.4 + dy)} ${f(cx - 2.6)} ${f(14 + dy)} ${f(cx - 2.6)} ${f(9 + dy)}A2.6 2.6 0 0 1 ${f(cx + 2.6)} ${f(9 + dy)}C${f(cx + 2.6)} ${f(14 + dy)} ${f(cx + 1.1)} ${f(17.4 + dy)} ${cx} ${f(19.8 + dy)}Z`
  const out = [defs(n, 2.4, 20.6, 6, 20)]
  for (const [cx, g] of [[6.2, 1], [12, 2], [17.8, 1]]) {
    out.push(...metal(n, 'path', { d: leaf(cx) }, { d: leaf(cx, 0.6) }, 'wm-k', g, 1.5))
    out.push(['path', { d: `M${cx} 7.8V16`, stroke: SH, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, fill: 'none' }])
    out.push(hi(`M${f(cx - 1.4)} 10.6Q${f(cx - 1.4)} 8.2 ${cx} 7.6`, 0.8))
  }
  out.push(...metal(n, 'rect', { x: 3.6, y: 3, width: 16.8, height: 2.8, rx: 1.4 }, { x: 3.6, y: 3.6, width: 16.8, height: 2.8, rx: 1.4 }, 'wm-a'))
  out.push(hi('M5.4 4.1H11', 0.8), glint(19.6, 3.8))
  return out
}
