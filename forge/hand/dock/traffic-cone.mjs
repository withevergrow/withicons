// forge/hand/dock/traffic-cone.mjs — an orange cone (accent) with two bright reflective bands in the light glyph material,
// standing on a wide flat base slab; the generated glyph was all one light material with the bands knocked out as tile
// gaps, so at 24 and 16px it read as a white A or a stacked pyramid. Drawn in final tile units with the house tile,
// drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'traffic-cone'
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
const rr = (x0, y0, x1, y1, r) => `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}` +
  `H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}Z`

// the cone: a rounded tip at 4.9, flanks out to a 11u-wide foot at 17.3 (half-width 1.25 + 0.36 per unit down)
const hw = y => 1.25 + (y - 5.5) * 0.36
const CONE = 'M10.75 5.5C11 4.8 13 4.8 13.25 5.5L17.5 17.3H6.5Z'
const band = (y0, y1) => `M${r2(12 - hw(y0))} ${y0}H${r2(12 + hw(y0))}L${r2(12 + hw(y1))} ${y1}H${r2(12 - hw(y1))}Z`
const BANDS = band(8.6, 10.4) + band(12.5, 14.5)
// the base: a wide flat slab, wider than the cone's foot
const BASE = rr(4.6, 16.8, 19.4, 18.7, 0.9)
const LIP = D.LIP

export default function render(icon) {
  // cyan tile as the family colourway; the cone defaults to safety orange
  const C = { ...colourway(icon || { name: NAME, category: 'travel' }), accent: '#FF7A1A' }
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
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
      lin(3, 12, 4.8, 12, 19, [stop(0, 'shine'), stop(1, 'tint')]),
      // 4 the cone's sheen: lit from above and from the left flank
      lin(4, 8, 5, 16, 17, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: sh(CONE + BASE, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the base slab, then the cone standing on it
    ...raised(BASE, url(3), 'wm-k'),
    ['path', { d: sh(CONE, 0.3), fill: v('shadow'), 'fill-opacity': 0.25, class: 'wm-shadow' }],
    ...raised(CONE, v('accent'), 'wm-k'),
    ['path', { d: CONE, fill: url(4), class: 'wm-shine' }],
    // the two reflective bands, painted on the cone
    ['path', { d: BANDS, fill: url(3), class: 'wm-a' }],
  ]
}
