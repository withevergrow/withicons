// The hosted API (dist/lambda.mjs): only canonical paths are served, raw SVG / code answers carry a sandboxing CSP, and
// export_icon serves any export in pages that fit the Lambda (6 MB response, 10 s, 512 MB).
import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')
const LAMBDA_MAX = 6 * 1024 * 1024

describe('hosted API hardening', () => {
  let handler
  before(async () => { ({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href)) })
  const ev = (method, rawPath, rawQueryString = '', body, headers = {}) => ({
    version: '2.0', routeKey: '$default', rawPath, rawQueryString,
    headers: { host: 'abc.lambda-url.us-east-1.on.aws', ...headers },
    requestContext: { domainName: 'abc.lambda-url.us-east-1.on.aws', http: { method, path: rawPath, protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'test' } },
    body: body == null ? undefined : JSON.stringify(body), isBase64Encoded: false,
  })
  const exportCall = async args => {
    const r = await handler(ev('POST', '/mcp', '', { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'export_icon', arguments: args } },
      { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }))
    assert.equal(r.statusCode, 200)
    const res = JSON.parse(r.body).result
    return { size: Buffer.byteLength(r.body), res, s: res.structuredContent }
  }

  test('non-canonical paths are 404 JSON', async () => {
    for (const p of ['//api/styles', '/api//styles', '/%61pi/styles', '/api/%73tyles', '/api/icon/..%2fstyles', '/api/icon/%2e%2e', '/api/../api/styles', '/api\\styles', '//mcp', '/api/icon/a%2Fb.svg', '/api/icon/a%5cb']) {
      const r = await handler(ev('GET', p))
      assert.equal(r.statusCode, 404, p)
      assert.match(r.headers['content-type'], /application\/json/, p)
    }
    assert.equal((await handler(ev('GET', '/api/styles'))).statusCode, 200)
    assert.equal((await handler(ev('GET', '/api/styles/'))).statusCode, 200)
    // percent-encoding is fine in the last segment (a word to resolve)
    assert.equal((await handler(ev('GET', '/api/resolve/trash%20can'))).statusCode, 200)
  })
  test('raw SVG and code answers carry a sandboxing CSP; JSON does not need one', async () => {
    const csp = "default-src 'none'; style-src 'unsafe-inline'; sandbox"
    assert.equal((await handler(ev('GET', '/api/icon/home.svg'))).headers['content-security-policy'], csp)
    assert.equal((await handler(ev('GET', '/api/icon/home', 'raw=1&format=react'))).headers['content-security-policy'], csp)
    assert.equal((await handler(ev('GET', '/api/motion/bell', 'raw=1'))).headers['content-security-policy'], csp)
  })

  test('remote export_icon: a small export is one inline page, as before', async () => {
    const { s } = await exportCall({ names: ['home', 'bell'], format: 'svg-flat,pdf' })
    assert.equal(s.made, true)
    assert.equal(s.count, 4)
    assert.equal(s.next, undefined)
    assert.equal(s.urls, undefined)
    assert.equal(s.pageInfo, undefined)
  })
  test('remote export_icon: animated-svg answers with the command (no renderer on the server)', async () => {
    const { s } = await exportCall({ name: 'bell', format: 'animated-svg' })
    assert.equal(s.made, false)
    assert.match(s.command, /^npx withicons export bell --format animated-svg/)
  })
  test('remote export_icon: 50 icons x all styles x many formats is served page by page, every page < 6 MB', { timeout: 600000 }, async () => {
    const all = JSON.parse((await handler(ev('GET', '/api/categories'))).body)
    const names = []
    for (const c of all.categories) {
      const list = JSON.parse((await handler(ev('GET', '/api/categories/' + c.name))).body)
      for (const ic of (list.icons || [])) if (names.length < 50 && !names.includes(ic.name || ic)) names.push(ic.name || ic)
    }
    assert.equal(names.length, 50)
    const args = { names, all_styles: true, format: 'svg-flat,svg,eps,lottie,jsx' }
    let cursor, pages = 0, rendered = 0, urls = 0, of = null, worst = 0
    const seen = new Set()
    do {
      const t = performance.now()
      const { size, s } = await exportCall(cursor === undefined ? args : { ...args, cursor })
      const ms = performance.now() - t
      worst = Math.max(worst, ms)
      assert.equal(s.made, true)
      assert.ok(size < LAMBDA_MAX - 512 * 1024, `page ${pages}: ${size} bytes`)
      assert.ok(ms < 9000, `page ${pages}: ${ms.toFixed(0)} ms`)
      assert.ok(s.count > 0 || !s.next, 'every page makes progress')
      if (pages === 0) {
        urls = s.urls.length
        of = s.pageInfo.of
        assert.match(s.urls[0].url, /^https:\/\/cdn\.jsdelivr\.net\/npm\/@withicons\/static@[^/]+\/dist\/svg\/[a-z]+\/[a-z0-9-]+\.svg$/)
      } else assert.equal(s.urls, undefined)
      for (const f of s.files) { const k = f.name + '|' + f.style + '|' + f.format; assert.ok(!seen.has(k), 'no file twice: ' + k); seen.add(k) }
      rendered += s.count
      cursor = s.next && s.next.cursor
      if (s.next) assert.match(s.notes[0], /cursor: \d+/)
      pages++
    } while (cursor !== undefined && pages < 500)
    assert.equal(urls, 50 * 20)
    assert.equal(rendered, of)
    assert.equal(of, 50 * 20 * 4)
    assert.ok(pages > 1)
  })
  test('remote export_icon: pages make the same files as one call (palette borrowed across pages too)', async () => {
    const pal = async n => JSON.parse((await handler(ev('GET', '/api/palettes/' + n))).body).palettes.map(p => p.id)
    const [h, o] = [await pal('heart'), await pal('home')]
    const id = h.find(x => !o.includes(x))
    const args = { names: ['heart', 'home', 'bell'], style: 'retro', format: 'svg-flat,jsx', ...(id ? { palette: id } : {}) }
    const texts = res => res.content.slice(1).map(c => c.text)
    const one = await exportCall(args)
    assert.equal(one.s.count, 6)
    if (id) assert.ok(one.s.warnings.some(w => w.includes(`no palette "${id}"`)))
    // the same export as pages from cursor 2 (home's files without heart in the call: heart joins as the donor)
    const tail = await exportCall({ ...args, cursor: 2 })
    assert.deepEqual(texts(tail.res), texts(one.res).slice(2))
    const head = await exportCall({ ...args, cursor: 0 })
    assert.deepEqual(texts(head.res), texts(one.res))
    if (id) {
      const strict = await exportCall({ ...args, strict_palette: true, cursor: 2 })
      assert.equal(strict.res.isError, true)
    }
  })
  test('remote export_icon: a bad cursor is a tool error', async () => {
    const { res } = await exportCall({ name: 'home', format: 'svg', cursor: 99 })
    assert.equal(res.isError, true)
    assert.match(res.content[0].text, /invalid_cursor/)
  })
})
