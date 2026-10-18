// forge/hand/soft3d/ruler.mjs: a big soft3d diagonal ruler: an elongated rounded orange bar from lower left to upper right with a
// darker underside and a row of long and short dark tick marks along its upper-left edge.
const N = 'ruler'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F5A524'), c2: v('c2', '#3A404C'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const K = Math.SQRT1_2
const f = n => (Math.round(n * 100) / 100).toString()
// local (x along the ruler, y across) -> world, rotated -45 degrees about (cx, cy)
const P = (cx, cy, x, y) => `${f(cx + K * (x + y))} ${f(cy + K * (y - x))}`
function bar(cx, cy, hl, hw, r) {
  const q = (x, y) => P(cx, cy, x, y)
  return `M${q(-hl + r, -hw)}L${q(hl - r, -hw)}A${r} ${r} 0 0 1 ${q(hl, -hw + r)}L${q(hl, hw - r)}A${r} ${r} 0 0 1 ${q(hl - r, hw)}L${q(-hl + r, hw)}A${r} ${r} 0 0 1 ${q(-hl, hw - r)}L${q(-hl, -hw + r)}A${r} ${r} 0 0 1 ${q(-hl + r, -hw)}Z`
}
export default function render() {
  const BODY = bar(12, 11.6, 10.6, 3.5, 1.6)
  const LOW = bar(12.5, 12.5, 10.6, 3.5, 1.6)
  let ticks = ''
  for (let i = 0; i < 9; i++) {
    const x = -8 + i * 2
    const len = i % 2 === 0 ? 2.3 : 1.3
    ticks += `M${P(12, 11.6, x, -3.5 + 0.5)}L${P(12, 11.6, x, -3.5 + 0.5 + len)}`
  }
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.38), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]]]],
    ['ellipse', { cx: 12.5, cy: 21.7, rx: 9.2, ry: 1.2, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12.5, cy: 21.7, rx: 6.2, ry: 0.8, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: LOW, fill: C.c1, class: 'wm-k' }],
    ['path', { d: LOW, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: ticks, stroke: C.c2, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: `M${P(12, 11.6, -9.4, 3.1)}L${P(12, 11.6, 9.4, 3.1)}`, stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
