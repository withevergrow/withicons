// forge/hand/sketch/cloud-lightning.mjs — one clear loose cloud stroke open at the base with a faint offset trace, a grey hatch in the
// cloud's lower-left belly, a short highlight arc on the upper right, and a bold zigzag bolt dropping through its base.
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
export default function render() {
  return [
    ['path', { d: 'M5.6 12.6L7 11.2M7.4 13.2L9.1 11.5M9.2 13.3L10.6 11.9M16.2 12.8L17.4 11.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: 'M7.75 14.3A4.05 4.05 0 0 1 7.03 6.29A5.58 5.58 0 0 1 17.74 6.74A3.83 3.83 0 0 1 16.98 14.3', ...GHOST, class: 'wm-k' }],
    ['path', { d: 'M7.5 14A4.05 4.05 0 0 1 6.78 5.99A5.58 5.58 0 0 1 17.49 6.44A3.83 3.83 0 0 1 16.73 14', 'stroke-width': 1.7, class: 'wm-k' }],
    ['path', { d: 'M13.6 9.2L10 16.6L15 16.6L12.4 22', 'stroke-width': 1.7, class: 'wm-a' }],
  ]
}
