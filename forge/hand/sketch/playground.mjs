// forge/hand/sketch/playground.mjs — a playground slide: ladder posts with rungs, a flat deck, and a broad
// two-edged chute (ribbed with hachure) sweeping down to a run-out, replacing a single thin curve beside an arched
// ladder that read as the letter A at 16px.
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
const TOP = 'M3.5 8H9.75C13 8 14 11 15.25 14.5C16.5 18 18 19.25 21.5 19.25V21.25'
const UNDER = 'M8 10.75C10.75 10.75 11.6 13 12.75 16.25C14 19.75 16.5 21.25 21.5 21.25'
const CHUTE = 'M8 8H9.75C13 8 14 11 15.25 14.5C16.5 18 18 19.25 21.5 19.25V21.25C16.5 21.25 14 19.75 12.75 16.25C11.6 13 10.75 10.75 8 10.75Z'
const LADDER = 'M3.5 21V4.75M8 21V4.75'
const RUNGS = 'M3.5 12.75H8M3.5 16.75H8'

export default function render() {
  return [
    ['path', { d: hatch(CHUTE, p => p[0] > 9.6, { pitch: 1.7, clear: 0.85, min: 0.5 }), 'stroke-width': 0.8, 'stroke-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: ink('M2.6 21.75H9', 'pg-pencil', { amp: 0.2, over: 0.6 }), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ink(LADDER, 'pg-ladder', { over: 0.3 }) + ink(RUNGS, 'pg-rungs', { over: 0.1 }) + ink(TOP, 'pg-top', { liftLen: 1.5 }) + ink(UNDER, 'pg-under', { over: 0.1 }), class: 'wm-k' }],
  ]
}
