// forge/hand/sketch/lightbulb-off.mjs: pencil bulb with a three-rib base; the outline is broken where the slash crosses
// it, so the short slash never merges with the bulb or the base ribs and stays clear at 16px.
const TOP = 'M6.56 4.93C7.72 3.16 9.72 2 12 2C15.6 2 18.5 4.9 18.5 8.5C18.5 11.29 16.8 12.76 15.77 14.15'
const LOW = 'M14.3 16L9 16C9 13.8 5.5 12.5 5.5 8.5C5.5 8.07 5.54 7.65 5.62 7.25'
const BASE = 'M9.4 18.4L14.6 18.4M10 20.5L14 20.5M11 22.3L13 22.3'
export default function render() {
  return [
    ['path', { d: TOP, class: 'wm-k' }],
    ['path', { d: LOW, class: 'wm-k' }],
    ['path', { d: BASE, class: 'wm-k' }],
    ['path', { d: 'M4.3 4.2Q10.5 10.1 16.7 16.4', 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
