// forge/hand/blueprint/turtle.mjs — a domed shell with one central plate, two separated legs, a big round head and a tail; open outlines only.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const dot = (x, y, r = 0.3) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}`
const base = ['path', { d: 'M2.5 23H21.5M2.5 21.9V23.3M21.5 21.9V23.3', ...con(0.5) }]

export default function render() {
  return [
    base,
    ['path', { d: 'M2.5 14.5C2.5 9.5 6.25 6.5 10.75 6.5C15.25 6.5 18.5 9.5 18.5 14.5ZM9 9.5H12.5L14 12L12.5 14.5M9 14.5L7.5 12L9 9.5M5 14.5V17.5H7.75V14.5M13.25 14.5V17.5H16V14.5M2.5 14.5L1 15.5', class: 'wm-k' }],
    ['path', { d: 'M18.25 12.5C18.75 13.75 19.75 13.5 20.5 13.25M22.5 10.5A2 2 0 0 1 18.5 10.5A2 2 0 0 1 22.5 10.5Z', class: 'wm-a' }],
    ['path', { d: dot(21, 10, 0.35), 'stroke-width': 0.9, class: 'wm-a' }],
  ]
}
