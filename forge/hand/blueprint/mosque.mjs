// forge/hand/blueprint/mosque.mjs — a drafted mosque: an onion dome on a hall with a door arch, a solid crescent
// finial, and a minaret standing clear of the hall with a gap between them. The generated drawing wrapped the lot
// in a guide circle and tangled dome, minaret and finial; here only the dimension line and one apex ring remain.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = n => +n.toFixed(2)
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

// crescent = big circle minus a circle shifted up-right
function crescent(cx, cy, R, ox, oy, r) {
  const dx = ox, dy = oy, d = Math.hypot(dx, dy)
  const a = (R * R - r * r + d * d) / (2 * d), h = Math.sqrt(R * R - a * a)
  const mx = cx + dx * a / d, my = cy + dy * a / d
  const p1 = [mx + h * dy / d, my - h * dx / d], p2 = [mx - h * dy / d, my + h * dx / d]
  return `M${f(p1[0])} ${f(p1[1])}A${R} ${R} 0 1 0 ${f(p2[0])} ${f(p2[1])}A${r} ${r} 0 0 1 ${f(p1[0])} ${f(p1[1])}Z`
}

export default function render() {
  return [
    ['path', { d: 'M2 23.1H22M2 21.9V24.2M22 21.9V24.2', ...con(0.5) }],
    ['path', { d: 'M1.35 23.75L2.65 22.45M21.35 23.75L22.65 22.45', ...con(0.75), 'stroke-width': 0.5 }],
    ['path', { d: 'M2.5 21.5H13.5V15H2.5ZM2.5 15H13.5M13.5 21.5H22', class: 'wm-k' }],
    ['path', { d: 'M3.8 15C3.2 12.2 5.6 10.8 7 9.8C7.8 9.2 8.5 8.5 8.5 7.4C8.5 8.5 9.2 9.2 10 9.8C11.4 10.8 13.8 12.2 13.2 15', class: 'wm-k' }],
    ['path', { d: 'M17.4 21.5V10.2M20.6 21.5V10.2M16.4 10.2H21.6M17.9 10.2V8.2H20.1V10.2M17.9 8.2L19 4.8L20.1 8.2', class: 'wm-a' }],
    ['path', { d: 'M7 21.5V19.2A1.5 1.5 0 0 1 10 19.2V21.5', class: 'wm-a' }],
    ['path', { d: 'M8.5 7.4V5.9', class: 'wm-s' }],
    ['path', { d: crescent(8.4, 3.9, 2.1, 0.9, -0.8, 1.6), fill: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' }],
    ['path', { d: ring(19, 3.7), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
