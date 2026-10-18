// forge/hand/glass/api.mjs — the API as a hub and two endpoints in frosted glass: one rounded block on the left, a bold
// accent glass fork of two connectors (wm-a) running to two larger round nodes on the right, each with a luminous
// accent bead (wm-s). Few, big parts so it reads at 16px; the connectors sit under the panes and glow through the frost.
const r = v => String(Math.round(v * 100) / 100)
const V = (k, h) => `var(--with-glass-${k}, ${h})`
const SH = V('shadow', '#6A45D6'), AC = V('accent', '#F2679E'), SN = V('shine', '#FFFFFF'), ET = V('etch', '#3E3A8C')
const G = n => `wg-glass-api-${n}`

const rrect = (x0, y0, x1, y1, c, dx = 0, dy = 0) => {
  const p = (a, b) => r(a + dx) + ' ' + r(b + dy)
  return `M${p(x0 + c, y0)}H${r(x1 - c + dx)}A${r(c)} ${r(c)} 0 0 1 ${p(x1, y0 + c)}V${r(y1 - c + dy)}A${r(c)} ${r(c)} 0 0 1 ${p(x1 - c, y1)}H${r(x0 + c + dx)}A${r(c)} ${r(c)} 0 0 1 ${p(x0, y1 - c)}V${r(y0 + c + dy)}A${r(c)} ${r(c)} 0 0 1 ${p(x0 + c, y0)}Z`
}
const disc = (cx, cy, q, dx = 0, dy = 0) =>
  `M${r(cx - q + dx)} ${r(cy + dy)}A${r(q)} ${r(q)} 0 1 1 ${r(cx + q + dx)} ${r(cy + dy)}A${r(q)} ${r(q)} 0 1 1 ${r(cx - q + dx)} ${r(cy + dy)}Z`

const BLOCK = [1.5, 8, 8.5, 16, 2.4]
const NODES = [[19, 6.5, 3.2], [19, 17.5, 3.2]]
const shapes = (dx, dy, grow = 0) => [
  rrect(BLOCK[0] - grow, BLOCK[1] - grow, BLOCK[2] + grow, BLOCK[3] + grow, BLOCK[4] + grow, dx, dy),
  ...NODES.map(([x, y, q]) => disc(x, y, q + grow, dx, dy)),
]
// the fork: block -> trunk -> two branches into the nodes
const FORK = 'M7.5 12H12.5M12.5 6.5V17.5M12.5 6.5H17M12.5 17.5H17'

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: G(0), x1: '2', y1: '4', x2: '23', y2: '21', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }], ['stop', { offset: '1', 'stop-color': SH }]]],
    ['linearGradient', { id: G(1), x1: '1', y1: '3', x2: '21', y2: '20', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }], ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }], ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
  ]]
  const out = []
  const rod = (d, w, stroke, extra = {}) => ['path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }]
  for (const d of shapes(1.1, 1.5, 0.2)) out.push(['path', { d, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  for (const d of shapes(0.7, 0.9)) out.push(['path', { d, fill: `url(#${G(0)})`, class: 'wm-k' }])
  // connectors: a deep edge under a bold accent rod, so they hold their contrast on the lavender body
  out.push(rod(FORK, 3.2, ET, { 'stroke-opacity': 0.5, class: 'wm-a' }))
  out.push(rod(FORK, 2.3, AC, { class: 'wm-a' }))
  for (const d of shapes(0, 0))
    out.push(['path', { d, fill: `url(#${G(1)})`, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(rod('M2.3 10.4Q2.3 9 3.9 9H5.6', 0.6, SN, { 'stroke-opacity': 0.85, class: 'wm-shine' }))
  for (const [x, y, q] of NODES) out.push(rod(`M${r(x - q * 0.72)} ${r(y - q * 0.1)}Q${r(x - q * 0.62)} ${r(y - q * 0.62)} ${r(x - q * 0.1)} ${r(y - q * 0.72)}`, 0.6, SN, { 'stroke-opacity': 0.85, class: 'wm-shine' }))
  // luminous accent beads: one in the block, one in each node
  for (const [x, y, q] of [[5, 12, 1.5], ...NODES.map(([x, y]) => [x, y, 1.4])]) {
    out.push(['circle', { cx: r(x + 0.25), cy: r(y + 0.25), r: q, fill: SH, 'fill-opacity': 0.3, class: 'wm-s' }])
    out.push(['circle', { cx: r(x), cy: r(y), r: q, fill: AC, stroke: ET, 'stroke-opacity': 0.4, 'stroke-width': 0.4, class: 'wm-s' }])
    out.push(['circle', { cx: r(x - q * 0.35), cy: r(y - q * 0.35), r: r(q * 0.3), fill: SN, 'fill-opacity': 0.9, class: 'wm-s' }])
  }
  return [defs, ...out]
}
