// forge/hand/line/paper-fan.mjs — an open folding fan: a 120-degree wedge pivoting on a rivet at (12,18.5), four
// scalloped pleats on the leaf, a curved inner leaf edge and two bare guard sticks, replacing the squat generated fan
// whose V-shaped stick and inner arc made a lens-shaped knot at the hub.
export default function render() {
  return [
    ['path', { d: 'M10.7 17.75L2.5 13A4 4 0 0 1 6.5 9A4 4 0 0 1 12 7.5A4 4 0 0 1 17.5 9A4 4 0 0 1 21.5 13L13.3 17.75' }],
    ['path', { d: 'M7.75 16A5 5 0 0 1 16.25 16' }],
    ['path', { d: 'M9.5 14.25L6.5 9', class: 'wm-a' }],
    ['path', { d: 'M12 13.5V7.5', class: 'wm-a' }],
    ['path', { d: 'M14.5 14.25L17.5 9', class: 'wm-a' }],
    ['path', { d: 'M13.5 18.5A1.5 1.5 0 1 1 10.5 18.5A1.5 1.5 0 1 1 13.5 18.5Z', class: 'wm-s' }],
  ]
}
