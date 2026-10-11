// withicons search --format none: names only (finding #9 of docs/MCP-AGENT-EVAL.md), and no junk "did you mean" (#12)
// node --test packages/cli/test/search-none.test.mjs   (needs the bundles: cd packages/mcp && npm run build)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cli.mjs')
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } })

test('search --format none --json: no snippet on any result, the rest stays', () => {
  const r = run('search', 'trash can', '--format', 'none', '--json', '-n', '4')
  assert.equal(r.status, 0)
  const j = JSON.parse(r.stdout)
  assert.equal(j.format, 'none')
  assert.ok(j.results.length >= 1)
  for (const x of j.results) assert.deepEqual(Object.keys(x).sort(), ['category', 'confidence', 'name', 'reason', 'title', 'url'], x.name)
  assert.doesNotMatch(r.stdout, /<svg|import \{/)
})
test('search --format none (text) lists the names and exits 0', () => {
  const r = run('search', 'trash can', '-f', 'none')
  assert.equal(r.status, 0)
  assert.match(r.stdout.split('\n')[0], /^\s+trash\s/)
})
test('search --json still carries snippets in every other format', () => {
  const j = JSON.parse(run('search', 'trash can', '--format', 'svg', '--json', '-n', '2').stdout)
  assert.equal(j.format, 'svg')
  for (const x of j.results) assert.match(x.snippet, /^<svg/)
  assert.match(JSON.parse(run('search', 'trash can', '--json', '-n', '1').stdout).results[0].snippet, /@withicons\/react/)
})
test('search: an unknown format is a usage error', () => {
  assert.equal(run('search', 'trash', '--format', 'bogus').status, 2)
})
test('search: a word nothing is near gets no "Did you mean"; a typo still does', t => {
  const junk = run('search', 'nervous')
  if (junk.status === 0 || /Additional results/.test(junk.stdout)) return t.skip('"nervous" now matches an icon: choose another word')
  assert.equal(junk.status, 1)
  assert.match(junk.stdout, /^No icons for "nervous"\./)
  assert.doesNotMatch(junk.stdout, /Did you mean/)
  const typo = run('search', 'hme')
  if (typo.status === 0) return t.skip('"hme" now matches an icon')
  assert.match(typo.stdout, /Did you mean: home\?/)
})
