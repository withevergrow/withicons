// forge/hand/sketch/ban.mjs — a loose pencil ring with its overshoot at the top and the full top-left to bottom-right slash across it,
// plus a pale offset trace and one hatch mark, replacing a lone circle with a stray tick.
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const ring = 'M12 2.6C17.2 2.5 21.4 6.7 21.4 12C21.3 17.3 17.1 21.5 11.9 21.4C6.7 21.3 2.6 17.2 2.6 12C2.6 6.8 6.8 2.7 12 2.6Q12.8 2.6 13.6 2.9'
  const ghost = 'M12.3 2.9C17.5 2.8 21.7 7 21.7 12.3C21.6 17.6 17.4 21.8 12.2 21.7C7 21.6 2.9 17.5 2.9 12.3C2.9 7.1 7.1 3 12.3 2.9Z'
  return [
    ['path', { d: 'M14.6 6.6L17.4 9.4', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ghost, ...GHOST, class: 'wm-k' }],
    ['path', { d: ring, class: 'wm-k' }],
    ['path', { d: 'M5.5 5.4L18.5 18.6', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
