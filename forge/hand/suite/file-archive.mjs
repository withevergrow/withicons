// forge/hand/suite/file-archive.mjs — a blue page with a folded corner, a vertical zipper of alternating teeth running down
// its middle and an oval pull tab at the bottom of the zip; the generated drawing was a plain page with scattered dots.
import { col } from '../../styles/_suite-core.mjs'

const NAME = 'file-archive'
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const sheenG = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, 'shine', 0.3), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.24)])

const page = dy => `M14 ${2.5 + dy}H7A2 2 0 0 0 5 ${4.5 + dy}V${19.5 + dy}A2 2 0 0 0 7 ${21.5 + dy}H17A2 2 0 0 0 19 ${19.5 + dy}V${7.5 + dy}Z`
const FOLD = 'M14 2.5L19 7.5H15.5A1.5 1.5 0 0 1 14 6Z'
const tab = dy => `M12 ${12.6 + dy}C13.9 ${12.6 + dy} 14.4 ${13.9 + dy} 14.4 ${15.6 + dy}C14.4 ${17.6 + dy} 13.5 ${19.4 + dy} 12 ${19.4 + dy}C10.5 ${19.4 + dy} 9.6 ${17.6 + dy} 9.6 ${15.6 + dy}C9.6 ${13.9 + dy} 10.1 ${12.6 + dy} 12 ${12.6 + dy}Z`

export default function render() {
  const teeth = []
  for (let i = 0; i < 6; i++) {
    const y = 3.6 + i * 1.5
    const x = i % 2 === 0 ? 10.3 : 12
    teeth.push(['rect', { x, y, width: 1.7, height: 1.05, rx: 0.35, fill: col('edge'), 'fill-opacity': 0.95, class: 'wm-k' }])
  }
  return [
    ['defs', {}, [
      lin(0, 0, -40, 0, 80, [stop(0, 'c1'), stop(1, 'shadow')]),
      sheenG(1, 5, 2.5, 19, 21.5),
      sheenG(2, 14, 2.5, 19, 7.5),
      sheenG(3, 9.6, 12.6, 14.4, 19.4),
    ]],
    ['path', { d: page(0.6), fill: url(0), class: 'wm-shadow' }],
    ['path', { d: page(0), fill: col('c1'), class: 'wm-k' }],
    ['path', { d: page(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: FOLD, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: FOLD, fill: url(2), class: 'wm-k' }],
    ...teeth,
    ['path', { d: tab(0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: tab(0), fill: col('accent'), class: 'wm-a' }],
    ['path', { d: tab(0), fill: url(3), class: 'wm-a' }],
    ['rect', { x: 11.05, y: 14.4, width: 1.9, height: 2.6, rx: 0.95, fill: col('shadow'), 'fill-opacity': 0.7, class: 'wm-a' }],
  ]
}
