// forge/hand/soft3d/coffee.mjs — a round ceramic mug seen a little from above (thick lit rim around a dark coffee surface,
// a chunky looped handle on the right, two soft steam wisps), replacing the generated extruded box whose thin walls,
// flat lid and bean-like brown steam did not read as a cup at 16px. Same studio recipe as the hand-drawn cup-soda.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const MUG = v('c1', '#EEF1F5'), COFFEE = v('c3', '#6B3F2A'), STEAM = v('c4', '#BFC7D2')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-coffee-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    // the cylinder's roundness: lit on the left, turning into shadow on the right
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.2), stop(0.18, SN, 0.5), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.3)]],
    // the coffee surface and the rim top: light from the upper left
    ['radialGradient', { id: id(1), cx: 0.3, cy: 0.25, r: 0.95 }, [stop(0, SN, 0.55), stop(0.4, SN, 0.06), stop(0.75, SH, 0), stop(1, SH, 0.25)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  // mug: x 3.75..16.25 (cx 10), rim ellipse at y 8.5 (ry 1.75), bottom at y 19.75 with rounded heel
  const body = 'M3.75 8.5 V17.75 C3.75 19.75 6.5 21 10 21 C13.5 21 16.25 19.75 16.25 17.75 V8.5 Z'
  const rimTop = 'M3.75 8.5 A6.25 1.75 0 1 0 16.25 8.5 A6.25 1.75 0 1 0 3.75 8.5 Z'
  const mouth = 'M5 8.6 A5 1.3 0 1 0 15 8.6 A5 1.3 0 1 0 5 8.6 Z'          // inside the thick rim
  const surface = 'M5.35 9.05 A4.65 1.05 0 1 0 14.65 9.05 A4.65 1.05 0 1 0 5.35 9.05 Z'
  const handle = 'M16 10.75 C20.6 10.25 21.1 17.4 16 17'
  return [
    defs,
    // contact shadow
    P('M4.4 21.1 A6.9 1.5 0 1 0 18.2 21.1 A6.9 1.5 0 1 0 4.4 21.1 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M5.8 21.1 A5.5 1.2 0 1 0 16.8 21.1 A5.5 1.2 0 1 0 5.8 21.1 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M7.3 21.1 A4 0.88 0 1 0 15.3 21.1 A4 0.88 0 1 0 7.3 21.1 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the handle: a thick ceramic loop, a darker underside, a lit upper edge
    S(handle, MUG, 2.4, {}, 'wm-a'),
    S(handle, SH, 2.4, { 'stroke-opacity': 0.2 }, 'wm-a'),
    S('M16.4 11.6 C19.3 11.5 19.7 16 16.4 16.15', SH, 0.55, { 'stroke-opacity': 0.3 }, 'wm-a'),
    S('M16.6 10.05 C18.6 10 19.85 11.4 20.05 13', SN, 0.5, { 'stroke-opacity': 0.75 }, 'wm-shine'),
    // the body
    P(body, { fill: MUG }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    // a lit rim down the left, a dark heel on the lower right
    S('M4.75 10.8 V17.6', SN, 0.6, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    S('M15.75 11.5 V17.7 C15.75 19.3 13.4 20.45 10 20.45 C8.8 20.45 7.75 20.3 6.9 20.05', SH, 0.5, { 'stroke-opacity': 0.32 }, 'wm-k'),
    // AO just under the rim
    P('M3.75 9 A6.25 1.75 0 0 0 16.25 9 V10 A6.25 1.75 0 0 1 3.75 10 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-k'),
    // the thick rim, the inner wall, the coffee
    P(rimTop, { fill: MUG }, 'wm-k'),
    P(rimTop, { fill: g1 }, 'wm-k'),
    P(mouth, { fill: SH, 'fill-opacity': 0.32 }, 'wm-k'),
    P(surface, { fill: COFFEE }, 'wm-k'),
    P(surface, { fill: g1 }, 'wm-k'),
    S('M6.6 8.55 C7.8 8.05 9.2 7.9 10.6 7.95', SN, 0.4, { 'stroke-opacity': 0.5 }, 'wm-shine'),
    S('M4.6 7.95 C5.6 7.25 7.4 6.85 9.4 6.78', SN, 0.5, { 'stroke-opacity': 0.9 }, 'wm-shine'),
    // steam: two soft wisps rising from the coffee
    S('M8 6.25 C6.8 5.25 9.2 4.25 8 2.75', STEAM, 1.3, {}, 'wm-a'),
    S('M12 6.25 C10.8 5.25 13.2 4.25 12 2.75', STEAM, 1.3, {}, 'wm-a'),
  ]
}
