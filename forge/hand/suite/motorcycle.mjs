// forge/hand/suite/motorcycle.mjs — a motorcycle from the side: two solid violet tyres with small light hubs, a blue fuel
// tank over a lighter tapered engine block with cooling fins, a teal seat, a raked front fork with handlebar and an
// orange headlamp; the generated drawing was one big blue bowl with thin rings for wheels.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'motorcycle'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const WY = 17, WR = 3.6, RX = 5, FX = 19
const rnd = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
// fuel tank (sloped front, flat sweep to the seat) and the tapered engine block under it
const tank = (dy = 0) => `M8.8 ${10.9 + dy}C8.8 ${9 + dy} 9.8 ${8 + dy} 11.4 ${8 + dy}H14.2C15.4 ${8 + dy} 16.2 ${8.7 + dy} 16.3 ${9.7 + dy}L16.4 ${10.9 + dy}Z`
const engine = (dy = 0) => `M8.6 ${11 + dy}H15.8L14.6 ${15 + dy}H9.8Z`

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 8.4, 6.8, 16.4, 14.8, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.26)]),
    ]],
    // back plane: swing arm, front fork, handlebar, tyres and hubs
    ['path', { d: `M${RX} ${WY}L9.8 13.2`, stroke: col('c2'), 'stroke-width': 2.4, ...rnd, class: 'wm-a' }],
    ['path', { d: `M${FX} ${WY}L16.9 6.8`, stroke: col('c2'), 'stroke-width': 2.6, ...rnd, class: 'wm-a' }],
    ['path', { d: 'M14.8 5.9H18', stroke: col('c2'), 'stroke-width': 2.1, ...rnd, class: 'wm-a' }],
    ['circle', { cx: RX, cy: WY, r: WR, fill: col('c2'), class: 'wm-a' }],
    ['circle', { cx: FX, cy: WY, r: WR, fill: col('c2'), class: 'wm-a' }],
    ['circle', { cx: RX, cy: WY, r: 1.1, fill: col('tint'), class: 'wm-a' }],
    ['circle', { cx: FX, cy: WY, r: 1.1, fill: col('tint'), class: 'wm-a' }],
    // body: shadow, engine, tank, sheen
    ['path', { d: `${engine(0.6)}${tank(0.6)}`, fill: url(0), stroke: url(0), 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: engine(), fill: col('c4'), stroke: col('c4'), 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: tank(), fill: col('c1'), stroke: col('c1'), 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: `${engine()}${tank()}`, fill: url(1), class: 'wm-k' }],
    // engine cooling fins
    ['path', { d: 'M10.8 12.8H14.4M10.6 14.1H14.1', stroke: col('edge'), 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.85, class: 'wm-deco' }],
    // seat, raised at the tail
    ['path', { d: 'M2.6 9.1C2.6 8.1 3.3 7.7 4.2 7.7H8.8V10.7H4.2C3.3 10.7 2.6 10 2.6 9.1Z', fill: col('c3'), stroke: col('c3'), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // tank highlight
    ['path', { d: 'M10.5 9.4C10.7 8.8 11.3 8.6 12 8.6', stroke: col('shine'), 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.6, class: 'wm-shine' }],
    // headlamp
    ['circle', { cx: 18.7, cy: 8.9, r: 1.4, fill: col('accent'), class: 'wm-s' }],
  ]
}
