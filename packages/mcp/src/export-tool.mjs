// export_icon: icon files for agents (slides, docs, apps, social): the `withicons export` engine (packages/cli/src/export.mjs,
// the website's own format code) behind an MCP tool.
//   local (stdio, npx @withicons/mcp): every CLI format, animated ones included (gif, apng, animated-svg, pptx-animated);
//     files are written to out_dir when given, and small results also come back inline (text, MCP image content for
//     PNG / GIF, or an embedded base64 resource for zips, PDFs, PowerPoint ...).
//   remote (the HTTP API / Lambda): no PNG renderer there, so only the vector, code and Lottie formats are made; for
//     PNG-based and animated formats the result is the exact `npx withicons export …` command plus the icon's page.
import path from 'node:path'
import * as lib from './lib.mjs'
import { exportIcons, parseFormats, EXPORT_FORMATS, NEEDS_PNG, ExportError, loadRenderer, RENDERER_HINT } from '../../cli/src/export.mjs'

export { EXPORT_FORMATS }
export const ANIMATED_FORMATS = ['gif', 'apng', 'animated-svg', 'pptx-animated', 'lottie', 'dotlottie']
const TEXT_MIME = /^(image\/svg\+xml|application\/json|text\/|application\/(javascript|typescript|xml|postscript))/
const INLINE_MAX = 1.5 * 1024 * 1024   // per file, before base64
const INLINE_TOTAL = 4 * 1024 * 1024

const q = v => /^[\w@#.,:/-]+$/.test(String(v)) ? String(v) : `"${String(v).replace(/(["\\$`])/g, '\\$1')}"`
/** The `npx withicons export …` command that makes the same files on the user's machine. */
export function exportCommand(a) {
  const parts = ['npx', 'withicons', 'export', ...[].concat(a.name || []).map(q)]
  const add = (flag, v) => { if (v !== undefined && v !== null && v !== '' && v !== false) parts.push(flag, ...(v === true ? [] : [q(v)])) }
  add('--style', a.style); add('--format', a.format); add('--size', a.size); add('--background', a.background); add('--matte', a.matte)
  add('--palette', a.palette); add('--color', a.color)
  for (const [k, v] of Object.entries(a.colors || {})) add(k.startsWith('--') ? '--colors' : '--' + k, k.startsWith('--') ? `${k.slice(2)}=${v}` : v)
  add('--motion', a.motion); add('--to', a.to); add('--effect', a.effect); add('--fps', a.fps); add('--seconds', a.seconds); add('--loop', a.loop)
  add('--duration', a.duration); add('--padding', a.padding); if (a.all_styles) parts.push('--all-styles')
  add('--out', a.out_dir || '.')
  return parts.join(' ')
}

const iconPage = name => `${lib.SITE}/icons/${name}.html`

/**
 * args: { name, style?, format? (one or a comma list), all_styles?, size?, background?, matte?, palette?, colors?, color?,
 *   motion?, to?, effect?, hold?, duration?, fps?, seconds?, loop?, padding?, out_dir?, inline? } ; ctx: { remote }
 * -> MCP tool result ({ content, structuredContent })
 */
export async function exportIcon(a = {}, o = {}) {
  try { return await run(a, o) } catch (e) {
    if (e instanceof ExportError) { const { message, name, stack, usage, ...rest } = e; throw new lib.IconError(e.message, rest) }
    throw e
  }
}
async function run(a, { remote = false }) {
  const name = lib.resolveName(a.name)
  const formats = parseFormats(a.format || 'svg')
  const style = lib.checkStyle(a.style || 'line')
  const cmd = exportCommand({ ...a, name, style: a.style ? style : undefined, format: formats.join(',') })
  const raster = formats.filter(f => NEEDS_PNG.has(f))
  if (remote && raster.length) {
    const summary = {
      name, style, formats, made: false,
      reason: `${raster.join(', ')} ${raster.length === 1 ? 'is' : 'are'} rendered frame by frame on your machine (PNG renderer), which this remote server does not run.`,
      command: cmd, page: iconPage(name),
      howTo: 'Run the command in a terminal (Node 18+; it installs the withicons CLI on first use) and the files appear in --out. ' +
        'Or use the local MCP server (npx -y @withicons/mcp), whose export_icon writes these files directly. The icon page on withicons.com downloads every format too.',
      vectorHere: 'svg, svg-flat, pdf, eps, android, lottie, dotlottie and the code formats are made right here.',
    }
    return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }], structuredContent: summary }
  }
  if (raster.length && !(await loadRenderer())) throw new lib.IconError(RENDERER_HINT + `\nOr, in a terminal: ${cmd}`, { code: 'missing_renderer', command: cmd })
  const outDir = !remote && a.out_dir ? path.resolve(String(a.out_dir)) : null
  const colors = { ...(a.colors || {}) }
  let r
  try {
    r = await exportIcons(lib, {
      names: [name], format: formats.join(','), style, allStyles: !!a.all_styles, size: a.size, padding: a.padding, background: a.background,
      palette: a.palette, colors, color: a.color, motion: a.motion, duration: a.duration, fps: a.fps, seconds: a.seconds, loop: a.loop,
      matte: a.matte, to: a.to, effect: a.effect, hold: a.hold, out: outDir || '-', keepData: true,
    })
  } catch (e) {
    if (e instanceof ExportError) throw new lib.IconError(e.message, { code: e.code, command: cmd })
    throw e
  }
  const inline = a.inline !== undefined ? !!a.inline : !outDir
  const content = []
  let total = 0
  const files = r.files.map(f => {
    const item = { format: f.format, style: f.style, filename: f.filename, mime: f.mime, bytes: f.bytes, ...(f.file ? { path: f.file } : {}) }
    if (!inline) return item
    if (TEXT_MIME.test(f.mime) && f.bytes <= INLINE_MAX && total + f.bytes <= INLINE_TOTAL) {
      total += f.bytes
      content.push({ type: 'text', text: `--- ${f.filename} ---\n${f.data.toString('utf8')}` })
      item.inline = 'text'
    } else if (/^image\/(png|gif|jpeg|webp)$/.test(f.mime) && f.bytes <= INLINE_MAX && total + f.bytes <= INLINE_TOTAL) {
      total += f.bytes
      content.push({ type: 'image', data: f.data.toString('base64'), mimeType: f.mime })
      item.inline = 'image'
    } else if (f.bytes <= INLINE_MAX && total + f.bytes <= INLINE_TOTAL) {
      total += f.bytes
      content.push({ type: 'resource', resource: { uri: `withicons://files/${encodeURIComponent(f.filename)}`, mimeType: f.mime, blob: f.data.toString('base64') } })
      item.inline = 'resource'
    } else item.inline = false
    return item
  })
  const tooBig = files.filter(f => inline && f.inline === false)
  const summary = {
    name, style: a.all_styles ? 'all' : style, formats, made: true, count: files.length, files,
    ...(outDir ? { outDir } : {}),
    notes: [...r.notes, ...(tooBig.length ? [`${tooBig.map(f => f.filename).join(', ')} ${tooBig.length === 1 ? 'is' : 'are'} too large to return inline: pass out_dir to save ${tooBig.length === 1 ? 'it' : 'them'} to disk.`] : [])],
    command: cmd, page: iconPage(name),
    ...(formats.some(f => ['gif', 'pptx-animated'].includes(f)) ? { tip: 'GIF edges are blended with the background (or matte) colour: export again with background set to your slide colour. Colours cannot be changed after export.' } : {}),
  }
  return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }, ...content], structuredContent: summary }
}

/** The vector / code formats a remote server can make, and the ones that need the local renderer. */
export function exportFormatInfo() {
  return { formats: EXPORT_FORMATS, animated: ANIMATED_FORMATS, needsRenderer: [...NEEDS_PNG] }
}
