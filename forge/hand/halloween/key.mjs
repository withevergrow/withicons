// forge/hand/halloween/key.mjs — a pumpkin key matching its hand-drawn sibling key-round: a round bow with a dark carved
// hole, a 2.6u shaft and two big square-cut teeth, one seamless silhouette in the midnight outline on the warm halo. The
// generated key was midnight-black with a small bow and stubby teeth, so its silhouette blurred into the halo (and
// vanished on dark) at 16px.
import { unionSets, translateSet, erode, differenceSets, strokeSet, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
import { area, setD, circle } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

const f2 = v => Math.round(v * 100) / 100
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const bboxOf = set => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of set) for (const [x, y] of r) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return [x0, y0, x1, y1]
}
// the style's shine: a crescent on the lit upper-left shoulder (_halloween-core.mjs SHINE_IN / SHINE_DX / SHINE_DY)
const crescent = set => {
  const inner = erode(set, 0.62)
  return differenceSets(inner, translateSet(inner, 0.5, 0.62)).filter(r => Math.abs(area(r)) > 0.12)
}

export default function render(icon) {
  const name = (icon && icon.name) || 'key'
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const bow = normalize(circle(7.9, 16.1, 5.1, 0.15))
  const shaft = roundStrokeSet([[11.4, 12.6], [20.2, 3.8]], 2.6)
  const teeth = unionSets([strokeSet([[18.3, 5.7], [20.75, 8.15]], 2.3), strokeSet([[15.1, 8.9], [17.55, 11.35]], 2.3)])
  const key = unionSets([bow, shaft, teeth])
  const [x0, y0, x1, y1] = bboxOf(key)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(1), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(0), class: 'wm-deco' }],
    ['path', { d: setD(translateSet(key, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: setD(key), fill: url(1), 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: setD(crescent(key)), fill: C.shine, 'fill-opacity': 0.55, class: 'wm-shine' }],
    // the carved hole in the bow, dark like a keyhole
    ['path', { d: setD(normalize(circle(7.9, 16.1, 1.7, 0.15))), fill: C.ink, class: 'wm-k' }],
  ]
}
