// forge/hand/kawaii/oven.mjs: orange oven body, control strip with a display and two knobs, a pale window pane with warm
// heat squiggles, a bottom drawer and two feet. Thinner window ink so the pane stays legible at 16px.
const BODY = 'var(--with-kawaii-fill-2, #FF9A66)'
const HEAT = 'var(--with-kawaii-accent, #FF5C6C)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'
const FACE = 'var(--with-kawaii-face, #34231E)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

const SHELL = 'M6 2.5H18A2 2 0 0 1 20 4.5V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V4.5A2 2 0 0 1 6 2.5Z'
const WIN = 'M8.5 8.9H15.5Q17 8.9 17 10.4V13.6Q17 15.1 15.5 15.1H8.5Q7 15.1 7 13.6V10.4Q7 8.9 8.5 8.9Z'

export default function render() {
  return [
    ['path', { d: SHELL, fill: BODY, 'fill-opacity': 0.72, stroke: 'none' }],
    ['path', { d: WIN, fill: SHINE, 'fill-opacity': 0.88, stroke: 'none' }],
    ['path', { d: 'M5.2 18.5H8.2', stroke: SHINE, 'stroke-width': 0.8, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: SHELL + 'M4 6.75H20M4 17H20M6.5 22H8M16 22H17.5', 'stroke-width': 2, class: 'wm-k' }],
    ['path', { d: 'M9.3 4H13.2Q13.7 4 13.7 4.5V4.6Q13.7 5.1 13.2 5.1H9.3Q8.8 5.1 8.8 4.6V4.5Q8.8 4 9.3 4Z', fill: SHINE, 'fill-opacity': 0.9, stroke: 'none' }],
    ['path', { d: disc(15.9, 4.6, 0.8) + disc(18, 4.6, 0.8), fill: FACE, stroke: 'none' }],
    ['path', { d: WIN, 'stroke-width': 1.7, class: 'wm-a' }],
    ['path', { d: 'M10 10.6C9.4 11.1 9.4 11.7 10 12.1C10.6 12.5 10.6 13 10 13.4M12 10.6C11.4 11.1 11.4 11.7 12 12.1C12.6 12.5 12.6 13 12 13.4M14 10.6C13.4 11.1 13.4 11.7 14 12.1C14.6 12.5 14.6 13 14 13.4', stroke: HEAT, 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: 'M17.2 18.4a1 .55 0 1 0 2 0a1 .55 0 1 0 -2 0Z', fill: BLUSH, 'fill-opacity': 0.55, stroke: 'none' }],
  ]
}
