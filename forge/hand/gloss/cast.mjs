// forge/hand/gloss/cast.mjs — a screen frame open at the lower left with three heavy broadcast arcs and a dot.
const S = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
export default function render() {
  return [
    ['path', { d: 'M2.5 8V6.5A2.5 2.5 0 0 1 5 4h14a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 19 20h-5', ...S, 'stroke-width': 2.4, class: 'wm-k' }],
    ['path', { d: 'M2.5 11.5a8 8 0 0 1 8 8M2.5 15.5a4 4 0 0 1 4 4', ...S, 'stroke-width': 2.4, class: 'wm-a' }],
    ['circle', { cx: 3, cy: 19.5, r: 1.6, class: 'wm-a' }],
    ['path', { d: 'M6 6.6h5', ...S, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
