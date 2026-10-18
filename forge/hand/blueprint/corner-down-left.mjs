// forge/hand/blueprint/corner-down-left.mjs — the drafted Enter arrow with a solid mitred head; the generated drawing
// hollowed the tip with a control ring (shaft and head stopped short of it) and hung a dimension line under the head,
// so at 16px the point read open and cluttered. The shaft now runs into one unbroken head, rings sit only on the tail
// and the two head ends, and the construction lines are gone.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M19.5 5.58V11A4 4 0 0 1 15.5 15H5.5', class: 'wm-k' }],
    ['path', { d: 'M8.39 11.11L4.5 15L8.39 18.89', class: 'wm-a' }],
    ['path', { d: ring(19.5, 4), ...node('wm-k') }],
    ['path', { d: ring(9.5, 10) + ring(9.5, 20), ...node('wm-a') }],
  ]
}
