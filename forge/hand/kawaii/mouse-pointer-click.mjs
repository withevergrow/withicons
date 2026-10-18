// forge/hand/kawaii/mouse-pointer-click.mjs — a chubby peach pointer at Kawaii cursor's proportions, wearing its little
// face centred in the arrow, with a three-ray click burst (180/225/270 degrees) around the tip; replaces the generated
// drawing, whose arrow was too small to carry a face and whose long rays crowded the tip.
// No blush: the arrow has no room for it at 1u clearance. Slots: body fill-2 (c1, the cursor's peach); face, shine fixed.
const f = v => +v.toFixed(2)
const BODY = 'var(--with-kawaii-fill-2, #FF9A66)'
const FACE = 'var(--with-kawaii-face, currentColor)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

const TIP = [7.5, 7.5]
const NOTCH = [15, 17.9]
// arrow corners (tip, right wing, notch, bottom wing) with the length cut back from each corner for its fillet
const CORNERS = [[TIP, 2.8], [[21.5, 17], 2.9], [NOTCH, 0.7], [[10.8, 22], 2.7]]

function rounded(pts) {
  const n = pts.length, at = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const cut = (a, b, r) => at(a, b, r / Math.hypot(b[0] - a[0], b[1] - a[1]))
  let d = ''
  for (let i = 0; i < n; i++) {
    const [p, r] = pts[i], prev = pts[(i + n - 1) % n][0], next = pts[(i + 1) % n][0]
    const a = cut(p, prev, r), b = cut(p, next, r)
    d += `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}Q${f(p[0])} ${f(p[1])} ${f(b[0])} ${f(b[1])}`
  }
  return d + 'Z'
}
// the burst: three short rays 45 degrees apart on a ring around the tip (left, up-left, up), well clear of the arrow
function rays() {
  let d = ''
  for (const deg of [180, 225, 270]) {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
    d += `M${f(TIP[0] + 3.6 * c)} ${f(TIP[1] + 3.6 * s)}L${f(TIP[0] + 5.2 * c)} ${f(TIP[1] + 5.2 * s)}`
  }
  return d
}
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`

export default function render() {
  const arrow = rounded(CORNERS)
  // face centred on the arrow body (eye line), half eye spacing 1.1: every part keeps 1u from the inner outline edge
  const ex = 13.15, ey = 15.3, gap = 1.1
  return [
    ['path', { d: arrow, fill: BODY, 'fill-opacity': 0.66, stroke: 'none', class: 'wm-k' }],
    ['path', { d: 'M9.95 11L10.35 13.4', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: arrow, class: 'wm-k' }],
    // tail
    ['path', { d: `M${NOTCH[0]} ${NOTCH[1]}L17.8 21.9`, class: 'wm-a' }],
    // face
    ['path', { d: disc(ex - gap, ey, 0.56) + disc(ex + gap, ey, 0.56), fill: FACE, stroke: 'none' }],
    ['path', { d: `M${f(ex - 0.42)} ${f(ey + 0.5)}Q${f(ex)} ${f(ey + 1.02)} ${f(ex + 0.42)} ${f(ey + 0.5)}`, stroke: FACE, 'stroke-width': 0.45 }],
    // click burst
    ['path', { d: rays(), 'stroke-width': 2, class: 'wm-s' }],
  ]
}
