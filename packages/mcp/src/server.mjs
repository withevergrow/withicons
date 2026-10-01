// MCP server definition (transport-agnostic). Used by the stdio bin and the Lambda handler.
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { FORMATS, IconError, data, getIcon, info, listCategories, listStyles, resolveIcon, searchIcons, svgOf, checkStyle, resolveName } from './lib.mjs'

export const SERVER_NAME = 'withicons'
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.0.0-dev'

const INSTRUCTIONS = `with icons (withicons.com): 300 open-source (MIT) icons, each drawn in 7 styles (line, solid, duo, gloss, engrave, blueprint, sketch).
Workflow: search_icons with what the icon should show ("delete", "throw away", "user settings") -> pick a name -> get_icon(name, style, format) for paste-ready code.
Formats: ${FORMATS.join(', ')}. Packages: @withicons/react|vue|svelte|angular|solid|web|core|static. Names and common aliases both work (e.g. "delete" -> trash).`

const json = v => ({ content: [{ type: 'text', text: JSON.stringify(v, null, 2) }], structuredContent: v })
const fail = e => {
  if (e instanceof IconError) { const { message, name, stack, ...rest } = e; return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: e.message, ...rest }, null, 2) }] } }
  return { isError: true, content: [{ type: 'text', text: `Error: ${e && e.message ? e.message : String(e)}` }] }
}
const safe = fn => async args => { try { return fn(args || {}) } catch (e) { return fail(e) } }

export function createServer() {
  const d = data()
  const styleNames = d.styleNames
  const categoryNames = d.meta.categories.map(c => c.name)
  const server = new McpServer({ name: SERVER_NAME, version: VERSION, title: 'with icons', websiteUrl: 'https://withicons.com' }, { instructions: INSTRUCTIONS, capabilities: { tools: {}, resources: {} } })
  const ro = { readOnlyHint: true, openWorldHint: false }

  server.registerTool('search_icons', {
    title: 'Search icons',
    description: 'Find icons by meaning. Understands plain English, synonyms, plurals, phrases and typos ("trash can", "throw away", "settigns", "money"). Returns ranked icon names, why each matched, and a ready-to-paste snippet.',
    inputSchema: {
      query: z.string().min(1).describe('What the icon should show, in plain words'),
      limit: z.number().int().min(1).max(100).optional().describe('Max results (default 10)'),
      style: z.enum(styleNames).optional().describe('Style for the snippet (default line)'),
      category: z.enum(categoryNames).optional().describe('Only icons in this category'),
      format: z.enum(FORMATS).optional().describe('Snippet format (default react)'),
    },
    annotations: { title: 'Search icons', ...ro },
  }, safe(a => json(searchIcons(a))))

  server.registerTool('get_icon', {
    title: 'Get icon code',
    description: `Get one icon as paste-ready code. Accepts a canonical name or an alias ("delete" -> trash). Formats: ${FORMATS.join(', ')}.`,
    inputSchema: {
      name: z.string().min(1).describe('Icon name or alias, e.g. "home", "arrow-right", "delete"'),
      style: z.enum(styleNames).optional().describe('Style (default line)'),
      format: z.enum(FORMATS).optional().describe('Output format (default svg)'),
      size: z.number().int().min(8).max(1024).optional().describe('Pixel size (default 24)'),
      color: z.string().max(40).optional().describe('Replace currentColor (svg / data-uri only), e.g. "#e11d48"'),
    },
    annotations: { title: 'Get icon code', ...ro },
  }, safe(a => json(getIcon(a))))

  server.registerTool('list_styles', {
    title: 'List styles',
    description: 'The 7 visual styles every icon is drawn in, with what each looks like.',
    inputSchema: {},
    annotations: { title: 'List styles', ...ro },
  }, safe(() => json({ styles: listStyles() })))

  server.registerTool('list_categories', {
    title: 'List categories',
    description: 'All icon categories with counts, or (with category) every icon in that category.',
    inputSchema: { category: z.enum(categoryNames).optional().describe('List the icons in this category') },
    annotations: { title: 'List categories', ...ro },
  }, safe(a => json(listCategories(a.category))))

  server.registerTool('resolve_icon', {
    title: 'Resolve icon name',
    description: 'Check whether a name or alias maps to exactly one icon. Returns the canonical name, the ambiguous candidates, or the nearest names.',
    inputSchema: { name: z.string().min(1).describe('Name or alias to check') },
    annotations: { title: 'Resolve icon name', ...ro },
  }, safe(a => json(resolveIcon(a.name))))

  // icon://<style>/<name>.svg
  server.registerResource('icon', new ResourceTemplate('icon://{style}/{name}.svg', {
    list: undefined,
    complete: { style: () => styleNames, name: v => d.engine.search(v || '', { limit: 20 }).map(r => r.name) },
  }), { title: 'Icon SVG', description: 'One icon in one style as SVG, e.g. icon://solid/home.svg', mimeType: 'image/svg+xml' },
  async (uri, vars) => {
    const style = checkStyle(String(vars.style))
    const name = resolveName(String(vars.name).replace(/\.svg$/, ''))
    return { contents: [{ uri: uri.href, mimeType: 'image/svg+xml', text: svgOf(name, style) }] }
  })
  server.registerResource('about', 'icon://about', { title: 'About with icons', mimeType: 'application/json' },
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ ...info(), styles: listStyles(), categories: listCategories().categories }, null, 2) }] }))

  return server
}
