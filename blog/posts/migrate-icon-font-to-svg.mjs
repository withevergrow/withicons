import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'migrate-icon-font-to-svg',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-migrate-icon-font-to-svg',
  stickers: [['type', 'solid'], ['replace', 'duo'], ['check-circle', 'sketch']],
  title: 'How do I migrate from an icon font to SVG icons? A step-by-step plan',
  cardTitle: 'Migrate from an icon font to SVG',
  h1: 'How to move from an icon font to <em>SVG icons</em>, step by step',
  dek: 'You do not need FontForge scripts or Batik. List the icons you use, map their names, swap the markup with components, a sprite or drop-in CSS classes, then test. Here is the whole plan.',
  description: 'Migrate from an icon font to SVG step by step: list your icon classes, map names, swap in components, sprites or drop-in CSS classes, then test it all.',
  keywords: ['migrate icon font to svg', 'convert icon font to svg', 'replace font awesome font with svg', 'extract svg from icon font', 'icon font to svg migration', 'ttf woff to svg icons', 'icomoon fontello to svg', 'css icon classes'],
  about: ['Icon fonts', 'Scalable Vector Graphics', 'Font Awesome', 'FontForge', 'CSS masks', 'with icons'],
  related: ['icon-fonts-vs-svg', 'svg-sprites', 'icons-showing-as-squares'],
  tldr: [
    '<strong>Start with an inventory, not a converter.</strong> Search your code for the icon classes you really use. Most apps use dozens of icons, not the whole font.',
    '<strong>Check for real SVG sources first.</strong> Many font vendors ship them: the Font Awesome Free npm package has an <code>svgs/</code> folder next to its webfonts. Extract glyphs from a font file only for a custom font with no sources.',
    '<strong>Pick the replacement by stack:</strong> components in React, Vue or Svelte; a sprite for static sites; or drop-in CSS classes that keep <code>&lt;i class&gt;</code> markup and paint a real SVG through a CSS mask.',
    '<strong>Migrate one area at a time.</strong> The old font and the new SVG icons can live side by side, so nothing breaks halfway.',
    '<strong>Test before you delete the font:</strong> screenshots, labels on icon-only buttons, high-contrast mode, and a search for leftover classes.',
  ],
  faq: [
    { q: 'How do I convert an icon font to SVG?', a: 'First look for the original SVGs: icon sets usually publish them (Font Awesome Free includes an svgs folder, and IcoMoon or Fontello projects keep the files you uploaded). Only for a custom font with no sources, export each glyph with FontForge (its Python API has glyph.export("name.svg")), name the files from the font’s CSS map of class to code point, fix the viewBox to a square, and optimise the result.' },
    { q: 'Can I keep my &lt;i class="..."&gt; markup when moving to SVG?', a: 'Yes. CSS-class icon libraries let you keep the same kind of markup. With with icons you write &lt;i class="with with-home"&gt;&lt;/i&gt;, and a stylesheet paints a real SVG into the tag as a CSS mask, so it takes your text colour and size like a font did. You still change the class names, but not the HTML structure.' },
    { q: 'Do Font Awesome class names work with with icons?', a: 'Many do as aliases. In our name resolver, house, gear, magnifying-glass, xmark, circle-check, trash-can and envelope all map to a with icons icon (home, settings, search, close, check-circle, trash, mail). Some names are ambiguous (bars could be a menu or a bar chart) and some have no match, so check each name and switch to the canonical class in the end.' },
    { q: 'Is it legal to extract icons from a font?', a: 'It depends on the font’s licence. Font Awesome Free, for example, licenses its font files under the SIL OFL 1.1 and its SVG and JS icons under CC BY 4.0, which asks for credit. Read the licence before turning font glyphs into SVG files, and keep the credit the licence asks for.' },
    { q: 'How do I test an icon font migration?', a: 'Take before-and-after screenshots of key pages (a visual test tool such as Playwright’s toHaveScreenshot makes this repeatable), check that every icon-only button still has an accessible name, try Windows high-contrast mode, block web fonts to prove nothing depends on them, and search the code for leftover old class names.' },
  ],
  sources: [
    { title: 'Font Awesome Free 7.3.1 on jsDelivr: package contents (svgs, webfonts, css; checked November 2026)', url: 'https://www.jsdelivr.com/package/npm/@fortawesome/fontawesome-free' },
    { title: 'Font Awesome Free licence file (Icons CC BY 4.0, Fonts SIL OFL 1.1, Code MIT)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'Font Awesome docs: Web Fonts + CSS vs SVG + JS', url: 'https://docs.fontawesome.com/web/dig-deeper/webfont-vs-svg' },
    { title: 'FontForge docs: Python module (open, glyph.export, glyph.unicode)', url: 'https://fontforge.org/docs/scripting/python/fontforge.html' },
    { title: 'MDN: mask-image (Baseline, across browsers since December 2023)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image' },
    { title: 'Playwright docs: visual comparisons (toHaveScreenshot)', url: 'https://playwright.dev/docs/test-snapshots' },
    { title: 'with icons: @withicons/classes README (loader, modifiers, accessibility)', url: 'https://www.npmjs.com/package/@withicons/classes' },
    { title: 'with icons: withicons CLI (resolve, search, add)', url: 'https://www.npmjs.com/package/withicons' },
  ],
  body: () => `
${p(`<span class="lede">To move from an icon font to SVG, do not start by converting the font. List the icon classes your code actually uses, map each one to an SVG icon, then swap the markup one area at a time: components if you use React, Vue or Svelte, a sprite for static pages, or drop-in CSS classes if you want to keep your <code>&lt;i class&gt;</code> tags. Test with screenshots and a screen reader, and only then delete the font.</span>`)}
${p(`The old answers to this question are about FontForge’s legacy scripting language, Java’s Batik toolkit, or a Font Awesome 4 <code>.woff2</code>. They stop at “now you have SVG files” and skip the hard part: renaming, sizing and replacing hundreds of tags without breaking the site. This guide covers the whole job as of November 2026. If you are still deciding <em>whether</em> to move, our post on ${L.post('icon-fonts-vs-svg', 'icon fonts vs SVG')} explains the reasons; here we assume you have decided.`)}

${h2('Why are teams still moving off icon fonts?')}
${p('In one line each, because the full story is in the post linked above: fonts can fail to load or get blocked (and the icon turns into an empty box), they render like text so small icons can look soft, each icon is one colour, a page often downloads the whole set, and screen readers can trip over the hidden character. SVG fixes all five. If your icons are already showing as squares, our post on ' + L.post('icons-showing-as-squares', 'icons showing as squares') + ' helps you patch that first.')}
${callout('note', '<ul><li>CSS masks (<code>mask-image</code>) have worked in every major browser since December 2023, per MDN. That is what lets SVG icons keep the “just add a class” convenience of fonts, with no JavaScript.</li><li>Icon sets now ship SVG files next to their fonts, so for most teams there is nothing to extract.</li><li>Codemods and AI coding tools can do the find-and-replace; what they need from you is a clean name map.</li></ul>', 'What changed since the old answers')}

${h2('Step 1: How do I find every icon my site uses?')}
${p('Search the code, not the font. A font may hold a thousand glyphs while your app uses forty. For Font Awesome-style classes, one search command lists every distinct name with a count:')}
${code(`# every fa-* class in your source, most used first
grep -rhoE "fa-[a-z0-9-]+" src templates | sort | uniq -c | sort -rn`, 'bash')}
${p('Remove the modifier classes from that list (<code>fa-solid</code>, <code>fa-2x</code>, <code>fa-spin</code>, <code>fa-fw</code>) and you have your real icon list. Also look in places a code search misses: CMS content and database fields, email templates, and CSS that sets <code>content: "\\f015"</code> on a pseudo-element. Material Icons is different again: the icon is the word inside the tag (<code>&lt;span class="material-icons"&gt;home&lt;/span&gt;</code>), so search for the class and read the text.')}

${h2('Step 2: Do I have to extract SVGs from the font file?')}
${p('Usually not. Look for the original SVGs first:')}
${ul([
  '<strong>Font Awesome:</strong> the free npm package (<code>@fortawesome/fontawesome-free</code>, version 7.3.1 in November 2026) ships an <code>svgs/</code> folder with every free icon as a file, beside <code>webfonts/</code>.',
  '<strong>IcoMoon or Fontello:</strong> these tools build fonts from SVGs you uploaded or picked, so the project file or the original SVGs are the source.',
  '<strong>A font your team made long ago:</strong> ask the designer. The SVGs often still exist somewhere.',
])}
${p('Only if there truly are no sources do you extract. FontForge can do it in a short Python script: <code>fontforge.open()</code> the font, loop over the glyphs, and call <code>glyph.export("name.svg")</code>. Each glyph knows its code point (<code>glyph.unicode</code>), and the font’s CSS tells you which class uses which code point. Font Awesome 7 writes it as <code>.fa-house { --fa: "\\f015" }</code>; older versions use <code>content</code>. Expect two clean-up jobs: glyphs sit on a text baseline inside a font’s “em box”, so recentre each one into a square <code>viewBox</code>, then optimise the files. Our guide to ' + L.post('optimize-svg-icons-svgo', 'optimising SVG icons with SVGO') + ' covers the second part.')}
${callout('warn', 'Check the licence before you convert. Font Awesome Free licenses its font files under the SIL OFL 1.1 and its SVG and JS icons under CC BY 4.0, which asks for credit (its SVG files carry the credit in a comment). A paid or custom font may not allow conversion at all.', 'Licences travel with the drawings')}

${h2('Step 3: How do I map icon font names to the new icons?')}
${p('Make a two-column table: old class, new icon. This is the single most useful artefact of the whole migration, because every later step (codemods, reviews, AI-assisted edits) reads from it. If you are moving to a different icon set rather than the font’s own SVGs, names will differ, so map each one by meaning, not spelling.')}
${p(`with icons helps here because its search understands aliases. The command-line tool resolves a name and tells you how it matched: <code>npx withicons resolve house --json</code> returns <code>home</code>, matched through an alias. Here is what it says for some common Font Awesome 6 and 7 names:`)}
${table(['Old class', 'with icons class', 'How it matched'], [
  ['<code>fa-house</code>', '<code>with-home</code>', yes('Alias')],
  ['<code>fa-gear</code>', '<code>with-settings</code>', yes('Alias')],
  ['<code>fa-magnifying-glass</code>', '<code>with-search</code>', yes('Alias')],
  ['<code>fa-xmark</code>', '<code>with-close</code>', yes('Alias')],
  ['<code>fa-trash-can</code>', '<code>with-trash</code>', yes('Alias')],
  ['<code>fa-envelope</code>', '<code>with-mail</code>', yes('Alias')],
  ['<code>fa-bars</code>', '<code>with-menu</code> (you choose)', meh('Ambiguous: menu, chart-bar or signal')],
  ['<code>fa-right-from-bracket</code>', '<code>with-log-out</code> (by meaning)', no('No alias: map it by hand')],
], 'Font Awesome names checked with npx withicons resolve (November 2026)')}
${p('Modifier classes map too. <code>fa-spin</code>, <code>fa-fw</code>, <code>fa-2x</code> to <code>fa-5x</code> and <code>fa-rotate-90</code> have direct equivalents (<code>with-spin</code>, <code>with-fw</code>, <code>with-2x</code>, <code>with-rotate-90</code>), and <code>fa-flip-horizontal</code> becomes <code>with-flip-h</code>. The style class changes from <code>fa-solid</code> to <code>with-solid</code>; line is the default, so outline icons need no style class.')}
${callout('note', 'with icons has no brand logos. Keep brand icons (social networks, payment logos) from the brand’s own press kit or the font’s SVGs, and migrate them separately.', 'Brand icons')}

${h2('Step 4: Which replacement should I use: components, sprite or CSS classes?')}
${p('It depends on how your pages are built. All three give you real SVGs; they differ in how much markup you change.')}
${table(['Your stack', 'Best replacement', 'Markup change'], [
  ['React, Vue, Svelte, Angular, Solid', 'Icon components (<code>&lt;Home /&gt;</code>)', meh('Rewrite each tag as a component')],
  ['Static HTML you control', 'A sprite with <code>&lt;svg&gt;&lt;use href&gt;</code>', meh('Replace each tag with a small svg')],
  ['Templates, CMS content, many hands', 'Drop-in CSS classes (<code>&lt;i class="with with-home"&gt;</code>)', yes('Only the class names')],
], 'Choosing the replacement for an icon font')}
${h3('The low-effort path: keep the &lt;i&gt; tags')}
${p(`If you have hundreds of <code>&lt;i class="fa-solid fa-house"&gt;</code> tags spread over templates and CMS content, rewriting each as a component is a big job. The with icons ${L.page('free/font-awesome-style-icon-classes.html', 'CSS icon classes')} let you keep the tags and change only the class names. Each class is a tiny stylesheet that draws a real SVG into the empty tag as a CSS mask (a stencil the browser fills with your text colour), so the icon is 1em square, takes the text colour and size like the font did, and no font file is involved.`)}
${code(`<!-- one line in the page: links only the icons the page shows -->
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<!-- before -->  <i class="fa-solid fa-house fa-fw"></i>
<!-- after  -->  <i class="with with-home with-solid with-fw"></i>`)}
${p(`Prefer no JavaScript? Link one stylesheet per style instead (<code>with-line.css</code> is 65 KB gzipped for every line icon), or bundle only the files for the icons you use from <code>npm i @withicons/classes</code>. During the migration, Font Awesome-style names such as <code>with-house</code> also work: the loader adds the right class and leaves a hint in the console, so you can switch to the canonical name later. The ${L.guide('html', 'HTML guide')} has the full set-up.`)}
${art('m-migrate-icon-font-to-svg-class-swap', 'Same tag, new class: the icon font is gone, the markup stays.', { brief: 'A before/after strip. Left: a code card showing <i class="fa-solid fa-house fa-fw"> with a font-file icon (with icons type icon) and a small note "font file, one colour". Right: <i class="with with-home with-solid with-fw"> with the rendered with icons solid home icon and a note "real SVG via CSS mask". A curved arrow between them labelled "change the class names only". Clean editor styling, no third-party logos.' })}
${h3('The component path')}
${p(`In a framework app, use components so you also get typed props and tree-shaking: <code>npm i @withicons/react</code> and <code>import { Home } from '@withicons/react'</code> (Vue, Svelte, Angular and Solid have matching packages). A codemod or an AI coding tool can do most of this rewrite if you give it the name table from step 3. For React specifics, see ${L.post('svg-icons-in-react-and-nextjs', 'SVG icons in React and Next.js')}.`)}
${h3('The sprite path')}
${p(`For static sites, one sprite file per style (from <code>@withicons/static</code>) and <code>&lt;svg&gt;&lt;use href="sprite-line.svg#with-home"/&gt;&lt;/svg&gt;</code> costs no JavaScript. Serve the sprite from your own domain, because browsers block <code>&lt;use&gt;</code> across origins. Our post on ${L.post('svg-sprites', 'SVG sprites')} explains the details.`)}

${h2('Step 5: How do I roll it out without breaking the site?')}
${steps([
  ['Load both for a while', 'The old font and the new icons use different class names (<code>fa-</code> and <code>with-</code>), so they do not clash. Migrate page by page or component by component.'],
  ['Replace from the name table', 'Run the find-and-replace from your step 3 table, one area at a time, and review the diff. Handle the ambiguous and unmatched names by hand.'],
  ['Check sizes and alignment', 'Both sit on the text: with icons classes are 1em square with <code>vertical-align: -.125em</code>, so most layouts line up. Look closely at buttons, inputs and tables.'],
  ['Remove the font last', 'When a search for <code>fa-</code> comes back empty, delete the font files, the CSS and the preload tags.'],
])}
${sizeRamp(['home', 'search', 'settings', 'trash'], [16, 20, 24, 32, 48], 'line', 'After the swap: the same icons drawn as SVG at every size, crisp even at 16 px.')}

${h2('Step 6: How do I test an icon font migration?')}
${ul([
  '<strong>Screenshots before and after.</strong> A visual test (Playwright’s <code>toHaveScreenshot()</code> saves a reference image and compares later runs) catches missing or shifted icons.',
  `<strong>Labels on icon-only buttons.</strong> CSS-class icons are decorative by default (the tag is empty), so a button with only an icon needs <code>aria-label</code>, or the icon needs <code>role="img"</code> and a label. Our ${L.post('accessible-icons', 'accessible icons guide')} shows the patterns.`,
  '<strong>High-contrast mode.</strong> The classes README says CSS-only icons stay visible in Windows high contrast and print even with “Background graphics” off. Check your own pages anyway.',
  '<strong>Fonts blocked.</strong> Turn off web fonts in the browser or a blocker and reload: every icon should still be there.',
  '<strong>Leftovers.</strong> Search the code, CMS and emails for the old prefix one last time.',
])}
${doDont('<p>Inventory the icons you use, map names in a shared table, migrate one area at a time with both systems loaded, and test before removing the font.</p>', '<p>Convert the entire font “just in case”, swap every tag in one big commit, or delete the font before the last <code>fa-</code> class is gone.</p>')}
${iconGrid(['search', 'list', 'replace', 'test-tube', 'check-circle', 'trash'], 'duo', 'The migration in six icons: find, list, replace, test, done, delete the font.')}
${p(`Not a developer, and just need a few icons for a page builder that only accepts class names? The classes work there too, and every icon in ${L.icons('the library')} has a copy button for its snippet. All ${N_ICONS} icons come in ${N_STYLES} styles, starting with the ${L.style('line', 'line style')}.`)}
${cta('Keep your &lt;i&gt; tags, lose the font', `${N_ICONS} icons in ${N_STYLES} styles as CSS classes, components or sprites. Real SVG, free, MIT licensed.`, ['type', 'replace', 'code', 'check-circle', 'sparkles', 'heart'])}
`,
}
