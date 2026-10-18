// forge/hand/blueprint/files.mjs — the drafted stack of files (the generated drawing hollowed both dog-ear corners
// with control rings, leaving the fold diagonal and the fold crease as loose dashes, so the front page's corner read as a
// broken scribble at 16-24px): the front page is one unbroken outline with a crisp mitred dog-ear and its crease, the
// back sheet keeps its rings on its two free ends, with the fillet construction and the width dimension below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // fillet construction (the sharp corners the radii were cut from) and the width dimension
    ['path', { d: 'M21.18 21.5H22.6M20.5 23.28V22.18M3.5 1.82V.72M1.4 2.5H2.82M7.5 22.18V23.28M5.4 21.5H6.82M6.82 6.5H5.4M7.5 4.4V5.82M3.5 23H20.5M3.5 21.7V23.3M20.5 22.2V23.3', ...con(0.5) }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M19.85 23.65L21.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // front page with its dog-ear, unbroken
    ['path', { d: 'M15.5 6.5H9.5A2 2 0 0 0 7.5 8.5V19.5A2 2 0 0 0 9.5 21.5H18.5A2 2 0 0 0 20.5 19.5V11.5Z', class: 'wm-k' }],
    // fold crease and the back sheet
    ['path', { d: 'M15.5 6.5V10A1.5 1.5 0 0 0 17 11.5H20.5M3.5 15.93V4.5A2 2 0 0 1 5.5 2.5H11.43', class: 'wm-a' }],
    ['path', { d: ring(3.5, 17.5) + ring(13, 2.5), ...node('wm-a') }],
  ]
}
