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

const json = v => ({ content: [{ type: 'text', text: JSON.stringify(v, null, 2) }], structuredContent: v })
const fail = e => {
  if (e instanceof IconError) { const { message, name, stack, ...rest } = e; return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: e.message, ...rest }, null, 2) }] } }
  return { isError: true, content: [{ type: 'text', text: `Error: ${e && e.message ? e.message : String(e)}` }] }
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
    description: `Get one icon as paste-ready code. Accepts a canonical name or an alias ("delete" -> trash). Formats: ${FORMATS.join(', ')}. The result also says whether the icon has a tuned animation (motion) for animate_icon.`,
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
    },
    annotations: { title: 'Get icon code', ...ro },
  }, safe(a => json(getIcon(a))))

  server.registerTool('list_styles', {
    title: 'List styles',
    description: `The ${styleNames.length} visual styles every icon is drawn in (${styleNames.join(', ')}), with what each looks like; palette styles list their colour variables.`,
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

  server.registerTool('list_palettes', {
    title: 'List colour palettes',
    description: 'The 20-30 colour palettes picked for one icon (true-to-life first, then moods: pastel, neon, retro, earthy, luxe, ...), each with its ten role colours ' +
      '(ink, c1-c4, tint, accent, shadow, shine, edge). With a style, every palette also lists the exact CSS variables it sets on that icon in that style, and the icon variables with their roles and defaults. ' +
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
    description: 'Make icon FILES (not code): for slides, documents, design tools, apps and social posts. ' +
      'Animated (for PowerPoint, Keynote, Google Slides, email, chat): gif (plays everywhere; set background to the slide colour), apng (smooth see-through edges, web), ' +
      'animated-svg (one small file, browsers), pptx-animated (a ready 16:9 slide with the moving GIF), lottie / dotlottie (apps, After Effects, Canva). ' +
      'Still: svg, svg-flat (colours baked in), pdf, eps, png, png-set, ico, favicon-pack, android, ios, pptx, pptx-sheet (every style), docx, and code (jsx, tsx, vue, svelte, react-native, angular, html, css, data-uri, base64). ' +
      (remote
        ? 'This remote server makes the vector, code and Lottie formats inline; for png-based and animated formats it returns the exact `npx withicons export …` command to run in a terminal, plus the icon page. '
        : 'Files are saved to out_dir when given (absolute or relative to the working directory) and returned inline when small (images as image content, text as text). ') +
      'Colours are baked into raster and animated files: choose palette / colors / color here, they cannot be changed afterwards.',
    inputSchema: {
      name: z.string().min(1).describe('Icon name or alias'),
      style: z.enum(styleNames).optional().describe('Style (default line)'),
      format: z.string().max(200).optional().describe(`One format or a comma list (default svg): ${EXPORT_FORMATS.join(', ')}`),
      all_styles: z.boolean().optional().describe('One file per style (every style)'),
      size: z.number().int().min(8).max(2048).optional().describe('Pixels (png 512, gif / apng / animated-svg 256, pptx-animated 480, svg 24); animated formats max 1024'),
      background: z.string().max(40).optional().describe('Solid background (hex), e.g. the slide colour "#ffffff"; default transparent'),
      matte: z.string().max(40).optional().describe('gif only: keep it transparent but blend the soft edges with this colour (the colour it will sit on)'),
      palette: z.string().max(60).optional().describe('Colour palette id (list_palettes)'),
      colors: colorShape.optional().describe('Colour roles -> "#hex" (ink, c1-c4, tint, accent, shadow, shine, edge)'),
      color: z.string().max(40).optional().describe('The ink colour (currentColor)'),
      motion: z.string().max(40).optional().describe('Animated formats: loop (default: the icon\'s tuned motion), hover / once (plays once, then rests), swap (turns into another icon), none, or a preset (spin, ring, beat, bounce, float, pop, ...)'),
      to: z.string().max(60).optional().describe('motion swap: the icon to turn into, "name" or "name@style" (default: the icon\'s suggestion)'),
      effect: z.enum(mo.effects).optional().describe('motion swap: transition (fade, flip, scale, morph, ...)'),
      hold: z.number().min(0).max(10).optional().describe('motion swap: seconds to rest on each icon between turns (same as the CLI --hold)'),
      duration: z.number().min(0.2).max(10).optional().describe('Seconds per motion cycle'),
      fps: z.number().int().min(1).max(60).optional().describe('gif / apng frames per second (gif 25, apng 30)'),
      seconds: z.number().min(0.1).max(30).optional().describe('gif / apng length of one loop (default: the motion cycle)'),
      loop: z.number().int().min(0).max(100).optional().describe('gif / apng: 0 = forever (default), n = play n times'),
      padding: z.number().min(0).max(0.4).optional().describe('Empty space around the icon, as a share of its size'),
      ...(remote ? {} : {
        out_dir: z.string().max(500).optional().describe('Folder to save the files in (created if needed). Without it, files come back inline only.'),
        inline: z.boolean().optional().describe('Also return the files inline (default: only when out_dir is not given)'),
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
