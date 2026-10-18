// forge/hand/glass/egg.mjs — a frosted glass egg: colour body behind a soft-rimmed pane, a long highlight streak.
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

const egg = (dx, dy) => { const p = (x, y) => `${R(x + dx)} ${R(y + dy)}`; return `M${p(12, 2.5)}C${p(16.3, 2.5)} ${p(19.2, 8.8)} ${p(19.2, 13.8)}C${p(19.2, 18.3)} ${p(16, 21.3)} ${p(12, 21.3)}C${p(8, 21.3)} ${p(4.8, 18.3)} ${p(4.8, 13.8)}C${p(4.8, 8.8)} ${p(7.7, 2.5)} ${p(12, 2.5)}Z` }
export default function render() {
  return [...glass('egg', egg, [4.5, 2.5, 19.5, 21.5]),
    ['path', { d: 'M7.4 12.6C7.6 9.4 9 5.9 11 4.9', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.9', 'stroke-width': '1.1', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: '7.6', cy: '15', r: '0.55', fill: SHINE, 'fill-opacity': '0.8', class: 'wm-shine' }]]
}
