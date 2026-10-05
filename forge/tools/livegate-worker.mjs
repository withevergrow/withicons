// Worker for the Live icon quality gate (forge/tools/check-dynamic.mjs --gate). One job = one generator (or a batch
// of static icons) through one style; returns raw metrics per stress set (+ markup for contact sheets).
import { parentPort } from 'worker_threads'
import { performance } from 'perf_hooks'
import { loadStyles, prepare, renderIcon, nodesToMarkup, loadIcon } from '../lib/load.mjs'
import { loadGenerator, buildSkeleton } from './lib-dynamic.mjs'
import {
  gateSet, raster, textSplits, textCoverage, changeArea, refGeometry, geometry, change, counters, dynMatch, absDiff, withoutText, textOnly, nonTextOnly,
  dynamicParts, removeParts, onlyParts, isText, mask, dilate, count, isValueType, S, U, drawnText,
} from './lib-livegate.mjs'

const styles = await loadStyles()
const render = (st, sk) => renderIcon(st, prepare(sk))
const R3 = (st, nodes) => ({ r96: raster(st, nodes, S, 'light'), l24: raster(st, nodes, 24, 'light'), d24: raster(st, nodes, 24, 'dark') })

// ── line reference per generator (cached per worker) ─────────────────────────────────────────────────────
const refs = new Map()
async function refFor(name) {
  if (refs.has(name)) return refs.get(name)
  const gen = await loadGenerator(name), line = styles.line
  const sets = gateSet(gen)
  const sks = sets.map(s => buildSkeleton(gen, s.p))
  const out = sets.map((s, i) => {
    const sk = sks[i], nodes = render(line, sk), rr = R3(line, nodes), hasText = sk.paths.some(isText)
    const tMask = hasText ? mask(raster(line, render(line, textOnly(sk)), S).a, 0.5) : null
    const o = { geo: refGeometry(rr.r96, tMask), rr, text: drawnText(sk), hasText, tMask }
    if (o.hasText) {
      const nt = R3(line, render(line, withoutText(sk)))
      const c = change(rr.r96, nt.r96, rr.l24, nt.l24, rr.d24, nt.d24)
      o.textE = c.energy; o.textA = changeArea(c.d96); o.counters = counters(c.d96)
    }
    return o
  })
  // pairs + dynamic parts (need the base renders)
  sets.forEach((s, i) => {
    if (s.vary === undefined) return
    const b = out[s.base], o = out[i], ps = gen.params[s.vary]
    const valueLike = isValueType(ps.type) || (ps.type === 'enum' && o.text !== b.text)
    if (valueLike) { const c = change(o.rr.r96, b.rr.r96, o.rr.l24, b.rr.l24, o.rr.d24, b.rr.d24); o.pair = { energy: c.energy, c24: Math.min(c.c24, c.c24d) } }
    if (valueLike && ps.type !== 'text') {
      const parts = dynamicParts(sks[i], sks[s.base])
      if (parts.n && parts.paths.length) {
        const abl = raster(line, render(line, removeParts(sks[i], parts)), S, 'light')
        o.dynParts = true; o.dynD = absDiff(o.rr.r96.l, abl.l)
      }
    }
  })
  // generator-level: text clearance + level proportionality (line only)
  const genChecks = []
  sets.forEach((s, i) => {
    const sk = sks[i]
    if (!out[i].hasText) return
    const t = out[i].tMask, n = mask(raster(line, render(line, nonTextOnly(sk)), S).a, 0.5)
    if (!count(n)) return
    let gap = 0
    for (let r = 0; r <= 8; r++) { const d = dilate(t, S, r); let hit = 0; for (let k = 0; k < d.length; k++) if (d[k] && n[k]) hit++; if (hit > 2) break; gap = r + 1 }
    out[i].gapText = gap / U // ink-to-ink distance (u), 2.25 = "more than 2u"
  })
  for (const [k, ps] of Object.entries(gen.params)) {
    if (ps.type !== 'level') continue
    // the level part = what a level draws that level 0 does not (the fill / bar / ring), in line; text excluded
    const sk0 = buildSkeleton(gen, { ...sets[0].p, [k]: 0 })
    const pts = [0, 0.05, 0.25, 0.5, 0.75, 0.95, 1].map(L => {
      const sk = buildSkeleton(gen, { ...sets[0].p, [k]: L }), parts = dynamicParts(sk, sk0)
      return [L, parts.paths.length ? count(mask(raster(line, render(line, onlyParts(sk, parts)), S).a, 0.5)) / 16 : 0]
    })
    const full = pts.at(-1)[1]
    if ([0.05, 0.5, 0.95].some(L => drawnText(buildSkeleton(gen, { ...sets[0].p, [k]: L })) !== drawnText(sk0))) { genChecks.push({ param: k, mono: true, frac: 0.5, skipped: 'the level is written as text' }); continue }
    if (full < 2) { genChecks.push({ param: k, mono: true, frac: 0.5, skipped: 'no level part (text / angle)' }); continue }
    let mono = true
    for (let j = 1; j < pts.length; j++) if (pts[j][1] < pts[j - 1][1] - 0.75) mono = false
    const frac = pts.find(p => p[0] === 0.5)[1] / full
    genChecks.push({ param: k, mono, frac: +frac.toFixed(2), curve: pts.map(p => [p[0], +p[1].toFixed(1)]) })
  }
  const ref = { gen, sets, sks, out, genChecks }
  refs.set(name, ref)
  while (refs.size > 2) refs.delete(refs.keys().next().value) // keep memory flat: jobs arrive generator-major
  return ref
}

async function liveJob({ gen: name, style, markup }) {
  const st = styles[style]
  if (!st) return { error: `no style ${style}` }
  const ref = await refFor(name), { gen, sets, sks, out } = ref
  const recs = [], rr = [], marks = []
  for (let i = 0; i < sets.length; i++) {
    const s = sets[i], sk = sks[i], R = out[i], m = { i }
    let nodes
    try {
      const t0 = performance.now(); nodes = render(st, sk); m.ms = +(performance.now() - t0).toFixed(1)
    } catch (e) { recs.push({ i, error: String(e.message).split('\n')[0] }); rr.push(null); marks.push(''); continue }
    const mk = nodesToMarkup(nodes); m.kb = +(mk.length / 1024).toFixed(1)
    if (i === 0) { try { m.det = nodesToMarkup(render(st, sk)) === mk } catch { m.det = false } }
    const r = R3(st, nodes); rr.push(r)
    marks.push(markup ? mk : '')
    Object.assign(m, geometry(r.r96, R.geo))
    if (R.hasText) {
      try {
        const nt = R3(st, render(st, withoutText(sk)))
        const c = change(r.r96, nt.r96, r.l24, nt.l24, r.d24, nt.d24)
        m.textC24 = +c.c24.toFixed(3); m.textC24d = +c.c24d.toFixed(3)
        m.textE = +(c.energy / Math.max(R.textE, 0.01)).toFixed(2); m.textA = +(changeArea(c.d96) / Math.max(R.textA, 0.01)).toFixed(2)
        const ts = textSplits(c.d96, R.geo); m.textSplits = ts.n; m.textSplitAt = ts.at
        m.textCov = textCoverage(c.d96, R.tMask)
        m.counters = counters(c.d96); m.refCounters = R.counters
      } catch (e) { m.textErr = String(e.message).split('\n')[0] }
    }
    if (R.gapText !== undefined) m.gapText = R.gapText
    if (s.vary !== undefined && R.pair && rr[s.base]) {
      const b = rr[s.base]
      const c = change(r.r96, b.r96, r.l24, b.l24, r.d24, b.d24)
      if (R.pair.energy >= 1) {
        m.valueE = +(c.energy / R.pair.energy).toFixed(2); m.valueC24 = +c.c24.toFixed(3); m.valueC24d = +c.c24d.toFixed(3); m.refValueC24 = +R.pair.c24.toFixed(3)
      }
    }
    if (R.dynParts) {
      try {
        const parts = dynamicParts(sk, sks[s.base])
        const abl = raster(st, render(st, removeParts(sk, parts)), S, 'light')
        const dm = dynMatch(absDiff(r.r96.l, abl.l), R.dynD)
        if (dm) dm.sameText = R.text === out[s.base].text
        if (dm) { m.dynCov = dm.cov; if (dm.sameText) { m.dynPieces = dm.pieces; m.refPieces = dm.refPieces } }
        // a moving part that is ONE filled body (a starburst re-cut by `points`) can't be counted the way line's outline
        // strokes are: mass styles draw it as one piece. Countable things (stars, pips, bars) change several fills.
        if (dm && parts.fills.length === 1) m.dynOneBody = true
      } catch (e) { m.dynErr = String(e.message).split('\n')[0] }
    }
    recs.push(m)
  }
  return { recs, marks: markup ? marks : null, genChecks: style === 'line' ? ref.genChecks : undefined }
}

const lineStatic = new Map()
function staticJob({ icons, style }) {
  const st = styles[style], recs = []
  for (const n of icons) {
    try {
      const icon = loadIcon(n)
      if (!lineStatic.has(n)) lineStatic.set(n, refGeometry(raster(styles.line, renderIcon(styles.line, icon), S)))
      const nodes = renderIcon(st, icon)
      recs.push({ icon: n, ...geometry(raster(st, nodes, S), lineStatic.get(n)) })
    } catch (e) { recs.push({ icon: n, error: String(e.message).split('\n')[0] }) }
  }
  return { recs }
}

parentPort.on('message', async job => {
  try {
    const res = job.kind === 'static' ? staticJob(job) : await liveJob(job)
    parentPort.postMessage({ id: job.id, ...res })
  } catch (e) { parentPort.postMessage({ id: job.id, error: String(e.stack || e.message) }) }
})
parentPort.postMessage({ ready: true })
