// "Free … icons" landers for the playful styles (glass, kawaii, sticker, pixel, retro) and for animated icons.
// A style lander only exists once its renderer does (hasStyle); curated icon lists keep only icons that exist,
// so names from the 200-icon expansion appear automatically as they land.
import { I, esc, cvar, code, STYLES } from './render.mjs'
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
  const demo = (names, style, cls = 'ax-play-demo') => `<div class="${cls}" aria-hidden="true">${pick(names, 6).map((n, i) => `<span style="--i:${i}">${I(n, style, 56)}</span>`).join('')}</div>`

  /* ───── animated icons ───── */
  if (Object.keys(MOTION).length) {
    const showcase = ['ring', 'beat', 'spin', 'twinkle', 'float', 'bounce', 'nudge', 'tada'].map(k => ({ k, ...demoFor(k) })).filter(x => x.name)
    const tryStyles = ['line', 'solid', 'duo', 'kawaii', 'sticker', 'glass', 'gloss', 'retro'].map(s => hasStyle(s) ? s : 'line')
    out.push({
      slug: 'animated-icons', short: 'Free animated icons', icon: 'sparkles', color: 'duo', style: 'line', motion: true,
      title: 'Free animated icons: animated SVG, CSS and React, MIT · with icons',
      desc: `Free animated icons: ${N} icons that ring, beat, spin and float, in ${N_STYLES} styles. Download animated SVGs with no code, or add two CSS classes. ${PRESETS.length} motions, reduced-motion safe, MIT.`,
      h1: ['Free', 'animated icons'], q: 'free animated icons, no code needed',
      answer: () => `Every one of the ${N} icons comes with <b>its own animation</b> (a bell rings, a heart beats, a loader spins) and works with ${PRESETS.length} motion presets in all ${N_STYLES} styles. Hover an icon below to watch it move, then click it to download a <b>GIF for your slides</b> (PowerPoint, Google Slides, Keynote) or an <b>animated SVG</b> for websites and Notion. No code, no account. Developers add two CSS classes from <code>@withicons/motion</code>. Free and MIT licensed.`,
      picker: { actions: ['gif', 'anim', 'svg'], px: 256, groups: [['They move on hover', pick(SETS.motion, 24)]] },
      body: p => `
<section class="ax-split" aria-labelledby="an-show">
  <div><p class="ax-kicker">See them move</p><h2 id="an-show">Motion that says what the icon means</h2>
  <p>Animations here aren’t decoration: each icon moves the way the thing it shows would move. Bells ring from their hook, arrows nudge the way they point, hearts beat. They are plain CSS inside the SVG: no Lottie player, no JavaScript, tiny files. And they stop for anyone who has asked their device for less motion.</p>
  ${facts([...BASE_FACTS(p), ['Motions', `${PRESETS.length} presets (spin, ring, beat, float, twinkle…) plus ${EFFECTS.length} swap transitions that turn one icon into another, like play into pause`], ['Formats', 'GIF for slides and animated SVG (no code), CSS classes, React, Vue, Svelte, Angular and a <code>&lt;with-icon motion&gt;</code> element'], ['Accessibility', 'Respects <code>prefers-reduced-motion</code>, in downloads and in code']])}</div>
  <div class="ax-motion-wall" aria-hidden="true" data-motion-area>${showcase.map((x, i) => `<span class="s-${tryStyles[i]}" style="--g:${cvar(tryStyles[i])};--i:${i}">${wm(x.name, tryStyles[i], 48, x.m)}<small>${x.k}</small></span>`).join('')}</div>
</section>
<section aria-labelledby="an-use"><div class="ax-sec-head"><p class="ax-kicker">Use them</p><h2 id="an-use">Three ways to add an animated icon</h2></div>
  ${steps([
    ['No code: a GIF or an animated SVG', `Click an icon above with <b>GIF for slides</b> selected and insert the GIF in PowerPoint, Google Slides or Keynote. Choose <b>Animated SVG</b> for Webflow, Framer, Wix, Squarespace or Notion. Want to tune the speed or pick another motion first? Open the icon and use Customize › Motion, which has the same two downloads. <a href="${p}guides/animate-icons.html">Step-by-step guide</a>.`],
    ['A website: two CSS classes', 'Add <code>motion.css</code> once, then wrap an icon: <code>&lt;span class="wm wm-loop wm-p-ring"&gt;</code>. Use <code>wm-hover</code> to play on hover, inside any button with <code>wm-trigger</code>.'],
    ['An app: any framework', `The same classes work in React, Vue, Svelte and Angular, and a small JS API starts, stops and swaps icons from code. <a href="${p}developers.html#motion">Animation docs</a>.`],
  ])}
  ${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">

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
  <div class="ax-glass-demo" aria-hidden="true">${pick(SETS.dash, 6).map((n, i) => `<span style="--i:${i}">${I(n, 'glass', 56)}</span>`).join('')}</div>
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
  return out
}
