// scripts/publish.mjs publishes every internal dependency before its dependents and the `withicons` CLI last
// (0.2.1 shipped the CLI while @withicons/mcp was not installable yet: `npx withicons@latest` failed).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const script = path.join(root, 'scripts', 'publish.mjs')

test('publish order: dependencies first, CLI last', { skip: !fs.existsSync(script) && 'not in the repository' }, () => {
  const r = spawnSync(process.execPath, [script, '--order'], { cwd: root, encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  const order = r.stdout.match(/^order: (.*)$/m)[1].split(' -> ')
  const pkgs = fs.readdirSync(path.join(root, 'packages'))
    .map(d => path.join(root, 'packages', d, 'package.json')).filter(f => fs.existsSync(f))
    .map(f => JSON.parse(fs.readFileSync(f, 'utf8'))).filter(p => !p.private)
  assert.deepEqual([...order].sort(), pkgs.map(p => p.name).sort(), 'every public package once')
  assert.equal(order.at(-1), 'withicons')
  for (const p of pkgs) {
    const deps = Object.keys({ ...p.dependencies, ...p.peerDependencies, ...p.optionalDependencies }).filter(n => order.includes(n))
    for (const d of deps) assert.ok(order.indexOf(d) < order.indexOf(p.name), `${d} before ${p.name}`)
  }
  assert.ok(order.indexOf('@withicons/mcp') < order.indexOf('withicons'))
})
