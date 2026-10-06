// The `npx withicons export …` line the export tool suggests must paste into bash, zsh and PowerShell unchanged.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { q, exportCommand } from '../src/export-command.mjs'

test('q(): plain words bare, hex colours and shell-special values double-quoted', () => {
  assert.equal(q('home'), 'home')
  assert.equal(q('svg,png'), 'svg,png')
  assert.equal(q(24), '24')
  assert.equal(q('./out'), './out')
  assert.equal(q('#ffffff'), '"#ffffff"')
  assert.equal(q('c1=#e11d48'), '"c1=#e11d48"')
  assert.equal(q('@home'), '"@home"')
  assert.equal(q('my icons'), '"my icons"')
  assert.equal(q('a;b'), '"a;b"')
  assert.equal(q('a$b'), `'a$b'`)
})

test('exportCommand(): quotes the background colour and passes --hold', () => {
  const cmd = exportCommand({ name: 'home', format: 'gif', background: '#ffffff', motion: 'swap', to: 'lock', hold: 0.5, out_dir: 'out' })
  assert.match(cmd, / --background "#ffffff"( |$)/)
  assert.match(cmd, / --hold 0\.5( |$)/)
  assert.match(cmd, / --to lock --effect| --to lock /)
  assert.ok(!/ #/.test(cmd), 'no bare #')
  // hold: 0 is a real value, not "unset"
  assert.match(exportCommand({ name: 'home', hold: 0 }), / --hold 0( |$)/)
})

// the actual shells, where available: every argument after `export` survives as one word with the '#'
const argv = cmd => cmd.replace(/^npx withicons export /, '')
const ECHO = 'console.log(JSON.stringify(process.argv.slice(1)))'
const cmd = exportCommand({ name: 'home', format: 'png', background: '#ffffff', colors: { c1: '#e11d48' }, hold: 1, out_dir: 'my out' })
const want = ['home', '--format', 'png', '--background', '#ffffff', '--c1', '#e11d48', '--hold', '1', '--out', 'my out']
for (const [shell, args] of [
  ['bash', ['-c', `node -e '${ECHO}' -- ${argv(cmd)}`]],
  ['powershell', ['-NoProfile', '-NonInteractive', '-Command', `node -e '${ECHO}' -- ${argv(cmd)}`]],
]) {
  const probe = spawnSync(shell, shell === 'bash' ? ['-c', 'true'] : ['-NoProfile', '-Command', 'exit 0'], { stdio: 'ignore' })
  test(`exportCommand() arguments parse in ${shell}`, { skip: probe.status !== 0 && `${shell} not available` }, () => {
    const r = spawnSync(shell, args, { encoding: 'utf8' })
    assert.equal(r.status, 0, r.stderr)
    assert.deepEqual(JSON.parse(r.stdout.trim().split('\n').pop()), want)
  })
}
