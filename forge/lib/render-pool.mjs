// Renders every icon in every style for forge/build.mjs: in parallel (worker threads) and through a content-hash cache,
// so a rebuild only redraws what changed. Output is byte-identical to rendering everything in one thread.
//
//   cache: .tmp/render-cache/<style>-<hash>.json  { [icon]: [skeletonHash, nodes] }
//          <hash> covers the style's own module and everything it imports (transitively, relative imports), so editing
//          a renderer, its helpers or the kernel re-renders that style only. Stale files of a style are deleted.
//   --no-cache   render everything (the cache is still rewritten)
//   WITH_RENDER_THREADS=<n>   worker count (default: cores - 1, at most 12; 0 = this thread only)
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { fileURLToPath, pathToFileURL } from 'url'

const HERE = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(HERE), '..', '..')
const CACHE = path.join(ROOT, '.tmp', 'render-cache')
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16)

// transitive closure of relative imports of a module -> hash of their contents (paths included)
function depsHash(entry) {
  const seen = new Map()
  const walk = f => {
    if (seen.has(f) || !fs.existsSync(f)) return
    const src = fs.readFileSync(f, 'utf8')
    seen.set(f, src)
    for (const m of src.matchAll(/(?:^|[\s;])(?:import|export)\s[^'"]*?from\s*['"](\.{1,2}\/[^'"]+)['"]|import\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)|^import\s+['"](\.{1,2}\/[^'"]+)['"]/gm)) {
      walk(path.resolve(path.dirname(f), m[1] || m[2] || m[3]))
    }
  }
  walk(entry)
  return sha([...seen].sort((a, b) => a[0] < b[0] ? -1 : 1).map(([f, s]) => path.relative(ROOT, f).split(path.sep).join('/') + '\0' + s.replace(/\r\n/g, '\n')).join('\0\0'))
}

async function renderSome(jobs, styleNames) {
  const { loadIcon, loadStyles, renderIcon } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'load.mjs')).href)
  const styles = await loadStyles(styleNames)
  const out = []
  for (const [name, list] of jobs) {
    const icon = loadIcon(name)
    for (const s of list) {
      // JSON text: fresh and cached renders go through the same round trip, so the output never depends on the cache
      try { out.push([name, s, JSON.stringify(renderIcon(styles[s], icon))]) } catch (e) { out.push([name, s, null, String(e.message).split('\n')[0]]) }
    }
  }
  return out
}

if (!isMainThread && workerData && workerData.withRenderPool) {
  renderSome(workerData.jobs, workerData.styles).then(r => parentPort.postMessage(r), e => parentPort.postMessage({ error: String(e && e.stack || e) }))
}

/**
 * names: icon names; styles: [{ name }] (loaded style objects). Returns { renders: { [icon]: { [style]: nodes } },
 * failures: ['style/icon: message'], rendered, cached }.
 */
export async function renderAll(names, styles, { cache = true, threads } = {}) {
  const ICON_DIR = path.join(ROOT, 'forge', 'icons')
  const skel = {}
  for (const n of names) skel[n] = sha(fs.readFileSync(path.join(ICON_DIR, n + '.json'), 'utf8').replace(/\r\n/g, '\n'))
  const renders = Object.fromEntries(names.map(n => [n, {}]))
  const failures = []
  const files = {}, stores = {}
  fs.mkdirSync(CACHE, { recursive: true })
  for (const s of styles) {
    const h = depsHash(path.join(ROOT, 'forge', 'styles', s.name + '.mjs'))
    files[s.name] = path.join(CACHE, `${s.name}-${h}.json`)
    let store = {}
    if (cache && fs.existsSync(files[s.name])) { try { store = JSON.parse(fs.readFileSync(files[s.name], 'utf8')) } catch { store = {} } }
    stores[s.name] = store
  }
  // what is missing
  const todo = new Map()
  let cached = 0
  for (const n of names) for (const s of styles) {
    const hit = stores[s.name][n]
    if (hit && hit[0] === skel[n]) { renders[n][s.name] = hit[1]; cached++ }
    else { if (!todo.has(n)) todo.set(n, []); todo.get(n).push(s.name) }
  }
  const jobs = [...todo]
  let rendered = 0
  if (jobs.length) {
    const want = [...new Set(jobs.flatMap(([, l]) => l))]
    const n = threads != null ? threads : process.env.WITH_RENDER_THREADS != null ? +process.env.WITH_RENDER_THREADS : Math.min(12, Math.max(1, os.cpus().length - 1))
    let results
    if (!n || jobs.length < 4) results = await renderSome(jobs, want)
    else {
      // round-robin by icon: neighbouring icons often share cost, so the chunks stay balanced
      const chunks = Array.from({ length: Math.min(n, jobs.length) }, () => [])
      jobs.forEach((j, i) => chunks[i % chunks.length].push(j))
      const parts = await Promise.all(chunks.map(c => new Promise((resolve, reject) => {
        const w = new Worker(HERE, { workerData: { withRenderPool: true, jobs: c, styles: want }, stdout: false, stderr: false })
        w.once('message', m => { if (m && m.error) reject(new Error(m.error)); else resolve(m); w.terminate() })
        w.once('error', reject)
      })))
      results = parts.flat()
    }
    for (const [name, s, json, err] of results) {
      if (json == null) { failures.push(`${s}/${name}: ${err}`); continue }
      const nodes = JSON.parse(json)
      renders[name][s] = nodes
      stores[s][name] = [skel[name], nodes]
      rendered++
    }
  }
  // write back (only icons that still exist), drop stale files of each style
  for (const s of styles) {
    const keep = {}
    for (const n of names) if (stores[s.name][n] && stores[s.name][n][0] === skel[n]) keep[n] = stores[s.name][n]
    const text = JSON.stringify(keep)
    const old = fs.existsSync(files[s.name]) ? fs.readFileSync(files[s.name], 'utf8') : null
    if (old !== text) fs.writeFileSync(files[s.name], text)
    for (const f of fs.readdirSync(CACHE)) if (f.startsWith(s.name + '-') && /^[a-z0-9]+-[0-9a-f]{16}\.json$/.test(f) && path.join(CACHE, f) !== files[s.name] && f.slice(0, -22) === s.name) fs.unlinkSync(path.join(CACHE, f))
  }
  return { renders, failures, rendered, cached }
}
