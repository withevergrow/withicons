// forge/hand/blueprint/dices.mjs — the drafted pair of dice with solid round pips. The generated drawing drew the pips
// as 0.5u square-capped dashes (tiny squares that vanished at 16px) and threaded the keyline and fillet construction
// through the gap between the dice, where it competed with them; here the pips are solid dots, the back die keeps its
// two control rings where it tucks behind the front one, and the drafting stays outside the dice.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const pip = (cx, cy, cls) => ['circle', { cx, cy, r: 1.3, fill: 'currentColor', stroke: 'none', class: cls }]

export default function render() {
  return [
    // fillet construction on the two outer corners only, and the dimension line
    ['path', { d: 'M21.68 3H23.1M21 .9V2.32M3 9.32V7.9M.9 10H2.32M3 23H21M3 21.7V23.3M21 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // front die
    ['path', { d: 'M5 10H12A2 2 0 0 1 14 12V19A2 2 0 0 1 12 21H5A2 2 0 0 1 3 19V12A2 2 0 0 1 5 10Z', class: 'wm-k' }],
    pip(6.5, 13.5, 'wm-k'), pip(10.5, 17.5, 'wm-k'),
    // back die, tucked behind
    ['path', { d: 'M10 5.18V5A2 2 0 0 1 12 3H19A2 2 0 0 1 21 5V12A2 2 0 0 1 19 14H18.83', class: 'wm-a' }],
    pip(17.5, 6.5, 'wm-a'),
    ['path', { d: ring(10, 6.75) + ring(17.25, 14), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
