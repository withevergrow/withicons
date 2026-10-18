// forge/hand/glass/cloud-off.mjs — a frosted cloud pane crossed by a clean etch-ink slash (no separate halo bar).
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

const cloud = (dx, dy) => `M${R(7 + dx)} ${R(19 + dy)}H${R(17.5 + dx)}A4 4 0 0 0 ${R(18.2 + dx)} ${R(11.1 + dy)}A6 6 0 0 0 ${R(6.6 + dx)} ${R(10.5 + dy)}A4.3 4.3 0 0 0 ${R(7 + dx)} ${R(19 + dy)}Z`
export default function render() {
  return [...glass('cloud-off', cloud, [2.5, 4.5, 22, 19]),
    ['path', { d: 'M5.2 13.2A3.4 3.4 0 0 1 7.4 10.9M8.6 8.3A5 5 0 0 1 13.4 6.2', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.85', 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['line', { x1: '3.5', y1: '3.5', x2: '20.5', y2: '20.5', stroke: ETCH, 'stroke-opacity': '0.85', 'stroke-width': '1.8', 'stroke-linecap': 'round', class: 'wm-s' }]]
}
