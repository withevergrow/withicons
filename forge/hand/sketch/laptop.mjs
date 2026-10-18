// forge/hand/sketch/laptop.mjs: a squarer screen panel, a clear gap, then a distinctly wider slab base with a thumb
// notch, so screen and base never read as one blob.
export default function render() {
  return [
    ['path', { d: 'M5.5 4.5L18.7 4.3Q19.9 4.3 19.9 5.5L20 13Q20 14.2 18.8 14.2L5.3 14.3Q4.1 14.2 4.1 13L4 5.7Q4.1 4.5 5.5 4.5Z', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5.2 4.2L18.5 4Q19.7 4 19.7 5.2L19.8 12.7Q19.7 13.9 18.5 13.9L5.1 14Q3.9 13.9 3.9 12.7L3.8 5.4Q3.9 4.2 5.2 4.2Z', class: 'wm-k' }],
    ['path', { d: 'M1.6 17.1L22.4 17Q22.6 17 22.5 17.3L21.6 19.5Q21.4 19.9 20.9 19.9L3.1 20Q2.6 19.9 2.4 19.5L1.4 17.4Q1.3 17.1 1.6 17.1Z', class: 'wm-k' }],
    ['path', { d: 'M10 17.1Q12 18.5 14 17.1', 'stroke-width': 1, class: 'wm-a' }],
  ]
}
