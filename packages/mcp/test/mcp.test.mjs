// node --test packages/mcp/test/*.test.mjs   (needs the bundles: node packages/mcp/scripts/dev-build.mjs or the forge build)
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const parse = r => JSON.parse(r.content[0].text)

describe('stdio server (SDK client)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })

  test('lists the five tools', async () => {
    const { tools } = await client.listTools()
    assert.deepEqual(tools.map(t => t.name).sort(), ['get_icon', 'list_categories', 'list_styles', 'resolve_icon', 'search_icons'])
    const s = tools.find(t => t.name === 'search_icons')
    assert.ok(s.inputSchema.properties.query)
    assert.ok(s.annotations.readOnlyHint)
  })
  test('search_icons "trash can" -> trash with reason and snippet', async () => {
    const r = parse(await client.callTool({ name: 'search_icons', arguments: { query: 'trash can', limit: 5 } }))
    assert.equal(r.results[0].name, 'trash')
    assert.match(r.results[0].reason, /trash/)
    assert.match(r.results[0].snippet, /import \{ Trash \} from '@withicons\/react'/)
  })
  test('get_icon home react', async () => {
    const r = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'home', format: 'react' } }))
    assert.equal(r.name, 'home')
    assert.match(r.code, /import \{ Home \} from '@withicons\/react'/)
    assert.match(r.code, /<Home \/>/)
  })
  test('get_icon resolves aliases, styles and sizes', async () => {
    const r = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'delete', style: 'solid', format: 'svg', size: 32 } }))
    assert.equal(r.name, 'trash')
    assert.equal(r.requested, 'delete')
    assert.match(r.code, /^<svg[^>]* width="32" height="32"/)
  })
  test('get_icon every format', async () => {
    for (const format of ['svg', 'react', 'vue', 'svelte', 'angular', 'solid', 'html-class', 'web-component', 'data-uri']) {
      const r = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'arrow-right', style: 'duo', format } }))
      assert.ok(r.code.length > 20, format)
    }
  })
  test('unknown icon is a tool error with suggestions', async () => {
    const r = await client.callTool({ name: 'get_icon', arguments: { name: 'setings' } })
    assert.equal(r.isError, true)
    assert.match(r.content[0].text, /settings/)
  })
  test('list_styles / list_categories / resolve_icon', async () => {
    assert.equal(parse(await client.callTool({ name: 'list_styles', arguments: {} })).styles.length, 7)
    const c = parse(await client.callTool({ name: 'list_categories', arguments: {} }))
    assert.ok(c.categories.length > 10)
    const w = parse(await client.callTool({ name: 'list_categories', arguments: { category: 'weather' } }))
    assert.ok(w.icons.some(i => i.name === 'sun'))
    assert.equal(parse(await client.callTool({ name: 'resolve_icon', arguments: { name: 'house' } })).name, 'home')
  })
  test('resource icon://solid/home.svg', async () => {
    const r = await client.readResource({ uri: 'icon://solid/home.svg' })
    assert.match(r.contents[0].text, /^<svg/)
    const t = await client.listResourceTemplates()
    assert.ok(t.resourceTemplates.some(x => x.uriTemplate === 'icon://{style}/{name}.svg'))
  })
})

describe('Lambda handler (Function URL payload v2)', () => {
  let handler
  before(async () => { ({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href)) })
  const ev = (method, rawPath, rawQueryString = '', body, headers = {}) => ({
    version: '2.0', routeKey: '$default', rawPath, rawQueryString,
    headers: { host: 'abc.lambda-url.us-east-1.on.aws', ...headers },
    requestContext: { domainName: 'abc.lambda-url.us-east-1.on.aws', http: { method, path: rawPath, protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'test' } },
    body: body == null ? undefined : JSON.stringify(body), isBase64Encoded: false,
  })
  const rpc = (id, method, params) => ev('POST', '/mcp', '', { jsonrpc: '2.0', id, method, params }, { 'content-type': 'application/json', accept: 'application/json, text/event-stream' })

  test('MCP initialize + tools/list + tools/call', async () => {
    const init = await handler(rpc(1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } }))
    assert.equal(init.statusCode, 200)
    assert.equal(JSON.parse(init.body).result.serverInfo.name, 'withicons')
    const list = await handler(rpc(2, 'tools/list', {}))
    assert.equal(JSON.parse(list.body).result.tools.length, 5)
    const call = await handler(rpc(3, 'tools/call', { name: 'search_icons', arguments: { query: 'throw away' } }))
    const res = JSON.parse(JSON.parse(call.body).result.content[0].text)
    assert.equal(res.results[0].name, 'trash')
  })
  test('MCP works without an Accept header; GET /mcp is 405', async () => {
    const r = await handler(ev('POST', '/mcp', '', { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }, { 'content-type': 'application/json' }))
    assert.equal(r.statusCode, 200)
    assert.equal((await handler(ev('GET', '/mcp'))).statusCode, 405)
  })
  test('GET /api/search', async () => {
    const r = await handler(ev('GET', '/api/search', 'q=trash%20can&limit=3'))
    assert.equal(r.statusCode, 200)
    const b = JSON.parse(r.body)
    assert.equal(b.results[0].name, 'trash')
    assert.equal(b.results.length, 3)
    assert.equal(r.headers['access-control-allow-origin'], '*')
  })
  test('GET /api/icon/<name>', async () => {
    const r = JSON.parse((await handler(ev('GET', '/api/icon/home', 'style=solid&format=react'))).body)
    assert.match(r.code, /from '@withicons\/react\/solid'/)
    const svg = await handler(ev('GET', '/api/icon/home.svg', 'style=line'))
    assert.equal(svg.headers['content-type'], 'image/svg+xml')
    assert.match(svg.body, /^<svg/)
    assert.equal((await handler(ev('GET', '/api/icon/nope-nope'))).statusCode, 404)
  })
  test('OPTIONS preflight, health, 404', async () => {
    assert.equal((await handler(ev('OPTIONS', '/mcp'))).statusCode, 204)
    assert.equal(JSON.parse((await handler(ev('GET', '/'))).body).icons, 300)
    assert.equal((await handler(ev('GET', '/wat'))).statusCode, 404)
  })
})
