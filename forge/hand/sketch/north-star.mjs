// forge/hand/sketch/north-star.mjs — the full four-point concave sparkle drawn as one loose closed pencil outline with a pale offset
// trace, the small inner diamond kept, four short glints, and a grey pencil hatch down the shaded lower-left of the star.
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
export default function render() {
  return [
    ['path', { d: 'M9.4 13.6L10.6 12.5M9.7 15.6L11.2 14.2M10.4 17.8L11.6 16.6M7.2 12.1L8.4 11.7', ...HATCH, class: 'wm-k' }],
    ['path', { d: 'M12.3 2.3Q13.3 10.1 19.8 11.3Q13.3 12.3 12.3 22.3Q11.2 12.3 4.8 11.3Q11.3 10.1 12.3 2.3Z', ...GHOST, class: 'wm-k' }],
    ['path', { d: 'M12 2Q13 9.9 19.6 11Q13 12 12 22Q11 12 4.4 11Q11 9.9 12 2Q12.2 2.4 12.3 2.9', class: 'wm-k' }],
    ['path', { d: 'M12 8.9L13.3 11L12 13.2L10.7 11Z', 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: 'M16.3 5.7L17.7 4.3M7.7 5.7L6.3 4.3M16.3 16.3L17.7 17.7M7.7 16.3L6.3 17.7', 'stroke-width': 1.3, class: 'wm-a' }],
  ]
}
