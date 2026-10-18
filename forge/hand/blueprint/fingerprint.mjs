// forge/hand/blueprint/fingerprint.mjs — the drafted fingerprint with whole, flowing ridges. The generated drawing put a
// control ring on all five ridge ends and cut every ridge short for it, so at 16px the print read as a row of wired pins
// (a plug or circuit). Here only the outer arch's two free ends carry rings, the inner ridges run their full length with
// square ends, and the dimension line sits clear below.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M4 23H7.6M10.4 23H20M4 21.2V23.3M20 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M3.35 23.65L4.65 22.35M19.35 23.65L20.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4 16.43V11.5C4 6.53 7.58 2.5 12 2.5C16.42 2.5 20 6.53 20 11.5V12.43', class: 'wm-k' }],
    ['path', { d: 'M9 21C8.5 19.75 8 18.25 8 16.5V11.5C8 8.74 9.79 6.5 12 6.5C14.21 6.5 16 8.74 16 11.5V16M12 11V15C12 17.25 12.5 19 13.5 20.5M20 18C19.5 19.25 19 20.25 18 21', class: 'wm-a' }],
    ['path', { d: ring(4, 18) + ring(20, 14), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
