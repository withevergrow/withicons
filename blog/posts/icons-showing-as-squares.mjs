import { p, h2, h3, ul, iconGrid, table, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'icons-showing-as-squares',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-icons-showing-as-squares',
  stickers: [['square', 'line'], ['alert-triangle', 'duo'], ['check-circle', 'solid']],
  title: 'Why are my icons showing as squares, boxes or words? (2026 fixes)',
  cardTitle: 'Icons showing as squares',
  h1: 'Why are my icons showing as <em>squares</em>, boxes or words?',
  dek: 'Empty boxes where Font Awesome icons should be, or the word “home” where a Material icon belongs. Both mean the icon font did not do its job. Here is how to find the cause in two minutes, the correct 2026 setup, and the fix that ends it for good.',
  description: 'Icon fonts showing squares or words? Find the cause (blocked font, CSP, wrong Font Awesome version, Material ligatures) and the correct 2026 setup or SVG fix.',
  keywords: ['font awesome icons showing as squares', 'icons showing as boxes', 'font awesome not working', 'material icons showing text', 'material symbols showing name instead of icon', 'icon font not loading', 'font awesome 7 icons not showing', 'icon_names material symbols', 'icons tofu'],
  about: ['Icon fonts', 'Font Awesome', 'Material Symbols', 'Content Security Policy', 'Scalable Vector Graphics', 'with icons'],
  related: ['icon-fonts-vs-svg', 'with-icons-vs-font-awesome', 'with-icons-vs-material-symbols'],
  tldr: [
    '<strong>Squares or boxes mean the icon font did not load or did not apply.</strong> The page has the hidden character for the icon, but no font to draw it, so the browser shows a placeholder box.',
    '<strong>A word like “home” instead of an icon</strong> means a ligature font (Material Icons or Material Symbols) is missing, the class is wrong, or that name is not in your <code>&amp;icon_names=</code> list.',
    'Check the browser’s Network tab for the font file first: a 404, a CORS error or a Content Security Policy block explains most cases. Then check that your class names match the version you load.',
    'Font Awesome is on version 7 (Free 7.3.1 in July 2026). Load one version only, use <code>fa-solid fa-house</code> style classes, and keep the <code>css</code> and <code>webfonts</code> folders together.',
    '<strong>The permanent fix is SVG icons.</strong> An SVG is a picture, not a letter, so there is no font to block, and it never turns into a box or a word.',
  ],
  faq: [
    { q: 'Why are my Font Awesome icons showing as squares?', a: 'The icon font file did not load or is not being used. Common causes: a wrong path to the webfonts folder when self-hosting, a Content Security Policy without font-src for the font’s host, a missing CORS header on a font served from another domain, two Font Awesome versions on one page, or custom CSS that names the wrong font family (for example “Font Awesome 6 Free” with version 7 files).' },
    { q: 'Why does Material Icons show the icon name as text?', a: 'Material Icons and Material Symbols use ligatures: you type a word like home and the font swaps it for a picture. If the font has not loaded yet, failed, or does not contain that icon, you see the word. Check that the class matches the stylesheet you load (material-icons vs material-symbols-outlined), add &display=block to the Google Fonts URL, and include the name in &icon_names= if you subset.' },
    { q: 'Why do my icons show as squares only for some visitors?', a: 'Some people block web fonts on purpose: blockers such as uBlock Origin have a “No remote fonts” switch, some company networks block font CDNs, and some readers force their own font for easier reading. You cannot fix that from your side with a font. SVG icons are not affected.' },
    { q: 'Can I mix Font Awesome 5, 6 and 7 on one page?', a: 'No. Font Awesome’s troubleshooting docs say your site should load just one version, and that using version 7 with older versions is not recommended because class names and character codes overlap. Pick one version, update your class names to it, and use its v4 shims only if you must keep very old markup.' },
    { q: 'How do I stop icon fonts from breaking for good?', a: `Switch to SVG icons. You can keep Font Awesome and use its SVG option, download Material Symbols as SVG files, or use a library built on SVG. with icons gives you &lt;i class="with with-home"&gt; class names that paint a real SVG (no font), or React, Vue and other components, for all ${N_ICONS} icons.` },
  ],
  sources: [
    { title: 'Font Awesome docs: Troubleshooting (load one version; v7 with older versions not recommended), checked November 2026', url: 'https://docs.fontawesome.com/web/troubleshoot' },
    { title: 'Font Awesome docs: Get started with a Kit (fa-solid, fa-regular, fa-brands markup), checked November 2026', url: 'https://docs.fontawesome.com/web/setup/get-started' },
    { title: 'Font Awesome docs: CSS pseudo-elements (var(--fa-font-solid)), checked November 2026', url: 'https://docs.fontawesome.com/web/add-icons/pseudo-elements' },
    { title: '@fortawesome/fontawesome-free on npm (7.3.1, published 15 July 2026), checked November 2026', url: 'https://www.npmjs.com/package/@fortawesome/fontawesome-free' },
    { title: 'Google: Material Symbols guide (icon_names subsetting, display=block, payload sizes), checked November 2026', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'google/material-design-icons README (“Material Icons is the classic set, but no longer updated”), checked November 2026', url: 'https://github.com/google/material-design-icons' },
    { title: 'MDN: Content-Security-Policy font-src', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/font-src' },
    { title: 'MDN: Cross-Origin Resource Sharing (web fonts across domains)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
    { title: 'uBlock Origin wiki: per-site switches (“No remote fonts”)', url: 'https://github.com/gorhill/uBlock/wiki/Per-site-switches' },
    { title: 'Stack Overflow: Font Awesome not working, icons showing as squares (2013, the stale accepted answer)', url: 'https://stackoverflow.com/questions/14366158/font-awesome-not-working-icons-showing-as-squares' },
  ],
  body: () => `
${p(`<span class="lede">Icons show as squares or empty boxes when the icon font did not load or was not applied: the page holds a hidden character for each icon, and without the right font the browser draws a placeholder box instead. Icons that show as words, like “home” or “arrow_forward”, mean the same thing for Google’s Material fonts, which turn words into pictures. Check the font file in your browser’s Network tab and your class names first. The fix that ends it for good is switching to SVG icons, which are pictures, not letters.</span>`)}
${p(`Developers call those boxes “tofu”. Below is a two-minute way to find the cause, the correct 2026 setup for Font Awesome and Material Symbols (both are fine when set up right), and how SVG removes the problem. We checked everything against Font Awesome’s and Google’s own docs in November 2026. For the bigger picture, read our ${L.post('icon-fonts-vs-svg', 'icon fonts vs SVG')} post.`)}

${callout('note', '<p>The accepted Stack Overflow answer for “Font Awesome icons showing as squares” is from 2013 and fixes a version 3 path. Popular answers paste version 4.7.0 links (October 2016), which still load but know nothing of newer class names. Font Awesome is now on <strong>version 7</strong> (7.0.0 in July 2025; Free 7.3.1 in July 2026), whose font is named “Font Awesome 7 Free”. Google stopped updating the classic Material Icons font in 2022; Material Symbols replaced it, and Google’s docs now recommend loading only the icons you use with <code>&amp;icon_names=</code>.</p>', 'What changed since the old answers')}

${h2('Why do icon fonts show squares instead of icons?')}
${p('An icon font is a font whose “letters” are little pictures. Font Awesome puts each icon on a special character that normal fonts leave empty. When the icon font is present, the browser draws a house. When it is missing, the browser falls back to an ordinary font, which has no drawing for that character, so it shows an empty box or a box with a code inside.')}
${p('Material Icons and Material Symbols work slightly differently. You write the icon’s name as plain text, for example <code>home</code>, and the font swaps the whole word for a picture (a trick called a ligature). If that font is missing, nothing swaps, and you see the word itself.')}
${art('m-icons-showing-as-squares-three-states', 'One icon, three outcomes: the font loaded, the font failed (a box), or a ligature font failed (the word).', { brief: 'Three toolbar buttons in a row, each in a simple browser frame. Left: a clean house icon (with icons home, line style), labelled "Font loaded". Middle: the same button showing an empty rectangle with a tiny hex code inside, labelled "Font missing: a box". Right: the same button showing the word "home" in plain text, labelled "Ligature font missing: the word". Flat, neutral colours, no third-party logos.' })}

${h2('How do I find out why my icons are not showing?')}
${p('Most cases take two minutes to diagnose in the browser’s developer tools (right-click the page, then Inspect).')}
${steps([
  ['Look for the font file', 'Open the Network tab, filter by Font, and reload. Font Awesome loads files like <code>fa-solid-900.woff2</code>; Google’s Material fonts load from <code>fonts.gstatic.com</code>. A red line, a 404 or no request at all is your answer.'],
  ['Read the Console', 'A message like “Refused to load the font” means your Content Security Policy blocks it. A CORS message means the font comes from another domain that does not allow it.'],
  ['Inspect one icon', 'Select a broken icon and check its computed <code>font-family</code>. If it shows your normal body font, a class name is wrong or another rule overrides the icon font.'],
  ['Try a private window', 'Extensions are usually off there. If the icons appear, a blocker or a reader setting on your own browser is the cause.'],
])}
${table(['What you see', 'Most likely cause', 'Fix'], [
  ['Boxes everywhere, the font request is a 404', 'Wrong path when self-hosting; the <code>css</code> folder looks for fonts in <code>../webfonts</code>', 'Upload both folders and keep them side by side'],
  ['Boxes on the live site only', 'Content Security Policy without the font’s host in <code>font-src</code>, or a missing CORS header on a font from another domain', 'Add the host to <code>font-src</code>, or serve the font from your own domain'],
  ['Boxes for some visitors only', 'Font blockers, company networks that block CDNs, readers who force their own font', 'Nothing you can fix with a font; use SVG'],
  ['Some icons blank, others fine', 'Class names from another version, a Pro-only icon or style, or the brands stylesheet not loaded', 'Match classes to the version you load; check the icon’s edition'],
  ['Boxes in your own <code>::before</code> CSS', 'Wrong <code>font-family</code> name or weight for your version', 'Use Font Awesome’s <code>var(--fa-font-solid)</code> shorthand'],
  ['The word “home” shows', 'Material font not loaded, wrong class, or the name is missing from <code>&amp;icon_names=</code>', 'Match class to stylesheet; add the name; add <code>&amp;display=block</code>'],
], 'Icons showing as squares or words: symptom, cause, fix')}

${h2('Why are my Font Awesome icons not showing?')}
${p('Font Awesome changed its class names twice, and many broken pages mix them. Here is what each version expects:')}
${table(['Version', 'Typical markup', 'Font family name'], [
  ['4 (last release 4.7.0, 2016)', '<code>&lt;i class="fa fa-home"&gt;</code>', '“FontAwesome”'],
  ['5', '<code>&lt;i class="fas fa-home"&gt;</code>', '“Font Awesome 5 Free”'],
  ['6 (from February 2022)', '<code>&lt;i class="fa-solid fa-house"&gt;</code>', '“Font Awesome 6 Free”'],
  ['7 (from July 2025)', '<code>&lt;i class="fa-solid fa-house"&gt;</code>', '“Font Awesome 7 Free”'],
], 'Font Awesome class names and font names by version (from Font Awesome’s own CSS files)')}
${p('Version 7 still understands many older short names: we checked the Free 7.3.1 stylesheet, and <code>fa-home</code> and <code>fas</code> still work. What breaks most often:')}
${ul([
  '<strong>Two versions on one page.</strong> A theme loads version 5 and a plugin loads version 7. Font Awesome’s troubleshooting page says your site should load just one version, and that it does not recommend using version 7 with older ones, because class names and character codes overlap.',
  '<strong>New classes on an old link.</strong> A copied 4.7.0 CDN link plus <code>fa-solid fa-house</code> from today’s docs: the old file has no such classes.',
  '<strong>Hand-written CSS with an old font name.</strong> Version 7’s all-in-one stylesheet also registers the version 4 and 5 font names for old code, but not “Font Awesome 6 Free”, so custom <code>::before</code> rules written for version 6 draw boxes.',
  '<strong>Pro icons on the Free files.</strong> Font Awesome’s docs say to check that the icon and style exist in the edition you load. Light, thin, duotone and sharp styles need Pro.',
  '<strong>Logos without the brands style.</strong> Brand icons need the <code>fa-brands</code> class and the brands stylesheet (included in <code>all.css</code>).',
])}
${h3('The correct Font Awesome 7 setup')}
${p('Font Awesome’s get-started guide recommends a Kit: you create one in your account and paste a single script tag. If you would rather host the files yourself, the Free package on npm (<code>@fortawesome/fontawesome-free</code>) ships the <code>css</code> and <code>webfonts</code> folders. Either way, the markup is the same:')}
${code(`<!-- Option 1: a Kit from your Font Awesome account -->
<script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js" crossorigin="anonymous"></script>

<!-- Option 2: self-hosted Free files (keep css/ and webfonts/ side by side) -->
<link rel="stylesheet" href="/fontawesome/css/all.min.css">

<i class="fa-solid fa-house"></i>
<i class="fa-regular fa-bell"></i>

<style>
  /* your own pseudo-element icons: let Font Awesome set the font */
  .home-link::before { font: var(--fa-font-solid); content: "\\f015"; }
</style>`)}

${h2('Why does Material Icons show the icon name as text?')}
${p('Because the font that turns the word into a picture is not there, or does not contain that word. Google has two fonts, and they are easy to mix up. Its GitHub README calls Material Icons “the classic set, but no longer updated” (updates stopped in 2022). Material Symbols is the current set, a variable font you can tune for weight and fill.')}
${ul([
  '<strong>Class and stylesheet must match.</strong> <code>class="material-icons"</code> needs the Material Icons stylesheet; <code>class="material-symbols-outlined"</code> needs Material Symbols Outlined. One with the other shows the word.',
  '<strong>Newer icons exist only in Symbols.</strong> An icon added after 2022 has no picture in the old Material Icons font, so its name stays text.',
  '<strong>Your subset leaves it out.</strong> If you load only some icons with <code>&amp;icon_names=</code>, any name not on that list has no picture in the downloaded font.',
  '<strong>The word flashes before the icon.</strong> The page shows text while the font downloads. Google’s guide says to add <code>&amp;display=block</code> to prevent it.',
])}
${h3('The correct Material Symbols setup')}
${p('Google’s Material Symbols guide now recommends listing only the icons you use, sorted alphabetically, and adding <code>display=block</code>. Its own numbers show why: the default font with every icon is 295 KB, every variable axis is 7.9 MB, and three named icons are 1.7 KB.')}
${code(`<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=home,palette,settings&display=block">

<span class="material-symbols-outlined">home</span>`)}
${p('Remember to add each new icon’s name to that list when you use it. Forgetting is the most common cause of a stray word in 2026.')}

${h2('Could a blocker or my security settings be the cause?')}
${p('Yes, and these are the cases that only some people report. Fonts are separate downloads, so anything that blocks downloads can block icons:')}
${ul([
  '<strong>Blockers.</strong> uBlock Origin, a popular content blocker, has a per-site “No remote fonts” switch, and people who turn it on see boxes on icon-font sites.',
  '<strong>Reading fonts.</strong> Some readers, often people with dyslexia, tell their browser to use one font for every page. That replaces the icon font too.',
  '<strong>Content Security Policy.</strong> If your site sends a CSP header, MDN explains that <code>font-src</code> lists where fonts may load from. Google’s font files come from <code>fonts.gstatic.com</code>, so it must be listed (and <code>fonts.googleapis.com</code> under <code>style-src</code> for the stylesheet).',
  '<strong>Fonts from another domain.</strong> MDN notes that web fonts loaded across domains are subject to CORS, so the server holding the font must allow your site.',
])}
${p('You can fix the last two. You cannot fix the first two from your side, as long as your icons are a font.')}

${h2('What is the permanent fix for icons showing as squares?')}
${p('Use SVG icons. An SVG is a small picture made of shapes, so the browser draws it as an image. There is no font to download, nothing for a font blocker or a reading font to replace, and no character to turn into a box or a word.')}
${p(`To be fair to both big names, you do not have to leave them to get there. Font Awesome offers an SVG option alongside its web fonts, and Google’s Material Symbols site lets you download each symbol as an SVG. If you are starting over or want more looks, with icons is SVG-only: all ${N_ICONS} icons in ${N_STYLES} styles, MIT licensed.`)}
${p(`If you like icon-font markup, our ${L.page('free/font-awesome-style-icon-classes.html', 'Font Awesome-style icon classes')} keep it without the font. Each class paints a real SVG through a CSS mask (a stencil filled with your text colour), and common Font Awesome names work as aliases, so <code>with-house</code> finds ${L.icon('home')}:`)}
${code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-bell with-solid"></i>`)}
${p(`Using React, Vue, Svelte or Angular? Use components instead (for example <code>npm i @withicons/react</code>); the ${L.guide('html', 'HTML guide')} covers plain pages. Moving a whole site off a font is its own job: our ${L.post('migrate-icon-font-to-svg', 'icon font to SVG migration guide')} goes step by step.`)}
${iconGrid(['home', 'search', 'bell', 'settings', 'user', 'heart', 'mail', 'calendar'], 'line', 'SVG icons drawn live on this page. No font file, so nothing here can turn into a box.')}
${doDont(
  '<p>Load one icon source per page, match class names to its version, list every Material Symbol you use, and test with fonts blocked. For new work, use SVG icons.</p>',
  '<p>Paste a 2016 CDN link next to 2026 class names, load two Font Awesome versions, or rely on an icon font for buttons like “Pay” or “Delete” that have no text label.</p>'
)}
${art('m-icons-showing-as-squares-before-after', 'Before: a toolbar of boxes and stray words. After: the same toolbar with SVG icons.', { brief: 'A before/after pair of the same app toolbar (search, bell, settings, user, plus a "home" nav item). Before, labelled "Icon font failed": four empty boxes and the plain word "home". After, labelled "SVG icons": the with icons search, bell, settings, user and home icons in line style, crisp. A thin arrow between the two. No third-party logos.' })}

${h2('The bottom line')}
${p(`Squares mean the icon font did not load or apply; words mean a Material ligature font is missing or does not know that name. Check the font request, your CSP and CORS, and that your classes match one version. Font Awesome 7 and Material Symbols both work when set up as their docs say. But fonts can always be blocked, and SVG icons cannot, so if you are tired of debugging boxes, ${L.icons('switch to SVG icons')}. Comparing options? See ${L.post('with-icons-vs-font-awesome', 'with icons vs Font Awesome')} and ${L.post('with-icons-vs-material-symbols', 'with icons vs Material Symbols')}.`)}
${cta('Icons that never turn into boxes', `${N_ICONS} SVG icons in ${N_STYLES} styles, as components, a web component or &lt;i class&gt; tags. No font file to block. Free, MIT licensed.`, ['check-circle', 'home', 'bell', 'heart', 'sparkles', 'code'])}
`,
}
