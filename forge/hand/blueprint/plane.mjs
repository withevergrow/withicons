// forge/hand/blueprint/plane.mjs — the aeroplane as one closed, unbroken object line (the generated drawing cut the
// outline open at four wing roots for control rings and ringed it with a keyline, a tangle of fragments at 16px): the
// fuselage mirror axis runs on as a chain out of the tail, and the overall height is dimensioned on the right.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M22.9 3.5V21.9M21.5 3.5H23.3M21.5 21.9H23.3', ...con(0.5) }],
    ['path', { d: 'M22.25 4.15L23.55 2.85M22.25 22.55L23.55 21.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M5.07 18.93L3.37 20.63M2.88 21.12L2.6 21.4', ...con(0.5) }],
    ['path', { d: 'M16.6 4.58C17.83 3.34 19.18 3.27 20.13 3.87C20.73 4.82 20.66 6.17 19.42 7.4L15.89 10.94L18.19 20.66L16.95 21.9L12.18 14.65L8.82 18.01L9.35 21.37L8.82 21.9L5.99 18.01L2.1 15.18L2.63 14.65L5.99 15.18L9.35 11.82L2.1 7.05L3.34 5.81L13.06 8.11Z', class: 'wm-k' }],
  ]
}
