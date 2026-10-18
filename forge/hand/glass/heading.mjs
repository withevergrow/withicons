// forge/hand/glass/heading.mjs — the heading "H" as one frosted glass letter: two stems and a crossbar cut as a single
// pane (no lighter second layer on the bar), with a soft colour body behind, an accent orb and a fine rim light.
const r = v => String(Math.round(v * 100) / 100)
const V = (k, h) => `var(--with-glass-${k}, ${h})`
const SH = V('shadow', '#6A45D6'), AC = V('accent', '#F2679E'), SN = V('shine', '#FFFFFF')
const G = n => `wg-glass-heading-${n}`

// the H outline, clockwise from the top-left; each vertex carries its corner radius (outer 1.5, inner 0.6)
const X = [4.5, 8.75, 15.25, 19.5], T = 3.5, B = 20.5, Y0 = 10.25, Y1 = 13.75, RO = 1.5, RI = 0.6
const PTS = [
  [X[0], T, RO], [X[1], T, RO], [X[1], Y0, RI], [X[2], Y0, RI], [X[2], T, RO], [X[3], T, RO],
  [X[3], B, RO], [X[2], B, RO], [X[2], Y1, RI], [X[1], Y1, RI], [X[1], B, RO], [X[0], B, RO],
]
function outline(dx = 0, dy = 0, grow = 0) {
  const cx = 12, cy = 12
  const P = PTS.map(([x, y, q]) => [x + dx, y + dy, q])
  const n = P.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const [x, y, q] = P[i], [px, py] = P[(i + n - 1) % n], [nx, ny] = P[(i + 1) % n]
    const k = Math.max(0.2, q + (q > 1 ? grow : -grow))
    const u = (ax, ay, bx, by) => { const l = Math.hypot(bx - ax, by - ay); return [(bx - ax) / l, (by - ay) / l] }
    const [ax, ay] = u(x, y, px, py), [bx, by] = u(x, y, nx, ny)
    const s = [x + ax * k, y + ay * k], e = [x + bx * k, y + by * k]
    d += (i ? 'L' : 'M') + r(s[0]) + ' ' + r(s[1]) + 'Q' + r(x) + ' ' + r(y) + ' ' + r(e[0]) + ' ' + r(e[1])
  }
  return d + 'Z'
}

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: G(0), x1: '4', y1: '3', x2: '21', y2: '22', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }], ['stop', { offset: '1', 'stop-color': SH }]]],
    ['linearGradient', { id: G(1), x1: '3', y1: '2', x2: '19', y2: '21', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }], ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }], ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
    ['radialGradient', { id: G(2), cx: '15', cy: '16', r: '7', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': AC, 'stop-opacity': '0.6' }], ['stop', { offset: '0.5', 'stop-color': AC, 'stop-opacity': '0.22' }], ['stop', { offset: '1', 'stop-color': AC, 'stop-opacity': '0' }]]],
  ]]
  return [
    defs,
    ['path', { d: outline(1.1, 1.5, 0.2), fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: outline(0.7, 0.9), fill: `url(#${G(0)})`, class: 'wm-k' }],
    ['path', { d: outline(0.7, 0.9), fill: `url(#${G(2)})` }],
    ['path', { d: outline(0, 0), fill: `url(#${G(1)})`, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.5, class: 'wm-k' }],
    // rim light along the lit top edges of the stems
    ['path', { d: 'M5.2 6.2Q5.2 4.2 7.2 4.2H8', fill: 'none', stroke: SN, 'stroke-opacity': 0.85, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M15.95 6.2Q15.95 4.2 17.95 4.2H18.7', fill: 'none', stroke: SN, 'stroke-opacity': 0.85, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M9.6 10.95H14.4', fill: 'none', stroke: SN, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
