// forge/hand/soft3d/webcam.mjs: an upright webcam: a round dark head with a silver bezel and a deep blue lens (concentric
// rings, a glint and a status light), on a short tapered stalk and a rounded foot, lit from the upper left. It replaces
// the generated tilted boxy camera with a floating slab.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'webcam'

export default function render() {
  const C1 = v('c1', '#2A2E36'), C2 = v('c2', '#BFC7D2'), TINT = v('tint', '#A9D8F2'), INK = v('ink', '#232733'), LED = v('c3', '#3DDC84')
  const head = `url(#wg-soft3d-${N}-0)`, ring = `url(#wg-soft3d-${N}-1)`, lens = `url(#wg-soft3d-${N}-2)`
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.22, r: 1 }, [stop(0, SN, 0.4), stop(0.35, SN, 0.05), stop(0.65, SH, 0), stop(1, SH, 0.35)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN), stop(0.45, C2), stop(1, C2)]],
      ['radialGradient', { id: `wg-soft3d-${N}-2`, cx: 0.4, cy: 0.35, r: 0.8 }, [stop(0, TINT), stop(0.5, INK), stop(1, INK)]],
    ]],
    ['path', { d: 'M4.6 21.4a7.4 1.3 0 1 0 14.8 0a7.4 1.3 0 1 0 -14.8 0z', fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: 'M6.1 21.4a5.9 1.04 0 1 0 11.8 0a5.9 1.04 0 1 0 -11.8 0z', fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: 'M7.7 21.4a4.3 0.76 0 1 0 8.6 0a4.3 0.76 0 1 0 -8.6 0z', fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['rect', { x: 6, y: 19, width: 12, height: 2.6, rx: 1.3, fill: C2, class: 'wm-k' }],
    ['rect', { x: 6, y: 19, width: 12, height: 2.6, rx: 1.3, fill: SH, 'fill-opacity': 0.25, class: 'wm-k' }],
    ['rect', { x: 6, y: 18.5, width: 12, height: 2.5, rx: 1.25, fill: C2, class: 'wm-k' }],
    ['path', { d: 'M7.6 19.1h8.8', fill: 'none', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M10.5 16h3l.7 3h-4.4z', fill: C2, class: 'wm-k' }],
    ['path', { d: 'M10.5 16h3l.7 3h-4.4z', fill: SH, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 10.8, r: 7.4, fill: INK, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 10, r: 7.4, fill: C1, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 10, r: 7.4, fill: head, class: 'wm-k' }],
    ['path', { d: 'M6.2 6.6A6.7 6.7 0 0 1 11 3.5', fill: 'none', stroke: SN, 'stroke-width': 0.7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 10, r: 4.6, fill: ring, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 10, r: 3.6, fill: INK, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 10, r: 2.9, fill: lens, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 10, r: 1.2, fill: INK, class: 'wm-a' }],
    ['circle', { cx: 10.9, cy: 8.9, r: 0.7, fill: SN, 'fill-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 4.9, r: 0.55, fill: LED, class: 'wm-s' }],
  ]
}
