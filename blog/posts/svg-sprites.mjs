import { p, h2, h3, ul, iconGrid, table, yes, no, meh, callout, doDont, code, steps, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-sprites',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-svg-sprites',
  stickers: [['layers', 'duo'], ['link', 'blueprint'], ['palette', 'sticker']],
  title: 'How do SVG sprites work in 2026? symbol, use, colours and CDNs',
  cardTitle: 'SVG sprites in 2026',
  h1: 'How do SVG sprites <em>work</em> in 2026?',
  dek: 'One file, many icons, each shown with a single line. Here is how symbol and use work today, how to colour sprite icons (even with several colours), and why a sprite on a CDN still will not load.',
  description: 'SVG sprites today: symbol and use href (xlink:href is legacy), colouring with currentColor and CSS variables, and why cross-origin sprites still fail.',
  keywords: ['svg sprite', 'svg sprites', 'svg symbol use', 'svg use href', 'xlink:href deprecated', 'svg sprite cdn', 'cross domain svg sprite', 'svg use cors', 'style svg use element', 'multi color svg sprite', 'svg sprite css variables', 'svg use data url'],
  about: ['Scalable Vector Graphics', 'SVG sprite', 'symbol element', 'use element', 'CSS custom properties', 'Same-origin policy', 'with icons'],
  related: ['svg-icon-cut-off-or-blurry', 'change-svg-icon-color-css', 'optimize-svg-icons-svgo'],
  tldr: [
    '<strong>An SVG sprite is one file holding many icons</strong>, each a <code>&lt;symbol&gt;</code> with an id. You show one with <code>&lt;svg&gt;&lt;use href="sprite.svg#home"/&gt;&lt;/svg&gt;</code>.',
    '<strong>Use plain <code>href</code>.</strong> <code>xlink:href</code> is deprecated since SVG 2, and plain <code>href</code> works in every current browser (Safari since 12.1, in 2019). No polyfill needed.',
    '<strong>A sprite file must come from your own site.</strong> Browsers refuse a <code>&lt;use&gt;</code> that points to another domain, and CORS headers do not change that. <code>data:</code> URLs were removed too (Chrome 120, Firefox 122).',
    '<strong>Colour it with <code>currentColor</code> and CSS variables.</strong> Selectors cannot reach the copied shapes, but inherited values can, so <code>fill="var(--accent, #f59e0b)"</code> gives a sprite icon a second or third colour.',
    'For a few icons, components or single files are simpler. Sprites pay off when one page shows many icons of the same style.',
  ],
  faq: [
    { q: 'What is an SVG sprite?', a: 'A single SVG file that holds many icons, each wrapped in a <code>&lt;symbol&gt;</code> with its own id and viewBox. The page loads the file once and shows any icon from it with a <code>&lt;use&gt;</code> element pointing at that id, so the icon shapes are not repeated in the HTML.' },
    { q: 'Is xlink:href deprecated?', a: 'Yes. SVG 2 deprecated <code>xlink:href</code> in favour of plain <code>href</code>, and MDN marks it deprecated. Plain <code>href</code> on <code>&lt;use&gt;</code> works in Chrome 50+, Firefox and Safari 12.1+. Browsers still read <code>xlink:href</code> for old files, but new code does not need it.' },
    { q: 'Why does my SVG sprite from a CDN not show?', a: 'Because <code>&lt;use&gt;</code> only loads external files from the same origin as the page. MDN notes there is no way to set a cross-origin policy for it, so CORS headers do not help. Copy the sprite to your own site, inline it in the HTML, or fetch it with JavaScript and insert it into the page.' },
    { q: 'How do I style paths inside an SVG use element?', a: 'You cannot target them with selectors from outside, because the browser copies the symbol into a hidden, read-only tree. Inherited values do get through: <code>color</code>, <code>fill</code>, <code>stroke</code> set on the outer SVG, and CSS custom properties. Write the colours inside the symbol as <code>currentColor</code> or <code>var(--name, fallback)</code> and set them from outside.' },
    { q: 'Can I use a data: URL in SVG use?', a: 'Not any more. Chrome removed <code>data:</code> URLs in <code>&lt;use&gt;</code> in version 120 (late 2023) for security reasons, Firefox followed in version 122, and Safari never supported them. Use a same-origin file, an inline sprite, or a <code>blob:</code> URL instead.' },
    { q: 'Are SVG sprites better than icon components?', a: 'Not better, different. Sprites avoid repeating icon code in the HTML and need no JavaScript, which suits static sites and CMS templates. Components (React, Vue and others) ship only the icons you import and are easier to type and check. Many sites use components in the app and a sprite for static pages.' },
  ],
  sources: [
    { title: 'MDN: the use element (same-origin note, xlink:href deprecated, data: URIs), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use' },
    { title: 'MDN: xlink:href (deprecated), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/xlink:href' },
    { title: 'W3C SVG 2: the use element and its shadow tree', url: 'https://www.w3.org/TR/SVG2/struct.html' },
    { title: 'Chrome for Developers: Migrate away from data URLs in SVG use (Chrome 120)', url: 'https://developer.chrome.com/blog/migrate-way-from-data-urls-in-svg-use' },
    { title: 'Mozilla Bugzilla 1806964: Restrict SVG use to prevent data: URLs (fixed in Firefox 122)', url: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1806964' },
    { title: 'MDN browser compatibility data for use (href: Safari 12.1; data URI removed Chrome 120, Firefox 122), checked November 2026', url: 'https://github.com/mdn/browser-compat-data' },
    { title: 'MDN: Using CSS custom properties (custom properties inherit), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties' },
    { title: 'Stack Overflow: Cross-domain SVG sprite (question 32850536)', url: 'https://stackoverflow.com/questions/32850536/cross-domain-svg-sprite' },
    { title: 'Stack Overflow: Multiple colours in SVG sprite (question 31056134)', url: 'https://stackoverflow.com/questions/31056134/multiple-colours-in-svg-sprite' },
    { title: 'with icons: @withicons/static on npm (sprites per style), checked November 2026', url: 'https://www.npmjs.com/package/@withicons/static' },
  ],
  body: () => `
${p(`<span class="lede">An SVG sprite is one SVG file that holds many icons, each inside a <code>&lt;symbol&gt;</code> with its own id. You show an icon with <code>&lt;svg&gt;&lt;use href="sprite.svg#home"/&gt;&lt;/svg&gt;</code>. In 2026 three rules cover almost every problem: use plain <code>href</code> (not <code>xlink:href</code>), serve the sprite from your own site because browsers block <code>&lt;use&gt;</code> across domains, and colour icons with <code>currentColor</code> and CSS variables, which do pass into the copied shapes.</span>`)}
${p(`Below we explain what a sprite is in plain words, how to build and use one, how to give sprite icons one or several colours, what to do when the sprite lives on a CDN, and when a sprite is the wrong tool. Not writing code? You can skip all of this and copy icons straight from ${L.icons('the icon library')}.`)}

${callout('note', `<p>Many top answers on sprites date from 2015 to 2017. They tell you to use <code>xlink:href</code> “for Safari”, load the svg4everybody polyfill for Internet Explorer, or fetch the sprite with jQuery. Since then Safari 12.1 (2019) added plain <code>href</code>, SVG 2 deprecated <code>xlink:href</code>, and Chrome 120 (late 2023) and Firefox 122 removed <code>data:</code> URLs in <code>&lt;use&gt;</code>. One thing has not changed: a sprite on another domain still will not load through <code>&lt;use&gt;</code>.</p>`, 'What changed since the old answers')}

${h2('What is an SVG sprite?')}
${p('Think of a sheet of stamps. The sheet is one file. Each stamp has a name. When you need a picture, you say “stamp the home one here” instead of drawing it again. An SVG sprite works the same way: the file holds every icon once, and each place on the page that shows an icon just points to it.')}
${p('The name comes from old CSS image sprites, where many small PNGs were packed into one big image and shown through a window. SVG sprites are better behaved: each icon keeps its own shapes and viewBox, stays sharp at any size and can take the text colour.')}
${art('m-svg-sprites-how-it-works', 'One sprite file, many symbols, and small use elements on the page pointing at them by id.', { brief: 'Diagram, left to right. Left: a tall card labelled "sprite-line.svg" listing four symbols with real line icons and their ids (with-home, with-search, with-bell, with-settings). Right: a simple web page mockup (header with search and bell, a sidebar with home and settings) where each icon has a thin arrow back to its symbol in the file, labelled "use href=#with-bell". A small note under the arrows: "one file, drawn once, shown many times". Blueprint accent.' })}

${h2('How do I make and use an SVG sprite?')}
${p('A sprite is an <code>&lt;svg&gt;</code> with one <code>&lt;symbol&gt;</code> per icon. The <code>viewBox</code> goes on each symbol, because the icons may not all share one. Here are two real symbols from the with icons line sprite, shortened to two icons:')}
${code(`<!-- sprite-line.svg -->
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="with-home" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 11 L12 3.5 L21.5 11"/>
    <path d="M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5"/>
  </symbol>
  <symbol id="with-bell" viewBox="0 0 24 24">…</symbol>
</svg>`)}
${p('Then, anywhere on a page served from the same site:')}
${code(`<svg width="24" height="24" aria-hidden="true"><use href="/sprite-line.svg#with-home"/></svg>

<!-- an icon that carries meaning gets a name -->
<svg width="24" height="24" role="img" aria-label="Notifications">
  <use href="/sprite-line.svg#with-bell"/>
</svg>`)}
${steps([
  ['One symbol per icon', 'Give each a unique id and its own viewBox. Put shared attributes like <code>stroke</code> on the symbol so the copies inherit them.'],
  ['Size the outer svg', 'Set <code>width</code> and <code>height</code> (or CSS) on the <code>&lt;svg&gt;</code> that holds the <code>&lt;use&gt;</code>. The symbol’s viewBox scales the drawing to fit.'],
  ['Point at it with href', 'Use <code>href="file.svg#id"</code> for a separate file, or <code>href="#id"</code> when the sprite is inlined in the page.'],
  ['Label or hide', `Decorative icons get <code>aria-hidden="true"</code>; meaningful ones get <code>role="img"</code> and an <code>aria-label</code>. More in our ${L.post('accessible-icons', 'accessible icons guide')}.`],
])}

${h2('Should I use href or xlink:href?')}
${p('Use <code>href</code>. SVG 2 replaced <code>xlink:href</code> with plain <code>href</code>, and MDN now marks the old one as deprecated. If an element has both, browsers use <code>href</code>. The old “Safari needs xlink” advice was true until Safari 12.1 in 2019.')}
${table(['What you write', 'Chrome', 'Firefox', 'Safari', 'Use it?'], [
  ['<code>&lt;use href="#id"&gt;</code>', 'Since 50', 'Yes', 'Since 12.1', yes('Yes')],
  ['<code>&lt;use xlink:href="#id"&gt;</code>', 'Yes', 'Yes', 'Yes', meh('Deprecated, only for old files')],
  ['<code>&lt;use href="data:…"&gt;</code>', 'Removed in 120', 'Removed in 122', 'Never', no('No')],
  ['<code>&lt;use href="file.svg"&gt;</code> (no #id)', 'Since 137', 'No', 'No', meh('Not yet portable')],
], 'Browser support for use references, from MDN’s compatibility data (checked November 2026)')}

${h2('How do I change the colour of an icon from a sprite?')}
${p(`Draw the symbol with <code>currentColor</code>, then set the CSS <code>color</code> on the outer <code>&lt;svg&gt;</code> or any parent. The icon follows your text colour, hover colour and dark mode, exactly as an inline icon would. Our ${L.post('change-svg-icon-color-css', 'guide to changing SVG colour with CSS')} covers this method in depth.`)}
${code(`<svg width="24" height="24" style="color:#e11d48"><use href="/sprite-solid.svg#with-heart"/></svg>`)}
${h3('Why can’t CSS reach the paths inside use?')}
${p('When the browser draws a <code>&lt;use&gt;</code>, it makes a private copy of the symbol in a hidden, read-only tree (the SVG 2 spec calls it a shadow tree). A selector written from the outside, like <code>.nav svg path</code>, cannot match those copied paths, because they are not really children of your markup. That is why <code>fill</code> on a path selector seems to do nothing.')}
${p('What does get through is <strong>inheritance</strong>. The spec says elements in the copy inherit styles from their <code>&lt;use&gt;</code>. So <code>color</code>, <code>fill</code> and <code>stroke</code> set on the outer SVG flow in, as long as the symbol does not hard-code its own colours. And CSS custom properties (variables like <code>--accent</code>) are inherited too, which is the key to more than one colour.')}
${h3('How do I make a multi-colour sprite icon?')}
${p('Write each extra colour inside the symbol as a CSS variable with a fallback. Then set the variables from outside, per icon, per section or for the whole page. The old 2015 answers said variables were “only supported in Firefox”; every current browser has supported them for years.')}
${code(`<!-- in the sprite: the duo home icon's tint and accent are variables -->
<symbol id="with-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
  <path d="M5 9.6 L12 4.1 L19 9.6 V19 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 19 Z"
        fill="var(--with-duo, currentColor)" fill-opacity="0.2" stroke="none"/>
  <path d="M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21"
        stroke="var(--with-duo-accent, currentColor)"/>
  …
</symbol>

<!-- on the page: three independent colours -->
<svg width="32" height="32" style="color:#1e3a8a; --with-duo:#38bdf8; --with-duo-accent:#f59e0b">
  <use href="/sprite-duo.svg#with-home"/>
</svg>`)}
${p(`That is exactly how the with icons sprites are built: the main ink is <code>currentColor</code>, and every other colour is a <code>var(--with-…, #fallback)</code>. The ${L.style('duo')} style has a tint and an accent; multi-colour styles such as ${L.style('sticker')} or ${L.style('kawaii')} have a full palette of variables, so one sprite icon can be recoloured to match a brand without editing the file.`)}
${iconGrid(['home', 'bell', 'calendar', 'mail', 'settings', 'star'], 'duo', 'Duo icons: an outline in currentColor plus a tint and an accent you can set with two CSS variables.')}
${art('m-svg-sprites-recolour', 'One sprite symbol, three looks, set only with color and CSS variables on the page.', { brief: 'Three tiles side by side, each showing the same duo "home" icon from one sprite symbol at 96 px with a different colour set: navy outline with sky tint and amber accent; green outline with mint tint and coral accent; white outline on a dark tile with violet tint and pink accent. Under each tile, a tiny code label with the three values (color, --with-duo, --with-duo-accent). A caption strip on top: "same symbol, no file edits".' })}

${h2('Can I load an SVG sprite from a CDN or another domain?')}
${p('Not through <code>&lt;use&gt;</code>. Browsers only follow an external <code>&lt;use href&gt;</code> to a file on the same origin as the page (same protocol, domain and port). MDN is blunt about it: there is currently no defined way to set a cross-origin policy for <code>&lt;use&gt;</code>, so sending CORS headers from the CDN does not help. The SVG 2 spec itself says it does not allow cross-origin or <code>data:</code> URL requests here. This is the cause of most “my sprite works locally but not from the CDN” reports.')}
${p('You have four working options:')}
${table(['Option', 'How', 'Good for'], [
  ['Serve it yourself', 'Copy the sprite into your site’s files (a build step can do it) and point <code>href</code> at <code>/sprite.svg#id</code>', yes('Most sites. Cached once, reused everywhere')],
  ['Inline it in the HTML', 'Paste the sprite once near the top of <code>&lt;body&gt;</code>, hidden, and use <code>href="#id"</code>', yes('Small sprites, single pages')],
  ['Fetch and insert it', 'Load the file with <code>fetch()</code> (a CDN that sends CORS headers allows this) and add it to the page', meh('When you must use a CDN')],
  ['A blob: URL', 'Turn the fetched text into a Blob and use <code>URL.createObjectURL()</code>, as Chrome’s guide suggests', meh('Code that cannot touch the HTML')],
], 'Ways to use a sprite that lives on another domain')}
${p('The fetch route is the modern version of the old jQuery answers. jsDelivr, which serves the with icons packages, sends an <code>Access-Control-Allow-Origin: *</code> header, so this works:')}
${code(`<script type="module">
  const res = await fetch('https://cdn.jsdelivr.net/npm/@withicons/static@0.6.0/dist/sprite-line.svg')
  const box = document.createElement('div')
  box.setAttribute('aria-hidden', 'true')
  box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
  box.innerHTML = await res.text()
  document.body.prepend(box)
</script>
<svg width="24" height="24"><use href="#with-home"/></svg>`, 'html')}
${callout('warn', '<p>Two cautions. Only insert markup from a source you trust, and pin a version so the file cannot change under you. And when you hide an inline sprite, people report that gradients inside it can fail to paint in some browsers if the container uses <code>display: none</code>; the zero-size, <code>overflow: hidden</code> box above avoids that.</p>')}

${h2('Sprites, inline SVG or components: which should I use?')}
${table(['', 'Sprite', 'Inline SVG', 'Components'], [
  ['Icon code in the HTML', yes('One short line per icon'), meh('Full shapes every time'), yes('One tag per icon')],
  ['Needs JavaScript', yes('No'), yes('No'), meh('Yes, a framework')],
  ['Downloads only what you use', meh('Only if you build a small sprite'), yes('Yes'), yes('Yes, with tree-shaking')],
  ['Works across domains', no('Same origin only'), yes('Yes'), yes('Yes')],
  ['Colour with CSS', yes('currentColor + variables'), yes('Everything'), yes('Props or CSS')],
], 'Three ways to put SVG icons on a page (November 2026)')}
${doDont('<p>Use a sprite when a static site, CMS template or server-rendered page shows many icons of one style. Serve it from your own domain and build it from just the icons you use.</p>', '<p>Load a sprite of the whole library to show five icons, or point <code>&lt;use&gt;</code> at a CDN URL and wonder why nothing appears.</p>')}

${h2('Where are the with icons sprites?')}
${p(`In the ${L.page('developers.html', 'developer packages')}: <code>npm i @withicons/static</code> ships one sprite per style in <code>dist/</code>, named <code>sprite-line.svg</code>, <code>sprite-solid.svg</code> and so on, with symbol ids like <code>with-home</code>. The newest styles’ sprites are in <code>@withicons/static-plus</code>. Copy the file next to your pages, then use <code>&lt;use href="/sprite-line.svg#with-home"/&gt;</code>.`)}
${p(`Be honest with yourself about size: each sprite holds all ${N_ICONS} icons of its style. The line sprite is about 419 KB before compression, and the richer styles run to several megabytes. That is fine for a docs site that shows hundreds of icons, and wasteful for a landing page with six. For a handful, use single SVG files, the ${L.page('free/svg-icons.html', 'free SVG downloads')}, or ${L.page('free/icons-for-react.html', 'React components')}, or build your own sprite from the symbols you need.`)}
${ul([
  '<strong>Symbol ids</strong> are <code>with-&lt;name&gt;</code>, for example <code>with-settings</code>.',
  '<strong>Colours</strong>: the ink is <code>currentColor</code>; extra colours are <code>--with-&lt;style&gt;-…</code> variables that sprites keep.',
  `<strong>Sizing</strong>: set width and height on the outer svg. Our ${L.post('svg-icon-cut-off-or-blurry', 'guide to cut-off and blurry icons')} explains why.`,
])}

${h2('The bottom line')}
${p(`SVG sprites still work well in 2026, and they are simpler than the old answers suggest: <code>&lt;symbol&gt;</code> plus <code>&lt;use href&gt;</code>, no polyfills, no <code>xlink</code>. Keep the file on your own domain, colour icons with <code>currentColor</code> and CSS variables, and only reach for a sprite when a page shows enough icons to make one file worth it. All ${N_ICONS} with icons come as sprites in each of the ${N_STYLES} styles.`)}
${cta('Sprites, components or single files', `${N_ICONS} icons in ${N_STYLES} styles as SVG sprites, React and Vue components, a web component or plain files. Free, MIT licensed.`, ['layers', 'link', 'palette', 'code', 'sparkles', 'check-circle'])}
`,
}
