// The CloudFront viewer-request function in infra/site.yaml (ViewerRequestFunction, cloudfront-js-2.0): evaluated from
// the template itself (the !Sub ${DomainName} filled in), with CloudFront Functions' event shape.
// Open redirect: //example.com/x must never answer with a protocol-relative Location.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const yaml = fs.readFileSync(path.join(here, '..', '..', '..', 'infra', 'site.yaml'), 'utf8').replace(/\r\n/g, '\n')
const DOMAIN = 'withicons.com'

function loadFunction() {
  const lines = yaml.split('\n')
  const start = lines.findIndex((l, i) => /^      FunctionCode: !Sub \|$/.test(l) && lines.slice(Math.max(0, i - 12), i).some(x => /ViewerRequestFunction:/.test(x)))
  assert.ok(start > 0, 'ViewerRequestFunction FunctionCode not found')
  const body = []
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i] !== '' && !lines[i].startsWith('        ')) break
    body.push(lines[i].slice(8))
  }
  const src = body.join('\n')
  // !Sub: only ${DomainName} may appear (any other ${...} would be a template error or a JS template literal)
  const subs = [...src.matchAll(/\$\{([^}]*)\}/g)].map(m => m[1])
  assert.deepEqual([...new Set(subs)], ['DomainName'])
  assert.ok(Buffer.byteLength(src) < 10240, 'CloudFront Functions code must be under 10 KB')
  // cloudfront-js-2.0: no require/import, no timers; evaluate in strict mode like the runtime
  return new Function(`'use strict';\n${src.replace(/\$\{DomainName\}/g, DOMAIN)}\nreturn handler;`)()
}
const handler = loadFunction()

// CloudFront Functions event: querystring { key: { value } } or { key: { value, multiValue: [{ value }] } }
const ev = (uri, { host = DOMAIN, qs = {} } = {}) => ({
  version: '1.0', context: { eventType: 'viewer-request' }, viewer: { ip: '1.2.3.4' },
  request: { method: 'GET', uri, headers: { host: { value: host } }, querystring: qs, cookies: {} },
})
const loc = r => r.headers && r.headers.location && r.headers.location.value

describe('viewer-request function (infra/site.yaml)', () => {
  test('directory index rewrite and trailing slash', () => {
    assert.equal(handler(ev('/')).uri, '/index.html')
    assert.equal(handler(ev('/guides/')).uri, '/guides/index.html')
    assert.equal(handler(ev('/icons/home.html')).uri, '/icons/home.html')
    const r = handler(ev('/guides'))
    assert.equal(r.statusCode, 301)
    assert.equal(loc(r), `https://${DOMAIN}/guides/`)
    assert.equal(loc(handler(ev('/guides', { qs: { utm_source: { value: 'x' }, a: { value: '' } } }))), `https://${DOMAIN}/guides/?utm_source=x&a`)
  })
  test('www -> apex, path and query kept', () => {
    const r = handler(ev('/icons/home.html', { host: 'WWW.' + DOMAIN, qs: { q: { value: 'a', multiValue: [{ value: 'a' }, { value: 'b' }] } } }))
    assert.equal(r.statusCode, 301)
    assert.equal(loc(r), `https://${DOMAIN}/icons/home.html?q=a&q=b`)
  })
  test('open redirect: //host/... never becomes a protocol-relative Location', () => {
    for (const uri of ['//example.com/x', '///example.com', '//example.com', '/guides//example.com', '//example.com/x/']) {
      for (const host of [DOMAIN, 'www.' + DOMAIN]) {
        const r = handler(ev(uri, { host }))
        assert.equal(r.statusCode, 301, uri)
        const l = loc(r)
        assert.ok(l.startsWith(`https://${DOMAIN}/`), `${uri} -> ${l}`)
        assert.ok(!/^https:\/\/[^/]+\/\//.test(l), `${uri} -> ${l} keeps an empty segment`)
      }
    }
    assert.equal(loc(handler(ev('//example.com/x'))), `https://${DOMAIN}/example.com/x/`)
    assert.equal(loc(handler(ev('//guides//'))), `https://${DOMAIN}/guides/`)
    assert.equal(loc(handler(ev('//icons/home.html'))), `https://${DOMAIN}/icons/home.html`)
  })
  test('//api and //mcp go to the real API path (no trailing slash)', () => {
    assert.equal(loc(handler(ev('//api/styles'))), `https://${DOMAIN}/api/styles`)
    assert.equal(loc(handler(ev('//api//search', { qs: { q: { value: 'home' } } }))), `https://${DOMAIN}/api/search?q=home`)
    assert.equal(loc(handler(ev('//mcp'))), `https://${DOMAIN}/mcp`)
  })
  test('backslashes are refused', () => {
    for (const uri of ['/\\example.com', '/x\\y', '/%5Cexample.com', '/%5cx']) assert.equal(handler(ev(uri)).statusCode, 400, uri)
  })
  test('Location never carries raw spaces, quotes, angle brackets or line breaks', () => {
    const r = handler(ev('//a b', { qs: { x: { value: '1\r\nset-cookie: a=b' }, '"<k>': { value: 'v' } } }))
    const l = loc(r)
    assert.ok(l.startsWith(`https://${DOMAIN}/`))
    assert.doesNotMatch(l, /[\s"<>\\]/)
    assert.equal(l, `https://${DOMAIN}/a%20b/?x=1%0D%0Aset-cookie:%20a=b&%22%3Ck%3E=v`)
  })
})
