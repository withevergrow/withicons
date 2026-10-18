// forge/hand/sketch/wrap-text.mjs — two straight pencil rows and a long line that bends round in one smooth hook onto
// a crisp open chevron, replacing a crossed, smudged arrowhead that vanished at 16px.
export default function render() {
  return [
    ['path', { d: 'M3.3 5.3Q12.1 5.15 20.8 5.35M3.25 19.3Q5.6 19.4 7.9 19.25', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3 5Q12 4.9 21 5.05M3 19Q5.5 19.1 8 18.95', class: 'wm-k' }],
    ['path', { d: 'M3.3 12.3Q10.4 12.15 17.4 12.3C21.9 12.4 21.95 19.2 17.55 19.3Q14.9 19.35 12.4 19.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M3 12Q10.25 11.9 17.5 12C22.15 12.05 22.15 19 17.5 19Q14.75 19.05 12.25 19', class: 'wm-a' }],
    ['path', { d: 'M15.25 15.85Q13.6 17.45 12 19Q13.65 20.6 15.25 22.15', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
