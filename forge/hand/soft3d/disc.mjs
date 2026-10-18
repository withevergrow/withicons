// forge/hand/soft3d/disc.mjs: a compact disc shown face-on (the generated drawing was a tilted puck with an off-centre
// hole): a glossy round face with two soft light wedges, the upper-left arc, a silver hub and a centred hole, standing
// on a soft contact shadow with a thin lower rim for depth.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'disc'

export default function render() {
  const C1 = v('c1', '#4FB463'), C2 = v('c2', '#EEF1F5'), C3 = v('c3', '#5BB8E8')
  const face = `url(#wg-soft3d-${N}-0)`, hub = `url(#wg-soft3d-${N}-1)`
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.25, r: 0.95 }, [stop(0, SN, 0.45), stop(0.4, SN, 0.04), stop(0.7, SH, 0), stop(1, SH, 0.28)]],
      ['radialGradient', { id: `wg-soft3d-${N}-1`, cx: 0.35, cy: 0.3, r: 0.85 }, [stop(0, SN), stop(0.5, C2), stop(1, C2)]],
    ]],
    ['path', { d: 'M3.6 21.6a8.4 1.4 0 1 0 16.8 0a8.4 1.4 0 1 0 -16.8 0z', fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: 'M5.28 21.6a6.72 1.12 0 1 0 13.44 0a6.72 1.12 0 1 0 -13.44 0z', fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: 'M7.38 21.6a4.62 0.8 0 1 0 9.24 0a4.62 0.8 0 1 0 -9.24 0z', fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12.4, r: 9.5, fill: C1, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12.4, r: 9.5, fill: SH, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 11.5, r: 9.5, fill: C1, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 11.5, r: 9.5, fill: face, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 11.5, r: 8.6, fill: 'none', stroke: SN, 'stroke-width': 0.35, 'stroke-opacity': 0.35, class: 'wm-k' }],
    ['path', { d: 'M12 11.5L19.2 6.2A9 9 0 0 1 20.9 10.4z', fill: SN, 'fill-opacity': 0.22, class: 'wm-shine' }],
    ['path', { d: 'M12 11.5L4.8 16.8A9 9 0 0 1 3.1 12.6z', fill: SN, 'fill-opacity': 0.22, class: 'wm-shine' }],
    ['path', { d: 'M6.1 11.5A5.9 5.9 0 0 1 12 5.6', fill: 'none', stroke: C3, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.9 9.6A5.9 5.9 0 0 1 9.6 6.8', fill: 'none', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 11.5, r: 3.6, fill: SH, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 11.5, r: 3.4, fill: hub, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 11.5, r: 1.6, fill: SH, 'fill-opacity': 0.75, class: 'wm-k' }],
    ['path', { d: 'M10.6 12.7a1.6 1.6 0 0 0 2.8 0', fill: 'none', stroke: SN, 'stroke-width': 0.35, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
