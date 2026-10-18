// forge/hand/blueprint/nutcracker.mjs — the toy soldier: plume loop on a tall hat, brim, two eyes, curled moustache and
// a square beard block under a rounded jaw, over a dimension line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M6 23H18M6 22.2V23.6M18 22.2V23.6', ...con(0.5) }],
    ['path', { d: 'M5.35 23.65L6.65 22.35M17.35 23.65L18.65 22.35', ...tick }],
    // plume loop
    ['path', { d: 'M13.4 3.4A1.4 1.4 0 1 1 10.6 3.4A1.4 1.4 0 1 1 13.4 3.4Z', class: 'wm-a' }],
    // hat and brim
    ['path', { d: 'M8 9L7.2 4.8H16.8L16 9', class: 'wm-k' }],
    ['path', { d: 'M6.5 9H17.5V11H6.5Z', class: 'wm-k' }],
    // jaw
    ['path', { d: 'M7 11V15A3 3.5 0 0 0 10 18.5M17 11V15A3 3.5 0 0 1 14 18.5', class: 'wm-k' }],
    // beard block
    ['path', { d: 'M10 18.5H14V21H10Z', class: 'wm-a' }],
    // eyes
    ['path', { d: 'M10.1 12.8A.6.6 0 1 0 8.9 12.8A.6.6 0 1 0 10.1 12.8M15.1 12.8A.6.6 0 1 0 13.9 12.8A.6.6 0 1 0 15.1 12.8', fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
    // curled moustache
    ['path', { d: 'M12 15C11 17 9 17 8.8 15.4M12 15C13 17 15 17 15.2 15.4', class: 'wm-k' }],
  ]
}
