import { p, h2, h3, ul, iconGrid, sizeRamp, table, yes, no, meh, callout, steps, doDont, code, art, cta, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'favicon-not-showing-in-google',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-favicon-not-showing-in-google',
  stickers: [['globe', 'gloss'], ['search', 'duo'], ['badge-check', 'sticker']],
  title: 'Why isn’t my favicon showing in Google? Fixes that work in 2026',
  cardTitle: 'Favicon not showing in Google',
  h1: 'Why isn’t my favicon <em>showing in Google</em>?',
  dek: 'Your little site icon shows in the browser tab, but Google still shows a grey globe. Here is what Google actually checks today, how long it takes, and the exact steps for Squarespace, Wix, WordPress and Shopify.',
  description: 'Favicon not showing in Google? What Google checks in 2026, how long updates take, and the fixes for Squarespace, Wix, WordPress and Shopify, no code needed.',
  keywords: ['favicon not showing in google', 'favicon not showing in search results', 'google shows globe instead of favicon', 'how long for favicon to update in google', 'squarespace favicon google', 'wix favicon not showing google', 'make a favicon without code'],
  about: ['Favicon', 'Google Search', 'Googlebot', 'Squarespace', 'Wix', 'WordPress', 'Shopify'],
  related: ['favicon-sizes-and-files', 'app-icon-vs-ui-icon', 'icon-sizes-guide'],
  tldr: [
    '<strong>Google reads the favicon from your home page only</strong>, one per hostname. A favicon set on other pages, or only in the browser, does not count.',
    '<strong>It must be crawlable, square and a supported format:</strong> at least 8 x 8 px (Google recommends larger than 48 x 48), in ICO, PNG, GIF, JPEG, BMP, PPM or TIFF. SVG is not on Google’s list.',
    '<strong>The “multiple of 48 px” rule is gone</strong> from Google’s guidelines, though Squarespace and Wix help pages still quote it. A 96 or 192 px square satisfies both.',
    '<strong>Updates take days to weeks.</strong> Request indexing of your home page in Search Console to speed it up. Google says a favicon is never guaranteed.',
    '<strong>No code needed:</strong> download a PNG or a full favicon pack from any with icons page, then upload it in your site builder’s settings.',
  ],
  faq: [
    { q: 'Why does my favicon show in the browser tab but not in Google?', a: 'Browsers and Google read favicons differently. A browser uses whatever icon the current page links to, including SVG, and caches it. Google only reads the icon linked from your home page, fetches it with Googlebot-Image, and only shows supported formats such as PNG and ICO. Then it waits until its next crawl.' },
    { q: 'How long does it take for a new favicon to show in Google?', a: 'Google says crawling can take from several days to several weeks. You can speed it up by inspecting your home page in Google Search Console and pressing Request indexing. After that it is a matter of waiting.' },
    { q: 'Does my favicon have to be a multiple of 48 px?', a: 'Not any more. Google’s current guidelines say the favicon must be square and at least 8 x 8 px, and recommend larger than 48 x 48 px. Some site builders still quote the old multiple-of-48 rule, so a 96 x 96 or 192 x 192 px PNG keeps everyone happy.' },
    { q: 'Can I use an SVG favicon for Google?', a: 'Use SVG for browser tabs if you like, but give Google a PNG or ICO as well. Google’s list of supported favicon formats is BMP, GIF, ICO, PNG, JPEG, PPM and TIFF, and SVG is not on it.' },
    { q: 'Why does Google show a different icon or a globe for my site?', a: 'A globe means Google has no usable favicon for that hostname yet: the icon is missing from the home page, blocked from crawling, the wrong shape or format, or not crawled yet. Google can also replace an icon it considers inappropriate with a default one.' },
    { q: 'How do I make a favicon without design software?', a: 'Open any icon on withicons.com, pick a style and colour, then download a PNG at the size your site builder asks for, or the Favicon pack, which has favicon.ico, a 180 px Apple touch icon, Android icons and the tags to paste. It is free and MIT licensed.' },
  ],
  sources: [
    { title: 'Google Search Central: Define a favicon to show in search results (checked November 2026)', url: 'https://developers.google.com/search/docs/appearance/favicon-in-search' },
    { title: 'Squarespace Help: Add a favicon or browser icon (checked November 2026)', url: 'https://support.squarespace.com/hc/en-us/articles/206542527-Add-a-favicon-or-browser-icon' },
    { title: 'Wix Help: Wix Editor, changing your favicon (checked November 2026)', url: 'https://support.wix.com/en/article/wix-editor-changing-your-favicon' },
    { title: 'Wix Help: Adding a favicon image to your site’s pages in search results', url: 'https://support.wix.com/en/article/adding-a-favicon-image-to-your-sites-pages-in-search-results' },
    { title: 'WordPress.org Documentation: Creating a favicon (Site Icon, WordPress 6.5+)', url: 'https://wordpress.org/documentation/article/create-a-favicon/' },
    { title: 'WordPress.com Support: Site icons', url: 'https://wordpress.com/support/site-icons/' },
    { title: 'Shopify Help Center: Adding a favicon (checked November 2026)', url: 'https://help.shopify.com/en/manual/online-store/images/add-favicon' },
    { title: 'Shopify Dawn theme, layout/theme.liquid (favicon link at 32 x 32)', url: 'https://github.com/Shopify/dawn/blob/main/layout/theme.liquid' },
  ],
  body: () => `
${p(`<span class="lede">Your favicon usually does not show in Google for one of five reasons: it is not linked from your <strong>home page</strong>, Google is <strong>blocked from fetching</strong> it, it is <strong>not square</strong>, it is in a format Google does not use (such as <strong>SVG</strong>), or Google simply <strong>has not recrawled</strong> your site yet, which can take days to weeks. Fix the first four, then ask Google to recrawl your home page in Search Console.</span>`)}
${p(`This guide walks through what Google checks today, how to make a favicon in a few minutes with no code, and the exact settings in Squarespace, Wix, WordPress and Shopify. If you build sites by hand and want every file and tag explained, our sister post ${L.post('favicon-sizes-and-files', 'Which favicon files do I need in 2026?')} covers the technical side.`)}
${callout('note', '<p>Forum fixes from a few years ago tell you to save an 8-bit BMP in Paint, or to make the icon an exact multiple of 48 px. Google’s favicon guidelines no longer mention multiples of 48: today they ask for a square of at least 8 x 8 px and recommend larger than 48 x 48 px. Squarespace and Wix help pages still quote the old rule (checked November 2026), which is harmless but confusing. Meanwhile browsers learned to use SVG favicons, but Google’s list of supported formats still does not include SVG.</p>', 'What changed since the old answers')}

${h2('Why does my favicon show in the browser tab but not in Google?')}
${p('Because they are two different readers. Your browser looks at the page you are on, uses whatever icon it links to (SVG included), and keeps it in a cache for a long time. That is why you often see your new favicon in the tab straight away.')}
${p('Google is pickier. It reads the icon linked from your <strong>home page</strong> only, fetches the file with a crawler called Googlebot-Image, checks the rules below, and only updates when it next crawls you. Google shows one favicon per site, where a site means a hostname: shop.example.com can have its own, but example.com/shop cannot.')}

${h2('What does Google need before it shows a favicon?')}
${table(['Google’s rule', 'What it means for you', 'Common mistake'], [
  ['Linked from the home page', 'Your homepage’s code has an icon tag pointing to the file', 'Favicon added only to some pages, or a plugin overriding it'],
  ['Crawlable', 'Googlebot can open the home page; Googlebot-Image can open the icon file', 'robots.txt or a security setting blocks the image folder'],
  ['Square, at least 8 x 8 px', 'Same width and height; larger than 48 x 48 px recommended', 'A wide logo squashed into a rectangle'],
  ['Supported format', 'ICO, PNG, GIF, JPEG, BMP, PPM or TIFF', 'Only an SVG favicon'],
  ['Stable URL', 'The file address does not keep changing', 'A new file name on every redesign'],
  ['Represents your brand', 'A logo mark or a clear symbol', 'Anything Google deems inappropriate gets a default icon'],
], 'Google’s favicon rules for search results, from Google Search Central (checked November 2026).')}
${callout('warn', '<p>Even when every rule is met, Google says a favicon is not guaranteed to appear. In practice most sites that follow the rules do get one after a recrawl, but no setting can force it.</p>', 'Google’s own caveat')}
${art('m-favicon-not-showing-in-google-checklist', 'Five questions, in order: most missing favicons fail one of them.', { brief: 'A friendly vertical flowchart with five yes/no checks, each with a with icons line-style icon: home ("Is it on your home page?"), lock ("Can Google fetch it?"), crop ("Is it square and bigger than 48 px?"), file-image ("PNG or ICO, not only SVG?"), clock ("Waited for a recrawl?"). Each "No" arrow points to a short fix label; the final "Yes" ends at a mock search result row with a round favicon next to a site name (generic site, no real brands).' })}

${h2('How long does Google take to show a new favicon?')}
${p('Google says crawling can take <strong>anywhere from several days to several weeks</strong>. You can nudge it:')}
${steps([
  ['Open Google Search Console', 'Add and verify your site if you have not already. It is free.'],
  ['Inspect your home page', 'Paste your home page address into the URL Inspection box at the top.'],
  ['Press Request indexing', 'This asks Google to recrawl the page, which is where it finds your favicon.'],
  ['Wait, and do not keep changing it', 'Each new file name restarts the clock. Pick your final icon, then leave it alone.'],
])}
${p('Wix and Shopify also suggest resubmitting your sitemap in Search Console. It does no harm, but the home page is the page that matters for the favicon.')}

${h2('How do I make a favicon without code?')}
${p(`You need one clear symbol that still reads at 16 px. Simple, filled shapes work best, which is why ${L.style('solid')} icons make good favicons. On any icon page on with icons:`)}
${steps([
  ['Pick an icon and a style', `Search for what your site is about, like the ${L.icon('leaf', 'leaf')}, ${L.icon('coffee', 'coffee')} or ${L.icon('paw-print', 'paw print')} icon. Choose Solid for the clearest small shape.`],
  ['Set your colours', 'Pick your brand colour for the icon. In Download > Options, set Background to a solid colour so it shows on light and dark tabs alike.'],
  ['Download the right file', 'For a site builder: PNG at the size it asks for (see below). For a hand-built site: the Favicon pack, under Websites &amp; apps. For just a favicon.ico: ICO.'],
])}
${p('The <strong>Favicon pack</strong> is a ZIP with favicon.ico (16, 32 and 48 px inside), favicon.svg, a 180 x 180 apple-touch-icon.png on a solid background, 192 and 512 px PNGs for Android, a maskable icon, a site.webmanifest and a README with the tags to paste. The ICO download on its own holds 16, 32, 48, 64 and 256 px. Google can use the ICO and the Apple touch icon, so the pack covers search results even though Google ignores the SVG.')}
${sizeRamp(['leaf', 'coffee', 'rocket', 'paw-print'], [16, 24, 32, 48], 'solid', 'Solid icons at real favicon sizes. If you cannot tell what it is at 16 px, choose a simpler icon.')}
${iconGrid(['home', 'store', 'camera', 'book-open', 'flower', 'palette', 'heart', 'sparkles', 'rocket', 'leaf', 'coffee', 'paw-print'], 'solid', 'Favicon ideas for small businesses, shops, blogs and portfolios. Each one opens its icon page.')}
${p(`Browse more bold, simple shapes in the ${L.page('free/app-icons.html', 'app icons collection')}. Our post on ${L.post('app-icon-vs-ui-icon', 'app icons vs interface icons')} explains why a favicon needs a simpler shape than the icons inside your site.`)}

${h2('How do I change my favicon on Squarespace, Wix, WordPress and Shopify?')}
${table(['Platform', 'Where', 'Upload this', 'Notes'], [
  ['Squarespace', 'Settings > Website > Favicon', 'PNG, 192 x 192 px', '100 to 300 px recommended, max 100 KB, no ICO'],
  ['Wix', 'Dashboard > Settings > Website settings > Favicon', 'PNG, 192 x 192 px', 'Needs a Premium plan, a connected domain and a published site'],
  ['WordPress', 'Settings > General > Site Icon', 'PNG, 512 x 512 px', 'At least 512 px; WordPress makes the smaller sizes'],
  ['Shopify', 'Online Store > Edit theme > Theme settings > Logo or Favicon', 'PNG, 192 x 192 px or larger', 'Basic plan or higher; themes output a 32 px icon'],
], 'Where each site builder keeps its favicon setting, from their help centres (checked November 2026).')}
${h3('Squarespace')}
${p('Open the Favicon panel (Settings > Website > Favicon), drag in your image and press Save. Squarespace recommends a PNG between 100 x 100 and 300 x 300 px, up to 100 KB, and does not take ICO files. You can add a separate dark mode version once the main one is set. A 192 px PNG fits Squarespace’s range and Google’s advice. If your browser still shows the old icon, Squarespace notes browsers cache favicons stubbornly: try a private window.')}
${h3('Wix')}
${p(`In your site’s dashboard go to Settings > Website settings and, under Favicon, click Upload Image. Wix needs a Premium plan, a connected domain and a published site first. Wix accepts ICO, PNG, JPG and SVG, but its search-results article asks for JPG or PNG, so use a PNG. Wix still asks for a multiple of 48 px, which a 192 px PNG satisfies. Our ${L.guide('wix-squarespace', 'Wix and Squarespace guide')} covers adding icons to pages too.`)}
${h3('WordPress')}
${p(`Since WordPress 6.5 the Site Icon lives in <strong>Settings > General</strong>: click Choose a Site Icon, upload a square PNG of at least 512 x 512 px, crop if asked, and save. Classic themes also have it in Appearance > Customize > Site Identity; block themes in the Site Editor. WordPress then creates the smaller sizes and the tags for you, so do not paste extra favicon code from a plugin or a tutorial on top: two sets of tags is a common cause of confusion. See our ${L.guide('wordpress', 'WordPress guide')} for icons inside your posts.`)}
${h3('Shopify')}
${p('From your Shopify admin go to Online Store, click Edit theme, click the gear for Theme settings, then Logo or Favicon (it depends on your theme). Under Favicon image, select or upload your file, click Done, then Save. You need the Basic plan or higher. Shopify’s help says 16 or 32 px is ideal, and its own themes Dawn and Horizon output the favicon at 32 x 32 px. That passes Google’s 8 px minimum, so it can show, but it is below the size Google recommends. Upload a crisp square of 192 px or more anyway, so Shopify has a sharp image to shrink.')}

${h2('My favicon is set up right and still missing. What else can I check?')}
${ul([
  '<strong>robots.txt and security tools.</strong> If your robots.txt blocks the folder the icon lives in, or a firewall blocks Google’s crawlers, Google cannot fetch it. Ask your host or developer if you are not sure.',
  '<strong>www versus no www.</strong> Google treats each hostname as its own site. Make sure the version that appears in Google redirects to, or has, the same home page with the icon.',
  '<strong>Duplicate tags.</strong> A theme setting plus pasted code plus a plugin can leave three different favicons. Keep one source.',
  '<strong>A changing file address.</strong> Some tools add a new file name on every save. Google wants a stable URL.',
  '<strong>A wide logo.</strong> A non-square image is not eligible. Use a square mark instead of your full wordmark.',
])}
${p('If you can edit your site’s head, this is all Google needs to see on the home page (the favicon pack’s README lists the full set):')}
${code(`<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`)}
${doDont('<p>Use one square PNG or ICO, larger than 48 px, linked from your home page, at an address that never changes. Then request indexing once and wait.</p>', '<p>Upload only an SVG, rename the file every week, or stack plugin, theme and pasted favicon code on the same site.</p>')}
${art('m-favicon-not-showing-in-google-before-after', 'Before and after: the grey globe, then your own icon in search results.', { brief: 'Two simplified search result rows stacked (generic, no Google logo or real UI): top labelled "Before" shows a grey globe next to a made-up site name "Fern and Pine Plants"; bottom labelled "After" shows a round favicon with the with icons leaf icon in solid style, white on deep green. A small "days to weeks" clock label between them.' })}

${h2('The short answer')}
${p(`Google shows your favicon when your home page links to a square PNG or ICO larger than 48 px that its crawlers can fetch, at a stable address, and after it has recrawled your home page. Set it once in your site builder, request indexing in Search Console, and give it a few days to a few weeks. Need the icon itself? Pick one of ${L.icons(`${N_ICONS} free icons`)} and download a PNG or the full favicon pack. For every file and size explained, read ${L.post('favicon-sizes-and-files', 'our favicon files guide')}, and for icon sizes in general, the ${L.post('icon-sizes-guide', 'icon sizes guide')}.`)}
${cta('Make your favicon in two minutes', `${N_ICONS} free icons in ${N_STYLES} styles. Download a PNG, an ICO or a full favicon pack with the tags to paste. MIT licensed, no sign-up.`, ['globe', 'leaf', 'rocket', 'heart', 'store', 'sparkles'])}
`,
}
