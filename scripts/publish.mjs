#!/usr/bin/env node
// Publish every public package under packages/* to npm, in dependency order. Used by
// .github/workflows/release.yml (tag v<version>) and, once, by hand for the very first publish.
//
//   node scripts/publish.mjs --dry-run              npm publish --dry-run for each package
//   node scripts/publish.mjs                        publish (skips name@version already on npm)
//   node scripts/publish.mjs --expect 0.2.0         fail unless every package is at 0.2.0 (CI passes the tag)
//   node scripts/publish.mjs --only @withicons/core,withicons
//   node scripts/publish.mjs --order                print the publish order and exit
//   node scripts/publish.mjs --wait 40              minutes to wait, in all, for dependencies to become installable
//
// Packages (lockstep, one version): core core-plus soft3d holiday react vue svelte angular solid web web-plus classes classes-plus static
// static-plus search mcp
// motion dynamic loaders + the `withicons` CLI. core-plus, classes-plus, web-plus, static-plus, soft3d and holiday are companions holding the newest styles (jsDelivr's
// 150 MB package limit): core-plus, soft3d and holiday depend on core, web on web-plus; classes goes out after its companions, since its loader links them.
// The run fails when one of them is missing or on another version, and (outside --dry-run, where it warns) when the
// git tag v<version> already exists on a different commit: that version was released with other content, so bump first.
//
// Prerelease versions (0.2.0-beta.1) publish under the "next" dist-tag, everything else under "latest".
// Provenance: --provenance is added automatically inside GitHub Actions (needs `id-token: write`);
// with npm Trusted Publishing it is implied anyway. Requires npm >= 11.5.1 for Trusted Publishing.
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { measure, overBudget, MAX_FILES } from './package-budget.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const flag = n => argv.includes(`--${n}`)
const opt = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined }
const DRY = flag('dry-run')
const REPO = 'github.com/withevergrow/withicons'
const isWin = process.platform === 'win32'
// Windows needs a shell to run npm.cmd. Pass one command string (not an args array with shell: true, which Node 22+
// deprecates as DEP0190); the arguments are package names, versions and flags, quoted when they hold anything else.
const winArg = a => /^[\w@./:=^-]+$/.test(a) ? a : `"${String(a).replace(/"/g, '\\"')}"`
const npm = (args, cwd, capture) => {
  const o = { cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' }
  return isWin ? spawnSync(['npm', ...args].map(winArg).join(' '), { ...o, shell: true }) : spawnSync('npm', args, o)
}
const git = args => { const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); return r.status === 0 ? r.stdout.trim() : '' }
const die = m => { console.error(`publish: ${m}`); process.exit(1) }

const pkgs = fs.readdirSync(path.join(ROOT, 'packages'))
  .map(d => path.join(ROOT, 'packages', d))
  .filter(d => fs.existsSync(path.join(d, 'package.json')))
  .map(dir => ({ dir, json: JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')) }))
  .filter(p => !p.json.private)
const only = opt('only')?.split(',')
const names = new Set(pkgs.map(p => p.json.name))
// every package of the lockstep release; a missing one means its emitter did not run (node forge/build.mjs)
const EXPECTED = ['@withicons/core', '@withicons/core-plus', '@withicons/soft3d', '@withicons/holiday', '@withicons/classes-plus', '@withicons/web-plus', '@withicons/static-plus', '@withicons/react', '@withicons/vue', '@withicons/svelte', '@withicons/angular', '@withicons/solid',
  '@withicons/web', '@withicons/classes', '@withicons/static', '@withicons/search', '@withicons/mcp', '@withicons/motion', '@withicons/dynamic', '@withicons/loaders', 'withicons']
const missing = EXPECTED.filter(n => !names.has(n))

// --- order: every internal dependency (dependencies, peer, optional, bundled) before its dependents, the `withicons`
// CLI (it installs @withicons/mcp) strictly last. 0.2.1 published the CLI while @withicons/mcp@0.2.1 was not yet
// installable, and `npx withicons@latest` failed for minutes; the guard below and the registry wait prevent that.
const CLI = 'withicons'
// runtime links that are not npm dependencies: the classes loader loads the companions' CSS from the same CDN version
const AFTER = { '@withicons/classes': ['@withicons/classes-plus', '@withicons/soft3d', '@withicons/holiday', '@withicons/web-plus'], '@withicons/static': ['@withicons/static-plus'] }
const deps = p => [...new Set([
  ...(AFTER[p.json.name] || []),
  ...Object.keys({ ...p.json.dependencies, ...p.json.peerDependencies, ...p.json.optionalDependencies }),
  ...[].concat(p.json.bundleDependencies || p.json.bundledDependencies || []),
])].filter(n => names.has(n))
function publishOrder(list) {
  const byName = new Map(list.map(p => [p.json.name, p]))
  const order = [], seen = new Set()
  const visit = (p, stack = []) => {
    if (seen.has(p.json.name)) return
    if (stack.includes(p.json.name)) die(`dependency cycle: ${[...stack, p.json.name].join(' -> ')}`)
    for (const d of deps(p).sort()) visit(byName.get(d), [...stack, p.json.name])
    seen.add(p.json.name); order.push(p)
  }
  const sorted = [...list].sort((a, b) => a.json.name.localeCompare(b.json.name))
  sorted.filter(p => p.json.name !== CLI).forEach(p => visit(p))
  sorted.filter(p => p.json.name === CLI).forEach(p => visit(p))
  // guard: each package after all of its internal dependencies, nothing depending on the CLI, the CLI last
  order.forEach((p, i) => {
    for (const d of deps(p)) if (order.findIndex(x => x.json.name === d) >= i) die(`order bug: ${p.json.name} would publish before its dependency ${d}`)
  })
  const cliAt = order.findIndex(p => p.json.name === CLI)
  if (cliAt >= 0 && cliAt !== order.length - 1) die(`order bug: ${CLI} must publish last, not before ${order.slice(cliAt + 1).map(p => p.json.name).join(', ')}`)
  return order
}
const order = publishOrder(pkgs)
console.log(`order: ${order.map(p => p.json.name).join(' -> ')}`)

if (flag('order')) process.exit(0)   // print the order only (packages/cli/test/publish-order.test.mjs)

// --- checks: same version everywhere, built output present, size budget, repository url (provenance needs it)
const expect = opt('expect')?.replace(/^v/, '')
const problems = []
if (missing.length && !only) problems.push(`missing packages (no packages/<dir>/package.json): ${missing.join(', ')} - run node forge/build.mjs`)
const versions = new Set(pkgs.map(p => p.json.version))
if (versions.size > 1) problems.push(`versions are not in lockstep: ${pkgs.map(p => `${p.json.name}@${p.json.version}`).join(', ')}`)
for (const { dir, json } of pkgs) {
  if (expect && json.version !== expect) problems.push(`${json.name} is ${json.version}, tag says ${expect}`)
  for (const f of json.files || []) if (!f.includes('*') && !f.startsWith('!') && !fs.existsSync(path.join(dir, f))) problems.push(`${json.name}: "${f}" listed in files but missing (run node forge/build.mjs)`)
  const repo = typeof json.repository === 'string' ? json.repository : json.repository?.url
  if (!repo || !repo.includes(REPO)) problems.push(`${json.name}: package.json "repository.url" must point to https://${REPO} (npm provenance verifies it)`)
  // jsDelivr serves at most 150 MB per package version (~20 MB per file): refuse a package over the budget
  // and at most MAX_FILES files: npm answers a bigger one with E415 "Too many files" (@withicons/svelte 0.4.0: 75,018 files; 50,022 passed)
  if (fs.existsSync(path.join(dir, 'dist'))) {
    const m = measure(dir)
    console.log(`  ${json.name.padEnd(24)} ${String(m.files).padStart(6)} files (max ${MAX_FILES}), ${(m.total / 1048576).toFixed(1)} MB`)
    problems.push(...overBudget(m))
  }
  if (json.name.startsWith('@') && json.publishConfig?.access !== 'public') console.warn(`  note: ${json.name} has no publishConfig.access=public; passing --access public`)
}
// a version whose git tag already exists on another commit was released with other content (e.g. v0.1.0 = 300 icons x 7
// styles on GitHub): publishing this tree under that number would give npm and the GitHub Release different packages.
const version = pkgs[0]?.json.version
const tagSha = version ? git(['rev-parse', '-q', '--verify', `refs/tags/v${version}^{commit}`]) : ''
const headSha = git(['rev-parse', 'HEAD'])
if (tagSha && headSha && tagSha !== headSha) {
  const m = `v${version} is already tagged on ${tagSha.slice(0, 7)}, not on this commit (${headSha.slice(0, 7)}): bump "withiconsVersion" in the root package.json, rebuild (node forge/build.mjs) and move CHANGELOG "Unreleased" under the new version`
  if (DRY) console.warn(`  WARNING: ${m}`)
  else problems.push(m)
}
if (problems.length && !(DRY && flag('lenient'))) die('\n  ' + problems.join('\n  '))
else if (problems.length) console.warn('  (dry run, --lenient) ' + problems.join('\n  '))

// --- publish. npm accepts a publish before the version is installable: it processes the tarball first ("Your package is
// being processed"), which takes 10-20+ min for the ~100 MB packages (core, react, static-plus), and the registry CDN
// then caches the packument for another 5 min. 0.5.0 failed twice on a fixed 10-min wait that blocked the whole run, so:
//   - visibility is read from the registry directly (abbreviated packument, what `npm install` reads) with a
//     cache-busting query, so neither npm's local cache nor the CDN hides a version that just went out
//   - only real npm dependencies wait for visibility (core before core-plus/soft3d/holiday, web-plus before web, mcp
//     before the CLI); runtime links (AFTER) only need the companion published first, not installable
//   - a waiting package does not block the others: every package whose dependencies are ready goes out meanwhile
//   - the wait budget (--wait <min>, default 40) covers the whole run, not one package
const sleep = ms => new Promise(r => setTimeout(r, ms))
const REGISTRY = 'https://registry.npmjs.org'
const versionOf = name => pkgs.find(x => x.json.name === name).json.version
// true / false, or null when the registry could not be asked
async function onRegistry(name, version) {
  try {
    const r = await fetch(`${REGISTRY}/${name.replace('/', '%2f')}?t=${Date.now()}`, { headers: { accept: 'application/vnd.npm.install-v1+json' } })
    if (r.status === 404) return false
    if (!r.ok) return null
    return Object.hasOwn((await r.json()).versions || {}, version)
  } catch { return null }
}
// already published? npm is the fallback when the registry cannot be asked
async function published(name, version, dir) {
  const v = await onRegistry(name, version)
  if (v !== null) return v
  const r = npm(['view', `${name}@${version}`, 'version', '--prefer-online'], dir, true)
  return r.status === 0 && r.stdout.trim() === version
}
const npmDeps = p => Object.keys({ ...p.json.dependencies, ...p.json.peerDependencies, ...p.json.optionalDependencies })
  .concat(p.json.bundleDependencies || p.json.bundledDependencies || []).filter(n => names.has(n))

const inCI = !!process.env.GITHUB_ACTIONS
const waitMin = opt('wait') === undefined || opt('wait') === true ? 40 : Number(opt('wait'))
if (!Number.isFinite(waitMin) || waitMin < 0) die(`--wait takes minutes (a number), not "${opt('wait')}"`)
const deadline = Date.now() + waitMin * 60e3
// packages outside --only are not this run's to publish or wait for
const done = new Set(pkgs.filter(p => only && !only.includes(p.json.name)).map(p => p.json.name))
const visible = new Set()
let pending = order.filter(p => !done.has(p.json.name))
let nPublished = 0, nSkipped = 0
for (const p of pending) {
  if (!(await published(p.json.name, p.json.version, p.dir))) continue
  console.log(`= ${p.json.name}@${p.json.version} already on npm`)
  done.add(p.json.name); visible.add(p.json.name); nSkipped++
}
pending = pending.filter(p => !done.has(p.json.name))

const isVisible = async name => visible.has(name) || ((await onRegistry(name, versionOf(name))) === true && !!visible.add(name))
// what a package still waits for: [] when it can go out now
async function waitingOn(p) {
  const w = deps(p).filter(d => !done.has(d))   // dependencies and companions are published first (the order guarantees it)
  if (p.json.name === CLI) w.push(...pending.filter(x => x !== p).map(x => x.json.name))   // the CLI strictly last
  if (w.length || DRY) return w
  for (const d of npmDeps(p)) if (!(await isVisible(d))) w.push(`${d} (published, not installable yet)`)
  return w
}
const announced = new Set()
while (pending.length) {
  let progressed = false
  for (const p of [...pending]) {
    const w = await waitingOn(p)
    if (w.length) {
      if (!announced.has(p.json.name) && w.some(x => x.includes('not installable'))) { console.log(`  ${p.json.name} waits for ${w.join(', ')}`); announced.add(p.json.name) }
      continue
    }
    const id = `${p.json.name}@${p.json.version}`
    const args = ['publish', '--access', 'public', '--tag', p.json.version.includes('-') ? 'next' : 'latest']
    if (inCI) args.push('--provenance')
    if (DRY) args.push('--dry-run')
    console.log(`> npm ${args.join(' ')}   (${id})`)
    // in CI (no OTP prompt) the output is captured, then shown, so a re-run that meets a version npm accepted earlier
    // but still hides while it processes it ("cannot publish over the previously published versions") counts it as out
    const r = npm(args, p.dir, inCI)
    if (inCI) { process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '') }
    if (r.status !== 0 && inCI && /cannot publish over|previously published|EPUBLISHCONFLICT/i.test(`${r.stdout}
${r.stderr}`)) {
      console.log(`= ${id} was already accepted by npm (still processing): skipped`)
      done.add(p.json.name); pending = pending.filter(x => x !== p); nSkipped++; progressed = true
      continue
    }
    if (r.status !== 0) die(`${id} failed (earlier packages in this run are already published; fix and re-run - published versions are skipped)`)
    done.add(p.json.name); pending = pending.filter(x => x !== p); nPublished++; progressed = true
  }
  if (!pending.length || progressed) continue
  if (Date.now() > deadline) {
    const left = await Promise.all(pending.map(async p => `${p.json.name} (waits for ${(await waitingOn(p)).join(', ')})`))
    die(`not published, their dependencies are still being processed by the registry:\n  ${left.join('\n  ')}\nre-run the release later: published versions are skipped`)
  }
  await sleep(15e3)
}
console.log(`${DRY ? 'dry run: ' : ''}${nPublished} published, ${nSkipped} already on npm`)
