import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, doDont, code, steps, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'optimize-svg-icons-svgo',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-optimize-svg-icons-svgo',
  stickers: [['package', 'duo'], ['gauge', 'blueprint'], ['check-circle', 'solid']],
  title: 'How do I optimise SVG icons with SVGO without breaking them?',
  cardTitle: 'Optimise SVG icons with SVGO',
  h1: 'How to optimise SVG icons <em>without breaking them</em>',
  dek: 'SVGO 4 changed the defaults that broke icons for a decade. Here is what it does now, the few settings that still wreck icons and sprites, a tested config, and the no-code way with SVGOMG.',
  description: 'Optimise SVG icons safely with SVGO 4: what changed in June 2025, the settings that still break icons and sprites, a tested config, and SVGOMG for non-coders.',
  keywords: ['svgo', 'svgo config', 'optimize svg icons', 'svgo removes viewbox', 'svgo removeViewBox', 'svgo 4', 'svgomg', 'svgo sprite', 'svgo prefixIds', 'svgo cleanupIds gradient', 'minify svg icons', 'how small should an svg icon be'],
  about: ['SVGO', 'SVGOMG', 'Scalable Vector Graphics', 'Minification', 'with icons'],
  related: ['svg-icon-cut-off-or-blurry', 'svg-sprites', 'svg-vs-png-icons'],
  tldr: [
    '<strong>Use SVGO 4 with its default preset.</strong> Since 4.0.0 (21 June 2025) it no longer removes <code>viewBox</code> or <code>&lt;title&gt;</code>, the two defaults that broke icons for years. The current release is 4.1.0 (August 2026).',
    '<strong>Add three tweaks for icons:</strong> keep <code>role</code> attributes, add <code>prefixIds</code> (with class names left alone) so gradient ids never clash, and turn off <code>mergePaths</code> if you animate or colour parts separately.',
    '<strong>Never run the default preset over a sprite file.</strong> In our test with SVGO 4.1.0 it deleted every symbol. Turn off <code>cleanupIds</code> and <code>removeHiddenElems</code> for sprites.',
    'Do not switch on <code>removeViewBox</code>, <code>removeDimensions</code> or <code>convertColors</code> with <code>currentColor: true</code> for multi-colour icons, and keep number precision at 2 or 3 on a 24 grid.',
    '<strong>No code?</strong> SVGOMG runs the same engine in your browser. A simple 24 px outline icon should end up at a few hundred bytes.',
  ],
  faq: [
    { q: 'Does SVGO remove viewBox?', a: 'Not by default since SVGO 4.0.0 (21 June 2025). The <code>removeViewBox</code> plugin still exists, and SVGO 2 and 3 enable it in their default preset, so older build plugins and configs pinned to them still strip it. Check with <code>npx svgo --version</code>, and leave the plugin off for icons.' },
    { q: 'What is a safe SVGO config for icons?', a: 'SVGO 4’s <code>preset-default</code> with <code>removeUnknownsAndDefaults: { keepRoleAttr: true }</code>, <code>mergePaths: false</code> if you animate parts, <code>floatPrecision: 2</code>, and the <code>prefixIds</code> plugin with <code>prefixClassNames: false</code>. For sprite files also set <code>cleanupIds</code> and <code>removeHiddenElems</code> to false.' },
    { q: 'Why did SVGO break my SVG sprite?', a: 'Because a sprite’s symbols are used from other pages, so inside the sprite file they look unused. The default <code>cleanupIds</code> plugin strips ids that nothing in the file points to, and <code>removeHiddenElems</code> removes symbols that nothing in the file uses. In our test with SVGO 4.1.0, either one was enough to empty the sprite. Turn both off for sprite files.' },
    { q: 'Why do my gradients break after SVGO?', a: 'The default <code>cleanupIds</code> shortens ids to <code>a</code>, <code>b</code>, <code>c</code>. Two optimised icons inlined on one page can then both have a gradient called <code>a</code>, and the second picks up the first one’s colours. SVGO’s docs suggest the <code>prefixIds</code> plugin or turning off <code>minify</code>.' },
    { q: 'Is SVGOMG still safe to use?', a: 'Yes. SVGOMG is a free web app by Jake Archibald that runs SVGO in your browser, and it moved to SVGO 4 in 2025. “Remove viewBox”, “Remove &lt;title&gt;” and “Prefer viewBox to width/height” are off by default. Keep them off for icons and leave Number precision at 2 or 3.' },
    { q: 'How small should an SVG icon be?', a: 'For a simple one-colour outline icon on a 24 grid, a few hundred bytes: with icons line icons have a median of 429 bytes. Filled icons with cut-outs run to 1 or 2 KB, and multi-colour icons with gradients to several kilobytes. A simple outline icon over about 2 KB usually carries editor metadata, an embedded image or long decimals.' },
  ],
  sources: [
    { title: 'SVGO v4.0.0 release notes (21 June 2025)', url: 'https://github.com/svg/svgo/releases/tag/v4.0.0' },
    { title: 'SVGO v4.1.0 release notes (24 August 2026)', url: 'https://github.com/svg/svgo/releases/tag/v4.1.0' },
    { title: 'SVGO docs: migration from v3 to v4, checked November 2026', url: 'https://svgo.dev/docs/migrations/migration-from-v3-to-v4/' },
    { title: 'SVGO docs: preset-default plugin list, checked November 2026', url: 'https://svgo.dev/docs/preset-default/' },
    { title: 'SVGO docs: removeViewBox (“prevents SVGs from scaling”)', url: 'https://svgo.dev/docs/plugins/removeViewBox/' },
    { title: 'SVGO docs: cleanupIds (problems when inlining multiple SVGs)', url: 'https://svgo.dev/docs/plugins/cleanupIds/' },
    { title: 'SVGO docs: prefixIds', url: 'https://svgo.dev/docs/plugins/prefixIds/' },
    { title: 'SVGO README: configuration and preset overrides', url: 'https://github.com/svg/svgo#configuration' },
    { title: 'SVGO issue 1126: removeViewBox discussion (2019)', url: 'https://github.com/svg/svgo/issues/1126' },
    { title: 'SVGOMG by Jake Archibald (SVGO 4, default settings in src/config.json), checked November 2026', url: 'https://github.com/jakearchibald/svgomg' },
    { title: 'npm: svgo versions and release dates, checked November 2026', url: 'https://www.npmjs.com/package/svgo' },
  ],
  body: () => `
${p(`<span class="lede">To optimise SVG icons without breaking them, run SVGO 4 with its default preset: since version 4.0.0 (21 June 2025) it keeps the <code>viewBox</code> and <code>&lt;title&gt;</code> that older versions stripped. Then add three small tweaks for icons (keep <code>role</code>, prefix ids, and stop path merging if you animate parts), keep number precision at 2 or 3, and never run the default preset over a sprite file, which in our test deleted every icon in it.</span>`)}
${p(`SVGO (SVG Optimizer) is a free Node.js tool that tidies SVG files: it strips editor leftovers, rounds long numbers and rewrites shapes more compactly. Most build tools that “optimise SVG” use it under the hood. Below: what it does, what changed in version 4, which settings still hurt icons, a config we tested on real icons, and how small an icon should be. Not a developer? Skip to the SVGOMG section. Still deciding on a format? Start with ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`)}

${callout('note', `<p>For about ten years SVGO’s default preset removed <code>viewBox</code> (so icons stopped scaling) and <code>&lt;title&gt;</code> (so they lost their accessible name). Most tutorials, including many from 2024, were written against those defaults and tell you to switch “Remove viewBox” off. SVGO 4.0.0 on 21 June 2025 made that the default. Old configs and build plugins still pinned to SVGO 2 or 3 strip them, so check your version.</p>`, 'What changed since the old answers')}

${h2('What does SVGO actually do to an icon?')}
${p('Design tools save more than the drawing: comments, editor data, empty groups, hidden layers and coordinates with eight decimals. SVGO runs a list of plugins (its default preset has about 30) that remove those extras and rewrite what is left in fewer characters. The drawing should look identical.')}
${art('m-optimize-svg-icons-svgo-before-after', 'Before and after: the same icon with editor extras, and after SVGO, a fraction of the size and pixel-identical.', { brief: 'Split code-card comparison. Left card "Before": a bloated SVG listing for the line "bell" icon with XML declaration, a comment, metadata, an empty group, ids like Layer_1 and long decimals, highlighted in soft red, with a size badge. Right card "After SVGO": the clean one-line version with viewBox, currentColor and short path data, highlighted in green, with a much smaller size badge. Between them, the rendered bell at 48 px on both sides to show they look the same.' })}
${p('How much it saves depends on how messy the input is. Files straight from a design tool often shrink a lot. Files that were generated cleanly shrink less: we ran every with icons file in five styles through SVGO 4.1.0 with the config below. The median line icon got 8% smaller, duo 12%, glass 9%, sticker 18% and solid 30% (its cut-out shapes carry longer numbers).')}

${h2('What changed in SVGO 4?')}
${table(['Change', 'What it means for icons'], [
  ['<code>removeViewBox</code> no longer in the default preset', yes('Icons keep scaling. Do not turn it back on')],
  ['<code>removeTitle</code> no longer in the default preset', yes('Icons keep their accessible name')],
  ['<code>removeScriptElement</code> renamed <code>removeScripts</code>', meh('Update old configs; it also strips event handlers and script links')],
  ['<code>convertColors</code> lowercases colours', yes('It leaves <code>currentColor</code> and <code>var(…)</code> alone')],
  ['Named exports only, Node.js 16 or newer', meh('<code>import { optimize } from \'svgo\'</code> in scripts')],
], 'SVGO 4.0.0 changes that matter for icons (release notes, 21 June 2025)')}
${p('Version 4.1.0 (24 August 2026) added stricter checks on malformed XML and hardened <code>removeScripts</code>. Neither changes how a normal icon looks.')}

${h2('Which SVGO settings break icons?')}
${p('We tested each of these on real icons with SVGO 4.1.0. Most are opt-in, so you only hit them if a tutorial told you to switch them on. Two are in the default preset and only bite in specific cases.')}
${table(['Setting', 'What goes wrong', 'In SVGO 4 defaults?'], [
  ['<code>removeViewBox</code>', 'The icon cannot scale; resizing crops it or leaves it tiny', no('Off (on in v3 and earlier)')],
  ['<code>removeDimensions</code>', 'Drops width and height, so icons balloon when CSS is missing', no('Off')],
  ['<code>cleanupIds</code> on inlined icons', 'Gradient ids become <code>a</code>, <code>b</code>; two icons on one page clash', meh('On')],
  ['<code>cleanupIds</code> or <code>removeHiddenElems</code> on a sprite', 'Symbols look unused inside the file and are deleted: either plugin emptied our test sprite', meh('On')],
  ['<code>mergePaths</code>', 'Joins separate plain paths into one, so per-part animation or styling stops working', meh('On')],
  ['<code>removeUnknownsAndDefaults</code>', 'Removes <code>role="img"</code> unless <code>keepRoleAttr</code> is on', meh('On')],
  ['<code>convertColors</code> with <code>currentColor: true</code>', 'Every colour becomes one; a two-tone icon turns flat', no('Off')],
  ['<code>floatPrecision</code> 0 or 1', 'At 0, curves visibly drift on a 24 grid', no('Default is 3')],
  ['<code>prefixIds</code> defaults', 'Also renames class names, breaking CSS that targets them', no('Opt-in')],
], 'Settings that hurt icons, tested with SVGO 4.1.0 (November 2026)')}
${art('m-optimize-svg-icons-svgo-what-breaks', 'Four ways an over-eager optimiser breaks icons.', { brief: 'Four-tile do/don’t grid, each tile a before (green check) and after (red cross) pair. Tile 1 "removeViewBox": the line "home" icon scaled properly vs stuck small in a corner. Tile 2 "convertColors currentColor": the duo "home" icon with navy outline and amber accent vs everything one flat navy. Tile 3 "cleanupIds on a sprite": a sprite card listing symbols vs an empty card. Tile 4 "precision 0": a smooth "bell" outline vs one with wobbly curves. Short plugin names as labels.' })}
${h3('What about outlined strokes?')}
${p('One more way to collapse an icon happens before SVGO: a design tool’s “outline stroke” or “flatten” command turns each line into a filled shape. The icon looks the same, but stroke-width props, <code>vector-effect: non-scaling-stroke</code> and stroke animations stop working, and the file usually grows. Keep line icons as live strokes.')}
${sizeRamp(['bell', 'settings', 'heart'], [16, 24, 32, 48], 'line', 'Live strokes: the same 1.75-unit line scales cleanly, and a stroke-width prop can still change it.')}

${h2('What is a safe SVGO config for icons?')}
${p('This is the config we tested on with icons files. It keeps the default preset (which already keeps viewBox and title in SVGO 4) and adds only what icons need.')}
${code(`// svgo.config.mjs (SVGO 4.x): icon files
export default {
  multipass: true,
  floatPrecision: 2,          // plenty for a 24-unit grid
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeUnknownsAndDefaults: { keepRoleAttr: true }, // keep role="img"
          mergePaths: false,  // keep parts you animate or colour separately
        },
      },
    },
    // unique gradient ids per file (from the file name), class names untouched
    { name: 'prefixIds', params: { prefixClassNames: false } },
  ],
}`, 'js')}
${p('Run it over a folder with <code>npx svgo -f icons -o icons-min</code>. For a <strong>sprite</strong> file, use a separate config that protects symbols:')}
${code(`// svgo.sprite.config.mjs: sprite files full of <symbol id="…">
export default {
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { cleanupIds: false, removeHiddenElems: false, mergePaths: false } },
    },
  ],
}`, 'js')}
${steps([
  ['Check your version', 'Run <code>npx svgo --version</code>. Below 4, upgrade or turn <code>removeViewBox</code> off explicitly.'],
  ['Optimise the single icons', 'Use the icon config. Look at a few results in a browser at 16, 24 and 48 px.'],
  ['Build the sprite after', 'Combine the optimised icons into symbols, then run the sprite config (or nothing) on the sprite.'],
  ['Compare before you ship', `Open an icon page that uses gradients or several colours and check nothing changed. Our ${L.post('svg-sprites', 'guide to SVG sprites')} covers the sprite side.`],
])}

${h2('How do I optimise SVGs without code? (SVGOMG)')}
${p('SVGOMG is a free web app by Jake Archibald that runs SVGO in your browser. Drop in a file or paste code, flip toggles and watch the size change live. Its code moved to SVGO 4 in 2025, and the page now reports SVGO v4.')}
${art('m-optimize-svg-icons-svgo-svgomg', 'The toggles that matter for icons in a browser optimiser, and how to set them.', { brief: 'Clean settings-panel mockup (generic, no third-party logo or product name) with a live preview of the duo "home" icon at 96 px on the left and a list of switches on the right. Highlight in green the ones to keep OFF: "Remove viewBox", "Remove <title>", "Prefer viewBox to width/height". Show "Number precision" slider set to 2, and "Multipass" on. A size readout at the top: "1.2 KB to 0.4 KB". Small annotation arrows with short labels.' })}
${ul([
  '<strong>Keep off:</strong> Remove viewBox, Remove &lt;title&gt; and Prefer viewBox to width/height. All three are off by default now.',
  '<strong>Number precision:</strong> 2 or 3 for icons on a 24 grid (3 is the default). Slide down while watching the preview; stop before curves move.',
  '<strong>Multipass:</strong> on. It reruns the plugins until nothing changes.',
  '<strong>Compare gzipped:</strong> on, to see the size that will actually travel over the network.',
  '<strong>Sprites:</strong> switch off Clean up IDs and Remove hidden elements before you optimise a sprite file.',
])}

${h2('How small should an SVG icon be?')}
${p(`A simple one-colour outline icon on a 24 grid should be a few hundred bytes. For reference, we measured every file in five with icons styles. The middle ${L.style('line')} icon is 429 bytes, and styles with gradients such as ${L.style('glass')} run to several kilobytes. If a simple outline icon is over about 2 KB, look for an embedded bitmap, editor metadata or coordinates with many decimals.`)}
${table(['Kind of icon', 'with icons style', 'Middle size', 'Most icons (10th to 90th percentile)'], [
  ['One-colour outline', 'line', '429 bytes', '0.3 to 0.7 KB'],
  ['Outline plus a soft tint', 'duo', '675 bytes', '0.4 to 1.3 KB'],
  ['Filled with cut-outs', 'solid', '1.4 KB', '0.8 to 2.3 KB'],
  ['Multi-colour, flat', 'sticker', '2.4 KB', '1.8 to 3.3 KB'],
  ['Multi-colour with gradients', 'glass', '4.9 KB', '2.9 to 7.9 KB'],
], 'Standalone SVG file sizes before compression (our measurements of every file in each style, November 2026)')}
${iconGrid(['home', 'search', 'bell', 'mail', 'heart', 'settings'], 'line', 'Line icons like these are a few hundred bytes each as SVG files.')}
${doDont('<p>Optimise once at build time, keep viewBox, width, height and title, check results at real sizes, and compress the files on your server (gzip or Brotli).</p>', '<p>Copy a 2019 config that enables <code>removeViewBox</code>, run the default preset over a sprite, or drop precision to 0 to win a few bytes.</p>')}

${h2('Do I need to optimise with icons files?')}
${p(`You do not have to. Every one of the ${N_ICONS} icons in all ${N_STYLES} styles is generated with a proper viewBox, <code>currentColor</code>, no editor leftovers and, for gradient styles, ids that are unique per icon. SVGO still finds savings, most in the solid style (about 30% at the median), so it is worth running if you ship many files. Use the config above: <code>prefixClassNames: false</code> keeps the class names our motion package animates. Get the files from any icon page, the ${L.page('free/svg-icons.html', 'free SVG icons page')}, or the ${L.page('developers.html', 'developer packages')}, and read ${L.post('svg-icon-cut-off-or-blurry', 'why icons get cut off or blurry')} if something looks wrong after optimising.`)}

${h2('The bottom line')}
${p(`In 2026, SVGO’s defaults are finally safe for icons. Upgrade to version 4, add <code>keepRoleAttr</code> and <code>prefixIds</code>, turn off <code>mergePaths</code> if you animate parts, and give sprites their own config. If you would rather click than code, SVGOMG does the same in your browser. Or start from icons that need none of it: browse ${L.icons('the icon library')}.`)}
${cta('Icons that are already clean', `${N_ICONS} icons in ${N_STYLES} styles with a proper viewBox, currentColor and tidy path data. Copy, download or install. Free, MIT licensed.`, ['package', 'gauge', 'code', 'check-circle', 'sparkles', 'heart'])}
`,
}
