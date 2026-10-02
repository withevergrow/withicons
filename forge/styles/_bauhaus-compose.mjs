// BAUHAUS compose — turns a list of coloured primitive layers into IconNodes.
//   layers: [[role, shape, shape, ...], ...] painted in order (later on top);
//   ['cut', shape...] knocks those shapes out of every layer painted before it
//   (a moat around a badge, a gap between two parts): real geometry, not paint.
//   Consecutive layers of one role (and one motion part) merge into one path.
//
// Motion parts (forge/MOTION.md, Parts choreography): given the skeleton, every primitive
// is matched against it. One that lies wholly off the object (the moon's companion disc,
// the sun over a mountain) is decoration, class wm-deco, so it never plays the object's
// motion; the rest take the plate of the skeleton lines they cover (wm-k / wm-a / wm-s),
// tagged only when the composition has more than one plate. Every node keeps its exact
// geometry and paint order, so the drawing is unchanged.
import { shapeD, isShape, cut as cutShape, join, ringsOf, windingAt, samplesOf, soften } from './_bauhaus-prim.mjs'
import { distToPolyline, pointInRing } from '../kernel/geom.mjs'

// role -> default colour (CSS variable --with-bauhaus-<role>)
export const PALETTE = {
  ink: 'currentColor', // black geometry: dots, bars, rings, text
  c1: '#E0412E',       // red
  c2: '#F2B33D',       // yellow
  c3: '#2A6BC2',       // blue (5:1 on white, 3.5:1 on the dark page)
  c4: '#E9772E',       // orange: red over yellow
  accent: '#2E7A5E',   // green: blue over yellow
  tint: '#F3EBDD',     // cream paper: light geometry on a dark field
  shadow: '#151515',   // fixed black: black geometry printed on a colour field (stays black in dark mode)
}
export const ROLES = Object.keys(PALETTE)
export const paint = role => `var(--with-bauhaus-${role}, ${PALETTE[role] || 'currentColor'})`

// ---------------------------------------------------------------------------------
// what a primitive is, measured against the skeleton
const FOOT = 1.75     // a point within this of a skeleton line (or inside a fill) is on the object
const DECO_MAX = 0.12 // a primitive with less of itself on the object than this is decoration
const PLATE_MIN = 0.6 // share of a primitive's points nearest an A (S) line that makes it A (S)
const PLATE = { K: 'wm-k', A: 'wm-a', S: 'wm-s' }

function classifier(icon) {
  const lines = (icon && icon.lines || []).filter(l => l.pts && l.pts.length)
  if (!lines.length) return null
  const rings = [
    ...(icon.fills || []).flatMap(f => f.set || []),
    ...lines.filter(l => l.closed && l.pts.length > 2).map(l => l.pts),
  ].filter(r => r && r.length > 2)
  const plated = lines.some(l => l.plate === 'A' || l.plate === 'S')
  return shape => {
    const rs = ringsOf(shape)
    let pts = samplesOf(rs, 0.5)
    if (pts.length < 12) pts = samplesOf(rs, 0.25)
    if (!pts.length) return { plate: 'K', on: 1 }
    let on = 0
    const votes = { K: 0, A: 0, S: 0 }
    for (const p of pts) {
      let best = Infinity, pl = 'K'
      for (const l of lines) { const d = distToPolyline(p, l.pts, l.closed); if (d < best) { best = d; pl = l.plate || 'K' } }
      if (best < FOOT || rings.some(r => pointInRing(p, r))) on++
      if (plated) votes[pl] = (votes[pl] || 0) + 1
    }
    const n = pts.length
    const plate = votes.A / n > PLATE_MIN ? 'A' : votes.S / n > PLATE_MIN ? 'S' : 'K'
    return { plate, on: on / n }
  }
}

// per primitive: 'deco' | 'K' | 'A' | 'S' (null without a skeleton)
function partsOf(layers, icon) {
  const judge = classifier(icon)
  if (!judge) return null
  const seen = new Map()
  for (const L of layers) {
    if (!L || !L.length || L[0] === 'cut' || !PALETTE[L[0]]) continue
    for (const sh of L.slice(1).flat(Infinity).filter(isShape)) seen.set(sh, judge(sh))
  }
  // decoration only exists beside an object: a composition with nothing on the skeleton
  // is a free redraw of it, all object
  const vals = [...seen.values()]
  const object = vals.some(v => v.on >= 0.5)
  const part = new Map()
  for (const [sh, v] of seen) part.set(sh, object && v.on < DECO_MAX ? 'deco' : v.plate)
  return part
}

export function compose(layers, icon) {
  const part = partsOf(layers, icon)
  const partOf = sh => (part && part.get(sh)) || 'K'
  const out = [] // [{role, shape, part}]
  for (const L of layers) {
    if (!L || !L.length) continue
    const [role, ...ss] = L
    const shapes = ss.flat(Infinity).filter(isShape)
    if (!shapes.length) continue
    if (role === 'cut') {
      const k = join(...shapes)
      for (const o of out) o.shape = cutShape(o.shape, k)
      continue
    }
    if (!PALETTE[role]) continue
    // black geometry is classified per shape: on a colour field it prints in the
    // fixed black (shadow), on the page it follows currentColor (ink)
    if (role === 'ink') { for (const sh of shapes) out.push({ role, shape: sh, ink: true, part: partOf(sh) }); continue }
    // one entry per motion part (a single entry, exactly as before, when all agree)
    const groups = new Map()
    for (const sh of shapes) { const p = partOf(sh); if (!groups.has(p)) groups.set(p, []); groups.get(p).push(sh) }
    for (const [p, g] of groups) out.push({ role, shape: join(...g), part: p })
  }
  for (let k = 0; k < out.length; k++) {
    const o = out[k]
    if (!o.ink) continue
    const pts = samplesOf(ringsOf(o.shape))
    if (!pts.length) continue
    const fields = out.slice(0, k).filter(q => !q.ink && q.role !== 'ink').map(q => ringsOf(q.shape))
    const on = pts.filter(p => fields.some(r => windingAt(p, r))).length
    if (on / pts.length > 0.5) o.role = 'shadow'
  }
  // A run of one colour used to print as one path. Split it by part only where the pieces
  // stand apart: pieces of different parts that touch or overlap print as one path (as K),
  // since two abutting paths would show an anti-aliased seam the single path does not have.
  const live = out.filter(o => shapeD(o.shape))
  softenAll(live)
  for (let i = 0; i < live.length;) {
    let j = i
    while (j + 1 < live.length && live[j + 1].role === live[i].role) j++
    if (j > i && new Set(live.slice(i, j + 1).map(o => o.part)).size > 1) {
      const run = live.slice(i, j + 1)
      const rings = run.map(o => ringsOf(o.shape))
      for (let changed = true; changed;) {
        changed = false
        for (let a = 0; a < run.length; a++) for (let b = a + 1; b < run.length; b++) {
          if (run[a].part === run[b].part || !touch(rings[a], rings[b])) continue
          run[a].part = run[b].part = 'K'
          changed = true
        }
      }
    }
    i = j + 1
  }
  // plates are tagged only when the object has more than one
  const multi = live.some(o => o.part === 'A' || o.part === 'S')
  const cls = p => p === 'deco' ? 'wm-deco' : multi ? PLATE[p] : null
  // one path per part within each run (order inside a run of one opaque colour is free)
  const nodes = []
  let run = null
  for (const { role, shape, part: p } of live) {
    const d = shapeD(shape)
    const c = cls(p)
    if (!run || run.role !== role) run = { role, by: new Map() }
    const node = run.by.get(c)
    if (node) { node[1].d += d; continue }
    const a = { d, fill: paint(role) }
    if (c) a.class = c
    const n = ['path', a]
    run.by.set(c, n)
    nodes.push(n)
  }
  return nodes
}

// The house rule, enforced once for every icon: no hard corners. Every sharp convex
// corner of every printed field (a half disc's chord ends, a quarter disc's point, the
// ends of a flat band, the edges a moat or slash leaves) is rounded with radius SOFT,
// except where the corner sits flush against another field (within FLUSH): the seam
// of a split disc, a chord standing on a bar, a dog-ear in its notch. Those joints
// read as one continuous form and stay exact.
const SOFT = 0.8, FLUSH = 0.3
function softenAll(live) {
  const all = live.flatMap((o, k) => o.shape.subs.map((sub, i) => ({ k, i, ring: ringsOf({ subs: [sub] })[0] || [] })))
  for (let k = 0; k < live.length; k++) {
    const o = live[k]
    o.shape = { subs: o.shape.subs.map((sub, i) => {
      const others = all.filter(r => !(r.k === k && r.i === i) && r.ring.length > 1)
      const keep = v => others.some(r => distToPolyline(v, r.ring, true) < FLUSH)
      return soften({ subs: [sub] }, SOFT, { keep }).subs[0]
    }) }
  }
}

// do two shapes touch or overlap (within a hair: their outlines would share anti-aliased pixels)?
const NEAR = 0.35
function touch(ra, rb) {
  const box = rs => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const r of rs) for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return [x0, y0, x1, y1] }
  const A = box(ra), B = box(rb)
  if (A[0] > B[2] + NEAR || B[0] > A[2] + NEAR || A[1] > B[3] + NEAR || B[1] > A[3] + NEAR) return false
  const dense = r => r.flatMap((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.25))
    return Array.from({ length: n }, (_, k) => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  })
  const hit = (P, Q) => P.some(r => dense(r).some(p => windingAt(p, Q) || Q.some(q => distToPolyline(p, q, true) < NEAR)))
  return hit(ra, rb) || hit(rb, ra)
}
