// forge/hand/soft3d/settings-2.mjs: two straight horizontal slider rails, each a recessed pill groove, with a round
// glossy knob on each (top left, bottom right) as in the line design, keeping the soft 3D dome shading. It replaces the
// generated tapered wrench-like metal bars.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'settings-2'
const f = n => +n.toFixed(2)

export default function render() {
  const g0 = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`
  const RAIL = v('c1', '#7C8696'), KNOB = v('c3', '#3D7BF7'), CORE = v('c2', '#E6EAF0')
  const rim = (d, o = 0.34, cls = 'wm-k') => ['path', { d, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': o, 'stroke-linejoin': 'round', class: cls }]
  const pill = (x, y, w, h) => { const r = h / 2; return `M${f(x + r)} ${y}h${f(w - h)}a${r} ${r} 0 0 1 0 ${h}h-${f(w - h)}a${r} ${r} 0 0 1 0-${h}z` }
  const rail = y => {
    const d = pill(2.2, y, 19.6, 2.6)
    return [['path', { d, fill: RAIL, class: 'wm-k' }], ['path', { d, fill: g1, class: 'wm-k' }], rim(d, 0.4),
      ['path', { d: `M3.8 ${f(y + 2)}h16.4`, stroke: SN, 'stroke-width': 0.4, 'stroke-opacity': 0.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }]]
  }
  const knob = (cx, cy) => [
    ['circle', { cx: f(cx + 0.45), cy: f(cy + 1.05), r: 3.5, fill: SH, 'fill-opacity': 0.18, class: 'wm-shadow' }],
    ['circle', { cx, cy, r: 3.6, fill: KNOB, class: 'wm-a' }],
    ['circle', { cx, cy, r: 3.6, fill: g0, class: 'wm-a' }],
    ['circle', { cx, cy, r: 3.6, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': 0.36, class: 'wm-a' }],
    ['circle', { cx, cy, r: 1.55, fill: CORE, class: 'wm-a' }],
    ['circle', { cx, cy, r: 1.55, fill: g1, class: 'wm-a' }],
    ['circle', { cx, cy, r: 1.55, fill: 'none', stroke: SH, 'stroke-width': 0.35, 'stroke-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: `M${f(cx - 2.6)} ${f(cy - 1.2)}q.6-1.4 2-2.1`, stroke: SN, 'stroke-width': 0.6, 'stroke-opacity': 0.65, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, SN, 0.6), stop(0.38, SN, 0.06), stop(0.7, SH, 0), stop(1, SH, 0.3)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SH, 0.3), stop(0.45, SH, 0.02), stop(1, SN, 0.3)]],
    ]],
    ...rail(5.7),
    ...rail(15.7),
    ...knob(6.8, 7),
    ...knob(17.2, 17),
  ]
}
