// forge/hand/dock/circle.mjs — the plain circle as a raised ring control in the light glyph material: a true round ring
// (the generated one was a faceted polygon) around a recessed, darker well, with a bottom lip and a glossy arc on the
// upper-left of the ring, so it reads as an empty radio/status ring rather than a blank tile.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'circle'
const r2 = n => +(+n).toFixed(2)
const disc = (cx, cy, r) => `M${r2(cx + r)} ${r2(cy)}A${r} ${r} 0 1 1 ${r2(cx - r)} ${r2(cy)}A${r} ${r} 0 1 1 ${r2(cx + r)} ${r2(cy)}Z`
const discR = (cx, cy, r) => `M${r2(cx + r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)}Z`

const CX = 12, CY = 11.9, RO = 7, RI = 4.2
const ring = dy => disc(CX, CY + dy, RO) + discR(CX, CY + dy, RI)
// the glossy arc on the ring's upper left (from 200deg to 290deg), drawn as a thin crescent band
function arcBand(a0, a1, rOut, rIn) {
  const p = (a, r) => `${r2(CX + r * Math.cos(a * Math.PI / 180))} ${r2(CY + r * Math.sin(a * Math.PI / 180))}`
  return `M${p(a0, rOut)}A${rOut} ${rOut} 0 0 1 ${p(a1, rOut)}L${p(a1, rIn)}A${rIn} ${rIn} 0 0 0 ${p(a0, rIn)}Z`
}

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'objects' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const LIP = D.LIP
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 4.9, 12, 18.9, [stop(0, 'shine'), stop(1, 'tint')]),
      lin(4, 12, 7.7, 12, 16.1, [stop(0, 'shadow', 0.55), stop(1, 'shadow', 0.15)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // the recessed well inside the ring: darker at the top, as if sunk into the tile
    ['path', { d: disc(CX, CY, RI + 0.1), fill: url(4), class: 'wm-shadow' }],
    // soft shadow of the ring on the tile
    ['path', { d: ring(0.76), fill: v('shadow'), 'fill-opacity': 0.4, 'fill-rule': 'evenodd', stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, class: 'wm-shadow' }],
    // the ring: lip, then the face
    ['path', { d: ring(LIP), fill: url(3), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: ring(LIP), fill: v('shadow'), 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: ring(0), fill: url(3), 'fill-rule': 'evenodd', class: 'wm-k' }],
    // gloss on the upper-left of the ring
    ['path', { d: arcBand(195, 285, RO - 0.7, RO - 1.5), fill: v('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }],
  ]
}
