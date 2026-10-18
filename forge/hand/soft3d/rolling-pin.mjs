// forge/hand/soft3d/rolling-pin.mjs: a rolling pin on the 45 degree diagonal (lower left to upper right): a fat rounded wooden
// barrel with a lit stripe along its length and two slim, darker, round-ended handles clearly apart from it, a thickness
// under the barrel and a soft contact shadow. Replaces the generated blocky, cheese-like block.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E6C489'), c2: v('c2', '#B8763E'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const N = 'rolling-pin'
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const K = Math.SQRT1_2
const f = n => (Math.round(n * 100) / 100).toString()
// local (x along the pin toward the upper right, y across) -> world, about (cx, cy)
const W = (cx, cy, x, y) => `${f(cx + K * (x + y))} ${f(cy + K * (y - x))}`
// a rounded bar from x0 to x1, half width hw, corner radius r
function bar(cx, cy, x0, x1, hw, r) {
  const q = (x, y) => W(cx, cy, x, y)
  return `M${q(x0 + r, -hw)}L${q(x1 - r, -hw)}A${r} ${r} 0 0 1 ${q(x1, -hw + r)}L${q(x1, hw - r)}A${r} ${r} 0 0 1 ${q(x1 - r, hw)}L${q(x0 + r, hw)}A${r} ${r} 0 0 1 ${q(x0, hw - r)}L${q(x0, -hw + r)}A${r} ${r} 0 0 1 ${q(x0 + r, -hw)}Z`
}
const ball = (cx, cy, x, y, r) => { const [px, py] = W(cx, cy, x, y).split(' '); return `M${f(px - r)} ${py}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0z` }
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ln = (d, c, w, op, cls) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round' }, cls)

export default function render() {
  const cx = 11.6, cy = 11.9, dx = 0.55, dy = 0.7
  // each handle: a slim stem and a round knob, as separate shapes (one path would cancel where they overlap)
  const H = (x, y) => [bar(x, y, -9.4, -6, 1.05, 0.9), bar(x, y, 6, 9.4, 1.05, 0.9)]
  const B = (x, y) => [ball(x, y, -9.3, 0, 1.5), ball(x, y, 9.3, 0, 1.5)]
  const handle = (x, y, paint) => [...H(x, y), ...B(x, y)].map(d => P(d, paint, 'wm-a'))
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.5), stop(0.38, C.shine, 0.04), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.3)]]]],
    P(`M${f(cx - 8.6)} 21.6a8.6 1.2 0 1 0 17.2 0a8.6 1.2 0 1 0 -17.2 0z`, { fill: C.shadow, 'fill-opacity': 0.07 }, 'wm-shadow'),
    P(`M${f(cx - 6.4)} 21.6a6.4 0.85 0 1 0 12.8 0a6.4 0.85 0 1 0 -12.8 0z`, { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-shadow'),
    // thickness under handles and barrel
    ...handle(cx + dx, cy + dy, { fill: C.c2 }),
    ...handle(cx + dx, cy + dy, { fill: C.shadow, 'fill-opacity': 0.4 }),
    P(bar(cx + dx, cy + dy, -6.2, 6.2, 3.4, 1.8), { fill: C.c1 }),
    P(bar(cx + dx, cy + dy, -6.2, 6.2, 3.4, 1.8), { fill: C.shadow, 'fill-opacity': 0.4 }),
    // handles
    ...handle(cx, cy, { fill: C.c2 }),
    ...handle(cx, cy, { fill: g }),
    // barrel
    P(bar(cx, cy, -6.2, 6.2, 3.4, 1.8), { fill: C.c1 }),
    P(bar(cx, cy, -6.2, 6.2, 3.4, 1.8), { fill: g }),
    // where the barrel meets the handles: a soft dark collar
    ln(`M${W(cx, cy, -6.1, -2.4)}L${W(cx, cy, -6.1, 2.4)}M${W(cx, cy, 6.1, -2.4)}L${W(cx, cy, 6.1, 2.4)}`, C.shadow, 0.7, 0.2, 'wm-k'),
    // wood grain
    ln(`M${W(cx, cy, -3.4, 0.9)}L${W(cx, cy, 2.2, 0.9)}M${W(cx, cy, -1.6, 2.1)}L${W(cx, cy, 4, 2.1)}`, C.shadow, 0.45, 0.14, 'wm-deco'),
    // lit stripe along the barrel and on the handles
    ln(`M${W(cx, cy, -5, -2.1)}L${W(cx, cy, 4.6, -2.1)}`, C.shine, 0.8, 0.5, 'wm-shine'),
    ln(`M${W(cx, cy, -8.8, -0.5)}L${W(cx, cy, -6.6, -0.5)}M${W(cx, cy, 6.8, -0.5)}L${W(cx, cy, 9.2, -0.5)}`, C.shine, 0.5, 0.45, 'wm-shine'),
  ]
}
