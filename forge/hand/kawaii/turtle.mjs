// forge/hand/kawaii/turtle.mjs: green turtle in side view; a pale golden dome with an orange hexagon scute is set against
// the darker green body (head right, two stubby legs, tail left); thin ink so the shell pattern survives 16px.
import { heartD } from '../../styles/_kawaii-face.mjs'
const SKIN = 'var(--with-kawaii-fill-4, #45D99A)'
const SHELL = 'var(--with-kawaii-fill-3, #FFD23A)'
const PLATE = 'var(--with-kawaii-fill-2, #FF9A66)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, currentColor)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'
const ACCENT = 'var(--with-kawaii-accent, #FF5C9A)'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

const DOME = 'M3.2 13.2C3.2 8.6 6.4 5.4 10 5.4C13.6 5.4 16.3 8.6 16.3 13.2Z'
const LEG1 = 'M4.2 13V15.3A1.6 1.6 0 0 0 7.4 15.3V13'
const LEG2 = 'M11.9 13V15.3A1.6 1.6 0 0 0 15.1 15.3V13'
const TAIL = 'M3.6 11.6L1.6 13.3L3.8 13.3Z'
const NECK_FILL = 'M15.6 10.4C17 10.3 17.4 9.7 17.2 9L21.8 9.6C21.2 11.8 19.2 13.2 16.2 13.2Z'
const HEX = 'M8.6 7.9H10.9L12.05 9.85L10.9 11.8H8.6L7.45 9.85Z'

export default function render() {
  return [
    ['path', { d: LEG1 + 'Z' + LEG2 + 'Z' + TAIL + NECK_FILL + disc(19.2, 7.6, 2.6), fill: SKIN, 'fill-opacity': 0.9, stroke: 'none' }],
    ['path', { d: DOME, fill: SHELL, 'fill-opacity': 0.72, stroke: 'none' }],
    ['path', { d: HEX, fill: PLATE, 'fill-opacity': 0.75, stroke: 'none' }],
    ['path', { d: 'M18 8.9a.85 .5 0 1 0 1.7 0a.85 .5 0 1 0 -1.7 0Z', fill: BLUSH, 'fill-opacity': 0.55, stroke: 'none' }],
    ['path', { d: 'M5.6 10.3Q5.9 8.4 7.5 7.2', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: DOME + LEG1 + LEG2 + TAIL, 'stroke-width': 1.8, class: 'wm-k' }],
    ['path', { d: 'M15.6 10.4C17 10.3 17.4 9.7 17.2 9M16.2 13.2C19.2 13.2 21.2 11.8 21.8 9.6M16.6 7.6a2.6 2.6 0 1 1 5.2 0a2.6 2.6 0 1 1 -5.2 0Z', 'stroke-width': 1.8, class: 'wm-k' }],
    ['path', { d: HEX + 'M7.45 9.85H5.6M12.05 9.85H14M9.75 7.9V6.9', 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: disc(20.1, 7.2, 0.7), fill: FACE, stroke: 'none' }],
    ['path', { d: disc(20.3, 6.95, 0.24), fill: SHINE, stroke: 'none', class: 'wm-shine' }],
    ['path', { d: heartD(14.6, 3.3, 1.35), fill: ACCENT, stroke: 'none', class: 'wm-deco' }],
  ]
}
