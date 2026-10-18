// forge/hand/blueprint/avatar-dino.mjs: the dino in profile (three back spikes at the left, head looking right, curved
// neck and belly), drafted as one clean outline with an eye dot and a dimension line under it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const Y = y => +((y - 2.75) * 0.93 + 2.5).toFixed(2)

export default function render() {
  const body = 'M6 ' + Y(21.5) + 'L6.5 ' + Y(19) + 'L3 ' + Y(17.25) + 'L7 ' + Y(16) + 'L7.25 ' + Y(14) + 'L4 ' + Y(12) +
    'L7.75 ' + Y(11) + 'L8 ' + Y(9.25) + 'L5.25 ' + Y(7.5) + 'L8.5 ' + Y(6.75) +
    'C8.75 ' + Y(4.25) + ' 10.75 ' + Y(2.75) + ' 13 ' + Y(2.75) + 'C14.25 ' + Y(2.75) + ' 15.25 ' + Y(3) + ' 16 ' + Y(3.75) +
    'C16.5 ' + Y(4.25) + ' 17 ' + Y(4.25) + ' 17.75 ' + Y(4.25) + 'H19.75C20.75 ' + Y(4.25) + ' 21.5 ' + Y(5) + ' 21.5 ' + Y(6) +
    'V' + Y(6.25) + 'C21.5 ' + Y(7) + ' 21 ' + Y(7.5) + ' 20.25 ' + Y(7.5) + 'L14 ' + Y(9.5) + 'L18.75 ' + Y(12.75) +
    'C19.5 ' + Y(13.25) + ' 19.5 ' + Y(14.25) + ' 18.75 ' + Y(14.75) + 'C17.5 ' + Y(15.5) + ' 16 ' + Y(15.75) + ' 14.5 ' + Y(15.75) +
    'C12.5 ' + Y(15.75) + ' 11 ' + Y(16.5) + ' 11 ' + Y(18.25) + 'V' + Y(21.5) + 'Z'
  return [
    ['path', { d: 'M3 23H21.5M3 21.7V23.3M21.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.85 23.65L22.15 22.35', ...con(0.75, 0.5) }],
    ['path', { d: body, class: 'wm-k' }],
    ['circle', { cx: 15, cy: Y(6.25), r: 0.8, fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
  ]
}
