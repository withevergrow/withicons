// forge/hand/blueprint/laptop.mjs — wide rounded screen with an inner bezel over a flat keyboard base wider than the screen.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const dots = (cls, ...p) => ({ d: p.map(([x, y]) => ring(x, y)).join(''), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M1 21H23M1 20.2V21.8M23 20.2V21.8M2.3 4H.9M3 2.6V3.4', ...con(0.5) }],
    ['path', { d: 'M12 1.6v1.4M12 6.6v2.4m0 .7v.4m0 .7v2.4', ...con(0.5) }],
    ['path', { d: 'M.35 21.65L1.65 20.35M22.35 21.65L23.65 20.35', ...tick }],
    ['path', { d: 'M5 4H19A2 2 0 0 1 21 6V16H3V6A2 2 0 0 1 5 4Z', class: 'wm-k' }],
    ['path', { d: 'M1 16H23V17.5A1.5 1.5 0 0 1 21.5 19H2.5A1.5 1.5 0 0 1 1 17.5Z', class: 'wm-k' }],
    ['path', { d: 'M6 7H18V13H6Z', class: 'wm-a' }],
    ['path', dots('wm-a', [10, 17.5], [14, 17.5])],
  ]
}
