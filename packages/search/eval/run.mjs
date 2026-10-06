#!/usr/bin/env node
// Search quality evaluation for @withicons/search.
//
//   node eval/run.mjs                       evaluate src/engine.mjs against eval/golden.json, write eval/report.json
//   node eval/run.mjs --diff eval/baseline.json      per-query improvements / regressions vs an older report
//   node eval/run.mjs --engine dist/index.js         evaluate another engine file (any module exporting create(index))
//   node eval/run.mjs --index path/to/data.js        another index (default dist/data.js; .json works too)
//   node eval/run.mjs --kind typo,task --worst 40    subset of kinds, longer worst list
//   node eval/run.mjs --q "yoga mat"                 show one query: labels, top 10 with match info
//   node eval/run.mjs --fail-under ndcg5=0.70,mrr=0.70,noIcon=0.3,bad5=0.10,noise=0.05,p95=5
//        thresholds for CI: higher-is-better metrics fail when below; bad5 / noise / p50 / p95 fail when above
//   node eval/run.mjs --out eval/baseline.json --label "HEAD ec70d9b" --quiet
//
// Golden labels (eval/golden.json): ideal = best answers (gain 3), ok = acceptable (gain 1), bad = clearly wrong
// (counted when in the top 5). ideal [] means the set has no honest icon: correct behaviour is an empty result, a
// result flagged weak (r.weak or r.match.weak), or an acceptable stand-in from ok at rank 1.
//
// Metrics (graded queries = ideal non-empty):
//   mrr     mean reciprocal rank of the first ideal icon in the top 10
//   ndcg5   nDCG@5 with gains ideal 3 / ok 1 (the headline number)
//   p1      top result is an ideal icon
//   hit5    an ideal or ok icon in the top 5
//   r10     share of ideal icons found in the top 10
//   bad5    share of queries with a bad label whose top 5 holds a bad icon
//   noise   share of non-typo queries whose top 5 holds a typo-corrected (match.typo) icon that is not ideal/ok
//   noIcon  share of no-icon queries answered correctly (see above)
//   score   0.45 ndcg5 + 0.2 mrr + 0.1 hit5 + 0.1 noIcon + 0.075 (1-bad5) + 0.075 (1-noise)
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { performance } from 'node:perf_hooks'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.join(here, '..')

// ------------------------------------------------------------------ args
const argv = process.argv.slice(2)
const flag = (name, def) => { const i = argv.indexOf('--' + name); if (i < 0) return def; const v = argv[i + 1]; return v === undefined || v.startsWith('--') ? true : v }
const enginePath = path.resolve(flag('engine', path.join(pkg, 'src', 'engine.mjs')))
const indexPath = path.resolve(flag('index', path.join(pkg, 'dist', 'data.js')))
const goldenPath = path.resolve(flag('golden', path.join(here, 'golden.json')))
const outPath = flag('out', path.join(here, 'report.json'))
const diffPath = flag('diff', null)
const failUnder = flag('fail-under', null)
const kinds = flag('kind', null)
const worstN = +flag('worst', 30)
const oneQ = flag('q', null)
const quiet = !!flag('quiet', false)
const reps = +flag('reps', 3)
const label = flag('label', null)
const rel = p => { const r = path.relative(pkg, p).split(path.sep).join('/'); return r.startsWith('..') ? path.basename(p) : r }

// ------------------------------------------------------------------ load
const mod = await import(pathToFileURL(enginePath).href)
const create = mod.create || (mod.default && mod.default.create)
if (typeof create !== 'function') { console.error(`${enginePath} does not export create(index)`); process.exit(2) }
const index = indexPath.endsWith('.json') ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : (await import(pathToFileURL(indexPath).href)).default
const engine = create(index)
const golden = JSON.parse(fs.readFileSync(goldenPath, 'utf8'))
let queries = golden.queries
if (kinds) { const ks = new Set(String(kinds).split(',')); queries = queries.filter(g => ks.has(g.kind)) }
const known = new Set(engine.icons ? engine.icons().map(i => i.name) : [])
if (known.size) {
  const missing = new Set()
  for (const g of queries) for (const n of [...g.ideal, ...g.ok, ...(g.bad || [])]) if (!known.has(n)) missing.add(n)
  if (missing.size) console.warn(`warning: labels name icons the index does not have: ${[...missing].join(', ')}`)
}
const keyOf = g => g.q + (g.filters ? ' ' + JSON.stringify(g.filters) : '')
const isWeak = r => !!(r && (r.weak || (r.match && r.match.weak)))

// ------------------------------------------------------------------ single query view
if (oneQ) {
  const g = golden.queries.find(x => x.q === oneQ) || { q: oneQ, ideal: [], ok: [] }
  const res = engine.search(oneQ, { limit: 10, ...(g.filters || {}) })
  console.log(`"${oneQ}" kind=${g.kind || '-'} ideal=[${g.ideal}] ok=[${g.ok}] bad=[${g.bad || ''}] ${g.filters ? JSON.stringify(g.filters) : ''}`)
  res.forEach((r, i) => {
    const lab = g.ideal.includes(r.name) ? 'IDEAL' : g.ok.includes(r.name) ? 'ok' : (g.bad || []).includes(r.name) ? 'BAD' : ''
    console.log(`${String(i + 1).padStart(3)} ${r.name.padEnd(22)} ${String(r.score).padStart(7)}  ${(r.match && (r.match.kind + ' ' + r.match.field + ':' + r.match.term)) || ''}${r.match && r.match.typo ? ' [typo]' : ''}${isWeak(r) ? ' [weak]' : ''}  ${lab}`)
  })
  if (!res.length) console.log('  (no results)')
  process.exit(0)
}

// ------------------------------------------------------------------ evaluate
const DCG = gains => gains.reduce((s, g, i) => s + (2 ** g - 1) / Math.log2(i + 2), 0)
const median = a => { const s = a.slice().sort((x, y) => x - y); return s[s.length >> 1] }
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))] }

if (engine.warm) engine.warm()
// a cold first call on a fresh engine (lazy indexes) — informational
const cold = create(index); let t0 = performance.now(); cold.search('notifcation'); const coldMs = performance.now() - t0

const rows = []
for (const g of queries) {
  const opts = { limit: 10, ...(g.filters || {}) }
  let res, times = []
  for (let k = 0; k < reps; k++) { const t = performance.now(); res = engine.search(g.q, opts); times.push(performance.now() - t) }
  const names = res.map(r => r.name)
  const gain = n => g.ideal.includes(n) ? 3 : g.ok.includes(n) ? 1 : 0
  const row = { q: g.q, kind: g.kind, top: names.slice(0, 5), ms: +median(times).toFixed(3) }
  if (g.filters) row.filters = g.filters
  const graded = g.ideal.length > 0
  const bad5 = (g.bad || []).filter(n => names.slice(0, 5).includes(n))
  if (g.bad && g.bad.length) row.bad5 = bad5
  if (g.kind !== 'typo') {
    const allowed = new Set([...g.ideal, ...g.ok])
    row.noise = res.slice(0, 5).filter(r => r.match && r.match.typo && !allowed.has(r.name)).map(r => r.name)
  }
  const idealGains = [...g.ideal.map(() => 3), ...g.ok.map(() => 1)].slice(0, 5)
  const idcg = DCG(idealGains)
  if (graded) {
    const rank = names.findIndex(n => g.ideal.includes(n))
    row.rank = rank < 0 ? null : rank + 1
    row.rr = rank < 0 ? 0 : 1 / (rank + 1)
    row.ndcg5 = +(DCG(names.slice(0, 5).map(gain)) / idcg).toFixed(4)
    row.p1 = names[0] !== undefined && g.ideal.includes(names[0]) ? 1 : 0
    row.hit5 = names.slice(0, 5).some(n => gain(n) > 0) ? 1 : 0
    row.r10 = +(g.ideal.filter(n => names.includes(n)).length / g.ideal.length).toFixed(4)
    row.quality = row.ndcg5 - (bad5.length ? 0.25 : 0)
  } else {
    row.empty = res.length === 0
    row.weak = res.length > 0 && isWeak(res[0])
    row.noIconOk = row.empty || row.weak || (res.length > 0 && g.ok.includes(names[0]))
    if (idcg > 0) row.ndcg5 = +(DCG(names.slice(0, 5).map(gain)) / idcg).toFixed(4)
    row.quality = (row.noIconOk ? 1 : 0) - (bad5.length ? 0.25 : 0)
  }
  row.quality = +row.quality.toFixed(4)
  rows.push(row)
}

function aggregate(rs) {
  const gr = rs.filter(r => r.rank !== undefined)
  const ni = rs.filter(r => r.noIconOk !== undefined)
  const wb = rs.filter(r => r.bad5)
  const wn = rs.filter(r => r.noise)
  const mean = (a, f) => a.length ? a.reduce((s, r) => s + f(r), 0) / a.length : null
  const m = {
    n: rs.length, graded: gr.length, noIconN: ni.length,
    mrr: mean(gr, r => r.rr), ndcg5: mean(gr, r => r.ndcg5), p1: mean(gr, r => r.p1), hit5: mean(gr, r => r.hit5), r10: mean(gr, r => r.r10),
    bad5: mean(wb, r => r.bad5.length ? 1 : 0), noise: mean(wn, r => r.noise.length ? 1 : 0), noIcon: mean(ni, r => r.noIconOk ? 1 : 0),
    p50: rs.length ? median(rs.map(r => r.ms)) : null, p95: rs.length ? pct(rs.map(r => r.ms), 0.95) : null,
  }
  m.score = 0.45 * (m.ndcg5 ?? 0) + 0.2 * (m.mrr ?? 0) + 0.1 * (m.hit5 ?? 0) + 0.1 * (m.noIcon ?? 0) + 0.075 * (1 - (m.bad5 ?? 0)) + 0.075 * (1 - (m.noise ?? 0))
  for (const k in m) if (typeof m[k] === 'number' && !Number.isInteger(m[k])) m[k] = +m[k].toFixed(4)
  return m
}
const overall = aggregate(rows)
const byKind = {}
for (const k of [...new Set(rows.map(r => r.kind))]) byKind[k] = aggregate(rows.filter(r => r.kind === k))
byKind['(filtered)'] = aggregate(rows.filter(r => r.filters))
const negSpace = rows.filter(r => r.kind === 'negative-space')

const report = {
  generated: 'eval/run.mjs', engine: rel(enginePath), label: label === true ? null : label, engineVersion: engine.version || null,
  index: rel(indexPath), dataVersion: engine.dataVersion || null,
  golden: rel(goldenPath), coldFirstQueryMs: +coldMs.toFixed(2),
  overall, byKind, rows,
}
if (outPath && outPath !== true) fs.writeFileSync(path.resolve(outPath), JSON.stringify(report, null, 1) + '\n')

// ------------------------------------------------------------------ print
const f = v => v == null ? '   -  ' : (v * 100).toFixed(1).padStart(6)
const fm = v => v == null ? '   -  ' : v.toFixed(3).padStart(6)
if (!quiet) {
  console.log(`engine ${report.engine} v${report.engineVersion}  index ${report.index} (${report.dataVersion})  ${rows.length} queries`)
  console.log('kind              n   ndcg5    mrr     p1   hit5    r10   bad5  noise noIcon  p95ms')
  const line = (k, m) => console.log(`${k.padEnd(15)}${String(m.n).padStart(4)} ${f(m.ndcg5)} ${f(m.mrr)} ${f(m.p1)} ${f(m.hit5)} ${f(m.r10)} ${f(m.bad5)} ${f(m.noise)} ${f(m.noIcon)} ${fm(m.p95)}`)
  for (const [k, m] of Object.entries(byKind)) line(k, m)
  line('ALL', overall)
  console.log(`score ${(overall.score * 100).toFixed(2)}   latency p50 ${overall.p50}ms p95 ${overall.p95}ms   cold first query ${report.coldFirstQueryMs}ms`)
  console.log(`negative-space typo noise: ${negSpace.filter(r => r.noise && r.noise.length).length}/${negSpace.length}`)
  const worst = rows.slice().sort((a, b) => a.quality - b.quality || (a.rr ?? 0) - (b.rr ?? 0)).slice(0, worstN)
  console.log(`\nworst ${worstN}:`)
  for (const r of worst) console.log(`  ${r.quality.toFixed(2).padStart(5)} ${(r.kind).padEnd(14)} ${JSON.stringify(r.q).padEnd(26)}${r.filters ? JSON.stringify(r.filters) + ' ' : ''}-> ${r.top.join(', ') || '(empty)'}${r.bad5 && r.bad5.length ? '  BAD:' + r.bad5 : ''}${r.noise && r.noise.length ? '  noise:' + r.noise : ''}`)
}

// ------------------------------------------------------------------ diff
if (diffPath) {
  const old = JSON.parse(fs.readFileSync(path.resolve(diffPath), 'utf8'))
  const om = new Map(old.rows.map(r => [keyOf(r), r]))
  const ch = []
  for (const r of rows) { const o = om.get(keyOf(r)); if (!o) continue; const d = r.quality - o.quality; if (Math.abs(d) > 1e-3) ch.push({ r, o, d }) }
  ch.sort((a, b) => a.d - b.d)
  const reg = ch.filter(c => c.d < 0), imp = ch.filter(c => c.d > 0).reverse()
  console.log(`\ndiff vs ${diffPath}: ${imp.length} improved, ${reg.length} regressed`)
  for (const k of ['ndcg5', 'mrr', 'p1', 'hit5', 'r10', 'bad5', 'noise', 'noIcon', 'p95', 'score']) {
    const a = old.overall[k], b = overall[k]; if (a == null || b == null) continue
    const d = b - a; console.log(`  ${k.padEnd(7)} ${a.toFixed(4)} -> ${b.toFixed(4)}  ${d >= 0 ? '+' : ''}${d.toFixed(4)}`)
  }
  const show = (c) => console.log(`  ${(c.d >= 0 ? '+' : '') + c.d.toFixed(2)} ${c.r.kind.padEnd(14)} ${JSON.stringify(c.r.q).padEnd(26)} ${c.o.top.slice(0, 3).join(', ') || '(empty)'}  =>  ${c.r.top.slice(0, 3).join(', ') || '(empty)'}`)
  if (reg.length) { console.log('regressions:'); reg.forEach(show) }
  if (imp.length) { console.log('improvements:'); imp.forEach(show) }
  const gone = old.rows.filter(o => !rows.some(r => keyOf(r) === keyOf(o))).length
  if (gone) console.log(`  (${gone} queries in the old report are not in this run)`)
}

// ------------------------------------------------------------------ thresholds
if (failUnder && failUnder !== true) {
  const LOWER = new Set(['bad5', 'noise', 'p50', 'p95'])
  const fails = []
  for (const kv of String(failUnder).split(',')) {
    const [k, v] = kv.split('='); const t = +v, got = overall[k]
    if (got == null || Number.isNaN(t)) { fails.push(`${k}: unknown metric or threshold`); continue }
    if (LOWER.has(k) ? got > t : got < t) fails.push(`${k} ${got} ${LOWER.has(k) ? '>' : '<'} ${t}`)
  }
  if (fails.length) { console.error('\nFAIL: ' + fails.join('; ')); process.exit(1) }
  if (!quiet) console.log('\nthresholds ok')
}
