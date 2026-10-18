// forge/hand/sketch/avatar-person-glasses.mjs — a marker head with a hatched hair cap and two separate, rounded lens
// frames joined by a clear bridge, set lower so they never touch the fringe, replacing thin doubled lenses that fused
// with the hair into one dark band at 16px.
import { parsePath, rng, resample, pointInRing, distToPolyline, V } from '../../kernel/geom.mjs'

const f = n => { const r = Math.round(n * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
const wave = (r, amp) => { const a = [0, 1, 2].map(() => [r() * 6.28, 0.3 + r() * 0.5, r() - 0.5]); return s => a.reduce((t, [p, k, w]) => t + Math.sin(s * k + p) * w, 0) * amp }
function spline(Q, cont) {
  let d = `${cont ? 'L' : 'M'}${f(Q[0][0])} ${f(Q[0][1])}`
  for (let i = 1; i < Q.length - 1; i++) d += `Q${f(Q[i][0])} ${f(Q[i][1])} ${f((Q[i][0] + Q[i + 1][0]) / 2)} ${f((Q[i][1] + Q[i + 1][1]) / 2)}`
  return d + `L${f(Q.at(-1)[0])} ${f(Q.at(-1)[1])}`
}
// one stroke along pts: overshoot [start, end] (0 = pinned exactly at a joined corner), wobble, optional drifting tail
function run(pts, r, amp, over, drift = 0, cont = false) {
  const t0 = V.norm(V.sub(pts[0], pts[1])), t1 = V.norm(V.sub(pts.at(-1), pts.at(-2)))
  const P = [...(over[0] ? [V.add(pts[0], V.mul(t0, over[0]))] : []), ...pts, ...(over[1] ? [V.add(pts.at(-1), V.mul(t1, over[1]))] : [])]
  const S = resample(P, 0.8), w = wave(r, amp), L = S.length ? S.at(-1).s : 0
  const tot = S.length ? L + V.dist(S.at(-1).p, P.at(-1)) : 0
  const env = s => Math.min(over[0] ? 1 : Math.min(1, s / 1.2), over[1] ? 1 : Math.min(1, (tot - s) / 1.2))
  const at = (p, t, s) => { const k = w(s) * env(s) + drift * Math.max(0, (s - tot + 1.6) / 1.6); return [p[0] - t[1] * k, p[1] + t[0] * k] }
  const out = S.map(({ p, t, s }) => at(p, t, s))
  if (!S.length || V.dist(S.at(-1).p, P.at(-1)) > 0.05) out.push(at(P.at(-1), t1, tot))
  if (out.length < 2) out.unshift(at(P[0], V.mul(t0, -1), 0))
  return spline(out, cont)
}
// one hand-drawn ink line per skeleton subpath: lifts the pen at sharp corners between long edges (strokes cross a
// little), keeps short corners sharp and joined, loops close with an overshooting tail, free ends overshoot
function ink(d, seed, { amp = 0.1, over = 0.3, lift = 50, liftLen = 2.5 } = {}) {
  const r = rng('sketch-hand-' + seed); let out = ''
  for (const { pts, closed } of parsePath(d, 0.2)) {
    const n = pts.length, turn = i => { const a = V.norm(V.sub(pts[i], pts[(i - 1 + n) % n])), b = V.norm(V.sub(pts[(i + 1) % n], pts[i])); return Math.acos(Math.max(-1, Math.min(1, V.dot(a, b)))) * 57.3 }
    const cs = []; for (let i = closed ? 0 : 1; i < (closed ? n : n - 1); i++) if (turn(i) > 28) cs.push(i)
    if (closed && !cs.length) {
      let s = 0; pts.forEach((p, i) => { if (p[0] + p[1] < pts[s][0] + pts[s][1]) s = i })
      const loop = [...pts.slice(s), ...pts.slice(0, s)], tail = []; let L = 0
      for (let i = 0; L < 1.4 && i < n; i++) { tail.push(loop[i]); L += V.dist(loop[i], loop[(i + 1) % n]) }
      out += run([...loop, ...tail], r, amp, [0.15, 0], 0.3); continue
    }
    const seq = closed ? [...pts.slice(cs[0]), ...pts.slice(0, cs[0] + 1)] : pts
    const idx = closed ? [...cs.map(c => (c - cs[0] + n) % n), n] : [0, ...cs, n - 1]
    const segs = []; for (let k = 0; k < idx.length - 1; k++) segs.push(seq.slice(idx[k], idx[k + 1] + 1))
    const len = s => s.reduce((t, p, i) => i ? t + V.dist(p, s[i - 1]) : 0, 0)
    // joint k sits between segs[k-1] and segs[k]; lifted when sharp and both edges long
    const lifted = k => { if (!closed && (k === 0 || k === segs.length)) return true; const a = segs[(k - 1 + segs.length) % segs.length], b = segs[k % segs.length], i = idx[k % (idx.length - 1)]; return turn(closed ? (i + cs[0]) % n : i) > lift && len(a) >= liftLen && len(b) >= liftLen }
    segs.forEach((s, k) => {
      const l0 = lifted(k), l1 = lifted(k + 1)
      const o0 = l0 ? (!closed && k === 0 ? over : over * 0.7) : 0, o1 = l1 ? (!closed && k === segs.length - 1 ? over : over * 0.7) : 0
      if (s.length > 1) out += run(s, r, amp, [o0, o1], 0, !l0 && k > 0)
    })
  }
  return out
}
// hachure at -38deg inside a ring, clear of its edge, only where keep(p) says
function hatch(ringD, keep, { pitch = 2.2, clear = 1.1, min = 1.3 } = {}) {
  const ring = parsePath(ringD, 0.2)[0].pts, dir = [Math.cos(-0.663), Math.sin(-0.663)], nrm = [-dir[1], dir[0]]
  let d = ''
  for (let c = -40; c <= 40; c += pitch) {
    let cur = null
    for (let u = -40; u <= 40; u += 0.1) {
      const p = [12 + nrm[0] * c + dir[0] * u, 12 + nrm[1] * c + dir[1] * u]
      const ok = pointInRing(p, ring) && distToPolyline(p, ring, true) > clear && keep(p)
      if (ok) { if (!cur) cur = [p, p]; else cur[1] = p }
      if ((!ok || u + 0.1 > 40) && cur) { if (V.dist(cur[0], cur[1]) > min) d += `M${f(cur[0][0])} ${f(cur[0][1])}L${f(cur[1][0])} ${f(cur[1][1])}`; cur = null }
    }
  }
  return d
}
const CAP = 'M6.6 9.75C5.9 5.75 8.5 3 12 3C15.5 3 18.1 5.75 17.4 9.75C16.75 8.5 15.75 7.75 14.25 7.5C12.75 7.25 11.25 7.5 9.75 7C8.5 7.5 7.4 8.4 6.6 9.75Z'
const FACE = 'M6.6 9.75A5.5 6.25 0 1 0 17.4 9.75'
const LENS_L = 'M8.25 10H10A1 1 0 0 1 11 11V12A1 1 0 0 1 10 13H8.25A1 1 0 0 1 7.25 12V11A1 1 0 0 1 8.25 10Z'
const LENS_R = 'M14 10H15.75A1 1 0 0 1 16.75 11V12A1 1 0 0 1 15.75 13H14A1 1 0 0 1 13 12V11A1 1 0 0 1 14 10Z'
const BODY = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'

export default function render() {
  return [
    ['path', { d: hatch(CAP, p => p[0] > 9.5, { pitch: 1.8, clear: 0.95, min: 1 }), 'stroke-width': 0.8, 'stroke-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: ink(BODY, 'apg-body-pencil', { amp: 0.2, over: 0.5 }), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ink(CAP, 'apg-cap', { liftLen: 3 }) + ink(FACE, 'apg-face', { over: 0 }) + ink(BODY, 'apg-body'), class: 'wm-k' }],
    ['path', { d: ink(LENS_L, 'apg-lens-l', { amp: 0.05, liftLen: 9 }) + ink(LENS_R, 'apg-lens-r', { amp: 0.05, liftLen: 9 }) + 'M11.15 11.2Q12 10.85 12.85 11.2', class: 'wm-k' }],
    ['path', { d: ink('M10.5 15C11.5 15.7 12.5 15.7 13.5 15', 'apg-mouth', { amp: 0.03, over: 0.05 }), class: 'wm-k' }],
  ]
}
