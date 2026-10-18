// forge/hand/blueprint/lucky-coin.mjs — a Chinese cash coin: round rim, square hole, four inscription bars. The crosshair
// through the hole is gone; the only construction is a faint dashed dimension ring just outside the rim.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const r2 = n => Math.round(n * 100) / 100

function dashRing(cx, cy, r, n) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 + 0.06
    const a1 = ((i + 0.55) / n) * Math.PI * 2
    d += `M${r2(cx + r * Math.cos(a0))} ${r2(cy + r * Math.sin(a0))}A${r} ${r} 0 0 1 ${r2(cx + r * Math.cos(a1))} ${r2(cy + r * Math.sin(a1))}`
  }
  return d
}

export default function render() {
  return [
    ['path', { d: dashRing(12, 12, 11.3, 18), ...con(0.34) }],
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12ZM10 8.5H14A1.5 1.5 0 0 1 15.5 10V14A1.5 1.5 0 0 1 14 15.5H10A1.5 1.5 0 0 1 8.5 14V10A1.5 1.5 0 0 1 10 8.5Z', class: 'wm-k' }],
    ['path', { d: 'M10.8 5.4H13.2M18.6 10.8V13.2M10.8 18.6H13.2M5.4 10.8V13.2', class: 'wm-a' }],
  ]
}
