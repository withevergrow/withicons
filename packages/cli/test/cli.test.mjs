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
  const styles = JSON.parse(run('styles', '--json').stdout).styles
  assert.ok(styles.length >= 7)
  assert.equal(styles[0].name, 'line')
  assert.ok(JSON.parse(run('categories', 'weather', '--json').stdout).icons.length > 3)
  assert.match(run('--help').stdout, /withicons search/)
})
test('animate: loop / hover / swap code, --list, errors', () => {
  const loop = run('animate', 'bell')
  assert.equal(loop.status, 0)
  assert.match(loop.stdout, /class="wm wm-loop[^"]*"/)
  assert.match(loop.stdout, /motion\.css/)
  const hover = run('animate', 'bell', '--trigger', 'hover', '--format', 'react')
  assert.match(hover.stdout, /className="wm-trigger"/)
  assert.match(hover.stdout, /<Bell \/>/)
  const swap = JSON.parse(run('animate', 'play', '--trigger', 'swap', '--to', 'pause', '--effect', 'flip', '--json').stdout)
  assert.equal(swap.to, 'pause')
  assert.match(swap.code, /wm-swap wm-fx-flip/)
  assert.match(swap.code, /class="wm-a"/)
  assert.match(swap.code, /class="wm-b"/)
  assert.equal(run('animate', '--list').status, 0)
  assert.equal(run('animate', 'bell', '--preset', 'nope').status, 2)
  assert.equal(run('animate', 'nope-icon-xyz').status, 1)
})
test('get --flat bakes CSS-variable colours in', () => {
  const r = run('get', 'home', '--style', 'duo', '--flat')
  assert.equal(r.status, 0)
  assert.doesNotMatch(r.stdout, /var\(--/)
})
test('usage errors exit 2: unknown option, missing value, bad numbers, bad option values', () => {
  const bad = run('get', 'home', '--styel', 'solid')
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /unknown option "--styel".*--style/)
  assert.equal(run('get', 'home', '--style').status, 2)
  assert.equal(run('get', 'home', '--size', 'abc').status, 2)
  assert.equal(run('search', 'home', '-n', '0').status, 2)
  assert.equal(run('get', 'home', '--style', 'bogus').status, 2)
  assert.equal(run('add', 'home', '--fw', 'data-uri').status, 2)
  assert.equal(run('resolve').status, 2)
  assert.equal(JSON.parse(run('get', 'home', '--nope', '--json').stdout).code, 'usage')
  // a missing icon is "not found" (1), not a usage error
  assert.equal(run('get', 'no-such-icon-xyz').status, 1)
})
test('--stroke-width and --no-color', () => {
  assert.match(run('get', 'home', '--stroke-width', '2.5').stdout, /stroke-width="2.5"/)
  assert.equal(run('styles', '--no-color').status, 0)
})
test('styles lists the colour variables of multi-colour styles', () => {
  const r = run('styles')
  assert.match(r.stdout, /--with-retro-1/)
  assert.match(r.stdout, /--with-sticker-edge/)
})

// palettes need a @withicons/mcp with palette data (packages/mcp/dist/data/palettes.json)
const hasPalettes = (() => { const r = run('palettes', 'heart', '--json'); return r.status === 0 && JSON.parse(r.stdout).total > 0 })()
test('palettes <name>: list, --style variables, --tag, --json', { skip: !hasPalettes && 'no palette data in this @withicons/mcp build' }, () => {
  const j = JSON.parse(run('palettes', 'heart', '--style', 'retro', '--json').stdout)
  assert.equal(j.name, 'heart')
  assert.ok(j.total >= 20 && j.total <= 30, `20-30 palettes, got ${j.total}`)
  assert.ok(j.variables.some(v => v.var === '--with-retro-1' && v.role === 'c1'))
  assert.ok(j.palettes[0].vars['--with-retro-1'])
  const txt = run('palettes', 'heart', '--style', 'retro')
  assert.equal(txt.status, 0)
  assert.match(txt.stdout, new RegExp('^  ' + j.palettes[0].id + ' ', 'm'))
  assert.match(txt.stdout, /--palette /)
  const tag = j.palettes[0].tags[0]
  const t = JSON.parse(run('palettes', 'heart', '--tag', tag, '--json').stdout)
  assert.ok(t.palettes.every(p => p.tags.includes(tag)))
  assert.equal(run('palettes', 'heart', '--tag', 'not-a-tag').status, 2)
  assert.equal(run('palettes').status, 2)
})
test('get --palette / colour roles recolour every colour', { skip: !hasPalettes && 'no palette data in this @withicons/mcp build' }, () => {
  const p = JSON.parse(run('palettes', 'heart', '--style', 'retro', '--json').stdout).palettes[0]
  const svg = run('get', 'heart', '--style', 'retro', '--palette', p.id).stdout
  assert.match(svg, new RegExp(`^<svg style="color: ${p.colors.ink}; --with-retro-`))
  const flat = run('get', 'heart', '--style', 'retro', '--palette', p.id, '--flat').stdout
  assert.doesNotMatch(flat, /var\(--|currentColor/)
  for (const v of Object.values(p.vars)) assert.ok(flat.includes(`"${v}"`), `${v} baked in`)
  // roles on top of a palette, a variable by short name, and --color as the ink
  const react = run('get', 'heart', '-s', 'sticker', '--palette', p.id, '--c1', '#00ff00', '--colors', 'sticker-edge=#000000', '-f', 'react').stdout
  assert.match(react, /className="icon-heart-[\w-]+-custom"/)
  assert.match(react, /--with-sticker-\w+: #00ff00/)
  assert.match(react, /--with-sticker-edge: #000000/)
  assert.match(run('get', 'heart', '-s', 'kawaii', '--c2', '#123456', '--color', 'red').stdout, /color: red/)
  assert.equal(run('get', 'heart', '-s', 'retro', '--palette', 'nope').status, 1)
  assert.equal(run('get', 'heart', '-s', 'retro', '--c1', 'url(x)').status, 2)
  assert.equal(run('get', 'heart', '-s', 'retro', '--colors', 'c1').status, 2)
  // one-colour style: only the ink applies, and the CLI says so
  const line = run('get', 'heart', '--palette', p.id)
  assert.match(line.stdout, new RegExp(`color: ${p.colors.ink}`))
  assert.match(line.stderr, /one colour/)
})
test('styles --for: the best styles for a job; styles grouped; motions --style lists the moves', () => {
  const j = JSON.parse(run('styles', '--for', 'diwali sale banner', '--icon', 'diya', '--json').stdout)
  assert.equal(j.recommendations[0].style, 'rangoli')
  assert.match(j.recommendations[0].webComponent, /variant="rangoli"/)
  const t = run('styles', '--for', 'christmas email')
  assert.equal(t.status, 0)
  assert.match(t.stdout, /christmas[\s\S]*palettes: classic/)
  assert.match(run('styles').stdout, /Holidays[\s\S]*christmas/)
  assert.match(run('motions', 'camera', '--style', 'soft3d').stdout, /moves in soft3d/)
})
