// forge/hand/glass/holi-splash.mjs — a Holi colour splash as frosted glass: one round-bodied splat with three long, uneven,
// tapering streaks (so it never reads as a gear), a bold accent heart (wm-a) and three accent droplets of different
// sizes flung off it (wm-s). Same recipe as the sibling panes: colour body behind, frost pane in front, rim light.
const r = v => String(Math.round(v * 100) / 100)
const V = (k, h) => `var(--with-glass-${k}, ${h})`
const SH = V('shadow', '#6A45D6'), AC = V('accent', '#F2679E'), SN = V('shine', '#FFFFFF'), ET = V('etch', '#3E3A8C')
const G = n => `wg-glass-holi-splash-${n}`

// the splat outline in polar form around 12,12: [angle deg, radius]; clockwise (y is down)
const PT = [[0, 6], [26, 6.5], [52, 5.9], [76, 6], [92, 9.8], [108, 6], [122, 6.1], [136, 8.9], [150, 5.8], [172, 6.1], [190, 6],
  [206, 9], [222, 5.8], [250, 6.2], [280, 6], [304, 5.8], [321, 8.8], [338, 5.9]]
const xy = ([a, q], dx, dy, g) => { const t = a * Math.PI / 180; return [12 + dx + Math.cos(t) * (q + g), 12 + dy + Math.sin(t) * (q + g)] }
// a closed Catmull-Rom spline through the points, as cubic Beziers
function splat(dx = 0, dy = 0, g = 0) {
  const P = PT.map(p => xy(p, dx, dy, g)), n = P.length, k = 1 / 6
  let d = 'M' + r(P[0][0]) + ' ' + r(P[0][1])
  for (let i = 0; i < n; i++) {
    const p0 = P[(i + n - 1) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]
    d += 'C' + r(p1[0] + (p2[0] - p0[0]) * k) + ' ' + r(p1[1] + (p2[1] - p0[1]) * k) + ' ' + r(p2[0] - (p3[0] - p1[0]) * k) + ' ' + r(p2[1] - (p3[1] - p1[1]) * k) + ' ' + r(p2[0]) + ' ' + r(p2[1])
  }
  return d + 'Z'
}
// droplets: [angle, distance, radius]
const DROPS = [[38, 10, 1.6], [164, 9.8, 1.3], [260, 9.8, 1.1]]
const dropAt = ([a, dist]) => xy([a, dist], 0, 0, 0)

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: G(0), x1: '2', y1: '2', x2: '23', y2: '23', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }], ['stop', { offset: '1', 'stop-color': SH }]]],
    ['linearGradient', { id: G(1), x1: '1', y1: '1', x2: '21', y2: '21', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }], ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }], ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
    ['radialGradient', { id: G(2), cx: '13', cy: '13', r: '7', gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: '0', 'stop-color': AC, 'stop-opacity': '0.5' }], ['stop', { offset: '0.5', 'stop-color': AC, 'stop-opacity': '0.18' }], ['stop', { offset: '1', 'stop-color': AC, 'stop-opacity': '0' }]]],
  ]]
  const out = []
  out.push(['path', { d: splat(1.0, 1.4, 0.15), fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  out.push(['path', { d: splat(0.6, 0.8, 0), fill: `url(#${G(0)})`, class: 'wm-k' }])
  out.push(['path', { d: splat(0.6, 0.8, 0), fill: `url(#${G(2)})` }])
  out.push(['path', { d: splat(0, 0, 0), fill: `url(#${G(1)})`, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: 'M8.6 9.2Q9.2 7.6 10.8 7', fill: 'none', stroke: SN, 'stroke-opacity': 0.85, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // the heart: a luminous accent bead
  out.push(['circle', { cx: 12.5, cy: 12.5, r: 2.8, fill: SH, 'fill-opacity': 0.22, class: 'wm-a' }])
  out.push(['circle', { cx: 12, cy: 12, r: 2.8, fill: AC, stroke: ET, 'stroke-opacity': 0.35, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['circle', { cx: 11, cy: 11, r: 0.8, fill: SN, 'fill-opacity': 0.9, class: 'wm-a' }])
  // droplets
  for (const dr of DROPS) {
    const [x, y] = dropAt(dr), q = dr[2]
    out.push(['circle', { cx: r(x + 0.3), cy: r(y + 0.35), r: q, fill: SH, 'fill-opacity': 0.25, class: 'wm-s' }])
    out.push(['circle', { cx: r(x), cy: r(y), r: q, fill: AC, stroke: ET, 'stroke-opacity': 0.35, 'stroke-width': 0.4, class: 'wm-s' }])
    out.push(['circle', { cx: r(x - q * 0.35), cy: r(y - q * 0.35), r: r(Math.max(0.3, q * 0.3)), fill: SN, 'fill-opacity': 0.9, class: 'wm-s' }])
  }
  return [defs, ...out]
}
