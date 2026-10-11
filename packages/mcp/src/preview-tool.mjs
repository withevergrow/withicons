// preview_icons: look before you choose. One picture of several icons in several styles: rows are icons, columns are styles,
// every one labelled. Agents without a way to see icons built their own contact sheets (docs/MCP-AGENT-EVAL.md, finding 7).
//   local  (stdio, npx @withicons/mcp): a PNG, as MCP image content (and a file in out_dir when given).
//   hosted (the HTTP API / Lambda): no PNG renderer there, so the sheet is one self-contained SVG (text).
// The sheet is built once, as SVG (preview-sheet.mjs); the PNG is one separate step (rasterize below): give the hosted server a
// renderer and that one function is the only thing that changes.
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import * as lib from './lib.mjs'
import { loadRenderer } from '../../cli/src/export.mjs'
import { PREVIEW_LIMITS, planPreview, buildSheet } from './preview-sheet.mjs'

const INLINE_MAX = 4 * 1024 * 1024   // a PNG larger than this is not sent inline (save it with out_dir)
const NEXT = 'get_icon(name, style, format) returns the code of the icon you pick; export_icon makes files (svg, png, pptx ...).'
const fail = (message, code, extra) => new lib.IconError(message, { code, ...extra })

// ---------------------------------------------------------------- the PNG step
/**
 * SVG sheet -> PNG bytes at 1 px per SVG unit, or null when this server cannot make one. This is the only place that knows
 * about a renderer: the local server uses @resvg/resvg-js (an optional dependency); the hosted one has none today, so it
 * answers with the SVG. To give the hosted server PNG, return bytes from here for `remote` too.
 */
export async function rasterize(svg, width, { remote = false } = {}) {
  if (remote) return null
  const render = await loadRenderer()
  return render ? render(svg, width) : null
}

// ---------------------------------------------------------------- the tool
const baseName = (plan, ext) => {
  const names = plan.icons.length > 4 ? [...plan.icons.slice(0, 3), `and-${plan.icons.length - 3}-more`] : plan.icons
  const bgTag = plan.bg.name === 'light' ? '' : plan.bg.name === 'dark' ? '-dark' : '-' + plan.bg.hex.slice(1)
  return `preview-${names.join('-')}--${plan.styles.join('-')}${bgTag}.${ext}`.replace(/[^\w.-]+/g, '-')
}

export async function previewIcons(a = {}, { remote = false } = {}) {
  const plan = planPreview(a, { remote })
  const sheet = buildSheet(plan)
  const notes = [...sheet.notes]
  let format = plan.format, bytes = null
  if (format === 'png') {
    bytes = await rasterize(sheet.svg, sheet.width, { remote })
    if (!bytes) {
      format = 'svg'
      notes.push(remote
        ? 'This hosted server returns the sheet as SVG (it has no PNG renderer). For a PNG picture use the local server (npx -y @withicons/mcp): its preview_icons returns the image directly. Save this SVG to open it in a browser or convert it with any image tool.'
        : 'No PNG renderer is installed, so this is the SVG sheet: install @resvg/resvg-js next to the server (an optional dependency) for a PNG picture, or open the SVG in a browser.')
    }
  }
  const outDir = !remote && a.out_dir ? path.resolve(String(a.out_dir)) : null
  const filename = baseName(plan, format)
  let saved = null
  if (outDir) {
    try { fs.mkdirSync(outDir, { recursive: true }); saved = path.join(outDir, filename); fs.writeFileSync(saved, bytes || sheet.svg) } catch (e) { throw fail(`Could not save to ${outDir}: ${e.message}`, 'write_failed') }
  }
  const inline = format === 'svg' || bytes.length <= INLINE_MAX
  if (!inline) notes.push(`The PNG is ${(bytes.length / 1048576).toFixed(1)} MB: too large to send inline${saved ? '' : ' (pass out_dir to save it, or use a smaller size or fewer icons)'}.`)
  const summary = {
    format, mime: format === 'png' ? 'image/png' : 'image/svg+xml', ...(plan.format !== format ? { requestedFormat: plan.format } : {}),
    width: sheet.width, height: sheet.height, layout: sheet.layout, rows: sheet.rows, columns: sheet.columns, cells: sheet.cells,
    icons: plan.icons, styles: plan.styles, size: plan.size, background: plan.bg.hex, ink: sheet.ink, labels: plan.labels, grid: sheet.grid,
    reading: sheet.reading, ...(Object.keys(plan.aliases).length ? { aliases: plan.aliases } : {}),
    filename, ...(saved ? { path: saved } : {}), ...(bytes ? { bytes: bytes.length } : {}),
    notes, ...(sheet.warnings.length ? { warnings: sheet.warnings } : {}), next: NEXT,
  }
  const content = [{ type: 'text', text: JSON.stringify(summary) }]
  if (format === 'svg') content.push({ type: 'text', text: sheet.svg })
  else if (inline) content.push({ type: 'image', data: Buffer.from(bytes).toString('base64'), mimeType: 'image/png' })
  return { content, structuredContent: summary }
}

/** Registers preview_icons on an McpServer. remote: the hosted server (SVG sheet, nothing to save to). */
export function registerPreviewTool(server, { remote = false } = {}) {
  const L = PREVIEW_LIMITS
  const styleNames = lib.data().styleNames
  const colorShape = z.object(Object.fromEntries(lib.PALETTE_ROLES.map(r => [r, z.string().max(40).optional()]))).catchall(z.string().max(40))
  server.registerTool('preview_icons', {
    title: 'Preview icons',
    description: 'Look before you choose: one labelled picture of several icons in several styles. Rows are icons (names or aliases, 1-' + L.names + '), columns are styles (1-' + L.styles + ', default line); ' +
      'with one style it is a gallery (columns = icons per row). Palette styles show their default colours; palette (an id from list_palettes) or colors { c1, ink, ... } previews a brand colour. ' +
      `size: icon size in px (${L.minSize}-${L.maxSize}, default ${L.defaultSize}; use 16-24 to see how it reads in a UI). background: light (default), dark (outlines turn light) or a hex colour. labels: false for the bare grid. ` +
      'A style below its minSize (list_styles) still renders, with a note. ' +
      (remote
        ? 'This hosted server returns a self-contained SVG sheet as text (no external references; save it and open it in a browser; for a PNG use the local server, npx -y @withicons/mcp). '
        : 'Returns a PNG as image content (format: "svg" for the vector sheet); out_dir also saves it. ') +
      `Then get_icon(name, style, format) for the code of the icon you pick. Styles: ${styleNames.join(', ')}.`,
    inputSchema: {
      names: z.array(z.string().min(1).max(60)).min(1).max(L.names).describe(`Icons to show, one row each (name or alias, 1-${L.names}), e.g. ["cake", "cookie", "donut"]`),
      styles: z.array(z.string().min(1).max(60)).max(L.styles).optional().describe(`Styles to compare, one column each (1-${L.styles}; default ["line"]), e.g. ["line", "duo", "clay", "kawaii"]`),
      style: z.string().max(60).optional().describe('Shortcut for one style (as in get_icon); styles is the list'),
      size: z.number().int().min(L.minSize).max(L.maxSize).optional().describe(`Icon size in px (default ${L.defaultSize})`),
      background: z.string().max(20).optional().describe('"light" (default), "dark" (light outlines) or a hex colour such as "#fde68a"'),
      labels: z.boolean().optional().describe('Write the icon names and style names on the sheet (default true)'),
      columns: z.number().int().min(1).max(L.columns).optional().describe('One style only: icons per row (default: balanced, at most 6)'),
      palette: z.string().max(60).optional().describe('Palette id (list_palettes): shown on the icons that have it'),
      colors: colorShape.optional().describe('Role -> colour (ink, c1-c4, tint, accent, shadow, shine, edge) for a brand preview'),
      format: z.enum(['png', 'svg']).optional().describe(remote ? 'svg (this server has no PNG renderer)' : 'png (default: an image you can see) or svg'),
      ...(remote ? {} : { out_dir: z.string().max(500).optional().describe('Folder to save the sheet in') }),
    },
    annotations: { title: 'Preview icons', readOnlyHint: true, openWorldHint: false },
  }, async args => {
    try { return await previewIcons(args || {}, { remote }) } catch (e) {
      if (e instanceof lib.IconError) { const { message, name, stack, ...rest } = e; return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: e.message, ...rest }) }] } }
      return { isError: true, content: [{ type: 'text', text: `Error: ${e && e.message ? e.message : String(e)}` }] }
    }
  })
}
