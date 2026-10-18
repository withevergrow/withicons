// forge/hand/sketch/phone-off.mjs — the universal hang-up handset: one symmetric arch with an earpiece foot and a
// mouthpiece foot, two hachures in the shaded foot, and a single steady marker slash over a pencil ghost.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M17.5 17l1.9-1.5m-.1 2.4l1-.8', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    // pencil ghost of the arch
    ['path', { d: 'M2.4 16.4C2.2 12.6 6.4 9.6 12.2 9.4C14.2 9.4 16 9.7 17.5 10.3', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M2.6 15.4C2.4 12.1 6.6 9.2 12 9.2C17.4 9.2 21.6 12.1 21.4 15.4C21.4 17.2 20.4 18 19.4 18L17.8 17.9C16.7 17.8 16.2 17.1 16.2 16.2L16.2 14.6C16.2 13.4 14.4 12.6 12 12.6C9.6 12.6 7.8 13.4 7.8 14.6L7.8 16.2C7.8 17.1 7.3 17.8 6.2 17.9L4.6 18C3.6 18 2.6 17.2 2.6 15.4Z', class: 'wm-k' }],
    // the slash: pencil ghost, then one marker stroke
    ['path', { d: 'M21.2 3.2Q16.6 7.6 12.4 12.4Q7.9 17.2 3.1 21.2', ...pencil, class: 'wm-s' }],
    ['path', { d: 'M20.7 3.6Q16.5 7.7 12.2 12.3Q7.8 16.9 3.4 20.6', class: 'wm-s' }],
  ]
}
