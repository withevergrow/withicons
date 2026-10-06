// What npm shows: every package README the build emits has its placeholders filled and no stale claims.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packages = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const readmes = fs.readdirSync(packages).map(d => path.join(packages, d, 'README.md')).filter(f => fs.existsSync(f))
const read = name => fs.readFileSync(path.join(packages, name, 'README.md'), 'utf8')
const has = name => fs.existsSync(path.join(packages, name, 'README.md'))

test('no unfilled {{placeholder}} in any package README', () => {
  assert.ok(readmes.length >= 10, 'found the package READMEs')
  for (const f of readmes) {
    // template placeholders are {{word}}; framework code in the examples ({{ x }}, style={{ … }}) has spaces
    const left = fs.readFileSync(f, 'utf8').match(/\{\{\w+\}\}/g)
    assert.equal(left, null, `${path.relative(packages, f)}: ${left}`)
  }
})

test('@withicons/mcp README: the hosted endpoint is live, no Lambda deployment notes for a file npm does not ship', { skip: !has('mcp') }, () => {
  const t = read('mcp')
  assert.ok(!/once it is live/i.test(t))
  assert.ok(t.includes('https://withicons.com/mcp'))
  assert.ok(!t.includes('## AWS Lambda'))
  const pkg = JSON.parse(fs.readFileSync(path.join(packages, 'mcp', 'package.json'), 'utf8'))
  if ((pkg.files || []).includes('!dist/lambda.mjs')) assert.ok(!/`dist\/lambda\.mjs` is/.test(t), 'describes dist/lambda.mjs as if it shipped')
})

test('@withicons/motion README: style count matches the build, RTL classes come from @withicons/classes', { skip: !has('motion') || !has('core') }, () => {
  const t = read('motion')
  const core = JSON.parse(fs.readFileSync(path.join(packages, 'core', 'package.json'), 'utf8'))
  const m = /(\d+) icons x (\d+) styles/.exec(core.description)
  if (m) {
    for (const [, n] of t.matchAll(/in all (\d+) styles/g)) assert.equal(n, m[2], `"in all ${n} styles", the build has ${m[2]}`)
    for (const [, n] of t.matchAll(/all (\d+) icons/g)) assert.equal(n, m[1], `"all ${n} icons", the build has ${m[1]}`)
  }
  assert.ok(!/class="with with-[^"]*"[^\n]*\n?from `@withicons\/web`/.test(t), '<i class="with …"> is @withicons/classes')
})
