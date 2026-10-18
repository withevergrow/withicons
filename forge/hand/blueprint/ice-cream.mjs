// forge/hand/blueprint/ice-cream.mjs — the drafted ice-cream cone, drawn at full size: a wide round scoop (frame to frame)
// with a scalloped drip edge and one long drip, on a V cone. The generated drawing ringed it with a target circle and heavy
// dimension lines; here only a short, firm baseline under the cone tip remains as the drafting hint.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.6) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M9.5 23.5H14.5M9.5 22.6V24.4M14.5 22.6V24.4', ...con(0.7) }],
    // scoop with scalloped edge and a drip
    ['path', { d: 'M3.5 9.5A8.5 8.5 0 1 1 20.5 9.5A2.5 2.5 0 0 1 15.5 9.5L15.5 11.75A1.75 1.75 0 0 1 12 11.75L12 9.5A2 2 0 0 1 8 9.5A2 2 0 0 1 3.5 9.5Z', class: 'wm-k' }],
    // cone
    ['path', { d: 'M6.5 14.75H17.5L12 21.75Z', class: 'wm-a' }],
  ]
}
