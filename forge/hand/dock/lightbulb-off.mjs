// forge/hand/dock/lightbulb-off.mjs — a whole, full-bodied bulb (round globe, tapered neck, a screw base with one
// thread groove and a contact nub) in the light glyph material, struck corner to corner by a deep ink-darkened accent slash in a narrow
// tile-coloured gap that stays clear of the base; the generated glyph chopped the bulb into pale fragments around a
// light slash, so it read as broken shapes rather than a bulb switched off. Final tile units, house tile, shadow and lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'lightbulb-off'
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

// the glass: a globe of radius 5.5 at (12, 9.5) easing into a neck 4.6 wide (glyph 4..18.6, about 14.6u tall)
const GLOBE = 'M9.7 14.6C9.7 13.1 6.5 12 6.5 9.5A5.5 5.5 0 0 1 17.5 9.5C17.5 12 14.3 13.1 14.3 14.6Z'
// the screw base with a contact nub, and its thread groove
const BASE = 'M9.7 15.25H14.3V16.95Q14.3 17.6 13.65 17.6H13V18.1Q13 18.6 12.5 18.6H11.5Q11 18.6 11 18.1V17.6H10.35Q9.7 17.6 9.7 16.95Z'
const GROOVE = 'M9.7 16.2H14.3V16.7H9.7Z'
// the slash: a capsule from (6.25, 4.25) to (18.5, 16.5) on y = x - 2, half-width 0.85; it splits the globe through
// its centre into two solid halves and passes 2u from the base corner, outside its 1.45 knockout
const SLASH = 'M6.85 3.65L19.1 15.9A0.85 0.85 0 0 1 17.9 17.1L5.65 4.85A0.85 0.85 0 0 1 6.85 3.65Z'
const SLASH_LINE = 'M6.25 4.25L18.5 16.5'
const LIP = D.LIP

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'objects' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const raised = (d, fill, cls, lip = 0.3, lipRole = 'shadow') => [
    ['path', { d: sh(d, LIP), fill, class: cls }],
    ['path', { d: sh(d, LIP), fill: v(lipRole), 'fill-opacity': lip, class: cls }],
    ['path', { d, fill, class: cls }],
  ]
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 4, 12, 18.6, [stop(0, 'shine'), stop(1, 'tint')]),
      // the bulb's lower body darkens toward the base so its outline holds on a warm tile
      lin(5, 12, 8, 12, 18.6, [stop(0, 'shadow', 0), stop(1, 'shadow', 0.38)]),
      lin(4, 5, 3.2, 19, 17.2, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: sh(GLOBE + BASE, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the bulb: glass, then the base with its thread groove
    ...raised(GLOBE, url(3), 'wm-k', 0.55),
    ['path', { d: GLOBE, fill: url(5), stroke: v('shadow'), 'stroke-opacity': 0.4, 'stroke-width': 0.3, class: 'wm-k' }],
    ...raised(BASE, url(3), 'wm-k', 0.6),
    ['path', { d: BASE, fill: v('shadow'), 'fill-opacity': 0.3, stroke: v('shadow'), 'stroke-opacity': 0.45, 'stroke-width': 0.3, class: 'wm-k' }],
    ['path', { d: GROOVE, fill: v('shadow'), 'fill-opacity': 0.5, class: 'wm-k' }],
    // a gap along the slash, painted in the tile's own gradients (a knockout that keeps the tile seamless)
    ['path', { d: SLASH_LINE, stroke: url(0), 'stroke-width': 2.9, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: SLASH_LINE, stroke: url(1), 'stroke-width': 2.9, 'stroke-linecap': 'round', class: 'wm-deco' }],
    // the slash
    ['path', { d: sh(SLASH, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, class: 'wm-shadow' }],
    // the slash: accent deepened with ink so it stands off the warm tile, a dark ink lip and a crisp ink edge
    ...raised(SLASH, v('accent'), 'wm-s', 0.7, 'ink'),
    ['path', { d: SLASH, fill: v('ink'), 'fill-opacity': 0.3, stroke: v('ink'), 'stroke-opacity': 0.55, 'stroke-width': 0.3, class: 'wm-s' }],
    ['path', { d: SLASH, fill: url(4), class: 'wm-shine' }],
  ]
}
