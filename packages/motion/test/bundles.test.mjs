import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { execFileSync } from 'node:child_process'
import { dist, repo, inRepo } from './_setup.mjs'

// Every shipped JS file must parse on its own: a duplicate top-level name (two `busy` helpers) is a SyntaxError
// that kills the whole file in the browser. The website bundle concatenates several source files into one scope,
// so it is the most exposed.
const jsFiles = fs.readdirSync(dist).filter(f => f.endsWith('.js'))

test('dist has JS files', () => assert.ok(jsFiles.length >= 5, jsFiles.join(', ')))

for (const f of jsFiles) {
  test(`dist/${f} parses as an ES module`, () => {
    // --check parses (as ESM: the package is "type": "module") without running browser-only code
    try { execFileSync(process.execPath, ['--check', path.join(dist, f)], { stdio: 'pipe' }) } catch (e) {
      assert.fail(`dist/${f}: ${String(e.stderr || e.message).trim()}`)
    }
  })
}

const site = path.join(repo, 'site', 'vendor', 'motion', 'motion.js')
test('site/vendor/motion/motion.js compiles and runs as a classic script', { skip: !(inRepo && fs.existsSync(site)) && 'site bundle not available' }, () => {
  const code = fs.readFileSync(site, 'utf8')
  const script = new vm.Script(code, { filename: 'site/vendor/motion/motion.js' })
  // a fresh, DOM-less window: the bundle must define window.WithMotion without throwing
  const window = {}
  const ctx = vm.createContext({ window, console })
  script.runInContext(ctx)
  assert.equal(typeof window.WithMotion, 'object')
  assert.equal(typeof window.WithMotion.motion, 'function')
  assert.equal(typeof window.WithMotion.swap, 'function')
})
