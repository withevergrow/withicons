// forge/hand/lunar/watch.mjs — a red lacquer wristwatch: deep crimson straps with gold keepers tucked behind a round
// case, a gold crown at three o'clock, a gold bezel ring round a cream rice-paper dial with lacquer hands and four
// gold hour studs; the generated drawing fused case and straps into one red blob with no dial, ring or crown.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0z`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const rim = { stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const line = { stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round' }
  // straps: tapered bands whose inner ends hide under the case
  const strapTop = 'M8.4 8L9.15 3.45Q9.3 2.5 10.25 2.5H13.75Q14.7 2.5 14.85 3.45L15.6 8Z'
  const strapBot = 'M8.4 16L9.15 20.55Q9.3 21.5 10.25 21.5H13.75Q14.7 21.5 14.85 20.55L15.6 16Z'
  const keepers = 'M9.75 4.6H14.25M9.75 19.4H14.25'
  const crown = 'M18.6 10.6H19.9Q20.6 10.6 20.6 11.3V12.7Q20.6 13.4 19.9 13.4H18.6Z'
  const studs = disc(12, 7.75, 0.42) + disc(16.25, 12, 0.42) + disc(12, 16.25, 0.42) + disc(7.75, 12, 0.42)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 2.5, x2: 0, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 4.5, y1: 2.5, x2: 20.6, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // straps in deep lacquer behind the case
    ['path', { d: strapTop + strapBot, fill: C.c2, ...rim, class: 'wm-k' }],
    ['path', { d: keepers, fill: 'none', stroke: C.accent, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // crown at three o'clock
    ['path', { d: crown, fill: url(1), ...line, class: 'wm-k' }],
    // the case
    ['path', { d: disc(12, 12, 7.1), fill: url(0), ...rim, class: 'wm-k' }],
    // gold bezel ring and the cream dial
    ['path', { d: disc(12, 12, 5.35), fill: C.tint, stroke: url(1), 'stroke-width': 0.95, class: 'wm-k' }],
    ['path', { d: disc(12, 12, 4.75), fill: 'none', stroke: C.c2, 'stroke-width': 0.3, class: 'wm-shine' }],
    ['path', { d: studs, fill: C.accent, class: 'wm-shine' }],
    // hands (tick round the centre)
    ['path', { d: 'M12 8.9V12L14.3 13.6', fill: 'none', stroke: C.c2, 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: disc(12, 12, 0.55), fill: C.accent, class: 'wm-a' }],
    // foil glint on the case rim, upper left
    ['path', { d: glint(7.2, 6.6, 0.95), fill: C.shine, class: 'wm-shine' }],
  ]
}
