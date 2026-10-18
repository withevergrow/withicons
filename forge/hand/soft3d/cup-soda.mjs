// forge/hand/soft3d/cup-soda.mjs — a round, tapered takeaway cup seen a little from above (red cone with a white label
// band, a wide white lid rim and dome, a dark straw), replacing the generated extruded box that read as a bucket or bin
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C1 = v('c1', '#E5483F'), LID = v('c2', '#EEF1F5'), STRAW = v('c3', '#3A404C'), BAND = v('c4', '#EEF1F5')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-cup-soda-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

export default function render() {
  const defs = ['defs', {}, [
    // a cylinder's roundness: lit on the left, turning into shadow on the right
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.18), stop(0.16, SN, 0.42), stop(0.4, SN, 0), stop(0.6, SH, 0), stop(1, SH, 0.34)]],
    // soft dome / lid top: the light from the upper left
    ['radialGradient', { id: id(1), cx: 0.34, cy: 0.28, r: 0.9 }, [stop(0, SN, 0.7), stop(0.42, SN, 0.08), stop(0.75, SH, 0), stop(1, SH, 0.22)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  const body = 'M5.75 9 L7.5 20.25 A4.5 1.25 0 0 0 16.5 20.25 L18.25 9 Z'
  const band = 'M6.27 12.5 A5.73 1.45 0 0 0 17.73 12.5 L17.23 15.75 A5.23 1.35 0 0 1 6.77 15.75 Z'
  const rim = 'M4.75 7.75 V8.75 A7.25 1.75 0 0 0 19.25 8.75 V7.75 Z'
  const rimTop = 'M4.75 7.75 A7.25 1.75 0 1 0 19.25 7.75 A7.25 1.75 0 1 0 4.75 7.75 Z'
  const dome = 'M6.75 7.5 C6.75 4.75 17.25 4.75 17.25 7.5 A5.25 1.25 0 0 1 6.75 7.5 Z'
  return [
    defs,
    // contact shadow
    ['path', { d: 'M5.6 21 A6.75 1.6 0 1 0 19.1 21 A6.75 1.6 0 1 0 5.6 21 Z', fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: 'M6.95 21 A5.4 1.28 0 1 0 17.75 21 A5.4 1.28 0 1 0 6.95 21 Z', fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: 'M8.44 21 A3.91 0.93 0 1 0 16.26 21 A3.91 0.93 0 1 0 8.44 21 Z', fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    // the cup
    ['path', { d: body, fill: C1, class: 'wm-k' }],
    ['path', { d: band, fill: BAND, class: 'wm-k' }],
    ['path', { d: body, fill: g0, class: 'wm-k' }],
    // ambient occlusion under the lid, a lit rim down the left side, a dark edge on the lower right
    ['path', { d: 'M5.87 9.75 A6.13 1.6 0 0 0 18.13 9.75 L17.96 10.85 A5.96 1.55 0 0 1 6.04 10.85 Z', fill: SH, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: 'M6.6 11 L7.85 19.6', fill: 'none', stroke: SN, 'stroke-width': 0.55, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M17.7 11.5 L16.4 20.1 C16.1 21 14.6 21.5 12 21.5 C10.6 21.5 9.4 21.35 8.6 21.05', fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': 0.38, 'stroke-linecap': 'round', class: 'wm-k' }],
    // the lid: rim, its top, the dome
    ['path', { d: rim, fill: LID, class: 'wm-k' }],
    ['path', { d: rim, fill: g0, class: 'wm-k' }],
    ['path', { d: rimTop, fill: LID, class: 'wm-k' }],
    ['path', { d: rimTop, fill: g1, class: 'wm-k' }],
    ['path', { d: 'M19.1 8.6 A7.25 1.75 0 0 1 4.9 8.6', fill: 'none', stroke: SH, 'stroke-width': 0.45, 'stroke-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: 'M6.75 7.5 A5.25 1.25 0 0 0 17.25 7.5', fill: 'none', stroke: SH, 'stroke-width': 0.6, 'stroke-opacity': 0.2, class: 'wm-k' }],
    ['path', { d: dome, fill: LID, class: 'wm-k' }],
    ['path', { d: dome, fill: g1, class: 'wm-k' }],
    ['path', { d: 'M8 6.4 C8.6 5.5 10 5.05 11.5 4.95', fill: 'none', stroke: SN, 'stroke-width': 0.55, 'stroke-opacity': 0.85, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M11.4 6.3 A1.3 0.45 0 1 0 14 6.3 A1.3 0.45 0 1 0 11.4 6.3 Z', fill: SH, 'fill-opacity': 0.18, class: 'wm-k' }],
    // the straw: through the dome, bent toward the upper right
    ['path', { d: 'M12.6 6 L14 1.85 H16.75', fill: 'none', stroke: SH, 'stroke-width': 1.75, 'stroke-opacity': 0.25, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M12.6 6 L14 1.85 H16.75', fill: 'none', stroke: STRAW, 'stroke-width': 1.35, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M12.55 5.1 L13.7 1.7 H16.6', fill: 'none', stroke: SN, 'stroke-width': 0.35, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
