// forge/hand/blueprint/users-round.mjs — the drafted pair of round-headed people as plain head-and-shoulder outlines
// (the generated drawing put centre crosses inside both heads and hung control rings on the back head and the top of
// the back shoulder, so at 16px the heads filled with specks and the back figure read as two hooks): both heads are
// clean circles, the back head arc and shoulder are unbroken, and rings sit only on the three shoulder feet.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M19.65 18.44a10 10 0 0 1-1.58 1.51M13.81 21.83a10 10 0 0 1-2.39.15m-.69-.06l-.4-.06m-.68-.14a10 10 0 0 1-2.25-.84m-.61-.34l-.33-.22m-.57-.41a10 10 0 0 1-1.45-1.36M2.97 16.3a10 10 0 0 1-.76-2.27m-.12-.69l-.05-.4m-.04-.69a10 10 0 0 1 .23-2.39m.17-.68l.13-.38m.24-.65a10 10 0 0 1 1.18-2.09m.44-.54l.26-.3m.49-.5a10 10 0 0 1 1.93-1.42m.62-.32l.37-.17m.65-.25a10 10 0 0 1 2.34-.51m.7-.05h.4M20.78 7.21a10 10 0 0 1 .89 2.22m.15.69l.07.39m.08.7a10 10 0 0 1-.1 2.39m-.13.69l-.1.38m-.21.67l-.18.46', ...con(0.34) }],
    ['path', { d: 'M3.1 23H14.9M17.1 23H20.4', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M12.5 8A3.5 3.5 0 0 1 5.5 8A3.5 3.5 0 0 1 12.5 8ZM2.28 19.46C3.13 17.17 5.82 15.5 9 15.5C12.18 15.5 14.87 17.17 15.72 19.46', class: 'wm-k' }],
    ['path', { d: 'M14.54 3.32A3.5 3.5 0 1 1 15.97 10M17.5 15A4 6 0 0 1 21.36 19.43', class: 'wm-a' }],
    ['path', { d: ring(2, 21) + ring(16, 21), ...node('wm-k') }],
    ['path', { d: ring(21.5, 21), ...node('wm-a') }],
  ]
}
