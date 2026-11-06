import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, doDont, steps, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'align-icon-with-text',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-align-icon-with-text',
  stickers: [['align-center', 'duo'], ['type', 'solid'], ['ruler', 'blueprint']],
  title: 'How do I vertically align an icon with text in CSS? (2026)',
  cardTitle: 'Align an icon with text',
  h1: 'How to vertically align an icon <em>with text</em>',
  dek: 'Your icon sits a little too high, or a little too low, and the old answers say “add top: 2px”. Here is what actually works now: flexbox and gap, a 1em icon, -0.125em for running text, and the new CSS text-box for a true optical centre.',
  description: 'Align an icon with text in CSS: inline-flex with align-items and gap, 1em icons, vertical-align -0.125em, and the new text-box trim (Baseline since August 2026).',
  keywords: ['align icon with text css', 'vertically align icon and text', 'svg icon not centered with text', 'vertical-align middle not working svg', 'icon and text in button alignment', 'css text-box-trim', 'text-box trim-both cap alphabetic', 'gap below inline svg', 'icon sits lower than text'],
  about: ['Cascading Style Sheets', 'CSS Flexible Box Layout', 'Typography', 'Scalable Vector Graphics', 'with icons'],
  related: ['change-svg-icon-color-css', 'svg-icons-in-css', 'icon-sizes-guide'],
  tldr: [
    '<strong>Icon next to a label (buttons, menus, chips)?</strong> Put both in a flex row: <code>display: inline-flex; align-items: center; gap: 0.5em</code>, and size the icon in <code>em</code>.',
    '<strong>Icon inside a sentence?</strong> Make it <code>1em</code> square and set <code>vertical-align: -0.125em</code>. <code>vertical-align: middle</code> lines up with the lower-case letters, so it often looks slightly off.',
    '<strong>New in 2026:</strong> <code>text-box: trim-both cap alphabetic</code> on the label trims the empty space above capitals and below the baseline, so centring looks right. It became Baseline in August 2026, when Firefox 154 shipped it.',
    'A small gap under an icon on its own line is the space kept for letters like g and y. Fix it with <code>display: block</code> on the SVG.',
    'Skip magic numbers like <code>position: relative; top: 2px</code>. They break as soon as the font or size changes.',
  ],
  faq: [
    { q: 'Why is vertical-align: middle not centring my icon?', a: 'Because “middle” does not mean the middle of the text. MDN defines it as lining up the icon’s middle with the baseline plus half the x-height, the height of a lower-case x. Next to capitals and numbers, that sits low. Use a flex row with <code>align-items: center</code>, or <code>vertical-align: -0.125em</code> for a 1em icon in running text.' },
    { q: 'How do I centre an icon and text inside a button?', a: 'Make the button a flex row: <code>display: inline-flex; align-items: center; gap: 0.5em;</code>. Give the icon a size in <code>em</code> and <code>flex-shrink: 0</code> so it never squashes. For a crisper optical centre, add <code>text-box: trim-both cap alphabetic</code> to the label’s span.' },
    { q: 'What is text-box-trim in CSS?', a: 'It removes the empty space a font keeps above and below its letters. <code>text-box: trim-both cap alphabetic</code> trims the top to the height of capital letters and the bottom to the baseline. MDN lists it as Baseline 2026: Chrome and Edge 133, Safari 18.2 and Firefox 154 (August 2026) support it.' },
    { q: 'Why is there a gap below my SVG icon?', a: 'An inline SVG sits on the text baseline like a letter, and the browser keeps room under the baseline for descenders such as g, p and y. Set <code>display: block</code> on the SVG (or <code>vertical-align: middle</code>), or put it in a flex container, and the gap disappears.' },
    { q: 'What size should an icon be next to text?', a: 'Size it in <code>em</code> so it follows the text: <code>1em</code> matches the font size, and <code>1.25em</code> suits most buttons. With 16 px text that gives 16 or 20 px icons. Size in pixels only when the icon must stay fixed whatever the text size.' },
  ],
  sources: [
    { title: 'MDN: text-box (Baseline 2026, newly available since August 2026), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-box' },
    { title: 'MDN: Firefox 154 release notes (text-box support, 18 August 2026)', url: 'https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/154' },
    { title: 'Can I use: text-box-trim (Chrome 133, Safari 18.2, Firefox 154), checked November 2026', url: 'https://caniuse.com/css-text-box-trim' },
    { title: 'Chrome for Developers: CSS text-box-trim', url: 'https://developer.chrome.com/blog/css-text-box-trim' },
    { title: 'MDN: vertical-align (baseline, middle and length values), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/vertical-align' },
    { title: 'Web platform features explorer: the cap and lh units, checked November 2026', url: 'https://web-platform-dx.github.io/web-features-explorer/features/cap/' },
    { title: 'Iconify docs: inline icons and vertical-align -0.125em', url: 'https://iconify.design/docs/icon-components/svg-framework/inline.html' },
    { title: 'Stack Overflow: How do you align text with SVG elements? (question 37742099)', url: 'https://stackoverflow.com/questions/37742099/how-do-you-align-text-with-svg-elements' },
  ],
  body: () => `
${p(`<span class="lede">To vertically align an icon with text, put them in a flex row: <code>display: inline-flex; align-items: center; gap: 0.5em</code>, with the icon sized in <code>em</code>. When the icon sits inside a sentence and you cannot add a wrapper, make it <code>1em</code> square and nudge it with <code>vertical-align: -0.125em</code>. For a true optical centre, the new CSS <code>text-box: trim-both cap alphabetic</code> trims the label to its capital letters, and it has worked in every major browser since August 2026.</span>`)}
${p(`That covers almost every case. Below we explain why icons drift in the first place, which <code>vertical-align</code> values do what, how <code>text-box</code> changes the picture, how to line up icons inside buttons, and how to kill the mystery gap under an SVG. Every example uses real icons from ${L.icons('with icons')}, but the CSS works with any SVG icon set.`)}

${callout('note', `<p>The top Stack Overflow answers on this (2015 and 2016) use <code>vertical-align: middle</code>, which lines up with lower-case letters, or <code>position: relative; top: .15em</code>, a magic number that breaks when the font changes. None of them could use what we have now: <code>gap</code> in flexbox (in every browser since 2021), the <code>cap</code> and <code>lh</code> units (Baseline since late 2023), and <code>text-box</code> trimming, which Chrome shipped in early 2025 and Firefox completed in August 2026.</p>`, 'What changed since the old answers')}

${h2('Why is my icon not aligned with my text?')}
${p('Because an icon and a word are measured differently. An SVG placed in a line of text behaves like a big letter: its bottom edge sits on the <em>baseline</em>, the invisible line letters stand on. But text has extra room around it. Above the capitals there is space for accents and line spacing, and below the baseline there is space for the tails of g, p and y.')}
${p('So a 1em icon sitting on the baseline pokes up above the capital letters and looks too high. And when you centre the icon on the whole text box, you centre it on the letters plus that invisible padding, which is usually not where the eye puts the middle. Fixing alignment means deciding what “centre” you mean.')}
${art('m-align-icon-with-text-metrics', 'Where text really sits: baseline, x-height, cap height and the empty space a font keeps around them.', { brief: 'A large annotated diagram of the word “Settings” next to the with icons settings icon (line style). Draw horizontal guide lines across both, labelled “line box top”, “cap height”, “x-height”, “baseline”, “descender”, “line box bottom”. Shade the empty space above the cap height and below the baseline in a soft tint labelled “half-leading”. Show the icon twice: once sitting on the baseline (too high, marked with a small red cross) and once centred between cap height and baseline (marked with a green tick).' })}

${h2('How do I centre an icon next to text with flexbox?')}
${p('This is the answer for buttons, menu items, badges, chips and list rows: anywhere you can wrap the icon and its label in one element.')}
${code(`.with-label {
  display: inline-flex;
  align-items: center;   /* centre the icon and the text on each other */
  gap: 0.5em;            /* space between them, scales with the text */
}
.with-label svg {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;        /* never let a long label squash the icon */
}`)}
${code(`<a class="with-label" href="/settings">
  <svg viewBox="0 0 24 24" aria-hidden="true">…</svg>
  <span>Settings</span>
</a>`)}
${p('Three small details make this hold up. <code>gap</code> replaces the old margin on the icon, and works in either direction (icon before or after). Sizing in <code>em</code> means the icon grows with the text, so a large heading and a small caption both stay balanced. And <code>flex-shrink: 0</code> stops the icon shrinking when the label is long and the row runs out of room.')}
${sizeRamp(['settings', 'bell', 'search', 'download'], [16, 20, 24, 32, 48], 'line', 'Sized in em, an icon follows its text. The same four icons from 16 to 48 px: the range 1em to 2em covers with everyday 16 to 24 px text.')}
${p(`If your label wraps onto two lines, <code>align-items: center</code> centres the icon on the whole block, which can look odd. Use <code>align-items: flex-start</code> and wrap the icon in a small flex box with <code>height: 1lh</code> (one line height, a unit every major browser has supported since 2023) that centres it, so the icon stays centred on the first line.`)}

${h2('Should I use vertical-align: middle or -0.125em?')}
${p('Inside running text, where an icon sits in a sentence like “Tap the ★ to save”, there is often no wrapper to make into a flex row. Then <code>vertical-align</code> on the icon itself is the tool. The values are easy to mix up:')}
${table(['Value', 'What it lines up', 'How it looks with a 1em icon'], [
  ['<code>baseline</code> (default)', 'Bottom of the icon on the text baseline', no('Too high: the icon pokes above the capitals')],
  ['<code>middle</code>', 'Middle of the icon on the baseline plus half the x-height (MDN’s definition)', meh('Close next to lower-case text, a little low next to capitals')],
  ['<code>-0.125em</code>', 'Bottom of the icon one eighth of the font size below the baseline', yes('Balanced in most fonts')],
  ['<code>text-bottom</code>', 'Bottom of the icon on the bottom of the text area', meh('Usually sits low')],
  ['<code>top: 2px</code> (with <code>position: relative</code>)', 'Whatever 2 pixels happened to fix on one screen', no('Breaks when the font or size changes')],
], 'vertical-align values for an icon inside a line of text (checked November 2026)')}
${p('The <code>-0.125em</code> value is a rule of thumb rather than a standard, but a widely shared one: Iconify’s docs recommend it for inline icons, and our own CSS classes use it. Because it is in <code>em</code>, it scales with the text instead of being tied to one size.')}
${code(`.inline-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
}`)}
${p(`If an icon should match the height of capital letters exactly, size it with the <code>cap</code> unit: <code>height: 1cap</code>. It reads the real cap height from the font you use, and has been Baseline since December 2023.`)}

${h2('What is CSS text-box, and does it fix icon alignment?')}
${p('<code>text-box</code> is a newer CSS property that trims the empty space a font keeps above and below its letters. With <code>text-box: trim-both cap alphabetic</code>, the top of the text box moves down to the top of the capital letters, and the bottom moves up to the baseline. What is left is a box exactly as tall as an “H”.')}
${p('That is exactly what icon alignment needs. Centre an icon on that trimmed box and it centres on the letters people actually see, not on invisible padding. The property applies to block containers and inline boxes, so put it on the label’s own element, not on the flex row:')}
${code(`.with-label { display: inline-flex; align-items: center; gap: 0.5em; }
.with-label > span { text-box: trim-both cap alphabetic; }`)}
${p('Support arrived in steps. Safari 18.2 shipped it in December 2024 and Chrome and Edge 133 in February 2025. Firefox 154 completed the set on 18 August 2026, and MDN now lists <code>text-box</code> as Baseline 2026, newly available. Browsers without it simply ignore the line, and the flexbox centring underneath still works, so it is safe to add today.')}
${ul([
  '<strong>Results depend on the font.</strong> The trim reads the font’s own cap-height and baseline data, so check your real typeface.',
  '<strong>Mostly lower-case labels?</strong> Try <code>text-box: trim-both ex alphabetic</code>, which trims to the x-height instead.',
  '<strong>It also tidies padding.</strong> Trimmed buttons look evenly padded top and bottom, which was the property’s original purpose.',
])}
${art('m-align-icon-with-text-trim', 'Before and after text-box: the same button, centred on the text box and centred on the letters.', { brief: 'A before/after pair of two large pill buttons reading “Download” with the with icons download icon (line style) on the left. Left button labelled “align-items: center”: draw the untrimmed text box as a dashed outline taller than the letters, with the icon looking very slightly low. Right button labelled “+ text-box: trim-both cap alphabetic”: the dashed outline hugs the cap height and baseline, and the icon sits visually centred. Add thin measurement ticks showing equal space above and below on the right.' })}

${h2('How do I align an icon inside a button?')}
${steps([
  ['Make the button a flex row', 'Set <code>display: inline-flex; align-items: center; gap: 0.5em;</code> on the button, and keep vertical padding equal top and bottom.'],
  ['Size the icon in em', 'Use <code>1.25em</code> for most buttons and <code>flex-shrink: 0</code> so it keeps its shape. Skip margins: <code>gap</code> handles the spacing.'],
  ['Wrap the label and trim it', 'Put the text in a <code>&lt;span&gt;</code> and add <code>text-box: trim-both cap alphabetic</code> for an optical centre in current browsers.'],
  ['Hide the icon from screen readers', 'With a visible label, the icon is decoration: add <code>aria-hidden="true"</code>. An icon-only button needs an <code>aria-label</code> instead.'],
])}
${doDont('<p>Centre with flexbox, size the icon in <code>em</code>, space with <code>gap</code>, and let <code>text-box</code> fine-tune the optical centre.</p>', '<p>Nudge icons with <code>position: relative; top: 2px</code>, set <code>line-height: 0</code> on buttons, or add a margin to the icon that only works at one font size.</p>')}
${iconGrid(['download', 'plus', 'send', 'trash', 'share', 'arrow-right'], 'solid', 'Common button icons. Solid icons hold up best at the small sizes buttons use.')}
${p(`How big should the button itself be, and how do you label an icon-only one? That is its own question, answered in ${L.post('icon-button-size-and-labels', 'how big an icon button should be')}. For the icon sizes that look sharp, see our ${L.post('icon-sizes-guide', 'icon sizes guide')}.`)}

${h2('Why is there a gap below my inline SVG?')}
${p('This one is not stale, just puzzling. An SVG is inline by default, so it sits on the baseline, and the browser keeps space below for letter tails even when there are no letters. You see a few pixels of empty space under an icon, or a parent that is taller than its icon.')}
${code(`/* an icon on its own: make it a block */
.icon-standalone { display: block; }

/* or keep it inline but stop baseline alignment */
.icon-standalone { vertical-align: middle; }`)}
${p('A flex or grid container fixes it too, because flex items are not aligned on a baseline unless you ask for it. That is one more reason the flex pattern above is the default answer.')}

${h2('How do with icons line up with text?')}
${p(`Our packages do the first steps for you. The ${L.page('free/font-awesome-style-icon-classes.html', 'CSS classes')} (<code>&lt;i class="with with-home"&gt;</code>) are 1em square with <code>vertical-align: -0.125em</code> built in, and <code>with-lg</code> switches to <code>-0.25em</code> for its larger size. <code>with-fw</code> gives a fixed 1.25em width so icons in a menu line up in a neat column. The React, Vue, Svelte, Angular and Solid components and the <code>&lt;with-icon&gt;</code> web component render plain inline SVG, so they drop straight into the flex pattern above.`)}
${code(`<button class="with-label">
  <i class="with with-download"></i>
  <span>Download</span>
</button>`)}
${p(`Every one of the ${N_ICONS} icons is drawn on the same 24 x 24 grid with the same padding, in all ${N_STYLES} styles, so once one icon lines up, they all do. Start with the ${L.icon('settings', 'settings icon')} or the ${L.guide('html', 'HTML guide')}, and if you are placing icons with CSS alone, read ${L.post('svg-icons-in-css', 'SVG icons in CSS')}.`)}
${callout('tip', `Icons in an input field (a search box, a password eye) are a slightly different problem, because an input cannot hold child elements. Our post on ${L.post('icon-inside-input-field', 'putting an icon inside an input')} covers it.`)}

${h2('The short version')}
${p('Flex row, <code>align-items: center</code>, <code>gap</code>, icon in <code>em</code>: that solves nine cases out of ten. In running text, <code>1em</code> and <code>vertical-align: -0.125em</code>. For the last pixel of polish, <code>text-box: trim-both cap alphabetic</code> on the label, now that every major browser supports it. And never trust a magic <code>top: 2px</code>.')}
${cta('Icons that line up out of the box', `${N_ICONS} icons in ${N_STYLES} styles on one 24 px grid. Components, CSS classes with -0.125em built in, or plain SVG. Free, MIT licensed.`, ['align-center', 'type', 'ruler', 'download', 'settings', 'check'])}
`,
}
