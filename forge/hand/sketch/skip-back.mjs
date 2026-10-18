// forge/hand/sketch/skip-back.mjs — one closed pencil triangle that ends by riding back over its own right edge (no
// stray hook) and a doubled bar so the "previous" stop stays heavy at 16px.
export default function render() {
  return [
    ['path', { d: 'M15.2 14.3l2.8-2.2M16.6 15.3l1.6-1.3M13.6 12.8l3.4-2.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M19.65 7.6Q19.75 12 19.55 16.4M18.3 17.85Q14 15.6 10 12.4Q14 9.2 18.5 6.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M19.3 10.5Q19.4 14 19.25 16.6Q19.2 17.9 17.9 17.3Q14.2 15.2 10.6 12.9Q9.5 12.1 10.5 11.2Q14.1 8.8 17.8 6.7Q19.2 6 19.3 7.3Q19.35 9 19.25 12.6', class: 'wm-k' }],
    ['path', { d: 'M4.55 5.3Q4.4 12 4.65 18.9', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M5 4.8Q4.8 12 5.1 19.2M5.7 5.6Q5.6 12 5.8 18.6', class: 'wm-a' }],
  ]
}
