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

  test('lists the seven tools', async () => {
    const { tools } = await client.listTools()
    assert.deepEqual(tools.map(t => t.name).sort(), ['animate_icon', 'get_icon', 'list_categories', 'list_palettes', 'list_styles', 'resolve_icon', 'search_icons'])
    const g = tools.find(t => t.name === 'get_icon')
    assert.ok(g.inputSchema.properties.palette && g.inputSchema.properties.colors)
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
    const styles = parse(await client.callTool({ name: 'list_styles', arguments: {} })).styles
    assert.ok(styles.length >= 7)
    assert.equal(styles[0].name, 'line')
    for (const s of styles.filter(x => x.palette)) assert.ok(Object.keys(s.vars).length > 0, s.name)
    const c = parse(await client.callTool({ name: 'list_categories', arguments: {} }))
    assert.ok(c.categories.length > 10)
    const w = parse(await client.callTool({ name: 'list_categories', arguments: { category: 'weather' } }))
    assert.ok(w.icons.some(i => i.name === 'sun'))
    assert.equal(parse(await client.callTool({ name: 'resolve_icon', arguments: { name: 'house' } })).name, 'home')
  })
  test('animate_icon: loop, hover (react), swap, errors', async () => {
    const loop = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'bell' } }))
    assert.equal(loop.trigger, 'loop')
    assert.match(loop.code, /wm wm-loop/)
    assert.match(loop.code, /^<link rel="stylesheet"/)
    const hover = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'notification', trigger: 'hover', format: 'react' } }))
    assert.equal(hover.name, 'bell')
    assert.match(hover.code, /import \{ Bell \} from '@withicons\/react'/)
    assert.match(hover.code, /className="wm-trigger"/)
    const sw = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'eye', trigger: 'swap', to: 'eye-off', effect: 'flip', format: 'vue' } }))
    assert.equal(sw.to, 'eye-off')
    assert.match(sw.code, /wm-swap wm-fx-flip/)
    const pre = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'settings', preset: 'spin', duration: 3 } }))
    assert.match(pre.code, /wm-p-spin/)
    assert.match(pre.code, /--wm-dur:3s/)
    // inview and draw only run through the JS runtime, so every format wires up motion()
    for (const format of ['html', 'web-component', 'react', 'vue', 'svelte', 'solid', 'angular', 'js']) {
      const iv = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'rocket', trigger: 'inview', format } }))
      assert.match(iv.code, /motion\(.*'rocket', \{ trigger: 'inview' \}\)/, format)
    }
    const draw = parse(await client.callTool({ name: 'animate_icon', arguments: { name: 'check', trigger: 'hover', preset: 'draw', format: 'vue' } }))
    assert.match(draw.code, /onMounted\(\(\) => \{ m = motion\(el\.value, 'check', \{ trigger: 'hover', preset: 'draw' \}\) \}\)/)
    const bad = await client.callTool({ name: 'animate_icon', arguments: { name: 'home', trigger: 'swap' } })
    assert.ok(bad.isError || parse(bad).to, 'swap needs a target or a suggestion')
  })
  test('get_icon: palette styles report their variables; flat svg has none', async () => {
    const styles = parse(await client.callTool({ name: 'list_styles', arguments: {} })).styles
    const pal = styles.find(s => s.palette)
    if (!pal) return
    const r = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: pal.name } }))
    assert.ok(r.palette && Object.keys(r.palette).length)
    const flat = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: pal.name, flat: true } }))
    assert.doesNotMatch(flat.code, /var\(--/)
  })
  test('every style x every format works', async () => {
    const styles = parse(await client.callTool({ name: 'list_styles', arguments: {} })).styles.map(s => s.name)
    assert.equal(styles.length, 12)
    for (const style of styles) for (const format of ['svg', 'react', 'vue', 'svelte', 'angular', 'solid', 'html-class', 'web-component', 'data-uri']) {
      const r = await client.callTool({ name: 'get_icon', arguments: { name: 'star', style, format } })
      assert.ok(!r.isError, `${style} ${format}`)
      assert.ok(parse(r).code.length > 20, `${style} ${format}`)
    }
  })
  test('list_palettes: every palette maps onto the style variables', async () => {
    const r = parse(await client.callTool({ name: 'list_palettes', arguments: { name: 'heart', style: 'sticker' } }))
    assert.equal(r.name, 'heart')
    assert.ok(r.total >= 8, 'palettes for heart')
    assert.ok(r.variables.length >= 3)
    assert.ok(r.multiColourStyles.includes('retro'))
    for (const p of r.palettes) {
      assert.match(p.colors.c1, /^#[0-9a-f]{6}$/i)
      assert.ok(Object.keys(p.vars).length >= 3, p.id)
      assert.match(p.css, /^\.icon-heart-[\w-]+ \{ color: #/)
    }
    const tag = r.palettes[0].tags[0]
    const tagged = parse(await client.callTool({ name: 'list_palettes', arguments: { name: 'heart', tag } }))
    assert.ok(tagged.palettes.length && tagged.palettes.every(p => p.tags.includes(tag)))
    assert.equal((await client.callTool({ name: 'list_palettes', arguments: { name: 'heart', tag: 'nope' } })).isError, true)
  })
  test('get_icon applies a palette (every colour) and custom colours', async () => {
    const plain = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro' } }))
    assert.ok(plain.colors.palettes >= 8)
    assert.ok(plain.colors.variables.every(v => v.role && v.default))
    const id = plain.colors.suggestions[0].id
    const svg = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro', palette: id } }))
    assert.equal(svg.appliedPalette.id, id)
    assert.match(svg.code, /^<svg style="color: #[0-9a-f]{6}; --with-retro-/i)
    const flat = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro', palette: id, flat: true } }))
    assert.doesNotMatch(flat.code, /var\(|currentColor/)
    for (const hex of Object.values(svg.appliedPalette.vars)) assert.ok(flat.code.includes(hex), hex)
    const react = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'kawaii', format: 'react', palette: id } }))
    assert.match(react.code, new RegExp(`<HeartKawaii className="icon-heart-${id}" />`))
    assert.match(react.code, /--with-kawaii-fill-1: #/)
    const vue = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'sticker', format: 'vue', colors: { c1: '#00ff00', ink: 'navy', '--with-sticker-edge': '000' } } }))
    assert.match(vue.code, /<HeartSticker class="icon-heart-custom" \/>/)
    assert.match(vue.code, /<style>\n\.icon-heart-custom \{ color: navy; .*--with-sticker-edge: #000/)
    const svelte = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'glass', format: 'svelte', palette: id } }))
    assert.match(svelte.code, /:global\(\.icon-heart-/)
    const wc = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'pixel', format: 'web-component', palette: id } }))
    assert.match(wc.code, /<with-icon style="color: #/)
    const uri = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'sticker', format: 'data-uri', palette: id } }))
    assert.doesNotMatch(decodeURIComponent(uri.code), /var\(|currentColor/)
    const inked = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'sticker', palette: id, color: '#123456' } }))
    assert.equal(inked.appliedPalette.color, '#123456')
    const line = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'line', palette: id } }))
    assert.ok(line.notes && /one colour/.test(line.notes[0]))
    assert.equal((await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro', palette: 'nope-nope' } })).isError, true)
    assert.equal((await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro', colors: { c1: 'url(x)' } } })).isError, true)
    assert.equal((await client.callTool({ name: 'get_icon', arguments: { name: 'heart', style: 'retro', colors: { body: '#fff' } } })).isError, true)
  })
  test('get_icon reports motion for animated icons', async () => {
    const r = parse(await client.callTool({ name: 'get_icon', arguments: { name: 'bell' } }))
    assert.ok(r.motion && r.motion.loop && r.motion.hover)
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
    assert.equal(JSON.parse(list.body).result.tools.length, 7)
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
  test('GET /api/motion[/<name>]', async () => {
    const list = JSON.parse((await handler(ev('GET', '/api/motion'))).body)
    assert.ok(list.presets.includes('spin'))
    assert.deepEqual(list.triggers, ['loop', 'hover', 'once', 'inview', 'swap'])
    const r = JSON.parse((await handler(ev('GET', '/api/motion/bell', 'trigger=hover&format=html'))).body)
    assert.match(r.code, /wm-hover/)
    const raw = await handler(ev('GET', '/api/motion/bell', 'raw=1'))
    assert.equal(raw.headers['content-type'], 'text/plain; charset=utf-8')
    assert.equal((await handler(ev('GET', '/api/motion/bell', 'trigger=wobble'))).statusCode, 400)
    assert.equal((await handler(ev('GET', '/api/motion/nope-nope'))).statusCode, 404)
  })
  test('GET /api/palettes/<name> and /api/icon/<name>?palette=', async () => {
    const r = await handler(ev('GET', '/api/palettes/heart', 'style=kawaii&limit=3'))
    assert.equal(r.statusCode, 200)
    const b = JSON.parse(r.body)
    assert.equal(b.palettes.length, 3)
    assert.ok(Object.keys(b.palettes[0].vars).length)
    const id = b.palettes[0].id
    const svg = await handler(ev('GET', '/api/icon/heart.svg', `style=kawaii&palette=${id}`))
    assert.equal(svg.headers['content-type'], 'image/svg+xml')
    assert.doesNotMatch(svg.body, /var\(|currentColor/)
    assert.ok(svg.body.includes(b.palettes[0].vars['--with-kawaii-fill-1']))
    const custom = await handler(ev('GET', '/api/icon/heart.svg', 'style=retro&c1=00ff00'))
    assert.match(custom.body, /#00ff00/)
    assert.equal((await handler(ev('GET', '/api/icon/heart', 'style=retro&palette=nope'))).statusCode, 400)
    assert.equal((await handler(ev('GET', '/api/palettes/nope-nope'))).statusCode, 404)
    assert.equal((await handler(ev('GET', '/api/icon/%E0%A4%A'))).statusCode, 400)
  })
  test('no route ever answers 403', async () => {
    const paths = [['GET', '/'], ['GET', '/api'], ['GET', '/api/search'], ['GET', '/api/icon/x'], ['DELETE', '/mcp'], ['PUT', '/api/search'], ['GET', '/api/palettes/heart', 'tag=bogus'], ['GET', '/mcp'], ['POST', '/mcp']]
    for (const [m, p, q] of paths) assert.notEqual((await handler(ev(m, p, q || ''))).statusCode, 403, `${m} ${p}`)
    const bad = await handler({ ...ev('POST', '/mcp', '', null, { 'content-type': 'application/json' }), body: 'not json' })
    assert.ok(bad.statusCode >= 400 && bad.statusCode !== 403, String(bad.statusCode))
  })
  test('OPTIONS preflight, health, 404', async () => {
    assert.equal((await handler(ev('OPTIONS', '/mcp'))).statusCode, 204)
    assert.ok(JSON.parse((await handler(ev('GET', '/'))).body).icons >= 300)
    assert.equal((await handler(ev('GET', '/wat'))).statusCode, 404)
  })
})
