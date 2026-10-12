#!/usr/bin/env node
// Icon lookup + audit for the demo pages (uses the repo's own @withicons/search build, offline).
//
//   node demos/_tools/icons.mjs search "balloon party" [--limit 12]   find icons (name, category, confidence)
//   node demos/_tools/icons.mjs check gift balloon cake              does each name exist? (alias -> canonical, unknown -> nearest)
//   node demos/_tools/icons.mjs cat indian-festivals                 list one category      |  cats   list all categories
//   node demos/_tools/icons.mjs live                                  the live icon names + params   (data-live="…" data-p-<param>)
//   node demos/_tools/icons.mjs audit site/demos/haunted-hollow.html      every data-ico / data-live / <with-icon name> in a page: unknown, alias, counts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { create } from '../../packages/search/dist/index.js'
import index from '../../packages/search/dist/data.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const engine = create(index)
const [cmd, ...rest] = process.argv.slice(2)
const lim = (() => { const i = rest.indexOf('--limit'); return i >= 0 ? Number(rest.splice(i, 2)[1]) : 12 })()

function liveNames() {
  const md = fs.readFileSync(path.join(ROOT, 'skills', 'with-icons', 'reference', 'live.md'), 'utf8')
  const out = {}
  for (const m of md.matchAll(/^\| `([a-z0-9-]+)` \| (.*?) \| (.*) \|$/gm)) out[m[1]] = { what: m[2], params: m[3].replace(/<br>/g, ' ; ') }
  return out
}

if (cmd === 'search') {
  const q = rest.join(' ')
  for (const r of engine.search(q, { limit: lim })) console.log(`${r.name.padEnd(28)} ${String(r.category).padEnd(18)} ${r.confidence}${r.weak ? ' (weak)' : ''}`)
} else if (cmd === 'check') {
  let bad = 0
  for (const n of rest) {
    const r = engine.resolve(n)
    if (r.name && !r.alias) console.log(`ok       ${n}`)
    else if (r.name) console.log(`ALIAS    ${n} -> ${r.name}  (use the canonical name)`)
    else if (r.ambiguous) { bad++; console.log(`AMBIG    ${n}: ${r.ambiguous.join(', ')}`) }
    else { bad++; console.log(`UNKNOWN  ${n}  nearest: ${(r.nearest || []).join(', ')}`) }
  }
  process.exit(bad ? 1 : 0)
} else if (cmd === 'cats') {
  for (const c of engine.categories()) console.log(typeof c === 'string' ? c : `${c.name || c.id}${c.count ? '  (' + c.count + ')' : ''}`)
} else if (cmd === 'cat') {
  for (const i of engine.icons(rest[0])) console.log(typeof i === 'string' ? i : `${i.name}`)
} else if (cmd === 'live') {
  const l = liveNames()
  for (const [n, v] of Object.entries(l)) console.log(`${n.padEnd(24)} ${v.what}\n${' '.repeat(25)}params: ${v.params}`)
} else if (cmd === 'audit') {
  const file = path.resolve(rest[0])
  const html = fs.readFileSync(file, 'utf8')
  const live = liveNames()
  const icons = new Map(), lives = new Map()
  for (const m of html.matchAll(/data-ico="([^"]+)"/g)) icons.set(m[1], (icons.get(m[1]) || 0) + 1)
  for (const m of html.matchAll(/<with-icon[^>]*\sname="([^"]+)"/g)) icons.set(m[1], (icons.get(m[1]) || 0) + 1)
  for (const m of html.matchAll(/data-live="([^"]+)"/g)) lives.set(m[1], (lives.get(m[1]) || 0) + 1)
  // names inside JS templates / strings (data-ico="${...}" are skipped)
  let problems = 0
  const rep = []
  for (const [n, c] of icons) {
    if (/[${}]/.test(n)) continue
    const r = engine.resolve(n)
    if (r.name && !r.alias) continue
    problems++
    rep.push(r.name ? `alias: "${n}" -> "${r.name}"` : r.ambiguous ? `ambiguous: "${n}" (${r.ambiguous.join(', ')})` : `UNKNOWN: "${n}" nearest ${(r.nearest || []).join(', ')}`)
  }
  for (const [n] of lives) if (!live[n]) { problems++; rep.push(`UNKNOWN live icon: "${n}" (see: icons.mjs live)`) }
  const total = [...icons.values()].reduce((a, b) => a + b, 0)
  console.log(JSON.stringify({ file: path.relative(ROOT, file), iconSlots: total, distinctIcons: icons.size, liveSlots: [...lives.values()].reduce((a, b) => a + b, 0), distinctLive: lives.size, problems: rep }, null, 2))
  process.exit(problems ? 1 : 0)
} else {
  console.log('usage: icons.mjs search <query> | check <names..> | cats | cat <category> | live | audit <page.html>')
  process.exit(2)
}
