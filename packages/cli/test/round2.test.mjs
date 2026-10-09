// One colour note per command (not per icon), --name-map, files without motion hooks, `animate <name> --list`,
// and the main colour role in `palettes --style`.
// node --test packages/cli/test/round2.test.mjs   (needs dist/cli.mjs: node forge/build.mjs mcp --no-site)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cli.mjs')
let tmp, n = 0
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd: tmp, env: { ...process.env, NO_COLOR: '1' } })
const out = () => path.join(tmp, 'o' + n++)
const lines = s => s.split('\n').filter(l => /^(note|warning):/.test(l))
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-r2-')) })
after(() => { fs.rmSync(tmp, { recursive: true, force: true }) })

test('export: --color alone on a one-colour style says nothing; other colours say it once for the command', () => {
  const ink = run('export', 'bell', 'heart', 'home', '--format', 'svg-flat', '--color', '#ff0000', '--out', out())
  assert.equal(ink.status, 0, ink.stderr)
  assert.deepEqual(lines(ink.stderr), [])
  const c1 = run('export', 'bell', 'heart', 'home', '--format', 'svg-flat', '--c1', '#ff0000', '--out', out())
  const one = lines(c1.stderr)
  assert.equal(one.length, 1, c1.stderr)
  assert.match(one[0], /^note: line draws bell, heart, home in one colour, so only the ink applies \(--c1 changes nothing there\)/)
})

test('export: a role used by some icons gets one "applies to" line; a warning only when none use it', () => {
  const some = run('export', 'bell', 'bell-ring', 'home', 'cloud-off', '--style', 'coquette', '--format', 'svg-flat', '--accent', '#ff0000', '--out', out())
  assert.equal(some.status, 0, some.stderr)
  assert.deepEqual(lines(some.stderr), ["note: --accent applies to: bell, bell-ring (2 others don't use it)"])
  const none = run('export', 'bell', 'home', '--style', 'sticker', '--format', 'svg-flat', '--accent', '#ff0000', '--out', out(), '--json')
  const j = JSON.parse(none.stdout)
  assert.equal(j.warnings.length, 1)
  assert.match(j.warnings[0], /^--accent changes nothing on bell, home in the sticker style: they are painted with /)
  const roles = /painted with ([^.]*)\./.exec(j.warnings[0])[1].split(', ')
  assert.deepEqual(roles, [...new Set(roles)], 'no role listed twice')
  // get with several icons: the same summary, once
  const g = run('get', 'bell', 'home', '--style', 'coquette', '--accent', '#ff0000')
  assert.deepEqual(lines(g.stderr), ["note: --accent applies to: bell (1 other doesn't use it)"])
})

test('export --name-map: one file name per icon, aliases as keys, clashes and bad names refused', () => {
  const dir = out()
  const r = run('export', 'receipt', 'heart', '--format', 'svg-flat', '--name-map', 'receipt=orders,heart=favourites', '--out', dir)
  assert.equal(r.status, 0, r.stderr)
  assert.deepEqual(fs.readdirSync(dir).sort(), ['favourites.svg', 'orders.svg'])
  const t = run('export', 'receipt', 'delete', '--format', 'svg-flat,png', '--size', '64', '--name-map', 'receipt=orders,delete=bin', '--name', '{name}-{format}', '--out', out(), '--json')
  assert.equal(t.status, 0, t.stderr)
  assert.deepEqual(JSON.parse(t.stdout).files.map(f => f.filename).sort(), ['bin-png.png', 'bin-svg-flat.svg', 'orders-png.png', 'orders-svg-flat.svg'])
  const clash = run('export', 'receipt', 'heart', '--format', 'svg', '--name-map', 'receipt=x,heart=x', '--out', out())
  assert.equal(clash.status, 2)
  assert.match(clash.stderr, /two files would both be named "x.svg"/)
  const stray = run('export', 'receipt', '--format', 'svg', '--name-map', 'heart=x', '--out', out())
  assert.equal(stray.status, 2)
  assert.match(stray.stderr, /--name-map: "heart" is not one of the icons being exported/)
  assert.equal(run('export', 'receipt', '--name-map', 'receipt=../x', '--out', out()).status, 2)
})

test('files carry no motion hooks; inline code formats keep them; get --flat too', () => {
  const dir = out()
  const r = run('export', 'bell', '--style', 'sticker', '--format', 'svg,svg-flat,data-uri,css,html,jsx', '--out', dir)
  assert.equal(r.status, 0, r.stderr)
  for (const f of ['bell-sticker-themable.svg', 'bell-sticker.svg', 'bell-sticker-data-uri.txt', 'bell-sticker.css'])
    assert.doesNotMatch(fs.readFileSync(path.join(dir, f), 'utf8'), /wm-(a|k|s|deco|shadow|shine)\b/, f)
  assert.match(fs.readFileSync(path.join(dir, 'bell-sticker.html'), 'utf8'), /class="wm-shadow"/)
  assert.match(fs.readFileSync(path.join(dir, 'BellStickerIcon.jsx'), 'utf8'), /wm-shadow/)
  assert.doesNotMatch(run('get', 'bell', '--style', 'sticker', '--flat').stdout, /wm-/)
  assert.doesNotMatch(run('get', 'bell', '--style', 'sticker', '--palette', 'candy-bell', '--flat').stdout, /wm-/)
  assert.match(run('get', 'bell', '--style', 'sticker').stdout, /class="wm-shadow"/, 'inline SVG keeps them for @withicons/motion')
})

test('animate <name> --list (and motions <name>): defaults, intent, alternates, swaps', () => {
  const r = run('animate', 'bell', '--list')
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /^bell {2}swings from its hook/)
  assert.match(r.stdout, /loop {6}ring/)
  assert.match(r.stdout, /hover {5}ring/)
  assert.match(r.stdout, /alternates/)
  assert.match(r.stdout, /withicons animate bell --preset shake/)
  assert.match(r.stdout, /swaps .*bell-off \(flip\)/)
  assert.equal(run('motions', 'bell').stdout, r.stdout)
  const j = JSON.parse(run('animate', 'bell', '--list', '--json').stdout)
  assert.deepEqual(j.alternates.map(a => a.preset), ['shake', 'pop'])
  assert.equal(j.parts.A.delay, 0.08)
  assert.match(run('animate', '--list').stdout, /^triggers/, 'without a name: the general list')
})

test('palettes --style marks the main role', () => {
  const r = run('palettes', 'bell', '--style', 'sticker', '-n', '1')
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /--with-sticker-bubblegum \(c1, main body\)/)
  assert.match(r.stdout, /main role: c1 \(main body/)
  const j = JSON.parse(run('palettes', 'bell', '--style', 'sticker', '-n', '1', '--json').stdout)
  assert.equal(j.mainRole, 'c1')
})
