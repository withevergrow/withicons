// forge/hand/halloween/activity.mjs — a pumpkin-orange pulse line with the ink rim, drop shadow and lit edges of its chart
// siblings (trending-up), replacing the generated midnight line that vanished on dark backgrounds and the spider that
// crowded its peak. One clean stroke so the draw loop still traces it.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-activity-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const W = 2.3 // centreline width of the drawn stroke; the ink rim is centred on its edge
  const d = 'M3.5 12H6.5L9.5 5L14.5 19L17.5 12H20.5'
  const sh = 'M3.65 12.85H6.65L9.65 5.85L14.65 19.85L17.65 12.85H20.65'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.12, r: 11.22, fx: 9.28, fy: 9.48, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(0.45, C1), st(1, C2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.7, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: sh, ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': W, class: 'wm-shadow' }],
    ['path', { d, ...round, stroke: INK, 'stroke-width': W + 0.72, class: 'wm-k' }],
    ['path', { d, ...round, stroke: `url(#${id(0)})`, 'stroke-width': W - 0.72, class: 'wm-k' }],
    // the lit upper-left edge of each run of the line
    ['path', { d: 'M4.1 11.62H6.1M6.6 10.8L8.7 5.9M9.64 6.53L13.39 17.03M14.6 17.8L16.55 13.25M17.9 11.62H19.9', ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.34, class: 'wm-shine' }],
  ]
}
