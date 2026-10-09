// export_icon: icon files for agents (slides, docs, apps, social): the `withicons export` engine (packages/cli/src/export.mjs,
// the website's own format code) behind an MCP tool.
//   local (stdio, npx @withicons/mcp): every CLI format, animated ones included (gif, apng, animated-svg, pptx-animated);
//     files are written to out_dir when given, and small results also come back inline (text, MCP image content for
//     PNG / GIF, or an embedded base64 resource for zips, PDFs, PowerPoint ...).
//   remote (the HTTP API / Lambda): no PNG renderer there, so only the vector, code and Lottie formats are made; for
//     PNG-based and animated formats the result is the exact `npx withicons export …` command plus the icon's page.
//     Every remote export is served, however large, within the Lambda's limits (6 MB response, 10 s, 512 MB): files are
//     made in pages of at most PAGE.bytes (as sent: JSON-escaped text, base64 binaries) and PAGE.ms; a page that does not
//     finish the export returns next.cursor, and the same call with that cursor returns the next files. When an export
//     needs more than one page, plain svg-flat files (no colour or size options) come back as download URLs of the
//     prebuilt @withicons/static files on jsDelivr (no rendering, any count) instead of inline.
import path from 'node:path'
import * as lib from './lib.mjs'
import { exportIcons, parseFormats, EXPORT_FORMATS, NEEDS_PNG, ExportError, loadRenderer, RENDERER_HINT, applyNameTemplate } from '../../cli/src/export.mjs'

export { EXPORT_FORMATS }
export const ANIMATED_FORMATS = ['gif', 'apng', 'animated-svg', 'pptx-animated', 'lottie', 'dotlottie']
const TEXT_MIME = /^(image\/svg\+xml|application\/json|text\/|application\/(javascript|typescript|xml|postscript))/
const INLINE_MAX = 1.5 * 1024 * 1024   // per file, before base64
const INLINE_TOTAL = 4 * 1024 * 1024
import { q, exportCommand } from './export-command.mjs'
export { q, exportCommand }

const iconPage = name => `${lib.SITE}/icons/${name}.html`

// ---- remote paging ----
// One response: at most PAGE.bytes as sent (Lambda Function URL responses max out at 6 MB; ~1.5 MB is left for the JSON
// around the files and estimate error) and no new rendering after PAGE.ms (the Lambda Timeout is 10 s; PAGE.hardMs stops
// a render in progress). Measured worst pages: docs/COSTS.md.
export const PAGE = Object.freeze({ bytes: 4.5 * 1024 * 1024, ms: 4000, hardMs: 7000, files: 400 })
// bytes of one file per byte of its source SVG (about the largest ratio measured over every style) + 2 KB; EPS of the
// gradient-heavy styles can reach ~1 MB a file, so every file is also measured after rendering
const SIZE_FACTOR = { svg: 1.05, 'svg-flat': 1.05, pdf: 3.2, eps: 4, android: 3, ios: 5, jsx: 3.2, tsx: 4.2, vue: 2.5, svelte: 2.2, 'react-native': 2.6,
  angular: 3.5, html: 1.5, css: 5.6, 'data-uri': 1.2, base64: 1.4, lottie: 13, dotlottie: 14.5 }
const BINARY_FORMATS = new Set(['pdf', 'ios', 'dotlottie'])   // sent base64 (resource blobs)
const sentBytes = (bytes, binary) => binary ? Math.ceil(bytes / 3) * 4 : Math.ceil(bytes * 1.12) + 40
// formats this remote server never makes: PNG-based ones, and animated-svg (it measures the motion with the PNG renderer)
const remoteCommandOnly = f => NEEDS_PNG.has(f) || f === 'animated-svg'
const PKG_VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest'
// the prebuilt standalone SVG of @withicons/static (colours baked in, ink currentColor), same release as this server
// the newest styles' files live in @withicons/static-plus (meta.styles[].static: the package holding the style; jsDelivr
// serves at most 150 MB per package)
const staticPkg = style => { try { const st = lib.data().meta.styles.find(x => x.name === style); return (st && st.static) || 'static' } catch { return 'static' } }
export const staticSvgUrl = (style, name) => `https://cdn.jsdelivr.net/npm/@withicons/${staticPkg(style)}@${PKG_VERSION}/dist/svg/${style}/${name}.svg`
class PageTimeout extends Error {}

/**
 * args: { name | names[] | names{icon: file base name}, style?, format? (one or a comma list), all_styles?, size?, background?, matte?, palette?, strict_palette?,
 *   colors?, color?, motion?, to?, effect?, hold?, duration?, fps?, seconds?, loop?, padding?, filename?, out_dir?, inline? } ; ctx: { remote }
 * -> MCP tool result ({ content, structuredContent })
 */
export async function exportIcon(a = {}, o = {}) {
  try { return await run(a, o) } catch (e) {
    if (e instanceof ExportError) { const { message, name, stack, usage, ...rest } = e; throw new lib.IconError(e.message, rest) }
    throw e
  }
}
async function run(a, { remote = false }) {
  // one icon (name) or several (names), all with the same options
  // names: ["home", "settings"], or a map icon -> file base name: { receipt: "orders", heart: "favourites" }
  const mapForm = a.names && typeof a.names === 'object' && !Array.isArray(a.names)
  const asked = [...(mapForm ? Object.keys(a.names) : [].concat(a.names || [])), ...(a.name ? [a.name] : [])].flatMap(n => String(n).split(',')).map(n => n.trim()).filter(Boolean)
  if (!asked.length) throw new lib.IconError('Give name (one icon) or names (several), e.g. names: ["home", "settings"]', { code: 'missing_name' })
  const names = [...new Set(asked.map(n => lib.resolveName(n)))]
  const name = names[0]
  const formats = parseFormats(a.format || 'svg')
  const style = lib.checkStyle(a.style || 'line')
  const cmd = exportCommand({ ...a, name: names, style: a.style ? style : undefined, format: formats.join(','), ...(mapForm ? { name_map: a.names } : {}) })
  const raster = formats.filter(f => remote ? remoteCommandOnly(f) : NEEDS_PNG.has(f))
  if (remote && raster.length) {
    const summary = {
      name, ...(names.length > 1 ? { names } : {}), style, formats, made: false,
      reason: `${raster.join(', ')} ${raster.length === 1 ? 'is' : 'are'} rendered frame by frame on your machine (PNG renderer), which this remote server does not run.`,
      command: cmd, page: iconPage(name), ...(names.length > 1 ? { pages: names.map(iconPage) } : {}),
      howTo: 'Run the command in a terminal (Node 18+; it installs the withicons CLI on first use) and the files appear in --out. ' +
        'Or use the local MCP server (npx -y @withicons/mcp), whose export_icon writes these files directly. The icon page on withicons.com downloads every format too.',
      vectorHere: 'svg, svg-flat, pdf, eps, android, ios, lottie, dotlottie and the code formats are made right here.',
    }
    return { content: [{ type: 'text', text: JSON.stringify(summary) }], structuredContent: summary }
  }
  if (remote) return remoteRun(a, { names, name, formats, style, cmd, mapForm })
  if (raster.length && !(await loadRenderer())) throw new lib.IconError(RENDERER_HINT + `\nOr, in a terminal: ${cmd}`, { code: 'missing_renderer', command: cmd })
  const outDir = !remote && a.out_dir ? path.resolve(String(a.out_dir)) : null
  const colors = { ...(a.colors || {}) }
  let r
  try {
    r = await exportIcons(lib, {
      names, nameMap: mapForm ? a.names : undefined, colorLabel: k => (k.startsWith('--') ? k : 'colors.' + k), format: formats.join(','), style, allStyles: !!a.all_styles, filename: a.filename, strictPalette: !!a.strict_palette, size: a.size, padding: a.padding, strokeWidth: a.stroke_width, background: a.background,
      palette: a.palette, colors, color: a.color, motion: a.motion, duration: a.duration, fps: a.fps, seconds: a.seconds, loop: a.loop,
      matte: a.matte, to: a.to, effect: a.effect, hold: a.hold, out: outDir || '-', keepData: true,
    })
  } catch (e) {
    if (e instanceof ExportError) { const { message, name: n, stack, usage, ...rest } = e; throw new lib.IconError(e.message, { ...rest, command: cmd }) }
    throw e
  }
  const inline = a.inline !== undefined ? !!a.inline : !outDir
  const content = []
  let total = 0
  const files = r.files.map(f => {
    const item = { ...(names.length > 1 ? { name: f.name } : {}), format: f.format, style: f.style, filename: f.filename, mime: f.mime, bytes: f.bytes, ...(f.file ? { path: f.file } : {}) }
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
    name, ...(names.length > 1 ? { names } : {}), style: a.all_styles ? 'all' : style, formats, made: true, count: files.length, files,
    ...(outDir ? { outDir } : {}),
    notes: [...r.notes, ...(tooBig.length ? [`${tooBig.map(f => f.filename).join(', ')} ${tooBig.length === 1 ? 'is' : 'are'} too large to return inline: pass out_dir to save ${tooBig.length === 1 ? 'it' : 'them'} to disk.`] : [])],
    ...(r.warnings && r.warnings.length ? { warnings: r.warnings } : {}),
    command: cmd, page: iconPage(name), ...(names.length > 1 ? { pages: names.map(iconPage) } : {}),
    ...(formats.some(f => ['gif', 'pptx-animated'].includes(f)) ? { tip: 'GIF edges are blended with the background (or matte) colour: export again with background set to your slide colour. Colours cannot be changed after export.' } : {}),
  }
  return { content: [{ type: 'text', text: JSON.stringify(summary) }, ...content], structuredContent: summary }
}

/** The vector / code formats a remote server can make, and the ones that need the local renderer. */
export function exportFormatInfo() {
  return { formats: EXPORT_FORMATS, animated: ANIMATED_FORMATS, needsRenderer: [...NEEDS_PNG] }
}

// The remote export, in pages (see PAGE). Files are made in the CLI's order (icon, then format, then style). A page renders
// whole icons in one exportIcons call while they fit (so a small export is one call, exactly as before), else one file
// per call. The cursor counts the rendered files before the page; it is only meaningful with the same arguments.
async function remoteRun(a, { names, name, formats, style, cmd, mapForm }) {
  const t0 = Date.now()
  const styles = a.all_styles ? lib.data().meta.styles.map(s => s.name) : [style]
  const cursor = a.cursor === undefined ? 0 : Number(a.cursor)
  const nameMap = mapForm ? new Map(Object.entries(a.names).map(([k, v]) => [lib.resolveName(k), v])) : null
  // with a name map and no filename, exportIcons names files {name} or {name}-{style}: decided here once for every call
  const filename = a.filename != null && a.filename !== '' ? a.filename : mapForm ? (styles.length > 1 ? '{name}-{style}' : '{name}') : undefined
  // palettes across icons, checked for the whole export (pages render subsets): icons without the palette borrow the
  // colours of the first icon that has it, so that icon (the donor) joins any call whose icons need it (its files are dropped)
  let donor = null
  if (a.palette) {
    const have = names.filter(n => { try { lib.applyColors(n, 'line', { palette: a.palette }); return true } catch (e) { if (e && e.code === 'unknown_palette') return false; throw e } })
    if (have.length && have.length < names.length) {
      if (a.strict_palette) throw new lib.IconError(`palette "${a.palette}" exists for ${have.join(', ')} but not for ${names.filter(n => !have.includes(n)).join(', ')}; nothing was written. Leave out strict_palette to give them the same colours (borrowed from ${have[0]}), or pick a palette per icon (list_palettes).`, { code: 'unknown_palette', command: cmd })
      donor = have[0]
    }
  }
  // svg-flat with no colour, size or stroke options is a prebuilt file: a URL when the export needs more than one page
  const plain = !a.palette && !a.color && !(a.colors && Object.keys(a.colors).length) && (a.size === undefined || a.size === 24) &&
    !a.padding && a.stroke_width === undefined && !a.background
  const est = (n, st, f) => sentBytes(lib.svgOf(n, st).length * (SIZE_FACTOR[f] || 6) + 2048, BINARY_FORMATS.has(f))
  let total = 0
  for (const n of names) for (const st of styles) for (const f of formats) total += est(n, st, f)
  const paged = a.cursor !== undefined || total > PAGE.bytes || names.length * styles.length * formats.length > PAGE.files
  const urlFormats = paged && plain && formats.includes('svg-flat') ? ['svg-flat'] : []
  const renderFormats = formats.filter(f => !urlFormats.includes(f))
  const jobs = []   // every rendered file, in order
  for (const n of names) for (const f of renderFormats) for (const st of styles) jobs.push({ name: n, format: f, style: st })
  if (!Number.isInteger(cursor) || cursor < 0 || cursor > jobs.length) throw new lib.IconError(`cursor must be a whole number from 0 to ${jobs.length} (the next.cursor of the previous page, with the same arguments)`, { code: 'invalid_cursor' })

  const urls = []
  if (cursor === 0) for (const n of names) for (const st of styles) for (const f of urlFormats) {
    const def = `${n}-${st}.svg`
    urls.push({ ...(names.length > 1 ? { name: n } : {}), format: f, style: st, filename: filename ? applyNameTemplate(filename, { name: n, style: st, format: f, filename: def, as: nameMap && nameMap.get(n) }) : def, url: staticSvgUrl(st, n) })
  }

  // one exportIcons call: the given icons, every rendered format, one style or all; or a single file
  const opts = {
    colorLabel: k => (k.startsWith('--') ? k : 'colors.' + k), filename, strictPalette: false, size: a.size, padding: a.padding, strokeWidth: a.stroke_width, background: a.background,
    palette: a.palette, colors: { ...(a.colors || {}) }, color: a.color, motion: a.motion, duration: a.duration, fps: a.fps, seconds: a.seconds, loop: a.loop,
    matte: a.matte, to: a.to, effect: a.effect, hold: a.hold, out: '-', keepData: true,
  }
  // the engine asks for each file's SVG just before making it: past PAGE.hardMs a call stops there and is dropped, unless
  // it is the page's first (then it finishes: a page always makes progress, and one call is at most one page of files)
  const files = []
  const guarded = { ...lib, svgOf: (...x) => { if (files.length && Date.now() - t0 > PAGE.hardMs) throw new PageTimeout(); return lib.svgOf(...x) } }
  const call = async (callNames, format, st) => {
    const withDonor = donor && !callNames.includes(donor) && callNames.some(n => n !== donor) ? [donor, ...callNames] : callNames
    const map = nameMap ? Object.fromEntries(withDonor.filter(n => nameMap.has(n)).map(n => [n, nameMap.get(n)])) : undefined
    const r = await exportIcons(guarded, { ...opts, names: withDonor, nameMap: map && Object.keys(map).length ? map : undefined,
      format, style: st || style, allStyles: !st && !!a.all_styles })
    return { ...r, files: r.files.filter(f => callNames.includes(f.name)) }
  }
  const notes = new Set(), warnings = new Set()
  let sent = 0, i = cursor
  try {
    const per = renderFormats.length * styles.length
    const sizeOf = f => sentBytes(f.bytes, !TEXT_MIME.test(f.mime))
    while (i < jobs.length && files.length < PAGE.files && Date.now() - t0 < PAGE.ms) {
      // at an icon boundary: as many whole icons as fit (estimated) in one call; else the next single file
      const group = []
      if (i % per === 0) {
        let add = 0
        for (let k = i; k < jobs.length; k += per) {
          let b = 0
          for (let x = k; x < k + per; x++) b += est(jobs[x].name, jobs[x].style, jobs[x].format)
          if (group.length && (sent + add + b > PAGE.bytes || files.length + (k - i) + per > PAGE.files)) break
          add += b; group.push(jobs[k].name)
          if (sent + add > PAGE.bytes) break
        }
      }
      const jb = jobs[i]
      if (!group.length && files.length && sent + est(jb.name, jb.style, jb.format) > PAGE.bytes) break
      const r = group.length ? await call(group, renderFormats.join(','), null) : await call([jb.name], jb.format, jb.style)
      // the files come in job order: keep those that fit (EPS of the gradient-heavy styles can be far larger than
      // estimated); the first one that does not starts the next page
      let kept = 0
      for (const f of r.files) {
        const b = sizeOf(f)
        if ((files.length || kept) && (sent + b > PAGE.bytes || files.length >= PAGE.files)) break
        sent += b; files.push(f); kept++
      }
      r.notes.forEach(n => notes.add(n)); (r.warnings || []).forEach(w => warnings.add(w))
      i += kept
      if (kept < r.files.length) break
    }
  } catch (e) {
    if (!(e instanceof PageTimeout)) {
      if (e instanceof ExportError) { const { message, name: n, stack, usage, ...rest } = e; throw new lib.IconError(e.message, { ...rest, command: cmd }) }
      throw e
    }
    // the call in progress is dropped: the page ends with the files already made
  }
  const content = []
  const list = files.map(f => {
    const item = { ...(names.length > 1 ? { name: f.name } : {}), format: f.format, style: f.style, filename: f.filename, mime: f.mime, bytes: f.bytes }
    if (f.bytes > INLINE_MAX) { item.inline = false; return item }
    if (TEXT_MIME.test(f.mime)) { content.push({ type: 'text', text: `--- ${f.filename} ---\n${f.data.toString('utf8')}` }); item.inline = 'text' }
    else { content.push({ type: 'resource', resource: { uri: `withicons://files/${encodeURIComponent(f.filename)}`, mimeType: f.mime, blob: f.data.toString('base64') } }); item.inline = 'resource' }
    return item
  })
  const tooBig = list.filter(f => f.inline === false)
  const next = i < jobs.length ? { cursor: i, remaining: jobs.length - i } : null
  const summary = {
    name, ...(names.length > 1 ? { names } : {}), style: a.all_styles ? 'all' : style, formats, made: true, count: list.length, files: list,
    ...(urls.length ? { urls } : {}),
    ...(paged ? { pageInfo: { cursor, files: list.length, of: jobs.length, ...(urls.length ? { urls: urls.length } : {}) } } : {}),
    ...(next ? { next } : {}),
    notes: [
      ...(next ? [`More files to come: ${next.remaining} of ${jobs.length} still to make. Call export_icon again with the same arguments and cursor: ${next.cursor} for the next page (or run the command for everything at once).`] : []),
      ...(urls.length ? [`${urls.length} svg-flat file${urls.length === 1 ? ' is' : 's are'} prebuilt: download each from its url (the @withicons/static SVG: colours baked in, the ink follows currentColor, black in an <img>).`] : []),
      ...notes,
      ...(tooBig.length ? [`${tooBig.map(f => f.filename).join(', ')} ${tooBig.length === 1 ? 'is' : 'are'} too large to return here: run the command to make ${tooBig.length === 1 ? 'it' : 'them'} locally.`] : []),
    ],
    ...(warnings.size ? { warnings: [...warnings] } : {}),
    command: cmd, page: iconPage(name), ...(names.length > 1 ? { pages: names.map(iconPage) } : {}),
  }
  return { content: [{ type: 'text', text: JSON.stringify(summary) }, ...content], structuredContent: summary }
}
