#!/usr/bin/env node
// Publish every public package under packages/* to npm, in dependency order. Used by
// .github/workflows/release.yml (tag v<version>) and, once, by hand for the very first publish.
//
//   node scripts/publish.mjs --dry-run              npm publish --dry-run for each package
//   node scripts/publish.mjs                        publish (skips name@version already on npm)
//   node scripts/publish.mjs --expect 0.2.0         fail unless every package is at 0.2.0 (CI passes the tag)
//   node scripts/publish.mjs --only @withicons/core,withicons
//
// Prerelease versions (0.2.0-beta.1) publish under the "next" dist-tag, everything else under "latest".
// Provenance: --provenance is added automatically inside GitHub Actions (needs `id-token: write`);
// with npm Trusted Publishing it is implied anyway. Requires npm >= 11.5.1 for Trusted Publishing.
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const flag = n => argv.includes(`--${n}`)
const opt = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined }
const DRY = flag('dry-run')
const REPO = 'github.com/withevergrow/withicons'
const isWin = process.platform === 'win32'
const npm = (args, cwd, capture) => spawnSync(isWin ? 'npm.cmd' : 'npm', args, { cwd, encoding: 'utf8', shell: isWin, stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' })
const die = m => { console.error(`publish: ${m}`); process.exit(1) }

const pkgs = fs.readdirSync(path.join(ROOT, 'packages'))
  .map(d => path.join(ROOT, 'packages', d))
  .filter(d => fs.existsSync(path.join(d, 'package.json')))
  .map(dir => ({ dir, json: JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')) }))
  .filter(p => !p.json.private)
const only = opt('only')?.split(',')
const names = new Set(pkgs.map(p => p.json.name))

// --- checks: same version everywhere, built output present, repository url (provenance needs it)
const expect = opt('expect')?.replace(/^v/, '')
const problems = []
for (const { dir, json } of pkgs) {
  if (expect && json.version !== expect) problems.push(`${json.name} is ${json.version}, tag says ${expect}`)
  for (const f of json.files || []) if (!f.includes('*') && !fs.existsSync(path.join(dir, f))) problems.push(`${json.name}: "${f}" listed in files but missing (run node forge/build.mjs)`)
  const repo = typeof json.repository === 'string' ? json.repository : json.repository?.url
  if (!repo || !repo.includes(REPO)) problems.push(`${json.name}: package.json "repository.url" must point to https://${REPO} (npm provenance verifies it)`)
  if (json.name.startsWith('@') && json.publishConfig?.access !== 'public') console.warn(`  note: ${json.name} has no publishConfig.access=public; passing --access public`)
}
if (problems.length && !(DRY && flag('lenient'))) die('\n  ' + problems.join('\n  '))
else if (problems.length) console.warn('  (dry run, --lenient) ' + problems.join('\n  '))

// --- topological order over internal dependencies
const deps = p => Object.keys({ ...p.json.dependencies, ...p.json.peerDependencies, ...p.json.optionalDependencies }).filter(n => names.has(n))
const order = [], seen = new Set()
const visit = (p, stack = []) => {
  if (seen.has(p.json.name)) return
  if (stack.includes(p.json.name)) die(`dependency cycle: ${[...stack, p.json.name].join(' -> ')}`)
  for (const d of deps(p)) visit(pkgs.find(x => x.json.name === d), [...stack, p.json.name])
  seen.add(p.json.name); order.push(p)
}
pkgs.sort((a, b) => a.json.name.localeCompare(b.json.name)).forEach(p => visit(p))

const inCI = !!process.env.GITHUB_ACTIONS
let published = 0, skipped = 0
for (const { dir, json } of order) {
  if (only && !only.includes(json.name)) continue
  const id = `${json.name}@${json.version}`
  const exists = npm(['view', id, 'version'], dir, true)
  if (exists.status === 0 && exists.stdout.trim() === json.version) { console.log(`= ${id} already on npm`); skipped++; continue }
  const args = ['publish', '--access', 'public', '--tag', json.version.includes('-') ? 'next' : 'latest']
  if (inCI) args.push('--provenance')
  if (DRY) args.push('--dry-run')
  console.log(`> npm ${args.join(' ')}   (${id})`)
  const r = npm(args, dir)
  if (r.status !== 0) die(`${id} failed (earlier packages in this run are already published; fix and re-run - published versions are skipped)`)
  published++
}
console.log(`${DRY ? 'dry run: ' : ''}${published} published, ${skipped} already on npm`)
