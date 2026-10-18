// forge/hand/blueprint/avatar-boy.mjs — the drafted boy: one clean round face under a single spiky-tuft haircut, two dot eyes, a smile
// and plain shoulders. The generated drawing ran a spiky hair path across the head outline, ringed every eye and hair point with
// control dots and crossed the face with a centre chain, which turned into noise at 16px. Here the construction stays outside the
// figure: only the baseline dimension under the shoulders, with nothing drawn on the face.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M5 23H19M5 21.7V23.3M19 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M4.35 23.65L5.65 22.35M18.35 23.65L19.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // face (open at the temples, where the hair closes it)
    ['path', { d: 'M6.71 9A5.5 5.5 0 1 0 17.29 9', class: 'wm-k' }],
    // hair: rounded cap with a fringe and one pointed tuft
    ['path', { d: 'M6.7 9C6.1 6.4 8.2 4.8 10.4 4.8L12.4 2L14.4 4.9C16.6 5.2 18.2 6.6 17.3 9C15 8.7 13.2 7.8 12.4 6.4C11 8.1 8.7 8.9 6.7 9Z', class: 'wm-k' }],
    // shoulders
    ['path', { d: 'M5 21.5V21C5 19.2 8 18.3 12 18.3C16 18.3 19 19.2 19 21V21.5', class: 'wm-k' }],
    // smile
    ['path', { d: 'M10 13.4C11 14.5 13 14.5 14 13.4', class: 'wm-k' }],
    // eyes
    ['path', { d: 'M10.4 11A.8.8 0 1 0 8.8 11A.8.8 0 1 0 10.4 11M15.2 11A.8.8 0 1 0 13.6 11A.8.8 0 1 0 15.2 11', fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
  ]
}
