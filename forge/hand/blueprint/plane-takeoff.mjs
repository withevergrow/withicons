// forge/hand/blueprint/plane-takeoff.mjs — the aeroplane drawn as one closed outline at a clear 25 degrees (nose rising off the runway), with its
// flight-path axis running on from the tail as a chain and one plain runway line beneath (the generated drawing sat in a
// construction ring and capped the runway with markers that crowded the wings).
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = n => String(+n.toFixed(2))
const ANG = -25 * Math.PI / 180, S = 0.8, CX = 13.5, CY = 10.5
const tr = (x, y) => [CX + S * (x * Math.cos(ANG) - y * Math.sin(ANG)), CY + S * (x * Math.sin(ANG) + y * Math.cos(ANG))]
const pt = (x, y) => tr(x, y).map(f).join(' ')

// half outline of a swept aeroplane pointing +x (y up = negative), mirrored for the other side
const half = [[10.6, 0], [9.9, -1.0], [8.6, -1.8], [4, -2], [-0.8, -9.4], [-3.4, -9.4], [-4.6, -2], [-8, -1.8], [-9.4, -4.8], [-11, -4.8], [-11.4, -1.2]]
const outline = [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [x, -y])]

export default function render() {
  const d = 'M' + outline.map(([x, y]) => pt(x, y)).join('L') + 'Z'
  const a = tr(-13, 0), b = tr(-20, 0)
  return [
    ['path', { d: `M${a.map(f).join(' ')}L${b.map(f).join(' ')}`, ...con(0.5), 'stroke-dasharray': '1.2 1.2' }],
    ['path', { d, class: 'wm-k' }],
    ['path', { d: 'M3 21.5H21', class: 'wm-a' }],
  ]
}
