// forge/hand/chrome/cauldron.mjs: a round-bellied chrome pot with a flared rim, short legs and bubbles kept inside the opening.
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
  const n = 'cauldron', A = v('accent', '#E8459A')
  return [defs(n),
    ...metal(n, 'rect', { x: 6.4, y: 17.6, width: 2.4, height: 3.6, rx: 1 }), ...metal(n, 'rect', { x: 15.2, y: 17.6, width: 2.4, height: 3.6, rx: 1 }),
    ...metal(n, 'path', { d: 'M4.6 10.4H19.4C20.6 12 21 13.4 21 14.6C21 18.4 17 20.4 12 20.4C7 20.4 3 18.4 3 14.6C3 13.4 3.4 12 4.6 10.4Z' }),
    ...metal(n, 'rect', { x: 2.6, y: 8.4, width: 18.8, height: 2.8, rx: 1.4 }),
    ['ellipse', { cx: 12, cy: 9, rx: 7.6, ry: 0.9, fill: INK }],
    ['circle', { cx: 9.4, cy: 7.7, r: 1.3, fill: A, stroke: INK, 'stroke-width': 0.5, class: 'wm-s' }],
    ['circle', { cx: 13.2, cy: 7.3, r: 1.7, fill: A, stroke: INK, 'stroke-width': 0.5, class: 'wm-s' }],
    ['circle', { cx: 16.1, cy: 8, r: 0.9, fill: A, stroke: INK, 'stroke-width': 0.5, class: 'wm-s' }],
    glint(5.8, 13.4)]
}
