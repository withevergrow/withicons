// forge/hand/gloss/api.mjs — two heavy curly braces facing each other with a round endpoint dot between them: the
// unmistakable "{ }" of an API / JSON payload, drawn with the same fat round-capped strokes as gloss cast and code.
// The generated drawing was a three-node blob. Braces are the body (wm-k), the endpoint is the moving part (wm-a),
// and each brace carries the style's thin highlight hairline.
const S = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 2.4 }
const H = { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-width': 0.8 }
export default function render() {
  return [
    ['path', { d: 'M10.5 3.5H9.5A2.5 2.5 0 0 0 7 6V9.5A2.5 2.5 0 0 1 4.5 12A2.5 2.5 0 0 1 7 14.5V18A2.5 2.5 0 0 0 9.5 20.5H10.5', ...S, class: 'wm-k' }],
    ['path', { d: 'M13.5 3.5H14.5A2.5 2.5 0 0 1 17 6V9.5A2.5 2.5 0 0 0 19.5 12A2.5 2.5 0 0 0 17 14.5V18A2.5 2.5 0 0 1 14.5 20.5H13.5', ...S, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 2, class: 'wm-a' }],
    ['path', { d: 'M7 6.8V8.8', ...H, class: 'wm-shine' }],
    ['path', { d: 'M17 6.8V8.8', ...H, class: 'wm-shine' }],
  ]
}
