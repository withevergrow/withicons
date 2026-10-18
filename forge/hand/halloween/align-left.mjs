// forge/hand/halloween/align-left.mjs — four chunky pumpkin bars, long / short / long / short, flush to the left edge,
// each with the ink rim, the soft drop and a lit top edge, on a fainter, tighter halo: the generated glow sat behind the
// bars as a second blob and softened the ragged right edge that makes the alignment read.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const NAME = 'align-left'
const BARS = [[3, 21, 4.5], [3, 15, 9.5], [3, 21, 14.5], [3, 15, 19.5]]   // x0, x1, centre y
const HALF = 1.45                                                        // bar half height (2.9u bars)

const id = n => `wg-halloween-${NAME}-${n}`
const r2 = v => Math.round(v * 100) / 100
const barD = ([x0, x1, y], dx = 0, dy = 0) => {
  const r = HALF, a = r2(x0 + r + dx), b = r2(x1 - r + dx), t = r2(y - r + dy), u = r2(y + r + dy)
  return `M${a} ${t}H${b}A${r} ${r} 0 0 1 ${b} ${u}H${a}A${r} ${r} 0 0 1 ${a} ${t}Z`
}
const bars = (dx, dy) => BARS.map(b => barD(b, dx, dy)).join('')
// a short lit stroke just under each bar's top edge, from the left cap a little past the middle
const shine = BARS.map(([x0, x1, y]) => `M${r2(x0 + 1.05)} ${r2(y - 0.68)}H${r2(x0 + (x1 - x0) * 0.55)}`).join('')

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 13.2, fx: 8.8, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.5, r: 10.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.2 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.08 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: bars(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: bars(0, 0), fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: shine, fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
