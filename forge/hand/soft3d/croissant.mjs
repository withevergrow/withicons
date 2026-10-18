// forge/hand/soft3d/croissant.mjs: the front-facing arched croissant (as the line icon): a central dome with two flanking lobes
// and two tapering tips, the creases between them as dark grooves, a pale baked sheen on each lobe, a thickness under the
// belly and a soft contact shadow. Replaces the generated tilted, stacked roll.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F5A524'), c2: v('c2', '#FFD98A'), c3: v('c3', '#B8661E'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const N = 'croissant'
const g = i => `url(#wg-soft3d-${N}-${i})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ln = (d, c, w, op, cls) => P(d, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls)
const E = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`

// the silhouette: a scalloped crescent (two tips at the bottom, the belly arching up between them)
const sil = dy => `M3.2 ${19 + dy}C2.3 ${16.8 + dy} 2.7 ${14 + dy} 4.3 ${12.6 + dy}C4.6 ${9.8 + dy} 6.6 ${8 + dy} 8.6 ${8.1 + dy}C9.2 ${5.9 + dy} 10.5 ${4.8 + dy} 12 ${4.8 + dy}C13.5 ${4.8 + dy} 14.8 ${5.9 + dy} 15.4 ${8.1 + dy}C17.4 ${8 + dy} 19.4 ${9.8 + dy} 19.7 ${12.6 + dy}C21.3 ${14 + dy} 21.7 ${16.8 + dy} 20.8 ${19 + dy}C19.6 ${19.4 + dy} 18.6 ${18.6 + dy} 18 ${17.6 + dy}C16.6 ${16 + dy} 14.6 ${15.3 + dy} 12 ${15.3 + dy}C9.4 ${15.3 + dy} 7.4 ${16 + dy} 6 ${17.6 + dy}C5.4 ${18.6 + dy} 4.4 ${19.4 + dy} 3.2 ${19 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0.2, y1: 0, x2: 0.8, y2: 1 }, [
      stop(0, C.shine, 0.42), stop(0.4, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.26)]]]],
    P(E(12.5, 20.6, 9.6, 1.5), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(E(12.5, 20.6, 7.6, 1.2), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(E(12.5, 20.6, 5.4, 0.85), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // thickness
    P(sil(0.8), { fill: C.c1 }),
    P(sil(0.8), { fill: C.shadow, 'fill-opacity': 0.42 }),
    // the body
    P(sil(0), { fill: C.c1 }),
    P(sil(0), { fill: g(0) }),
    // pale baked sheen on each lobe
    P(E(12, 8.2, 1.9, 1.5), { fill: C.c2, 'fill-opacity': 0.75 }, 'wm-k'),
    P(E(6.8, 12.4, 1.2, 1.7), { fill: C.c2, 'fill-opacity': 0.6 }, 'wm-k'),
    P(E(17.2, 12.4, 1.2, 1.7), { fill: C.c2, 'fill-opacity': 0.4 }, 'wm-k'),
    // creases: a light lip below a dark groove
    ln('M8.7 8.6C8.3 10.4 8.5 12.4 9.9 14.6M15.3 8.6C15.7 10.4 15.5 12.4 14.1 14.6', C.shine, 0.9, 0.3, 'wm-k'),
    ln('M4.5 13.2C4.6 14.4 5.2 15.5 6.3 16.4M19.5 13.2C19.4 14.4 18.8 15.5 17.7 16.4', C.shine, 0.9, 0.22, 'wm-k'),
    ln('M8.5 8.4C8.1 10.2 8.3 12.2 9.7 14.4M15.5 8.4C15.9 10.2 15.7 12.2 14.3 14.4', C.c3, 1, 0.9, 'wm-k'),
    ln('M4.4 13C4.5 14.2 5.1 15.3 6.2 16.2M19.6 13C19.5 14.2 18.9 15.3 17.8 16.2', C.c3, 1, 0.85, 'wm-k'),
    // lit rim on the upper left of the dome and the left lobe
    ln('M9.6 6.9C10.2 5.9 11 5.5 12 5.5', C.shine, 0.7, 0.75, 'wm-shine'),
    ln('M5.4 11.2C6 10 6.9 9.3 8 9', C.shine, 0.6, 0.55, 'wm-shine'),
    // the belly's own soft dark where the underside curls
    ln('M6.6 17.3C8 15.9 9.8 15.5 12 15.5C14.2 15.5 16 15.9 17.4 17.3', C.shadow, 0.8, 0.18, 'wm-k'),
  ]
}
