// emit-static — @withicons/static: SVG sprites (one per style), standalone SVG files and metadata.
//   dist/sprite-<style>.svg        <symbol id="with-<name>">
//   dist/svg/<style>/<name>.svg    standalone files (jsDelivr-friendly)
//   dist/icons.json                metadata
import { distWriter, basePkg, writePkg, innerOf, flattenVars, countText, totalText, paletteDoc, rtlDoc, motionDoc } from './emit-core.mjs'

const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const attrs = o => Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')

export default async function emit(ctx) {
  const P = 'packages/static'
  const out = distWriter(ctx, P + '/dist')
  const styleNames = ctx.styles.map(s => s.name)
  let svgs = 0
  const sizes = {}
  const fileSizes = []   // standalone files of the default style, for the README
  for (const st of ctx.styles) {
    const symbols = []
    for (const i of ctx.icons) {
      symbols.push(`<symbol id="with-${i.name}" viewBox="0 0 24 24"${attrs(st.root)}>${innerOf(ctx, i, st.name)}</symbol>`)
      // standalone files: CSS variables flattened to their defaults (<img>, design tools and rasterizers have no cascade);
      // the sprite keeps them, so <use> icons can be re-themed from the page
      if (i.render[st.name]) {
        const t = flattenVars(i.render[st.name].svg) + '\n'
        out.add(`svg/${st.name}/${i.name}.svg`, t); svgs++
        if (st.name === ctx.defaultStyle) fileSizes.push(Buffer.byteLength(t))
      }
    }
    const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>\n`
    sizes[st.name] = Math.round(Buffer.byteLength(sprite) / 1024)
    out.add(`sprite-${st.name}.svg`, sprite)
  }
  const meta = ctx.icons.map(i => ({ name: i.name, category: i.category, description: i.description, aliases: i.aliases, tags: i.tags, styles: styleNames.filter(s => i.render[s]) }))
  out.add('icons.json', JSON.stringify(meta, null, 1) + '\n')
  await out.flush()

  const pkg = {
    ...basePkg(ctx, '@withicons/static', `${countText(ctx)} as SVG sprites and standalone SVG files. No JavaScript.`, ['svg-sprite', 'static', 'cdn', 'svg-icons', 'multicolor-icons', ...styleNames]),
    sideEffects: false,
    files: ['dist', 'README.md', 'LICENSE'],
  }
  sizes.file = fileSizes.sort((a, b) => a - b)[fileSizes.length >> 1] || 0
  writePkg(ctx, 'static', pkg, readme(ctx, sizes))
  return `${styleNames.length} sprites, ${svgs} svgs`
}

function readme(ctx, sizes) {
  const v = ctx.version
  return `# @withicons/static

${countText(ctx)} (${totalText(ctx)} SVGs) as plain SVG: one sprite per style plus standalone files. No JavaScript.

\`\`\`bash
npm i @withicons/static
\`\`\`

## Single SVGs (CDN): only the icons you use

Each icon in each style is its own file, so a page downloads exactly the icons it shows (a \`${ctx.defaultStyle}\` icon is
typically ${sizes.file} bytes):

\`\`\`html
<img src="https://cdn.jsdelivr.net/npm/@withicons/static@latest/dist/svg/line/home.svg" width="24" height="24" alt="Home">
\`\`\`

\`https://cdn.jsdelivr.net/npm/@withicons/static@latest/dist/svg/<style>/<name>.svg\`. \`@latest\` always serves the newest release; for a
fixed look, put a version number in its place (e.g. \`@${v}\`). For icons that follow your text colour, use \`<with-icon>\` from \`@withicons/web\` (\`dist/cdn.js\`, which
also fetches one small file per icon) or inline the SVG.

## Sprite

A sprite holds every icon of a style (sizes below), so use one when a page shows many icons of the same style and you
serve it yourself. Serve \`node_modules/@withicons/static/dist/sprite-line.svg\` from your own origin, then:

\`\`\`html
<svg width="24" height="24"><use href="sprite-line.svg#with-home"/></svg>
<svg width="24" height="24" style="color:#e11d48"><use href="sprite-solid.svg#with-home"/></svg>
\`\`\`

- Symbol ids are \`with-<name>\`. Icons use \`currentColor\`, so set \`color\` on the outer \`<svg>\` (or any parent).
- Browsers block \`<use>\` of a sprite on another origin, so copy the sprite next to your pages (or inline it in the HTML with \`style="display:none"\`).
- One sprite per style: ${ctx.styles.map(s => `\`sprite-${s.name}.svg\` (~${sizes[s.name]} KB)`).join(', ')}.

## Notes on single files

(An \`<img>\` cannot inherit \`currentColor\`; its ink renders black. Inline the SVG or use the sprite to recolour.
Standalone files have CSS variables flattened to their default colours, so palette styles look right in \`<img>\`,
Figma, PowerPoint, Keynote and rasterizers such as sharp or resvg.)

## Styles

${ctx.styles.map(s => `- \`${s.name}\` (${s.kind}${s.palette ? ', palette' : ''}) — ${s.description}`).join('\n')}
${paletteDoc(ctx)}${rtlDoc('html', '<svg class="with-rtl" width="24" height="24"><use href="sprite-line.svg#with-arrow-right"/></svg>')}${motionDoc(ctx)}
\`dist/icons.json\` lists every icon's name, category, description, aliases, tags and styles.

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}
