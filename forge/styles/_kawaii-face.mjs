// KAWAII faces, cheeks, hearts and sparkles.
// A face is placed where the clearance field C (distance from any ink, cutout
// or body edge, positive inside the body) leaves room for it: the largest scale
// that fits wins, then the position within the roomiest pocket, set low.
import { N, NN, H, gx, sample, components } from './_kawaii-field.mjs'
import { nums } from './_kawaii-path.mjs'

// face metrics at scale s (face centre = middle of the eye line)
export const faceMetrics = s => ({
  ex: 2.35 * s, er: Math.max(0.55, 0.86 * s),
  my: 0.78 * s,
  bx: 3.75 * s, by: 0.9 * s, brx: Math.max(0.62, 0.98 * s), bry: Math.max(0.4, 0.6 * s),
  lw: Math.max(0.42, Math.min(0.62, 0.55 * s)),
})

const S_MAX = 1.25, S_MIN = 0.7, S_STEP = 0.05, BACKOFF = 0.1

// constraints: [dx, dy, need] relative to the face centre
function probes(s, blush) {
  const m = faceMetrics(s), P = [[0, 0, Math.max(0.6, 0.72 * m.ex)]]
  for (const sx of [-1, 1]) {
    P.push([sx * m.ex, 0, m.er + 0.42])
    P.push([sx * m.ex, -m.er * 0.9, 0.45])
    P.push([sx * m.ex * 0.5, m.my * 0.5, 0.5])
    if (blush) {
      P.push([sx * m.bx, m.by, Math.max(0.2, 0.45 * m.brx)])
      P.push([sx * (m.bx + m.ex) / 2, m.by * 0.5, 0.45])
    }
  }
  P.push([0, m.my, 0.55 * s + 0.3])
  return P
}

// cells where a face of scale s fits (centre = eye-line middle)
function feasible(C, s, blush, near) {
  const P = probes(s, blush)
  const ok = new Uint8Array(NN)
  let any = false
  for (let k = 0; k < NN; k++) {
    if (C[k] < P[0][2]) continue
    const x = gx(k % N), y = gx((k - k % N) / N)
    if (near && (x - near[0]) ** 2 + (y - near[1]) ** 2 > near[2] * near[2]) continue
    let good = true
    for (let q = 1; q < P.length; q++) { const [dx, dy, need] = P[q]; if (sample(C, x + dx, y + dy) < need) { good = false; break } }
    if (good) { ok[k] = 1; any = true }
  }
  return any ? ok : null
}

// C: clearance grid. Returns { x, y, s, blush } or null.
// The largest face that fits is found first, then shrunk a little so it never
// looks crammed, and set in the middle of its pocket, a touch low (baby schema).
export function placeFace(C, opt = {}) {
  const sMax = Math.min(S_MAX, opt.sMax || S_MAX)
  const near = opt.near ? [opt.near[0], opt.near[1], opt.near[2] || 2.5] : null
  for (const blush of [true, false]) {
    const lo = opt.sMin || (blush ? S_MIN : 0.66)
    for (let s = sMax; s >= lo - 1e-9; s -= S_STEP) {
      const okMax = feasible(C, s, blush, near)
      if (!okMax) continue
      const sf = Math.max(lo, s * (1 - BACKOFF))
      const okBack = sf < s - 1e-6 ? feasible(C, sf, blush, near) : null
      const ok = okBack || okMax, s1 = okBack ? sf : s
      const { comps } = components(ok)
      let best = comps[0]
      for (const c of comps) if (c.cells.length > best.cells.length) best = c
      let y0 = Infinity, y1 = -Infinity, sx = 0
      for (const k of best.cells) {
        const x = gx(k % N), y = gx((k - k % N) / N)
        if (y < y0) y0 = y; if (y > y1) y1 = y; sx += x
      }
      const tx = sx / best.cells.length, ty = y0 + 0.58 * (y1 - y0)
      let bk = best.cells[0], bd = Infinity
      for (const k of best.cells) {
        const x = gx(k % N), y = gx((k - k % N) / N)
        const d = (x - tx) ** 2 + (y - ty) ** 2
        if (d < bd - 1e-9) { bd = d; bk = k }
      }
      return { x: gx(bk % N), y: gx((bk - bk % N) / N), s: Math.round(s1 * 100) / 100, blush }
    }
  }
  return null
}

// ---- drawing ---------------------------------------------------------------
const dotD = (x, y, r) => `M${nums([x - r, y])}a${nums([r, r])} 0 1 0 ${nums([2 * r, 0])}a${nums([r, r])} 0 1 0 ${nums([-2 * r, 0])}Z`
const ellD = (x, y, rx, ry) => `M${nums([x - rx, y])}a${nums([rx, ry])} 0 1 0 ${nums([2 * rx, 0])}a${nums([rx, ry])} 0 1 0 ${nums([-2 * rx, 0])}Z`
export const ellipseD = ellD
export const discD = dotD

// heart centred at (x, y), k = half-width
export function heartD(x, y, k) {
  const P = [[0, 0.95], [-0.42, 0.62], [-1, 0.2], [-1, -0.3], [-1, -0.75], [-0.68, -1], [-0.36, -1], [-0.14, -1], [0, -0.86], [0, -0.68],
    [0, -0.86], [0.14, -1], [0.36, -1], [0.68, -1], [1, -0.75], [1, -0.3], [1, 0.2], [0.42, 0.62], [0, 0.95]]
  const q = P.map(([u, v]) => [x + u * k, y + v * k])
  let d = 'M' + nums(q[0])
  for (let i = 1; i + 2 < q.length; i += 3) d += 'C' + nums([...q[i], ...q[i + 1], ...q[i + 2]])
  return d + 'Z'
}
// four-point twinkle, r = tip radius
export function sparkleD(x, y, r) {
  const w = 0.17 * r
  const pts = [[0, -r], [w, -w], [r, 0], [w, w], [0, r], [-w, w], [-r, 0], [-w, -w]]
  let d = 'M' + nums([x, y - r])
  for (let i = 0; i < 4; i++) {
    const c = pts[2 * i + 1], e = pts[(2 * i + 2) % 8]
    d += 'Q' + nums([x + c[0], y + c[1], x + e[0], y + e[1]])
  }
  return d + 'Z'
}

// face -> { fill: d (eyes, filled mouths), stroke: d (line features), shine: d (eye glints), lw }
export function drawFace(f, expr) {
  const m = faceMetrics(f.s), { x, y, s } = f
  let fill = '', stroke = '', shine = ''
  const L = [x - m.ex, y], R = [x + m.ex, y]
  const arcUp = ([ex, ey]) => `M${nums([ex - 0.62 * s, ey + 0.28 * s])}Q${nums([ex, ey - 0.62 * s, ex + 0.62 * s, ey + 0.28 * s])}`   // ^
  const arcDown = ([ex, ey]) => `M${nums([ex - 0.62 * s, ey - 0.1 * s])}Q${nums([ex, ey + 0.62 * s, ex + 0.62 * s, ey - 0.1 * s])}`  // u (closed, content)
  const dotEye = ([ex, ey]) => {
    fill += dotD(ex, ey, m.er)
    if (s >= 0.72) shine += dotD(ex - 0.3 * m.er, ey - 0.34 * m.er, 0.34 * m.er)
  }
  const xEye = ([ex, ey]) => { const r = 0.5 * s; stroke += `M${nums([ex - r, ey - r])}l${nums([2 * r, 2 * r])}M${nums([ex + r, ey - r])}l${nums([-2 * r, 2 * r])}` }
  const heartEye = ([ex, ey]) => { fill += heartD(ex, ey + 0.05 * s, 0.82 * s) }
  const my = y + m.my
  const smileU = (w = 0.6) => { stroke += `M${nums([x - w * s, my - 0.12 * s])}Q${nums([x, my + 0.62 * s, x + w * s, my - 0.12 * s])}` }
  const smileW = () => {
    const w = 0.5 * s
    stroke += `M${nums([x - 2 * w, my - 0.1 * s])}Q${nums([x - w, my + 0.6 * s, x, my])}Q${nums([x + w, my + 0.6 * s, x + 2 * w, my - 0.1 * s])}`
  }
  const openMouth = () => {   // a little D: flat top, round bottom
    const w = 0.62 * s, t = my - 0.18 * s
    fill += `M${nums([x - w, t])}h${nums([2 * w])}a${nums([w, w])} 0 0 1 ${nums([-2 * w, 0])}Z`
  }
  const oMouth = () => { const r = 0.36 * s + 0.1; stroke += dotD(x, my + 0.1 * s, r) }
  const frown = () => { stroke += `M${nums([x - 0.55 * s, my + 0.32 * s])}Q${nums([x, my - 0.22 * s, x + 0.55 * s, my + 0.32 * s])}` }

  switch (expr) {
    case 'cat': dotEye(L); dotEye(R); smileW(); break
    case 'joy': stroke += arcUp(L) + arcUp(R); openMouth(); break
    case 'wink': dotEye(L); stroke += arcUp(R); smileU(); break
    case 'sleepy': stroke += arcDown(L) + arcDown(R); smileU(0.45); break
    case 'calm': stroke += arcDown(L) + arcDown(R); smileW(); break
    case 'shock': dotEye(L); dotEye(R); oMouth(); break
    case 'sad': dotEye(L); dotEye(R); frown(); break
    case 'dizzy': xEye(L); xEye(R); smileW(); break
    case 'love': if (s >= 0.7) { heartEye(L); heartEye(R) } else { dotEye(L); dotEye(R) } openMouth(); break
    default: dotEye(L); dotEye(R); smileU()
  }
  return { fill, stroke, shine, lw: m.lw }
}

export function cheeksD(f) {
  const m = faceMetrics(f.s)
  return ellD(f.x - m.bx, f.y + m.by, m.brx, m.bry) + ellD(f.x + m.bx, f.y + m.by, m.brx, m.bry)
}
