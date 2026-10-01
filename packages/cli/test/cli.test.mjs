// node --test packages/cli/test/*.test.mjs   (needs the bundles from the forge build)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cli.mjs')
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } })

test('search "throw away" -> trash first', () => {
  const r = run('search', 'throw away')
  assert.equal(r.status, 0)
  assert.match(r.stdout.split('\n')[0], /^\s+trash\s/)
})
test('search --json', () => {
  const j = JSON.parse(run('search', 'settigns', '--json', '-n', '3').stdout)
  assert.equal(j.results[0].name, 'settings')
  assert.equal(j.results.length, 3)
})
test('get home --style solid --format react', () => {
  const r = run('get', 'home', '--style', 'solid', '--format', 'react')
  assert.equal(r.status, 0)
  assert.match(r.stdout, /import \{ Home as HomeSolid \} from '@withicons\/react\/solid'/)
})
test('get svg with size, alias resolution', () => {
  const r = run('get', 'delete', '--size', '48')
  assert.match(r.stdout, /^<svg[^>]* width="48" height="48"/)
  assert.match(r.stderr, /"delete" -> trash/)
})
test('add home settings --framework react', () => {
  const r = run('add', 'home', 'settings', '--framework', 'react')
  assert.match(r.stdout, /import \{ Home, Settings \} from '@withicons\/react'/)
  assert.match(r.stdout, /<Settings \/>/)
  const j = JSON.parse(run('add', 'home', '--fw', 'vue', '--style', 'duo', '--json').stdout)
  assert.equal(j.import, "import { Home as HomeDuo } from '@withicons/vue/duo'")
})
test('errors: unknown icon exits 1 with suggestions, bad usage exits 2', () => {
  const r = run('get', 'setings')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /settings/)
  assert.equal(run('search').status, 2)
  assert.equal(run('frobnicate').status, 2)
  const j = JSON.parse(run('get', 'setings', '--json').stdout)
  assert.equal(j.code, 'unknown_icon')
})
test('resolve, styles, categories, help', () => {
  assert.match(run('resolve', 'bin').stdout, /trash/)
  assert.equal(JSON.parse(run('styles', '--json').stdout).styles.length, 7)
  assert.ok(JSON.parse(run('categories', 'weather', '--json').stdout).icons.length > 3)
  assert.match(run('--help').stdout, /withicons search/)
})
