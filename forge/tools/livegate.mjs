// with icons — the raster QUALITY GATE for Live icons: every generator x its stress set x every style, rasterised
// and measured (forge/tools/lib-livegate.mjs). Run through check-dynamic:
//
//   node forge/tools/check-dynamic.mjs --gate                                  # everything (~2-4 min, all cores)
//   node forge/tools/check-dynamic.mjs --gate --style pixel,retro              # just these styles (+ line, the reference)
//   node forge/tools/check-dynamic.mjs --gate --gen weather,clock-time         # just these generators
//   node forge/tools/check-dynamic.mjs --gate --json .tmp/livegate/report.json # full report (every set's metrics)
//   node forge/tools/check-dynamic.mjs --gate --sheets .preview/livegate       # contact sheets per style (light + dark)
//   node forge/tools/check-dynamic.mjs --gate --calibrate                      # re-measure the static icons -> thresholds
//   options: --workers <n>  --warn (list warnings too)  --max <n> (failures listed per style, default 25)
//
// Thresholds: forge/tools/livegate-thresholds.json (global numbers + per-style allowances measured on the 500 static
// icons, so a style is only failed for what it does WORSE on live icons than it does on its own static icons).
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'
import { ROOT, listIcons, loadStyles, attrs } from '../lib/load.mjs'
import { listGenerators, loadGenerator, paramLabel } from './lib-dynamic.mjs'
import { gateSet, THEMES } from './lib-livegate.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TFILE = path.join(HERE, 'livegate-thresholds.json')

function pool(n) {
  const ws = [], queue = [], pending = new Map()
  let id = 0
  const ready = []
  for (let k = 0; k < n; k++) {
    const w = new Worker(new URL('./livegate-worker.mjs', import.meta.url))
    w.busy = true
    ready.push(new Promise(res => w.once('message', () => { w.busy = false; res() })))
    w.on('message', msg => { const p = pending.get(msg.id); if (!p) return; pending.delete(msg.id); w.busy = false; p.res(msg); pump() })
    w.on('error', e => { console.error('worker error', e) })
    ws.push(w)
  }
  function pump() {
    for (const w of ws) {
      if (w.busy || !queue.length) continue
      // affinity: a worker keeps the generator it just did (its line reference is cached)
      let k = queue.findIndex(j => j.data.gen && j.data.gen === w.lastGen)
      if (k < 0) k = 0
      const job = queue.splice(k, 1)[0]; w.busy = true; w.lastGen = job.data.gen; pending.set(job.id, job); w.postMessage(job.data)
    }
  }
  return {
    ready: Promise.all(ready),
    run(data) { return new Promise(res => { const jid = ++id; queue.push({ id: jid, data: { ...data, id: jid }, res }); pump() }) },
    close() { ws.forEach(w => w.terminate()) },
  }
}

const pct = (arr, q) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))] }

export function loadThresholds() { return fs.existsSync(TFILE) ? JSON.parse(fs.readFileSync(TFILE, 'utf8')) : null }

// ── judging one record ───────────────────────────────────────────────────────────────────────────────────
export function judge(style, m, T) {
  const out = [], G = T.global, A = T.styles[style] || T.styles._default
  const F = (code, msg) => out.push({ sev: 'fail', code, msg }), W = (code, msg) => out.push({ sev: 'warn', code, msg })
  if (m.error) { F('throw', m.error); return out }
  if (m.ink < G.minInk) F('empty', `ink ${m.ink}u²`)
  if (m.clip > A.clip) F('clip', `${m.clip}u of ink on the canvas edge (static icons in this style: <= ${A.clip})`)
  if (m.stray > A.stray) F('stray', `${m.stray} stray speck(s) away from the drawing at ${JSON.stringify(m.strayAt)}`)
  else if (m.specks > A.specks) W('specks', `${m.specks} specks (< 0.5u²)`)
  if (m.splits > A.splits) F('split', `${m.splits} continuous part(s) drawn broken at ${JSON.stringify(m.splitAt)} (boxes in u)`)
  if (m.missing > A.missing) F('missing', `${m.missing} part(s) of the drawing not drawn at ${JSON.stringify(m.missingAt)}`)
  if (m.textC24 !== undefined) {
    if (m.textCov !== undefined && m.textCov < G.textCov) F('text-missing', `only ${(m.textCov * 100).toFixed(0)}% of the text is drawn where line draws it (min ${G.textCov * 100}%): the value is not shown`)
    const c = Math.min(m.textC24, m.textC24d)
    if (c < G.textC24) F('text-contrast', `text contrast at 24px ${m.textC24} light / ${m.textC24d} dark (min ${G.textC24})`)
    if (m.textA < G.textEmin) F('text-faint', `text strokes cover ${m.textA}x the area they do in line (min ${G.textEmin}): too thin or too small`)
    else if (m.textA > G.textEmax) W('text-heavy', `text strokes cover ${m.textA}x the area they do in line (max ${G.textEmax})`)
    if (m.textSplits > (A.textSplits ?? 0)) F('text-broken', `${m.textSplits} glyph(s) break apart (a gap in the stroke, or part of the glyph vanishing into its background) at ${JSON.stringify(m.textSplitAt)}`)
    const lost = (m.refCounters || 0) - (m.counters || 0)
    if (m.refCounters && lost >= Math.max(G.countersLost, Math.ceil(m.refCounters * 0.34))) F('text-blob', `${lost} of ${m.refCounters} letter counters closed (text reads as blobs)`)
  }
  if (m.valueE !== undefined) {
    const c = Math.min(m.valueC24, m.valueC24d)
    if (m.valueE < G.valueE) F('value-hidden', `changing the value moves ${m.valueE}x the ink it does in line (min ${G.valueE})`)
    else if (c < Math.min(G.valueC24, 0.4 * (m.refValueC24 ?? 1))) F('value-contrast', `value change contrast at 24px ${m.valueC24} light / ${m.valueC24d} dark (min ${G.valueC24}, or 40% of line's ${m.refValueC24} for a sub-pixel change)`)
  }
  if (m.dynCov !== undefined) {
    if (m.dynCov < G.dynCov) F('dyn-misplaced', `the moving part (hand / fill / pips / stars) covers ${(m.dynCov * 100).toFixed(0)}% of where line draws it (min ${G.dynCov * 100}%)`)
    else if (m.dynCov < G.dynCovWarn) W('dyn-shifted', `the moving part (hand / fill / pips / stars) covers ${(m.dynCov * 100).toFixed(0)}% of where line draws it (min ${G.dynCovWarn * 100}%)`)
    if (!m.dynOneBody && m.refPieces >= 2 && m.refPieces <= 9 && (m.dynPieces < m.refPieces || m.dynPieces > 2 * m.refPieces)) F('dyn-count', `${m.dynPieces} discrete pieces where line draws ${m.refPieces} (pips / stars / bars must stay countable)`)
  }
  if (m.det === false) F('nondeterministic', 'two renders of the same skeleton differ')
  if (m.kb > G.kbFail) F('size', `${m.kb} KB (max ${G.kbFail})`)
  else if (m.kb > G.kbWarn) W('size', `${m.kb} KB`)
  if (m.ms > G.msWarn) W('slow', `${m.ms} ms`)
  return out
}
export function judgeGen(m, T) {
  const out = [], G = T.global
  if (m.gapText !== undefined && m.gapText < G.gapText) out.push({ sev: 'fail', code: 'text-crowded', msg: `text ink is ${m.gapText}u from the rest of the drawing (min ${G.gapText}u)` })
  return out
}

// labels: one font file (loading every system font per sheet costs seconds)
const FONT_FILES = ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].filter(f => fs.existsSync(f))
const SHEET_FONT = FONT_FILES.length ? { loadSystemFonts: false, fontFiles: FONT_FILES.slice(0, 1), defaultFontFamily: 'Segoe UI' } : { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' }
// ── contact sheets ───────────────────────────────────────────────────────────────────────────────────────
function writeSheet(file, style, blocks, theme) {
  const { fg, bg } = THEMES[theme], bgc = `rgb(${bg.join(',')})`, mut = '#8a8578'
  const root = { ...(style.root || {}) }; delete root.width; delete root.height
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const CW = 76, COLS = 24, LEFT = 120
  let y = 10, body = ''
  for (const b of blocks) {
    body += `<text x="8" y="${y + 14}" font-family="Segoe UI, Arial" font-size="12" font-weight="700" fill="${fg}">${esc(b.gen)}</text>`
    body += `<text x="8" y="${y + 28}" font-family="Segoe UI, Arial" font-size="9" fill="${b.fails ? '#e0245e' : mut}">${b.fails} fail / ${b.total}</text>`
    for (let r = 0; r < b.cells.length; r += COLS) {
      b.cells.slice(r, r + COLS).forEach((c, k) => {
        const x = LEFT + k * CW
        if (c.bad) body += `<rect x="${x - 3}" y="${y - 2}" width="${CW - 4}" height="${110}" fill="none" stroke="#e0245e" stroke-width="1.5" rx="4"/>`
        const ic = (px, ix, iy) => `<svg x="${ix}" y="${iy}" width="${px}" height="${px}" viewBox="0 0 24 24"${attrs(root)} color="${fg}">${c.mk}</svg>`
        body += ic(64, x + 3, y) + ic(24, x + 8, y + 68) + ic(16, x + 40, y + 72)
        body += `<text x="${x + 35}" y="${y + 100}" font-family="Segoe UI, Arial" font-size="7" fill="${mut}" text-anchor="middle">${esc(c.label.slice(0, 18))}</text>`
        if (c.codes) body += `<text x="${x + 35}" y="${y + 107}" font-family="Segoe UI, Arial" font-size="7" fill="#e0245e" text-anchor="middle">${esc(c.codes.slice(0, 22))}</text>`
      })
      y += 116
    }
    y += 6
  }
  const W = LEFT + COLS * CW
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${y}" viewBox="0 0 ${W} ${y}"><rect width="100%" height="100%" fill="${bgc}"/>${body}</svg>`
  const out = svg.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor').replaceAll('currentColor', fg)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, new Resvg(out, { font: SHEET_FONT, background: bgc }).render().asPng())
}

// ── main ─────────────────────────────────────────────────────────────────────────────────────────────────
export async function runGate(o = {}) {
  const allStyles = Object.keys(await loadStyles())
  const styleNames = o.styles ? o.styles.filter(s => allStyles.includes(s)) : allStyles
  const gens = o.gens || listGenerators()
  const nW = Math.max(1, Math.min(o.workers || Math.ceil(os.cpus().length / 2), 15))
  const P = pool(nW)
  await P.ready
  const t0 = Date.now()

  if (o.calibrate) {
    const icons = listIcons(), chunks = []
    for (let i = 0; i < icons.length; i += 25) chunks.push(icons.slice(i, i + 25))
    const res = {}
    await Promise.all(allStyles.flatMap(s => chunks.map(async ch => { const r = await P.run({ kind: 'static', icons: ch, style: s }); (res[s] ||= []).push(...r.recs) })))
    const T = loadThresholds() || { global: {}, styles: {} }
    const stats = {}
    for (const s of allStyles) {
      const rs = res[s].filter(r => !r.error)
      const k = key => rs.map(r => r[key])
      stats[s] = Object.fromEntries(['clip', 'specks', 'stray', 'splits', 'missing'].map(key => [key, { p90: pct(k(key), 0.9), p95: pct(k(key), 0.95), p99: pct(k(key), 0.99), max: Math.max(...k(key)) }]))
      // allowance: what this style does on 95% of its static icons (a live icon may not be worse), floored
      const st = stats[s]
      T.styles[s] = { clip: Math.max(0.5, st.clip.p95), specks: Math.max(2, st.specks.p95), stray: Math.max(0, st.stray.p95), splits: Math.max(0, st.splits.p95), missing: Math.max(0, st.missing.p95) }
    }
    T.styles._default = { clip: 0.5, specks: 2, stray: 0, splits: 0, missing: 0 }
    T.measured = { icons: icons.length, note: 'per-style allowances = p95 of the static icons in that style (node forge/tools/check-dynamic.mjs --gate --calibrate)', stats }
    fs.writeFileSync(TFILE, JSON.stringify(T, null, 1) + '\n')
    console.log(`calibrated on ${icons.length} static icons x ${allStyles.length} styles in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${path.relative(ROOT, TFILE)}`)
    for (const s of allStyles) console.log(`  ${s.padEnd(10)} ${JSON.stringify(T.styles[s])}`)
    if (!o.thenGate) { P.close(); return 0 }
  }

  const T = loadThresholds()
  if (!T) { console.log('no thresholds: run with --calibrate first'); P.close(); return 1 }
  const runStyles = [...new Set(['line', ...styleNames])]
  const sets = {}
  for (const g of gens) sets[g] = gateSet(await loadGenerator(g))
  const failures = [], warnings = [], report = { thresholds: T, styles: styleNames, gens, sets: {}, records: {}, genIssues: [] }
  for (const g of gens) report.sets[g] = sets[g].map(s => ({ label: s.label, p: s.p }))
  const byStyle = {}
  const sheetStyles = await loadStyles(o.sheets ? runStyles : [])
  const jobs = []
  for (const g of gens) for (const s of runStyles) jobs.push({ s, g })
  let done = 0
  const pendingSheets = new Map(runStyles.map(s => [s, gens.length]))
  const blocks = new Map(runStyles.map(s => [s, []]))
  await Promise.all(jobs.map(async ({ s, g }) => {
    const r = await P.run({ kind: 'live', gen: g, style: s, markup: !!o.sheets })
    done++
    if (o.progress && done % 50 === 0) process.stdout.write(`  ${done}/${jobs.length}\r`)
    if (r.error) { failures.push({ style: s, gen: g, set: '-', code: 'job', msg: r.error.split('\n')[0] }); return }
    const reportStyle = styleNames.includes(s)
    if (reportStyle) (report.records[s] ||= {})[g] = r.recs
    const cells = []
    r.recs.forEach((m, i) => {
      const set = sets[g][i]
      const js = reportStyle ? judge(s, m, T) : []
      for (const j of js) (j.sev === 'fail' ? failures : warnings).push({ style: s, gen: g, set: set.label, params: paramLabel(set.p), code: j.code, msg: j.msg })
      if (s === 'line') for (const j of judgeGen(m, T)) report.genIssues.push({ gen: g, set: set.label, params: paramLabel(set.p), ...j })
      const fails = js.filter(j => j.sev === 'fail')
      if (reportStyle) { const b = (byStyle[s] ||= { fail: 0, sets: 0, codes: {}, gens: {} }); b.sets++; if (fails.length) { b.fail++; b.gens[g] = (b.gens[g] || 0) + 1 } fails.forEach(f => { b.codes[f.code] = (b.codes[f.code] || 0) + 1 }) }
      if (r.marks) cells.push({ mk: r.marks[i], label: set.label, bad: fails.length > 0, codes: [...new Set(fails.map(f => f.code))].join(' ') })
    })
    if (s === 'line' && r.genChecks) for (const c of r.genChecks) {
      if (!c.mono) report.genIssues.push({ gen: g, set: c.param, sev: 'fail', code: 'level-mono', msg: `${c.param}: ink does not grow monotonically with the level ${JSON.stringify(c.curve)}` })
      else if (c.frac < 0.25 || c.frac > 0.8) report.genIssues.push({ gen: g, set: c.param, sev: 'fail', code: 'level-prop', msg: `${c.param}: level 0.5 draws ${(c.frac * 100).toFixed(0)}% of the full-level ink ${JSON.stringify(c.curve)}` })
    }
    if (o.sheets && reportStyle) {
      const nf = cells.filter(c => c.bad).length
      const keep = o.onlyFails ? cells.filter((c, k) => (c.bad && (!o.code || c.codes.split(' ').includes(o.code))) || (k === 0 && nf)) : cells
      if (keep.length && (!o.onlyFails || keep.some(c => c.bad))) blocks.get(s).push({ gen: g, cells: keep, fails: nf, total: cells.length })
      pendingSheets.set(s, pendingSheets.get(s) - 1)
      if (!pendingSheets.get(s)) {
        const bl = blocks.get(s).sort((a, b) => gens.indexOf(a.gen) - gens.indexOf(b.gen))
        if (bl.length) for (const th of ['light', 'dark']) writeSheet(path.resolve(ROOT, o.sheets, `livegate-${s}-${th}.png`), sheetStyles[s], bl, th)
        blocks.set(s, [])
      }
    }
  }))
  P.close()
  const secs = ((Date.now() - t0) / 1000).toFixed(0)
  // ── console summary
  const total = Object.values(sets).reduce((a, b) => a + b.length, 0)
  console.log(`\nLIVE GATE: ${gens.length} generators, ${total} stress sets, ${styleNames.length} styles, ${secs}s`)
  const gi = report.genIssues.filter(x => x.sev === 'fail')
  console.log(`generator issues: ${gi.length}`)
  gi.slice(0, o.max || 25).forEach(x => console.log(`  ${x.gen} [${x.set}] ${x.code}: ${x.msg}`))
  console.log(`\nper style: failing sets / sets   top failure codes   worst generators`)
  for (const s of styleNames) {
    const b = byStyle[s] || { fail: 0, sets: 0, codes: {}, gens: {} }
    const codes = Object.entries(b.codes).sort((a, c) => c[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' ')
    const worst = Object.entries(b.gens).sort((a, c) => c[1] - a[1]).slice(0, 6).map(([k, v]) => `${k}(${v})`).join(' ')
    console.log(`  ${s.padEnd(10)} ${String(b.fail).padStart(4)}/${String(b.sets).padEnd(5)} ${codes.padEnd(60)} ${worst}`)
  }
  if (o.list !== false) {
    for (const s of styleNames) {
      const fs_ = failures.filter(f => f.style === s)
      if (!fs_.length) continue
      console.log(`\n${s}: ${fs_.length} failure(s)`)
      fs_.slice(0, o.max || 25).forEach(f => console.log(`  ${f.gen} [${f.set}] ${f.code}: ${f.msg}`))
      if (o.warn) warnings.filter(w => w.style === s).slice(0, o.max || 25).forEach(f => console.log(`  (warn) ${f.gen} [${f.set}] ${f.code}: ${f.msg}`))
    }
  }
  report.failures = failures; report.warnings = warnings; report.summary = byStyle
  if (o.json) {
    const f = path.resolve(ROOT, o.json); fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, JSON.stringify(report))
    console.log(`\nwrote ${path.relative(ROOT, f)}`)
  }
  if (o.sheets) console.log(`sheets: ${path.relative(ROOT, path.resolve(ROOT, o.sheets))}/livegate-<style>-{light,dark}.png`)
  return failures.length || gi.length ? 1 : 0
}
