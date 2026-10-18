// forge/hand/blueprint/wifi-off.mjs: the drafted wifi fan struck through. The generated drawing ringed the arc ends and
// ran a keyline circle and a long dimension through the fan, so the slash disappeared into a cluster of dots. Here three
// full-weight arcs are trimmed evenly back from one heavier slash (computed, so every gap is the same width), the base dot
// stays solid, and a single faint dimension line sits below.
const ACCENT = 'var(--with-accent, currentColor)'
const R = v => Math.round(v * 100) / 100
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const CX = 12, CY = 18.5, GAP = 3.9 // GAP is the |y - x| clearance either side of the slash (the slash is y = x)

// arc of radius r from a0 to a1 degrees (screen angles, clockwise), keeping only the parts outside the slash gap
function arcPieces(r, a0, a1) {
  const pt = a => { const t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY + r * Math.sin(t)] }
  const out = [], n = 1800
  let start = null, prev = a0
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n, [x, y] = pt(a)
    const ok = Math.abs(y - x) > GAP
    if (ok && start === null) start = a
    if (start !== null && (!ok || i === n)) { out.push([start, ok ? a : prev]); start = null }
    prev = a
  }
  return out.filter(([s, e]) => (e - s) * Math.PI / 180 * r > 0.9).map(([s, e]) => {
    const [x0, y0] = pt(s), [x1, y1] = pt(e)
    return `M${R(x0)} ${R(y0)}A${r} ${r} 0 0 1 ${R(x1)} ${R(y1)}`
  }).join('')
}

export default function render() {
  return [
    ['path', { d: 'M5.5 22.4H18.5M5.5 21.9V22.9M18.5 21.9V22.9', ...con(0.5) }],
    ['path', { d: 'M4.85 23.05L6.15 21.75M17.85 23.05L19.15 21.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['circle', { cx: CX, cy: CY, r: 1.2, fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: arcPieces(4.75, 225, 315) + arcPieces(8.75, 225, 315) + arcPieces(12.75, 225, 315), class: 'wm-k' }],
    ['path', { d: 'M4.5 4.5L19.5 19.5', 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
