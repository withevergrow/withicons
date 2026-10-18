// forge/hand/soft3d/toran.mjs — a door garland: a gold rod across the top with three evenly spaced red leaf pendants
// hanging side by side from short gold stems (centre one a little longer), each with a gold midrib. Replaces the generated
// overlapping big centre leaf and two side leaves with no bar. Same studio recipe as the other hand-drawn soft3d icons.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'toran'
const f = x => +x.toFixed(2)
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, op, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round' }, cls)

export default function render() {
  const LEAF = v('c1', '#E5483F'), GOLD = v('c2', '#E9B43A')
  const g = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`
  // a leaf hanging from (x, 6.6): pointed at both ends, belly at about 40% of its length
  const leaf = (x, len) => {
    const y0 = 6.6, y1 = y0 + len, w = 2.5
    return `M${x} ${y0}C${f(x - w * 1.45)} ${f(y0 + len * 0.28)} ${f(x - w * 1.2)} ${f(y0 + len * 0.72)} ${x} ${y1}C${f(x + w * 1.2)} ${f(y0 + len * 0.72)} ${f(x + w * 1.45)} ${f(y0 + len * 0.28)} ${x} ${y0}Z`
  }
  const items = [[6, 11.2], [12, 13.4], [18, 11.2]]
  const out = [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.3)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.4), stop(0.3, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.3)]],
    ]],
    ['ellipse', { cx: 12, cy: 21.4, rx: 8.6, ry: 1.1, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 6.6, ry: 0.85, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 4.4, ry: 0.6, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
  ]
  for (const [x, len] of items) {
    const d = leaf(x, len)
    out.push(
      // stem + bead
      S(`M${x} 4.2V6.9`, GOLD, 1, 1, 'wm-a'),
      P(leaf(x + 0.45, len), { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'),
      P(d, { fill: LEAF }, 'wm-a'),
      P(d, { fill: g1 }, 'wm-a'),
      P(d, { fill: g }, 'wm-a'),
      S(`M${x} 8.3V${f(6.6 + len * 0.72)}`, GOLD, 0.7, 1, 'wm-a'),
      S(`M${f(x - 1.35)} ${f(6.6 + len * 0.3)}C${f(x - 1.5)} ${f(6.6 + len * 0.45)} ${f(x - 1.3)} ${f(6.6 + len * 0.58)} ${f(x - 0.9)} ${f(6.6 + len * 0.66)}`, SN, 0.5, 0.6, 'wm-shine'),
    )
  }
  // the rod: a gold bar with rounded ends, a thin underside and a lit top edge
  out.push(
    P('M4.4 3.4H19.6A1.7 1.7 0 0 1 19.6 6.8H4.4A1.7 1.7 0 0 1 4.4 3.4Z', { fill: SH, 'fill-opacity': 0.35 }, 'wm-k'),
    P('M3.7 2.4H20.3A1.7 1.7 0 0 1 20.3 5.8H3.7A1.7 1.7 0 0 1 3.7 2.4Z', { fill: GOLD }, 'wm-k'),
    P('M3.7 2.4H20.3A1.7 1.7 0 0 1 20.3 5.8H3.7A1.7 1.7 0 0 1 3.7 2.4Z', { fill: `url(#wg-soft3d-${N}-0)` }, 'wm-k'),
    S('M4.6 3.35H19.4', SN, 0.6, 0.7, 'wm-shine'),
  )
  return out
}
