// forge/hand/engrave/network.mjs — network: a hairline-hatched hub branching down to three small solid-inked device nodes spaced well apart, with clean depth bands on the right/bottom edges only, so the row reads as three separate devices at 16px
const R = (x, y, w, h, r) => {
  const f = n => +n.toFixed(2)
  const x2 = f(x + w), y2 = f(y + h), xa = f(x + r), xb = f(x2 - r), ya = f(y + r), yb = f(y2 - r)
  return `M${xa} ${y}H${xb}A${r} ${r} 0 0 1 ${x2} ${ya}V${yb}A${r} ${r} 0 0 1 ${xb} ${y2}H${xa}A${r} ${r} 0 0 1 ${x} ${yb}V${ya}A${r} ${r} 0 0 1 ${xa} ${y}Z`
}
const NODES = [2.25, 10.25, 18.25]
// depth band of a 3.5u node at x: offset 0.5 down-right, from the top-right arc to the bottom-left arc
const nodeBand = x => {
  const f = n => +n.toFixed(2)
  return `M${f(x + 3.49)} 17.76A.6 .6 0 0 1 ${f(x + 4)} 18.35V20.65A.6 .6 0 0 1 ${f(x + 3.4)} 21.25H${f(x + 1.1)}A.6 .6 0 0 1 ${f(x + 0.51)} 20.74A.6 .6 0 0 0 ${f(x + 0.6)} 20.75H${f(x + 2.9)}A.6 .6 0 0 0 ${f(x + 3.5)} 20.15V17.85A.6 .6 0 0 0 ${f(x + 3.49)} 17.76Z`
}
const nodeTicks = x => {
  const f = n => +n.toFixed(2)
  return [[x + 4.05, 18.45], [x + 4.05, 19.65], [x + 3.75, 20.75], [x + 2.45, 21.3], [x + 1.25, 21.3]]
    .map(([a, b]) => `M${f(a)} ${f(b)}l.95 .95`).join('')
}

export default function render() {
  const hubBand = 'M15.75 2.75A2.15 2.15 0 0 1 16.65 4.5V6.5A2.15 2.15 0 0 1 14.5 8.65H12.65V8.15H14A2.15 2.15 0 0 0 16.15 6V4A2.15 2.15 0 0 0 15.75 2.75Z'
  const linkBands = 'M12.65 8.65H13.15V11.85H12.65ZM4.65 13.15H11.35V13.65H5.15V17.25H4.65ZM12.65 13.15H19.35V13.65H13.15V17.25H12.65ZM20.65 12.6Q21.15 12.7 21.15 13.2V17.25H20.65Z'
  const ticks =
    'M16.7 4.4l.95 .95M16.7 5.6l.95 .95M16.45 6.95l.95 .95M15.35 8.7l.95 .95M14.15 8.7l.95 .95' +
    'M13.2 9.6l.95 .95' +
    'M6.3 13.7l.95 .95M7.5 13.7l.95 .95M8.7 13.7l.95 .95M9.9 13.7l.95 .95' +
    'M14.3 13.7l.95 .95M15.5 13.7l.95 .95M16.7 13.7l.95 .95M17.9 13.7l.95 .95' +
    'M5.2 14.9l.95 .95M13.2 14.9l.95 .95M21.2 14.9l.95 .95' +
    NODES.map(nodeTicks).join('')
  return [
    ['path', { d: hubBand + NODES.map(nodeBand).join(''), fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
    ['path', { d: linkBands, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['path', { d: ticks, 'stroke-width': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M12.9 3.45L14.55 5.1M11.7 3.45L14.55 6.3M11.3 4.25L13.6 6.55', 'stroke-width': 0.3, class: 'wm-k' }],
    ['path', { d: R(8.5, 2.5, 7, 5, 1.5), class: 'wm-k' }],
    ['path', { d: 'M12 7.5V17.25M4 17.25V12.5H20V17.25', class: 'wm-a' }],
    ['path', { d: NODES.map(x => R(x, 17.25, 3.5, 3.5, 0.6)).join(''), fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
  ]
}
