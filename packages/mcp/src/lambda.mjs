// AWS Lambda handler (Function URL, payload format 2.0) — stateless MCP over Streamable HTTP + a small JSON API.
//   POST /mcp                       MCP JSON-RPC (stateless, JSON responses, no sessions, no SSE)
//   GET  /api/search?q=&limit=&style=&category=&format=
//   GET  /api/icon/<name>?style=&format=&size=&color=&palette=&c1=&ink=…   (JSON; add &raw=1, or use <name>.svg, for the bare SVG/code)
//   GET  /api/palettes/<name>?style=&tag=&limit=                              (the icon's colour palettes)
//   GET  /api/motion[/<name>]?trigger=&preset=&to=&effect=&style=&format=&duration=   (animation code; &raw=1 for the bare code)
//   GET  /api/resolve/<name>   GET /api/styles   GET /api/categories[/<category>]   GET /  (health/info)
// Status codes used: 200 204 400 404 405 500 — never 403 (CloudFront maps 403 to the site's 404 page).
import { webcrypto } from 'node:crypto'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createServer, VERSION } from './server.mjs'
import { IconError, getIcon, info, listCategories, listStyles, resolveIcon, searchIcons, data, animateIcon, listMotion, listPalettes, PALETTE_ROLES } from './lib.mjs'

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization, mcp-protocol-version, mcp-session-id, last-event-id',
  'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
  'access-control-max-age': '86400',
}
const reply = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { ...CORS, 'content-type': 'application/json; charset=utf-8', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
  isBase64Encoded: false,
})
const cached = (seconds) => ({ 'cache-control': `public, max-age=${seconds}, s-maxage=${seconds}` })

// the MCP transport uses the Web Crypto global, which Node 18 only exposes as require('node:crypto').webcrypto
if (!globalThis.crypto) globalThis.crypto = webcrypto


async function mcp(event, method, url) {
  const headers = new Headers()
  for (const [k, v] of Object.entries(event.headers || {})) if (v != null) headers.set(k, String(v))
  // Clients that forget the Accept header still get an answer
  if (!/text\/event-stream/.test(headers.get('accept') || '') || !/application\/json/.test(headers.get('accept') || '')) headers.set('accept', 'application/json, text/event-stream')
  if (method === 'POST' && !headers.get('content-type')) headers.set('content-type', 'application/json')
  const body = event.body == null ? undefined : event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body
  const request = new Request(url, { method, headers, body: method === 'POST' ? body : undefined })
  const server = createServer({ remote: true })
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })
  try {
    await server.connect(transport)
    const res = await transport.handleRequest(request)
    const out = {}
    res.headers.forEach((v, k) => { out[k] = v })
    const text = await res.text()
    // never 403: CloudFront maps 403 to the site's 404 page
    return { statusCode: res.status === 403 ? 400 : res.status, headers: { ...CORS, ...out }, body: text, isBase64Encoded: false }
  } finally {
    await transport.close().catch(() => {})
    await server.close().catch(() => {})
  }
}

export async function handler(event = {}) {
  const http = (event.requestContext && event.requestContext.http) || {}
  const method = String(http.method || event.httpMethod || 'GET').toUpperCase()
  let p = String(event.rawPath || http.path || event.path || '/').replace(/\/+$/, '') || '/'
  const qs = new URLSearchParams(event.rawQueryString || '')
  if (!event.rawQueryString && event.queryStringParameters) for (const [k, v] of Object.entries(event.queryStringParameters)) qs.set(k, v)
  const host = (event.headers && (event.headers.host || event.headers.Host)) || (event.requestContext && event.requestContext.domainName) || 'localhost'
  const url = `https://${host}${p}${qs.toString() ? '?' + qs : ''}`

  try {
    if (method === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '', isBase64Encoded: false }
    if (p === '/mcp' || p === '/mcp/') {
      if (method !== 'POST') return reply(405, { jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed: this MCP endpoint is stateless (POST only, no SSE stream).' }, id: null }, { allow: 'POST, OPTIONS' })
      return await mcp(event, method, url)
    }
    if (method !== 'GET' && method !== 'HEAD') return reply(405, { error: 'Method not allowed' }, { allow: 'GET, POST, OPTIONS' })

    if (p === '/' || p === '/health' || p === '/api') {
      return reply(200, { ok: true, service: 'withicons', server: VERSION, ...info(), endpoints: { mcp: 'POST /mcp', search: 'GET /api/search?q=', icon: 'GET /api/icon/<name>?style=&format=', motion: 'GET /api/motion[/<name>]?trigger=loop|hover|once|inview|swap&format=', palettes: 'GET /api/palettes/<name>?style=&tag=', resolve: 'GET /api/resolve/<name>', styles: 'GET /api/styles', categories: 'GET /api/categories[/<category>]' } }, cached(300))
    }
    if (p === '/api/search') {
      const q = qs.get('q') || qs.get('query') || ''
      if (!q.trim()) return reply(400, { error: 'Missing ?q=' })
      return reply(200, searchIcons({ query: q, limit: +qs.get('limit') || 24, style: qs.get('style') || undefined, category: qs.get('category') || undefined, format: qs.get('format') || 'react' }), cached(3600))
    }
    let m
    if ((m = p.match(/^\/api\/icon\/([^/]+)$/))) {
      let name = decodeURIComponent(m[1]), raw = qs.get('raw') === '1' || qs.get('raw') === 'true'
      let format = qs.get('format') || 'svg'
      if (name.endsWith('.svg')) { name = name.slice(0, -4); raw = true; format = 'svg' }
      // a bare .svg is served as an image: bake the CSS-variable colours in (nothing can theme an <img>)
      const flat = qs.get('flat') ? qs.get('flat') === '1' || qs.get('flat') === 'true' : raw && format === 'svg'
      // colours: ?palette=<id> and/or one param per role (?c1=e11d48&ink=111111; the # is optional)
      const colors = {}
      for (const r of PALETTE_ROLES) if (qs.get(r)) colors[r] = qs.get(r)
      const r = getIcon({ name, style: qs.get('style') || 'line', format, size: qs.get('size') ? +qs.get('size') : undefined, color: qs.get('color') || undefined, flat, palette: qs.get('palette') || undefined, colors })
      if (raw) {
        const type = r.format === 'svg' ? 'image/svg+xml' : 'text/plain; charset=utf-8'
        return { statusCode: 200, headers: { ...CORS, ...cached(86400), 'content-type': type }, body: r.code, isBase64Encoded: false }
      }
      return reply(200, r, cached(86400))
    }
    if (p === '/api/motion') return reply(200, listMotion(), cached(3600))
    if ((m = p.match(/^\/api\/motion\/([^/]+)$/))) {
      const r = animateIcon({
        name: decodeURIComponent(m[1]), trigger: qs.get('trigger') || undefined, preset: qs.get('preset') || undefined, to: qs.get('to') || undefined,
        effect: qs.get('effect') || undefined, style: qs.get('style') || 'line', format: qs.get('format') || 'html', duration: qs.get('duration') ? +qs.get('duration') : undefined,
      })
      if (qs.get('raw') === '1' || qs.get('raw') === 'true') return { statusCode: 200, headers: { ...CORS, ...cached(86400), 'content-type': 'text/plain; charset=utf-8' }, body: r.code, isBase64Encoded: false }
      return reply(200, r, cached(86400))
    }
    if ((m = p.match(/^\/api\/palettes\/([^/]+)$/))) return reply(200, listPalettes({ name: decodeURIComponent(m[1]), style: qs.get('style') || undefined, tag: qs.get('tag') || undefined, limit: qs.get('limit') ? +qs.get('limit') : undefined }), cached(86400))
    if ((m = p.match(/^\/api\/resolve\/([^/]+)$/))) return reply(200, resolveIcon(decodeURIComponent(m[1])), cached(3600))
    if (p === '/api/styles') return reply(200, { styles: listStyles() }, cached(3600))
    if (p === '/api/categories') return reply(200, listCategories(), cached(3600))
    if ((m = p.match(/^\/api\/categories\/([^/]+)$/))) return reply(200, listCategories(decodeURIComponent(m[1])), cached(3600))
    return reply(404, { error: `Not found: ${p}` })
  } catch (e) {
    if (e instanceof IconError) { const { message, name, stack, ...rest } = e; return reply(e.code === 'unknown_icon' ? 404 : 400, { error: e.message, ...rest }) }
    if (e instanceof URIError) return reply(400, { error: 'Malformed URL encoding' })
    console.error(e)
    return reply(500, { error: 'Internal error' })
  }
}

// Cold start: this runs while the module loads, i.e. in Lambda's INIT phase (infra/lambda/index.mjs imports this file at its
// top level), which runs before the first request is accepted. Parse the inlined data, build the search engine's tables, run
// a few queries, open the default style and the palettes (byte-range maps: cheap) and push one MCP request through the SDK
// (undici's Request/Headers, zod -> JSON Schema) so the first real request, REST or MCP, finds all of it warm.
export async function warmUp() {
  const d = data()
  d.engine.search('home', { limit: 3 }); d.engine.resolve('house'); d.engine.didYouMean('hous')
  d.svg('line').home; d.palettes()
  await handler({ rawPath: '/mcp', headers: { host: 'localhost', 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    requestContext: { http: { method: 'POST', path: '/mcp' } }, body: JSON.stringify({ jsonrpc: '2.0', id: 0, method: 'tools/list', params: {} }) })
}
await warmUp().catch(e => console.error('withicons API warm-up failed:', e))

export default handler
