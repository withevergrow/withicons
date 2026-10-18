// forge/hand/halloween/compass.mjs — a pumpkin-orange case ring round a bone-white face whose big diagonal needle (north
// half witch purple, south half pumpkin, the A part) dominates; replaces the solid orange disc with a tiny hollow needle and bat.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const EDGE = V('edge', '#7344C9'), TINT = V('tint', '#FFF1B8'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-compass-${n}`

export default function render() {
  const north = 'M16.4 7.6L14.3 14.3L9.7 9.7Z'
  const south = 'M7.6 16.4L9.7 9.7L14.3 14.3Z'
  const needle = 'M16.4 7.6L14.3 14.3L7.6 16.4L9.7 9.7Z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.6, r: 13.8, fx: 8.6, fy: 8.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.6, r: 8, fx: 10, fy: 9.6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE }], ['stop', { offset: 0.55, 'stop-color': SHINE }], ['stop', { offset: 1, 'stop-color': TINT }]]],
      ['linearGradient', { id: id(2), x1: 10.5, y1: 8, x2: 15.5, y2: 13, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }], ['stop', { offset: 1, 'stop-color': EDGE }]]],
      ['radialGradient', { id: id(3), cx: 12, cy: 13.05, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(3)})`, class: 'wm-deco' }],
    ['circle', { cx: 12.15, cy: 12.85, r: 9.5, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the face, then the case ring over its edge (ink rim on both sides)
    ['circle', { cx: 12, cy: 12, r: 7.6, fill: `url(#${id(1)})`, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 8.5, stroke: INK, 'stroke-width': 2.72, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 8.5, stroke: `url(#${id(0)})`, 'stroke-width': 2, class: 'wm-k' }],
    // north, east, south, west ticks on the face
    ['path', { d: 'M12 5.3V6.2M18.7 12H17.8M12 18.7V17.8M5.3 12H6.2', stroke: INK, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.55, class: 'wm-k' }],
    // the needle: a soft shadow on the face, the two halves, one ink rim, a pivot
    ['path', { d: 'M16.55 8.3L14.45 15L7.75 17.1L9.85 10.4Z', fill: SHADOW, 'fill-opacity': 0.22, class: 'wm-a' }],
    ['path', { d: north, fill: `url(#${id(2)})`, class: 'wm-a' }],
    ['path', { d: south, fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: needle, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M15.5 8.25L11.4 9.55', stroke: SHINE, 'stroke-opacity': 0.5, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 12, r: 0.75, fill: INK, class: 'wm-a' }],
    // the lit upper-left shoulder of the case
    ['path', { d: 'M3.54 8.92A9 9 0 0 1 8.92 3.54', stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
