// forge/hand/dock/cpu.mjs — a square chip in the light glyph material with two long, evenly spaced legs per side and a
// big die in the second material (c2, gold by default); the generated glyph had stubby round pins hugging a small cut-out
// core, so at 24 and 16px it read as a gear. Drawn in final tile units with the house tile, drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'cpu'
const r2 = n => +(+n).toFixed(2)
// shift absolute path data (M L H V C Q A Z)
function sh(d, dy) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
  let out = '', i = 0, c = ''
  const n = () => +t[i++]
  const pt = () => `${r2(n())} ${r2(n() + dy)} `
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'M' || c === 'L') out += pt()
    else if (c === 'H') out += r2(n()) + ' '
    else if (c === 'V') out += r2(n() + dy) + ' '
    else if (c === 'Q') out += pt() + pt()
    else if (c === 'C') out += pt() + pt() + pt()
    else if (c === 'A') out += `${n()} ${n()} ${n()} ${n()} ${n()} ` + pt()
    else i++
  }
  return out.replace(/ ([A-Z])/g, '$1').trim()
}
// rounded rectangle, clockwise
const rr = (x0, y0, x1, y1, r) => `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}` +
  `H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}Z`

// the chip body (7..17, a square chip with tight 1.1 corners) and its legs: three per side on 2.6 centres, 1.1 wide,
// 3 long with near-square ends, so the outline reads as a chip (12 legs) and not an 8-tooth cog
const BODY = rr(7, 7, 17, 17, 1.1)
const C3 = [9.4, 12, 14.6]
const LEGS = C3.flatMap(c => [
  rr(r2(c - 0.55), 4.75, r2(c + 0.55), 7.75, 0.28), rr(r2(c - 0.55), 16.25, r2(c + 0.55), 19.25, 0.28),
  rr(4.75, r2(c - 0.55), 7.75, r2(c + 0.55), 0.28), rr(16.25, r2(c - 0.55), 19.25, r2(c + 0.55), 0.28),
]).join('')
const CHIP = BODY + LEGS
// the die: a large 6u square in the second material
const DIE = rr(9, 9, 15, 15, 0.8)
const LIP = D.LIP

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'devices' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  // a raised piece: its darker bottom lip, then the face
  const raised = (d, fill, cls) => [
    ['path', { d: sh(d, LIP), fill, class: cls }],
    ['path', { d: sh(d, LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: cls }],
    ['path', { d, fill, class: cls }],
  ]
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 4.75, 12, 19.25, [stop(0, 'shine'), stop(1, 'tint')]),
      lin(4, 12, 9, 12, 15, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // one soft shadow of the whole chip on the tile
    ['path', { d: sh(CHIP, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the chip
    ...raised(CHIP, url(3), 'wm-k'),
    // the die, set into the chip: the raised gold square with a hairline edge and its sheen
    ...raised(DIE, v('c2'), 'wm-a'),
    ['path', { d: DIE, stroke: v('shadow'), 'stroke-opacity': 0.35, 'stroke-width': 0.25, class: 'wm-a' }],
    ['path', { d: DIE, fill: url(4), class: 'wm-shine' }],
  ]
}
