// forge/hand/kawaii/battery-low.mjs: pale battery with one short red low bar at the left (the low-charge read), a small
// tired face on the empty part, and the terminal nub.
const BODY = 'var(--with-kawaii-shine, #FFFFFF)'
const LOW = 'var(--with-kawaii-fill-1, #FF5C6C)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, currentColor)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

export default function render() {
  return [
    ['path', { d: 'M4 7H17A2 2 0 0 1 19 9V15A2 2 0 0 1 17 17H4A2 2 0 0 1 2 15V9A2 2 0 0 1 4 7Z', fill: BODY, 'fill-opacity': 0.82, stroke: 'none' }],
    ['path', { d: 'M5.2 9.2H6.4Q7.3 9.2 7.3 10.1V13.9Q7.3 14.8 6.4 14.8H5.2Q4.3 14.8 4.3 13.9V10.1Q4.3 9.2 5.2 9.2Z', fill: LOW, stroke: 'none', class: 'wm-a' }],
    ['path', { d: 'M12.6 8.55L10.2 8.6', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: 'M9.5 13.4a1 .6 0 1 0 2 0a1 .6 0 1 0 -2 0ZM16.2 13.4a1 .6 0 1 0 2 0a1 .6 0 1 0 -2 0Z', fill: BLUSH, 'fill-opacity': 0.55, stroke: 'none' }],
    ['path', { d: 'M4 7H17A2 2 0 0 1 19 9V15A2 2 0 0 1 17 17H4A2 2 0 0 1 2 15V9A2 2 0 0 1 4 7ZM22 10.5V13.5', class: 'wm-k' }],
    ['path', { d: disc(11.4, 11.6, 0.7) + disc(15.6, 11.6, 0.7), fill: FACE, stroke: 'none' }],
    ['path', { d: 'M12.7 13.9Q13.5 13.2 14.3 13.9', stroke: FACE, 'stroke-width': 0.6 }],
    ['path', { d: disc(11.62, 11.35, 0.24) + disc(15.82, 11.35, 0.24), fill: SHINE, stroke: 'none', class: 'wm-shine' }],
  ]
}
