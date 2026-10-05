// "Free icons for …" landers: real icon grids generated from the icon data, each answering one real query.
import { GUIDES } from '../site-pages/guides-data.mjs'
import { crumbs } from '../site-pages/lib.mjs'
import { I, esc, cvar, code, shell, picker, answer, faqBlock, faqLd, webPageLd, altLinks, freeLinks, cta, styleStrip, STYLES, STYLE_TITLE, ICON_NAMES, META, rawSvgSize, CHECKED } from './render.mjs'
import { moreLanders } from './free-more.mjs'
import { N_STYLES, word, stylesIn, listTitles, styleTitle, hasStyle } from '../site-pages/lib.mjs'
import { motionAssets } from '../site-pages/motion.mjs'

const G = Object.fromEntries(GUIDES.map(g => [g.slug, g]))
const N = ICON_NAMES.length, T = N * STYLES.length
const TOTAL = `${N} icons × ${STYLES.length} styles (${T.toLocaleString('en-US')} in all)`
const NS = N_STYLES

/* curated sets (validated against the icon data at build time) */
const SETS = {
  business: ['chart-bar', 'chart-line', 'chart-pie', 'trending-up', 'target', 'trophy', 'award', 'lightbulb', 'rocket', 'users', 'briefcase', 'building', 'globe', 'megaphone', 'dollar-sign', 'coins', 'wallet', 'percent', 'gauge', 'flag', 'route', 'compass', 'kanban', 'list-checks'],
  people: ['user', 'users', 'user-plus', 'user-check', 'user-circle', 'id-card', 'address-book', 'graduation-cap', 'headset', 'smile', 'heart', 'messages'],
  contact: ['mail', 'phone', 'map-pin', 'globe', 'at-sign', 'message-circle', 'calendar', 'clock', 'link', 'send', 'share', 'qr-code'],
  ui: ['home', 'search', 'settings', 'user', 'bell', 'menu', 'close', 'check', 'plus', 'minus', 'trash', 'pencil', 'download', 'upload', 'share', 'heart', 'star', 'bookmark', 'filter', 'sliders', 'lock', 'unlock', 'eye', 'eye-off'],
  arrows: ['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right', 'chevron-right', 'chevron-down', 'chevrons-up-down', 'external-link', 'refresh', 'undo', 'redo'],
  files: ['file', 'file-text', 'file-pdf', 'file-image', 'file-spreadsheet', 'file-code', 'folder', 'folder-open', 'archive', 'clipboard', 'copy', 'paperclip'],
  commerce: ['shopping-cart', 'shopping-bag', 'store', 'credit-card', 'receipt', 'tag', 'ticket', 'gift', 'truck', 'package', 'banknote', 'wallet'],
  status: ['check-circle', 'x-circle', 'alert-triangle', 'alert-circle', 'info-circle', 'help-circle', 'shield-check', 'badge-check', 'loader', 'zap', 'sparkles', 'flame'],
  media: ['play', 'pause', 'stop', 'skip-forward', 'volume', 'microphone', 'camera', 'image', 'film', 'music-note', 'headphones', 'video-camera'],
  dev: ['code', 'terminal', 'braces', 'git-branch', 'git-pull-request', 'bug', 'database', 'server', 'cpu', 'webhook', 'cloud', 'bot'],
  doc: ['lightbulb', 'sticky-note', 'book-open', 'bookmark', 'calendar-check', 'list-checks', 'target', 'rocket', 'brain', 'flag', 'pin', 'star', 'puzzle-piece', 'palette', 'pen-tool', 'graduation-cap'],
  design: ['pen-tool', 'palette', 'paintbrush', 'crop', 'layers', 'layout-grid', 'layout-dashboard', 'columns', 'ruler', 'wand', 'cursor', 'move', 'image', 'type', 'hexagon', 'square'],
  nature: ['sun', 'moon', 'cloud-sun', 'cloud-rain', 'snowflake', 'leaf', 'mountain', 'umbrella', 'droplet', 'flame', 'wind', 'thermometer'],
  fun: ['rocket', 'sparkles', 'heart', 'star', 'smile', 'gift', 'coffee', 'music-note', 'gamepad', 'crown', 'trophy', 'lightbulb', 'camera', 'plane', 'map', 'puzzle-piece'],
}

const howFromGuide = (slug, p) => {
  const g = G[slug]
  return `<div class="ax-how-guide" style="--g:${cvar(g.color)}">
    <p class="ax-kicker">${esc(g.app)} in one line</p>
    <p class="ax-how-short">${g.short}</p>
    <p class="ax-how-why"><b>Best format: ${esc(g.format.best)}${g.format.size && !/any|copy/.test(g.format.size) ? ` at ${esc(g.format.size)}` : ''}.</b> ${esc(g.format.why)}</p>
    <a class="btn btn-ghost btn-sm" href="${p}guides/${slug}.html">Step-by-step ${esc(g.app)} guide with pictures ${I('arrow-right', 'line', 16, 'arr')}</a>
  </div>`
}
const steps = list => `<ol class="ax-steps">${list.map(([t, d], i) => `<li data-reveal style="--d:${i}"><span class="ax-step-n">${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol>`
const facts = rows => `<div class="pg-table-wrap ax-facts"><table class="pg-table"><caption class="pg-sr">Quick facts</caption><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>`
const BASE_FACTS = p => [
  ['Price', 'Free. No account, no paid tier, no watermark.'],
  ['Licence', `MIT: personal and commercial use, no credit required (<a href="${p}license.html">licence in plain words</a>).`],
  ['Icons', `${TOTAL}, every style on the same 24 × 24 grid.`],
]

const BASE_LANDERS = [
  {
    slug: 'svg-icons', short: 'Free SVG icons', icon: 'file-code', color: 'line',
    title: `Free SVG icons: ${N} icons in ${NS} styles, MIT licensed · with icons`,
    desc: `Free SVG icons you can copy or download in one click: ${N} icons in ${NS} styles on a 24 × 24 grid, currentColor, MIT licensed, no account or attribution needed.`,
    h1: ['Free SVG icons,', 'copy in one click'], q: 'free SVG icons',
    answer: () => `with icons gives you <b>${N} free SVG icons in ${NS} styles</b> (${T.toLocaleString('en-US')} files in all), MIT licensed, with no sign-up and no credit required. Every icon is a clean <code>viewBox="0 0 24 24"</code> SVG that uses <code>currentColor</code>, so it takes the colour of the text around it. Click any icon below to copy its SVG code, or download the file.`,
    picker: { actions: ['svg', 'dlsvg', 'png'], groups: [['Interface', SETS.ui], ['Arrows', SETS.arrows], ['Files', SETS.files], ['Status', SETS.status]] },
    body: p => `
<section class="ax-split" aria-labelledby="svg-why">
  <div><p class="ax-kicker">Why SVG</p><h2 id="svg-why">Sharp at any size, tiny on disk</h2>
  <p>SVG is drawing instructions, not pixels, so an icon stays crisp from a 16 px button to a billboard. A Line icon here averages about <b>${rawSvgSize('line')} bytes</b>. You can change its colour with CSS, in Figma, PowerPoint or Canva, and it never goes blurry.</p>
  ${facts([...BASE_FACTS(p), ['File', '<code>viewBox="0 0 24 24"</code>, <code>width</code>/<code>height</code> 24, <code>currentColor</code>. Line strokes are 1.75 wide with round caps.'], ['Formats', 'SVG (copy or download), PNG at any size, an SVG sprite per style, and <code>&lt;i&gt;</code> tag classes.']])}</div>
  <div>${code(rawSvgCode('home'), 'html', 'home.svg (Line)')}<p class="pg-note">That’s the whole file. Paste it straight into HTML, Figma or a code editor.</p></div>
</section>
<section aria-labelledby="svg-use"><div class="ax-sec-head"><p class="ax-kicker">Use them</p><h2 id="svg-use">Three ways to use an SVG icon</h2></div>
  ${steps([
    ['Paste it inline', 'Copy the SVG and paste it into your HTML. It inherits the text colour, so <code>color: tomato</code> on the parent recolours it.'],
    ['Use it as an image', 'Download the .svg file and use it like any picture: <code>&lt;img src="home.svg" alt="Home"&gt;</code>, or drop it into PowerPoint, Word, Canva or Figma.'],
    ['Use a class instead', `One setup line, then <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code>. See <a href="${p}free/font-awesome-style-icon-classes.html">icon classes</a>.`],
  ])}
</section>`,
    faq: p => [
      ['Are these SVG icons really free for commercial use?', `Yes. Every icon is MIT licensed: use it in client work, products, apps and print without paying or giving credit. <a href="${p}license.html">Read the licence</a>.`],
      ['How do I change the colour of an SVG icon?', 'The SVGs use currentColor, so on a website they follow the CSS color of their parent. In this picker, choose a colour before you copy or download and it’s baked into the file.'],
      ['What size are the SVG icons?', 'Each one is drawn on a 24 × 24 grid. Because they are vectors you can scale them to any size without losing quality.'],
      ['Can I edit the SVG files?', 'Yes. Open them in Figma, Illustrator, Inkscape or a text editor and change anything you like.'],
    ],
    related: ['png-icons', 'font-awesome-style-icon-classes', 'icons-for-figma'],
  },
  {
    slug: 'png-icons', short: 'Free PNG icons', icon: 'file-image', color: 'solid',
    title: 'Free PNG icons with a transparent background, any colour · with icons',
    desc: `Download free PNG icons with a transparent background at 256, 512 or 1024 px, in any colour: ${N} icons in ${NS} styles for slides, docs, Notion and email. No account.`,
    h1: ['Free PNG icons,', 'see-through background'], q: 'free PNG icons with a transparent background',
    answer: () => `Pick an icon below, choose a colour and a size (256, 512 or 1024 px), and click it: you get a <b>PNG with a transparent background</b>, made right in your browser. All ${N} icons in ${NS} styles are free and MIT licensed, with no account and no credit needed.`,
    picker: { actions: ['dl', 'png'], groups: [['Business', SETS.business.slice(0, 12)], ['People & contact', [...SETS.people.slice(0, 6), ...SETS.contact.slice(0, 6)]], ['Everyday', SETS.ui.slice(0, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="png-size">
  <div><p class="ax-kicker">Which size?</p><h2 id="png-size">Pick a PNG twice the size you’ll show it</h2>
  <p>A PNG is made of pixels, so it gets blurry when stretched. Download one at least twice as big as it will appear and it stays sharp on high-resolution screens.</p>
  ${facts([['256 px', `Notion page icons, email signatures, small icons in documents. <a href="${p}guides/notion.html">Notion guide</a>`], ['512 px', `Slides and docs: sharp up to about half a slide wide. <a href="${p}guides/google-slides.html">Google Slides guide</a>`], ['1024 px', 'Full-screen slides, posters, anything big.'], ['Background', 'Always transparent, so icons sit on any colour.']])}</div>
  <div class="ax-png-demo" aria-hidden="true">${['#111318', '#FFFFFF', '#FF5A36', '#2F5BFF'].map((c, i) => `<span style="--bg:${['#FFD23F', '#111318', '#FBF8F3', '#E8EEFF'][i]};color:${c}">${I(['rocket', 'lightbulb', 'heart', 'chart-pie'][i], ['solid', 'line', 'gloss', 'duo'][i], 64)}</span>`).join('')}<p class="hand">same PNG, any background</p></div>
</section>`,
    faq: p => [
      ['Do the PNG icons have a transparent background?', 'Yes. Every PNG you download or copy here has a see-through background, so it works on any slide or page colour.'],
      ['How do I get a white PNG icon?', 'Choose White in the colour row before you click the icon. The preview switches to a dark background so you can see it.'],
      ['PNG or SVG: which should I use?', `Use SVG when your app accepts it (PowerPoint, Word, Canva, Figma, websites): it never goes blurry. Use PNG for Google Slides, Google Docs, Notion and email. <a href="${p}free/svg-icons.html">Free SVG icons</a>.`],
      ['Can I use the PNGs commercially?', 'Yes, MIT licensed. No credit needed.'],
    ],
    related: ['svg-icons', 'icons-for-google-slides', 'icons-for-notion'],
  },
  {
    slug: 'icons-for-powerpoint', short: 'Icons for PowerPoint', icon: 'chart-bar', color: 'solid', guide: 'powerpoint',
    title: 'Free icons for PowerPoint: SVG you can recolour · with icons',
    desc: `Free icons for PowerPoint presentations: download SVGs you can recolour with Graphics Fill, or copy a PNG and paste. ${N} business-ready icons in ${NS} styles, no credit needed.`,
    h1: ['Free icons for', 'PowerPoint'], q: 'free icons for PowerPoint',
    answer: () => `Download any icon below as an <b>SVG</b> and insert it with <b>Insert › Pictures › This Device</b>; PowerPoint (Microsoft 365, 2019 and newer) keeps it sharp and lets you recolour it with Graphics Fill. In a hurry? Choose <b>Copy PNG</b>, click an icon and paste it onto your slide. All ${N} icons in ${NS} styles are free, with no credit needed.`,
    picker: { actions: ['dlsvg', 'png', 'dl'], groups: [['Business & results', SETS.business], ['People', SETS.people], ['Contact & agenda', SETS.contact]] },
    body: p => `
<section class="ax-split" aria-labelledby="pp-how">
  <div><p class="ax-kicker">How</p><h2 id="pp-how">From this page to your slide</h2>${howFromGuide('powerpoint', p)}</div>
  <div>${steps([
    ['Pick a style that matches the deck', 'Line for clean corporate slides, Solid for bold title slides, Duo for a friendly touch, Gloss or Sketch for playful ones.'],
    ['Download the SVG and insert it', 'Insert › Pictures › This Device, then pick the file. Drag a corner handle to resize.'],
    ['Recolour to your theme', 'Select the icon, then Graphics Format › Graphics Fill. Using a Line icon? Change Graphics Outline too.'],
  ])}</div>
</section>`,
    faq: p => [
      ['Does PowerPoint support SVG icons?', `Yes: PowerPoint in Microsoft 365 and PowerPoint 2019 or newer can insert SVG files and recolour them. On PowerPoint 2016 or older, use a 512 px PNG instead. <a href="${p}guides/powerpoint.html">Full guide</a>.`],
      ['How do I change an icon’s colour in PowerPoint?', 'Select the SVG and use Graphics Fill (and Graphics Outline for line icons). Or pick a colour here before you download.'],
      ['Can I use these icons in a client or company presentation?', 'Yes. The icons are MIT licensed: free for commercial use with no attribution.'],
      ['Which icon style works best for business presentations?', 'Line is the safest choice for most decks. Solid stands out on title slides. Keep one style per deck so slides look consistent.'],
    ],
    related: ['icons-for-google-slides', 'png-icons', 'icons-for-canva'],
  },
  {
    slug: 'icons-for-google-slides', short: 'Icons for Google Slides', icon: 'monitor', color: 'line', guide: 'google-slides',
    title: 'Free icons for Google Slides: transparent PNGs, any colour · with icons',
    desc: `Free icons for Google Slides: copy a transparent PNG and paste it, or download one at 512 px. ${N} icons in ${NS} styles in any colour. No account, no credit needed.`,
    h1: ['Free icons for', 'Google Slides'], q: 'free icons for Google Slides', px: 512,
    answer: () => `Google Slides doesn’t accept SVG files, so use a <b>PNG</b>. Pick a colour, click an icon below to copy it as a transparent PNG and paste it onto your slide with <kbd>Ctrl</kbd>+<kbd>V</kbd> (<kbd>⌘</kbd>+<kbd>V</kbd> on Mac). Or download a 512 px PNG and use <b>Insert › Image › Upload from computer</b>. All ${N} icons in ${NS} styles are free and need no credit.`,
    picker: { actions: ['png', 'dl'], groups: [['Business & results', SETS.business], ['School & ideas', SETS.doc], ['Contact', SETS.contact]] },
    body: p => `
<section class="ax-split" aria-labelledby="gs-how">
  <div><p class="ax-kicker">How</p><h2 id="gs-how">From this page to your slide</h2>${howFromGuide('google-slides', p)}</div>
  <div>${steps([
    ['Choose the colour first', 'Slides can only tint images, not truly recolour them. Pick your theme colour (or White for dark slides) before you copy.'],
    ['Copy, then paste', 'Click an icon with Copy PNG selected, switch to your slide and paste. If your browser can’t copy images, the PNG downloads instead.'],
    ['Resize from a corner', 'Drag a corner handle so it keeps its shape. 512 px stays sharp up to about half a slide; use 1024 px for full-screen.'],
  ])}</div>
</section>`,
    faq: p => [
      ['Why can’t I insert an SVG into Google Slides?', `Google Slides accepts images such as PNG, JPG and GIF, not SVG. Use a transparent PNG: <a href="${p}guides/google-slides.html">see the guide</a>.`],
      ['How do I make an icon white for a dark slide?', 'Choose White in the colour row here, then copy or download. The preview turns dark so you can see the icon.'],
      ['Why does my icon look blurry in Slides?', 'It was stretched past its size. Download it again at 1024 px.'],
      ['Are these icons free to use in school and work presentations?', 'Yes, MIT licensed, no credit needed.'],
    ],
    related: ['icons-for-powerpoint', 'png-icons', 'icons-for-notion'],
  },
  {
    slug: 'icons-for-canva', short: 'Icons for Canva', icon: 'palette', color: 'gloss', guide: 'canva',
    title: 'Free icons for Canva: upload SVGs and recolour them · with icons',
    desc: `Free icons for Canva designs: download SVGs, upload them to Canva and change their colour in the editor. ${N} icons in ${NS} styles, including hand-drawn and glossy ones.`,
    h1: ['Free icons for', 'Canva'], q: 'free icons for Canva', style: 'gloss',
    answer: () => `Download an icon below as an <b>SVG</b>, upload it in Canva’s <b>Uploads</b> panel, then click it to add it to your design; Canva lets you change an SVG’s colour from the toolbar. All ${N} icons come in ${NS} styles, from clean Line to glossy, engraved and hand-drawn, free and with no credit needed.`,
    picker: { actions: ['dlsvg', 'dl', 'png'], style: 'gloss', groups: [['Social & fun', SETS.fun], ['Business', SETS.business.slice(0, 12)], ['Nature & weather', SETS.nature]] },
    body: p => `
<section class="ax-split" aria-labelledby="cv-how">
  <div><p class="ax-kicker">How</p><h2 id="cv-how">From this page to your design</h2>${howFromGuide('canva', p)}</div>
  <div>${steps([
    ['Pick a style with personality', `Gloss for playful posts, Sketch for a hand-made feel, Engrave for classic invitations, Line for clean infographics${hasStyle('kawaii') ? ', Kawaii or Sticker for cute social posts' : ''}${hasStyle('retro') ? ', Retro for vintage flyers' : ''}.`],
    ['Download the SVG and upload it', 'Uploads › Upload files. Your icons stay in Uploads for every design.'],
    ['Recolour it in Canva', 'Select the icon and click the colour swatch in the top toolbar.'],
  ])}</div>
</section>`,
    faq: p => [
      ['Can I upload SVG icons to Canva?', `Yes. Canva accepts SVG uploads and lets you change their colours in the editor. <a href="${p}guides/canva.html">Step-by-step guide</a>.`],
      ['Why can’t I change the colour of my icon in Canva?', 'You probably uploaded a PNG. Upload the SVG version instead.'],
      ['Can I use these icons in designs I sell?', `Yes. The icons are MIT licensed, so commercial use is fine. You can’t claim the icons themselves as your own trademark; see <a href="${p}license.html">the licence</a>.`],
    ],
    related: ['hand-drawn-icons', 'icons-for-figma', 'svg-icons'],
  },
  {
    slug: 'icons-for-figma', short: 'Icons for Figma', icon: 'pen-tool', color: 'engrave', guide: 'figma',
    title: 'Free icons for Figma: copy SVG, paste as vectors · with icons',
    desc: `Free icons for Figma: click Copy SVG and paste onto the canvas as editable vectors. ${N} icons in ${NS} styles on one 24 × 24 grid, ready to turn into components. MIT.`,
    h1: ['Free icons for', 'Figma'], q: 'free icons for Figma',
    answer: () => `Click any icon below to copy its SVG, then press <kbd>Ctrl</kbd>+<kbd>V</kbd> (<kbd>⌘</kbd>+<kbd>V</kbd>) on your Figma canvas: it pastes as <b>editable vector layers</b>, no plugin or download needed. All ${N} icons share one 24 × 24 grid across ${NS} styles, so you can swap Line for Solid without nudging a pixel.`,
    picker: { actions: ['svg', 'dlsvg'], groups: [['Interface', SETS.ui], ['Design tools', SETS.design], ['Arrows', SETS.arrows]] },
    body: p => `
<section class="ax-split" aria-labelledby="fg-how">
  <div><p class="ax-kicker">How</p><h2 id="fg-how">From this page to your file</h2>${howFromGuide('figma', p)}</div>
  <div>${steps([
    ['Copy SVG, paste on the canvas', 'It arrives as a 24 × 24 frame of vector layers.'],
    ['Scale with K', 'Press K (Scale tool) before resizing so line weights scale with the icon.'],
    ['Make it a component', 'Select it and press Ctrl+Alt+K (⌘+⌥+K). Swap icons with instance swap later.'],
  ])}</div>
</section>`,
    faq: p => [
      ['Is there a Figma plugin?', `Not yet. You don’t need one: Copy SVG and paste is the fastest way, and it keeps everything as vectors. <a href="${p}guides/figma.html">Figma guide</a>.`],
      ['Why did my icon paste as an image?', 'You copied a PNG. Choose Copy SVG and copy it again.'],
      ['Do all styles line up?', 'Yes. Every style is drawn on the same 24 × 24 grid with the same names, so swapping styles never shifts your layout.'],
    ],
    related: ['svg-icons', 'icons-for-react', 'icons-for-canva'],
  },
  {
    slug: 'icons-for-notion', short: 'Icons for Notion', icon: 'sticky-note', color: 'sketch', guide: 'notion', px: 256,
    title: 'Free Notion icons: custom page and callout icons (PNG) · with icons',
    desc: `Free custom icons for Notion pages and callouts: download a 256 px transparent PNG in any colour and upload it. ${N} icons in ${NS} styles, including hand-drawn. No credit needed.`,
    h1: ['Free icons for', 'Notion'], q: 'free Notion icons', style: 'sketch',
    answer: () => `Pick a colour, click an icon below to download a <b>256 px transparent PNG</b>, then in Notion hover over the page title, click <b>Add icon</b>, open <b>Upload</b> and choose the file. The same works for callout icons. All ${N} icons in ${NS} styles are free with no credit needed; a mid-tone colour looks good in both light and dark mode.`,
    picker: { actions: ['dl', 'png'], style: 'sketch', px: 256, groups: [['Pages & projects', SETS.doc], ['Life & fun', SETS.fun.slice(0, 12)], ['Work', SETS.business.slice(0, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="nt-how">
  <div><p class="ax-kicker">How</p><h2 id="nt-how">From this page to your workspace</h2>${howFromGuide('notion', p)}</div>
  <div>${steps([
    ['Choose a mid-tone colour', 'Cobalt, Tomato, Violet or Leaf read well in both Notion’s light and dark mode. Black disappears in dark mode.'],
    ['Download at 256 px', 'Page and callout icons are small squares; 256 px is crisp on every screen.'],
    ['Upload it as the page icon', 'Add icon › Upload. For a callout, click its icon and choose Upload.'],
  ])}</div>
</section>`,
    faq: p => [
      ['How do I add a custom icon to a Notion page?', `Hover over the page title, click Add icon, switch to the Upload tab and choose your PNG. <a href="${p}guides/notion.html">Notion guide</a>.`],
      ['What size should a Notion icon be?', '256 px is plenty for page and callout icons. Use 512 px for images inside a page.'],
      ['Can I change the colour of an icon inside Notion?', 'No, Notion can’t recolour images. Download the icon again in the colour you want.'],
    ],
    related: ['png-icons', 'hand-drawn-icons', 'icons-for-google-slides'],
  },
  {
    slug: 'icons-for-react', short: 'Icons for React', icon: 'code', color: 'duo', dev: true,
    title: 'Free React icons: copy as JSX today, @withicons/react soon · with icons',
    desc: `Free icons for React: copy any of ${N} icons in ${NS} styles as a ready JSX component now; the tree-shakable @withicons/react package is launching on npm soon. MIT licensed.`,
    h1: ['Free icons for', 'React'], q: 'free React icons',
    answer: () => `Click any icon below to copy it as a <b>ready React component</b> (JSX, <code>currentColor</code>, props spread onto the svg) and paste it into your project today. A typed, tree-shakable package, <code>@withicons/react</code>, with all ${N} icons in ${NS} styles is <b>launching on npm soon</b>. Everything is MIT licensed.`,
    picker: { actions: ['jsx', 'svg'], groups: [['Interface', SETS.ui], ['Status', SETS.status], ['Developer', SETS.dev]] },
    body: p => `
<section class="ax-split" aria-labelledby="re-pkg">
  <div><p class="ax-kicker">The package <span class="pg-soon">${I('sparkles', 'solid', 14)} launching on npm soon</span></p><h2 id="re-pkg">One import per icon, any style</h2>
  <p>The default import is the Line style; every other style is a subpath with the same names. Only the icons you import end up in your bundle. Until it’s published, copy JSX from the grid above or download the <a href="${p}developers.html#cdn">sprites and CSS</a>.</p>
  ${facts([['Package', '<code>@withicons/react</code> (React 18+)'], ['Props', '<code>size</code>, <code>color</code>, <code>strokeWidth</code>, <code>absoluteStrokeWidth</code>, <code>title</code>, <code>className</code>'], ['Accessibility', 'aria-hidden by default; pass <code>title</code> for a labelled icon'], ['Licence', 'MIT']])}</div>
  <div>${code(`import { Home, Search } from '@withicons/react'          // line (default)
import { Home as HomeSolid } from '@withicons/react/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}`, 'jsx', 'Toolbar.jsx')}<p class="pg-note">All props and frameworks: <a href="${p}developers.html">developer docs</a>.</p></div>
</section>`,
    faq: p => [
      ['Is @withicons/react available on npm?', `Not yet: it is launching soon under that name. Today you can copy any icon as JSX from this page, or download the SVG sprites and CSS from the <a href="${p}developers.html">developer page</a>.`],
      ['Will the React icons be tree-shakable?', 'Yes. Each icon is its own ES module export, so bundlers keep only the icons you import.'],
      ['Can I use the icons with Next.js?', 'Yes. The copied JSX components are plain function components with no hooks, so they work in server and client components.'],
      ['Are there icons for Vue, Svelte and Angular too?', `Yes, the same icons and props: <a href="${p}free/icons-for-vue.html">Vue</a>, plus Svelte, Angular, Solid and a web component on the <a href="${p}developers.html">developer page</a>.`],
    ],
    related: ['icons-for-vue', 'font-awesome-style-icon-classes', 'svg-icons'],
  },
  {
    slug: 'icons-for-vue', short: 'Icons for Vue', icon: 'code', color: 'sketch', dev: true,
    title: 'Free Vue icons: paste SVG in templates, @withicons/vue soon · with icons',
    desc: `Free icons for Vue 3: copy any of ${N} icons in ${NS} styles as inline SVG for your templates today; the @withicons/vue component package is launching on npm soon. MIT.`,
    h1: ['Free icons for', 'Vue'], q: 'free Vue icons',
    answer: () => `Click an icon below to copy its <b>SVG</b> and paste it straight into a Vue template: it uses <code>currentColor</code>, so it follows your text colour and dark mode. The component package <code>@withicons/vue</code> (Vue 3) with all ${N} icons in ${NS} styles is <b>launching on npm soon</b>. MIT licensed.`,
    picker: { actions: ['vue', 'dlsvg'], groups: [['Interface', SETS.ui], ['Commerce', SETS.commerce], ['Developer', SETS.dev]] },
    body: p => `
<section class="ax-split" aria-labelledby="vu-pkg">
  <div><p class="ax-kicker">The package <span class="pg-soon">${I('sparkles', 'solid', 14)} launching on npm soon</span></p><h2 id="vu-pkg">Same names, same props as React</h2>
  <p>Import icons as components; the default is Line and other styles are subpaths. Until it’s published, paste inline SVG from the grid or use the <a href="${p}free/font-awesome-style-icon-classes.html">icon classes</a>.</p>
  ${facts([['Package', '<code>@withicons/vue</code> (Vue 3)'], ['Props', '<code>size</code>, <code>color</code>, <code>stroke-width</code>, <code>title</code>'], ['Licence', 'MIT']])}</div>
  <div>${code(`<script setup>
import { Home, Search } from '@withicons/vue'
import { Home as HomeSolid } from '@withicons/vue/solid'
</script>

<template>
  <Home />
  <Search :size="20" :stroke-width="1.5" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>`, 'vue', 'Toolbar.vue')}</div>
</section>`,
    faq: p => [
      ['Is @withicons/vue on npm yet?', `It’s launching soon. Today, paste inline SVG from this page, or download sprites and CSS from the <a href="${p}developers.html">developer page</a>.`],
      ['Does it work with Nuxt?', 'Yes. Inline SVG works anywhere in Nuxt templates, and the component package targets Vue 3, which Nuxt 3 uses.'],
      ['How do I colour the icons in Vue?', 'They use currentColor: set the CSS color on the icon or its parent, e.g. with a Tailwind text class.'],
    ],
    related: ['icons-for-react', 'font-awesome-style-icon-classes', 'svg-icons'],
  },
  {
    slug: 'font-awesome-style-icon-classes', short: 'Icon classes (<i> tags)', icon: 'hash', color: 'blueprint', dev: true,
    title: 'Font Awesome-style icon classes: <i class="with with-home"> · with icons',
    desc: `Use free icons the Font Awesome way: one stylesheet, then <i class="with with-home"></i>. ${N} icons in ${NS} styles as CSS classes, no JavaScript, plus size, spin and flip modifiers.`,
    h1: ['Icon classes,', 'the Font Awesome way'], q: 'icon classes like Font Awesome',
    answer: () => `Add one small loader script, then write <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code> anywhere in your HTML: that’s the same pattern Font Awesome made popular, and the page downloads only the icons it shows. Prefer no JavaScript? Link one stylesheet per style instead. Add a style class such as <code>with-solid</code> or <code>with-sketch</code> for the other ${NS - 1} styles, and modifiers like <code>with-2x</code>, <code>with-spin</code> or <code>with-flip-h</code>. Click an icon below to copy its tag.`,
    picker: { actions: ['class'], colors: false, groups: [['Interface', SETS.ui], ['Arrows', SETS.arrows], ['Commerce', SETS.commerce]] },
    body: p => `
<section class="ax-split" aria-labelledby="ic-setup">
  <div><p class="ax-kicker">Set up</p><h2 id="ic-setup">One setup line, then plain tags</h2>
  <p>Each icon is a CSS mask over <code>currentColor</code>, sized <code>1em</code>, so it scales with font size and takes the text colour. The loader (about 6 KB gzipped) links just the CSS of the icons on the page, in any mix of styles: a line icon is about 270 bytes gzipped. No JavaScript? Link one stylesheet per style; <code>with-line.css</code> holds all ${N} line icons in about 26 KB gzipped. The CDN link is <span class="pg-soon">${I('sparkles', 'solid', 14)} launching soon</span>; today, download <a href="${p}vendor/with/with-line.css">with-line.css</a> and host it yourself.</p>
  ${facts([['Base class', '<code>with</code> plus <code>with-&lt;name&gt;</code>'], ['Styles', '<code>with-solid</code>, <code>with-duo</code>, <code>with-gloss</code>, <code>with-engrave</code>, <code>with-blueprint</code>, <code>with-sketch</code> and more (the loader fetches each one; without it, link that style’s CSS)'], ['Sizes', '<code>with-xs</code>, <code>with-sm</code>, <code>with-lg</code>, <code>with-2x</code> … <code>with-5x</code>, <code>with-fw</code>'], ['Motion & flips', '<code>with-spin</code>, <code>with-pulse</code>, <code>with-rotate-90</code>, <code>with-flip-h</code>, <code>with-flip-v</code>'], ['Aliases', `With the optional runtime, alias names work too: <code>with-bin</code> → trash`]])}</div>
  <div>${code(`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-home with-solid"></i>
<i class="with with-settings with-2x with-spin"></i>
<button><i class="with with-trash" aria-hidden="true"></i> Delete</button>`, 'html', 'index.html')}
  <p class="pg-note">Coming from Font Awesome? <a href="${p}alternatives/font-awesome.html">See the class-name map and converter</a>.</p></div>
</section>`,
    faq: p => [
      ['Do I need JavaScript for the icon classes?', 'No. The small loader script is the lightest setup (it fetches only the icons on the page), but a stylesheet per style renders every icon of that style with no JavaScript at all. An optional runtime script adds live CSS colour variables and alias names.'],
      ['How do I make an icon bigger?', 'Icons are 1em, so they follow font-size. Use with-lg or with-2x to with-5x, or set font-size yourself.'],
      ['Is this compatible with Font Awesome class names?', `The pattern is the same but the names differ (fa-house → with-home). The <a href="${p}alternatives/font-awesome.html">Font Awesome page</a> has a name map and a converter.`],
      ['How do I make an icon accessible?', 'Decorative icons next to text: add aria-hidden="true". Icon-only buttons: put aria-label on the button.'],
    ],
    related: ['svg-icons', 'icons-for-react', 'icons-for-vue'],
  },
  {
    slug: 'hand-drawn-icons', short: 'Hand-drawn icons', icon: 'pencil', color: 'sketch',
    title: `Free hand-drawn icons: ${N} sketch-style SVG & PNG icons · with icons`,
    desc: `Free hand-drawn (sketch style) icons: ${N} marker-drawn icons as SVG or transparent PNG for slides, social posts, notes and friendly websites. MIT licensed, no credit.`,
    h1: ['Free hand-drawn', 'icons'], q: 'free hand-drawn icons', style: 'sketch',
    answer: () => `The <b>Sketch</b> style draws all ${N} icons as if by hand with a marker: wobbly, warm and human, as real SVG vectors. Click an icon below to copy its SVG, copy a PNG or download one in any colour. Free, MIT licensed, no credit needed. Because Sketch shares names and grid with the other ${NS - 1} styles, you can switch to a clean Line version of the same icon at any time.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'sketch', groups: [['Ideas & notes', SETS.doc], ['Fun', SETS.fun], ['Nature', SETS.nature]] },
    body: p => `
<section class="ax-split" aria-labelledby="hd-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="hd-where">Made for big, friendly moments</h2>
  <p>Hand-drawn icons have fine detail, so they look best at 32 px and larger: slides, posters, social posts, onboarding screens, notes and empty states. For tiny interface buttons, use Line or Solid.</p>
  ${facts([...BASE_FACTS(p), ['Style family', `Sketch is one of ${word(stylesIn('creative').length)} creative styles (with ${stylesIn('creative').filter(s => s !== 'sketch').map(s => `<a href="${p}styles/${s}.html">${styleTitle(s)}</a>`).join(', ')}). <a href="${p}styles/sketch.html">See every Sketch icon</a>.`]])}</div>
  <div class="ax-sketch-demo" aria-hidden="true">${['lightbulb', 'rocket', 'heart', 'coffee', 'star', 'smile'].map((n, i) => `<span style="--i:${i}">${I(n, 'sketch', 56)}</span>`).join('')}<p class="hand">drawn, not traced</p></div>
</section>`,
    faq: p => [
      ['Are the hand-drawn icons vectors?', 'Yes. They are real SVG paths, so they stay sharp at any size and can be recoloured.'],
      ['Can I use the sketch icons in a logo or product?', `You can use them commercially under MIT. For a logo, remember anyone else can use the same icon; customise it. <a href="${p}license.html">Licence</a>.`],
      ['What size should hand-drawn icons be?', '32 px and up. At very small sizes the marker texture gets lost, so switch to Line there.'],
    ],
    related: ['icons-for-canva', 'icons-for-notion', 'png-icons'],
  },
]

export const LANDERS = [...BASE_LANDERS, ...moreLanders({ steps, facts, BASE_FACTS, N, T })]

function rawSvgCode(n) { return rawSvgSize.raw(n) }

function lander(L, all, libs) {
  const path = `free/${L.slug}.html`, p = '../'
  const style = L.style || 'line'
  const qs = L.faq(p)
  const body = `
<div class="ax-page" style="--g:${cvar(L.color)}">
  <section class="pg-hero ax-hero">
    ${crumbs([['Home', p + 'index.html'], ['Free icons', p + 'free/index.html'], [esc(L.short), null]])}
    <div class="ax-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">${esc(L.q)}</span></p>
        <h1 class="pg-title ax-title">${L.h1[0]} <span class="pg-hl" style="--g:${cvar(L.color)}">${L.h1[1]}</span></h1>
        ${answer(L.answer(), { checked: false })}
      </div>
      <div class="ax-hero-art" aria-hidden="true"><div class="ax-hero-badge s-${L.color}">${I(L.icon, style === 'line' ? 'duo' : style, 120)}</div>${styleStrip(L.icon, 30)}</div>
    </div>
  </section>
  ${picker({ id: 'pick', p, style, px: L.px || L.picker.px || 512, motion: !!L.motion, ...L.picker, heading: L.dev ? 'Pick an icon, copy the code' : 'Pick an icon, click to get it', intro: `A starter set for ${esc(L.short.replace(/^Free /, '').replace(/^Icons for /, ''))}. Search to find any of all ${N}.` })}
  ${L.body(p)}
  ${faqBlock('faq-h', qs)}
  <section class="ax-more" aria-label="Related pages">
    ${freeLinks(p, all, L.slug, 'Free icons for other apps')}
    ${altLinks(p, libs.slice(0, 8), null, 'Switching from another icon library?')}
  </section>
  ${cta(p)}
</div>`
  const ld = [webPageLd({ path, name: L.title.replace(/ · with icons$/, ''), description: L.desc }), faqLd(qs)]
  shell({ path, title: L.title, desc: L.desc, current: '', body, ld, crumbsLd: [['Home', ''], ['Free icons', 'free/index.html'], [L.short, path]], bodyClass: 'ax-free' + (L.motion ? ' ax-motion' : ''), modified: CHECKED, motion: !!L.motion })
  return { url: '/' + path, title: L.title.replace(/ · with icons$/, ''), summary: L.desc }
}

function hub(all, libs) {
  const path = 'free/index.html', p = '../'
  const title = 'Free icons for slides, docs, design tools and code · with icons'
  const desc = `Free icon pages by task and style: SVG, transparent PNG, PowerPoint, Google Slides, Canva, Figma, Notion, React, Vue, icon classes, hand-drawn, cute, sticker, pixel, glass, retro, 3D, Bauhaus, skeuomorphic, anime, gothic, pastel, coquette, plush (for kids) and animated icons. ${N} icons × ${NS} styles, MIT.`
  const qs = [
    ['Are all of these icons free?', `Yes. Every one of the ${N} icons in all ${NS} styles is free under the MIT licence, for personal and commercial use, with no credit required.`],
    ['Do I need an account?', 'No. Click an icon to copy or download it. That’s it.'],
    ['Which file format should I use?', 'SVG when your app accepts it (PowerPoint, Word, Canva, Figma, websites). PNG for Google Slides, Google Docs, Notion and email.'],
  ]
  const groups = [['For slides & docs', ['icons-for-powerpoint', 'icons-for-google-slides', 'icons-for-notion', 'png-icons']], ['For design', ['icons-for-figma', 'icons-for-canva', 'svg-icons']], ['By style & motion', ['animated-icons', 'hand-drawn-icons', 'cute-icons', 'sticker-icons', 'pixel-icons', 'glassmorphism-icons', 'retro-icons', '3d-icons', 'bauhaus-icons', 'skeuomorphic-icons', 'anime-icons', 'gothic-icons', 'pastel-icons', 'coquette-icons', 'plush-icons']], ['For code', ['icons-for-react', 'icons-for-vue', 'font-awesome-style-icon-classes']]]
    .map(([g, slugs]) => [g, slugs.filter(s => all.some(l => l.slug === s))]).filter(([, s]) => s.length)
  const by = Object.fromEntries(all.map(l => [l.slug, l]))
  const body = `
<div class="ax-page">
  <section class="pg-hero ax-hero">
    ${crumbs([['Home', p + 'index.html'], ['Free icons', null]])}
    <div class="ax-hero-grid">
      <div>
        <p class="pg-eyebrow"><span class="hand">free, for whatever you’re making</span></p>
        <h1 class="pg-title ax-title">Free icons for <span class="pg-hl" style="--g:${cvar('solid')}">every tool</span></h1>
        ${answer(`with icons is a free, MIT-licensed set of <b>${TOTAL}</b>. Pick the page for the app you’re using: each one has a ready icon grid, the right file format and click-to-copy or download.`, { checked: false })}
      </div>
      <div class="ax-hero-art" aria-hidden="true">
        <div class="ax-apps">${all.map((l, i) => `<span class="s-${l.color}" style="--i:${i}">${I(l.icon, l.style || 'duo', 34)}</span>`).join('')}</div>
        <p class="ax-swap-note hand">one set, every app</p>
      </div>
    </div>
  </section>
  ${groups.map(([g, slugs], gi) => `<section class="ax-cards-sec" aria-labelledby="fg-${gi}"><h2 id="fg-${gi}" class="ax-h2">${g}</h2>
    <ul class="ax-cards">${slugs.map((s, i) => { const l = by[s]; return `<li data-reveal style="--d:${i % 4};--g:${cvar(l.color)}"><a class="ax-card" href="${s}.html"><span class="ax-card-ic">${I(l.icon, l.style && l.style !== 'line' ? l.style : 'duo', 36)}</span><b>${esc(l.short)}</b><span>${esc(l.desc.split('. ')[0].replace(/^[^:]*: /, '')).replace(/^./, c => c.toUpperCase())}</span>${I('arrow-right', 'line', 18, 'ax-card-arr')}</a></li>` }).join('')}</ul></section>`).join('')}
  ${faqBlock('faq-h', qs)}
  <section class="ax-more" aria-label="Related pages">${altLinks(p, libs, null, 'Looking for an alternative to another icon library?')}</section>
  ${cta(p)}
</div>`
  shell({ path, title, desc, current: '', body, ld: [webPageLd({ path, name: 'Free icons for every tool', description: desc }), { '@type': 'ItemList', itemListElement: all.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://withicons.com/free/${l.slug}.html`, name: l.short })) }, faqLd(qs)], crumbsLd: [['Home', ''], ['Free icons', path]], bodyClass: 'ax-free', modified: CHECKED })
  return { url: '/' + path, title: 'Free icons for every tool', summary: desc }
}

export function buildFree(libs) {
  const out = [hub(LANDERS, libs)]
  for (const L of LANDERS) out.push(lander(L, LANDERS, libs))
  return out
}
