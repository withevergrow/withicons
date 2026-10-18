// forge/hand/glass/file-spreadsheet.mjs — a frosted page with a clean 2x3 cell grid: tinted header row, thin light dividers.
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

const page = (dx, dy) => { const X = x => R(x + dx), Y = y => R(y + dy); return `M${X(7)} ${Y(2)}H${X(14)}L${X(19)} ${Y(7)}V${Y(20)}A2 2 0 0 1 ${X(17)} ${Y(22)}H${X(7)}A2 2 0 0 1 ${X(5)} ${Y(20)}V${Y(4)}A2 2 0 0 1 ${X(7)} ${Y(2)}Z` }
export default function render() {
  const div = { stroke: SHINE, 'stroke-opacity': '0.9', 'stroke-width': '0.6', 'stroke-linecap': 'round' }
  return [...glass('file-spreadsheet', page, [5, 2, 19, 22]),
    ['path', { d: 'M14 2V5.6A1.4 1.4 0 0 0 15.4 7H19', fill: 'none', stroke: ETCH, 'stroke-opacity': '0.6', 'stroke-width': '0.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    ['rect', { x: '7.5', y: '10', width: '9', height: '9', rx: '1', fill: V('back', '#7484FF'), 'fill-opacity': '0.35', stroke: ETCH, 'stroke-opacity': '0.55', 'stroke-width': '0.6', class: 'wm-deco' }],
    ['path', { d: 'M8.5 10H15.5A1 1 0 0 1 16.5 11V13H7.5V11A1 1 0 0 1 8.5 10Z', fill: ACC, 'fill-opacity': '0.8', class: 'wm-a' }],
    ['path', { d: 'M12 13V19M7.8 15H16.2M7.8 17H16.2', fill: 'none', ...div, class: 'wm-deco' }],
    ['path', { d: 'M6.8 6.5V4.3A1.2 1.2 0 0 1 8 3.1H12', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.85', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]]
}
