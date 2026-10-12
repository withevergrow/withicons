// `withicons export --theme / --per-icon`: brand colours on each icon's own parts (the engine behind MCP export_icon theme).
// node --test packages/cli/test/theme.test.mjs   (needs dist/cli.mjs: cd packages/mcp && npm run build)
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
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-theme-')) })
after(() => { fs.rmSync(tmp, { recursive: true, force: true }) })

test('export --theme recolours a mixed set; --per-icon colours single icons; --json lists where colours went', () => {
  const out = path.join(tmp, 'brand')
  const r = run('export', 'tooth', 'heart', 'camera', '--style', 'clay', '--format', 'svg-flat', '--theme', '#0ea5e9,#f59e0b',
    '--per-icon', 'heart=#e11d48', '--out', out, '--json')
  assert.equal(r.status, 0, r.stderr)
  const j = JSON.parse(r.stdout)
  assert.equal(j.count, 3)
  const read = f => fs.readFileSync(path.join(out, f), 'utf8').toLowerCase()
  assert.match(read('tooth-clay.svg'), /#0ea5e9/)
  assert.match(read('camera-clay.svg'), /#0ea5e9/)
  assert.match(read('heart-clay.svg'), /#e11d48/)
  assert.doesNotMatch(read('heart-clay.svg'), /#0ea5e9/)
  assert.deepEqual(j.colorReport.map(e => e.name).sort(), ['camera', 'heart', 'tooth'])
  for (const e of j.colorReport) assert.ok(e.theme && e.theme.primary, JSON.stringify(e))
  assert.ok(j.notes.some(n => /^theme: primary shows exactly/.test(n)), JSON.stringify(j.notes))
})

test('export --theme refuses bad colours, unknown keys and a palette alongside', () => {
  for (const args of [['--theme', 'blue'], ['--theme', '#0ea5e9,brand=#000000'], ['--theme', '#0ea5e9', '--palette', 'classic-red'], ['--theme', '#0ea5e9', '--per-icon', 'home=#000000']]) {
    const r = run('export', 'heart', 'tooth', '--format', 'svg-flat', '--out', path.join(tmp, 'bad'), ...args)
    assert.equal(r.status, 2, `${args.join(' ')}: ${r.stderr}`)
  }
  assert.equal(fs.existsSync(path.join(tmp, 'bad')), false)
})
