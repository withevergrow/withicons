// forge/hand/blueprint/piggy-bank.mjs — open pig outline with a clear coin above the slot, separated ear, snout and one eye dot.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const dot = (x, y, r = 0.3) => `M${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}`
const base = ['path', { d: 'M2.5 23H21.5M2.5 21.9V23.3M21.5 21.9V23.3', ...con(0.5) }]

export default function render() {
  return [
    base,
    ['path', { d: 'M19 11.5C18 8.75 15 7.75 11.5 7.75C6.5 7.75 3.5 10.5 3.5 13.75C3.5 16 4.75 17.5 6.5 18.25V20.5H9V18.9H13V20.5H15.5V18.25C17 17.6 18.5 16.5 19 15.5H21V11.5ZM6.25 9L6.75 6L9 8.1M3.5 13.25C2.25 13.25 1.75 12.25 2.25 11.5M9.75 9.5H13.25', class: 'wm-k' }],
    ['path', { d: dot(15.75, 11.5, 0.45), 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M13.25 4.5A1.75 1.75 0 0 1 9.75 4.5A1.75 1.75 0 0 1 13.25 4.5Z', class: 'wm-s' }],
  ]
}
