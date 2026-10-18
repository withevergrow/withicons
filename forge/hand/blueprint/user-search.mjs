// forge/hand/blueprint/user-search.mjs — find a person: a head and shoulders with a large magnifier at the lower right.
// The generated drawing had a small lens crowding the shoulder arc and a keyline crosshair on the head; here the lens is
// bigger with a long handle, well clear of the shoulders, and the head is a plain circle.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.5 23H22M2.5 21.8V23.4M22 21.8V23.4', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M21.35 23.65L22.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M12 7A3.5 3.5 0 0 1 5 7A3.5 3.5 0 0 1 12 7ZM2.5 19.5V18A4.5 4.5 0 0 1 7 13.5H7.5', class: 'wm-k' }],
    ['path', { d: 'M20 15.5A4.25 4.25 0 0 1 11.5 15.5A4.25 4.25 0 0 1 20 15.5ZM18.75 18.5L22 21.75', class: 'wm-s' }],
  ]
}
