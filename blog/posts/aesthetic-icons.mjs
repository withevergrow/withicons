import { p, h2, h3, ul, figure, iconGrid, styleRow, table, callout, steps, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

// the seven soft, cute styles this post is about, in the order a reader meets them
const AESTHETIC = ['pastel', 'coquette', 'kawaii', 'plush', 'soft3d', 'clay', 'sticker']

export default {
  slug: 'aesthetic-icons',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-aesthetic-icons',
  stickers: [['heart', 'coquette'], ['cloud', 'pastel'], ['cat', 'kawaii']],
  title: 'Aesthetic icons: free pastel, coquette and kawaii icon sets',
  cardTitle: 'Free aesthetic icons',
  h1: 'Aesthetic icons, <em>free</em>: pastel, coquette, kawaii and more',
  dek: 'Seven soft, cute icon styles for a Notion workspace, a slide deck or a phone home screen, how to pick one mood and keep it, and the honest steps for custom app icons.',
  description: 'Free aesthetic icons in pastel, coquette, kawaii, plush, soft 3D, clay and sticker styles, and how to use them in Notion, slides and on your phone home screen.',
  keywords: ['aesthetic icons', 'aesthetic app icons', 'pastel icons', 'coquette icons', 'aesthetic notion icons', 'kawaii icons', 'cute icons', 'iphone aesthetic home screen', 'custom app icons'],
  about: ['Icon design', 'Aesthetics', 'Kawaii', 'Notion', 'iOS Shortcuts', 'Home screen'],
  related: ['playful-icon-styles', 'app-icon-vs-ui-icon', 'icons-in-presentations'],
  tldr: [
    `<strong>Aesthetic icons</strong> are soft, matching icons that set a mood. with icons has seven aesthetic styles among its ${N_STYLES}: pastel, coquette, kawaii, plush, soft 3D, clay and sticker, free under MIT with no credit.`,
    '<strong>Pick one mood and stick to it:</strong> one style, one recurring colour palette, one size and one background for the whole page, deck or home screen.',
    '<strong>Notion:</strong> download a square PNG (Notion suggests 280 x 280 pixels, so 512 px is safe), then Add icon, Upload. Pick a mid-tone colour so it shows in dark mode.',
    '<strong>iPhone:</strong> make a Shortcut with the Open App action, then Add to Home Screen and choose your PNG as the icon. It opens the app directly, with a small Shortcuts banner. <strong>Android:</strong> use a launcher that supports custom icons.',
    '<strong>Where we are weaker:</strong> we draw no brand logos, so there is no Instagram or Spotify icon. Use an everyday object instead (a camera, a music note).',
  ],
  faq: [
    { q: 'Where can I get free aesthetic icons?', a: `with icons has ${N_ICONS} icons in ${N_STYLES} styles, including pastel, coquette, kawaii, plush, soft 3D, clay and sticker. Open any icon page, switch to the style you like, try a colour palette, then copy it or download a PNG or SVG. Everything is MIT licensed, free for personal and commercial use, with no credit needed.` },
    { q: 'How do I change app icons on my iPhone?', a: 'Open the Shortcuts app, make a new shortcut with the Open App action and choose the app. Then open the shortcut’s Details, tap Add to Home Screen, tap the icon and pick your image with Choose Photo or Choose File, and tap Add. You can remove the original icon from the Home Screen; the app stays in the App Library.' },
    { q: 'Does a custom Shortcuts icon open the Shortcuts app first?', a: 'Not since iOS 14.3, according to reports when that update shipped: the icon opens the app directly, but a small Shortcuts banner appears at the top of the screen. Older iOS versions opened the Shortcuts app first. Behaviour can change between iOS versions, so test one icon before redoing your whole screen.' },
    { q: 'What size should a Notion page icon be?', a: 'Notion’s help centre says uploaded page and callout icons should ideally be 280 x 280 pixels. A square transparent PNG at 256 or 512 px works well. Notion cannot recolour images, so download the colour you want.' },
    { q: 'Can I change app icons on Android?', a: 'It depends on your phone. Google’s Pixel help pages cover icon size and layout, but not custom images for apps. The usual route is a launcher app from Google Play that supports custom icons; set it as your default home app in Settings, then touch and hold an app to edit its icon.' },
    { q: 'Are coquette and kawaii icons free for commercial use?', a: 'Yes, with icons is MIT licensed, so you can use the icons in client work, shop listings, printables and apps with no credit. Anyone can use the same icons, so recolour them with a palette if you want yours to feel unique.' },
  ],
  sources: [
    { title: 'Apple Support: Add a shortcut to the Home Screen on iPhone or iPad (checked November 2026)', url: 'https://support.apple.com/guide/shortcuts/add-a-shortcut-to-the-home-screen-apd735880972/ios' },
    { title: 'Apple Support: Create a custom shortcut on iPhone or iPad', url: 'https://support.apple.com/guide/shortcuts/create-a-custom-shortcut-apd84c576f8c/ios' },
    { title: 'Apple Support: About share actions in Shortcuts (Open App)', url: 'https://support.apple.com/guide/shortcuts/apdaf74d75a5/ios' },
    { title: 'Apple Support: Remove or delete apps from iPhone (Remove from Home Screen)', url: 'https://support.apple.com/guide/iphone/remove-or-delete-apps-iph248b543ca/ios' },
    { title: 'MacStories: Custom shortcut icons no longer open the Shortcuts app first (iOS 14.3)', url: 'https://www.macstories.net/linked/custom-shortcut-icons-no-longer-open-the-shortcuts-app-first-in-ios-14-3-beta-2/' },
    { title: 'Pixel Phone Help: Set or clear default apps', url: 'https://support.google.com/pixelphone/answer/6271667?hl=en' },
    { title: 'Pixel Phone Help: Add apps, shortcuts and widgets to your Home screens', url: 'https://support.google.com/pixelphone/answer/2781850' },
    { title: 'Notion Help: Style and customize your page (page and callout icons, 280 x 280)', url: 'https://www.notion.com/help/customize-and-style-your-content' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Aesthetic icons are soft, matching icons that give a Notion page, a slide deck or a phone home screen one clear mood: dreamy pastel, pink coquette, cute kawaii, cosy plush or glossy 3D. You can get them free from with icons in seven aesthetic styles, as PNG or SVG, with no credit. The trick is to pick one style and one palette and use it everywhere.</span>`)}
${p(`Below you will meet each aesthetic style with real icons, how to choose a mood and keep it, and step-by-step routes for Notion, slides, iPhone and Android. Every icon here comes from ${L.icons('with icons')}, where ${N_ICONS} icons are drawn once and rendered in ${N_STYLES} styles (${N_SVGS} SVGs), so a pastel cloud and a coquette cloud really are the same cloud. Platform steps were checked on Apple, Google and Notion’s own help pages in November 2026.`)}
${styleRow('heart', 'One heart in the seven aesthetic styles: pastel, coquette, kawaii, plush, soft 3D, clay and sticker.', { styles: AESTHETIC })}

${h2('What are aesthetic icons?')}
${p('“Aesthetic” has become shorthand for a look that is calm, curated and a little dreamy. Aesthetic icons share a few things: soft or candy colours, rounded shapes, gentle shading and a set where every icon clearly belongs to the same family. They are less about function and more about how a space feels when you open it.')}
${p(`They are not meant for dense app toolbars. For that, plain ${L.style('line', 'line')} and ${L.style('solid', 'solid')} icons read faster. If you want the wider family of fun styles, including pixel, retro and bauhaus, read ${L.post('playful-icon-styles', 'cute and playful icon styles')}.`)}

${h2('Which aesthetic icon style fits your mood?')}
${table(['Mood', 'Style', 'Looks like', 'Lovely for'], [
  ['Calm and dreamy', L.style('pastel', 'Pastel'), 'Soft colour fields in lavender, peach, mint, baby blue, butter and blush', 'Planners, journals, study notes, wellness'],
  ['Romantic and pink', L.style('coquette', 'Coquette'), 'Blush satin objects with ribbon bows, pearls, lace and gold', 'Beauty, boutiques, birthdays, weddings'],
  ['Cute and happy', L.style('kawaii', 'Kawaii'), 'Chubby pastel shapes with a tiny blushing face', 'Journals, kids, cafés, social posts'],
  ['Cosy and huggable', L.style('plush', 'Plush'), 'Stuffed felt toys with stitched seams and buttons', 'Kids, nurseries, bedtime stories'],
  ['Glossy and modern', L.style('soft3d', 'Soft 3D'), 'Studio-lit 3D objects at a gentle angle', 'Home screens, launches, onboarding'],
  ['Puffy and tactile', L.style('clay', 'Clay'), 'Plump matte clay shapes with a soft ground shadow', 'Home screens, AI apps, empty states'],
  ['Loud and Y2K', L.style('sticker', 'Sticker'), 'Die-cut stickers with a puffy white border and sparkles', 'Stories, scrapbooks, merch, wallpapers'],
], 'Seven aesthetic icon styles and the moods they suit')}

${h3('Pastel: the calmest one')}
${iconGrid(['cloud', 'moon', 'flower', 'butterfly', 'rainbow', 'sparkles'], 'pastel', 'Pastel: no outlines, no faces, just soft colour. Calm even in a big grid.')}
${p(`Pastel is the easiest aesthetic style to live with every day, because nothing shouts. It suits a study Notion, a self-care planner or a soft home screen. Get the whole set on the ${L.page('free/pastel-icons.html', 'free pastel icons page')}.`)}

${h3('Coquette: bows and pearls')}
${iconGrid(['heart', 'gift', 'cake', 'crown', 'gem', 'rose'], 'coquette', 'Coquette: ballet pink, ribbon-red bows and little pearls.')}
${p(`Coquette turns everyday objects into keepsakes. It is the style for a beauty brand’s highlights, a birthday invite or a pink phone theme. See them all on the ${L.page('free/coquette-icons.html', 'free coquette icons page')}.`)}

${h3('Kawaii: tiny faces')}
${iconGrid(['cat', 'coffee', 'cherry', 'donut', 'rabbit', 'ice-cream'], 'kawaii', 'Kawaii: every object gets a smile and rosy cheeks.')}
${p(`Kawaii is Japanese for cute. Here every icon is chubby, softly outlined and smiling, which makes a set feel like a little family. The ${L.style('kawaii')} hub shows every kawaii icon, and the ${L.page('free/cute-icons.html', 'free cute icons page')} has a starter set to copy.`)}

${h3('Plush: felt toys')}
${iconGrid(['teddy-bear', 'star', 'moon', 'rocket', 'dog', 'balloon'], 'plush', 'Plush: puffy felt panels, stitches and buttons.')}
${p('Plush looks sewn rather than drawn. It is cosy and warm, made for kids’ spaces, nursery planners and gentle bedtime themes.')}

${h3('Soft 3D and clay: aesthetic app icons')}
${iconGrid(['camera', 'music-note', 'mail', 'phone', 'calendar', 'map-pin'], 'soft3d', 'Soft 3D: real-looking objects with studio light, ready for a home screen.')}
${iconGrid(['headphones', 'shopping-bag', 'clock', 'image', 'message-circle', 'settings'], 'clay', 'Clay: plump, matte and squeezable, with a soft shadow.')}
${p(`These two have the most depth, so they look best as aesthetic app icons on a phone, where each icon sits on its own. Soft 3D is glossy and polished; clay is matte and toy-like. The ${L.page('free/app-icons.html', 'free app icons page')} has ready-made app tiles at up to 1024 px.`)}

${h3('Sticker: Y2K energy')}
${iconGrid(['party-popper', 'heart', 'star', 'camera', 'sun', 'croissant'], 'sticker', 'Sticker: the white border keeps them readable on photos and busy wallpapers.')}
${p('Sticker is the loudest aesthetic style. Its die-cut border makes icons pop on top of photos, so it works for story highlights, scrapbook pages and a playful home screen over a busy wallpaper.')}

${h2('How do you keep an aesthetic icon set consistent?')}
${p('An aesthetic only works when it is consistent. One off-style icon breaks the spell faster than any other mistake. Four simple rules:')}
${ul([
  '<strong>One style.</strong> Choose pastel, or coquette, or clay, and use only that style in one space.',
  '<strong>One palette family.</strong> Many icons share recurring palettes, such as Pastel dream, Soft pastel and Cotton candy. Pick the same one on each icon where you can.',
  '<strong>One size.</strong> Download every PNG at the same size, so nothing looks bigger or blurrier than its neighbours.',
  '<strong>One background.</strong> Keep the page, slide or wallpaper calm, so the icons do the talking.',
])}
${doDont('<p>Pick coquette for your whole Notion dashboard, use the same palette on every page icon, and download each one at 512 px.</p>', '<p>Mix a kawaii cat, a sticker star and a clay clock on one home screen. Each pulls the eye in a different direction.</p>')}
${p(`Because every style comes from the same drawing, changing your mind later is easy: switch the whole set from pastel to kawaii and the shapes stay the same. More on this in ${L.post('consistent-icons', 'how to keep your icons consistent')}.`)}

${h2('How do I use aesthetic icons as Notion page icons?')}
${steps([
  ['Download a square PNG', `Open an icon page or the ${L.page('free/icons-for-notion.html', 'free Notion icons page')}, choose your style and a mid-tone colour, and download a PNG at 256 or 512 px.`],
  ['Open the icon menu', 'In Notion, hover over the top of the page and click Add icon (or click the existing icon).'],
  ['Upload it', 'Switch to the Upload tab and choose your file. Notion’s help centre says uploaded icons should ideally be 280 x 280 pixels, so a 512 px square scales down cleanly.'],
  ['Repeat for callouts', 'Click the icon at the start of a callout block and upload in the same way.'],
])}
${iconGrid(['book-open', 'calendar-check', 'list-checks', 'sticky-note', 'target', 'lightbulb'], 'pastel', 'A pastel set for a study or planner workspace in Notion.')}
${callout('tip', `Notion cannot recolour an image, and very dark icons disappear in dark mode. Pick a mid-tone colour, or download a second copy for dark pages. The ${L.guide('notion', 'Notion guide')} covers every step.`)}

${h2('How do I make aesthetic app icons on iPhone?')}
${p('iPhone does not let you replace an app’s own icon, but the Shortcuts app can put a new icon on your Home Screen that opens the app. These steps follow Apple’s Shortcuts guide.')}
${steps([
  ['Save your icon', `Download a PNG at 1024 px from an icon page and save it to Photos or Files. The ${L.page('free/app-icons.html', 'app icons page')} has ready-made tiles.`],
  ['Make a shortcut', 'Open Shortcuts, tap + to create a new shortcut, add the Open App action and choose the app you want to open.'],
  ['Add it to the Home Screen', 'Open the shortcut’s Details and tap Add to Home Screen.'],
  ['Choose your icon', 'Tap the icon under Home Screen Name and Icon, then Choose Photo or Choose File and pick your PNG. Type the name you want under it, then tap Add.'],
  ['Tidy up', 'Touch and hold the original app icon, tap Remove App, then Remove from Home Screen. The app moves to the App Library; it is not deleted.'],
])}
${callout('note', 'Since iOS 14.3, reviewers reported that a custom icon opens the app directly, with a small Shortcuts banner at the top of the screen instead of opening the Shortcuts app first. Apple’s guide does not describe this either way, and it can change between iOS versions, so make one icon and test it before you redo your whole Home Screen.', 'Be honest with yourself about the banner')}
${figure('phone0', 'A themed home screen only takes a few icons in one style. Start with the apps you open most.')}

${h2('How do I change app icons on Android?')}
${p('Android varies by phone maker. Google’s Pixel help pages cover icon size and Home screen layout, but not choosing your own picture for an app. The usual route is a launcher, an app that replaces your home screen:')}
${steps([
  ['Install a launcher', 'Pick a launcher from Google Play that supports custom icons. Read its reviews before you install it.'],
  ['Make it your home app', 'Open Settings, then Apps, then Default apps, and choose the launcher as your home app. Menu names differ a little between phones.'],
  ['Change each icon', 'In most launchers you touch and hold an app, choose edit, tap the icon and pick your PNG.'],
])}
${p(`For the sizes and shapes real app icons need, see ${L.post('app-icon-vs-ui-icon', 'app icon vs UI icon')}.`)}

${h2('Can I use aesthetic icons in slides?')}
${p(`Yes, and they are at their best there, big and few. On any icon page, press Copy image and paste it into Google Slides, PowerPoint or Keynote. Use three to five icons per slide in one style, at 64px or larger, so faces, bows and stitches stay visible. Our ${L.post('icons-in-presentations', 'guide to icons in presentations')} and the ${L.guide('google-slides', 'Google Slides guide')} show the details.`)}

${h2('How do colour palettes keep aesthetic icons matching?')}
${p('Each icon comes with 20 to 30 hand-picked colour palettes, and one palette recolours every multi-colour style at once. Choose a palette on the icon page or in the studio before you download, and the PNG or SVG keeps those colours. To make a set feel like yours, borrow one colour from the palette for your Notion headings, slide titles or wallpaper.')}
${callout('try', `Open ${L.icon('heart')}, ${L.icon('cloud')} or ${L.icon('cat')}, switch between pastel, coquette and kawaii, then flip through the palettes. Your mood usually shows up within a few clicks.`)}

${h2('What are aesthetic icons not good for?')}
${ul([
  '<strong>Brand logos.</strong> We draw no logos, so there is no Instagram, TikTok or Spotify icon. Use an everyday object instead: a camera, a music note, a chat bubble. If you need exact logos in pink, a paid themed pack is the honest answer.',
  '<strong>Tiny sizes.</strong> Faces, bows and shadows need room. Keep them at 32px or larger.',
  '<strong>Serious messages.</strong> A smiling icon on a payment error feels wrong. Keep plain line icons for warnings.',
])}
${cta('Find your aesthetic', `${N_ICONS} free icons in ${N_STYLES} styles, from pastel to coquette, kawaii and clay. PNG or SVG, MIT licensed, no credit.`, ['heart', 'cloud', 'cat', 'flower', 'sparkles', 'gift'])}
`,
}
