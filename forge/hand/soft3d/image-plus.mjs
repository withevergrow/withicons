// forge/hand/soft3d/image-plus.mjs: the landscape picture (as the line icon): a framed photo with a sky window, a sun and two
// green hills, extruded gently, and the plus badge floating at the lower right corner in front of it. Replaces the generated
// brown wallet-like object whose picture and plus could not be read.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E9EEF5'), c2: v('c2', '#5BB8E8'), c3: v('c3', '#4FB463'), c4: v('c4', '#FFC93C'), accent: v('accent', '#FF6A4D'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const N = 'image-plus'
const g = i => `url(#wg-soft3d-${N}-${i})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ln = (d, c, w, op, cls, extra = {}) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const E = (cx, cy, rx, ry = rx) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`
const R = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const FRAME = dy => R(2.4, 4 + dy, 21.6, 18.6 + dy, 2.2)
const WIN = R(4.2, 5.8, 19.8, 16.8, 1.2)
// two hills: a high one at the left and a lower one to its right, base on the window's bottom edge
const HILLS = 'M4.2 15.6L8 9.8Q8.6 9 9.2 9.8L13.2 15.5L14.6 13.4Q15.1 12.7 15.6 13.4L19.8 16.8H5.4A1.2 1.2 0 0 1 4.2 15.6Z'
const BX = 17.6, BY = 17.4, BR = 4.6

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 0.95 }, [stop(0, C.shine, 0.5), stop(0.4, C.shine, 0.05), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.28)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, C.shine, 0.4), stop(0.6, C.shine, 0), stop(1, C.shine, 0.18)]],
    ]],
    P(E(12.2, 21.7, 9.6, 1.1), { fill: C.shadow, 'fill-opacity': 0.07 }, 'wm-shadow'),
    P(E(12.2, 21.7, 7.2, 0.8), { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-shadow'),
    // frame: thickness, then the face
    P(FRAME(0.9), { fill: C.c1 }),
    P(FRAME(0.9), { fill: C.shadow, 'fill-opacity': 0.4 }),
    P(FRAME(0), { fill: C.c1 }),
    P(FRAME(0), { fill: g(0) }),
    // the photo, sunk into the frame: a dark inner rim then the sky
    P(R(4.2, 5.5, 19.8, 16.8, 1.2), { fill: C.shadow, 'fill-opacity': 0.3 }),
    P(WIN, { fill: C.c2 }, 'wm-a'),
    P(WIN, { fill: g(1) }, 'wm-a'),
    // sun
    P(E(15.9, 9.6, 1.7), { fill: C.c4 }, 'wm-a'),
    P(E(15.9, 9.6, 1.7), { fill: g(0) }, 'wm-a'),
    // hills
    P(HILLS, { fill: C.c3 }, 'wm-a'),
    P(HILLS, { fill: g(0) }, 'wm-a'),
    P('M13.2 15.5L14.6 13.4Q15.1 12.7 15.6 13.4L19.8 16.8H16Z', { fill: C.shadow, 'fill-opacity': 0.16 }, 'wm-a'),
    ln('M8.3 10.2L5.2 14.8', C.shine, 0.5, 0.4, 'wm-shine'),
    ln('M3.6 6.2C3.9 5.2 4.6 4.7 5.6 4.7', C.shine, 0.6, 0.55, 'wm-shine'),
    // the plus badge floats in front of the corner: a soft shadow, a disc with a lit rim and a white plus
    P(E(BX + 0.35, BY + 0.7, BR + 0.4), { fill: C.shadow, 'fill-opacity': 0.22 }, 'wm-s'),
    P(E(BX, BY, BR), { fill: C.accent }, 'wm-s'),
    P(E(BX, BY, BR), { fill: g(0) }, 'wm-s'),
    ln(`M${BX - 3.3} ${BY - 1.6}A3.7 3.7 0 0 1 ${BX - 0.8} ${BY - 3.5}`, C.shine, 0.6, 0.6, 'wm-shine'),
    ln(`M${BX} ${BY - 2}V${BY + 2}M${BX - 2} ${BY}H${BX + 2}`, C.shine, 1.5, 1, 'wm-s'),
  ]
}
