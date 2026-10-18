// forge/hand/soft3d/ship.mjs: a level, front-on soft 3D ship as in the line design (navy hull, one white cabin block with
// portholes, a red funnel with a gold band, a wavy sea beneath), replacing the generated tilted isometric hull whose
// bridge read as a padlock.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'ship'

export default function render() {
  const g0 = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`
  const HULL = v('c1', '#2F4170'), CAB = v('c2', '#EEF1F5'), FUN = v('c3', '#E5483F'), GOLD = v('c4', '#F5C14A'), SEA = v('tint', '#8CCBEF'), INK = v('ink', '#232733')
  const rim = (d, cls = 'wm-k', o = 0.3) => ['path', { d, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': o, 'stroke-linejoin': 'round', class: cls }]
  const part = (d, fill, cls = 'wm-k', g = g0) => [['path', { d, fill, class: cls }], ['path', { d, fill: g, class: cls }], rim(d, cls)]
  const FUNNEL = 'M10.2 8V4.3a1.1 1.1 0 0 1 1.1-1.1h1.4a1.1 1.1 0 0 1 1.1 1.1V8z'
  const CABIN = 'M6.4 12.6V9.5a1.9 1.9 0 0 1 1.9-1.9h7.4a1.9 1.9 0 0 1 1.9 1.9v3.1z'
  const HULLD = 'M2.2 12.4h19.6l-2.4 5.4a1.6 1.6 0 0 1-1.45.95H6.05a1.6 1.6 0 0 1-1.45-.95z'
  const WAVE = 'M1.8 19.4q1.3-1.6 2.6 0t2.6 0 2.6 0 2.6 0 2.6 0 2.6 0 2.6 0 2.6 0V21.6a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, SN, 0.5), stop(0.38, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.28)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.35), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
    ]],
    ['ellipse', { cx: 12, cy: 22.3, rx: 9.4, ry: 0.9, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 22.3, rx: 7, ry: 0.6, fill: SH, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ...part(FUNNEL, FUN, 'wm-a'),
    ['path', { d: 'M10.2 4.9h4.2v1.2h-4.2z', fill: GOLD, class: 'wm-a' }],
    ['path', { d: 'M10.4 3.7c.3-.4.6-.5 1-.5', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ...part(CABIN, CAB),
    ...[8.1, 11, 13.9].map(x => ['rect', { x, y: 9.4, width: 2, height: 1.9, rx: 0.6, fill: INK, class: 'wm-k' }]),
    ['path', { d: 'M8.6 9.9l.8-.1M11.5 9.9l.8-.1M14.4 9.9l.8-.1', stroke: SN, 'stroke-width': 0.4, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ...part(HULLD, HULL),
    ['path', { d: 'M3.25 14.4H20.75l-.4.95H3.65z', fill: GOLD, class: 'wm-k' }],
    ['path', { d: 'M2.9 12.9H21.1', stroke: SN, 'stroke-width': 0.55, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: WAVE, fill: SEA, class: 'wm-a' }],
    ['path', { d: WAVE, fill: g1, class: 'wm-a' }],
    rim(WAVE, 'wm-a', 0.32),
    ['path', { d: 'M3.6 19.5q.8-.6 1.6-.2M8.6 19.5q.8-.6 1.6-.2M13.6 19.5q.8-.6 1.6-.2M18.6 19.5q.8-.6 1.6-.2', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
