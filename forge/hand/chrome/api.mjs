// forge/hand/chrome/api.mjs: a chrome block between two separate chrome nodes on thin dark connectors (node-box-node).
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
  const n = 'api'
  return [defs(n),
    ['path', { d: 'M5.4 12H7M17 12H18.6', stroke: INK, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-a' }],
    ...metal(n, 'circle', { cx: 3.1, cy: 12, r: 2.6 }, 'wm-a'), ...metal(n, 'circle', { cx: 20.9, cy: 12, r: 2.6 }, 'wm-a'),
    ...metal(n, 'rect', { x: 6.6, y: 5, width: 10.8, height: 13.4, rx: 2.4 }),
    inkS('M10.5 9.6L8.9 11.7L10.5 13.8M13.5 9.6L15.1 11.7L13.5 13.8', 1.6), glint(8.9, 4.4)]
}
