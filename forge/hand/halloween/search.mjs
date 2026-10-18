// forge/hand/halloween/search.mjs — a bone-white lens with a candle-lit glint and a sturdy witch-purple handle, nothing
// else: the generated one hung a spider and a slime drip on the lens, and they competed with the magnifier at 16px.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C3 = V('c3', '#8B55E0'), ACCENT = V('accent', '#FFB52E')
const TINT = V('tint', '#FFF1B8'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2'), EDGE = V('edge', '#7344C9')
const id = n => `wg-halloween-search-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const handle = 'M15.75 15.75L20.1 20.1'
  const glint = 'M6.9 10.5A3.6 3.6 0 0 1 10.5 6.9'
  return [
    ['defs', {}, [
      // 0: the lens, bone lit from the upper left
      ['radialGradient', { id: id(0), cx: 10.5, cy: 11.3, r: 9.6, fx: 8.2, fy: 7.9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE }], ['stop', { offset: 0.5, 'stop-color': SHINE }], ['stop', { offset: 1, 'stop-color': TINT }]]],
      // 1: candle light in the glint
      ['linearGradient', { id: id(1), x1: 6.9, y1: 10.5, x2: 10.5, y2: 6.9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': ACCENT }]]],
      // 2: halo
      ['radialGradient', { id: id(2), cx: 12, cy: 12.4, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    // drop shadow
    ['circle', { cx: 10.65, cy: 11.35, r: 8, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M15.9 16.6L20.25 20.95', ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2.6, class: 'wm-shadow' }],
    // the handle, tucked under the lens rim
    ['path', { d: handle, ...round, stroke: INK, 'stroke-width': 3.32, class: 'wm-a' }],
    ['path', { d: handle, ...round, stroke: C3, 'stroke-width': 2.6, class: 'wm-a' }],
    ['path', { d: 'M17.15 16.55L19.55 18.95', ...round, stroke: SHINE, 'stroke-opacity': 0.45, 'stroke-width': 0.42, class: 'wm-shine' }],
    // the lens
    ['circle', { cx: 10.5, cy: 10.5, r: 8, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, class: 'wm-k' }],
    ['path', { d: 'M6.49 16.23A7 7 0 0 0 16.23 14.51', fill: 'none', stroke: EDGE, 'stroke-opacity': 0.22, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }],
    // a carved glint, lit from inside like the style's knockouts
    ['path', { d: glint, ...round, stroke: INK, 'stroke-width': 2.32, class: 'wm-shine' }],
    ['path', { d: glint, ...round, stroke: `url(#${id(1)})`, 'stroke-width': 1.6, class: 'wm-shine' }],
  ]
}
