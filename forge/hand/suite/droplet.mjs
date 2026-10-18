// forge/hand/suite/droplet.mjs — a clean blue water drop with a shadow lip and the suite sheen; the generated drawing's
// curved white highlight read as a phone handset, so the glint is now a short straight pill in the bulb.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'droplet'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

const drop = (dy = 0) => `M12 ${2.25 + dy}C10.25 ${4.5 + dy} 5.5 ${9.25 + dy} 5.5 ${14.75 + dy}A6.5 6.5 0 0 0 18.5 ${14.75 + dy}C18.5 ${9.25 + dy} 13.75 ${4.5 + dy} 12 ${2.25 + dy}Z`
const GLINT = 'M8.3 13.6A0.8 0.8 0 0 1 9.9 13.6V14.9A0.8 0.8 0 0 1 8.3 14.9Z'

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      lin(1, 5.5, 2.25, 18.5, 21.25, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)]),
    ]],
    ['path', { d: drop(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: drop(), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: drop(), fill: url(1), class: 'wm-k' }],
    ['path', { d: GLINT, fill: col('edge'), class: 'wm-shine' }],
  ]
}
