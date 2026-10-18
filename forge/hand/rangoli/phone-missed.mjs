// forge/hand/rangoli/phone-missed.mjs — the glowing orange handset with a bold magenta-to-violet down-left arrow at the upper right
// as the missed-call mark; long diagonal shaft plus a square corner head so it never reads as a tick.
import { col } from '../../styles/_rangoli-core.mjs'

const r2 = v => Math.round(v * 100) / 100
// the skeleton's handset outline, moved by (dx, dy)
const handset = (dx = 0, dy = 0) => {
  const p = (x, y) => `${r2(x + dx)} ${r2(y + dy)}`
  return `M${p(3, 5)}A2 2 0 0 1 ${p(5, 3)}H${r2(8 + dx)}A1.5 1.5 0 0 1 ${p(9.5, 4.5)}V${r2(6 + dy)}` +
    `C${p(9.5, 7.25)} ${p(8.5, 7.25)} ${p(8.5, 8.5)}A7 7 0 0 0 ${p(15.5, 15.5)}C${p(16.75, 15.5)} ${p(16.75, 14.5)} ${p(18, 14.5)}` +
    `H${r2(19.5 + dx)}A1.5 1.5 0 0 1 ${p(21, 16)}V${r2(19 + dy)}A2 2 0 0 1 ${p(19, 21)}A16 16 0 0 1 ${p(3, 5)}Z`
}

export default function render(icon) {
  const id = n => `wg-rangoli-${icon.name}-${n}`
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.6, cy: 6.5, r: 25.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c1') }],
        ['stop', { offset: 0.3, 'stop-color': col('c1') }],
        ['stop', { offset: 1, 'stop-color': col('c2') }],
      ]],
      ['linearGradient', { id: id(1), x1: 22, y1: 2, x2: 13, y2: 11, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c3') }],
        ['stop', { offset: 1, 'stop-color': col('c4') }],
      ]],
    ]],
    ['path', { d: handset(0.2, 0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: handset(), fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: 'M4.1 6.25A15 15 0 0 0 5.4 11.25', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // missed-call arrow: a long diagonal shaft running down-left into a square corner head (unmistakably an arrow, not a tick)
    ['path', { d: 'M22 2L13.5 10.5', fill: 'none', stroke: `url(#${id(1)})`, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M13.5 4.5V10.5H19.5', fill: 'none', stroke: `url(#${id(1)})`, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }],
  ]
}
