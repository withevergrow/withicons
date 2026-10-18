// forge/hand/blueprint/rss.mjs: the drafted feed, a solid source dot at the arc origin and two full-weight quarter
// arcs. The earlier drawing laid a keyline circle and a radius line behind the fan, which made the arcs look faint and
// the dot detached; here those are gone, the dot is bigger, and only the outer arc's two ends carry control rings,
// with one faint dimension line below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M4.5 22.4H19.5M4.5 21.9V22.9M19.5 21.9V22.9', ...con(0.5) }],
    ['path', { d: 'M3.85 23.05L5.15 21.75M18.85 23.05L20.15 21.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['circle', { cx: 5.5, cy: 18.5, r: 1.6, fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: 'M5.5 10.5A8 8 0 0 1 13.5 18.5M6.31 4.51A14 14 0 0 1 19.48 17.69', class: 'wm-a' }],
    ['path', { d: ring(5.5, 4.5) + ring(19.5, 18.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
