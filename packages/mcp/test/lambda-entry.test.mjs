// The deployed Lambda layout (scripts/deploy.mjs): index.mjs (infra/lambda) + mcp/lambda.mjs + mcp/data/{svg-*,palettes}.json.
// Checks the origin guard, the keep-warm ping, that the SVG data is read from mcp/data/ (not inlined), and that the
// precomputed multi-colour table matches what the npm library computes from the SVGs.
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')
const entry = path.join(here, '..', '..', '..', 'infra', 'lambda', 'index.mjs')

describe('Lambda zip layout (infra/lambda/index.mjs + mcp/)', () => {
  let dir, handler
  const SECRET = 'test-origin-secret'
  before(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-lambda-test-'))
    fs.mkdirSync(path.join(dir, 'mcp', 'data'), { recursive: true })
    fs.copyFileSync(entry, path.join(dir, 'index.mjs'))
    fs.copyFileSync(path.join(dist, 'lambda.mjs'), path.join(dir, 'mcp', 'lambda.mjs'))
    fs.writeFileSync(path.join(dir, 'mcp', 'package.json'), '{"type":"module"}\n')
    for (const f of fs.readdirSync(path.join(dist, 'data'))) if (/^(svg-[a-z0-9-]+|palettes)\.json$/.test(f)) fs.copyFileSync(path.join(dist, 'data', f), path.join(dir, 'mcp', 'data', f))
    process.env.ORIGIN_VERIFY_SECRET = SECRET
    ;({ handler } = await import(pathToFileURL(path.join(dir, 'index.mjs')).href))
  })
  after(() => { delete process.env.ORIGIN_VERIFY_SECRET; fs.rmSync(dir, { recursive: true, force: true }) })
  const ev = (rawPath, rawQueryString = '', secret = SECRET) => ({
    version: '2.0', rawPath, rawQueryString,
    headers: { host: 'withicons.com', ...(secret ? { 'x-origin-verify': secret } : {}) },
    requestContext: { http: { method: 'GET', path: rawPath, sourceIp: '1.2.3.4' } }, isBase64Encoded: false,
  })

  test('the bundle does not inline the SVG maps', () => {
    assert.ok(fs.statSync(path.join(dist, 'lambda.mjs')).size < 8 * 1048576, 'dist/lambda.mjs should be small (SVGs live in data/)')
  })
  test('origin secret: required, never passed on', async () => {
    assert.equal((await handler(ev('/api/styles', '', null))).statusCode, 401)
    assert.equal((await handler(ev('/api/styles', '', 'wrong'))).statusCode, 401)
    const e = ev('/api/search', 'q=home&limit=1')
    const r = await handler(e)
    assert.equal(r.statusCode, 200)
    assert.equal(e.headers['x-origin-verify'], undefined)
  })
  test('keep-warm ping answers without work; an HTTP request cannot pose as one', async () => {
    assert.deepEqual(await handler({ source: 'withicons.warm' }, {}), { statusCode: 200, body: 'warm' })
    const spoof = { ...ev('/api/styles', '', null), source: 'withicons.warm' }
    assert.equal((await handler(spoof)).statusCode, 401)
    const spoof2 = { source: 'withicons.warm', requestContext: {} }
    assert.equal((await handler(spoof2)).statusCode, 401)
  })
  test('every style is read from mcp/data/', async () => {
    const styles = JSON.parse((await handler(ev('/api/styles'))).body).styles.map(s => s.name)
    assert.ok(styles.length >= 20)
    for (const s of styles) {
      const r = await handler(ev('/api/icon/home.svg', `style=${s}`))
      assert.equal(r.statusCode, 200, s)
      assert.match(r.body, /^<svg/, s)
    }
  })
  // the npm library (dist/lib.mjs) parses the whole data files: the Lambda's byte-range reads must give the same answers
  test('multi-colour table, palettes and health info match the library', async () => {
    const lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
    const names = lib.data().meta.icons.map(i => i.name).filter((_, i) => i % 10 === 0)
    for (const name of names) {
      const r = JSON.parse((await handler(ev(`/api/palettes/${name}`))).body)
      assert.deepEqual(r.multiColourStyles, lib.multiColourStyles(name), name)
      assert.deepEqual(r, JSON.parse(JSON.stringify(lib.listPalettes({ name }))), name)
    }
    const health = JSON.parse((await handler(ev('/'))).body)
    assert.deepEqual({ ...health, endpoints: undefined, ok: undefined, service: undefined, server: undefined }, { ...lib.info(), endpoints: undefined, ok: undefined, service: undefined, server: undefined })
  })
  test('SVGs read by byte range match the library for every style', async () => {
    const lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
    const names = lib.data().meta.icons.map(i => i.name).filter((_, i) => i % 25 === 0)
    for (const style of lib.data().styleNames) for (const name of names) {
      const r = await handler(ev(`/api/icon/${name}`, `style=${style}`))
      assert.equal(r.statusCode, 200, `${name} ${style}`)
      assert.equal(JSON.parse(r.body).code, lib.getIcon({ name, style }).code, `${name} ${style}`)
    }
  })
})
