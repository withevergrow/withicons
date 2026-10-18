// forge/hand/clay/piggy-bank.mjs: a round pink clay pig in side view facing right, a gold coin dropping into the
// slot on top (centred over it, half sunk), pointed ear, square snout with a nostril, eye dot, curly tail and two
// short legs. Same pink palette and soft light as the generated clay pig, redrawn to the new skeleton design.
const V = (r, h) => `var(--with-clay-${r}, ${h})`
const C1 = V('c1', '#F7A8C0'), C2 = V('c2', '#E8608A'), C3 = V('c3', '#F5B82E'), AC = V('accent', '#E89A1C')
const SH = V('shadow', '#7F3550'), SN = V('shine', '#FFFFFF'), INK = V('ink', '#4A1A2A'), TINT = V('tint', '#F2B6C8')
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`
const lit = (id, cx, cy, r) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.5' }],
  ['stop', { offset: '0.35', 'stop-color': SN, 'stop-opacity': '0.06' }],
  ['stop', { offset: '0.7', 'stop-color': SH, 'stop-opacity': '0.06' }],
  ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0.34' }]]]

const BODY = 'M4 14.2C4 10.6 7.3 8.6 11.5 8.6C15.2 8.6 17.6 10 18.6 12.2C19.1 13.4 19 15.4 18.2 16.7C16.9 18.8 14.4 19.6 11.4 19.6C7.2 19.6 4 17.8 4 14.2Z'
const BODY_DROP = 'M4.25 14.55C4.25 10.95 7.55 8.95 11.75 8.95C15.45 8.95 17.85 10.35 18.85 12.55C19.35 13.75 19.25 15.75 18.45 17.05C17.15 19.15 14.65 19.95 11.65 19.95C7.45 19.95 4.25 18.15 4.25 14.55Z'
const LEGS = 'M6.9 17.4h2.3v2.9a1.15 1.15 0 0 1-2.3 0Z M13.6 17.4h2.3v2.9a1.15 1.15 0 0 1-2.3 0Z'
const EAR = 'M14.6 9.4C14.9 7.8 15.8 6.5 16.9 6.1C17.5 7.1 17.6 8.8 17.1 10.4Z'
const EAR_IN = 'M15.4 9.5C15.6 8.5 16.1 7.6 16.7 7.3C17 8 17 9 16.7 10Z'
const SNOUT = 'M17.6 12.4h1.8a1.2 1.2 0 0 1 1.2 1.2v1.3a1.2 1.2 0 0 1-1.2 1.2h-1.8Z'

export default function render() {
  return [
    ['defs', {}, [
      lit('wg-clay-piggy-bank-0', 8.2, 10.4, 14.4),
      lit('wg-clay-piggy-bank-1', 18.4, 12.8, 3.6),
      lit('wg-clay-piggy-bank-2', 15.6, 7, 4.4),
      lit('wg-clay-piggy-bank-3', 10.9, 4.1, 3.6),
      ['radialGradient', { id: 'wg-clay-piggy-bank-4', cx: 11.6, cy: 21.1, r: 8.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': SH, 'stop-opacity': '0.3' }],
        ['stop', { offset: '0.7', 'stop-color': SH, 'stop-opacity': '0.08' }],
        ['stop', { offset: '1', 'stop-color': SH, 'stop-opacity': '0' }]]],
    ]],
    ['path', { d: ell(11.6, 21.1, 8.2, 1.2), fill: 'url(#wg-clay-piggy-bank-4)', class: 'wm-shadow' }],
    // coin behind the body, its lower half sinking into the slot
    ['path', { d: ell(11.9, 6.2, 2.4, 2.4), fill: AC, class: 'wm-s' }],
    ['path', { d: ell(11.6, 6.2, 2.4, 2.4), fill: C3, class: 'wm-s' }],
    ['path', { d: ell(11.6, 6.2, 2.4, 2.4), fill: 'url(#wg-clay-piggy-bank-3)', class: 'wm-s' }],
    ['path', { d: ell(11.6, 6.2, 1.35, 1.35), fill: 'none', stroke: AC, 'stroke-width': 0.5, class: 'wm-s' }],
    ['path', { d: ell(10.7, 5.1, 0.4, 0.55), fill: SN, 'fill-opacity': 0.65, class: 'wm-s' }],
    // tail
    ['path', { d: 'M4.3 13.2C3 13.5 2.3 12.5 2.8 11.7C3.3 11 4.2 11.4 3.9 12.1C3.6 12.6 2.9 12.4 2.9 11.8C2.9 11 3.5 10.4 4.1 10.4', stroke: C2, 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: LEGS, fill: C1, class: 'wm-k' }],
    ['path', { d: LEGS, fill: 'url(#wg-clay-piggy-bank-0)', class: 'wm-k' }],
    ['path', { d: 'M6.9 20.1h2.3M13.6 20.1h2.3', stroke: SH, 'stroke-opacity': 0.25, 'stroke-width': 0.5, fill: 'none', class: 'wm-k' }],
    ['path', { d: BODY_DROP, fill: TINT, class: 'wm-k' }],
    ['path', { d: BODY_DROP, fill: SH, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: BODY, fill: C1, class: 'wm-k' }],
    ['path', { d: BODY, fill: 'url(#wg-clay-piggy-bank-0)', class: 'wm-k' }],
    // slot, right under the coin
    ['path', { d: 'M9.4 8.85Q11.6 8.35 13.8 8.85', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: EAR, fill: C1, class: 'wm-a' }],
    ['path', { d: EAR, fill: 'url(#wg-clay-piggy-bank-2)', class: 'wm-a' }],
    ['path', { d: EAR_IN, fill: C2, class: 'wm-a' }],
    ['path', { d: ell(15.4, 15.2, 1, 0.6), fill: C2, 'fill-opacity': 0.45, class: 'wm-k' }],
    ['path', { d: SNOUT, fill: C2, class: 'wm-a' }],
    ['path', { d: SNOUT, fill: 'url(#wg-clay-piggy-bank-1)', class: 'wm-a' }],
    ['path', { d: ell(19.3, 13.5, 0.32, 0.55), fill: INK, class: 'wm-a' }],
    ['path', { d: ell(15.4, 12.2, 0.62, 0.78), fill: INK, class: 'wm-a' }],
    ['path', { d: ell(15.6, 11.9, 0.23, 0.23), fill: SN, class: 'wm-shine' }],
    ['path', { d: ell(7.6, 11.1, 1.8, 0.7), fill: SN, 'fill-opacity': 0.4, class: 'wm-shine' }],
  ]
}
