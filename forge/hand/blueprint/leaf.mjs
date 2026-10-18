// forge/hand/blueprint/leaf.mjs — the drafted leaf with a closed, mitred tip and one centred midrib. The generated drawing
// broke the outline open at the tip for a control ring, so the tip read as a pin and the outline as an open swoosh at
// 16px. Here the outline is one closed symmetric lens, the midrib runs on its axis out into the stem, and the only ring
// sits on the free end of the stem (the sway pivot).
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M4 18.01a10 10 0 0 1-1.19-2.08m-.26-.65l-.12-.38m-.18-.68a10 10 0 0 1-.25-2.38m.04-.7l.04-.39m.11-.69a10 10 0 0 1 .74-2.28m.32-.62l.2-.35m.39-.59a10 10 0 0 1 1.6-1.77m.55-.44l.32-.23m.59-.38a10 10 0 0 1 2.19-.97m.68-.18l.39-.08m.69-.1a10 10 0 0 1 2.4.01m.69.11l.39.08m.67.19l.54.19M21.32 8.39a10 10 0 0 1 .6 2.32m.06.69l.02.4m-.01.7a10 10 0 0 1-.41 2.36m-.22.67l-.15.37m-.3.63a10 10 0 0 1-1.33 1.99m-.47.52l-.29.27m-.53.46a10 10 0 0 1-2.03 1.28m-.64.27l-.38.14m-.67.2a10 10 0 0 1-2.37.34m-.7-.01l-.39-.03m-.7-.09a10 10 0 0 1-2.3-.66m-.64-.29l-.35-.19m-.6-.36l-.63-.45', ...con(0.34) }],
    ['path', { d: 'M4.6 23H20.5M20.5 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M19.85 23.65L21.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M5.5 18.5C3.5 10.5 9.5 3.5 20.5 3.5C20.5 14.5 13.5 20.5 5.5 18.5Z', class: 'wm-k' }],
    ['path', { d: 'M4.1 19.88C7.74 16.09 11.46 11.63 16 8', class: 'wm-a' }],
    ['path', { d: ring(3, 21), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
