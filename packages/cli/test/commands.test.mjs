// Per-command help, colour warnings, web-component animation code, and `export` checks that run before anything is
// written (palettes missing on some icons, --name templates, name clashes).
// node --test packages/cli/test/commands.test.mjs   (needs dist/cli.mjs: node forge/build.mjs mcp --no-site)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cli.mjs')
let tmp
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd: tmp, env: { ...process.env, NO_COLOR: '1' } })
const files = dir => fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-cmd-')) })
after(() => { fs.rmSync(tmp, { recursive: true, force: true }) })

test('<command> --help prints that command\'s options, not the global help', () => {
  const g = run('get', '--help')
  assert.equal(g.status, 0)
  assert.match(g.stdout, /^withicons get <name\.\.\.>/)
  assert.match(g.stdout, /--stroke-width/)
  assert.doesNotMatch(g.stdout, /--all-styles|withicons init \[tool/)
  for (const [cmd, re] of [['export', /--name <template>/], ['animate', /--trigger, -t/], ['search', /--category/], ['palettes', /--tag/], ['init', /--dry-run/]]) {
    const r = run(cmd, '--help')
    assert.equal(r.status, 0, cmd)
    assert.match(r.stdout, new RegExp(`^withicons ${cmd}`), cmd)
    assert.match(r.stdout, re, cmd)
  }
  assert.match(run('help', 'export').stdout, /^withicons export/)
  assert.match(run('x', '-h').stdout, /^withicons export/)
  assert.match(run('--help').stdout, /withicons search <words/)
  // export help documents the default file names
  assert.match(run('export', '--help').stdout, /home-line-themable\.svg/)
})

test('get: a colour role the style does not use warns on stderr (and still exits 0)', () => {
  const r = run('get', 'flower', '--style', 'duo', '--shine', '#ff0000')
  assert.equal(r.status, 0)
  assert.match(r.stdout, /^<svg/)
  assert.match(r.stderr, /warning: "shine" changes nothing on flower in the duo style: it is painted with ink/)
  const j = JSON.parse(run('get', 'flower', '--style', 'duo', '--shine', '#ff0000', '--json').stdout)
  assert.equal(j.warnings.length, 1)
  assert.doesNotMatch(run('get', 'heart', '--style', 'retro', '--c1', '#ff0000').stderr, /warning/)
})

test('animate --format web-component: <with-icon motion> + the motion element, @latest CDN links', () => {
  const r = run('animate', 'bell', '--format', 'web-component')
  assert.equal(r.status, 0)
  assert.match(r.stdout, /<with-icon name="bell" motion="loop"><\/with-icon>/)
  assert.doesNotMatch(r.stdout, /<span class="wm/)
  const scripts = [...r.stdout.matchAll(/<script type="module" src="([^"]+)"/g)].map(m => m[1])
  assert.deepEqual(scripts.map(s => s.replace(/^.*@withicons\//, '')), ['web@latest/dist/cdn.js', 'motion@latest/dist/element.js'])
  for (const u of r.stdout.match(/https:\/\/cdn\.jsdelivr\.net\/npm\/@withicons\/[^"']+/g)) assert.match(u, /@withicons\/[\w-]+@latest\//)
  assert.match(run('get', 'home', '--format', 'web-component').stdout, /@withicons\/web@latest\/dist\/cdn\.js/)
  assert.match(run('get', 'home', '--format', 'html-class').stdout, /@withicons\/classes@latest\/dist\/with-loader\.js/)
})

// a palette id that the first icon has and the second does not
function splitPalette() {
  const a = JSON.parse(run('palettes', 'heart', '--json').stdout).palettes.map(p => p.id)
  const b = new Set(JSON.parse(run('palettes', 'home', '--json').stdout).palettes.map(p => p.id))
  return a.find(id => !b.has(id))
}

test('export: a palette missing on some icons borrows the colours (warning); --strict and unknown icons write nothing', () => {
  const id = splitPalette()
  if (!id) return
  const out = path.join(tmp, 'pal')
  const r = run('export', 'heart', 'home', '--style', 'retro', '--palette', id, '--format', 'svg-flat', '--out', out)
  assert.equal(r.status, 0, r.stderr)
  assert.deepEqual(files(out), ['heart-retro.svg', 'home-retro.svg'])
  assert.match(r.stderr, new RegExp(`warning: home has no palette "${id}": used heart's "${id}" colours`))
  // both files carry the same palette colours
  const pal = JSON.parse(run('palettes', 'heart', '--style', 'retro', '--json').stdout).palettes.find(p => p.id === id)
  const home = fs.readFileSync(path.join(out, 'home-retro.svg'), 'utf8')
  assert.ok(Object.values(pal.vars).some(v => home.includes(v)), 'home wears the borrowed colours')

  const strictOut = path.join(tmp, 'strict')
  const s = run('export', 'heart', 'home', '--style', 'retro', '--palette', id, '--format', 'svg-flat', '--strict', '--out', strictOut)
  assert.equal(s.status, 1)
  assert.match(s.stderr, /not for home; nothing was written/)
  assert.deepEqual(files(strictOut), [])

  const none = path.join(tmp, 'none')
  const n = run('export', 'heart', 'home', '--palette', 'no-such-palette', '--out', none)
  assert.equal(n.status, 1)
  assert.deepEqual(files(none), [])
  const bad = path.join(tmp, 'bad')
  assert.equal(run('export', 'heart', 'no-such-icon-xyz', '--out', bad).status, 1)
  assert.deepEqual(files(bad), [])
})

test('export --name: templates, exact names, clashes refused before writing', () => {
  const a = path.join(tmp, 'names')
  const r = run('export', 'home', 'settings', '--format', 'svg,png-set', '--name', '{name}', '--out', a, '--json')
  if (r.status !== 0 && /resvg/.test(r.stdout + r.stderr)) return // no PNG renderer here
  assert.equal(r.status, 0, r.stderr + r.stdout)
  assert.deepEqual(files(a), ['home.svg', 'home.zip', 'settings.svg', 'settings.zip'])
  const b = path.join(tmp, 'names2')
  assert.equal(run('export', 'home', '--style', 'solid', '--format', 'svg,svg-flat', '--name', '{name}-{style}-{format}', '--out', b).status, 0)
  assert.deepEqual(files(b), ['home-solid-svg-flat.svg', 'home-solid-svg.svg'])
  const c = path.join(tmp, 'names3')
  assert.equal(run('export', 'bell', '--format', 'svg', '--name', 'logo.svg', '--out', c).status, 0)
  assert.deepEqual(files(c), ['logo.svg'])
  // {variant} empty for svg-flat: no stray dash
  const d = path.join(tmp, 'names4')
  assert.equal(run('export', 'bell', '--format', 'svg,svg-flat', '--name', '{name}-{variant}', '--out', d).status, 0)
  assert.deepEqual(files(d), ['bell-themable.svg', 'bell.svg'])
  // two files, one name: usage error, nothing written
  const e = path.join(tmp, 'clash')
  const clash = run('export', 'home', 'settings', '--format', 'svg', '--name', 'icon', '--out', e)
  assert.equal(clash.status, 2)
  assert.match(clash.stderr, /both be named "icon\.svg"/)
  assert.deepEqual(files(e), [])
  assert.equal(run('export', 'home', '--name', '../up', '--out', e).status, 2)
  assert.equal(run('export', 'home', '--name', '{nme}', '--out', e).status, 2)
  // the default names are unchanged
  const f = path.join(tmp, 'default')
  assert.equal(run('export', 'home', '--format', 'svg,svg-flat', '--out', f).status, 0)
  assert.deepEqual(files(f), ['home-line-themable.svg', 'home-line.svg'])
})

test('export --stroke-width (outline styles, validated like get) and --padding up to 0.6', () => {
  const r = run('export', 'home', '--format', 'svg-flat', '--stroke-width', '1.25', '--out', '-')
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /stroke-width="1\.25"/)
  assert.doesNotMatch(run('export', 'home', '--format', 'svg-flat', '--out', '-').stdout, /stroke-width="1\.25"/)
  assert.equal(run('export', 'home', '--stroke-width', 'abc', '--out', '-').status, 2)
  assert.equal(run('export', 'home', '--stroke-width', '0', '--out', '-').status, 2)
  assert.match(run('export', 'home', '--style', 'solid', '--format', 'svg-flat', '--stroke-width', '1', '--out', '-').stderr, /outline styles only/)
  assert.equal(run('export', 'home', '--format', 'svg-flat', '--padding', '0.5', '--out', '-').status, 0)
  assert.equal(run('export', 'home', '--format', 'svg-flat', '--padding', '0.7', '--out', '-').status, 2)
  assert.match(run('export', '--help').stdout, /--padding <0-0\.6>[\s\S]*--stroke-width/)
})

test('resolve: a word that means an icon (synonym) is a match, exit 0; unknown words show didYouMean', () => {
  const r = run('resolve', 'orders')
  assert.equal(r.status, 0, r.stdout + r.stderr)
  assert.match(r.stdout, /^receipt\s/)
  assert.match(r.stderr, /note: "orders" is not an icon name or alias/)
  const j = JSON.parse(run('resolve', 'favourites', '--json').stdout)
  assert.equal(j.status, 'synonym')
  assert.ok(j.candidates.includes('star') && j.candidates.includes('heart'))
  // star and heart carry "favourites" equally (engine 1.5 ties them exactly; the tie breaks by name): one leads, the other is "also"
  assert.ok(['star', 'heart'].includes(j.name), j.name)
  assert.match(run('resolve', 'favourites').stdout, new RegExp('also: .*' + (j.name === 'star' ? 'heart' : 'star')))
  const u = run('resolve', 'setings')
  assert.equal(u.status, 1)
  assert.match(u.stdout, /did you mean: settings/)
  assert.equal(run('resolve', 'bin').status, 0)
})
