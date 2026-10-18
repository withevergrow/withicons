// forge/hand/blueprint/key.mjs — the drafted key with a real key-ring hole and longer cut teeth. The generated drawing
// replaced the bow's hole with a centre-mark crosshair and kept two stubby teeth, so at 16px it read as a magnifier or
// a target on a stick. Here the bow carries its hole as object line, the end tooth is cut longer than the inner one
// (a proper key bit), the tip keeps its control ring and the keyline steps clear of the longer tooth.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.14 13.64a10 10 0 0 1-.11-2.39m.08-.7l.06-.39m.15-.68a10 10 0 0 1 .88-2.23m.36-.61l.22-.33m.41-.56a10 10 0 0 1 1.71-1.68m.57-.4l.34-.22m.61-.34a10 10 0 0 1 2.25-.83m.68-.14l.4-.06m.69-.06a10 10 0 0 1 2.39.15m.69.15l.38.11m.66.23a10 10 0 0 1 2.12 1.11M21.99 12.2a10 10 0 0 1-.43 2.36m-.23.66l-.15.37m-.3.63a10 10 0 0 1-1.35 1.98m-.48.51l-.29.27m-.54.46a10 10 0 0 1-2.04 1.25m-.64.27l-.38.13m-.67.2a10 10 0 0 1-2.38.31m-.7-.02l-.39-.03', ...con(0.34) }],
    ['path', { d: 'M3 23H20.5M3 21.2V23.22M20.5 21.2V23.22', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M19.85 23.65L21.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M13 16A5 5 0 0 1 3 16A5 5 0 0 1 13 16ZM9.5 16A1.5 1.5 0 0 1 6.5 16A1.5 1.5 0 0 1 9.5 16ZM11.5 12.5L19.39 4.61M18.5 5.5L21 8M15.5 8.5L17.5 10.5', class: 'wm-k' }],
    ['path', { d: ring(20.5, 3.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
