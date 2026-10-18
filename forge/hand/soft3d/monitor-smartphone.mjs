// forge/hand/soft3d/monitor-smartphone.mjs: the line design as soft 3D: a front-facing monitor (dark bezel, glossy blue
// screen, centred neck and oval foot) with a separate upright silver phone standing at its lower right, overlapping the
// bezel corner. It replaces the generated dark angled box with an orange phone wrapped around it.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'monitor-smartphone'

export default function render() {
  const g0 = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`, g2 = `url(#wg-soft3d-${N}-2)`
  const FRAME = v('c1', '#4A5160'), SCR = v('c2', '#3D8BFF'), SILV = v('c3', '#D3D8E0'), INK = v('ink', '#1F232C')
  const rim = (d, o = 0.34, cls = 'wm-k') => ['path', { d, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': o, 'stroke-linejoin': 'round', class: cls }]
  const part = (d, fill, g = g0, cls = 'wm-k') => [['path', { d, fill, class: cls }], ['path', { d, fill: g, class: cls }], rim(d, 0.34, cls)]
  const MON = 'M4.3 2.8h12.4a2.3 2.3 0 0 1 2.3 2.3v8.9a2.3 2.3 0 0 1-2.3 2.3H4.3A2.3 2.3 0 0 1 2 14V5.1a2.3 2.3 0 0 1 2.3-2.3z'
  const SCREEN = 'M4.4 4.3h11.6a1 1 0 0 1 1 1v7.7a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1V5.3a1 1 0 0 1 1-1z'
  const NECK = 'M8.9 16.2h2.7l.6 3.1H8.3z'
  const FOOT = 'M5.8 19.2h8.9a1.1 1.1 0 0 1 1.1 1.1v.2a1.1 1.1 0 0 1-1.1 1.1H5.8a1.1 1.1 0 0 1-1.1-1.1v-.2a1.1 1.1 0 0 1 1.1-1.1z'
  const PHONE = 'M17.7 9.3h2.5a1.9 1.9 0 0 1 1.9 1.9v9.3a1.9 1.9 0 0 1-1.9 1.9h-2.5a1.9 1.9 0 0 1-1.9-1.9v-9.3a1.9 1.9 0 0 1 1.9-1.9z'
  const PSCR = 'M17.9 10.7h2.1a.8.8 0 0 1 .8.8v7.5a.8.8 0 0 1-.8.8h-2.1a.8.8 0 0 1-.8-.8v-7.5a.8.8 0 0 1 .8-.8z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 1.0 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.3)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.4), stop(1, SH, 0.32)]],
      ['linearGradient', { id: `wg-soft3d-${N}-2`, x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.5), stop(0.5, SN, 0.05), stop(1, SH, 0.4)]],
    ]],
    ['ellipse', { cx: 12, cy: 22.5, rx: 10, ry: 0.7, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 11.5, cy: 22.5, rx: 7, ry: 0.5, fill: SH, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ...part(NECK, SILV, g1, 'wm-a'),
    ...part(FOOT, SILV, g1, 'wm-a'),
    ...part(MON, FRAME),
    ['path', { d: SCREEN, fill: SCR, class: 'wm-k' }],
    ['path', { d: SCREEN, fill: g2, class: 'wm-k' }],
    ['path', { d: 'M4.8 12.6L9.4 5.2h2.7L7.5 12.6z', fill: SN, 'fill-opacity': 0.2, class: 'wm-shine' }],
    ['path', { d: SCREEN, fill: 'none', stroke: SH, 'stroke-width': 0.4, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4 3.7h11.5', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ...part(PHONE, SILV, g0, 'wm-s'),
    ['path', { d: PSCR, fill: INK, class: 'wm-s' }],
    ['path', { d: 'M18.3 12.6l1.9-1.7v1.6l-1.9 1.7z', fill: SN, 'fill-opacity': 0.22, class: 'wm-shine' }],
    ['path', { d: 'M18.5 21.2h1.4', stroke: INK, 'stroke-width': 0.6, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
    ['path', { d: 'M18.2 9.9h1.8', stroke: SN, 'stroke-width': 0.45, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
