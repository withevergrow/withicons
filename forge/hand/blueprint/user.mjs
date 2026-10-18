// forge/hand/blueprint/user.mjs — round head over a rounded-shoulder bust as in line, drafted with a centre axis,
// a width dimension under the bust and extension ticks (no guide circle, no node dots).
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M4 23H20M4 21.7V23.3M20 21.7V23.3M12 .8V2M12 13.2V14M12 20.5V21.5', ...con(0.5) }],
    ['path', { d: 'M3.35 23.65L4.65 22.35M19.35 23.65L20.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M16 7.5A4 4 0 0 1 8 7.5A4 4 0 0 1 16 7.5Z', class: 'wm-k' }],
    ['path', { d: 'M4 20.5V19.5A4.5 4.5 0 0 1 8.5 15H15.5A4.5 4.5 0 0 1 20 19.5V20.5', class: 'wm-k' }],
  ]
}
