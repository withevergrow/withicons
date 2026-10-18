// forge/hand/christmas/chart-column-stacked.mjs — three stacked columns in red/green segments with clear divider lines, one small snow cap, snowy baseline.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const f = n => +n.toFixed(2)
const grad = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
  ]],
]]
const spark = (x, y, r) => ['path', { d: `M${x} ${f(y - r)}Q${x} ${y} ${f(x + r)} ${y}Q${x} ${y} ${x} ${f(y + r)}Q${x} ${y} ${f(x - r)} ${y}Q${x} ${y} ${x} ${f(y - r)}Z`, fill: C3, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }]

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  // columns: [x0, x1, top, segments bottom->top as [top edge, colour]]
  const cols = [
    [3, 8.2, 12, [[16.8, C1], [12, C2]]],
    [9.4, 14.6, 3.4, [[15.6, C2], [9.6, C1], [3.4, C2]]],
    [15.8, 21, 8, [[15, C1], [8, C2]]],
  ]
  const out = [grad(id(0), 2, 21.5)]
  for (const [x0, x1, top, segs] of cols) {
    let y = 21
    segs.forEach(([yt, col], i) => {
      const last = i === segs.length - 1
      const d = last
        ? `M${x0} ${y}L${x0} ${f(yt + 1)}Q${x0} ${yt} ${f(x0 + 1)} ${yt}L${f(x1 - 1)} ${yt}Q${x1} ${yt} ${x1} ${f(yt + 1)}L${x1} ${y}Z`
        : `M${x0} ${y}L${x0} ${yt}L${x1} ${yt}L${x1} ${y}Z`
      out.push(['path', { d, fill: col, ...K, class: 'wm-k' }])
      y = yt
    })
    out.push(['path', { d: `M${x0} 21L${x0} ${f(top + 1)}Q${x0} ${top} ${f(x0 + 1)} ${top}L${f(x1 - 1)} ${top}Q${x1} ${top} ${x1} ${f(top + 1)}L${x1} 21Z`, fill: `url(#${id(0)})`, class: 'wm-shine' }])
    out.push(['path', { d: `M${f(x0 + 0.9)} ${f(top + 2)}L${f(x0 + 0.9)} ${f(top + 3.4)}`, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }])
  }
  // snow cap on the tall column
  out.push(['path', { d: 'M9.4 5.6L9.4 4.4Q9.4 3 10.8 3L13.2 3Q14.6 3 14.6 4.4L14.6 5.6Q14 5 13.4 5.8Q12.7 5 12 5.8Q11.3 5 10.6 5.8Q10 5 9.4 5.6Z', fill: C4, ...K, class: 'wm-s' }])
  // snowy baseline
  out.push(['path', { d: 'M2.6 20.8L21.4 20.8Q22.2 20.8 22.2 21.6L22.2 22Q22.2 22.8 21.4 22.8L2.6 22.8Q1.8 22.8 1.8 22L1.8 21.6Q1.8 20.8 2.6 20.8Z', fill: C4, ...K, class: 'wm-k' }])
  out.push(spark(19.6, 3.8, 1.7))
  return out
}
