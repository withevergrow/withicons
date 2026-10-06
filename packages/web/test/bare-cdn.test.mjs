// The bare CDN URL (<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web">) serves dist/cdn.js from
// outside dist/: its icons must still come from this version's dist/, not from …/npm/@withicons/icons/…
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')
const core = path.join(here, '..', '..', '..', 'forge', 'lib', 'emit-core.mjs')
const version = JSON.parse(fs.readFileSync(path.join(here, '..', 'package.json'), 'utf8')).version

test('withBareBase: bare package URLs -> pinned dist/, file URLs -> null', { skip: !fs.existsSync(core) && 'not in the repository' }, async () => {
  const { withBareBase: b } = await import(pathToFileURL(core).href)
  const J = 'https://cdn.jsdelivr.net/npm/@withicons/'
  for (const u of [J + 'web', J + 'web/', J + 'web@latest', J + 'web@0.2', J + 'web@0.2.1/', J + 'web?x=1'])
    assert.equal(b(u, 'web', '9.9.9', 'dist/'), J + 'web@9.9.9/dist/', u)
  assert.equal(b('https://unpkg.com/@withicons/classes@latest', 'classes', '1.0.0', 'dist/'), 'https://unpkg.com/@withicons/classes@1.0.0/dist/')
  assert.equal(b('http://127.0.0.1:8080/npm/@withicons/dynamic', 'dynamic', '1.0.0', 'dist/cdn/'), 'http://127.0.0.1:8080/npm/@withicons/dynamic@1.0.0/dist/cdn/')
  for (const u of [J + 'web@latest/dist/cdn.js', J + 'web@0.2.1/dist/cdn.js', 'http://localhost:5173/node_modules/@withicons/web/dist/cdn.js',
    'https://example.com/vendor/withicons/web/dist/cdn.js', 'https://withicons.com/vendor/with/with-icons.js', J + 'classes', '', null, undefined])
    assert.equal(b(u, 'web', '9.9.9', 'dist/'), null, String(u))
})

test('cdn.js resolves its base through withBareBase at its own version', { skip: !fs.existsSync(path.join(dist, 'cdn.js')) && 'dist/ not built' }, () => {
  const js = fs.readFileSync(path.join(dist, 'cdn.js'), 'utf8')
  assert.ok(js.includes('function withBareBase('))
  assert.ok(js.includes(`withBareBase(import.meta.url, 'web', ${JSON.stringify(version)}, 'dist/') || new URL('./', import.meta.url).href`))
  const pkg = JSON.parse(fs.readFileSync(path.join(here, '..', 'package.json'), 'utf8'))
  assert.equal(pkg.jsdelivr, './dist/cdn.js')
})
