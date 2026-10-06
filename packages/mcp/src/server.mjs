// MCP server definition (transport-agnostic). Used by the stdio bin and the Lambda handler.
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { exportIcon, EXPORT_FORMATS } from './export-tool.mjs'
import { FORMATS, IconError, data, getIcon, info, listCategories, listStyles, resolveIcon, searchIcons, svgOf, checkStyle, resolveName, animateIcon, listMotion, motionData, TRIGGERS, MOTION_FORMATS, listPalettes, PALETTE_ROLES } from './lib.mjs'

export const SERVER_NAME = 'withicons'
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.0.0-dev'

const instructions = (d, remote) => {
  const pal = d.meta.styles.filter(s => s.palette).map(s => s.name)
  return `with icons (withicons.com): ${d.meta.icons.length} open-source (MIT) icons, each drawn in ${d.styleNames.length} styles (${d.styleNames.join(', ')}).
Workflow: search_icons with what the icon should show ("delete", "throw away", "user settings") -> pick a name -> get_icon(name, style, format) for paste-ready code.
Style words in a query pick the style ("cute heart" -> kawaii, "8-bit star" -> pixel, "frosted" -> glass, "vintage camera" -> retro, "3d" -> luxe, "manga" -> anime, "medieval" -> gothic, "soft" -> pastel, "girly" -> coquette, "toy" or "kids" -> plush).
${pal.length ? `Palette styles (${pal.join(', ')}) are multi-colour and duo + blueprint have an accent colour: every colour is a CSS variable with a default, the ink follows currentColor. ` : ''}Each icon has 20-30 colour palettes picked for it: list_palettes(name, style) shows them; get_icon(..., palette: "<id>") applies one, colors: { c1, c2, ink, ... } changes any colour.
Use line/solid/duo for UI controls, the creative styles at 32px+.
Animation: animate_icon(name, trigger loop|hover|once|inview|swap, format) returns code for the optional @withicons/motion package (continuous loops, hover effects, icon-to-icon swaps).
Files: export_icon(name, style, format) makes files: svg, pdf, png, pptx, docx, favicons, app assets, Lottie, and animated ones for slides and docs: gif (plays in PowerPoint, Keynote, Google Slides, email, chat), apng, animated-svg, pptx-animated (a slide with the moving icon). Set background to the slide colour for GIFs. ${remote ? 'On this remote server PNG-based and animated formats come back as the exact `npx withicons export ...` command to run.' : 'Pass out_dir to save files to disk.'}
Formats: ${FORMATS.join(', ')}. Packages: @withicons/react|vue|svelte|angular|solid|web|classes|core|static|motion (web = <with-icon> element, classes = <i class="with with-home"> CSS icons). Names and common aliases both work (e.g. "delete" -> trash).`
}

// structuredContent carries the result; the text block is the same JSON once, compact (the MCP spec's fallback for
// clients that do not read structuredContent), or a short summary where the JSON would be long (search_icons)
const json = (v, text) => ({ content: [{ type: 'text', text: text || JSON.stringify(v) }], structuredContent: v })
const fail = e => {
  if (e instanceof IconError) { const { message, name, stack, ...rest } = e; return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: e.message, ...rest }) }] } }
  return { isError: true, content: [{ type: 'text', text: `Error: ${e && e.message ? e.message : String(e)}` }] }
}
// search_icons as text: one line per icon and the top icon's snippet (snippets and urls of all are in structuredContent)
export function searchSummary(r) {
  if (!r.count) return `No icons for "${r.query}".${r.suggestions && r.suggestions.length ? ` Did you mean: ${r.suggestions.join(', ')}?` : ''}${r.hint ? ` ${r.hint}` : ''}`
  const lines = [`${r.count} icon${r.count === 1 ? '' : 's'} for "${r.query}"${r.didYouMean ? ` (showing results for "${r.didYouMean}")` : ''}, style ${r.style}:`]
  r.results.forEach((x, i) => lines.push(`${i + 1}. ${x.name} (${x.category}): ${x.reason}`))
  lines.push('', `${r.results[0].name}:`, r.results[0].snippet, '', 'get_icon(name, style, format) returns any of them as code; structuredContent has every snippet and page url.')
  return lines.join("\n")
}
const safe = fn => async args => { try { return await fn(args || {}) } catch (e) { return fail(e) } }

// opts.remote: the HTTP / Lambda server (no PNG renderer: export_icon answers raster and animated formats with a command)
export function createServer(opts = {}) {
  const remote = !!opts.remote
  const d = data()
  const styleNames = d.styleNames
  const categoryNames = d.meta.categories.map(c => c.name)
  const server = new McpServer({ name: SERVER_NAME, version: VERSION, title: 'with icons', websiteUrl: 'https://withicons.com' }, { instructions: instructions(d, remote), capabilities: { tools: {}, resources: {} } })
  const ro = { readOnlyHint: true, openWorldHint: false }

  server.registerTool('search_icons', {
    title: 'Search icons',
    description: 'Find icons by meaning. Understands plain English, synonyms, plurals, phrases and typos ("trash can", "throw away", "settigns", "money"). Returns ranked icon names, why each matched, and a ready-to-paste snippet; didYouMean when the query was spell-corrected, and a hint (where to browse) when nothing matched.',
    inputSchema: {
      query: z.string().min(1).describe('What the icon should show, in plain words'),
      limit: z.number().int().min(1).max(100).optional().describe('Max results (default 10)'),
      style: z.enum(styleNames).optional().describe('Style for the snippet (default line)'),
      category: z.enum(categoryNames).optional().describe('Only icons in this category'),
      format: z.enum(FORMATS).optional().describe('Snippet format (default react)'),
    },
    annotations: { title: 'Search icons', ...ro },
  }, safe(a => { const r = searchIcons(a); return json(r, searchSummary(r)) }))

  server.registerTool('get_icon', {
    title: 'Get icon code',
    description: `Get one icon as paste-ready code or SVG. name takes a canonical name or an alias ("delete" -> trash). format: ${FORMATS.join(', ')} (default svg). ` +
      'Colours: palette (an id from list_palettes) and/or colors (roles ink, c1-c4, tint, accent, shadow, shine, edge -> hex; merged over the palette); color replaces currentColor in svg / data-uri; flat bakes the CSS variables into the svg (for <img>, Figma, slides). ' +
      'The result has colors.mainRole (the role that paints the body: set it for a brand colour), warnings (colours that change nothing in this style), motion (whether animate_icon has a tuned animation) and, with include_palettes (default: a palette style with no format), the icon palette ids.',
    inputSchema: {
      name: z.string().min(1).describe('Icon name or alias, e.g. "home", "arrow-right", "delete"'),
      style: z.enum(styleNames).optional().describe('Style (default line)'),
      format: z.enum(FORMATS).optional().describe('Output format (default svg)'),
      size: z.number().int().min(8).max(1024).optional().describe('Pixel size (default 24)'),
      color: z.string().max(40).optional().describe('Replace currentColor (svg / data-uri only), e.g. "#e11d48"'),
      flat: z.boolean().optional().describe('svg only: bake CSS-variable colours into the file (for <img>, Figma, slides, rasterizers)'),
      palette: z.string().max(60).optional().describe('Apply one of the icon colour palettes by id (see colors.suggestions in the result, or list_palettes), e.g. "classic-red"'),
      colors: z.object(Object.fromEntries(PALETTE_ROLES.map(r => [r, z.string().max(40).optional()]))).catchall(z.string().max(40)).optional()
        .describe('Change any colour: roles ink (outline), c1 (main), c2, c3, c4, tint, accent, shadow, shine, edge -> "#hex" or a CSS colour name; also accepts --with-* variable names. Merged over palette.'),
      include_palettes: z.boolean().optional().describe("List the icon's palette ids (colors.suggestions). Default: only for a palette style when no format is given"),
    },
    annotations: { title: 'Get icon code', ...ro },
  }, safe(a => {
    const { include_palettes: inc, ...rest } = a
    const pal = (d.meta.styles.find(s => s.name === (a.style || 'line')) || {}).palette
    return json(getIcon({ ...rest, includePalettes: inc !== undefined ? !!inc : !!(pal && !a.format) }))
  }))

  server.registerTool('list_styles', {
    title: 'List styles',
    description: `The ${styleNames.length} visual styles every icon is drawn in (${styleNames.join(', ')}), with what each looks like, minSize (the smallest px it reads well at: 16 for UI styles, 32 creative and palette, 48 studio and storybook) and onDark (how to use it on dark backgrounds); palette styles list their colour variables.`,
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
    description: 'Check whether a name or alias maps to exactly one icon. Returns the canonical name (status resolved), the ambiguous candidates, ' +
      'a match by meaning (status synonym: a word that is not a name or alias but means an icon, e.g. "favourites" -> star / heart, "orders" -> receipt; ' +
      'with candidates and a note; use the canonical name), or for unknown words the nearest names, didYouMean (a spelling correction) and a hint.',
    inputSchema: { name: z.string().min(1).describe('Name or alias to check') },
    annotations: { title: 'Resolve icon name', ...ro },
  }, safe(a => json(resolveIcon(a.name))))

  server.registerTool('list_palettes', {
    title: 'List colour palettes',
    description: 'The 20-30 colour palettes picked for one icon (true-to-life first, then moods: pastel, neon, retro, earthy, luxe, ...), each with its ten role colours ' +
      '(ink, c1-c4, tint, accent, shadow, shine, edge). With a style, every palette also lists the exact CSS variables it sets on that icon in that style, the icon variables with their roles and defaults, and mainRole: the role that covers most of the icon body (e.g. c2): set that one for a brand colour. ' +
      'Multi-colour styles: glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush, plus the duo and blueprint accents (one-colour styles only take the ink). Apply one with get_icon(name, style, format, palette: "<id>").',
    inputSchema: {
      name: z.string().min(1).describe('Icon name or alias'),
      style: z.enum(styleNames).optional().describe('Style to map the palettes onto (e.g. kawaii, sticker, retro)'),
      tag: z.string().max(30).optional().describe('Only palettes with this tag (true-to-life, pastel, vivid, neon, earthy, retro, vintage, mono, grayscale, dark, on-dark, luxe, seasonal, nature, ocean, sunset, candy, accessible, corporate, y2k)'),
      limit: z.number().int().min(1).max(30).optional().describe('Max palettes (default all)'),
    },
    annotations: { title: 'List colour palettes', ...ro },
  }, safe(a => json(listPalettes(a))))

  const mo = motionData()
  server.registerTool('animate_icon', {
    title: 'Animate icon',
    description: 'Paste-ready animation code for an icon, using the optional @withicons/motion package (CSS, works with every style and package). ' +
      'trigger: loop = continuous (spinner, ringing bell), hover = one-shot on hover/focus (or of a .wm-trigger button), once = plays on load, inview = plays when scrolled into view, ' +
      'swap = the icon turns into another one (play -> pause, menu -> close, heart -> heart@solid). Icons with a tuned motion use it by default; preset overrides it. ' +
      'The result has intent (what the motion shows), alternates (other tuned presets of this icon, e.g. a livelier one for a title slide) and lively (the most energetic presets); pass one as preset. ' +
      `${Object.keys(mo.icons).length} icons have tuned motion. ` +
      'For a moving icon as a FILE (slides, docs, email, social) use export_icon with format gif, apng, animated-svg, pptx-animated or lottie and the same motion (motion: "loop", "hover", "swap" or a preset).',
    inputSchema: {
      name: z.string().min(1).describe('Icon name or alias'),
      trigger: z.enum(TRIGGERS).optional().describe('loop (default), hover, once, inview or swap'),
      preset: z.enum(mo.presets).optional().describe('Override the motion (e.g. spin, ring, beat, float, bounce, pop)'),
      to: z.string().max(60).optional().describe('swap only: target icon, "name" or "name@style" (default: the icon\'s suggested swap)'),
      effect: z.enum(mo.effects).optional().describe('swap only: transition (default from the spec, else fade)'),
      style: z.enum(styleNames).optional().describe('Icon style (default line)'),
      format: z.enum(MOTION_FORMATS).optional().describe('Code format (default html)'),
      duration: z.number().min(0.2).max(10).optional().describe('Seconds per cycle'),
    },
    annotations: { title: 'Animate icon', ...ro },
  }, safe(a => {
    const r = animateIcon(a)
    r.files = { tool: 'export_icon', formats: ['gif', 'apng', 'animated-svg', 'pptx-animated', 'lottie', 'dotlottie'],
      example: { name: r.name, style: r.style, format: 'gif', motion: a.trigger === 'swap' ? 'swap' : (a.preset || (a.trigger && a.trigger !== 'inview' ? a.trigger : 'loop')), ...(a.trigger === 'swap' && r.to ? { to: r.to } : {}), background: '#ffffff' } }
    return json(r)
  }))

  const colorShape = z.object(Object.fromEntries(PALETTE_ROLES.map(r => [r, z.string().max(40).optional()]))).catchall(z.string().max(40))
  server.registerTool('export_icon', {
    title: 'Export icon files',
    description: 'Make icon FILES (not code) for slides, documents, design tools, apps and social posts. ' +
      'Animated: gif (plays everywhere; set background to the slide colour), apng, animated-svg, pptx-animated (a ready 16:9 slide), lottie / dotlottie; motion picks the movement. ' +
      'Still: svg, svg-flat (colours baked in), pdf, eps, png, png-set, ico, favicon-pack, android, ios, pptx, pptx-sheet (every style), docx, and code (jsx, tsx, vue, svelte, html, css, data-uri ...). ' +
      (remote
        ? 'This remote server makes the vector, code and Lottie formats; for png-based and animated formats it returns the exact `npx withicons export …` command to run. ' +
          'Large exports come in pages: when the result has next ({ cursor, remaining }), call again with the same arguments plus cursor; plain svg-flat files then come back as urls[] to the prebuilt @withicons/static SVGs on jsDelivr. '
        : 'Files are saved to out_dir when given and returned inline when small. ') +
      'Colours are baked in: set palette / colors / color here. Several icons: names: ["home", "settings"], or a map { "receipt": "orders" } to name each file; icons without the palette borrow it from the first that has it (strict_palette: true fails instead). ' +
      'File names default to <name>-<style>[-<variant>].<ext>; filename takes a template ({name} {style} {format} {variant} {default}) or an exact name.',
    inputSchema: {
      name: z.string().min(1).optional().describe('Icon name or alias'),
      names: z.union([z.array(z.string().min(1)).max(50), z.record(z.string().min(1), z.string().min(1).max(120))]).optional()
        .describe('List, or map icon -> file base name'),
      style: z.enum(styleNames).optional().describe('Style (default line)'),
      format: z.string().max(200).optional().describe('One format or a comma list (see the tool description)'),
      filename: z.string().max(120).optional().describe('Template or exact name; extension added'),
      all_styles: z.boolean().optional().describe('One file per style'),
      size: z.number().int().min(8).max(2048).optional().describe('Pixels (animated formats up to 2048)'),
      background: z.string().max(40).optional().describe('Background colour (default transparent)'),
      matte: z.string().max(40).optional().describe('gif: edge colour to blend with, kept transparent'),
      palette: z.string().max(60).optional().describe('Palette id (list_palettes)'),
      strict_palette: z.boolean().optional().describe('Fail when an icon lacks the palette'),
      colors: colorShape.optional().describe('Role -> colour (ink, c1-c4, tint, accent, shadow, shine, edge)'),
      color: z.string().max(40).optional().describe('Ink colour (currentColor)'),
      motion: z.string().max(40).optional().describe('loop (default), hover, once, swap, none or a preset'),
      to: z.string().max(60).optional().describe('swap target, "name" or "name@style"'),
      effect: z.enum(mo.effects).optional().describe('swap transition'),
      hold: z.number().min(0).max(10).optional().describe('swap: seconds to rest on each icon'),
      duration: z.number().min(0.2).max(10).optional().describe('Seconds per motion cycle'),
      fps: z.number().int().min(1).max(60).optional().describe('gif / apng frames per second'),
      seconds: z.number().min(0.1).max(30).optional().describe('gif / apng loop length in seconds'),
      loop: z.number().int().min(0).max(100).optional().describe('gif / apng plays: 0 = forever'),
      padding: z.number().min(0).max(0.6).optional().describe('Space around the icon, share of its size'),
      stroke_width: z.number().min(0.25).max(4).optional().describe('Outline styles: stroke width (default 1.75)'),
      ...(remote ? {
        cursor: z.number().int().min(0).optional().describe('next.cursor of the previous page (same arguments)'),
      } : {
        out_dir: z.string().max(500).optional().describe('Folder to save the files in'),
        inline: z.boolean().optional().describe('Also return files inline'),
      }),
    },
    annotations: { title: 'Export icon files', readOnlyHint: remote, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, safe(a => exportIcon(a, { remote })))

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
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ ...info(), styles: listStyles(), categories: listCategories().categories, motion: listMotion() }, null, 2) }] }))

  return server
}
