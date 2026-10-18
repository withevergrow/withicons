// forge/hand/blueprint/peacock-feather.mjs — the drafted peacock feather: a long curved quill leaning on a diagonal, an eye
// ring and pupil at the tip, and pairs of barbs fanning up and out of the quill below the eye (the old drawing was a
// short round head on a stub, so it read as a tennis racket or lollipop). One dimension line runs under the quill.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const R = v => Math.round(v * 100) / 100

// drawn upright (eye at the top, quill foot y 23), then leaned 20 degrees about the centre and nudged into the grid
const TH = 20 * Math.PI / 180, CS = Math.cos(TH), SN = Math.sin(TH)
const P = (x, y) => { const dx = x - 12, dy = y - 12; return `${R(13 + dx * CS - dy * SN)} ${R(12.2 + dx * SN + dy * CS)}` }
const M = (x, y) => `M${P(x, y)}`
const L = (x, y) => `L${P(x, y)}`
const C = (a, b, c, d, e, f) => `C${P(a, b)} ${P(c, d)} ${P(e, f)}`
function ell(cx, cy, rx, ry) {
  const k = 0.5523
  return M(cx + rx, cy) + C(cx + rx, cy + k * ry, cx + k * rx, cy + ry, cx, cy + ry) + C(cx - k * rx, cy + ry, cx - rx, cy + k * ry, cx - rx, cy)
    + C(cx - rx, cy - k * ry, cx - k * rx, cy - ry, cx, cy - ry) + C(cx + k * rx, cy - ry, cx + rx, cy - k * ry, cx + rx, cy) + 'Z'
}
// the quill from the vane foot to the end, bending to the left
const q = t => { const u = 1 - t; return [u ** 3 * 12 + 3 * u * u * t * 12 + 3 * u * t * t * 11 + t ** 3 * 8, u ** 3 * 12.6 + 3 * u * u * t * 16.5 + 3 * u * t * t * 19.5 + t ** 3 * 23.2] }
// a pair of barbs at height t, each dx out and dy up
const pair = (t, dx, dy) => { const [x, y] = q(t); return M(x, y) + L(x - dx, y - dy) + M(x, y) + L(x + dx, y - dy) }

export default function render() {
  return [
    ['path', { d: 'M12.5 23.3H22.5M12.5 22.1V23.6M22.5 22.1V23.6', ...con(0.5) }],
    // vane: a tall almond closing onto the quill
    ['path', { d: M(12, 0.8) + C(15.8, 2.2, 16.6, 7.6, 15, 10.4) + C(14.2, 11.8, 12.9, 12.4, 12, 12.6) + C(11.1, 12.4, 9.8, 11.8, 9, 10.4) + C(7.4, 7.6, 8.2, 2.2, 12, 0.8) + 'Z', class: 'wm-k' }],
    // quill
    ['path', { d: M(12, 12.6) + C(12, 16.5, 11, 19.5, 8, 23.2), class: 'wm-k' }],
    // barbs fanning off the quill
    ['path', { d: pair(0.34, 3, 3.4) + pair(0.7, 2.6, 3), class: 'wm-a' }],
    // eye ring and pupil
    ['path', { d: ell(12, 5.8, 1.6, 2.6), class: 'wm-a' }],
    ['path', { d: ell(12, 5.9, 0.5, 0.7), fill: 'currentColor', class: 'wm-a' }],
  ]
}
