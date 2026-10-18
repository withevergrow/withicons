// forge/hand/gloss/smile-plus.mjs — a smiling face set low-left with a bold plus well clear in the top-right corner.
const S = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
export default function render() {
  return [
    ['circle', { cx: 10, cy: 14, r: 7.6, ...S, 'stroke-width': 2.4, class: 'wm-k' }],
    ['circle', { cx: 7.4, cy: 12.4, r: 1.3, class: 'wm-k' }],
    ['circle', { cx: 12.6, cy: 12.4, r: 1.3, class: 'wm-k' }],
    ['path', { d: 'M6.6 16a4 4 0 0 0 6.8 0', ...S, 'stroke-width': 2.2, class: 'wm-k' }],
    ['path', { d: 'M19.5 1.8v6M16.5 4.8h6', ...S, 'stroke-width': 2.6, class: 'wm-s' }],
    ['path', { d: 'M5.4 9.6a5.6 5.6 0 0 1 3-2.2', ...S, 'stroke-width': 0.8, class: 'wm-shine' }],
  ]
}
