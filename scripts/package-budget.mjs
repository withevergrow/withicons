// Size budget of a publishable package. jsDelivr serves at most 150 MB per package version and about 20 MB per file,
// so every @withicons package stays under BUDGET.total unpacked (headroom for new icons) and every file under
// BUDGET.file. Used by each package's test/size.test.mjs and by scripts/publish.mjs (which refuses an oversized pack).
//
//   import { measure, overBudget } from '../../scripts/package-budget.mjs'
//   node scripts/package-budget.mjs [dir ...]      print every package (or the given dirs) and exit 1 when one is over
//
// The file list follows package.json "files" (negated entries excluded) plus package.json, README and LICENSE, as npm does.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const MB = 1024 * 1024
export const BUDGET = { total: 120 * MB, file: 20 * MB }

/** { total, files, largest: [[bytes, relPath], ...top 5], name } for the package at `dir` */
export function measure(dir) {
  dir = dir instanceof URL ? fileURLToPath(dir) : dir
  const json = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
  const entries = json.files || ['.']
  const neg = entries.filter(f => f.startsWith('!')).map(f => path.join(dir, f.slice(1)))
  let total = 0, files = 0
  const largest = []
  const seen = new Set()
  const walk = p => {
    if (seen.has(p) || neg.includes(p) || path.basename(p) === 'node_modules') return
    seen.add(p)
    let st
    try { st = fs.statSync(p) } catch { return }
    if (st.isDirectory()) { for (const e of fs.readdirSync(p)) walk(path.join(p, e)); return }
    total += st.size; files++
    largest.push([st.size, path.relative(dir, p).split(path.sep).join('/')])
    if (largest.length > 64) { largest.sort((a, b) => b[0] - a[0]); largest.length = 5 }
  }
  for (const f of [...entries.filter(f => !f.startsWith('!')), 'package.json', 'README.md', 'LICENSE']) walk(path.join(dir, f))
  largest.sort((a, b) => b[0] - a[0])
  return { name: json.name, total, files, largest: largest.slice(0, 5) }
}

/** The problems, one line each: empty when the package fits the budget. */
export function overBudget(m, budget = BUDGET) {
  const out = []
  if (m.total > budget.total) out.push(`${m.name}: ${(m.total / MB).toFixed(1)} MB unpacked, over the ${budget.total / MB} MB budget (jsDelivr: 150 MB per package); split it or shrink it`)
  for (const [size, f] of m.largest) if (size > budget.file) out.push(`${m.name}: ${f} is ${(size / MB).toFixed(1)} MB, over the ${budget.file / MB} MB per-file budget`)
  return out
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'packages')
  const dirs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(root).map(d => path.join(root, d)).filter(d => fs.existsSync(path.join(d, 'package.json')))
  let bad = 0
  for (const d of dirs) {
    const m = measure(d), p = overBudget(m)
    console.log(`${p.length ? 'OVER' : 'ok  '} ${m.name.padEnd(24)} ${(m.total / MB).toFixed(1).padStart(6)} MB ${String(m.files).padStart(6)} files  largest ${m.largest[0] ? `${m.largest[0][1]} ${(m.largest[0][0] / MB).toFixed(1)} MB` : '-'}`)
    for (const x of p) console.log('     ' + x)
    bad += p.length
  }
  process.exit(bad ? 1 : 0)
}
