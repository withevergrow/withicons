// forge/hand/blueprint/shankh.mjs — the conch drawn as a drafted shell: a tapering spire to a sharp apex at the upper right
// crossed by whorl sutures, widening to a flared lip with the open mouth and its inner curl at the lower left, over a
// dimension line. The generated drawing was a blob with a curl; here the apex, the sutures and the open mouth make it a shell.
const D = { color: 'var(--with-accent, currentColor)', stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const T = { color: 'var(--with-accent, currentColor)', stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...D }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', ...T }],
    // shell: apex upper right, flared lip round the lower left
    ['path', { d: 'M21.5 2.5C17.5 4.5 13 6.5 9.5 8.5C4.5 8.5 1.5 13.5 3.5 17.5C5.5 21.5 11 22.5 15 19.5C19.5 15.5 21 9 21.5 2.5Z', class: 'wm-k' }],
    // whorl sutures across the spire
    ['path', { d: 'M16.56 4.9Q19.8 6 20.29 10.14M13.48 6.42Q17.8 8.8 18.72 14.5', class: 'wm-k' }],
    // open mouth and its inner curl
    ['path', { d: 'M9 12.5C5.8 13 5 17 7.5 19C10 20.6 13.5 19 13.2 16C13 13.8 11.2 12.2 9 12.5Z', class: 'wm-a' }],
    ['path', { d: 'M9 15.5C10.4 14.9 11.8 15.6 11.8 17', 'stroke-width': 1, class: 'wm-a' }],
  ]
}
