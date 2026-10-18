// forge/hand/blueprint/users.mjs — the drafted pair of people with the back figure drawn as clean, unbroken head and
// shoulder arcs (the generated drawing hung control rings and a second centre mark on the back figure, so its head
// and shoulder read as two dangling hooks or question marks at 16px): rings sit only on the three foot ends, the one
// centre mark stays on the front head, and the keyline and dimension stay faint behind.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M20.14 17.8a10 10 0 0 1-1.61 1.77m-.55.44l-.32.23M13.42 21.9a10 10 0 0 1-2.39.05m-.7-.09l-.39-.07m-.68-.17a10 10 0 0 1-2.21-.93m-.59-.37l-.33-.23m-.55-.43a10 10 0 0 1-1.39-1.42M2.73 15.75a10 10 0 0 1-.63-2.31m-.07-.69l-.02-.4m0-.7a10 10 0 0 1 .37-2.37m.21-.67l.14-.37m.29-.64a10 10 0 0 1 1.3-2.01m.47-.52l.28-.28m.52-.47a10 10 0 0 1 2.01-1.3m.64-.29l.37-.14m.67-.21a10 10 0 0 1 2.37-.37m.7 0l.27.01M20.78 7.21a10 10 0 0 1 .89 2.22m.15.69l.07.39m.08.7a10 10 0 0 1-.1 2.39m-.13.69l-.1.37', ...con(0.34) }],
    ['path', { d: 'M3.6 23H14.4M16.6 23H20.4', ...con(0.5) }],
    ['path', { d: 'M6.9 8h2.4m.7 0h.4M9 5.9v2.4m0 .7v.4', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M12.5 8A3.5 3.5 0 0 1 5.5 8A3.5 3.5 0 0 1 12.5 8ZM2.5 19.43A4 4 0 0 1 6.5 15.5H11.5A4 4 0 0 1 15.5 19.43', class: 'wm-k' }],
    ['path', { d: 'M14.54 3.32A3.5 3.5 0 1 1 15.97 10M17.5 14A4 4 0 0 1 21.5 18V19.43', class: 'wm-a' }],
    ['path', { d: ring(2.5, 21) + ring(15.5, 21), ...node('wm-k') }],
    ['path', { d: ring(21.5, 21), ...node('wm-a') }],
  ]
}
