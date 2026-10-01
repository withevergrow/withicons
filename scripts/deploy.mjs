#!/usr/bin/env node
// Deploy withicons.com: build -> upload changed files to S3 with per-class Content-Type and
// Cache-Control -> delete removed files -> update the API Lambda code -> invalidate changed paths.
//
//   node scripts/deploy.mjs --dry-run            plan only (no writes; read-only AWS calls if credentials exist)
//   node scripts/deploy.mjs                      full deploy (needs AWS credentials: OIDC role in CI, SSO locally)
//   node scripts/deploy.mjs --print-csp          print a strict hash-based CSP for infra/site.yaml and exit
//
// Flags: --skip-build --skip-site --skip-lambda --force (re-upload every file, e.g. after changing cache rules)
//        --full-invalidation (/*)  --stack <name> (default withicons-site)  --region <r> (default us-east-1)
//        --bucket <b> --distribution <id> --function <name>   (override the stack outputs)
// Env overrides: WITHICONS_BUCKET, WITHICONS_DISTRIBUTION_ID, WITHICONS_FUNCTION_NAME, WITHICONS_STACK.
//
// Why not plain `aws s3 sync`: in CI every checked-out file has a fresh mtime, so sync re-uploads all
// ~700 files and cannot tell us which paths really changed. We diff local MD5s against S3 ETags instead,
// upload only changed files (one `aws s3 cp --recursive` per file class, so headers are exact), and
// invalidate exactly those paths.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { spawnSync } from 'node:child_process'

import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = path.join(ROOT, 'site')
const argv = process.argv.slice(2)
const flag = n => argv.includes(`--${n}`)
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d }
const DRY = flag('dry-run')
const REGION = opt('region', process.env.AWS_REGION || 'us-east-1')
const STACK = opt('stack', process.env.WITHICONS_STACK || 'withicons-site')
const log = (...a) => console.log(...a)
const die = m => { console.error(`\ndeploy: ${m}`); process.exit(1) }

// ------------------------------------------------------------------ file classes
// Order matters: first match wins. `immutable` only for files whose name changes when content changes.
const YEAR = 31536000
const CLASSES = [
  { name: 'hashed', test: k => /\.[0-9a-f]{8,}\.[a-z0-9]+$/i.test(k), cc: `public, max-age=${YEAR}, immutable` },
  { name: 'fonts', test: k => /^fonts\/.*\.(woff2?|ttf|otf)$/.test(k), cc: `public, max-age=${YEAR}, immutable` },
  { name: 'html', test: k => k.endsWith('.html'), cc: 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=604800' },
  { name: 'data', test: k => /^data\/.*\.js$/.test(k), cc: `public, max-age=86400, s-maxage=${YEAR}, stale-while-revalidate=604800` },
  { name: 'js-css', test: k => /\.(m?js|css)$/.test(k), cc: `public, max-age=3600, s-maxage=${YEAR}, stale-while-revalidate=86400` },
  { name: 'og', test: k => /^og\/.*\.png$/.test(k), cc: `public, max-age=604800, s-maxage=${YEAR}` },
  { name: 'images', test: k => /\.(svg|png|jpe?g|webp|avif|gif|ico)$/.test(k), cc: `public, max-age=86400, s-maxage=${YEAR}, stale-while-revalidate=604800` },
  { name: 'text', test: k => /\.(txt|xml|json|md|webmanifest|ts)$/.test(k), cc: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' },
  { name: 'other', test: () => true, cc: 'public, max-age=3600, s-maxage=86400' },
]
const TYPES = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif',
  ico: 'image/x-icon', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf',
  txt: 'text/plain; charset=utf-8', xml: 'application/xml; charset=utf-8', md: 'text/markdown; charset=utf-8',
  ts: 'text/plain; charset=utf-8', webmanifest: 'application/manifest+json', pdf: 'application/pdf',
}
// Never published: authoring docs and dotfiles.
const EXCLUDE = [/^DESIGN\.md$/, /(^|\/)\./, /\.map$/, /(^|\/)Thumbs\.db$/]

const classify = key => {
  const c = CLASSES.find(c => c.test(key))
  const ext = path.extname(key).slice(1).toLowerCase()
  return { cls: c.name, cc: c.cc, type: TYPES[ext] || 'application/octet-stream' }
}

// ------------------------------------------------------------------ process helpers
function run(cmd, args, { capture = false, allowFail = false, shell = false } = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', shell, maxBuffer: 256 * 1024 * 1024 })
  if (r.error && !allowFail) die(`${cmd} failed to start: ${r.error.message}`)
  if (r.status !== 0 && !allowFail) die(`${cmd} ${args.slice(0, 3).join(' ')} exited ${r.status}\n${r.stderr || ''}`)
  return r
}
const aws = (args, o = {}) => run('aws', [...args, '--region', REGION, '--output', 'json'], { capture: true, ...o })
const awsJson = (args, o) => { const r = aws(args, o); return r.status === 0 && r.stdout.trim() ? JSON.parse(r.stdout) : null }
const npm = args => run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, { shell: process.platform === 'win32' })

// ------------------------------------------------------------------ --print-csp
if (flag('print-csp')) {
  const tpl = fs.readFileSync(path.join(ROOT, 'infra', 'site.yaml'), 'utf8')
  const m = tpl.replace(/\r\n/g, '\n').match(/  ContentSecurityPolicy:\n    Type: String\n    Default: >-\n((?:      .*\n)+)/)
  if (!m) die('could not find the ContentSecurityPolicy default in infra/site.yaml')
  const base = m[1].split('\n').map(s => s.trim()).filter(Boolean).join(' ')
  const hashes = new Set()
  for (const f of walk(SITE).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(SITE, f), 'utf8')
    for (const s of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(s[1])) continue // data blocks never execute
      hashes.add(`'sha256-${crypto.createHash('sha256').update(s[2], 'utf8').digest('base64')}'`)
    }
  }
  const csp = base.replace("script-src 'self' 'unsafe-inline'", `script-src 'self' ${[...hashes].sort().join(' ')}`)
  console.error(`${hashes.size} distinct inline scripts. Pass this as the ContentSecurityPolicy parameter (max 1783 chars, this is ${csp.length}):`)
  console.log(csp)
  process.exit(csp.length > 1783 ? 1 : 0)
}

// ------------------------------------------------------------------ 1. build
if (!flag('skip-build')) {
  log('> build: node forge/build.mjs')
  run(process.execPath, ['forge/build.mjs'])
  if (fs.existsSync(path.join(ROOT, 'scripts', 'skill-sync.mjs'))) run(process.execPath, ['scripts/skill-sync.mjs'])
  const mcpPkg = path.join(ROOT, 'packages', 'mcp', 'package.json')
  if (fs.existsSync(mcpPkg) && JSON.parse(fs.readFileSync(mcpPkg, 'utf8')).scripts?.build) {
    log('> build: packages/mcp'); npm(['run', 'build', '--workspace', 'packages/mcp'])
  }
}

// ------------------------------------------------------------------ 2. targets
function targets() {
  let bucket = opt('bucket', process.env.WITHICONS_BUCKET)
  let dist = opt('distribution', process.env.WITHICONS_DISTRIBUTION_ID)
  let fn = opt('function', process.env.WITHICONS_FUNCTION_NAME)
  if (!bucket || !dist || !fn) {
    const r = awsJson(['cloudformation', 'describe-stacks', '--stack-name', STACK], { allowFail: true })
    const out = Object.fromEntries((r?.Stacks?.[0]?.Outputs || []).map(o => [o.OutputKey, o.OutputValue]))
    bucket ||= out.BucketName; dist ||= out.DistributionId; fn ||= out.ApiFunctionName
  }
  return { bucket, dist, fn }
}
const T = targets()
if (!T.bucket || !T.dist) {
  if (!DRY) die(`no bucket/distribution: stack "${STACK}" not readable in ${REGION} and no --bucket/--distribution given`)
  log(`! dry run without AWS access: treating the bucket as empty (stack "${STACK}" not readable)`)
}
log(`> targets: bucket=${T.bucket || '?'} distribution=${T.dist || '?'} function=${T.fn || '?'} region=${REGION}${DRY ? '  [DRY RUN]' : ''}`)

// ------------------------------------------------------------------ 3. diff
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, base, out)
    else out.push(path.relative(base, p).split(path.sep).join('/'))
  }
  return out
}
const md5 = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex')

const plan = { uploads: [], deletes: [], invalidate: [] }
let changedKeys = []
if (!flag('skip-site')) {
  if (!fs.existsSync(path.join(SITE, 'index.html'))) die('site/index.html missing - did the build run?')
  if (!fs.existsSync(path.join(SITE, '404.html'))) log('! site/404.html missing: CloudFront serves it for unknown paths (owned by the home-page agent)')
  const local = new Map()
  for (const k of walk(SITE)) if (!EXCLUDE.some(r => r.test(k))) local.set(k, { file: path.join(SITE, k), md5: md5(path.join(SITE, k)), ...classify(k) })

  const remote = new Map()
  if (T.bucket) {
    const r = aws(['s3api', 'list-objects-v2', '--bucket', T.bucket], { allowFail: DRY })
    if (r.status === 0) for (const o of (r.stdout.trim() ? JSON.parse(r.stdout).Contents : null) || []) remote.set(o.Key, { etag: String(o.ETag).replace(/"/g, ''), size: o.Size })
    else log('! could not list the bucket (no credentials?) - treating it as empty')
  }
  for (const [k, l] of local) {
    const r = remote.get(k)
    if (flag('force') || !r || r.etag !== l.md5) plan.uploads.push({ key: k, ...l, isNew: !r })
  }
  for (const k of remote.keys()) if (!local.has(k)) plan.deletes.push(k)
  changedKeys = [...plan.uploads.filter(u => !u.isNew).map(u => u.key), ...plan.deletes]

  const byClass = {}
  for (const u of plan.uploads) { const c = byClass[u.cls] ||= { n: 0, bytes: 0, cc: u.cc }; c.n++; c.bytes += fs.statSync(u.file).size }
  log(`> site: ${local.size} files, ${plan.uploads.length} to upload (${plan.uploads.filter(u => u.isNew).length} new), ${plan.deletes.length} to delete`)
  for (const [k, c] of Object.entries(byClass)) log(`    ${k.padEnd(7)} ${String(c.n).padStart(4)} files ${(c.bytes / 1048576).toFixed(2).padStart(7)} MB  Cache-Control: ${c.cc}`)
}

// Invalidate only objects that existed before (new keys cannot be cached). Collapse to wildcards:
// each wildcard counts as ONE path; the first 1,000 paths per month are free, then $0.005/path.
function invalidationPaths(keys) {
  if (flag('full-invalidation')) return ['/*']
  const paths = new Set()
  for (const k of keys) {
    paths.add('/' + k)
    if (k === 'index.html') paths.add('/')
    else if (k.endsWith('/index.html')) paths.add('/' + k.slice(0, -'index.html'.length))
  }
  if (paths.size > 40) return ['/*']
  const byDir = {}
  for (const p of paths) { const d = p.split('/')[1]; if (p.split('/').length > 2) (byDir[d] ||= []).push(p) }
  for (const [d, list] of Object.entries(byDir)) if (list.length > 8) { list.forEach(p => paths.delete(p)); paths.add(`/${d}/*`) }
  return [...paths].sort()
}
plan.invalidate = invalidationPaths(changedKeys)
log(`> invalidation: ${plan.invalidate.length ? plan.invalidate.join(' ') : '(nothing cached changed)'}`)

// ------------------------------------------------------------------ 4. lambda bundle
const MCP_DIST = path.join(ROOT, 'packages', 'mcp', 'dist')
let lambdaZip = null
if (!flag('skip-lambda')) {
  if (!fs.existsSync(path.join(MCP_DIST, 'lambda.mjs'))) log('! packages/mcp/dist/lambda.mjs not found - skipping the API Lambda')
  else {
    const entries = [['index.mjs', fs.readFileSync(path.join(ROOT, 'infra', 'lambda', 'index.mjs'))], ['mcp/package.json', Buffer.from('{"type":"module"}\n')]]
    for (const k of walk(MCP_DIST).sort()) {
      if (k.endsWith('.map') || k.endsWith('.d.ts') || k === 'stdio.mjs') continue
      entries.push([`mcp/${k}`, fs.readFileSync(path.join(MCP_DIST, k))])
    }
    smokeTestLambda(entries)
    lambdaZip = zip(entries)
    const sha = crypto.createHash('sha256').update(lambdaZip).digest('base64')
    let current = null
    if (T.fn) current = awsJson(['lambda', 'get-function-configuration', '--function-name', T.fn], { allowFail: true })?.CodeSha256
    plan.lambda = current === sha ? 'unchanged' : 'update'
    log(`> lambda: ${entries.length} files, ${(lambdaZip.length / 1024).toFixed(0)} KB zip, sha256 ${sha.slice(0, 12)}... -> ${plan.lambda}${current ? '' : ' (current code unknown)'}`)
  }
}

if (DRY) {
  if (argv.includes('--verbose')) for (const u of plan.uploads) log(`    put ${u.key}  [${u.type}] [${u.cc}]`)
  if (lambdaZip) fs.writeFileSync(path.join(os.tmpdir(), 'withicons-api.zip'), lambdaZip)
  log(`\nDRY RUN - nothing was written.${lambdaZip ? ` Lambda zip preview: ${path.join(os.tmpdir(), 'withicons-api.zip')}` : ''}`)
  process.exit(0)
}

// ------------------------------------------------------------------ 5. upload (assets first, HTML last, deletes after)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-deploy-'))
try {
  const groups = new Map()
  for (const u of plan.uploads) { const g = `${u.type}\n${u.cc}`; (groups.get(g) || groups.set(g, []).get(g)).push(u) }
  const ordered = [...groups.entries()].sort(([a], [b]) => (a.startsWith('text/html') ? 1 : 0) - (b.startsWith('text/html') ? 1 : 0))
  let gi = 0
  for (const [g, list] of ordered) {
    const [type, cc] = g.split('\n')
    const stage = path.join(tmp, `g${gi++}`)
    for (const u of list) { const d = path.join(stage, u.key); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(u.file, d) }
    log(`> upload ${list.length} x ${type}`)
    run('aws', ['s3', 'cp', stage, `s3://${T.bucket}/`, '--recursive', '--region', REGION, '--only-show-errors',
      '--content-type', type, '--cache-control', cc, '--metadata-directive', 'REPLACE'])
  }
  for (let i = 0; i < plan.deletes.length; i += 1000) {
    const f = path.join(tmp, `delete-${i}.json`)
    fs.writeFileSync(f, JSON.stringify({ Objects: plan.deletes.slice(i, i + 1000).map(Key => ({ Key })), Quiet: true }))
    log(`> delete ${Math.min(1000, plan.deletes.length - i)} objects`)
    aws(['s3api', 'delete-objects', '--bucket', T.bucket, '--delete', `file://${f}`])
  }
  // ---------------------------------------------------------------- 6. lambda
  if (lambdaZip && plan.lambda === 'update') {
    if (!T.fn) die('no API function name (stack output ApiFunctionName / --function)')
    const z = path.join(tmp, 'api.zip'); fs.writeFileSync(z, lambdaZip)
    log(`> lambda update-function-code ${T.fn}`)
    aws(['lambda', 'update-function-code', '--function-name', T.fn, '--zip-file', `fileb://${z}`])
    aws(['lambda', 'wait', 'function-updated', '--function-name', T.fn])
  }
  // ---------------------------------------------------------------- 7. invalidate
  if (plan.invalidate.length) {
    const r = awsJson(['cloudfront', 'create-invalidation', '--distribution-id', T.dist, '--paths', ...plan.invalidate])
    log(`> invalidation ${r?.Invalidation?.Id} (${plan.invalidate.length} path${plan.invalidate.length > 1 ? 's' : ''})`)
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }) }
log('deploy done')

// ------------------------------------------------------------------ Lambda smoke test
// Unpack the bundle into an empty temp dir (no node_modules anywhere above it, like Lambda), load it and
// call the handler with a Function URL v2 event. Catches non-bundled dependencies and startup crashes.
function smokeTestLambda(entries) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-lambda-'))
  try {
    for (const [name, data] of entries) { const f = path.join(dir, name); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data) }
    const probe = `
      const { handler } = await import(${JSON.stringify(pathToFileURL(path.join(dir, 'index.mjs')).href)})
      const ev = (method, rawPath, rawQueryString = '', body) => ({ version: '2.0', rawPath, rawQueryString,
        headers: { host: 'withicons.com', accept: 'application/json, text/event-stream', 'content-type': 'application/json' },
        queryStringParameters: Object.fromEntries(new URLSearchParams(rawQueryString)),
        requestContext: { http: { method, path: rawPath, sourceIp: '127.0.0.1' } }, body, isBase64Encoded: false })
      const out = []
      for (const e of [ev('GET', '/api/search', 'q=home&limit=3'), ev('GET', '/api/icon/home'),
        ev('POST', '/mcp', '', JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }))]) {
        const r = await handler(e, {})
        out.push(e.requestContext.http.method + ' ' + e.rawPath + ' -> ' + (r && r.statusCode))
      }
      console.log(out.join('  |  '))`
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', probe], { cwd: dir, encoding: 'utf8', env: { ...process.env, ORIGIN_VERIFY_SECRET: '' } })
    if (r.status !== 0) die(`the API bundle failed to load/run in isolation (is packages/mcp/dist/lambda.mjs self-contained?)\n${(r.stderr || '').split('\n').slice(0, 8).join('\n')}`)
    log(`> lambda smoke test: ${r.stdout.trim()}`)
  } finally { fs.rmSync(dir, { recursive: true, force: true }) }
}

// ------------------------------------------------------------------ deterministic zip (no dependencies)
function zip(files) {
  const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c })
  const crc32 = b => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0 }
  const DOS_DATE = (0 << 9) | (1 << 5) | 1 // 1980-01-01, fixed so identical input -> identical zip -> CodeSha256 match
  const locals = [], centrals = []
  let offset = 0
  for (const [name, data] of files) {
    const n = Buffer.from(name), comp = zlib.deflateRawSync(data, { level: 9 }), crc = crc32(data)
    const h = Buffer.alloc(30)
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8)
    h.writeUInt16LE(0, 10); h.writeUInt16LE(DOS_DATE, 12); h.writeUInt32LE(crc, 14)
    h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(n.length, 26); h.writeUInt16LE(0, 28)
    locals.push(h, n, comp)
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE((3 << 8) | 20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8)
    c.writeUInt16LE(8, 10); c.writeUInt16LE(0, 12); c.writeUInt16LE(DOS_DATE, 14); c.writeUInt32LE(crc, 16)
    c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(n.length, 28)
    c.writeUInt32LE((0o100644 << 16) >>> 0, 38); c.writeUInt32LE(offset, 42)
    centrals.push(c, n)
    offset += 30 + n.length + comp.length
  }
  const cd = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, cd, end])
}
