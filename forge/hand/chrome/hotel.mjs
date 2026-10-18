// forge/hand/chrome/hotel.mjs: a rounded chrome hotel on a wide base slab: a dark sign bar up top and a bed (headboard,
// mattress, pillow) set into the front, instead of a window grid.
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
function metal(n, tag, a, shadowAttrs, cls = 'wm-k', g = 1, rim = 1.7) {
  return [
    [tag, { ...shadowAttrs, fill: SH, 'fill-opacity': 0.2, class: 'wm-shadow' }],
    [tag, { ...a, fill: 'none', stroke: `url(#wg-chrome-${n}-0)`, 'stroke-width': rim, 'stroke-linejoin': 'round', class: cls }],
    [tag, { ...a, fill: `url(#wg-chrome-${n}-${g})`, stroke: SH, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: cls }],
  ]
}
export default function render(icon) {
  const n = 'hotel'
  const bed = 'M6 11.4A0.8 0.8 0 0 1 7.6 11.4V19.6H6ZM6 16.4H18V19H6ZM16.6 14.6A0.7 0.7 0 0 1 18 14.6V19H16.6Z'
  return [defs(n, 2.4, 22.2),
    ...metal(n, 'rect', { x: 3.6, y: 3, width: 16.8, height: 18, rx: 2.4 }, { x: 3.6, y: 3.6, width: 16.8, height: 18, rx: 2.4 }),
    ...metal(n, 'rect', { x: 2, y: 19.8, width: 20, height: 2.4, rx: 1.2 }, { x: 2, y: 20.4, width: 20, height: 2.4, rx: 1.2 }),
    ['rect', { x: 7.4, y: 5.2, width: 9.2, height: 3.2, rx: 1.2, fill: INK, class: 'wm-s' }],
    ['path', { d: 'M9.4 6.8H14.6', stroke: SHINE, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, fill: 'none', class: 'wm-s' }],
    ['path', { d: bed, fill: INK, class: 'wm-a' }],
    ['rect', { x: 8.6, y: 13.8, width: 4.2, height: 2.4, rx: 1.2, fill: SHINE, stroke: INK, 'stroke-width': 0.7, class: 'wm-a' }],
    hi('M5.3 5.6V12'), glint(19, 4.6)]
}
