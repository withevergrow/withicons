// forge/hand/glass/eye-off.mjs — a frosted almond eye with a clear accent pupil, crossed by an etch-ink slash.
const R = (n) => Math.round(n * 100) / 100
const V = (r, h) => `var(--with-glass-${r}, ${h})`
// one glass plate: soft shadow, colour body (gradient + accent glow) offset down-right, frosted pane with a faint edge
function glass(name, shape, box) {
  const [x1, y1, x2, y2] = box
  const g = (i) => `url(#wg-glass-${name}-${i})`
  const defs = ['defs', {}, [
    ['linearGradient', { id: `wg-glass-${name}-0`, x1: R(x1 + 1), y1: R(y1 + 1), x2: R(x2 + 2), y2: R(y2 + 2), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }], ['stop', { offset: '1', 'stop-color': V('shadow', '#6A45D6') }]]],
    ['radialGradient', { id: `wg-glass-${name}-1`, cx: R(x2 - 3), cy: R(y2 - 3), r: '8', gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.5', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.22' }],
      ['stop', { offset: '1', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0' }]]],
    ['linearGradient', { id: `wg-glass-${name}-2`, x1: R(x1), y1: R(y1), x2: R(x2), y2: R(y2), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }],
      ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
  ]]
  return [defs,
    ['path', { d: shape(1.5, 2.1), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.07', class: 'wm-shadow' }],
    ['path', { d: shape(1.2, 1.5), fill: g(0), class: 'wm-k' }],
    ['path', { d: shape(1.2, 1.5), fill: g(1), class: 'wm-k' }],
    ['path', { d: shape(0, 0), fill: g(2), stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', class: 'wm-k' }]]
}
const ETCH = V('etch', '#3E3A8C')
const SHINE = V('shine', '#FFFFFF')
const ACC = V('accent', '#F2679E')

const eye = (dx, dy) => `M${R(2 + dx)} ${R(12 + dy)}Q${R(12 + dx)} ${R(3 + dy)} ${R(22 + dx)} ${R(12 + dy)}Q${R(12 + dx)} ${R(21 + dy)} ${R(2 + dx)} ${R(12 + dy)}Z`
export default function render() {
  return [...glass('eye-off', eye, [2, 6, 22, 18]),
    ['circle', { cx: '12', cy: '12', r: '3.4', fill: ACC, 'fill-opacity': '0.9', stroke: ETCH, 'stroke-opacity': '0.7', 'stroke-width': '0.8', class: 'wm-a' }],
    ['circle', { cx: '12', cy: '12', r: '1.4', fill: ETCH, 'fill-opacity': '0.85', class: 'wm-a' }],
    ['circle', { cx: '10.9', cy: '10.9', r: '0.75', fill: SHINE, class: 'wm-shine' }],
    ['path', { d: 'M5.2 10.2Q8 7.9 11.2 7.6', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.85', 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['line', { x1: '3.5', y1: '3.5', x2: '20.5', y2: '20.5', stroke: ETCH, 'stroke-opacity': '0.85', 'stroke-width': '1.8', 'stroke-linecap': 'round', class: 'wm-s' }]]
}
