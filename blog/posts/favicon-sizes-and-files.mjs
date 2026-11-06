import { p, h2, h3, ul, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, cta, art, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'favicon-sizes-and-files',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-favicon-sizes-and-files',
  stickers: [['globe', 'solid'], ['smartphone', 'duo'], ['star', 'gloss']],
  title: 'Favicon sizes in 2026: which favicon files do you actually need?',
  cardTitle: 'Favicon files for 2026',
  h1: 'Favicon sizes in 2026: the files you <em>actually</em> need',
  dek: 'Old favicon guides ask for a dozen PNGs and a Windows tile file. Today five small files and four tags cover every browser, iPhones, Android and Google Search. Here is the short list, the exact code, and what changed.',
  description: 'The minimal favicon set for 2026: favicon.ico, an SVG with dark mode, a 180 px Apple touch icon and 192/512 manifest icons, with the exact tags to paste.',
  keywords: ['favicon sizes', 'favicon size 2026', 'what favicon files do i need', 'favicon.ico vs svg', 'apple touch icon size', 'svg favicon safari', 'dark mode favicon', 'maskable icon', 'web manifest icons', 'favicon link tags'],
  about: ['Favicon', 'Web app manifest', 'Scalable Vector Graphics', 'Safari', 'with icons'],
  related: ['favicon-not-showing-in-google', 'app-icon-vs-ui-icon', 'dark-mode-icons'],
  tldr: [
    '<strong>Five files cover almost every site in 2026:</strong> <code>favicon.ico</code> (32 px), <code>favicon.svg</code>, a 180 x 180 <code>apple-touch-icon.png</code>, and 192 and 512 px PNGs listed in a web manifest.',
    'Add one more, a separate <strong>maskable</strong> 512 px PNG, if people install your site as an app on Android. Do not mark one icon <code>"any maskable"</code>: web.dev advises against it.',
    '<strong>Safari reads SVG favicons now</strong> (since Safari 26.0, September 2025), so the old “Safari ignores SVG” advice is out of date. But Safari still ignores a dark-mode rule inside the SVG.',
    'Keep <code>favicon.ico</code>: Google Search does not list SVG among its favicon formats, and many tools still ask for <code>/favicon.ico</code> by name.',
    'Skip the rest: Windows tile files, <code>browserconfig.xml</code>, and long lists of 57, 72, 114 and 152 px Apple icons are no longer needed.',
  ],
  faq: [
    { q: 'What size should a favicon be?', a: 'Make the ICO file 32 x 32 px (it can also hold 16 and 48 px). Add an SVG, which has no fixed size and stays sharp everywhere. For phones, add a 180 x 180 px Apple touch icon, and for installed web apps, 192 x 192 and 512 x 512 px PNGs in a web manifest.' },
    { q: 'Do I still need favicon.ico in 2026?', a: 'Yes, keep it. Browsers and many tools still ask for /favicon.ico at the root of your site, and Google Search lists ICO, PNG and other bitmap formats as supported but not SVG. One small ICO file is cheap insurance.' },
    { q: 'Does Safari support SVG favicons?', a: 'Yes, since Safari 26.0 (released 15 September 2025). WebKit announced SVG support everywhere Safari shows icons, favicons included. Safari does not yet apply a prefers-color-scheme rule inside an SVG favicon, so a dark-mode version will not switch there (WebKit bug 309949, still open when we checked in November 2026).' },
    { q: 'What size is the apple-touch-icon?', a: '180 x 180 px, as a PNG with a solid background. Apple’s own example lists 180 x 180 for current iPhones, and its docs say that when no exact size matches, the next larger icon is used, so one 180 px file covers iPhone and iPad.' },
    { q: 'Should I use "any maskable" in my web manifest?', a: 'No. web.dev’s guide to maskable icons says it does not recommend combining purposes, because a maskable icon used as a normal icon carries extra padding and looks small. List your normal 192 and 512 px icons, then add a separate icon with "purpose": "maskable".' },
    { q: 'Can I make a favicon from a free icon?', a: `Yes. Every icon page on with icons has a Favicon pack download (under Websites & apps) with the ICO, SVG, Apple touch icon, 192, 512 and maskable PNGs, a site.webmanifest and the tags to paste. All ${N_ICONS} icons are MIT licensed, so you can use them on any site without credit.` },
  ],
  sources: [
    { title: 'WebKit: WebKit Features in Safari 26.0 (SVG icons and favicons, 15 September 2025), checked November 2026', url: 'https://webkit.org/blog/17333/webkit-features-in-safari-26-0/' },
    { title: 'WebKit bug 309949: SVG favicons don’t respect media query overrides (dark mode), checked November 2026', url: 'https://bugs.webkit.org/show_bug.cgi?id=309949' },
    { title: 'Can I use: SVG favicons, checked November 2026', url: 'https://caniuse.com/link-icon-svg' },
    { title: 'web.dev: Adaptive icon support in PWAs with maskable icons, checked November 2026', url: 'https://web.dev/articles/maskable-icon' },
    { title: 'web.dev: Add a web app manifest (192 and 512 px icons for Chromium), checked November 2026', url: 'https://web.dev/articles/add-manifest' },
    { title: 'MDN: Define your app icons (safe zone, SVG and PNG icons), checked November 2026', url: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons' },
    { title: 'Google Search Central: Define a favicon to show in search results (updated 27 October 2026), checked November 2026', url: 'https://developers.google.com/search/docs/appearance/favicon-in-search' },
    { title: 'Apple: Configuring Web Applications (apple-touch-icon sizes), checked November 2026', url: 'https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html' },
    { title: 'Next.js docs: favicon, icon and apple-icon file conventions, checked November 2026', url: 'https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons' },
    { title: 'Microsoft Learn: Internet Explorer 11 lifecycle (desktop app support ended 15 June 2022)', url: 'https://learn.microsoft.com/en-us/lifecycle/products/internet-explorer-11' },
  ],
  body: () => `
${p(`<span class="lede">In 2026 most websites need just five favicon files: a 32 px <code>favicon.ico</code>, a <code>favicon.svg</code>, a 180 x 180 px <code>apple-touch-icon.png</code>, and 192 and 512 px PNGs listed in a web manifest. Add a sixth, a separate maskable icon, if people install your site as an app on Android. Four short tags in your page’s <code>&lt;head&gt;</code> tie them together, and that covers every current browser, iPhones, Android and Google Search.</span>`)}
${p(`A favicon is the tiny picture in a browser tab, a bookmark or a search result. Old guides ask for fifteen or twenty files, written for browsers that no longer exist. Below: the short list, the exact code, what changed, and how to get the whole set from any ${L.icons('with icons')} icon page. We checked every fact with WebKit, web.dev, MDN, Google and Apple in November 2026.`)}

${callout('note', `<p><strong>Safari 26.0</strong> (15 September 2025) added SVG favicons, so the advice that “Safari ignores SVG” is out of date. Safari still ignores a dark-mode rule inside the SVG (WebKit bug 309949, open since March 2026). web.dev now warns against <code>"purpose": "any maskable"</code>. Windows tile files and <code>browserconfig.xml</code> were for Internet Explorer and the old Edge, and Microsoft ended support for the Internet Explorer 11 app in June 2022.</p>`, 'What changed since the old answers')}

${h2('Which favicon files do I need in 2026?')}
${p('Here is the whole set. The first four are what almost every site should ship; the maskable one is for sites people install as apps.')}
${table(['File', 'Size', 'Who uses it', 'Need it?'], [
  ['<code>favicon.ico</code>', '32 x 32 px (can also hold 16 and 48)', 'Older browsers, tools and crawlers that ask for <code>/favicon.ico</code> by name, Google Search', yes('Yes')],
  ['<code>favicon.svg</code>', 'Any (it is a vector)', 'Chrome, Edge, Firefox and Safari 26+ tabs and bookmarks, sharp at every size', yes('Yes')],
  ['<code>apple-touch-icon.png</code>', '180 x 180 px, solid background', 'iPhone and iPad “Add to Home Screen”, and some other apps that show site icons', yes('Yes')],
  ['<code>icon-192.png</code> + <code>icon-512.png</code>', '192 and 512 px', 'Android home screens and installed web apps (listed in the manifest)', yes('Yes, with a manifest')],
  ['<code>icon-maskable-512.png</code>', '512 px, solid background, padded', 'Android adaptive icons (circles, squircles)', meh('If people install it')],
  ['<code>mstile-*.png</code>, <code>browserconfig.xml</code>', 'Many', 'Pinned tiles in Internet Explorer and the old Edge', no('No')],
  ['57, 72, 76, 114, 120, 152 px Apple icons', 'Many', 'iPhones and iPads from the early 2010s', no('No')],
], 'The minimal favicon set for 2026 (checked November 2026)')}
${art('m-favicon-sizes-and-files-set', 'Five files and one optional extra: everything a site needs for tabs, home screens and search.', { brief: 'A flat lay of the six favicon files as labelled cards, left to right: favicon.ico (a tiny 32 px tile), favicon.svg (a crisp vector tile with a small sun and moon to hint at dark mode), apple-touch-icon 180 (rounded square on a solid colour), icon-192 and icon-512 (two sizes of the same tile), and icon-maskable-512 (the same icon inside a dashed circle). Use one with icons icon, the rocket in solid style, as the logo on every card. Under the row, three faded, crossed-out cards labelled mstile, browserconfig.xml and 57/72/114 px to show what you can drop.' })}

${h2('What are the exact favicon link tags?')}
${p('Put the files at the root of your site and paste these lines into the <code>&lt;head&gt;</code> of every page. The browser picks the best match for each place it shows an icon.')}
${code(`<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`)}
${p('The <code>type="image/svg+xml"</code> part matters: browsers that do not understand SVG skip that line and fall back to the ICO. Can I use also notes that Chrome and Firefox need your server to send SVG files with that same type, which most hosts do already. If you use Next.js, you can skip writing the tags by hand: drop <code>favicon.ico</code>, <code>icon.svg</code> and <code>apple-icon.png</code> into the <code>app/</code> folder and Next.js adds the matching tags for you, according to its docs.')}

${h2('Do I still need favicon.ico?')}
${p('Yes. It is the oldest favicon format, and plenty of software still asks for <code>/favicon.ico</code> at the root of your site without reading your tags at all: feed readers, chat apps that build link previews, older browsers, some crawlers.')}
${p(`Google Search is the big one. Its favicon guide (updated 27 October 2026) lists BMP, GIF, ICO, PNG, JPEG, PPM and TIFF as supported formats. SVG is not on that list, so an SVG-only site gives Google nothing it says it supports. Google also asks for a square icon of at least 8 x 8 px, recommends larger than 48 x 48 px, and shows only one favicon per hostname. If your icon still does not show up in results, our post on ${L.post('favicon-not-showing-in-google', 'why a favicon is not showing in Google')} walks through the fixes.`)}

${h2('Does Safari support SVG favicons now?')}
${p('Yes. WebKit’s Safari 26.0 release notes (15 September 2025) say Safari “now supports the SVG file format for icons” everywhere icons appear, favicons included. Can I use lists SVG favicons in Chrome since version 80 and Firefox since version 41, so every major browser reads them in 2026.')}
${p('So answers from 2024 and early 2025 that say “Safari ignores SVG favicons” are out of date.')}

${h2('How do I make a favicon that changes in dark mode?')}
${p('An SVG file can carry its own little style sheet, so it can change colour when the browser is in dark mode. That keeps a dark logo from vanishing on a dark tab bar. Here is the idea, with one shape for clarity:')}
${code(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <style>
    path { fill: #1d2433; }
    @media (prefers-color-scheme: dark) {
      path { fill: #ffffff; }
    }
  </style>
  <path d="M12 2 4 7v10l8 5 8-5V7z"/>
</svg>`)}
${p('Chrome and Firefox switch the colour. Safari does not: WebKit bug 309949, filed in March 2026, confirms Safari 26 ignores media queries inside SVG favicons, and a July 2026 comment adds that other WebKit browsers on Linux behave the same. The bug was still open when we checked in November 2026.')}
${p(`So the honest advice is: design a favicon that reads on both light and dark tabs, and treat the dark-mode switch as a bonus. A solid shape on its own coloured square (a “plate”), or a mid-tone colour with good contrast on both, works everywhere. Our ${L.post('dark-mode-icons', 'dark mode icons guide')} explains the contrast side.`)}
${art('m-favicon-sizes-and-files-dark-tabs', 'The same favicon in light and dark browser tabs. A mark on its own plate reads on both.', { brief: 'Two stacked browser tab bars, one light and one dark, each with three tabs. Row one shows a dark outline favicon that disappears on the dark tab (marked with a small warning icon). Row two shows the same icon (the with icons rocket, solid style) white on a coloured rounded-square plate, clearly visible on both tabs (marked with a check). Small labels: "Dark mark only" and "Mark on a plate". No browser logos.' })}

${h2('What size should the apple-touch-icon be?')}
${p('Make it 180 x 180 px, as a PNG, with a solid background. Apple’s web app docs show 180 x 180 for current iPhones and explain that when no exact size matches, iOS uses the next larger icon. So one 180 px file covers iPhone and iPad, and the old lists of 57, 72, 114 and 152 px files are no longer needed.')}
${p('Give it a solid background and a little breathing room around the icon. iOS rounds the corners itself, and developers widely report that see-through areas show up black on the home screen. Name it <code>apple-touch-icon.png</code> and put it at the root: Apple’s docs say Safari looks there by that name even without a tag.')}

${h2('Which icons go in the web manifest, and what is a maskable icon?')}
${p('A web manifest is a small text file that tells phones and computers how to install your site like an app: its name, colours and icons. web.dev says Chromium browsers need at least a 192 x 192 px and a 512 x 512 px icon. Those two are your normal icons: transparent background, no extra padding, like your favicon.')}
${p('A <strong>maskable</strong> icon is a second version made for Android’s shaped icons. The phone crops it into a circle, a squircle or a rounded square, so it needs a solid background that fills the whole square and the important part kept inside the middle. web.dev defines that safe zone as a circle with a radius of 40% of the icon’s width (MDN puts it as a circle 80% across), and warns that the outer 10% may be cut off.')}
${code(`{
  "name": "My site",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`, 'json')}
${callout('warn', '<p>Many answers (and even web.dev’s older manifest article, last updated in 2024) say to add <code>"purpose": "any maskable"</code> to one icon. web.dev’s maskable icon guide says plainly that it does not recommend this: the padded maskable icon then gets used as your normal icon too, and looks small. Keep them as two separate entries.</p>', '“any maskable” is the stale answer')}
${art('m-favicon-sizes-and-files-safe-zone', 'A maskable icon: a full-bleed background with the icon inside the central safe circle.', { brief: 'A 512 px square tile with a solid coloured background and a with icons icon (heart, solid style, white) centred. Overlay a dashed circle marking the safe zone (80% diameter) labelled "safe zone", and shade the outer 10% edge labelled "may be cropped". Beside it, three small previews of the same tile cropped into a circle, a squircle and a rounded square, as Android launchers do.' })}

${h2('Which favicon files can I skip?')}
${doDont(
  '<p>Ship the ICO, the SVG, one 180 px Apple touch icon, the 192 and 512 px manifest icons and, for installable sites, one separate maskable icon. Test the SVG at 16 px before you ship it.</p>',
  '<p>Generate <code>mstile</code> images and <code>browserconfig.xml</code>, a dozen Apple sizes, extra manifest sizes like 144 px “just in case”, or a single <code>"any maskable"</code> icon.</p>'
)}
${p(`Also check how your icon looks tiny. At 16 px, fine lines and small gaps blur together, which is why filled icons usually make better favicons than outlines. Compare these ${L.style('solid')} icons with their ${L.style('line')} versions at real tab sizes.`)}
${sizeRamp(['rocket', 'heart', 'star', 'leaf'], [16, 24, 32, 48], 'solid', 'Solid icons at 16, 24, 32 and 48 px. Filled shapes stay readable at tab size.')}

${h2('How do I get a favicon pack from a free icon?')}
${p(`Every one of our ${N_ICONS} icons can become a full favicon set in one download, in any of its ${N_STYLES} styles. You pick the look, the file is built in your browser, and nothing needs signing up.`)}
${steps([
  ['Pick an icon and a style', `Search ${L.icons('the icon library')} (for example ${L.icon('rocket')} or ${L.icon('leaf')}) and open its page. Choose a style: ${L.style('solid')} is the safest at 16 px; bolder creative styles like ${L.style('sticker')} or ${L.style('pixel')} can work too.`],
  ['Set colour and background', 'Choose your colour, and a background colour if you want a plate. The Apple touch icon and the maskable icon always get a solid background (white unless you pick one).'],
  ['Download the Favicon pack', 'Open Download, then Websites &amp; apps, and choose Favicon pack. You get one ZIP file.'],
  ['Upload and paste', 'Put the files at the root of your site and paste the four tags from the README into your <code>&lt;head&gt;</code>.'],
])}
${p('Here is exactly what the ZIP contains, straight from our export code:')}
${ul([
  '<code>favicon.ico</code> with 16, 32 and 48 px images inside.',
  '<code>favicon.svg</code>, the icon as a vector with its colours locked in. It has no dark-mode rule; add one yourself, as shown above, if you want it.',
  '<code>apple-touch-icon.png</code>, 180 x 180 px on a solid background with at least 10% padding.',
  '<code>icon-192.png</code> and <code>icon-512.png</code> for Android and installed web apps.',
  '<code>icon-maskable-512.png</code> on a solid background with at least 20% padding, so the icon stays inside the safe circle.',
  '<code>site.webmanifest</code> listing the two normal icons and the maskable one as a separate entry, plus name, theme and background colours.',
  '<code>README.txt</code> with the <code>&lt;link&gt;</code> tags and a <code>theme-color</code> meta tag to paste.',
])}
${p(`Need only one piece? The same Websites &amp; apps group has a standalone ICO (16 to 256 px inside) and SVG downloads. Our ${L.page('free/app-icons.html', 'free app icons')} page and the ${L.post('app-icon-vs-ui-icon', 'app icon vs UI icon')} post explain how a favicon differs from the icons inside your interface.`)}
${iconGrid(['rocket', 'leaf', 'heart', 'star', 'coffee', 'camera', 'gift', 'zap'], 'solid', 'Good favicon candidates: simple, filled, recognisable at 16 px.')}
${styleRow('rocket', 'One icon, many favicon looks. Pick a style that stays clear at tab size.', { styles: ['solid', 'duo', 'gloss', 'sticker', 'pixel', 'retro', 'clay'] })}

${h2('How do I check my favicon works?')}
${ul([
  'Open <code>yoursite.com/favicon.ico</code> and <code>yoursite.com/favicon.svg</code> directly. Both should show the icon, not an error page.',
  'In Chrome, open DevTools, then Application, then Manifest. It lists your icons and warns if one is missing, and its Icons section can show the maskable safe zone.',
  'For Google Search, be patient. Google’s guide says a new favicon can take from several days to several weeks to appear.',
])}
${p(`Browsers cache favicons hard: if you still see the old one, try a private window first. For icon sizes inside your interface, see our ${L.post('icon-sizes-guide', 'icon sizes guide')}; for file types elsewhere, ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')}.`)}

${h2('The bottom line')}
${p(`Favicons got simpler. Ship <code>favicon.ico</code>, <code>favicon.svg</code>, a 180 px Apple touch icon and two manifest PNGs, add a separate maskable icon if your site installs as an app, and paste four tags. Safari now reads the SVG, Google still wants a bitmap, and dark-mode SVG favicons work in Chrome and Firefox but not yet in Safari. Any of our ${N_SVGS} SVGs can be your starting point.`)}
${cta('Turn any icon into a favicon pack', `${N_ICONS} icons in ${N_STYLES} styles, each with a one-click favicon pack: ICO, SVG, Apple touch icon, manifest icons and the tags. Free and MIT licensed.`, ['rocket', 'globe', 'smartphone', 'star', 'heart', 'leaf'])}
`,
}
