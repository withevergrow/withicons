// forge/hand/chrome/undo.mjs: one inflated chrome hook ending in its own big solid arrowhead, painted as the style's
// chrome tube with the mirror horizon laid across every run of metal (top bar, bend and tail each carry their own dark
// horizon). The generated drawing laid a thin pale gunmetal chevron over the tube, and its single horizon fell in the
// air between the two bars, so at 16px the head shrank to a tick and the tail faded into the background.
// Model and ramps from _chrome-core.mjs; only the geometry and the per-run horizon are drawn here.
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { emit, col, K as CK } from '../../styles/_chrome-core.mjs'

const HOOK = 'M7.5 9.5H14.75A5.5 5.5 0 0 1 14.75 20.5H9.5'
const HEAD = 'M9 4L3 9.5L9 15Z'

// the style's placement (drawing scaled about the centre, lifted for the shadow) and its pure-line tube width
const S = 0.88, OX = -0.2, OY = -0.55, WL = 2.9, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
// the metal: the hook as an inflated tube, and the arrowhead as a solid piece over its end, convex corners rounded
function metal() {
  const tube = F.open(F.strokes(lines(HOOK), WL, M0), CK.ROUND)
  const head = F.strokes(lines(HEAD), WL, M0)
  F.region(parsePath(HEAD).map(s => s.pts.map(tf)), M0, head)
  return { tube, head: F.open(head, CK.ROUND) }
}

const N = F.N, H = F.H
const inset = (Fd, e) => F.offset(F.copy(Fd), e)
const minus = (A, B) => F.subtract(F.copy(A), B)
function smooth(r) {
  const n = r.length
  if (n < 5) return r
  return r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
}
function bounds(Fd) {
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (Fd[j * N + i] < 0) {
    const x = i * H, y = j * H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return [x0, y0, x1, y1]
}
// the part of a field between fractions lo..hi of each contiguous vertical run of metal (0 top, 1 bottom)
function band(Fd, lo, hi) {
  const G = F.field(1)
  for (let q = 0; q < G.length; q++) if (!(Fd[q] < 0)) G[q] = Fd[q] < 0.05 ? 0.05 : Fd[q]
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!(Fd[j * N + i] < 0)) continue
      const a = j
      while (j + 1 < N && Fd[(j + 1) * N + i] < 0) j++
      const b = j
      const va = Fd[(a - 1) * N + i], vb = Fd[(b + 1) * N + i]
      const top = (a - 1) * H + H * va / (va - Fd[a * N + i])
      const bot = b * H + H * Fd[b * N + i] / (Fd[b * N + i] - vb)
      const L = bot - top, ylo = top + lo * L, yhi = top + hi * L
      for (let k = a; k <= b; k++) {
        const y = k * H
        let v = Fd[k * N + i]
        if (lo > 0) v = Math.max(v, ylo - y)
        if (hi < 1) v = Math.max(v, y - yhi)
        G[k * N + i] = v
      }
    }
  }
  return G
}
// the chrome tube world (as the generator paints a tube, the horizon a little deeper so the tail holds at 16px), per run
const BANDS = [[0, 0.2, 'shine', 0.9], [0.45, 1, 'c4'], [0.45, 0.7, 'ink'], [0.88, 1, 'shine', 0.75]]

export default function render(icon) {
  const name = (icon && icon.name) || 'undo'
  const { tube, head } = metal(), sil = F.union(F.copy(tube), head)
  const list = []
  const add = (Fd, fill, cls, op, q = 'body') => {
    const loops = F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth)
    if (loops.length) list.push({ loops, fill, cls, op, q })
  }
  const all = bounds(sil)
  add(minus(inset(F.shift(sil, 2, 8, 1), -0.05), sil), col('shadow'), 'wm-shadow', 0.2, 'soft')
  // the hook: a tube, its world laid in flat bands per run of metal
  add(tube, col('shadow'), 'wm-k')
  add(inset(tube, CK.EDGE), ['bevel', all], 'wm-k')
  const Tc = inset(tube, CK.BEVEL)
  add(Tc, col('tint'), 'wm-k')
  for (const [lo, hi, role, op] of BANDS) add(band(Tc, lo, hi), col(role), 'wm-k', op)
  add(minus(Tc, F.shift(Tc, 3, 4, 1)), col('shine'), 'wm-shine', 0.85, 'sheen2')
  // the arrowhead (part A, it leads the nudge): a solid blob in the generator's blob world over its own box
  add(head, col('shadow'), 'wm-a')
  add(inset(head, CK.EDGE), ['bevel', all], 'wm-a')
  const Hc = inset(head, CK.BEVEL), hb = bounds(Hc)
  add(Hc, ['sky', hb], 'wm-a')
  add(band(Hc, 0.5, 1), ['ground', hb], 'wm-a')
  add(band(Hc, 0.47, 0.565), col('ink'), 'wm-a')
  add(minus(Hc, F.shift(Hc, 3, 4, 1)), col('shine'), 'wm-shine', 0.85, 'sheen')
  // glint on the arrowhead, upper-left
  const x = 5.2, y = 7.6, r = 1.7, w = 0.3
  const glint = ['path', { d: `M${x} ${y - r}Q${x + w} ${y - w} ${x + r} ${y}Q${x + w} ${y + w} ${x} ${y + r}Q${x - w} ${y + w} ${x - r} ${y}Q${x - w} ${y - w} ${x} ${y - r}Z`.replace(/(\d+\.\d{3,})/g, m => String(Math.round(+m * 100) / 100)), fill: col('shine'), class: 'wm-shine' }]
  return emit({ list, glint }, name, 0)
}
