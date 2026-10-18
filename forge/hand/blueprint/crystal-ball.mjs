// forge/hand/blueprint/crystal-ball.mjs — a seer's orb: big sphere, bold four-point sparkle, a highlight arc on the glass,
// and a distinct stand (short neck + wide flat plinth) so it cannot be read as a globe or a lamp. Construction marks
// stay outside the figure (side ticks, slash ticks).
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.4 9.3h1.3M20.3 9.3h1.3', ...con(0.5) }],
    ['path', { d: 'M3.85 23.65L5.15 22.35M18.85 23.65L20.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M19.2 9.3A7.2 7.2 0 0 1 4.8 9.3A7.2 7.2 0 0 1 19.2 9.3Z', class: 'wm-k' }],
    ['path', { d: 'M7.1 8.3A5.1 5.1 0 0 1 9.4 4.7', class: 'wm-shine' }],
    ['path', { d: 'M12.6 6.2C13 8.4 13.9 9.3 16 9.8C13.9 10.3 13 11.2 12.6 13.4C12.2 11.2 11.3 10.3 9.2 9.8C11.3 9.3 12.2 8.4 12.6 6.2Z', class: 'wm-s' }],
    ['path', { d: 'M8.6 15.4L7.3 19.4M15.4 15.4L16.7 19.4', class: 'wm-a' }],
    ['path', { d: 'M4.5 19.4H19.5V22.4H4.5Z', class: 'wm-a' }],
  ]
}
