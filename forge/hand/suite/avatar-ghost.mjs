// forge/hand/suite/avatar-ghost.mjs — a pale sheet ghost (light at the crown, deepening toward the wavy hem, the suite
// diagonal sheen and a deep lip under the hem) with a solid ink face: big eyes with catch-lights and an "oo" mouth. The
// generated glyph painted the body saturated blue and the face as tiny pale inlays that melted into a blob at 16px.
const NAME = 'avatar-ghost'
const FB = {
  ink: '#1A2352', c1: '#A6B9F2', c2: '#7F92DC', tint: '#EEF2FF', shadow: '#2A3A80', shine: '#FFFFFF',
}
const col = r => `var(--with-suite-${r}, ${FB[r]})`
const id = n => `wg-suite-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// skeleton silhouette (dome, straight sides, three-scallop hem)
const body = (dy = 0) => {
  const y = v => +(v + dy).toFixed(2)
  return `M5 ${y(20)}V${y(11)}A7 7 0 0 1 19 ${y(11)}V${y(20)}C19 ${y(20.75)} 18.5 ${y(21)} 17.75 ${y(20.5)}L16.75 ${y(19.75)}C16 ${y(19.25)} 15.5 ${y(19.25)} 14.75 ${y(19.75)}L13.25 ${y(20.75)}C12.5 ${y(21.25)} 11.5 ${y(21.25)} 10.75 ${y(20.75)}L9.25 ${y(19.75)}C8.5 ${y(19.25)} 8 ${y(19.25)} 7.25 ${y(19.75)}L6.25 ${y(20.5)}C5.5 ${y(21)} 5 ${y(20.75)} 5 ${y(20)}Z`
}
const BODY = body()
const LIP = body(0.6)
// soft highlight along the upper-left of the dome
const GLINT = 'M7.1 9.6C7.45 7.6 8.75 6.05 10.6 5.4C11.1 5.25 11.35 5.85 10.95 6.15C9.65 6.8 8.7 7.95 8.3 9.75C8.15 10.4 7 10.3 7.1 9.6Z'
const FACE = ell(9.5, 11.6, 1.15, 1.45) + ell(14.5, 11.6, 1.15, 1.45) + ell(12, 15.5, 0.95, 1.2)
const LIGHTS = ell(9.95, 11.05, 0.42, 0.42) + ell(14.95, 11.05, 0.42, 0.42)

export default function render() {
  return [
    ['defs', {}, [
      lin(0, 0, 4, 0, 21, [stop(0, 'tint'), stop(0.3, 'tint'), stop(1, 'c1')]),
      lin(1, 5, 4, 19, 21, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0), stop(0.5, 'shadow', 0), stop(1, 'shadow', 0.22)]),
      lin(2, 0, 18.5, 0, 21.9, [stop(0, 'c2'), stop(1, 'shadow')]),
    ]],
    ['path', { d: LIP, fill: url(2), class: 'wm-shadow' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-k' }],
    ['path', { d: BODY, fill: url(1), stroke: col('shadow'), 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: GLINT, fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-k' }],
    ['path', { d: FACE, fill: col('ink'), class: 'wm-a' }],
    ['path', { d: LIGHTS, fill: col('shine'), class: 'wm-a' }],
  ]
}
