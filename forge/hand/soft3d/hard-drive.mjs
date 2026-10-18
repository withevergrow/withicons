// forge/hand/soft3d/hard-drive.mjs: a hard drive seen from the front as a soft 3D box: a light top plate, a darker
// front panel with a drive slot and two status lights, and a thin lower wall for depth. It replaces the opened platter
// view, which did not read as a drive at small sizes.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'hard-drive'

export default function render() {
  const C1 = v('c1', '#56617A'), C2 = v('c2', '#C7D3E2'), TINT = v('tint', '#8A9BB4'), INK = v('ink', '#2B3140')
  const LED = v('c3', '#3DDC84'), ACC = v('accent', '#F5A623')
  const top = `url(#wg-soft3d-${N}-0)`, front = `url(#wg-soft3d-${N}-1)`
  const PANEL = 'M2 10.5h20v5.2a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 15.7z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 0.3, y2: 1 }, [stop(0, C2), stop(1, TINT)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0.2, y2: 1 }, [stop(0, C1), stop(1, INK)]],
    ]],
    ['path', { d: 'M2.4 20.4a9.6 1.8 0 1 0 19.2 0a9.6 1.8 0 1 0 -19.2 0z', fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: 'M4.32 20.4a7.68 1.44 0 1 0 15.36 0a7.68 1.44 0 1 0 -15.36 0z', fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: 'M6.43 20.4a5.57 1.04 0 1 0 11.14 0a5.57 1.04 0 1 0 -11.14 0z', fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    ['rect', { x: 2, y: 6, width: 20, height: 14, rx: 2.8, fill: INK, class: 'wm-k' }],
    ['rect', { x: 2, y: 4.5, width: 20, height: 14, rx: 2.8, fill: top, class: 'wm-k' }],
    ['path', { d: PANEL, fill: front, class: 'wm-k' }],
    ['path', { d: 'M2 10.5h20', fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': 0.45, class: 'wm-k' }],
    ['path', { d: 'M4.4 5.7h15.2', fill: 'none', stroke: SN, 'stroke-width': 0.7, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['rect', { x: 5, y: 13, width: 8.5, height: 2.4, rx: 1.2, fill: INK, class: 'wm-k' }],
    ['path', { d: 'M5.8 16.2h6.9', fill: 'none', stroke: SN, 'stroke-width': 0.4, 'stroke-opacity': 0.3, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 17, cy: 14.2, r: 1.7, fill: LED, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['circle', { cx: 17, cy: 14.2, r: 1, fill: LED, class: 'wm-a' }],
    ['circle', { cx: 16.7, cy: 13.9, r: 0.35, fill: SN, 'fill-opacity': 0.85, class: 'wm-a' }],
    ['circle', { cx: 19.7, cy: 14.2, r: 1, fill: ACC, class: 'wm-a' }],
    ['circle', { cx: 19.4, cy: 13.9, r: 0.3, fill: SN, 'fill-opacity': 0.8, class: 'wm-a' }],
  ]
}
