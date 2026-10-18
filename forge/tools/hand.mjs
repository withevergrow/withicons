#!/usr/bin/env node
// Hand-drawn overrides (forge/HAND.md): inspect a style's current drawing and validate forge/hand/<style>/<icon>.mjs.
//
//   node forge/tools/hand.mjs dump <style> <icon>            current markup (override if one exists), root, size, style conventions
//   node forge/tools/hand.mjs check <style> <icon> [icon...] validate these overrides against the contract (exit 1 on errors)
//   node forge/tools/hand.mjs check <style>                  every override of one style
//   node forge/tools/hand.mjs check [--all]                  every override of every style, plus stray files (CI gate)
//   add --quiet to print only the overrides with problems
//
// check calls each override's render function directly (never through load.mjs's fallback, which would hide a throw
// behind the generated drawing) and compares it against the RAW style renderer's vocabulary (never the style with
// its overrides applied, so a broken override cannot whitelist itself).
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execFile } from 'child_process'
import { pathToFileURL } from 'url'
import { loadIcon, loadStyles, renderIcon, nodesToMarkup, listIcons, HAND_DIR, STYLE_DIR, ROOT } from '../lib/load.mjs'
import { STYLE_ORDER, PALETTE_STYLES, RICH_STYLES } from '../lib/emit-core.mjs'
import { rolesFor } from '../lib/palette-map.mjs'
import { parsePath } from '../kernel/geom.mjs'

const argv = process.argv.slice(2)
const quiet = argv.includes('--quiet')
const all = argv.includes('--all')
const [cmd, styleArg, ...names] = argv.filter(a => !a.startsWith('--'))
const usage = () => { console.log('usage: hand.mjs dump <style> <icon> [icon...] | check [--all] | check <style> [icon...]  [--quiet]'); process.exit(2) }
if (!cmd || (cmd === 'dump' && (!styleArg || !names.length))) usage()
if (cmd !== 'dump' && cmd !== 'check' && cmd !== 'vocab') { console.error(`unknown command ${cmd}`); usage() }
if (all && styleArg) { console.error('--all checks every style; drop the style or the flag'); process.exit(2) }

const RUN7 = ['luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
const kindOf = s => RICH_STYLES.includes(s) ? 'rich' : RUN7.includes(s) ? 'role' : PALETTE_STYLES.includes(s) ? 'palette' : 'mono'
const CEILS = { mono: 8192, palette: 10240, role: 14336, rich: 20480 }
const MOTION = new Set(['wm-k', 'wm-a', 'wm-s', 'wm-deco', 'wm-shadow', 'wm-shine'])
const DRAW = new Set(['path', 'circle', 'rect', 'line', 'ellipse'])
const BAD_ATTR = ['id', 'transform', 'style', 'clip-path', 'mask', 'filter', 'href', 'xlink:href']
const GRID = [-1, 25] // every coordinate stays on the canvas (a little bleed for strokes and shadows)
const rel = f => path.relative(ROOT, f).split(path.sep).join('/')
const ICONS = new Set(listIcons())
const imp = f => import(pathToFileURL(f).href)

// the RAW renderer's vocabulary (forge/styles/<style>.mjs imported directly, never the style with its overrides applied,
// so a broken override cannot whitelist itself): the colour variables and classes its generated drawings use, from a
// sample of icons. An override may use those, the motion classes, and (palette/role/rich styles) any
// --with-<style>-<role> the palette map recognises, since palettes recolour it.
const SAMPLE_EVERY = 30
const CHUNK = 40 // overrides per child process in the every-style mode
async function vocabOf(style) {
  // the every-style mode samples each style once and hands the result to its chunk processes
  if (process.env.HAND_VOCAB) { const v = JSON.parse(process.env.HAND_VOCAB); return { vocab: { vars: new Set(v.vars), classes: new Set(v.classes) } } }
  const raw = (await imp(path.join(STYLE_DIR, `${style}.mjs`))).default
  const vocab = { vars: new Set(), classes: new Set(MOTION) }
  for (const n of [...ICONS].filter((_, i) => i % SAMPLE_EVERY === 0)) {
    try {
      const m = nodesToMarkup(renderIcon(raw, loadIcon(n)))
      for (const v of m.matchAll(/var\(\s*(--[\w-]+)/g)) vocab.vars.add(v[1])
      for (const c of m.matchAll(/class="([^"]+)"/g)) for (const k of c[1].split(/\s+/)) vocab.classes.add(k)
    } catch { /* a style that throws on a sample icon is not this tool's business */ }
  }
  return { vocab }
}
// internal: `hand.mjs vocab <style>` prints the sampled vocabulary as JSON (the every-style mode runs these in parallel)
if (cmd === 'vocab') {
  const { vocab } = await vocabOf(styleArg)
  console.log(JSON.stringify({ vars: [...vocab.vars], classes: [...vocab.classes] }))
  process.exit(0)
}

if (cmd === 'dump') {
  const st = (await loadStyles([styleArg]))[styleArg]
  if (!st) { console.error(`unknown style ${styleArg}`); process.exit(2) }
  const { vocab } = await vocabOf(styleArg)
  const kind = kindOf(styleArg), CEIL = CEILS[kind]
  for (const n of names) {
    const f = path.join(HAND_DIR, styleArg, `${n}.mjs`)
    const icon = loadIcon(n), m = nodesToMarkup(renderIcon(st, icon))
    console.log(`## ${styleArg}/${n}  kind=${kind}  ${fs.existsSync(f) ? 'OVERRIDE ' + rel(f) : 'generated (no override)'}  ${m.length} B (ceiling ${CEIL})`)
    console.log(`root: ${JSON.stringify(st.root)}`)
    console.log(`style colour variables: ${[...vocab.vars].sort().join(' ') || '(none: currentColor only)'}`)
    console.log(`style motion classes:   ${[...vocab.classes].filter(c => c.startsWith('wm-')).sort().join(' ') || '(none)'}`)
    const mf = path.join(ROOT, 'forge', 'motion', `${n}.json`)
    if (fs.existsSync(mf)) { const s = JSON.parse(fs.readFileSync(mf, 'utf8')); console.log(`motion: loop=${s.loop && s.loop.preset} parts=${Object.keys(s.parts || {}).join(',') || '-'} deco=${s.deco || '-'}`) }
    console.log(m)
  }
  process.exit(0)
}

// ---------------------------------------------------------------- check
// bounding box of one drawing node's geometry, or null when it has none
function nodeBox(tag, a) {
  const b = [Infinity, Infinity, -Infinity, -Infinity]
  const pt = (x, y) => { if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y }
  if (tag === 'path') { for (const s of parsePath(String(a.d || ''))) for (const [x, y] of s.pts) pt(x, y) }
  else if (tag === 'circle') { const r = +a.r || 0; pt(+a.cx - r, +a.cy - r); pt(+a.cx + r, +a.cy + r) }
  else if (tag === 'ellipse') { pt(+a.cx - +a.rx, +a.cy - +a.ry); pt(+a.cx + +a.rx, +a.cy + +a.ry) }
  else if (tag === 'rect') { const x = +(a.x || 0), y = +(a.y || 0); pt(x, y); pt(x + +a.width, y + +a.height) }
  else if (tag === 'line') { pt(+a.x1, +a.y1); pt(+a.x2, +a.y2) }
  return b[0] === Infinity ? null : b
}

function checkOne(style, n, fn, vocab) {
  const errs = [], notes = []
  const kind = kindOf(style), CEIL = CEILS[kind]
  if (!ICONS.has(n)) return { errs: [`no icon named ${n} (forge/icons/${n}.json): the override never renders`], notes }
  const f = path.join(HAND_DIR, style, `${n}.mjs`)
  const code = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1')
  for (const [re, what] of [[/Math\.random/, 'Math.random'], [/\bDate\b/, 'Date'], [/\bperformance\./, 'performance']])
    if (re.test(code)) errs.push(`source uses ${what}: overrides must be deterministic`)
  let nodes, nodes2
  try { nodes = renderIcon({ name: style, render: fn }, loadIcon(n)); nodes2 = renderIcon({ name: style, render: fn }, loadIcon(n)) }
  catch (e) { return { errs: [`render threw: ${String(e && e.message || e).split(/\r?\n/)[0]} (the generated drawing ships instead)`], notes } }
  if (!nodes.length) return { errs: ['render returned no nodes (the generated drawing ships instead)'], notes }
  const m = nodesToMarkup(nodes)
  if (m !== nodesToMarkup(nodes2)) errs.push('not deterministic (two renders differ): no Math.random, Date, or module state')
  if (m.length > CEIL) errs.push(`${m.length} B is over the ${CEIL} B ceiling for ${kind} styles`)
  if (/NaN|undefined|Infinity|null|\[object/.test(m)) errs.push('markup contains NaN/undefined/Infinity/null/[object]')
  const ids = new Set(), used = new Set()
  let box = [Infinity, Infinity, -Infinity, -Infinity]
  nodes.forEach((node, i) => {
    const [tag, a = {}, kids] = node
    if (tag === 'defs') {
      if (kind !== 'rich') errs.push('defs/gradients are only allowed in rich styles')
      if (i !== 0) errs.push('the defs node must be the first node')
      for (const g of kids || []) {
        if (!['linearGradient', 'radialGradient'].includes(g[0])) errs.push(`defs may only hold linear/radialGradient, found ${g[0]}`)
        const id = g[1] && g[1].id
        if (!new RegExp(`^wg-${style}-${n}-[0-9]+$`).test(id || '')) errs.push(`gradient id "${id}" must be wg-${style}-${n}-<n>`)
        else if (ids.has(id)) errs.push(`gradient id "${id}" is defined twice (the second definition is ignored)`)
        ids.add(id)
        for (const s of g[2] || []) if (s[0] !== 'stop') errs.push(`gradient children must be stop, found ${s[0]}`)
      }
      return
    }
    if (!DRAW.has(tag)) errs.push(`<${tag}> is not allowed (path, circle, rect, line, ellipse only)`)
    if (Array.isArray(kids) && kids.length) errs.push(`<${tag}> may not have children`)
    for (const k of BAD_ATTR) if (a[k] != null) errs.push(`<${tag}> has a${k === 'id' ? 'n' : ''} ${k} attribute${k === 'transform' ? ': bake the geometry (motion animates CSS transform on these nodes)' : k === 'id' ? ': only gradients in defs may' : ''}`)
    for (const k of String(a.class ?? '').split(/\s+/).filter(Boolean)) {
      if (/["'`]/.test(k)) errs.push(`class value ${JSON.stringify(a.class)} contains quotes`)
      else if (!vocab.classes.has(k)) errs.push(`class "${k}" is not a motion part class (${[...MOTION].join(' ')})`)
    }
    let b = null
    try { b = nodeBox(tag, a) } catch (e) { errs.push(`<${tag}> geometry does not parse: ${e.message}`) }
    if (b) {
      if (b.some(v => !Number.isFinite(v))) errs.push(`<${tag}> has non-numeric geometry`)
      else box = [Math.min(box[0], b[0]), Math.min(box[1], b[1]), Math.max(box[2], b[2]), Math.max(box[3], b[3])]
    }
  })
  if (box[0] !== Infinity && (box[0] < GRID[0] || box[1] < GRID[0] || box[2] > GRID[1] || box[3] > GRID[1]))
    errs.push(`geometry leaves the canvas: bbox [${box.map(v => +v.toFixed(2)).join(', ')}] is outside ${GRID[0]}..${GRID[1]}`)
  for (const r of m.matchAll(/url\(#([^)]+)\)/g)) { used.add(r[1]); if (!ids.has(r[1])) errs.push(`url(#${r[1]}) points at a gradient this icon does not define`) }
  for (const id of ids) if (!used.has(id)) notes.push(`gradient ${id} is defined but never used`)
  for (const v of m.matchAll(/var\(\s*(--[\w-]+)/g)) {
    const ok = vocab.vars.has(v[1]) || (kind !== 'mono' && v[1].startsWith(`--with-${style}-`) && rolesFor(`var(${v[1]})`)[v[1]])
    if (!ok) errs.push(`colour variable ${v[1]} is not one this style uses${kind === 'mono' ? '' : ' or a palette role (--with-' + style + '-<ink|c1..c4|tint|accent|shadow|shine|edge>)'}`)
  }
  const bare = m.replace(/var\([^()]*(\([^()]*\))?[^()]*\)/g, '').match(/(fill|stroke|stop-color)="(#[0-9a-fA-F]{3,8}|rgb[^"]*|hsl[^"]*|[a-z]+)"/g) || []
  for (const b of bare) if (!/="(none|currentColor)"/.test(b)) errs.push(`literal colour ${b}: wrap it as var(--with-${style}-<role>, #hex)${kind === 'mono' ? ' (this style paints currentColor only)' : ''}`)
  const mf = path.join(ROOT, 'forge', 'motion', `${n}.json`)
  if (fs.existsSync(mf)) {
    const spec = JSON.parse(fs.readFileSync(mf, 'utf8'))
    for (const p of Object.keys(spec.parts || {})) {
      const cls = 'wm-' + p.toLowerCase()
      if (vocab.classes.has(cls) && !m.includes(cls)) notes.push(`motion spec animates parts.${p} but no node has class ${cls}: tag that part so it still moves`)
    }
  }
  if (!/class="[^"]*wm-/.test(m)) notes.push('no motion classes at all: tag the body wm-k and moving parts wm-a/wm-s like the style does')
  return { errs, notes, size: m.length, count: nodes.length }
}

const multi = all || !styleArg
const styles = multi
  ? fs.readdirSync(HAND_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort((a, b) => STYLE_ORDER.indexOf(a) - STYLE_ORDER.indexOf(b))
  : [styleArg]
const t0 = Date.now()
let bad = 0, checked = 0
const say = (ok, head, errs = [], notes = []) => {
  if (quiet && ok) return
  console.log(`${ok ? '✓' : '✗'} ${head}`)
  for (const e of [...new Set(errs)]) console.log('   error: ' + e)
  if (!quiet) for (const x of [...new Set(notes)]) console.log('   note:  ' + x)
}
const summary = () => {
  if (process.env.HAND_CHILD) console.log(`##hand ${checked} ${bad}`)
  else console.log(`${bad ? '✗' : '✓'} ${checked} override${checked === 1 ? '' : 's'} in ${styles.length} style${styles.length === 1 ? '' : 's'}: ${bad ? bad + ' with problems' : 'all pass'} (${((Date.now() - t0) / 1000).toFixed(1)} s)`)
  process.exitCode = bad ? 1 : 0
}
// load.mjs reads only forge/hand/<style>/<icon>.mjs (and ignores _*.mjs): anything else is dead weight or a typo
function strays(style) {
  const dir = path.join(HAND_DIR, style)
  if (!STYLE_ORDER.includes(style) || !fs.existsSync(path.join(STYLE_DIR, `${style}.mjs`))) { say(false, `forge/hand/${style}/: no style named ${style}; its overrides never load`); bad++; return null }
  if (!fs.existsSync(dir)) { console.error(`no overrides for ${style} (forge/hand/${style}/ does not exist)`); bad++; return null }
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) if (!e.isFile() || !e.name.endsWith('.mjs') || e.name.startsWith('_')) { say(false, `${rel(path.join(dir, e.name))}: stray ${e.isFile() ? 'file' : 'entry'} (one <icon>.mjs per override; load.mjs ignores it)`); bad++ }
  return entries.filter(e => e.isFile() && e.name.endsWith('.mjs') && !e.name.startsWith('_')).map(e => e.name.slice(0, -4)).sort()
}

if (multi) {
  // every style: the strays here, the overrides in parallel child processes (chunks of one style each), output in order
  for (const d of fs.readdirSync(HAND_DIR, { withFileTypes: true })) if (!d.isDirectory()) { say(false, `forge/hand/${d.name}: stray file (forge/hand holds only <style>/ folders)`); bad++ }
  const jobs = []
  for (const style of styles) {
    const list = strays(style)
    for (let i = 0; list && i < list.length; i += CHUNK) jobs.push([style, ...list.slice(i, i + CHUNK)])
  }
  // a tiny process pool: fn(job, i) -> Promise, at most one per spare core
  const pool = async (list, fn) => {
    let next = 0
    const lane = async () => { while (next < list.length) { const i = next++; await fn(list[i], i) } }
    await Promise.all(Array.from({ length: Math.max(1, Math.min(list.length, os.cpus().length - 1)) }, lane))
  }
  const child = (args, env = {}) => new Promise(done => execFile(process.execPath, [process.argv[1], ...args],
    { env: { ...process.env, ...env }, maxBuffer: 64 << 20 }, (err, stdout, stderr) => done({ err, stdout: String(stdout), stderr: String(stderr) })))
  // 1. each style's raw vocabulary, once
  const vocabs = {}
  await pool([...new Set(jobs.map(j => j[0]))], async style => {
    const r = await child(['vocab', style])
    try { vocabs[style] = JSON.parse(r.stdout.trim().split(/\r?\n/).pop()) } catch { vocabs[style] = null }
  })
  // 2. the overrides, in chunks
  const out = new Array(jobs.length)
  await pool(jobs, async (job, k) => {
    const style = job[0]
    if (!vocabs[style]) { out[k] = `✗ ${style}: could not sample the raw renderer forge/styles/${style}.mjs\n`; bad++; checked += job.length - 1; return }
    const r = await child(['check', ...job, ...(quiet ? ['--quiet'] : [])], { HAND_CHILD: '1', HAND_VOCAB: JSON.stringify(vocabs[style]) })
    const m = /^##hand (\d+) (\d+)$/m.exec(r.stdout)
    if (m) { checked += +m[1]; bad += +m[2] } else { bad++; checked += job.length - 1 }
    out[k] = r.stdout.replace(/^##hand.*\r?\n?/m, '') + (m ? '' : `✗ ${style}: checker crashed: ${(r.stderr || (r.err && r.err.message) || '').split(/\r?\n/)[0]}\n`)
  })
  for (const o of out) if (o) process.stdout.write(o)
  summary()
} else {
  const style = styleArg
  const list = names.length ? names : strays(style)
  const { vocab } = list && list.length ? await vocabOf(style) : { vocab: null }
  for (const n of list || []) {
    const f = path.join(HAND_DIR, style, `${n}.mjs`)
    checked++
    if (!fs.existsSync(f)) { say(false, `${style}/${n}: no override at ${rel(f)}`); bad++; continue }
    let fn
    try {
      const mod = await imp(f)
      fn = typeof mod.default === 'function' ? mod.default : mod.default && mod.default.render
    } catch (e) { say(false, `${style}/${n}: ${rel(f)} failed to import (load.mjs skips it): ${String(e.message).split(/\r?\n/)[0]}`); bad++; continue }
    if (typeof fn !== 'function') { say(false, `${style}/${n}: ${rel(f)} has no default render function (load.mjs skips it)`); bad++; continue }
    const r = checkOne(style, n, fn, vocab)
    const ok = !r.errs.length
    say(ok, `${style}/${n}: ${r.size != null ? `${r.size} B, ${r.count} nodes` : ''}${ok ? ' — passes' : ''}`, r.errs, r.notes)
    if (!ok) bad++
  }
  summary()
}
