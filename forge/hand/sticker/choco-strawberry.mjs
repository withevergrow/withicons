// forge/hand/sticker/choco-strawberry.mjs — a die-cut chocolate-dipped strawberry sticker: a red berry with a mint leaf
// crown and a curled stem on top, three seeds and a brown chocolate dip with rounded drips over the tip, all inside one
// paper outline; replaces the generated drawing, whose crown and dip merged into a goggle or mask look on the berry.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'

// translate an absolute path (M L H V C Q A Z)
function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, a) => {
    const n = a.trim() ? a.trim().split(/[\s,]+/).map(Number) : []
    const o = []
    if (c === 'H') n.forEach(v => o.push(f(v + dx)))
    else if (c === 'V') n.forEach(v => o.push(f(v + dy)))
    else if (c === 'A') for (let i = 0; i < n.length; i += 7) o.push(n[i], n[i + 1], n[i + 2], n[i + 3], n[i + 4], f(n[i + 5] + dx), f(n[i + 6] + dy))
    else for (let i = 0; i < n.length; i += 2) o.push(f(n[i] + dx), f(n[i + 1] + dy))
    return c + o.join(' ')
  })
}
const spark = (cx, cy, r) => `M${f(cx)} ${f(cy - r)}Q${f(cx + r * 0.2)} ${f(cy - r * 0.2)} ${f(cx + r)} ${f(cy)}Q${f(cx + r * 0.2)} ${f(cy + r * 0.2)} ${f(cx)} ${f(cy + r)}Q${f(cx - r * 0.2)} ${f(cy + r * 0.2)} ${f(cx - r)} ${f(cy)}Q${f(cx - r * 0.2)} ${f(cy - r * 0.2)} ${f(cx)} ${f(cy - r)}Z`


const BERRY = 'var(--with-sticker-c1, #FF5470)'
const CHOC = 'var(--with-sticker-c2, #8A5237)'
const LEAF = 'var(--with-sticker-mint, #3FDDA4)'

// the berry outline as four cubics, tip first (x y pairs: p0 c1 c2 p1)
const A = [[12, 20.8], [7.6, 18.9], [5, 14.7], [5.2, 11.2]]
const B = [[5.2, 11.2], [5.4, 8.6], [8, 7.4], [12, 7.4]]
const C = [[12, 7.4], [16, 7.4], [18.6, 8.6], [18.8, 11.2]]
const D = [[18.8, 11.2], [19, 14.7], [16.4, 18.9], [12, 20.8]]
const at = (c, t) => {
  const m = 1 - t
  return [0, 1].map(i => m * m * m * c[0][i] + 3 * m * m * t * c[1][i] + 3 * m * t * t * c[2][i] + t * t * t * c[3][i])
}
// split a cubic at t: the part from 0..t and t..1
function split(c, t) {
  const l = (p, q) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
  const a = l(c[0], c[1]), b = l(c[1], c[2]), d = l(c[2], c[3])
  const e = l(a, b), g = l(b, d), h = l(e, g)
  return [[c[0], a, e, h], [h, g, d, c[3]]]
}
// parameter where a cubic reaches height y (y is monotone on A and D here)
function tAtY(c, y) {
  let lo = 0, hi = 1
  const up = c[3][1] < c[0][1]
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const v = at(c, mid)[1]
    if ((v > y) === up) lo = mid; else hi = mid
  }
  return (lo + hi) / 2
}
const P = p => f(p[0]) + ' ' + f(p[1])
const cub = c => 'C' + P(c[1]) + ' ' + P(c[2]) + ' ' + P(c[3])

const WAVE_Y = 15.6
const tl = tAtY(A, WAVE_Y), tr = tAtY(D, WAVE_Y)
const aTip = split(A, tl)[0] // tip up to the left end of the dip
const dTop = split(D, tr)[1] // right end of the dip down to the tip
const L = at(A, tl), R = at(D, tr)
// rounded chocolate lobes along the top edge, cusps between them (left to right)
const cusp = [L, [9.6, 16.1], [14.4, 15.9], R]
function lobes() {
  let d = 'M' + P(L)
  for (let i = 0; i < 3; i++) {
    const p = cusp[i], q = cusp[i + 1]
    const w = q[0] - p[0], h = i === 1 ? 1.3 : 1
    d += 'C' + f(p[0] + w * 0.12) + ' ' + f(p[1] - h * 1.6) + ' ' + f(q[0] - w * 0.12) + ' ' + f(q[1] - h * 1.6) + ' ' + P(q)
  }
  return d
}
const DIP = lobes() + cub(dTop) + cub(aTip) + 'Z'
const BODY = 'M' + P(A[0]) + cub(A) + cub(B) + cub(C) + cub(D) + 'Z'
const CROWN = 'M7.4 8 L8.6 5.6 L10.6 6.8 L12 4.8 L13.4 6.8 L15.4 5.6 L16.6 8 C15 9 13.4 9.2 12 8.6 C10.6 9.2 9 9 7.4 8 Z'
const STEM = 'M12 5.4 Q12.1 3.7 13.5 2.9'

export default function render() {
  const cut = (dx, dy) => shift(BODY + CROWN, dx, dy)
  const stem = (dx, dy) => shift(STEM, dx, dy)
  return [
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: stem(0.5, 0.8), stroke: SHADOW, 'stroke-width': 5.6, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: stem(0, 0), stroke: 'currentColor', 'stroke-width': 6.24, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    ['path', { d: stem(0, 0), stroke: EDGE, 'stroke-width': 5.6 }],
    // berry, chocolate dip, ink outline
    ['path', { d: BODY, fill: BERRY }],
    ['path', { d: DIP, fill: CHOC }],
    ['path', { d: BODY, stroke: INK, 'stroke-width': 1.5 }],
    ['path', { d: lobes(), stroke: INK, 'stroke-width': 1 }],
    // seeds
    ['path', { d: 'M8.3 11.8h.01M11.6 11.3h.01M15.4 11.8h.01M10.2 13.9h.01M13.8 13.7h.01', stroke: SHINE, 'stroke-width': 1.1, 'stroke-opacity': 0.9 }],
    // crown and stem
    ['path', { d: CROWN, fill: LEAF, stroke: INK, 'stroke-width': 1.5 }],
    ['path', { d: STEM, stroke: INK, 'stroke-width': 1.5 }],
    // gloss
    ['path', { d: 'M6.9 12.6 Q6.6 10.9 7.7 9.8', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: 'M9.4 18 Q10 17.2 11 16.9', stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.6, class: 'wm-shine' }],
    ['path', { d: spark(19.8, 4.6, 1.8), fill: 'var(--with-sticker-lemon, #FFD43B)', class: 'wm-deco' }],
    ['path', { d: spark(2.4, 21.8, 1), fill: 'var(--with-sticker-bubblegum, #FF6FB5)', class: 'wm-deco' }],
  ]
}
