// forge/hand/halloween/file-down.mjs — a pumpkin-orange page like file-plus/file-check with its fold and a clean
// bold witch-purple down arrow over a midnight rim (like file-x's X), set high and wide enough to read at 16px.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const C3 = V('c3', '#8B55E0'), EDGE = V('edge', '#7344C9'), TINT = V('tint', '#FFF1B8'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-file-down-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100
const page = (x, y) => { const X = v => r2(v + x), Y = v => r2(v + y)
  return `M${X(14)} ${Y(2.5)}H${X(7)}A2 2 0 0 0 ${X(5)} ${Y(4.5)}V${Y(19.5)}A2 2 0 0 0 ${X(7)} ${Y(21.5)}H${X(17)}A2 2 0 0 0 ${X(19)} ${Y(19.5)}V${Y(7.5)}Z` }

export default function render() {
  // the page with the fold cut out as a 2u channel, and the folded flap left in the corner
  const body = 'M13 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V8.5H15.5A2.5 2.5 0 0 1 13 6Z'
  const flap = 'M15 3.5L18 6.5H15.5A.5 .5 0 0 1 15 6Z'
  const arrow = 'M12 10.5V17M8.75 13.75L12 17L15.25 13.75'
  const arrowSh = 'M12.15 11.35V17.85M8.9 14.6L12.15 17.85L15.4 14.6'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.69, r: 13.85, fx: 9.44, fy: 8.23, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 14.1, r: 13.01, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': TINT }], ['stop', { offset: 0.5, 'stop-color': ACCENT }], ['stop', { offset: 1, 'stop-color': C1 }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13.06, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
      ['linearGradient', { id: id(3), x1: 12, y1: 10.5, x2: 12, y2: 17, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }], ['stop', { offset: 1, 'stop-color': EDGE }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: page(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the channel shows the candle-lit underside, as in file-up/file-plus
    ['path', { d: page(0, 0), fill: `url(#${id(1)})`, class: 'wm-shine' }],
    ['path', { d: body, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: flap, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // lit left edge and top of the page
    ['path', { d: 'M5.75 18.9V4.6Q5.75 3.25 7.1 3.25H12.4', ...round, stroke: SHINE, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
    // the arrow: witch-purple core over a midnight rim, with a soft drop shadow (part A)
    ['path', { d: arrowSh, ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 3, class: 'wm-shadow' }],
    ['path', { d: arrow, ...round, stroke: INK, 'stroke-width': 3.1, class: 'wm-a' }],
    ['path', { d: arrow, ...round, stroke: `url(#${id(3)})`, 'stroke-width': 2, class: 'wm-a' }],
  ]
}
