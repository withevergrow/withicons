// forge/hand/sketch/messages.mjs — two marker bubbles. The back bubble stops with a clear gap where it passes behind
// the front one (no broken, doubled outline) and carries one pair of light hachures in its visible corner.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M15.4 16.3l3.3-2.7m-5.4 3l1.9-1.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-a' }],
    // pencil construction under the front bubble
    ['path', { d: 'M2.75 16.9Q2.65 10.5 2.8 4.7M4.4 2.75Q10 2.6 15.55 2.85', ...pencil, class: 'wm-k' }],
    // front bubble: one loop, closing with a tiny overshoot at the top left
    ['path', { d: 'M4.9 3.05Q9 2.9 13 3.05Q15.05 3.05 15 5.1Q15.1 7.8 14.95 10.5Q14.95 12.45 12.95 12.5' +
      'Q9.7 12.45 6.5 12.55Q4.75 14.35 3.05 16.1Q2.9 10.5 3 5.05Q3.05 3 5.2 3.1L6 3.05', class: 'wm-k' }],
    // back bubble: stops 2.4 short of the front bubble on top and left, tail at the bottom right
    ['path', { d: 'M17.5 8.05Q18.7 7.98 19.05 8.02Q21 8.05 21 10.1Q21.05 15.5 20.95 20.95L17.5 17.55' +
      'Q14.2 17.45 11.05 17.5Q9.3 17.45 9.05 15.8L9.05 15', class: 'wm-a' }],
    ['path', { d: 'M21.3 9.4Q21.4 15 21.25 20.6M18.2 17.85Q14.2 17.8 10.3 17.9', ...pencil, class: 'wm-a' }],
  ]
}
