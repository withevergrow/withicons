// forge/hand/soft3d/dumbbell.mjs: a front-on soft 3D dumbbell as in the line design: two tall rounded plates per side
// (a big inner plate, a smaller outer plate), a small end cap and a steel bar between, each a glossy extruded pill.
// It replaces the generated block cluster that read as a grey chair.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'dumbbell'

export default function render() {
  const g0 = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`
  const BIG = v('c1', '#505A6E'), MID = v('c2', '#8A93A3'), BAR = v('c3', '#D3D8E0'), ACC = v('accent', '#E5483F')
  const rim = (d, o = 0.34) => ['path', { d, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': o, 'stroke-linejoin': 'round', class: 'wm-k' }]
  const f = n => +n.toFixed(2)
  const pill = (x, y, w, h, r) => `M${f(x + r)} ${y}h${f(w - 2 * r)}a${r} ${r} 0 0 1 ${r} ${r}v${f(h - 2 * r)}a${r} ${r} 0 0 1-${r} ${r}h-${f(w - 2 * r)}a${r} ${r} 0 0 1-${r}-${r}v-${f(h - 2 * r)}a${r} ${r} 0 0 1 ${r}-${r}z`
  const part = (d, fill, g = g0) => [['path', { d, fill, class: 'wm-k' }], ['path', { d, fill: g, class: 'wm-k' }], rim(d)]
  const out = [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.22, r: 1.0 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.32)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.6), stop(0.3, SN, 0.08), stop(0.62, SH, 0.04), stop(1, SH, 0.42)]],
    ]],
    ['ellipse', { cx: 12, cy: 21.7, rx: 9.2, ry: 0.9, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.7, rx: 6.4, ry: 0.6, fill: SH, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ...part(pill(8.6, 10.7, 6.8, 2.6, 1.3), BAR, g1),
    ['path', { d: 'M9.6 11.3h4.8', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.75, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
  // left side, mirrored by hand around x = 12
  for (const s of [0, 1]) {
    const m = (x, w) => f(s ? 24 - x - w : x)
    out.push(...part(pill(m(1.7, 1.7), 9.1, 1.7, 5.8, 0.85), MID))
    out.push(...part(pill(m(3.2, 2.6), 6.4, 2.6, 11.2, 1.2), MID))
    out.push(...part(pill(m(5.5, 3.9), 3.9, 3.9, 16.2, 1.6), BIG))
    const hx = f(m(5.5, 3.9) + 0.85)
    out.push(['path', { d: `M${hx} 6.4v11.2`, stroke: SN, 'stroke-width': 0.55, 'stroke-opacity': 0.42, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  }
  return out
}
