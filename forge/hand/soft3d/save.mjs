// forge/hand/soft3d/save.mjs: the flat, front-facing floppy disk (as the line icon): a navy body with the cut top-right corner,
// a silver shutter with its dark window at the top and a cream label at the bottom, extruded gently (a thickness under it)
// with a soft contact shadow. Replaces the generated tilted cube whose face was hard to read.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#2F4170'), c2: v('c2', '#EEF1F5'), c3: v('c3', '#BFC7D2'), ink: v('ink', '#232733'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const N = 'save'
const g = i => `url(#wg-soft3d-${N}-${i})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ln = (d, c, w, op, cls) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls)
const E = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`

// the body with its cut corner, y 2.6..20.4
const body = dy => `M5.2 ${2.6 + dy}H15.8L20.6 ${7.4 + dy}V${18.4 + dy}A2 2 0 0 1 18.6 ${20.4 + dy}H5.2A2 2 0 0 1 3.2 ${18.4 + dy}V${4.6 + dy}A2 2 0 0 1 5.2 ${2.6 + dy}Z`
const SHUTTER = 'M7.4 2.6H15.2V6.4A1.6 1.6 0 0 1 13.6 8H9A1.6 1.6 0 0 1 7.4 6.4Z'
const WINDOW = 'M9.4 3.9H11.6A.7.7 0 0 1 12.3 4.6V6.2A.7.7 0 0 1 11.6 6.9H9.4A.7.7 0 0 1 8.7 6.2V4.6A.7.7 0 0 1 9.4 3.9Z'
const LABEL = 'M6.4 20.4V14.8A1.6 1.6 0 0 1 8 13.2H16A1.6 1.6 0 0 1 17.6 14.8V20.4Z'

export default function render() {
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 0.95 }, [stop(0, C.shine, 0.5), stop(0.4, C.shine, 0.05), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.28)]]]],
    P(E(12.3, 22.1, 9.2, 1.2), { fill: C.shadow, 'fill-opacity': 0.07 }, 'wm-shadow'),
    P(E(12.3, 22.1, 7, 0.9), { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-shadow'),
    // thickness
    P(body(0.9), { fill: C.c1 }),
    P(body(0.9), { fill: C.shadow, 'fill-opacity': 0.42 }),
    // body
    P(body(0), { fill: C.c1 }),
    P(body(0), { fill: g(0) }),
    // the folded corner: a lit facet
    P('M15.8 2.6L20.6 7.4H17.4A1.6 1.6 0 0 1 15.8 5.8Z', { fill: C.shadow, 'fill-opacity': 0.26 }),
    ln('M16 3.1L20.1 7.2', C.shine, 0.5, 0.4, 'wm-shine'),
    // the label (cream), with two lines of writing
    P(LABEL, { fill: C.c2 }, 'wm-a'),
    P(LABEL, { fill: g(0) }, 'wm-a'),
    ln('M8.6 16.2H15.4M8.6 18.3H13', C.ink, 0.7, 0.3, 'wm-deco'),
    // the shutter (silver) with its dark window
    P('M7.4 3.2H15.2V7A1.6 1.6 0 0 1 13.6 8.6H9A1.6 1.6 0 0 1 7.4 7Z', { fill: C.shadow, 'fill-opacity': 0.34 }, 'wm-a'),
    P(SHUTTER, { fill: C.c3 }, 'wm-a'),
    P(SHUTTER, { fill: g(0) }, 'wm-a'),
    P(WINDOW, { fill: C.ink, 'fill-opacity': 0.82 }, 'wm-a'),
    ln('M8.3 3.3H14.5', C.shine, 0.5, 0.5, 'wm-shine'),
    ln('M3.9 4.6V9', C.shine, 0.55, 0.4, 'wm-shine'),
  ]
}
