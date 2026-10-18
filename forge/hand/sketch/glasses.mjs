// forge/hand/sketch/glasses.mjs — two large rounded lenses that fill the width, a clear arched bridge, short temples and
// firm glint hatching, replacing small lenses with faint hatch that sat lighter than the siblings.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const lens = x => { const m = v => r2(x + v)
  return `M${m(0.3)} 8.6C${m(0.9)} 8.2 ${m(3)} 8 ${m(4.6)} 8.05C${m(6.4)} 8.1 ${m(7.8)} 8.3 ${m(8.3)} 8.9C${m(8.7)} 9.5 ${m(8.6)} 11.2 ${m(8.3)} 12.6C${m(7.9)} 14.8 ${m(6.5)} 16.3 ${m(4.3)} 16.3C${m(2.1)} 16.3 ${m(0.7)} 15 ${m(0.3)} 12.8C${m(0)} 11.2 ${m(-0.1)} 9.4 ${m(0.6)} 8.4` }
const LENSES = lens(1.6) + lens(14.1)
const FRAME = 'M9.9 10.4Q12 8.7 14.1 10.3M1.9 9.2Q1.3 8.3 0.9 6.9M22.1 9.2Q22.7 8.3 23.1 6.9'
const HATCH = 'M3.7 13.6L7.1 10.1M5.3 14.9L8.8 11.3M16.2 13.6L19.6 10.1M17.8 14.9L21.3 11.3'
export default function render() {
  return [
    ['path', { d: HATCH, 'stroke-width': 0.9, 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ['path', { d: ghost(LENSES, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: LENSES, 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: FRAME, 'stroke-width': 1.45, class: 'wm-k' }],
  ]
}
