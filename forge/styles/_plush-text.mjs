// PLUSH Live-icon text: the last pass over a Live icon's pieces (forge/DYNAMIC.md).
//
// A value is embroidered in the dark ink thread, always on a LIGHT felt: where the felt under a block of text
// is a mid-tone (tomato, sky, mint), a cream label is sewn on under it first, clipped inside that felt with a
// seam allowance, so the digits stay crisp and high-contrast at 24px (cream thread on tomato reads as a blur).
// A block that would run into the piping (or past its label) is set a little smaller about its centre (never
// below 0.8).
import * as F from './_plush-field.mjs'
import * as P from './_plush-prim.mjs'
import * as Kit from './_plush-kit.mjs'
import { LIGHT } from './_plush-compose.mjs'

const ALLOW = 0.6  // the label's seam allowance inside its felt
const PAD = 0.55   // label margin round the thread
const bboxOf = Ls => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const L of Ls) for (const [x, y] of L) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return [x0, y0, x1, y1]
}
const dense = (L, step = 0.25) => {
  const out = [L[0]]
  for (let i = 1; i < L.length; i++) {
    const a = L[i - 1], b = L[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  return out
}

// Where a generator writes its value, the felt is chosen for the value (by name, never by whether text is
// present, so a value change never recolours the toy): a light felt the ink thread reads on, or, where the
// felt's colour is the meaning (a water drop, a timer, a map pin), a cream inner panel sewn on it.
//   [part, from role, to role]          the felt of that part and role is cut from `to` instead
//   [part, from role, 'panel', inset]   a cream panel, the felt inset by `inset`, is sewn on it
// (an entry may be a function of the params: a humidity drop shown as a level keeps its water)
const COUNT = [['S', 'c4', 'c2'], ['S', 'c1', 'c2']]
export const TEXT_FELT = {
  'app-badge': COUNT, 'bell-count': COUNT, 'cart-count': COUNT, 'inbox-count': COUNT, 'mail-count': COUNT, 'chat-count': COUNT,
  'avatar-initials': [['K', 'c3', 'c2']], 'badge-text': [['K', 'c4', 'c2']], 'cellular-tech': [['K', 'c3', 'c2']],
  'percent-badge': [['K', 'c4', 'c2']], 'sale-sticker': [['K', 'c4', 'c2']], 'step-number': [['K', 'c3', 'c2']],
  'ticket-number': [['K', 'c4', 'c2']], 'uv-index': [['K', 'c3', 'c2']],
  'file-type': [['K', 'c3', 'tint']], 'speech-bubble-text': [['K', 'c3', 'tint']], 'tag-label': [['K', 'c4', 'tint']],
  'calendar-date': [['K', 'c1', 'c2']], 'calendar-weekday': [['K', 'c1', 'c2']], 'calendar-month': [['K', 'c1', 'c2']],
  'humidity': q => (q && q.display === 'level' ? null : [['K', 'c3', 'panel', 1.15]]), 'map-pin-number': [['K', 'c4', 'panel', 1.0]],
  'progress-ring': [['K', 'c4', 'panel', 0.6]], 'timer-ring': [['K', 'c3', 'panel', 0.6]], 'battery-percent': [['K', 'c3', 'panel', 0.8]],
}
function dress(list, name, params) {
  const e = TEXT_FELT[name]
  const rules = typeof e === 'function' ? e(params) : e
  if (!rules) return list
  const out = []
  const match = (pc, part, from) => pc && pc.kind === 'felt' && pc.F && (pc.part || 'K') === part && pc.role === from
  // a panel goes on the biggest broad such felt only (a progress ring's disc, never its arc)
  const panelOn = new Set(rules.filter(r => r[2] === 'panel').map(([part, from]) => {
    let best = null, a = 0
    for (const pc of list) if (match(pc, part, from) && P.depth(P.exact(pc.F, 3)) > 2) { const v = P.area(pc.F); if (v > a) { a = v; best = pc } }
    return best
  }).filter(Boolean))
  for (const pc of list) {
    const r = rules.find(([part, from]) => match(pc, part, from))
    if (!r) { out.push(pc); continue }
    if (r[2] !== 'panel') { out.push({ ...pc, role: r[2] }); continue }
    if (!panelOn.has(pc)) { out.push(pc); continue }
    out.push(pc)
    const pan = P.shrink(pc.F, r[3])
    if (P.area(pan) > 1) out.push(Kit.felt('tint', pan, { part: pc.part, stitch: false, out: 0.4, pinch: false, shadeOp: 0.1, hiOp: 0.22, panel: true }))
  }
  // embroidery sewn on a new cream panel (a progress ring's done check) turns to the dark thread
  const panels = out.filter(pc => pc && pc.panel)
  if (panels.length) for (let i = 0; i < out.length; i++) {
    const pc = out[i]
    if (!pc || pc.kind !== 'thread' || pc.role === 'ink') continue
    const pts = pc.lines.flat()
    if (pts.length && panels.some(pn => pts.filter(q => F.sampleAt(pn.F, q[0], q[1]) < 0).length > pts.length / 2)) out[i] = { ...pc, role: 'ink', op: undefined }
  }
  return out
}

export function labelText(pieces, name, params) {
  const list = dress([...pieces], name, params)
  const idx = list.map((p, i) => (p && p.kind === 'thread' && p.text ? i : -1)).filter(i => i >= 0)
  if (!idx.length) return list
  // blocks: the glyphs of one row (gap < 3u); stacked rows are their own blocks (a month on its header,
  // the day on the page)
  const box = i => bboxOf(list[i].lines)
  const parent = idx.map((_, k) => k)
  const find = k => (parent[k] === k ? k : (parent[k] = find(parent[k])))
  for (let a = 0; a < idx.length; a++) for (let b = a + 1; b < idx.length; b++) {
    const A = box(idx[a]), B = box(idx[b])
    const gx = Math.max(A[0] - B[2], B[0] - A[2]), gy = Math.max(A[1] - B[3], B[1] - A[3])
    if (gy < 0 && gx < 3) parent[find(a)] = find(b)
  }
  const blocks = new Map()
  idx.forEach((i, k) => { const r = find(k); if (!blocks.has(r)) blocks.set(r, []); blocks.get(r).push(i) })
  const inserts = []
  for (const B of blocks.values()) {
    const first = Math.min(...B)
    const all = B.flatMap(i => list[i].lines)
    const bb = bboxOf(all), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]
    const w = Math.max(...B.map(i => list[i].w || 1.2))
    // the felt the block is sewn on: the topmost felt before it under most of its stitches
    const pts = all.flatMap(L => dense(L, 0.5))
    let host = null
    for (let k = first - 1; k >= 0 && !host; k--) {
      const pc = list[k]
      if (!pc || pc.kind !== 'felt' || !pc.F) continue
      const on = pts.filter(q => F.sampleAt(pc.F, q[0], q[1]) < 0).length
      if (on >= 0.5 * pts.length) host = pc
    }
    for (const i of B) list[i] = { ...list[i], role: 'ink', op: undefined }
    if (!host) continue
    const light = LIGHT.has(host.role)
    // the room: the host felt inside its seam allowance (the piping and the running stitch stay clear)
    // (a light felt only needs the thread kept off its piping; a label needs its seam allowance too)
    const room = P.shrink(host.F, host.panel || light ? 0.25 : ALLOW)
    const fits = q => pts.every(p => F.sampleAt(room, c[0] + (p[0] - c[0]) * q, c[1] + (p[1] - c[1]) * q) < -(w / 2 + (light ? 0.05 : PAD * 0.6)))
    let q = 1
    if (!fits(1)) { while (q > 0.8 && !fits(q)) q -= 0.02 }
    // (the thread is set smaller with it: a full-weight thread on smaller letters would close their counters)
    if (q < 1) for (const i of B) list[i] = { ...list[i], w: (list[i].w || 1.2) * q, lines: list[i].lines.map(L => L.map(([x, y]) => [c[0] + (x - c[0]) * q, c[1] + (y - c[1]) * q])) }
    if (light) continue
    const b2 = bboxOf(B.flatMap(i => list[i].lines))
    const r = w / 2 + PAD
    const lab = P.clip(P.rr(b2[0] - r, b2[1] - r, b2[2] + r, b2[3] + r, Math.min(1.4, (b2[3] - b2[1]) / 2 + r)), room)
    if (P.area(lab) < 1) continue
    inserts.push([first, Kit.felt('tint', lab, { part: list[first].part || host.part, stitch: false, out: 0.4, pinch: false, shadeOp: 0.1, hiOp: 0.22 })])
  }
  inserts.sort((a, b) => b[0] - a[0])
  for (const [at, pc] of inserts) list.splice(at, 0, pc)
  return list
}
