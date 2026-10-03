// PASTEL compose — turns a hand composition (layers of primitives) into paint entries and
// IconNodes. FROZEN for redrawers: write layers, never nodes.
//
//   layers: [[key, shape, shape, ...], ...] painted in order (later on top)
//   key:    'hue'            a lit soft field (lavender peach mint sky butter blush paper)
//           'hue.flat'       base + rim only (thin bars, small parts)
//           'hue.well'       a recessed inlay (screens, windows, doorways)
//           'ink'            mid-tone detail ink (takes the hue of the field under it)
//           'shine'          an explicit glint (the automatic one is then skipped)
//           'shade' / 'shade.hue'   a soft shadow tone over what is below (folds, gaps)
//           'cut'            knocks these shapes out of every layer painted before it (moats, gaps)
//           any key + '@K' | '@A' | '@S' | '@deco'   forces the motion part (else read from the skeleton)
//
// Motion parts (forge/MOTION.md, Parts choreography): every primitive is matched against the
// skeleton. One that lies wholly off the object is decoration (wm-deco, no cast shadow); the
// rest take the plate of the skeleton lines they cover (wm-k / wm-a / wm-s).
import { shapeD, isShape, cut as cutShape, join, ringsOf, samplesOf, soften } from './_pastel-prim.mjs'
import { distToPolyline, pointInRing } from '../kernel/geom.mjs'
import { HUES, fieldOfRings, paintEntries } from './_pastel-paint.mjs'

const FOOT = 1.75     // a point within this of a skeleton line (or inside a fill) is on the object
const DECO_MAX = 0.12 // a primitive with less of itself on the object than this is decoration
const PLATE_MIN = 0.6 // share of a primitive's points nearest an A (S) line that makes it A (S)

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

// 'peach.well@A' -> { kind: 'field', hue: 'peach', mode: 'well', part: 'A' }
export function parseKey(key) {
  const [head, part] = String(key).split('@')
  const [a, b] = head.split('.')
  if (a === 'cut') return { kind: 'cut' }
  if (a === 'ink') return { kind: 'ink', mode: 'ink', hue: 'lavender', part }
  if (a === 'shine') return { kind: 'shine', mode: 'shine', hue: 'paper', part }
  if (a === 'shade') return { kind: 'shade', mode: 'shade', hue: HUES[b] ? b : null, part }
  if (!HUES[a]) return null
  return { kind: 'field', hue: a, mode: b === 'flat' || b === 'well' ? b : 'lit', part }
}

const bbOf = rs => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const r of rs) for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return [x0, y0, x1, y1] }
const meet = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]
// exact path data is kept when the solids of a group never overlap (the rim would
// otherwise stroke their inner seams); overlapping groups are traced from the field
function exactD(shape) {
  const sol = shape.subs.map(s => ringsOf({ subs: [s] })[0] || []).filter(r => r.length > 2)
  const pos = sol.filter(r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a > 0 })
  const bbs = pos.map(r => bbOf([r]))
  for (let i = 0; i < bbs.length; i++) for (let k = i + 1; k < bbs.length; k++) if (meet(bbs[i], bbs[k])) return null
  return shapeD(shape)
}

// layers -> paint entries (exported so a redraw can be checked or mixed with auto entries)
export function entriesOf(layers, icon) {
  const judge = classifier(icon)
  // 1) flatten to items, apply cuts in order
  const items = [] // { spec, shape }
  for (const Lr of layers || []) {
    if (!Array.isArray(Lr) || !Lr.length) continue
    const spec = parseKey(Lr[0])
    if (!spec) continue
    const shapes = Lr.slice(1).flat(Infinity).filter(isShape)
    if (!shapes.length) continue
    if (spec.kind === 'cut') {
      const k = join(...shapes)
      for (const it of items) it.shape = cutShape(it.shape, k)
      continue
    }
    for (const sh of shapes) items.push({ spec, shape: spec.kind === 'field' ? soften(sh, 0.6) : sh, src: sh })
  }
  // 2) motion parts
  let object = true
  if (judge) {
    for (const it of items) it.v = it.spec.part ? null : judge(it.src)
    object = items.some(it => it.v && it.v.on >= 0.5)
  }
  for (const it of items) {
    if (it.spec.part) { it.part = it.spec.part === 'deco' ? 'deco' : it.spec.part; continue }
    if (!it.v) { it.part = 'K'; continue }
    it.part = object && it.v.on < DECO_MAX ? 'deco' : it.v.plate
  }
  // every object needs a body: when nothing landed on K (a skeleton plated wholly A), the largest
  // auto-classified field becomes the body, so the object never moves as one "part"
  if (!items.some(it => it.part === 'K')) {
    let best = null, bestA = 0
    for (const it of items) {
      if (it.spec.kind !== 'field' || it.spec.part || it.part === 'deco' || it.spec.hue === 'paper') continue
      const bb = bbOf(ringsOf(it.shape)), a = (bb[2] - bb[0]) * (bb[3] - bb[1])
      if (a > bestA) { best = it; bestA = a }
    }
    if (best) { const key = best.spec; for (const it of items) if (it.spec === key && it.part !== 'deco' && !it.spec.part) it.part = 'K' }
  }
  // 3) group consecutive items of one key and one part into one entry
  const entries = []
  let prev = null
  for (const it of items) {
    const key = `${it.spec.kind}|${it.spec.hue}|${it.spec.mode}|${it.part}`
    if (prev && prev.key === key) { prev.shapes.push(it.shape); continue }
    prev = { key, spec: it.spec, part: it.part, shapes: [it.shape] }
    entries.push(prev)
  }
  const out = []
  for (const g of entries) {
    const sh = join(...g.shapes)
    const rings = ringsOf(sh)
    if (!rings.length) continue
    const Fd = fieldOfRings(rings)
    const e = { hue: g.spec.hue, mode: g.spec.mode, part: g.part, F: Fd }
    if (g.spec.kind === 'shade' && !e.hue) e.hue = null
    const d = exactD(sh)
    if (d) e.d = d
    out.push(e)
  }
  // shade without a hue takes the main hue
  const main = out.find(e => e.mode !== 'ink' && e.mode !== 'shine' && e.mode !== 'shade' && e.hue && e.hue !== 'paper')
  for (const e of out) if (!e.hue) e.hue = main ? main.hue : 'lavender'
  return out
}

export function compose(layers, icon, o = {}) {
  const E = entriesOf(layers, icon)
  const glint = !E.some(e => e.mode === 'shine')
  return paintEntries(E, { glint: o.glint ?? glint, cast: o.cast })
}
