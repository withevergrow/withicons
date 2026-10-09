// "Free … icons" landers for the playful styles (glass, kawaii, sticker, pixel, retro), the studio styles (luxe as
// "3D icons", bauhaus, skeuo), the storybook styles (anime, gothic, pastel, coquette, plush "for kids"), the rich AI styles
// (clay, plus "AI icons" on clay), Product styles (duo + bento/soft3d/dock as "SaaS", bento, suite "enterprise", dock "app icons"),
// Trend styles (liquid glass, chrome, soft3d "soft 3D", brutal "neo-brutalism"), the holiday styles (utsav "Diwali",
// rangoli "Holi", halloween, christmas, lunar "Lunar New Year", valentine "Valentine's Day") and for animated icons.
// A style lander only exists once its renderer does (hasStyle); curated icon lists keep only icons that exist,
// so names from the 200-icon expansion appear automatically as they land.
import { I, esc, cvar, code, STYLES, iconLink } from './render.mjs'
import { hasStyle, MOTION, PRESETS, EFFECTS, ICON_NAMES, META, styleTitle, stylesIn, listTitles, N_STYLES, word } from '../site-pages/lib.mjs'
import { wm, demoFor } from '../site-pages/motion.mjs'

const HAS = new Set(ICON_NAMES)
const pick = (list, n = 24) => [...new Set(list)].filter(x => HAS.has(x)).slice(0, n)

const SETS = {
  cute: ['heart', 'star', 'smile', 'laugh', 'cat', 'dog', 'rabbit', 'bird', 'fish', 'turtle', 'butterfly', 'paw-print', 'flower', 'sprout', 'leaf', 'rainbow', 'cloud', 'sun', 'moon', 'sparkles', 'gift', 'balloon', 'party-popper', 'cake', 'ice-cream', 'cookie', 'donut', 'coffee', 'music-note', 'camera', 'crown', 'gem'],
  hobby: ['palette', 'paintbrush', 'pen-tool', 'camera', 'book-open', 'music-note', 'headphones', 'gamepad', 'coffee', 'chef-hat', 'cooking-pot', 'sprout', 'flower', 'bike', 'tent', 'plane', 'map', 'dumbbell', 'scissors', 'puzzle-piece', 'lightbulb', 'film', 'microphone', 'heart'],
  planner: ['calendar', 'calendar-check', 'clock', 'alarm-clock', 'list-checks', 'check-circle', 'sticky-note', 'notebook', 'bookmark', 'pin', 'flag', 'star', 'heart', 'target', 'trophy', 'medal', 'sparkles', 'lightbulb', 'coffee', 'moon', 'sun', 'cloud', 'gift', 'party-popper'],
  social: ['heart', 'message-circle', 'share', 'share-2', 'bookmark', 'bell', 'camera', 'image', 'video-camera', 'music-note', 'star', 'sparkles', 'smile', 'thumbs-up', 'user', 'users', 'send', 'link', 'globe', 'flame'],
  game: ['gamepad', 'trophy', 'medal', 'crown', 'gem', 'heart', 'star', 'shield', 'key', 'lock', 'coins', 'gift', 'rocket', 'ghost', 'flame', 'zap', 'target', 'map', 'compass', 'flag', 'bomb', 'sword', 'potion', 'skull'],
  ui: ['home', 'search', 'settings', 'user', 'bell', 'mail', 'calendar', 'camera', 'image', 'folder', 'cloud', 'lock', 'heart', 'star', 'download', 'upload', 'play', 'music-note', 'map-pin', 'globe', 'shopping-bag', 'credit-card', 'chart-pie', 'sparkles'],
  dash: ['layout-dashboard', 'chart-bar', 'chart-line', 'chart-pie', 'trending-up', 'activity', 'gauge', 'wallet', 'credit-card', 'bell', 'settings', 'users', 'calendar', 'clock', 'cloud', 'shield-check', 'zap', 'globe', 'database', 'cpu', 'wifi', 'battery', 'sun', 'moon'],
  retro: ['radio', 'tv', 'camera', 'music-note', 'disc', 'headphones', 'phone', 'car', 'bike', 'sun', 'sunset', 'sunrise', 'palm-tree', 'coffee', 'pizza', 'burger', 'ice-cream', 'flower', 'rainbow', 'star', 'heart', 'plane', 'map', 'film'],
  motion: ['bell', 'heart', 'loader', 'star', 'refresh', 'download', 'upload', 'send', 'arrow-right', 'check-circle', 'x-circle', 'alert-triangle', 'eye', 'lightbulb', 'flame', 'rocket', 'cloud', 'sun', 'moon', 'trophy', 'gift', 'settings', 'search', 'music-note', 'battery', 'wifi', 'clock', 'trash'],
}

/** Helpers from free.mjs passed in (steps, facts, BASE_FACTS, N, T). */
export function moreLanders({ steps, facts, BASE_FACTS, N, T }) {
  const out = []
  const PLAY = stylesIn('playful')
  const sib = s => `${styleTitle(s)} is one of ${word(PLAY.length)} playful styles (${PLAY.filter(x => x !== s).map(x => `<a href="../styles/${x}.html">${styleTitle(x)}</a>`).join(', ')}): its own default colours, with the outline following whatever colour you choose. <a href="../styles/${s}.html">See every ${styleTitle(s)} icon</a>.`
  const demo = (names, style, cls = 'ax-play-demo') => `<div class="${cls}">${pick(names, 6).map((n, i) => iconLink('../', n, style, I(n, style, 56), ` style="--i:${i}"`)).join('')}</div>`

  /* ───── animated icons ───── */
  if (Object.keys(MOTION).length) {
    const showcase = ['ring', 'beat', 'spin', 'twinkle', 'float', 'bounce', 'nudge', 'tada'].map(k => ({ k, ...demoFor(k) })).filter(x => x.name)
    const tryStyles = ['line', 'solid', 'duo', 'kawaii', 'sticker', 'glass', 'gloss', 'retro'].map(s => hasStyle(s) ? s : 'line')
    out.push({
      slug: 'animated-icons', short: 'Free animated icons', icon: 'sparkles', color: 'duo', style: 'line', motion: true,
      title: 'Free animated icons: animated SVG, CSS and React, MIT · with icons',
      desc: `Free animated icons: ${N} icons that ring, beat, spin and float, in ${N_STYLES} styles. Download animated SVGs with no code, or add two CSS classes. ${PRESETS.length} motions, reduced-motion safe, MIT.`,
      h1: ['Free', 'animated icons'], q: 'free animated icons, no code needed',
      answer: () => `Every one of the ${N} icons comes with <b>its own animation</b> (a bell rings, a heart beats, a loader spins) and works with ${PRESETS.length} motion presets in all ${N_STYLES} styles. Hover an icon below to watch it move, then click it to make a <b>GIF for your slides</b> (PowerPoint, Google Slides, Keynote), from light and small to smooth and crisp, or an <b>animated SVG</b> for websites and Notion. No code, no account. Developers add two CSS classes from <code>@withicons/motion</code>. Free and MIT licensed.`,
      picker: { actions: ['gif', 'anim', 'svg'], px: 256, groups: [['They move on hover', pick(SETS.motion, 24)]] },
      body: p => `
<section class="ax-split" aria-labelledby="an-show">
  <div><p class="ax-kicker">See them move</p><h2 id="an-show">Motion that says what the icon means</h2>
  <p>Animations here aren’t decoration: each icon moves the way the thing it shows would move. Bells ring from their hook, arrows nudge the way they point, hearts beat. They are plain CSS inside the SVG: no Lottie player, no JavaScript, tiny files. And they stop for anyone who has asked their device for less motion.</p>
  ${facts([...BASE_FACTS(p), ['Motions', `${PRESETS.length} presets (spin, ring, beat, float, twinkle…) plus ${EFFECTS.length} swap transitions that turn one icon into another, like play into pause`], ['Formats', 'GIF for slides and animated SVG (no code), CSS classes, React, Vue, Svelte, Angular and a <code>&lt;with-icon motion&gt;</code> element'], ['Accessibility', 'Respects <code>prefers-reduced-motion</code>, in downloads and in code']])}</div>
  <div class="ax-motion-wall" data-motion-area>${showcase.map((x, i) => iconLink(p, x.name, tryStyles[i], `${wm(x.name, tryStyles[i], 48, x.m)}<small>${x.k}</small>`, ` class="s-${tryStyles[i]}" style="--g:${cvar(tryStyles[i])};--i:${i}"`)).join('')}</div>
</section>
<section aria-labelledby="an-use"><div class="ax-sec-head"><p class="ax-kicker">Use them</p><h2 id="an-use">Three ways to add an animated icon</h2></div>
  ${steps([
    ['No code: a GIF or an animated SVG', `Click an icon above with <b>GIF for slides</b> selected and insert the GIF in PowerPoint, Google Slides or Keynote. Choose <b>Animated SVG</b> for Webflow, Framer, Wix, Squarespace or Notion. Want to tune the speed or pick another motion first? Open the icon and use Customize › Motion, which has the same two downloads. <a href="${p}guides/animate-icons.html">Step-by-step guide</a>.`],
    ['A website: two CSS classes', 'Add <code>motion.css</code> once, then wrap an icon: <code>&lt;span class="wm wm-loop wm-p-ring"&gt;</code>. Use <code>wm-hover</code> to play on hover, inside any button with <code>wm-trigger</code>.'],
    ['An app: any framework', `The same classes work in React, Vue, Svelte and Angular, and a small JS API starts, stops and swaps icons from code. <a href="${p}developers.html#motion">Animation docs</a>.`],
  ])}
  ${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">

<button class="wm-trigger">
  <span class="wm wm-hover wm-p-ring"><svg …bell…></svg></span> Notifications
</button>`, 'html', 'index.html')}
</section>`,
      faq: p => [
        ['Are these animated icons free for commercial use?', `Yes. The icons and their animations are MIT licensed: use them in client work, products and apps with no credit required. <a href="${p}license.html">Licence in plain words</a>.`],
        ['Do I need Lottie or JavaScript?', 'No. The animations are CSS keyframes. An animated SVG carries its own little stylesheet, so it plays wherever SVG images play. The optional JavaScript only adds extras like scroll-triggered motion and swaps from code.'],
        ['Can I use animated icons in PowerPoint or Google Slides?', `Yes: choose <b>GIF for slides</b> above, click an icon and insert the GIF like a picture. It plays when you present in PowerPoint, Google Slides and Keynote. (Slide apps show SVG files as still images, so use the GIF there.) <a href="${p}guides/animate-icons.html">How to</a>.`],
        ['What about people who are sensitive to motion?', 'Every animation, in downloads and in code, switches off when the visitor has turned on “reduce motion” in their system settings.'],
        ['Can an icon change into another icon?', `Yes. Swap transitions turn play into pause, a heart outline into a filled heart, menu into close and more, with ${EFFECTS.length} effects to choose from. <a href="${p}developers.html#motion-swap">See them</a>.`],
      ],
      related: ['cute-icons', 'svg-icons', 'icons-for-react'],
    })
  }

  /* ───── per playful style ───── */
  const S = (style, o) => { if (hasStyle(style)) out.push({ style, color: style, ...o }) }
  S('kawaii', {
    slug: 'cute-icons', short: 'Free cute icons', icon: 'heart',
    title: `Free cute icons: kawaii-style SVG & PNG icons · with icons`,
    desc: `Free cute icons in a kawaii style: ${N} chubby, soft icons with tiny happy faces and rosy cheeks, as SVG or transparent PNG for posts, planners, stickers and hobby projects. MIT.`,
    h1: ['Free cute icons,', 'kawaii style'], q: 'free cute icons',
    answer: () => `The <b>Kawaii</b> style draws all ${N} icons chubby and soft, with a tiny happy face and rosy cheeks, in a sweet default palette. Click any icon below to copy it as a transparent PNG, download it, or copy the SVG. The outline takes whatever colour you pick. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'dl', 'svg'], style: 'kawaii', groups: [['Cute things', pick(SETS.cute, 24)], ['Hobbies', pick(SETS.hobby, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="kw-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="kw-where">For anything that should feel friendly</h2>
  <p>Instagram and TikTok posts, digital planners, Notion dashboards, kids’ worksheets, Etsy shop graphics, craft and baking blogs, birthday invites. Kawaii icons have little faces, so they look best at 32 px and up; for tiny interface buttons use Line or Solid.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sib('kawaii')], ['Colours', 'Pick any colour for the outline. On a website, the soft fills and blush are CSS variables you can change.']])}</div>
  ${demo(SETS.cute, 'kawaii')}
</section>`,
    faq: p => [
      ['Are the cute icons free for commercial use?', `Yes, MIT licensed: use them in products, shop listings and client work with no credit. <a href="${p}license.html">Licence</a>.`],
      ['Can I change the colours?', 'Yes. The colour you pick sets the outline. The pastel fills and cheeks have their own defaults; in code each one is a CSS variable you can override.'],
      ['Can I use them as stickers in GoodNotes or Notability?', 'Yes. Download a transparent PNG at 512 px and import it as an image or into your sticker book.'],
      ['Is there a matching plain version?', 'Yes. Every cute icon has the same name in all the other styles, so you can switch to a clean Line or Solid version any time.'],
    ],
    related: ['sticker-icons', 'animated-icons', 'icons-for-notion'],
  })
  S('sticker', {
    slug: 'sticker-icons', short: 'Free sticker icons', icon: 'star',
    title: 'Free sticker icons: Y2K die-cut stickers, PNG & SVG · with icons',
    desc: `Free sticker icons: ${N} Y2K die-cut stickers with a puffy white border and a sparkle, as transparent PNG or SVG, for stories, planners, journals and posts. MIT, no credit.`,
    h1: ['Free sticker icons,', 'die-cut and puffy'], q: 'free sticker icons',
    answer: () => `The <b>Sticker</b> style turns all ${N} icons into Y2K die-cut stickers: bold colour, a puffy white border and a little sparkle. Click an icon below to copy or download a <b>transparent PNG</b> ready for Instagram stories, digital planners and journals, or grab the SVG. Free and MIT licensed.`,
    picker: { actions: ['dl', 'png', 'svg'], style: 'sticker', px: 512, groups: [['Planner & journal', pick(SETS.planner, 24)], ['Social', pick(SETS.social, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="st-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="st-where">Made to be stuck on things</h2>
  <p>Story stickers, digital planners in GoodNotes and Notability, bullet-journal spreads, YouTube thumbnails, laptop-sticker mockups, merch ideas. The white border keeps them readable on busy photos and dark backgrounds.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sib('sticker')], ['Best size', '512 px PNG for stories and planners; SVG for print and big posters']])}</div>
  ${demo(SETS.planner, 'sticker', 'ax-play-demo is-tilt')}
</section>`,
    faq: p => [
      ['Can I print these as real stickers?', `Yes, they’re MIT licensed, so you can print and even sell them. Download the SVG for sharp print at any size. <a href="${p}license.html">Licence</a>.`],
      ['How do I add one to an Instagram story?', 'Copy it as a PNG on your phone and paste it into the story, or save the PNG and add it from your photos with the sticker tool.'],
      ['Do they have a transparent background?', 'Yes. Every PNG has a see-through background around the white border.'],
    ],
    related: ['cute-icons', 'png-icons', 'retro-icons'],
  })
  S('pixel', {
    slug: 'pixel-icons', short: 'Free pixel art icons', icon: 'gamepad',
    title: 'Free pixel art icons: 8-bit style SVG & PNG · with icons',
    desc: `Free pixel art icons: ${N} crisp 8-bit style icons drawn on a 16 × 16 pixel grid, as SVG or PNG, for games, retro sites, Discord and stream overlays. MIT licensed.`,
    h1: ['Free pixel art icons,', 'crisp 8-bit style'], q: 'free pixel art icons',
    answer: () => `The <b>Pixel</b> style redraws all ${N} icons as crisp pixel art on a 16 × 16 grid, like your favourite old video game. They are real vectors, so the pixels stay perfectly sharp at any size. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit required.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'pixel', groups: [['Game', pick(SETS.game, 24)], ['Interface', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="px-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="px-where">For games, streams and retro vibes</h2>
  <p>Indie game menus and HUDs, itch.io pages, Discord servers and emoji-like badges, Twitch overlays, retro portfolio sites and 8-bit party invites. Because every pixel is a square in the SVG, they never blur, even at 1024 px.</p>
  ${facts([...BASE_FACTS(p), ['Grid', '16 × 16 pixels inside the usual 24 × 24 icon box, so they line up with every other style'], ['Style family', sib('pixel')]])}</div>
  ${demo(SETS.game, 'pixel')}
</section>`,
    faq: p => [
      ['Can I use the pixel icons in my game?', `Yes, including commercial games. MIT licence, no credit required. <a href="${p}license.html">Licence</a>.`],
      ['Will they look blurry when scaled?', 'No. They are SVG squares, so they stay razor sharp at any size. For PNGs, download at the size you need (256, 512 or 1024 px).'],
      ['Can I get a sprite sheet?', `Each style has an SVG sprite for websites on the <a href="${p}developers.html#cdn">developer page</a>. For game engines, download PNGs of the icons you need.`],
    ],
    related: ['retro-icons', 'svg-icons', 'animated-icons'],
  })
  S('glass', {
    slug: 'glassmorphism-icons', short: 'Free glassmorphism icons', icon: 'layers',
    title: 'Free glassmorphism icons: soft frosted glass SVG icons · with icons',
    desc: `Free glassmorphism icons: ${N} soft, luxurious frosted glass icons with a luminous tint, a bright rim and gentle highlights, as SVG or transparent PNG for modern apps, dashboards and landing pages. Real vectors, no blur filters, MIT.`,
    h1: ['Free glassmorphism', 'icons'], q: 'free glassmorphism icons',
    answer: () => `The <b>Glass</b> style turns all ${N} icons into soft, luxurious frosted glass: a milky, softly tinted body, a bright rim of light and gentle highlights, in the glassmorphism look. Click an icon below to copy the SVG or a transparent PNG. The frost is made from plain vector shapes and gradients, not blur filters, so the files stay small and render the same everywhere. Free and MIT licensed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'glass', groups: [['Dashboard', pick(SETS.dash, 24)], ['App', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="gl-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="gl-where">Best on colour</h2>
  <p>Glass icons glow on gradients, photos and dark UIs: app landing pages, fintech and weather dashboards, iOS-style feature grids, pitch-deck hero slides. On a plain white page, try a soft tinted card behind them.</p>
  ${facts([...BASE_FACTS(p), ['How it’s made', 'Frosted shapes with soft gradients, a lit rim and highlights. No blur filters or images, so it stays sharp and light in every browser and design app'], ['Colours', 'Every colour is a CSS variable, so a palette recolours the glass, gradients included'], ['Style family', sib('glass')]])}</div>
  <div class="ax-glass-demo">${pick(SETS.dash, 6).map((n, i) => iconLink(p, n, 'glass', I(n, 'glass', 56), ` style="--i:${i}"`)).join('')}</div>
</section>`,
    faq: p => [
      ['Are these real glassmorphism icons or just transparent?', 'They are drawn as soft frosted glass: a milky tinted body, a bright rim and gentle highlights, the look glassmorphism is known for, built from plain vector shapes and gradients.'],
      ['Do they work in Figma?', `Yes. Copy the SVG and paste it onto the canvas: every layer and gradient arrives editable. <a href="${p}guides/figma.html">Figma guide</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['animated-icons', 'icons-for-figma', 'svg-icons'],
  })
  S('retro', {
    slug: 'retro-icons', short: 'Free retro icons', icon: 'sun',
    title: 'Free retro icons: 70s style SVG & PNG icons · with icons',
    desc: `Free retro icons: ${N} icons with 70s sunset stripes and a chunky outline, as SVG or transparent PNG, for posters, menus, music and vintage brands. MIT licensed.`,
    h1: ['Free retro icons,', 'seventies style'], q: 'free retro icons',
    answer: () => `The <b>Retro</b> style gives all ${N} icons a chunky outline and warm 70s sunset stripes. Click an icon below to copy the SVG, copy a PNG or download one. Pick any colour for the outline; the stripes keep their groovy palette. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'retro', groups: [['Retro favourites', pick(SETS.retro, 24)], ['Everyday', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="rt-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="rt-where">Posters, menus and good vibes</h2>
  <p>Gig posters, café and food-truck menus, vinyl and playlist covers, surf and travel brands, vintage-style T-shirts and event flyers. They look best big: 48 px and up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sib('retro')], ['Print', 'Download the SVG: sharp at any size, from stickers to banners']])}</div>
  ${demo(SETS.retro, 'retro')}
</section>`,
    faq: p => [
      ['Can I use retro icons on merch I sell?', `Yes. MIT licensed, so T-shirts, posters and prints are fine, no credit required. Anyone else can use the same icons, so customise them for a logo. <a href="${p}license.html">Licence</a>.`],
      ['Can I change the stripe colours?', 'The outline follows the colour you pick. On a website the stripe colours are CSS variables; in design apps, paste the SVG and recolour the stripes.'],
    ],
    related: ['pixel-icons', 'sticker-icons', 'hand-drawn-icons'],
  })

  /* ───── the studio styles: luxe (3D), bauhaus, skeuo ───── */
  const STU = stylesIn('studio')
  const sibS = s => `${styleTitle(s)} is one of ${word(STU.length)} studio styles (${STU.filter(x => x !== s).map(x => `<a href="../styles/${x}.html">${styleTitle(x)}</a>`).join(', ')}): art-directed looks whose colours are role-named CSS variables, so one palette recolours them all. <a href="../styles/${s}.html">See every ${styleTitle(s)} icon</a>.`
  S('luxe', {
    slug: '3d-icons', short: 'Free 3D icons', icon: 'gem',
    title: 'Free 3D icons: premium layered SVG & PNG icons · with icons',
    desc: `Free 3D icons: ${N} premium icons with real depth, sapphire enamel, polished gold and soft light, as SVG or transparent PNG. Pure vector, no renders. MIT licensed.`,
    h1: ['Free 3D icons,', 'luxe and layered'], q: 'free 3d icons',
    answer: () => `The <b>Luxe</b> style turns all ${N} icons into small precious objects: an enamel slab with an extruded side wall, polished gold trim, lit chamfers and a crisp highlight. It is all flat vector layers, so it stays sharp at any size and weighs a few kilobytes. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'luxe', groups: [['Premium favourites', pick(['crown', 'gem', 'trophy', 'medal', 'gift', 'key', 'wallet', 'credit-card', 'coins', 'diamond', 'rocket', 'star', 'heart', 'bell', 'shield-check', 'lock', 'sparkles', 'award', 'badge-check', 'shopping-bag', 'chart-line', 'globe', 'camera', 'home'], 24)], ['Everyday', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="lx-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="lx-where">Hero sections, app tiles and pricing</h2>
  <p>Landing-page heroes, premium and pricing tiers, fintech and banking apps, onboarding, launch posts and luxury brands. The depth reads best from 48 px up; under that, use Solid or Duo for the same icon.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibS('luxe')], ['Not a render', 'Real vectors: no images, filters or gradients, so it stays crisp and tiny on any screen']])}</div>
  ${demo(['crown', 'gem', 'trophy', 'gift', 'rocket', 'wallet', 'key', 'heart'], 'luxe')}
</section>`,
    faq: p => [
      ['Are these real 3D models?', 'No, and that is the point: each icon is a stack of flat vector layers (shadow, side wall, face, chamfer, highlight) drawn to read as 3D. That keeps the files small, sharp at any size and editable in Figma, Illustrator or Canva.'],
      ['Can I change the colours?', `Yes. Pick a palette in the icon editor (sapphire and gold is the default) and every layer follows. On a website each colour is a CSS variable like <code>--with-luxe-c1</code>. <a href="${p}guides/index.html">How-to guides</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['skeuomorphic-icons', 'glassmorphism-icons', 'png-icons'],
  })
  S('bauhaus', {
    slug: 'bauhaus-icons', short: 'Free Bauhaus icons', icon: 'palette',
    title: 'Free Bauhaus icons: geometric SVG & PNG icons · with icons',
    desc: `Free Bauhaus icons: ${N} geometric icons built from circles, squares and triangles in red, yellow and blue, as SVG or transparent PNG. Modernist, bold, MIT licensed.`,
    h1: ['Free Bauhaus icons,', 'pure geometry'], q: 'free bauhaus icons',
    answer: () => `The <b>Bauhaus</b> style rebuilds all ${N} icons from pure geometry, composed like a 1920s poster: circles, squares and bars in the primaries, overprinting where they meet. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'bauhaus', groups: [['Bauhaus favourites', pick(['home', 'clock', 'music-note', 'camera', 'sun', 'moon', 'compass', 'palette', 'globe', 'book-open', 'lightbulb', 'chart-pie', 'star', 'heart', 'eye', 'key', 'bell', 'coffee', 'bike', 'plane', 'flower', 'leaf', 'umbrella', 'shapes'], 24)], ['Everyday', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="bh-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="bh-where">Posters, portfolios and galleries</h2>
  <p>Exhibition and event posters, design-studio and architecture portfolios, museums, editorial layouts, book covers and bold brand systems. Large and confident: 48 px and up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibS('bauhaus')], ['Colours', 'Red, yellow and blue on black and paper by default; swap the primaries for your brand with one palette']])}</div>
  ${demo(['clock', 'music-note', 'sun', 'compass', 'camera', 'palette', 'globe', 'home'], 'bauhaus')}
</section>`,
    faq: p => [
      ['Are these traced from real Bauhaus designs?', 'No. Every icon is drawn from scratch for with icons, rebuilt from circles, squares and bars in the spirit of the Bauhaus school. Nothing is copied from historical works or other icon sets.'],
      ['Can I use my brand colours instead of the primaries?', `Yes. Pick a palette in the icon editor or, on a website, set <code>--with-bauhaus-c1</code> to <code>c3</code>. The black parts follow the colour you choose. <a href="${p}developers.html">Developer docs</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['retro-icons', 'svg-icons', 'icons-for-canva'],
  })
  S('skeuo', {
    slug: 'skeuomorphic-icons', short: 'Free skeuomorphic icons', icon: 'camera',
    title: 'Free skeuomorphic icons: realistic SVG & PNG icons · with icons',
    desc: `Free skeuomorphic icons: ${N} realistic, tactile icons in real materials (paper, leather, brushed metal, brass, glass) with bevels and soft shadows, as SVG or PNG. MIT licensed.`,
    h1: ['Free skeuomorphic icons,', 'real materials'], q: 'free skeuomorphic icons',
    answer: () => `The <b>Skeuo</b> style makes all ${N} icons look like objects you could pick up: each is made of a real material, lit from the upper left, with inner walls, debossed detail and a soft contact shadow. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'skeuo', groups: [['Skeuo favourites', pick(['camera', 'calendar', 'clock', 'mail', 'phone', 'settings', 'folder', 'notebook', 'music-note', 'microphone', 'headphones', 'lock', 'key', 'wallet', 'briefcase', 'calculator', 'radio', 'tv', 'battery', 'lightbulb', 'compass', 'book-open', 'coffee', 'gift'], 24)], ['Everyday', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="sk-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="sk-where">App icons, tools and nostalgic UIs</h2>
  <p>App and dock icons, music, photo and note apps, dashboards with physical-feeling controls, product mock-ups and anything that should feel crafted and touchable. Best from 48 px up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibS('skeuo')], ['Materials', 'Paper, leather, brushed metal, brass, wood, ceramic, plastic and glass, chosen per object']])}</div>
  ${demo(['camera', 'calendar', 'clock', 'notebook', 'microphone', 'lock', 'radio', 'folder'], 'skeuo')}
</section>`,
    faq: p => [
      ['What does skeuomorphic mean?', 'A skeuomorphic icon imitates the real object it stands for: the leather of a notebook, the brushed metal of a camera, the glass of a lens. It was the look of early iPhone apps and is back as a warm alternative to flat design.'],
      ['Are these photos or 3D renders?', 'Neither. They are pure vector layers (light, shade, bevels and grain), so they stay sharp at any size, stay small and can be edited in Figma, Illustrator or Canva.'],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['3d-icons', 'bauhaus-icons', 'icons-for-figma'],
  })
  /* ───── the storybook styles: anime, gothic, pastel, coquette, plush ───── */
  const STORY = stylesIn('storybook')
  const sibB = s => `${styleTitle(s)} is one of ${word(STORY.length)} storybook styles (${STORY.filter(x => x !== s).map(x => `<a href="../styles/${x}.html">${styleTitle(x)}</a>`).join(', ')}): small illustrations whose colours are role-named CSS variables, so one palette recolours them all. <a href="../styles/${s}.html">See every ${styleTitle(s)} icon</a>.`
  S('anime', {
    slug: 'anime-icons', short: 'Free anime icons', icon: 'sparkles',
    title: 'Free anime icons: cel-shaded SVG & PNG icons · with icons',
    desc: `Free anime icons: ${N} cel-shaded icons with tapered ink lines, bright flat colour, one hard shadow and sparkling highlights, as SVG or transparent PNG. MIT licensed.`,
    h1: ['Free anime icons,', 'cel-shaded'], q: 'free anime icons',
    answer: () => `The <b>Anime</b> style draws all ${N} icons like props from an anime frame: crisp tapered ink lines, flat cel colour in sky blue, sakura pink and warm gold, one hard shadow tone and a bright specular shine. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'svg', 'dl'], style: 'anime', groups: [['Anime favourites', pick(['rocket', 'zap', 'star', 'heart', 'sparkles', 'gamepad', 'music-note', 'headphones', 'camera', 'cat', 'moon', 'sun', 'flame', 'trophy', 'crown', 'gift', 'cake', 'cherry', 'flower', 'umbrella', 'bike', 'train', 'smartphone', 'mail'], 24)], ['Games', pick(SETS.game, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="an-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="an-where">Games, streams and fan pages</h2>
  <p>Game menus and HUDs, streaming overlays and panels, fan sites, creator pages, Discord servers, social posts and Gen Z apps. The cel shading reads best from 32 px up; at 16 to 24 px use Line or Solid for the same icon.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibB('anime')], ['The look', 'Ink line art in deep plum (never flat black), flat cel colour, one hard shadow, a rim light and the odd sparkle']])}</div>
  ${demo(['rocket', 'star', 'heart', 'gamepad', 'cat', 'music-note', 'zap', 'moon'], 'anime')}
</section>`,
    faq: p => [
      ['Are these traced from an anime or a studio?', 'No. Every icon is drawn from scratch for with icons in a cel-shaded look inspired by animation in general. Nothing is copied from any show, studio or other icon set.'],
      ['Can I change the colours?', `Yes. Pick a palette in the icon editor and every layer follows; on a website each colour is a CSS variable like <code>--with-anime-c1</code> (the main colour) or <code>--with-anime-shadow</code> (the cel shadow). <a href="${p}developers.html">Developer docs</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['sticker-icons', 'cute-icons', 'pixel-icons'],
  })
  S('gothic', {
    slug: 'gothic-icons', short: 'Free gothic icons', icon: 'key',
    title: 'Free gothic icons: medieval cathedral SVG & PNG icons · with icons',
    desc: `Free gothic icons: ${N} medieval, cathedral-style icons in carved limestone with stained glass in ruby, sapphire, gold and emerald, pointed arches and tracery, as SVG or PNG. MIT licensed.`,
    h1: ['Free gothic icons,', 'carved and stained'], q: 'free gothic icons',
    answer: () => `The <b>Gothic</b> style carves all ${N} icons like pieces of an old cathedral or castle: limestone with bevelled edges, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and gilded metal. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'svg', 'dl'], style: 'gothic', groups: [['Gothic favourites', pick(['key', 'lock', 'book-open', 'book', 'bell', 'crown', 'shield', 'hourglass', 'moon', 'star', 'compass', 'scroll-text', 'library', 'landmark', 'flame', 'heart', 'gem', 'map', 'feather', 'wine', 'clock', 'eye', 'door-open', 'music-note'], 24)], ['Games', pick(SETS.game, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="go-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="go-where">Fantasy games, books and dark-luxe brands</h2>
  <p>Fantasy and RPG games, tabletop campaigns, book covers and publishers, bands and music, Halloween events, tattoo studios, museums and churches. Rich in detail, so give them room: 48 px and up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibB('gothic')], ['Materials', 'Carved limestone, stained glass in dark lead, wrought iron and gilding, lit like candlelight']])}</div>
  ${demo(['key', 'book-open', 'bell', 'crown', 'shield', 'hourglass', 'lock', 'moon'], 'gothic')}
</section>`,
    faq: p => [
      ['Is this a gothic font or blackletter?', 'No. Gothic here means the architecture: each icon is built like a cathedral piece, with pointed arches, stone tracery and stained-glass panes. The icons contain no lettering.'],
      ['Can I change the glass colours?', `Yes. Pick a palette in the icon editor, or on a website set <code>--with-gothic-c1</code> to <code>c4</code> (the four glass colours), <code>--with-gothic-tint</code> (the stone) and <code>--with-gothic-accent</code> (the gilding). <a href="${p}developers.html">Developer docs</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['3d-icons', 'skeuomorphic-icons', 'retro-icons'],
  })
  S('pastel', {
    slug: 'pastel-icons', short: 'Free pastel icons', icon: 'cloud',
    title: 'Free pastel icons: soft aesthetic SVG & PNG icons · with icons',
    desc: `Free pastel icons: ${N} soft, aesthetic icons in lavender, peach, mint, baby blue, butter and blush with gentle depth, as SVG or transparent PNG for apps, planners and posts. MIT.`,
    h1: ['Free pastel icons,', 'soft and dreamy'], q: 'free pastel icons',
    answer: () => `The <b>Pastel</b> style paints all ${N} icons in soft colour fields (lavender, peach, mint, baby blue, butter and blush) with a gentle tonal depth and no harsh outlines. Calm enough for a whole grid of them. Click an icon below to copy it as a transparent PNG, download it or copy the SVG. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'dl', 'svg'], style: 'pastel', groups: [['Soft favourites', pick(['cloud', 'heart', 'moon', 'star', 'flower', 'coffee', 'gift', 'balloon', 'cake', 'rainbow', 'ice-cream', 'leaf', 'sun', 'butterfly', 'sprout', 'music-note', 'camera', 'book-open', 'calendar', 'bell', 'home', 'mail', 'sparkles', 'smile'], 24)], ['Planner', pick(SETS.planner, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="pa-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="pa-where">Aesthetic apps, planners and wellness</h2>
  <p>Phone home screens and widgets, digital planners and journals, wellness, meditation and baby apps, lifestyle brands, Notion pages and soft social posts. Best from 32 px up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibB('pastel')], ['Colours', 'Lavender, peach, mint, baby blue, butter and blush, picked per object']])}</div>
  ${demo(['cloud', 'heart', 'moon', 'flower', 'coffee', 'rainbow', 'gift', 'star'], 'pastel')}
</section>`,
    faq: p => [
      ['Can I use them for an aesthetic home screen?', 'Yes. Download PNGs at any size (they have transparent backgrounds) and set them as app icons with Shortcuts on iPhone or a launcher on Android.'],
      ['Can I change the colours?', `Yes. Pick a palette in the icon editor, or on a website set <code>--with-pastel-c1</code> to <code>c4</code>. <a href="${p}guides/index.html">How-to guides</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['cute-icons', 'coquette-icons', 'icons-for-notion'],
  })
  S('coquette', {
    slug: 'coquette-icons', short: 'Free coquette icons', icon: 'heart',
    title: 'Free coquette icons: pink bow aesthetic SVG & PNG icons · with icons',
    desc: `Free coquette icons: ${N} ballet-pink icons tied with ribbon bows, with pearls, lace and delicate gold, as SVG or transparent PNG for beauty, fashion and feminine brands. MIT licensed.`,
    h1: ['Free coquette icons,', 'bows and pearls'], q: 'free coquette icons',
    answer: () => `The <b>Coquette</b> style dresses all ${N} icons in ballet-pink satin, ties them with ribbon-red bows and adds pearls, lace and a touch of gold. Click an icon below to copy it as a transparent PNG, download it or copy the SVG. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'dl', 'svg'], style: 'coquette', groups: [['Coquette favourites', pick(['heart', 'gift', 'crown', 'gem', 'flower', 'mail', 'camera', 'cake', 'coffee', 'star', 'butterfly', 'sparkles', 'shopping-bag', 'scissors', 'music-note', 'book-open', 'calendar', 'bell', 'wine', 'cherry', 'moon', 'cat', 'key', 'lock'], 24)], ['Social', pick(SETS.social, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="cq-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="cq-where">Beauty, fashion and feminine brands</h2>
  <p>Beauty and nail salons, boutiques and fashion shops, wedding invitations, Pinterest and Instagram posts, link-in-bio pages, journals and girly phone themes. Best from 32 px up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibB('coquette')], ['The details', 'Blush satin, ribbon-red bows, pearls, white lace and delicate gold clasps']])}</div>
  ${demo(['heart', 'gift', 'crown', 'flower', 'camera', 'cake', 'mail', 'gem'], 'coquette')}
</section>`,
    faq: p => [
      ['What is the coquette aesthetic?', 'A romantic, girly look built on soft pinks, satin bows, pearls and lace, popular across Pinterest, TikTok and fashion. These icons bring it to everyday objects.'],
      ['Can I change the pink?', `Yes. Pick a palette in the icon editor, or on a website set <code>--with-coquette-c1</code> (the blush), <code>--with-coquette-c3</code> (the ribbon) and <code>--with-coquette-accent</code> (the gold). <a href="${p}developers.html">Developer docs</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['pastel-icons', 'cute-icons', 'sticker-icons'],
  })
  S('plush', {
    slug: 'plush-icons', short: 'Free plush icons for kids', icon: 'rabbit',
    title: 'Free plush icons for kids: soft toy SVG & PNG icons · with icons',
    desc: `Free plush icons for kids: ${N} stuffed-toy icons sewn from felt, with puffy panels, piping, running stitches and buttons, as SVG or transparent PNG for kids' apps, learning and nurseries. MIT.`,
    h1: ['Free plush icons', 'for kids'], q: 'free icons for kids',
    answer: () => `The <b>Plush</b> style sews all ${N} icons from felt like little stuffed toys: puffy panels in tomato, sunflower, sky and mint, dark piping, running stitches, buttons and embroidered details. Friendly and easy to read for children. Click an icon below to copy it as a transparent PNG, download it or copy the SVG. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'dl', 'svg'], style: 'plush', groups: [['Toy box favourites', pick(['star', 'moon', 'cloud', 'heart', 'home', 'rocket', 'balloon', 'cat', 'dog', 'rabbit', 'turtle', 'fish', 'bird', 'sun', 'rainbow', 'apple', 'cake', 'gift', 'music-note', 'puzzle-piece', 'book-open', 'bus', 'train', 'school'], 24)], ['Cute things', pick(SETS.cute, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="pl-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="pl-where">Kids’ apps, learning and nurseries</h2>
  <p>Children’s apps and games, learning and phonics tools, classroom slides and worksheets, nurseries, toy shops, birthday invitations and family brands. Big, soft shapes that young children recognise: 48 px and up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibB('plush')], ['Made of', 'Felt panels, piping, running stitches, buttons and embroidery, all as flat vector layers']])}</div>
  ${demo(['rabbit', 'star', 'rocket', 'cat', 'balloon', 'moon', 'home', 'turtle'], 'plush')}
</section>`,
    faq: p => [
      ['Are these good for young children?', 'Yes. Every icon is a simple, chunky object with bright, friendly colours and no small text, so pre-readers can recognise them. Pair each icon with a spoken or written label in your app.'],
      ['Can I print them for a classroom?', `Yes. Download a PNG at up to 1024 px or the SVG for sharp prints at any size, and use them on worksheets, labels and posters. <a href="${p}guides/index.html">How-to guides</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required, including in paid apps and products. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['cute-icons', 'pastel-icons', 'animated-icons'],
  })

  /* ───── the rich styles (gradients): clay, bento, suite, dock, liquid, chrome, soft3d, brutal; plus the AI lander (on
     clay) and the SaaS lander (duo with its accent, then bento, soft3d and dock) ───── */
  const sibG = (id, label) => s => {
    const others = stylesIn(id).filter(x => x !== s)
    const fam = others.length ? `${styleTitle(s)} is one of ${word(others.length + 1)} ${label} styles (with ${others.map(x => `<a href="../styles/${x}.html">${styleTitle(x)}</a>`).join(', ')})` : `${styleTitle(s)} is one of the ${label} styles`
    return `${fam}: rich looks whose colours, gradient stops included, are role-named CSS variables, so one palette recolours them all. <a href="../styles/${s}.html">See every ${styleTitle(s)} icon</a>.`
  }
  // the family line names the style's own picker group (site.js GROUPS)
  const GL = { essentials: 'Essentials', product: 'Product & brand', depth: '3D & glass', playful: 'playful', artistic: 'artistic', holidays: 'holiday' }
  const sibAny = s => { const id = Object.keys(GL).find(g => stylesIn(g).includes(s)) || 'depth'; return sibG(id, GL[id])(s) }
  const sibAI = sibAny, sibP = sibAny, sibT = sibAny
  const RICH_FAQ = (p, s) => [
    ['Do the gradients survive copy and paste?', `Yes. Each gradient sits inside the SVG with its own id, and the site and the packages make those ids unique for every icon on a page, so two icons never borrow each other’s colours. A downloaded .svg file has its colours baked in, ready for Figma, Illustrator or Canva.`],
    ['Can I change the colours?', `Yes. Pick a palette in the icon editor and every layer and gradient follows. On a website each colour is a CSS variable like <code>--with-${s}-c1</code> or <code>--with-${s}-accent</code>, and the gradient stops read the same variables. <a href="${p}developers.html">Developer docs</a>.`],
    ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
  ]
  const AI_SET = ['sparkles', 'wand-sparkles', 'bot', 'bot-message-square', 'brain', 'brain-circuit', 'message-circle', 'wand', 'cpu', 'circuit-board', 'workflow', 'scan-search', 'radar', 'lightbulb', 'zap', 'search', 'mic-vocal', 'audio-waveform', 'image', 'code-xml', 'database', 'globe', 'rocket', 'shield-check']
  const AI_CAT = META.icons.filter(i => i.category === 'ai').map(i => i.name)
  const SAAS = ['layout-dashboard', 'inbox', 'kanban', 'search', 'settings', 'users', 'bell', 'calendar', 'git-branch', 'terminal', 'command', 'component', 'blocks', 'database', 'server', 'cloud', 'chart-bar', 'chart-line', 'filter', 'sliders', 'link', 'lock', 'code-xml', 'webhook']
  const OFFICE = ['mail', 'calendar', 'file-text', 'folder', 'users', 'chart-bar', 'chart-pie', 'clipboard', 'list-checks', 'briefcase', 'building-2', 'cloud', 'database', 'server', 'shield-check', 'lock', 'key', 'settings', 'receipt', 'credit-card', 'globe', 'headset', 'message-circle', 'video-camera']
  const APPS = ['camera', 'music-note', 'mail', 'calendar', 'map', 'message-circle', 'settings', 'image', 'notebook', 'clock', 'calculator', 'wallet', 'headphones', 'video-camera', 'globe', 'shopping-bag', 'book-open', 'gamepad', 'phone', 'cloud', 'sun', 'heart', 'folder', 'terminal']
  const BOLD = ['rocket', 'zap', 'star', 'heart', 'flame', 'megaphone', 'smile', 'thumbs-up', 'trophy', 'target', 'lightbulb', 'sparkles', 'music-note', 'camera', 'coffee', 'gift', 'mail', 'bell', 'shopping-bag', 'globe', 'code', 'pen-tool', 'palette', 'crown']
  const TECH = ['server', 'database', 'cloud', 'cpu', 'cube', 'boxes', 'blocks', 'package', 'truck', 'building-2', 'store', 'home', 'shield-check', 'lock', 'globe', 'satellite', 'satellite-dish', 'router', 'monitor', 'smartphone', 'rocket', 'chart-bar', 'gamepad', 'map']

  S('clay', {
    slug: 'clay-icons', short: 'Free clay icons', icon: 'sparkles',
    title: 'Free clay icons: soft 3D clay SVG & PNG icons · with icons',
    desc: `Free clay icons: ${N} soft, rounded faux-3D icons that look sculpted from matte clay, as SVG or transparent PNG for AI products, onboarding, landing pages and empty states. MIT licensed.`,
    h1: ['Free clay icons,', 'soft 3D'], q: 'free 3d clay icons',
    answer: () => `The <b>Clay</b> style turns all ${N} icons into soft, rounded objects that look sculpted from matte clay: puffy forms, soft studio light and warm colour. It is all vector shapes and gradients, so it stays sharp at any size. Click an icon below to copy it as a transparent PNG, download it or copy the SVG. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'dl', 'svg'], style: 'clay', groups: [['Clay favourites', pick(['sparkles', 'rocket', 'heart', 'star', 'gift', 'lightbulb', 'bot', 'trophy', 'cloud', 'sun', 'moon', 'camera', 'music-note', 'coffee', 'home', 'mail', 'bell', 'shopping-bag', 'wallet', 'chart-pie', 'globe', 'smile', 'puzzle-piece', 'balloon'], 24)], ['Interface', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="cl-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="cl-where">AI products, onboarding and empty states</h2>
  <p>AI assistants, consumer apps, onboarding flows, friendly SaaS landing pages, empty states and feature cards: the warm, tactile look of AI-era product art. The soft depth reads best from 32 px up; at 16 to 24 px use Line or Solid for the same icon.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibAI('clay')], ['Not a render', 'Real vectors with soft gradients: no images or blur filters, so it stays crisp and small']])}</div>
  ${demo(['sparkles', 'rocket', 'heart', 'gift', 'lightbulb', 'bot', 'trophy', 'cloud'], 'clay')}
</section>`,
    faq: p => [
      ['Are these 3D renders?', 'No. Each icon is flat vector layers and soft gradients drawn to read as matte clay, so it stays sharp, small and editable in Figma, Illustrator or Canva.'],
      ...RICH_FAQ(p, 'clay'),
    ],
    related: ['ai-icons', '3d-icons', 'plush-icons'],
  })
  S('clay', {
    slug: 'ai-icons', short: 'Free AI icons', icon: 'sparkles',
    title: 'Free AI icons: sparkles, bots and brains in 3D, SVG & PNG · with icons',
    desc: `Free AI icons: sparkles, bots, brains, wands and workflows in soft 3D clay, liquid glass, chrome and glass, plus all ${N} icons in ${N_STYLES} styles, as SVG or transparent PNG. MIT licensed.`,
    h1: ['Free AI icons,', 'soft and shiny'], q: 'free AI icons',
    answer: () => `Below are the AI icons first (sparkles, bots, brains, wands, workflows and more), drawn in the <b>Clay</b> style: soft, rounded 3D forms with warm studio light, the tactile look of AI-era product art. Switch to Liquid, Chrome or Glass for a cooler, glossier feel; every icon keeps the same name in all ${N_STYLES} styles. Click an icon to copy the SVG, copy a PNG or download one.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'clay', lead: ['liquid', 'chrome', 'glass'], groups: [['AI', pick([...AI_CAT, ...AI_SET], 24)], ['Interface', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="au-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="au-where">AI features, copilots and launches</h2>
  <p>AI copilots and chat apps, “Ask AI” buttons, model launches, feature announcements and onboarding. Clay feels warm and friendly; Liquid, Chrome and Glass look sleek on dark backgrounds. In a dense toolbar use Line or Duo for the same icon and keep the 3D version for the moment that matters.</p>
  ${facts([...BASE_FACTS(p), ['AI icons', `Sparkles, bots, brains, wands, workflows and more${AI_CAT.length ? `, with their own <a href="${p}categories/ai.html">AI category</a>` : ''}`], ['Style family', sibAI('clay')]])}</div>
  ${demo([...AI_CAT, ...AI_SET], 'clay')}
</section>`,
    faq: p => [
      ['Which icon should I use for an AI feature?', 'Sparkles is the most widely understood sign for “AI” today. A bot or a chat bubble suits assistants, a magic wand suits “generate” and “improve” actions, and a brain suits models and reasoning.'],
      ['Do the AI icons come in other styles?', `Yes. Every icon has the same name in all ${N_STYLES} styles, so the sparkles in your toolbar can be Line while the hero uses Clay, Liquid or Chrome.`],
      ...RICH_FAQ(p, 'clay'),
    ],
    related: ['clay-icons', 'liquid-glass-icons', 'animated-icons'],
  })
  S('duo', {
    slug: 'saas-icons', short: 'Free SaaS icons', icon: 'layout-dashboard',
    title: 'Free SaaS icons: product UI, bento and 3D SVG icons · with icons',
    desc: `Free SaaS and product icons: ${N} icons in Duo (an outline, a soft tint and one accent detail) plus Bento tiles, soft 3D and app-icon tiles, as SVG or PNG for dashboards, docs and landing pages. MIT.`,
    h1: ['Free SaaS icons,', 'UI to landing page'], q: 'free SaaS icons',
    answer: () => `In the product itself, the <b>Duo</b> style draws all ${N} icons as calm outlines over a soft tint, with one small accent detail in your brand colour (and an opt-in gradient stroke for hero moments). On the landing page, the same icons come as <b>Bento</b> tiles for feature grids, <b>Soft 3D</b> for hero art and explainers and <b>Dock</b> app tiles for launches. Click an icon below to copy the SVG, copy a PNG or download one.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'duo', lead: ['bento', 'soft3d', 'dock'], groups: [['Product UI', pick(SAAS, 24)], ['Interface', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="ln-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="ln-where">Dashboards, dev tools and landing pages</h2>
  <p>SaaS dashboards, settings screens, command menus and docs in Duo, which shares Line’s grid and names, so it sits next to Line in a sidebar without a pixel of drift. Then Bento for “why us” feature grids, Soft 3D for hero art and onboarding explainers, and Dock for app launches and download pages.</p>
  ${facts([...BASE_FACTS(p), ['Accent colour', 'Set <code>--with-duo-accent</code> once in CSS and every icon’s accent detail follows your brand'], ['In code', '<code>npm i @withicons/react</code> and import from <code>@withicons/react/duo</code> (or <code>/bento</code>, <code>/soft3d</code>, <code>/dock</code>); the same subpaths work in Vue, Svelte, Angular and Solid']])}</div>
  ${demo(SAAS, 'duo')}
</section>`,
    faq: p => [
      ['Which style should I use inside the product?', 'Line or Duo: they read from 16px, take any colour and stay calm in dense UI. Duo adds a soft tint and one accent detail, so a feature list or an empty state gets a little colour without getting loud.'],
      ['And on the landing page?', `Bento tiles for feature grids, Soft 3D for hero art and explainers, Dock for app launches. They share every icon name with Duo, so the same icon follows a visitor from the hero into the product. <a href="${p}styles/index.html">All ${N_STYLES} styles</a>.`],
      ['Can I use them commercially?', `Yes, MIT licensed and free, with no credit required. <a href="${p}license.html">Licence</a>.`],
    ],
    related: ['icons-for-react', 'enterprise-icons', 'bento-icons'],
  })
  S('bento', {
    slug: 'bento-icons', short: 'Free bento grid icons', icon: 'layout-grid',
    title: 'Free bento grid icons: icons in tinted tiles, SVG & PNG · with icons',
    desc: `Free bento grid icons: ${N} icons each sitting in its own soft tinted tile, as SVG or transparent PNG for feature grids, bento layouts, settings screens and landing pages. MIT licensed.`,
    h1: ['Free bento grid', 'icons'], q: 'free bento grid icons',
    answer: () => `The <b>Bento</b> style sets each of the ${N} icons in its own soft tinted tile, like a bento-grid feature card: a ready-made tile that turns every icon into a tidy, colour-coded feature. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'bento', groups: [['Feature grid', pick(['zap', 'shield-check', 'globe', 'chart-line', 'users', 'lock', 'cloud', 'sparkles', 'rocket', 'clock', 'credit-card', 'bell', 'search', 'layers', 'code-xml', 'database', 'smartphone', 'mail', 'calendar', 'heart', 'star', 'gift', 'settings', 'puzzle-piece'], 24)], ['Settings', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="bn-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="bn-where">Feature grids, settings and menus</h2>
  <p>Bento-grid landing pages, “why us” feature rows, settings screens, app menus, pricing tables and marketing sites. The tile is part of the icon, so a grid of them lines up perfectly with no extra CSS.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibP('bento')], ['Colour coding', 'Pick a palette per icon to colour-code a grid, or set the tile colour once in CSS']])}</div>
  ${demo(['zap', 'shield-check', 'globe', 'chart-line', 'users', 'lock', 'cloud', 'sparkles'], 'bento')}
</section>`,
    faq: p => [
      ['What is a bento grid?', 'A layout of rounded cards in different sizes, like the compartments of a bento box. It became a favourite for landing pages and feature overviews, and each card usually leads with an icon.'],
      ...RICH_FAQ(p, 'bento'),
    ],
    related: ['saas-icons', 'app-icons', 'svg-icons'],
  })
  S('suite', {
    slug: 'enterprise-icons', short: 'Free enterprise icons', icon: 'briefcase',
    title: 'Free enterprise icons: office and cloud suite style SVG icons · with icons',
    desc: `Free enterprise and office icons: ${N} polished full-colour icons with calm gradients, like an office or cloud suite, as SVG or PNG for business apps, intranets, admin consoles and docs. MIT.`,
    h1: ['Free enterprise icons,', 'suite colour'], q: 'free enterprise icons',
    answer: () => `The <b>Suite</b> style draws all ${N} icons as polished full-colour icons with calm gradients, like the ones in an office or cloud suite: clear shapes and a consistent colour system teams trust. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'suite', groups: [['Office & cloud', pick(OFFICE, 24)], ['Business', pick(['chart-bar', 'chart-line', 'trending-up', 'target', 'trophy', 'award', 'megaphone', 'wallet', 'coins', 'percent', 'gauge', 'flag'], 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="su-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="su-where">Business apps, intranets and consoles</h2>
  <p>Enterprise software, productivity suites, intranets, cloud and admin consoles, internal tools, help centres and documentation. Familiar and calm, so they work in dense screens as well as on slides.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibP('suite')], ['Brand colours', 'Set your brand colours once in CSS or pick a palette, and every icon and gradient follows']])}</div>
  ${demo(OFFICE, 'suite')}
</section>`,
    faq: p => [
      ['Is this affiliated with Microsoft, Google or another suite?', 'No. Suite names a look, and every icon is drawn from scratch for with icons. Nothing is copied from any product or other icon set.'],
      ...RICH_FAQ(p, 'suite'),
    ],
    related: ['saas-icons', 'icons-for-powerpoint', 'png-icons'],
  })
  S('dock', {
    slug: 'app-icons', short: 'Free app icons', icon: 'app-window',
    title: 'Free app icons: glossy dock-style tiles, SVG & PNG · with icons',
    desc: `Free app icons: ${N} glossy rounded app tiles with light and depth, like the icons in a desktop dock, as SVG or transparent PNG for launchers, product pages and portfolios. MIT licensed.`,
    h1: ['Free app icons,', 'dock tiles'], q: 'free app icons',
    answer: () => `The <b>Dock</b> style turns all ${N} icons into glossy rounded app tiles with light and depth, like the icons in a desktop dock. Click an icon below to download a transparent PNG, copy it or copy the SVG. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['dl', 'png', 'svg'], style: 'dock', px: 1024, groups: [['App favourites', pick(APPS, 24)], ['Tools', pick(SETS.dash, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="dk-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="dk-where">Launchers, showcases and download pages</h2>
  <p>App launchers and home-screen themes, product showcases, download pages, portfolios, pitch decks and mock-ups. The tile, light and depth are built in, so a row of them looks like a real dock.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibP('dock')], ['Sizes', 'Download a PNG at up to 1024 px, or the SVG for any size']])}</div>
  ${demo(APPS, 'dock')}
</section>`,
    faq: p => [
      ['Can I use these as my app’s icon?', `Yes, they’re MIT licensed. Anyone can use the same icons, so customise yours (colours, palette) before you ship it as your app icon. <a href="${p}license.html">Licence</a>.`],
      ['Can I make a custom home screen with them?', 'Yes. Download PNGs and set them as app icons with Shortcuts on iPhone or a launcher on Android.'],
      ...RICH_FAQ(p, 'dock').slice(0, 2),
    ],
    related: ['skeuomorphic-icons', 'bento-icons', 'png-icons'],
  })
  S('liquid', {
    slug: 'liquid-glass-icons', short: 'Free liquid glass icons', icon: 'droplet',
    title: 'Free liquid glass icons: clear refractive SVG & PNG icons · with icons',
    desc: `Free liquid glass icons: ${N} icons in clear liquid glass that bends the light, with bright rims and soft reflections, as SVG or transparent PNG for modern app UIs, dashboards and hero art. MIT.`,
    h1: ['Free liquid glass', 'icons'], q: 'free liquid glass icons',
    answer: () => `The <b>Liquid</b> style makes all ${N} icons from clear liquid glass that bends the light: rims of light, refracted colour and soft reflections, the newest look in interface design. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'liquid', groups: [['App', pick(SETS.ui, 24)], ['Dashboard', pick(SETS.dash, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="lq-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="lq-where">Modern app UIs and hero art</h2>
  <p>Modern OS-style interfaces, product launches, premium apps, dashboards and hero art. Clear glass shows off what is behind it, so it looks best on colour, photos and dark mode.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibT('liquid')], hasStyle('glass') ? ['Liquid or Glass?', `Liquid is clear and refractive; <a href="${p}free/glassmorphism-icons.html">Glass</a> is soft and frosted`] : null].filter(Boolean))}</div>
  ${demo(SETS.ui, 'liquid')}
</section>`,
    faq: p => [
      ['Is this Apple’s Liquid Glass?', 'No. Liquid glass here names a look, and every icon is drawn from scratch for with icons from plain vector shapes and gradients. Nothing is copied from any operating system or other icon set.'],
      ...RICH_FAQ(p, 'liquid'),
    ],
    related: ['glassmorphism-icons', 'chrome-icons', 'app-icons'],
  })
  S('chrome', {
    slug: 'chrome-icons', short: 'Free chrome icons', icon: 'disc',
    title: 'Free chrome icons: Y2K liquid metal SVG & PNG icons · with icons',
    desc: `Free chrome icons: ${N} polished liquid-metal icons with mirror highlights, Y2K and futuristic, as SVG or transparent PNG for music, fashion, events, posters and streetwear. MIT licensed.`,
    h1: ['Free chrome icons,', 'Y2K liquid metal'], q: 'free chrome Y2K icons',
    answer: () => `The <b>Chrome</b> style polishes all ${N} icons into liquid chrome with mirror highlights: mirror-bright metal from banded gradients, Y2K and futuristic, sharp at any size. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['png', 'svg', 'dl'], style: 'chrome', groups: [['Chrome favourites', pick(['star', 'heart', 'music-note', 'headphones', 'disc', 'zap', 'flame', 'crown', 'gem', 'sparkles', 'rocket', 'globe', 'camera', 'smile', 'moon', 'sun', 'skull', 'eye', 'lock', 'key', 'mail', 'phone', 'gamepad', 'trophy'], 24)], ['Social', pick(SETS.social, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="ch-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="ch-where">Music, fashion and posters</h2>
  <p>Music and fashion brands, album and playlist covers, event and club posters, streetwear drops and futuristic launches. Big and shiny: 48 px and up.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibT('chrome')], ['How it’s made', 'Banded gradients for the mirror, plain vector shapes for the rest: no images']])}</div>
  ${demo(['star', 'heart', 'music-note', 'zap', 'crown', 'gem', 'disc', 'flame'], 'chrome')}
</section>`,
    faq: p => RICH_FAQ(p, 'chrome'),
    related: ['liquid-glass-icons', 'retro-icons', 'sticker-icons'],
  })
  S('soft3d', {
    slug: 'soft-3d-icons', short: 'Free soft 3D icons', icon: 'cube',
    title: 'Free soft 3D icons: studio-lit 3D SVG & PNG icons · with icons',
    desc: `Free soft 3D icons: ${N} studio-lit 3D objects with real depth, plus friendly 3D avatars, as SVG or transparent PNG for landing pages, onboarding, app stores and launches. MIT licensed.`,
    h1: ['Free soft 3D', 'icons'], q: 'free 3d icons',
    answer: () => `The <b>Soft 3D</b> style turns all ${N} icons into soft, studio-lit 3D objects with real volume. Physical things (a camera, a gift, a house) sit at a gentle angle; symbols such as arrows and checks stay front-facing so they read at a glance; people become friendly Memoji-like busts. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'soft3d', groups: [['Objects', pick(TECH, 24)], ['Everyday', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="is-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="is-where">Landing pages, onboarding and launches</h2>
  <p>Hero sections, feature cards, onboarding steps, app-store art, avatar pickers and launch posts. Every icon shares one soft studio light, so a set looks like one photo shoot; at 16 to 24 px use Line or Solid for the same icon.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibT('soft3d')], ['Not a render', 'Real vectors with soft gradients: no images or blur filters, so it stays crisp, small and editable']])}</div>
  ${demo(TECH, 'soft3d')}
</section>`,
    faq: p => RICH_FAQ(p, 'soft3d'),
    related: ['3d-icons', 'clay-icons', 'svg-icons'],
  })
  S('brutal', {
    slug: 'neo-brutalism-icons', short: 'Free neo-brutalism icons', icon: 'zap',
    title: 'Free neo-brutalism icons: bold outlines and hard shadows · with icons',
    desc: `Free neo-brutalism icons: ${N} icons with thick black outlines, loud flat colour and a hard offset shadow, as SVG or transparent PNG for startups, portfolios, newsletters and posters. MIT.`,
    h1: ['Free neo-brutalism', 'icons'], q: 'free neo-brutalism icons',
    answer: () => `The <b>Brutal</b> style draws all ${N} icons in neo-brutalism: thick black outlines, loud flat colour and a hard offset shadow, raw and confident shapes that pop off the page. Click an icon below to copy the SVG, copy a PNG or download one. Free, MIT licensed, no credit needed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'brutal', groups: [['Bold favourites', pick(BOLD, 24)], ['Interface', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="br-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="br-where">Startups, portfolios and posters</h2>
  <p>Indie startups, portfolios, newsletters, posters, Gen Z brands and playful product sites. The hard shadow wants a bold layout around it: chunky borders, flat colour and big type.</p>
  ${facts([...BASE_FACTS(p), ['Style family', sibT('brutal')], ['Colour', 'Pick a palette and the fills and the shadow follow; on a website each one is a CSS variable']])}</div>
  ${demo(BOLD, 'brutal')}
</section>`,
    faq: p => [
      ['What is neo-brutalism?', 'A web design trend of thick black borders, loud flat colours, hard drop shadows and visible structure: deliberately raw, but tidy underneath.'],
      ...RICH_FAQ(p, 'brutal'),
    ],
    related: ['sticker-icons', 'retro-icons'],
  })

  /* ───── the holiday styles (run 13, rich): utsav + rangoli (Diwali, Holi), halloween, christmas, lunar, valentine.
     Each lander leads with its festival's own icons (the festival categories), then everyday icons in the same look,
     and offers the sibling holiday styles first in its style row ───── */
  const HOLI = stylesIn('holidays')
  const sibH = s => sibAny(s)
  const festFor = cat => META.icons.filter(i => i.category === cat).map(i => i.name)
  const iconTitles = names => names.map(n => n.replace(/-/g, ' ')).join(', ')
  const FEST_FAQ = (p, s, fest) => [
    ['Are these festival icons free for commercial use?', `Yes. All ${N} icons in the ${styleTitle(s)} style are MIT licensed: use them in ${fest} campaigns, greetings, menus, apps and client work with no credit. <a href="${p}license.html">Licence</a>.`],
    [`Is ${styleTitle(s)} only for ${fest} icons?`, `No. Every one of the ${N} icons comes in ${styleTitle(s)}, so a cart, a bell or a gift matches the festival icons in one seasonal set. Switch the same icons back to Line or Solid when the season is over: the names never change.`],
    ...RICH_FAQ(p, s),
  ]
  const H = (style, o) => S(style, { ...o, picker: { actions: ['png', 'dl', 'svg'], style, lead: HOLI.filter(x => x !== style).slice(0, 3), ...o.picker } })
  const INDIAN = festFor('indian-festivals')
  const DIWALI = ['diya', 'rangoli-pattern', 'sky-lantern', 'sparkler', 'firecracker', 'kalash', 'toran', 'marigold', 'lotus', 'puja-thali', 'mithai-box', 'laddoo', 'jalebi', 'shankh', 'peacock-feather', 'paisley', 'dhak', 'pandal', 'alpana', 'rakhi', 'mehndi-hand', 'kite', 'gift', 'sparkles']
  const HOLI_SET = ['pichkari', 'gulal', 'holi-splash', 'water-balloon', 'thandai', 'dholak', 'marigold', 'lotus', 'rangoli-pattern', 'diya', 'kite', 'peacock-feather', 'paisley', 'mehndi-hand', 'sky-lantern', 'sparkler', 'laddoo', 'jalebi', 'music-note', 'sun', 'flower', 'rainbow', 'palette', 'party-popper']
  const SALE = ['gift', 'shopping-bag', 'shopping-cart', 'tag', 'ticket', 'percent', 'credit-card', 'store', 'truck', 'calendar', 'bell', 'mail', 'heart', 'star', 'sparkles', 'party-popper', 'cake', 'coffee', 'music-note', 'camera', 'home', 'user', 'map-pin', 'clock']
  H('utsav', {
    slug: 'diwali-icons', short: 'Free Diwali icons', icon: 'diya',
    title: 'Free Diwali icons: diya, rangoli and festive SVG & PNG · with icons',
    desc: `Free Diwali icons: diyas, rangoli, lanterns, sweets and ${INDIAN.length} Indian festival icons, plus all ${N} icons in the festive Utsav style, as SVG or transparent PNG. MIT, no credit.`,
    h1: ['Free Diwali icons,', 'warm and festive'], q: 'free diwali icons',
    answer: () => `The <b>Utsav</b> style draws Indian festive craft: warm marigold and saffron shapes with a plum outline, a fine gold inner line, rangoli dot-work and a tiny diya flame. It comes with ${INDIAN.length} festival icons (diya, rangoli, kalash, toran, sky lantern, mithai and more) and turns every one of the ${N} icons festive, so your sale banner, greeting card or app theme matches. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [['Diwali & Durga Puja', pick(DIWALI, 24)], ['Festive offers and greetings', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="dw-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="dw-where">Greetings, festive sales and menus</h2>
  <p>Diwali and Durga Puja greetings, WhatsApp and Instagram posts, festive sale banners, sweet-shop menus, wedding cards and app themes for the season. For Holi and Navratri campaigns try <a href="holi-icons.html">Rangoli</a>, the sibling style with one festival motif per icon.</p>
  ${facts([...BASE_FACTS(p), ['Festival icons', `${INDIAN.length} Indian festival icons: ${iconTitles(pick(DIWALI, 8))} and more`], ['Style family', sibH('utsav')]])}</div>
  ${demo(['diya', 'rangoli-pattern', 'sky-lantern', 'kalash', 'marigold', 'mithai-box'], 'utsav')}
</section>`,
    faq: p => FEST_FAQ(p, 'utsav', 'Diwali'),
    related: ['holi-icons', 'christmas-icons', 'lunar-new-year-icons'],
  })
  H('rangoli', {
    slug: 'holi-icons', short: 'Free Holi icons', icon: 'pichkari',
    title: 'Free Holi icons: colourful festival SVG & PNG icons · with icons',
    desc: `Free Holi icons: pichkari, gulal, colour splashes and ${INDIAN.length} Indian festival icons, plus all ${N} icons in the festive Rangoli style, as SVG or transparent PNG. MIT, no credit.`,
    h1: ['Free Holi icons,', 'full of colour'], q: 'free holi icons',
    answer: () => `The <b>Rangoli</b> style draws clean objects in a warm festive glow, each with one Indian festival motif: rangoli petals, a lotus, a toran, a marigold or a diya flame. Its festival icons include the pichkari, gulal, a colour splash, water balloons, thandai and the dholak, and every one of the ${N} icons comes in the same look. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [['Holi & Navratri', pick(HOLI_SET, 24)], ['Festive offers and greetings', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="ho-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="ho-where">Holi posts, invites and festive campaigns</h2>
  <p>Holi party invites, Navratri and Durga Puja campaigns, festive sale banners, school and office celebration posters, and app themes. For Diwali greetings with diyas and gold line-work, try <a href="diwali-icons.html">Utsav</a>, the sibling style.</p>
  ${facts([...BASE_FACTS(p), ['Festival icons', `${INDIAN.length} Indian festival icons: ${iconTitles(pick(['pichkari', 'gulal', 'holi-splash', 'water-balloon', 'thandai', 'dholak', 'marigold', 'lotus'], 8))} and more`], ['Style family', sibH('rangoli')]])}</div>
  ${demo(['pichkari', 'gulal', 'holi-splash', 'water-balloon', 'dholak', 'marigold'], 'rangoli')}
</section>`,
    faq: p => FEST_FAQ(p, 'rangoli', 'Holi'),
    related: ['diwali-icons', 'valentines-day-icons', 'cute-icons'],
  })
  const HW = festFor('halloween')
  H('halloween', {
    slug: 'halloween-icons', short: 'Free Halloween icons', icon: 'jack-o-lantern',
    title: 'Free Halloween icons: spooky-cute SVG & PNG icons · with icons',
    desc: `Free Halloween icons: jack-o’-lanterns, ghosts, bats, witch hats and ${HW.length} Halloween icons, plus all ${N} icons in a spooky-cute style, as SVG or transparent PNG. MIT.`,
    h1: ['Free Halloween icons,', 'spooky but cute'], q: 'free halloween icons',
    answer: () => `The <b>Halloween</b> style is spooky-cute: pumpkin, witch-purple and midnight shapes with candle-lit carvings, slime drips and a tiny bat. It comes with ${HW.length} Halloween icons (a jack-o’-lantern, a ghost, a cauldron, a haunted house and more) and dresses up every one of the ${N} icons, so a cart or a bell joins the party. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [['Halloween', pick(['jack-o-lantern', 'ghost', 'bat', 'witch-hat', 'black-cat', 'cauldron', 'haunted-house', ...HW, 'moon', 'flame', 'candy', 'lollipop', 'key', 'lock', 'skull', 'ghost'], 24)], ['Party and promos', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="hw-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="hw-where">Party invites, promos and game events</h2>
  <p>Halloween party invites, trick-or-treat flyers, October sale banners, in-game events, classroom worksheets and app themes. Spooky-cute rather than scary, so it suits kids’ brands as well as late-night campaigns.</p>
  ${facts([...BASE_FACTS(p), ['Halloween icons', `${HW.length} of them: ${iconTitles(pick(HW, 8))} and more`], ['Style family', sibH('halloween')]])}</div>
  ${demo(['jack-o-lantern', 'ghost', 'bat', 'witch-hat', 'cauldron', 'haunted-house'], 'halloween')}
</section>`,
    faq: p => FEST_FAQ(p, 'halloween', 'Halloween'),
    related: ['gothic-icons', 'christmas-icons', 'cute-icons'],
  })
  const XM = festFor('christmas')
  H('christmas', {
    slug: 'christmas-icons', short: 'Free Christmas icons', icon: 'christmas-tree',
    title: 'Free Christmas icons: cosy holiday SVG & PNG icons · with icons',
    desc: `Free Christmas icons: trees, Santa hats, snowmen, wreaths and ${XM.length} Christmas icons, plus all ${N} icons in a cosy snow-capped style, as SVG or transparent PNG. MIT.`,
    h1: ['Free Christmas icons,', 'cosy and snowy'], q: 'free christmas icons',
    answer: () => `The <b>Christmas</b> style is cosy: cranberry, pine and gold shapes with a snow cap on every top edge, candy-cane stripes and a sprig of holly. It comes with ${XM.length} Christmas icons (a tree, a Santa hat, a snowman, a wreath, a sleigh and more) and wraps every one of the ${N} icons for the season, so your gift guide and checkout match. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [['Christmas', pick(['christmas-tree', 'santa-hat', 'snowman', 'wreath', 'gingerbread-man', 'bauble', ...XM, 'gift', 'snowflake', 'star', 'bell'], 24)], ['Gift guides and offers', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="xm-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="xm-where">Holiday emails, gift guides and advent calendars</h2>
  <p>Christmas campaigns and holiday emails, gift guides, advent calendars, festive menus, office party invites and seasonal app themes. Each icon wears its own snow cap, so a whole row reads as one winter set.</p>
  ${facts([...BASE_FACTS(p), ['Christmas icons', `${XM.length} of them: ${iconTitles(pick(XM, 8))} and more`], ['Style family', sibH('christmas')]])}</div>
  ${demo(['christmas-tree', 'santa-hat', 'snowman', 'wreath', 'gingerbread-man', 'bauble'], 'christmas')}
</section>`,
    faq: p => FEST_FAQ(p, 'christmas', 'Christmas'),
    related: ['halloween-icons', 'lunar-new-year-icons', 'valentines-day-icons'],
  })
  const LN = festFor('lunar-new-year')
  H('lunar', {
    slug: 'lunar-new-year-icons', short: 'Free Lunar New Year icons', icon: 'red-lantern',
    title: 'Free Lunar New Year icons: lucky red and gold SVG & PNG · with icons',
    desc: `Free Lunar New Year and Chinese New Year icons: lanterns, red envelopes, dragons and ${LN.length} festival icons, plus all ${N} icons in lucky red and gold, as SVG or PNG. MIT.`,
    h1: ['Free Lunar New Year icons,', 'red and gold'], q: 'free lunar new year icons',
    answer: () => `The <b>Lunar</b> style is lucky red lacquer with a gold-foil rim, jade details, paper-cut cloud scrolls, silk tassels and plum blossoms. It comes with ${LN.length} Lunar New Year icons (a red lantern, a red envelope, a dragon and a lion head, dumplings, lucky coins and more) and dresses every one of the ${N} icons in the same red and gold. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [['Lunar New Year', pick(['red-lantern', 'red-envelope', 'dragon-head', 'lion-head', 'mandarin-orange', 'plum-blossom', ...LN, 'gift', 'coins', 'sparkles', 'moon'], 24)], ['Red-envelope promos', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="ln-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="ln-where">Greetings, red-envelope promos and app themes</h2>
  <p>Lunar New Year and Chinese New Year greetings, red-envelope promotions, restaurant menus, festive sale banners and seasonal app themes, from Seoul to Singapore to San Francisco.</p>
  ${facts([...BASE_FACTS(p), ['Festival icons', `${LN.length} of them: ${iconTitles(pick(LN, 8))} and more`], ['Style family', sibH('lunar')]])}</div>
  ${demo(['red-lantern', 'red-envelope', 'dragon-head', 'lion-head', 'mandarin-orange', 'plum-blossom'], 'lunar')}
</section>`,
    faq: p => FEST_FAQ(p, 'lunar', 'Lunar New Year'),
    related: ['christmas-icons', 'diwali-icons', 'valentines-day-icons'],
  })
  const VL = festFor('valentines')
  H('valentine', {
    slug: 'valentines-day-icons', short: 'Free Valentine’s Day icons', icon: 'heart-pair',
    title: 'Free Valentine’s Day icons: cute heart SVG & PNG icons · with icons',
    desc: `Free Valentine’s Day icons: love letters, roses, chocolates and ${VL.length} Valentine’s icons, plus all ${N} icons as cute pink-to-red stickers, as SVG or transparent PNG. MIT.`,
    h1: ['Free Valentine’s Day icons,', 'cute and sweet'], q: 'free valentines day icons',
    answer: () => `The <b>Valentine</b> style draws cute Valentine’s stickers: pink-to-red cartoon shapes with a berry outline, polka dots, tiny blushing faces and floating hearts. It comes with ${VL.length} Valentine’s icons (a love letter, a rose bouquet, a box of chocolates, a teddy bear and more) and sweetens every one of the ${N} icons, so a gift card or a checkout button fits the theme. Click an icon below to copy a transparent PNG, download it or copy the SVG. Free and MIT licensed.`,
    picker: { groups: [["Valentine’s Day", pick(['heart-pair', 'love-letter', 'rose-bouquet', 'chocolate-box', 'teddy-bear', 'heart-balloon', ...VL, 'heart', 'gift', 'cake', 'sparkles', 'music-note'], 24)], ['Gifts and offers', pick(SALE, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="vl-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="vl-where">Cards, gift shops and social posts</h2>
  <p>Valentine’s and Galentine’s campaigns, e-cards, gift-shop banners, dating apps, café and bakery menus and social posts. The blushing faces and floating hearts look best from 32 px up; for small buttons use Line or Duo with a pink accent.</p>
  ${facts([...BASE_FACTS(p), ["Valentine’s icons", `${VL.length} of them: ${iconTitles(pick(VL, 8))} and more`], ['Style family', sibH('valentine')]])}</div>
  ${demo(['heart-pair', 'love-letter', 'rose-bouquet', 'chocolate-box', 'teddy-bear', 'heart-balloon'], 'valentine')}
</section>`,
    faq: p => FEST_FAQ(p, 'valentine', 'Valentine’s'),
    related: ['coquette-icons', 'cute-icons', 'christmas-icons'],
  })
  return out
}
