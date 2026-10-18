// forge/hand/blueprint/satellite.mjs — the drafted satellite on the common diagonal: a diamond body between two square
// solar panels running upper-left to lower-right, a small dish and one signal arc at the lower left. The generated
// drawing laid it out horizontally with a top antenna and a dimension line, a different object at 16px; here the panels
// carry a fine centre line (the construction hint) and nothing else is added.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    // panel centre lines, the strut axis carried on through each panel
    ['path', { d: 'M6.18 3.68L10.07 7.57M16.43 13.93L20.32 17.82', ...con(0.5) }],
    // body and the two panels
    ['path', { d: 'M10.42 10.75L13.25 13.58L16.08 10.75L13.25 7.92Z', class: 'wm-k' }],
    ['path', { d: 'M7.95 9.69L4.06 5.8L8.3 1.56L12.19 5.45Z', class: 'wm-k' }],
    ['path', { d: 'M14.31 16.05L18.2 19.94L22.44 15.7L18.55 11.81Z', class: 'wm-k' }],
    // struts
    ['path', { d: 'M14.66 12.16L16.43 13.93M11.84 9.34L10.07 7.57', class: 'wm-a' }],
    // dish and its feed
    ['path', { d: 'M6.71 13.4A3.25 3.25 0 0 0 10.6 17.29Z', class: 'wm-a' }],
    ['path', { d: 'M11.84 12.16L9.89 14.11', class: 'wm-a' }],
    // signal arc
    ['path', { d: 'M3 13.93A7.07 7.07 0 0 0 10.07 21', class: 'wm-s' }],
  ]
}
