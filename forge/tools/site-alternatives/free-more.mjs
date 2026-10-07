// "Free … icons" landers for the playful styles (glass, kawaii, sticker, pixel, retro), the studio styles (luxe as
// "3D icons", bauhaus, skeuo), the storybook styles (anime, gothic, pastel, coquette, plush "for kids") and for animated icons.
// A style lander only exists once its renderer does (hasStyle); curated icon lists keep only icons that exist,
// so names from the 200-icon expansion appear automatically as they land.
import { I, esc, cvar, code, STYLES, iconLink } from './render.mjs'
import { hasStyle, MOTION, PRESETS, EFFECTS, ICON_NAMES, styleTitle, stylesIn, listTitles, N_STYLES, word } from '../site-pages/lib.mjs'
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
    title: 'Free glassmorphism icons: frosted glass SVG icons · with icons',
    desc: `Free glassmorphism icons: ${N} multi-layered frosted glass icons as SVG or transparent PNG, for modern apps, dashboards and landing pages. Real vectors, no blur filters, MIT.`,
    h1: ['Free glassmorphism', 'icons'], q: 'free glassmorphism icons',
    answer: () => `The <b>Glass</b> style builds all ${N} icons from stacked panes of frosted glass, soft and see-through, in the glassmorphism look. Click an icon below to copy the SVG or a transparent PNG. The frost is made from layered shapes, not blur filters, so the files stay small and render the same everywhere. Free and MIT licensed.`,
    picker: { actions: ['svg', 'png', 'dl'], style: 'glass', groups: [['Dashboard', pick(SETS.dash, 24)], ['App', pick(SETS.ui, 12)]] },
    body: p => `
<section class="ax-split" aria-labelledby="gl-where">
  <div><p class="ax-kicker">Where they shine</p><h2 id="gl-where">Best on colour</h2>
  <p>Glass icons glow on gradients, photos and dark UIs: app landing pages, fintech and weather dashboards, iOS-style feature grids, pitch-deck hero slides. On a plain white page, try a soft tinted card behind them.</p>
  ${facts([...BASE_FACTS(p), ['How it’s made', 'Layered shapes with partial opacity. No filters, masks or gradients, so it renders the same in every browser, Figma and PowerPoint'], ['Style family', sib('glass')]])}</div>
  <div class="ax-glass-demo">${pick(SETS.dash, 6).map((n, i) => iconLink(p, n, 'glass', I(n, 'glass', 56), ` style="--i:${i}"`)).join('')}</div>
</section>`,
    faq: p => [
      ['Are these real glassmorphism icons or just transparent?', 'They are drawn as several stacked, partly see-through panes with highlights, the layered look glassmorphism is known for, built from plain vector shapes.'],
      ['Do they work in Figma?', `Yes. Copy the SVG and paste it onto the canvas: each pane arrives as an editable vector layer. <a href="${p}guides/figma.html">Figma guide</a>.`],
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
  return out
}
