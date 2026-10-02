import { p, h2, ul, figure, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, stats, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'app-icon-vs-ui-icon',
  category: 'basics',
  date: '2026-10-03',
  hero: 'xapp5',
  stickers: [['smartphone', 'glass'], ['app-window', 'duo'], ['sparkles', 'sticker']],
  title: 'App icon vs UI icon: what’s the difference?',
  cardTitle: 'App icon vs UI icon',
  h1: 'App icon vs UI icon: <em>what’s the difference?</em>',
  dek: 'One is the little picture you tap on your home screen. The others are the tiny signposts inside the app. Here is how they differ in size, shape, format and who makes them, plus where favicons fit in.',
  description: 'An app icon represents a whole app on a home screen or store; UI icons are the small symbols inside it. Sizes, shapes, formats, favicons and common mistakes.',
  keywords: ['app icon vs UI icon', 'what is an app icon', 'what is a UI icon', 'app icon size', 'App Store icon size 1024', 'Google Play icon size 512', 'favicon vs app icon', 'interface icons'],
  about: ['Icon (computing)', 'Mobile app', 'Graphical user interface', 'Favicon'],
  related: ['icon-sizes-guide', 'svg-vs-png-icons', 'free-icons-commercial-use'],
  tldr: [
    '<strong>An app icon</strong> is the one picture that represents a whole app on a home screen, in a dock or in the App Store and Google Play. It works like a logo.',
    '<strong>UI icons</strong> (user interface icons) are the many small symbols inside the app: search, settings, share, trash. They work like road signs.',
    '<strong>Sizes differ a lot:</strong> Apple lists a 1024 x 1024 px app icon for iPhone, iPad and Mac, and Google Play asks for a 512 x 512 px PNG. UI icons are usually 16 to 24 px.',
    '<strong>Shapes are handled for you:</strong> you hand over a full square, and the system rounds the corners or crops it to a circle. Don’t round it yourself.',
    '<strong>An icon library is for UI icons,</strong> not your app icon, which should be unique to you. A <strong>favicon</strong> is a third kind: the tiny site icon in a browser tab.',
  ],
  faq: [
    { q: 'What size should an app icon be?', a: 'For iPhone, iPad and Mac, Apple’s Human Interface Guidelines list a 1024 x 1024 pixel app icon, which the system scales down for smaller places like Settings. For the Google Play store listing, Google asks for a 512 x 512 pixel, 32-bit PNG of up to 1024 KB. Android launcher icons are built as adaptive icons with 108 x 108 dp layers.' },
    { q: 'Is an app icon the same as a logo?', a: 'They are close cousins. Many app icons are simply the company logo on a coloured square, but an app icon has extra rules: it must be square, read well when tiny, and survive the corner rounding or circle cropping that phones apply. Some brands use a simplified version of their logo for this reason.' },
    { q: 'Should I round the corners of my app icon myself?', a: 'No. Apple and Google both ask for a full square image. Apple’s system masks the corners of iPhone, iPad and Mac icons, and Google Play applies its own corner radius (equal to 30% of the icon size) and shadow. Pre-rounded corners can leave odd edges.' },
    { q: 'What size are UI icons?', a: 'Most UI icons are drawn on a 24 x 24 pixel grid and shown at 16, 20 or 24 pixels, a little larger for touch screens or headings. They are usually SVG files on the web, so they stay sharp at any size.' },
    { q: 'What is the difference between a favicon and an app icon?', a: 'A favicon is the tiny icon a website shows in a browser tab, bookmark list or search result. MDN describes it as usually 16 x 16 pixels. An app icon represents an installed app and is much larger. A website that can be installed as an app also needs bigger icons (192 and 512 pixels) in its web app manifest.' },
    { q: 'Can I use free icons inside my app?', a: 'Yes, as long as the licence allows it. with icons uses the MIT licence, so you can use its icons inside commercial apps for free without attribution. Just keep your app icon itself unique, rather than built from a shared library icon.' },
  ],
  sources: [
    { title: 'Apple Human Interface Guidelines: App icons (specifications, checked October 2026)', url: 'https://developer.apple.com/design/human-interface-guidelines/app-icons' },
    { title: 'Android Developers: Google Play icon design specifications', url: 'https://developer.android.com/distribute/google-play/resources/icon-design-specifications' },
    { title: 'Android Developers: Adaptive icons', url: 'https://developer.android.com/develop/ui/views/launch/icon_design_adaptive' },
    { title: 'MDN Web Docs: Favicon (glossary)', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Favicon' },
    { title: 'Google Search Central: Define a favicon to show in search results', url: 'https://developers.google.com/search/docs/appearance/favicon-in-search' },
    { title: 'web.dev: Add a web app manifest', url: 'https://web.dev/articles/add-manifest' },
  ],
  body: () => `
${p(`<span class="lede">An app icon is the single picture that represents a whole app on your home screen, in your dock and in the App Store or Google Play. UI icons are the many small symbols inside the app, like the magnifying glass for search or the gear for settings. The app icon is a logo for one product; UI icons are shared signposts that help you get around.</span>`)}
${p('That difference shapes everything else: how big they are, which file format they use, who draws them and where you get them. Below we walk through each one in plain English, add a third kind you see every day (the favicon in a browser tab), and finish with a side-by-side table and the mistakes we see most often.')}
${stats([['1024 px', 'Apple’s app icon size (iPhone, iPad, Mac)'], ['512 px', 'Google Play store listing icon'], ['24 px', 'a typical UI icon'], ['16 px', 'a classic favicon']])}

${h2('What is an app icon?')}
${p('An app icon is the picture you tap to open an app. It is the face of the product: it sits on the home screen, in search results, in notifications, in the share sheet and on the app’s store page. There is exactly one per app (sometimes with a few optional variants, like a dark version), and it has to be recognisable at a glance among dozens of others.')}
${p('Because it does the job of a logo, an app icon is usually colourful, filled edge to edge, and built around one simple, memorable idea: a shape, a letter, a mascot. Apple’s guidelines put it well when they advise you to <em>embrace simplicity</em> and to prefer illustrations over photos, since small details vanish when the icon shrinks.')}
${figure('xapp4', 'Every tile on a phone’s home screen is an app icon. Everything you tap after the app opens is a UI icon.')}

${h2('What is a UI icon?')}
${p(`UI stands for user interface: the screens, buttons and menus you use inside an app or website. UI icons are the small symbols on those buttons. A typical app uses dozens of them, and most are the same familiar ideas you see everywhere, because familiarity is the point. Nobody wants to learn a new symbol for “search”.`)}
${iconGrid(['home', 'search', 'bell', 'settings', 'share', 'trash', 'heart', 'user'], 'line', 'Classic UI icons in the Line style: small, simple, one colour, and instantly familiar. Click any of them to copy or download it.')}
${p(`UI icons are usually drawn as outlines or simple filled shapes in a single colour, so they can change colour with the text around them (grey when idle, blue when active, white in dark mode). On the web they are usually SVG files: an SVG is a picture made of shapes rather than pixels, so it stays sharp at any size. Our guide to ${L.post('svg-vs-png-icons', 'SVG vs PNG icons')} explains the difference.`)}

${h2('How big is an app icon compared with a UI icon?')}
${p('Much bigger, and in a different way. An app icon is made once at a large size and the system shrinks it for each place it appears. UI icons are drawn to be crisp at small sizes in the first place.')}
${ul([
  '<strong>Apple (iPhone, iPad, Mac):</strong> the Human Interface Guidelines list a <strong>1024 x 1024 pixel</strong> layout size. The system automatically scales it down for places like Settings and notifications. Apple Watch uses 1088 x 1088 px and Apple TV a landscape 800 x 480 px.',
  '<strong>Google Play store listing:</strong> a <strong>512 x 512 pixel</strong>, 32-bit PNG in sRGB colour, no larger than 1024 KB.',
  '<strong>Android home screen:</strong> launcher icons are “adaptive icons” made of a foreground and a background layer, each <strong>108 x 108 dp</strong> (dp is Android’s screen-independent pixel). Only the centre 66 x 66 dp is guaranteed to stay visible.',
  '<strong>UI icons:</strong> commonly <strong>16, 20 or 24 px</strong>, sometimes 32 px or more for big touch targets and headings.',
])}
${sizeRamp(['search', 'settings', 'share', 'bell'], [16, 20, 24, 32, 48], 'line', 'UI icons are built to read clearly at 16 to 24 px. Every with icons icon is drawn on a 24 x 24 grid.')}
${p(`For the full picture on small sizes, see our ${L.post('icon-sizes-guide', 'icon sizes guide')}.`)}

${h2('Why do app icons have rounded corners?')}
${p('Because the phone adds them. You design a plain square, and the operating system applies a <strong>mask</strong>: an invisible cookie cutter that trims every app icon to the same shape so the home screen looks tidy.')}
${ul([
  '<strong>iPhone, iPad and Mac:</strong> Apple asks for square, unmasked artwork. The system rounds the corners to match the curves of the rest of the interface and the device itself.',
  '<strong>Apple Watch and Vision Pro:</strong> square artwork, cut into a circle by the system.',
  '<strong>Android:</strong> each phone maker supplies its own mask, so the same adaptive icon can appear as a circle on one phone and a squircle (somewhere between a square and a circle) on another.',
  '<strong>Google Play:</strong> you upload a full square and Play applies a corner radius equal to 30% of the icon size, plus its own shadow.',
])}
${callout('warn', 'Don’t pre-round the corners, add your own drop shadow or put important detail near the edges. Apple notes that pre-masked artwork can make edges look jagged, and Android only promises that the centre of an adaptive icon survives every mask. Keep your main shape in the middle.')}
${p('UI icons have none of this. They sit on a transparent background and keep whatever outline they were drawn with.')}

${h2('Who designs app icons and who designs UI icons?')}
${p('An app icon is part of a brand, so it is usually designed by the company’s own designer, a brand agency or a freelance illustrator, often alongside the logo. It goes through rounds of feedback, because it is the first thing people see in the store.')}
${p(`UI icons are more like a font. Most teams do not draw their own; they pick an <strong>icon library</strong>, a ready-made, matching set of icons drawn by one team in one consistent style. Apple, Google and many independent projects publish sets like this. ${L.icons('with icons')} is one of them: ${N_ICONS} icons, each drawn once and rendered in ${N_STYLES} styles, for ${N_SVGS} SVGs in total, free under the MIT licence.`)}

${h2('Can you use an icon library for your app icon?')}
${p('Legally, often yes: a permissive licence like MIT lets you use the drawings almost any way you like. Practically, we would not, and we make icon libraries. Here is why:')}
${ul([
  '<strong>It won’t be yours.</strong> A shared library icon can be downloaded by anyone, including your competitors. Your app icon should be something only you have.',
  '<strong>It will look like a system feature.</strong> A plain gear on a blue square reads as “Settings”, not as your brand.',
  '<strong>It is the wrong shape of drawing.</strong> UI icons are thin, small and one colour. App icons are bold, full-bleed and designed to survive masks and lighting effects.',
])}
${p(`Also good to know: with icons has <strong>no brand logos</strong> at all. You will not find the Instagram, Apple or Google marks in it. If you need a company’s logo, get it from that company’s official brand page and follow their rules.`)}
${styleRow('rocket', 'Creative styles such as Gloss, Glass and Skeuo can look a lot like app icons. They are great for mockups, slides, landing pages and placeholders while you design the real thing.', { styles: ['line', 'solid', 'duo', 'gloss', 'glass', 'skeuo', 'sticker'] })}
${p(`Where an icon library really earns its place is everything <em>inside</em> your app: the tab bar, buttons, menus, settings and empty states. That is dozens of icons that need to match each other, and drawing them yourself takes weeks.`)}

${h2('What about favicons?')}
${p('A favicon is a third kind of icon, and the one people forget. It is the tiny picture a <strong>website</strong> shows in the browser tab, in your bookmarks and next to the site in some search results. MDN describes it as usually 16 x 16 pixels, stored as an ICO, PNG or GIF file.')}
${p('Favicons sit halfway between the other two. Like an app icon, a favicon represents a whole product, so it is usually a simplified version of the logo. Like a UI icon, it is tiny, so detail disappears and one bold shape works best. A few current numbers worth knowing:')}
${ul([
  '<strong>Google Search</strong> requires a square favicon of at least 8 x 8 px, and recommends one larger than 48 x 48 px so it looks good everywhere.',
  '<strong>Installable websites</strong> (web apps you can add to a home screen) need bigger icons in a file called the web app manifest. Chromium-based browsers ask for at least a 192 x 192 px and a 512 x 512 px icon.',
])}

${h2('App icon vs UI icon vs favicon: side by side')}
${table(['', 'App icon', 'UI icon', 'Favicon'], [
  ['What it represents', 'The whole app', 'One action or idea (search, delete)', 'The whole website'],
  ['How many you need', 'One (plus optional variants)', 'Dozens', 'One, in a few sizes'],
  ['Typical size', '1024 px (Apple), 512 px (Google Play)', '16 to 24 px', '16 px to 48 px, up to 512 px for web apps'],
  ['Usual file format', 'PNG, or layers in Apple’s Icon Composer', 'SVG', 'ICO or PNG'],
  ['Shape', 'Full square; the system rounds or crops it', 'Any outline on a transparent background', 'Square'],
  ['Colour', 'Full colour, brand colours', 'Usually one colour that follows the text', 'Brand colours'],
  ['Who makes it', 'Your designer or agency', 'Usually an icon library', 'Your designer, from the logo'],
  ['Take it from an icon library?', no('No, make it unique'), yes('Yes, that is what they are for'), meh('Only for a quick placeholder')],
], 'App icons, UI icons and favicons compared (platform sizes checked October 2026)')}

${h2('What are the most common mistakes?')}
${ul([
  '<strong>Shrinking a detailed logo into an app icon.</strong> Thin lines and small text vanish at home-screen size. Apple specifically advises against extra words like “Play” or “New”.',
  '<strong>Pre-rounding the corners.</strong> Hand over a full square and let the system do it.',
  '<strong>Using a screenshot or photo.</strong> Photos get muddy when small. A simple illustration reads better.',
  '<strong>Mixing UI icon sets.</strong> Three libraries in one app means three line weights and three corner styles. Pick one set and stick to it.',
  '<strong>Using UI icons as decoration only.</strong> An icon-only button still needs a name for screen readers. Our guide to ' + L.post('accessible-icons', 'accessible icons') + ' shows how.',
  '<strong>Forgetting the favicon.</strong> A blank tab icon makes a site look unfinished. It takes ten minutes.',
])}
${doDont('<p>Design one bold, unique app icon as a full square, test it at tiny sizes, and use a single, consistent icon library for every icon inside the app.</p>', '<p>Build your app icon from a free library icon, round its corners yourself, or mix outline icons from three different sets inside the app.</p>')}

${h2('The bottom line')}
${p(`An app icon is your app’s face: one unique, colourful square, at least 1024 px for Apple and 512 px for Google Play, shaped by the system. UI icons are the shared language inside the app: small, simple, one colour and usually from a library. A favicon is the website’s tiny badge in the browser tab. Make the first one yourself, and let a library like ${L.icons('with icons')} handle the rest. Start with the everyday ones: ${L.icon('home')}, ${L.icon('search')}, ${L.icon('settings')} and ${L.icon('share')}.`)}
${cta('Icons for everything inside your app', `${N_ICONS} UI icons in ${N_STYLES} styles, drawn on one 24 px grid so they all match. Copy, download or use them in code. Free and MIT licensed.`, ['smartphone', 'app-window', 'settings', 'search', 'bell', 'user'])}
`,
}
