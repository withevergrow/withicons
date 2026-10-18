// forge/hand/chrome/mistletoe.mjs: a hanging chrome mistletoe, a gunmetal bow on top, a short stem, two splayed chrome leaves and a cluster of three enamel berries.
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const INK = v('ink', '#10131B'), SH = v('shadow', '#1A1E2A'), SHINE = v('shine', '#FFFFFF')
const f = x => Math.round(x * 100) / 100
const stops = a => a.map(([o, r, h]) => ['stop', { offset: o, 'stop-color': v(r, h) }])
const lg = (i, n, y0, y1, a) => ['linearGradient', { id: `wg-chrome-${n}-${i}`, x1: 0, y1: y0, x2: 0, y2: y1, gradientUnits: 'userSpaceOnUse' }, stops(a)]
const RIM = [[0, 'edge', '#F4F7FC'], [0.42, 'tint', '#DCE5F2'], [0.56, 'c1', '#8794AA'], [0.78, 'c4', '#CDB9A4'], [1, 'edge', '#F4F7FC']]
const CHROME = [[0, 'shine', '#FFFFFF'], [0.3, 'tint', '#DCE5F2'], [0.52, 'c1', '#8794AA'], [0.56, 'c2', '#5E6A82'], [1, 'c4', '#CDB9A4']]
const GUN = [[0, 'tint', '#DCE5F2'], [0.45, 'c2', '#5E6A82'], [0.56, 'c3', '#3E4556'], [0.88, 'c2', '#5E6A82'], [1, 'tint', '#DCE5F2']]
const ENAMEL = [[0, 'shine', '#FFFFFF'], [0.34, 'accent', '#FF3E9E'], [1, 'accent', '#FF3E9E']]
const circ = (cx, cy, r) => ({ cx, cy, r })
// a part: a soft cast shadow, a bright rim stroke, then the polished body with a dark keyline
function part(n, tag, a, g, cls, y0, y1, rim = 1.7) {
  const sh = { ...a }
  if (tag === 'circle') sh.cy = f(a.cy + 0.6)
  const out = []
  if (tag === 'circle') out.push([tag, { ...sh, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }])
  out.push([tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': rim, 'stroke-linejoin': 'round', class: cls }])
  out.push([tag, { ...a, fill: `url(#wg-chrome-${n}-${g})`, stroke: SH, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: cls }])
  return out
}
const hi = d => ['path', { d, stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, fill: 'none', class: 'wm-shine' }]
const vein = d => ['path', { d, stroke: SH, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, fill: 'none', class: 'wm-k' }]
const glint = (x, y) => ['path', { d: `M${x} ${f(y - 1.4)}Q${f(x + 0.3)} ${f(y - 0.3)} ${f(x + 1.4)} ${y}Q${f(x + 0.3)} ${f(y + 0.3)} ${x} ${f(y + 1.4)}Q${f(x - 0.3)} ${f(y + 0.3)} ${f(x - 1.4)} ${y}Q${f(x - 0.3)} ${f(y - 0.3)} ${x} ${f(y - 1.4)}Z`, fill: SHINE, class: 'wm-shine' }]
const LEAF_L = 'M11.6 13.4C8.4 12.9 4.6 14.6 3.7 19.9C8.6 20.5 12.2 17.4 11.6 13.4Z'
const LEAF_R = 'M12.4 13.4C12.8 17.4 15.4 20.5 20.3 19.9C19.4 14.6 15.6 12.9 12.4 13.4Z'
const BOW_L = 'M11.6 3.9C10.6 2.2 8.2 1.7 7.5 2.9C6.9 4.2 9.4 5.2 11.6 4.5Z'
const BOW_R = 'M12.4 3.9C13.4 2.2 15.8 1.7 16.5 2.9C17.1 4.2 14.6 5.2 12.4 4.5Z'
export default function render(icon) {
  const n = 'mistletoe'
  const berry = (cx, cy) => [
    ...part(n, 'circle', circ(cx, cy, 1.8), 5, 'wm-k', 6, 13, 1.3),
    ['circle', { cx, cy, r: 1.25, fill: `url(#wg-chrome-${n}-2)`, class: 'wm-s' }],
  ]
  const nodes = [
    ['defs', {}, [lg(0, n, 2, 21, RIM), lg(1, n, 6, 13, CHROME), lg(2, n, 6.4, 13.2, ENAMEL), lg(3, n, 2, 5, GUN), lg(4, n, 13, 20.5, CHROME), lg(5, n, 6, 13.5, [[0, 'edge', '#F4F7FC'], [0.5, 'tint', '#DCE5F2'], [1, 'c4', '#CDB9A4']])]],
    ['path', { d: 'M12 4.6V7', stroke: INK, 'stroke-width': 1.3, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ...part(n, 'path', { d: LEAF_L }, 4, 'wm-k'),
    ...part(n, 'path', { d: LEAF_R }, 4, 'wm-k'),
    vein('M10.8 14.4C8.8 15.6 6.8 17.4 5.6 19'),
    vein('M13.2 14.4C15.2 15.6 17.2 17.4 18.4 19'),
    hi('M10.4 14.3C8.2 14 6.2 15 5 16.6'),
    ...berry(12, 8.2), ...berry(9.9, 11.5), ...berry(14.1, 11.5),
    ...part(n, 'path', { d: BOW_L }, 3, 'wm-a'),
    ...part(n, 'path', { d: BOW_R }, 3, 'wm-a'),
    ['circle', { cx: 12, cy: 4.1, r: 1, fill: `url(#wg-chrome-${n}-3)`, stroke: SH, 'stroke-width': 0.5, class: 'wm-a' }],
    glint(7.4, 13.6),
  ]
  // the shadows of the berries and bow are cast by the cluster: keep one soft shadow under the leaves
  return nodes
}
