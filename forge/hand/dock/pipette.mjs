// forge/hand/dock/pipette.mjs — a dropper on the diagonal: a rubber bulb in the second material (c2) that narrows into a
// neck, a light collar, and a glass tube tapering to a fine tip with a drop of colour (accent) inside; the generated
// glyph was one light capsule of even width, so at 24 and 16px it read as a pill or a marker pen. Drawn in a local
// frame along the axis and baked onto the 45-degree diagonal, with the house tile, drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'pipette'
const r2 = n => +(+n).toFixed(2)
// local frame: s runs along the dropper from the tip (bottom-left) to the bulb (top-right), t across it;
// the axis is centred on the glyph centre (12, 11.8) and lies on the 45-degree diagonal
const K = Math.SQRT1_2, LEN = 17.45
const T0 = [12 - (LEN / 2) * K, 11.8 + (LEN / 2) * K]
const W = (s, t) => [T0[0] + (s + t) * K, T0[1] + (t - s) * K]
// local path (M L C A Z, absolute, circular arcs) -> world path, shifted down by dy
function L(d, dy = 0) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
  let out = '', i = 0, c = ''
  const n = () => +t[i++]
  const pt = () => { const p = W(n(), n()); return `${r2(p[0])} ${r2(p[1] + dy)} ` }
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'M' || c === 'L') out += pt()
    else if (c === 'C') out += pt() + pt() + pt()
    else if (c === 'A') out += `${n()} ${n()} ${n()} ${n()} ${n()} ` + pt()
    else i++
  }
  return out.replace(/ ([A-Z])/g, '$1').trim()
}
const rrl = (s0, t0, s1, t1, r) => `M${s0 + r} ${t0}L${s1 - r} ${t0}A${r} ${r} 0 0 1 ${s1} ${t0 + r}L${s1} ${t1 - r}A${r} ${r} 0 0 1 ${s1 - r} ${t1}` +
  `L${s0 + r} ${t1}A${r} ${r} 0 0 1 ${s0} ${t1 - r}L${s0} ${t0 + r}A${r} ${r} 0 0 1 ${s0 + r} ${t0}Z`

// the glass tube: a fine rounded tip, a taper, then a straight barrel up into the collar
const TUBE = 'M0.5 -0.5L3.4 -1.45L9.8 -1.45L9.8 1.45L3.4 1.45L0.5 0.5A0.5 0.5 0 0 1 0.5 -0.5Z'
// the colour inside it
const LIQUID = 'M1.3 -0.36L3.5 -0.78L6.8 -0.78L6.8 0.78L3.5 0.78L1.3 0.36A0.36 0.36 0 0 1 1.3 -0.36Z'
// the collar: a short flange wider than the tube
const COLLAR = rrl(9.2, -2.45, 10.9, 2.45, 0.6)
// the rubber bulb: a neck flaring into a round-ended squeeze bulb
const BULB = 'M10.6 -1.85C11.5 -1.85 11.7 -2.6 12.7 -2.6L14.85 -2.6A2.6 2.6 0 0 1 14.85 2.6L12.7 2.6C11.7 2.6 11.5 1.85 10.6 1.85Z'
const LIP = D.LIP

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'layout' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const raised = (d, fill, cls) => [
    ['path', { d: L(d, LIP), fill, class: cls }],
    ['path', { d: L(d, LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: cls }],
    ['path', { d: L(d), fill, class: cls }],
  ]
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 4.9, 12, 18.5, [stop(0, 'shine'), stop(1, 'tint')]),
      lin(4, 12, 4.9, 12, 12, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: L(TUBE + COLLAR + BULB, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // glass tube with the colour inside
    ...raised(TUBE, url(3), 'wm-k'),
    ['path', { d: L(LIQUID), fill: v('accent'), class: 'wm-k' }],
    // the rubber bulb (under the collar), then the collar
    ...raised(BULB, v('c2'), 'wm-a'),
    ['path', { d: L(BULB), fill: url(4), class: 'wm-shine' }],
    ...raised(COLLAR, url(3), 'wm-k'),
  ]
}
