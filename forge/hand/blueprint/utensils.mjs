// forge/hand/blueprint/utensils.mjs — the drafted fork with three open tines over a narrow neck, and a wide-bladed
// knife on a centred handle (the generated drawing hung rings on every tine tip and the blade tip, and its blade was a
// thin sliver broken by rings, so fork and knife blurred together at 16px): two clean silhouettes, rings only on the handle ends.
const ACCENT = 'var(--with-accent, currentColor)'
const con = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    // faint keyline, kept clear of the object lines
    ['path', { d: 'M20.48 17.31a10 10 0 0 1-1.16 1.5M15.73 21.28a10 10 0 0 1-2.31.62m-.7.07l-.4.02m-.7 0a10 10 0 0 1-2.36-.37M6.13 20.1a10 10 0 0 1-1.75-1.63m-.44-.55l-.23-.32m-.37-.6a10 10 0 0 1-.94-2.2m-.17-.68l-.08-.39m-.1-.69a10 10 0 0 1 .04-2.4m.12-.69l.09-.39M4.85 5.01a10 10 0 0 1 1.04-.93M12.72 2.03a10 10 0 0 1 2.35.45m.66.24l.37.16m.63.31l.08.04', ...con, 'stroke-opacity': 0.34 }],
    ['path', { d: 'M3.5 23H20.5M3.5 21.7V23.3M20.5 21.7V23.3', ...con }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M19.85 23.65L21.15 22.35', ...tick }],
    // fork: outer tines curving into the neck, the middle tine running on as the handle
    ['path', { d: 'M3.5 2.5V7A4 4 0 0 0 11.5 7V2.5M7.5 2.5V19.93', class: 'wm-k' }],
    // knife: broad blade on a straight spine, handle centred under it
    ['path', { d: 'M20.5 14.5V2.5C16.5 3.5 14.5 7 14.5 11.5V12.5A2 2 0 0 0 16.5 14.5ZM18 14.5V19.93', class: 'wm-a' }],
    // control rings on the two handle ends
    ['path', { d: ring(7.5, 21.5), ...node('wm-k') }],
    ['path', { d: ring(18, 21.5), ...node('wm-a') }],
  ]
}
