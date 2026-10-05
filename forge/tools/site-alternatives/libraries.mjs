// Facts about other icon libraries, for the alternatives pages.
// RULES: every fact comes from the library's own website, GitHub repo, npm registry or pricing/licence page, checked on
// CHECKED (render.mjs). Numbers are hedged ("about", "over") exactly as the source states them. Each fact cites one or
// more entries of that library's `sources` (1-based). Icon names in `map` were checked against the library's published
// icon data (CSS, manifest or API) on the same date. Re-check before changing anything here.
//
// Shape: { slug, name, kind, color, mark, url, known, hub: {...short matrix values}, facts: { key: [html, [src]] },
//          sources: [[label, url]], them: [...], us: [...], migrate: {...}, faq: [[q, a]] }

import { N_ICONS as N, N_STYLES as NS, N_TOTAL, num, listTitles, STYLES, PRESETS, EFFECTS, styleTitle } from '../site-pages/lib.mjs'
/** "about three times our 500" — a hedged ratio for the "choose them if" lists. */
export const timesOurs = n => { const r = n / N; return r >= 1.75 ? `about ${['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][Math.round(r)] || Math.round(r)} times our ${N}` : `more than our ${N}` }

export const FACT_ROWS = [
  ['license', 'Licence'], ['price', 'Price'], ['count', 'Icons'], ['styles', 'Styles'], ['frameworks', 'Frameworks'],
  ['classes', 'CSS classes / icon font'], ['selfhost', 'Self-hosting'], ['design', 'Design tools'], ['ai', 'AI / MCP'], ['attribution', 'Credit required?'],
]

/** with icons itself — the right-hand column of every comparison. */
export const US = p => ({
  license: 'MIT, for the icons and the code',
  price: 'Free. No paid tier, no account',
  count: `${N} icons × ${NS} styles (${num(N_TOTAL)} SVGs)`,
  styles: `${NS} styles on one 24 × 24 grid: <a href="${p}styles/line.html">Line</a>, ${listTitles(STYLES.slice(1))}. Every icon can also move: ${PRESETS.length} CSS animations and ${EFFECTS.length} swap transitions (<a href="${p}developers.html#motion">@withicons/motion</a>)`,
  frameworks: 'React, Vue, Svelte, Angular, Solid and a <code>&lt;with-icon&gt;</code> web component (on npm soon); SVG, PNG and sprites today',
  classes: 'Yes: <code>&lt;i class="with with-home"&gt;&lt;/i&gt;</code>, add <code>with-solid</code> etc. for other styles',
  selfhost: `Yes: download SVGs, sprites and CSS (<a href="${p}developers.html#cdn">developers</a>)`,
  design: `Copy SVG and paste into Figma, Canva, PowerPoint (<a href="${p}guides/index.html">guides</a>)`,
  ai: `<a href="${p}llms.txt">llms.txt</a> and an <a href="${p}ai.html#skill">agent skill</a> today; an MCP server (<code>@withicons/mcp</code>) arrives with the npm launch`,
  attribution: 'No',
})
export const US_HUB = { license: 'MIT', price: 'Free', count: `${N} × ${NS} styles`, styles: `${NS} (line to ${styleTitle(STYLES.at(-1)).toLowerCase()}) + animations`, classes: 'Yes (with-*)', ai: 'llms.txt, skill; MCP soon' }

import { OPEN_LIBS } from './libraries-open.mjs'

export const LIBS = [...OPEN_LIBS,
  /* ───────────────────────── Ionicons ───────────────────────── */
  {
    slug: 'ionicons', name: 'Ionicons', kind: 'open', color: 'blueprint', mark: 'Io', url: 'https://ionic.io/ionicons', searchQ: 'notifications',
    known: 'the Ionic team’s open-source app icons: about 1,300 icons in filled, outline and sharp variants, shipped as the <code>&lt;ion-icon&gt;</code> web component.',
    hub: { license: 'MIT', price: 'Free', count: 'about 1,300', styles: '3 (filled, outline, sharp)', classes: 'No (web component)', ai: 'None official found' },
    facts: {
      license: ['MIT', [1, 4]],
      price: ['Free, no paid tier found', [2]],
      count: ['About 1,300 (“1,300 icons” in the README; the npm manifest lists 1,357 names including variants)', [1, 5]],
      styles: ['Filled (default), Outline (<code>-outline</code>) and Sharp (<code>-sharp</code>); 512 × 512 viewBox', [3, 6]],
      frameworks: ['One web component, <code>&lt;ion-icon&gt;</code>, that works in any framework; included with Ionic Framework (Angular, React, Vue)', [1]],
      classes: ['No icon font: <code>&lt;ion-icon name="home-outline"&gt;&lt;/ion-icon&gt;</code>', [3]],
      selfhost: ['Yes: install from npm and serve the SVGs yourself', [1]],
      design: ['Downloadable designer pack; no official Figma plugin found', [2]],
      ai: ['No official MCP server or llms.txt found', []],
      attribution: ['No (standard MIT notice when redistributing the code)', [1]],
    },
    sources: [
      ['Ionicons README (GitHub)', 'https://github.com/ionic-team/ionicons/blob/main/readme.md'],
      ['Ionicons website', 'https://ionic.io/ionicons'],
      ['Ionicons usage docs', 'https://ionic.io/ionicons/usage'],
      ['npm: ionicons', 'https://www.npmjs.com/package/ionicons'],
      ['ionicons.json manifest (v8.1.0)', 'https://unpkg.com/ionicons@8.1.0/dist/ionicons.json'],
      ['Example SVG (viewBox)', 'https://unpkg.com/ionicons@8.1.0/dist/svg/home-outline.svg'],
    ],
    them: [
      'You build with Ionic Framework: Ionicons is already there and matches the platform look.',
      'You want iOS- and Material-flavoured app icons with filled, outline and sharp variants.',
      `You want about 1,300 icons, ${timesOurs(1300)}, including many brand logos.`,
    ],
    us: [
      'You want the same icon set to work in slides, docs and design tools, not just in code.',
      'You want plain <code>&lt;i&gt;</code> tag classes or inline SVG with no JavaScript runtime.',
      'You want expressive styles too: Gloss, Engrave, Blueprint and Sketch alongside Line, Solid and Duo.',
    ],
    migrate: {
      mode: 'webcomponent',
      intro: 'Ionicons names describe the variant with a suffix (<code>-outline</code>, <code>-sharp</code>); with icons uses one name and a <code>variant</code>. Our web component mirrors the Ionicons pattern, so most swaps are one attribute.',
      map: [['home-outline', 'home'], ['search-outline', 'search'], ['trash-outline', 'trash'], ['settings-outline', 'settings'], ['person-outline', 'user'], ['mail-outline', 'mail'], ['close-outline', 'close'], ['checkmark-outline', 'check'], ['add-outline', 'plus'], ['menu-outline', 'menu'], ['create-outline', 'edit'], ['pencil-outline', 'pencil'], ['download-outline', 'download'], ['cloud-upload-outline', 'cloud-upload'], ['heart-outline', 'heart'], ['star-outline', 'star'], ['notifications-outline', 'bell'], ['calendar-outline', 'calendar'], ['lock-closed-outline', 'lock'], ['arrow-forward-outline', 'arrow-right'], ['chevron-down-outline', 'chevron-down'], ['share-outline', 'share'], ['copy-outline', 'copy'], ['open-outline', 'external-link'], ['eye-outline', 'eye'], ['filter-outline', 'filter'], ['information-circle-outline', 'info-circle'], ['warning-outline', 'alert-triangle'], ['cart-outline', 'shopping-cart'], ['image-outline', 'image'], ['call-outline', 'phone']],
      before: ['html', '<script type="module" src="https://esm.sh/ionicons@latest/loader"></script>\n\n<ion-icon name="home-outline"></ion-icon>\n<ion-icon name="heart"></ion-icon>\n<ion-icon name="notifications-outline"></ion-icon>'],
      after: ['html', '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/cdn.js"></script>\n\n<with-icon name="home"></with-icon>\n<with-icon name="heart" variant="solid"></with-icon>\n<with-icon name="bell"></with-icon>'],
      sample: '<ion-icon name="home-outline"></ion-icon>\n<ion-icon name="heart"></ion-icon>\n<ion-icon name="notifications-outline"></ion-icon>\n<ion-icon name="cart-outline"></ion-icon>',
      styleNote: 'Ionicons <b>outline</b> → our <b>Line</b>; Ionicons <b>filled</b> → our <b>Solid</b>. Sharp has no direct twin; Line or Solid are closest.',
    },
    faq: [
      ['Does with icons work like the ion-icon web component?', `Yes. <code>&lt;with-icon name="home"&gt;&lt;/with-icon&gt;</code> works in any framework, and <code>variant="solid"</code> (or any of the ${NS} styles) replaces the Ionicons name suffix. The package is launching on npm soon.`],
    ],
  },

  /* ───────────────────────── Remix Icon ───────────────────────── */
  {
    slug: 'remix-icon', name: 'Remix Icon', kind: 'open', color: 'solid', mark: 'Ri', url: 'https://remixicon.com', searchQ: 'delete bin',
    known: 'a large, very consistent set of over 3,200 neutral system icons in matching line and fill pairs on a 24 × 24 grid.',
    hub: { license: 'Remix Icon License v1.0', price: 'Free', count: 'over 3,200', styles: '2 (line, fill)', classes: 'Yes (ri-*)', ai: 'Official MCP server' },
    facts: {
      license: ['Remix Icon License v1.0 since version 4.9.0 (January 2026); versions up to 4.8.0 were Apache-2.0. Free for commercial use; it does not allow selling the icons on their own, building a competing icon library, or use in logos and trademarks', [1, 3, 4]],
      price: ['Free; no paid tier found', [2]],
      count: ['Over 3,200 (“3200+ icons”)', [2]],
      styles: ['Line and Fill, on a 24 × 24 grid', [2]],
      frameworks: ['React (<code>@remixicon/react</code>), Vue 3 (<code>@remixicon/vue</code>), icon font, SVG sprite', [2]],
      classes: ['Yes: <code>&lt;i class="ri-home-line"&gt;&lt;/i&gt;</code>', [2]],
      selfhost: ['Yes: npm, or download the font, sprite or SVGs', [2]],
      design: ['Official Figma plugin', [2]],
      ai: ['Official MCP server (RemixIcon-MCP) that maps keywords to icon names', [5]],
      attribution: ['Not required (“appreciated but not required”)', [1]],
    },
    sources: [
      ['Remix Icon License v1.0 (GitHub)', 'https://github.com/Remix-Design/RemixIcon/blob/master/License'],
      ['Remix Icon README (GitHub)', 'https://github.com/Remix-Design/RemixIcon/blob/master/README.md'],
      ['remixicon 4.9.0 package licence file', 'https://unpkg.com/remixicon@4.9.0/License'],
      ['remixicon 4.8.0 package licence file (Apache-2.0)', 'https://unpkg.com/remixicon@4.8.0/License'],
      ['RemixIcon-MCP (GitHub)', 'https://github.com/Remix-Design/RemixIcon-MCP'],
      ['Remix Icon CSS used to check names (4.9.1)', 'https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css'],
    ],
    them: [
      'You need breadth: over 3,200 icons in perfectly matched line and fill pairs.',
      'You want an official Figma plugin and an official MCP server for AI tools.',
      'Your use fits the Remix Icon License (most app and website use does).',
    ],
    us: [
      'You prefer a plain MIT licence with no extra restrictions, including on logos.',
      'You want more than two looks: Duo, Gloss, Engrave, Blueprint and Sketch share the same names and grid.',
      'You also make slides and docs: copy as PNG or SVG straight from the site.',
    ],
    migrate: {
      mode: 'class',
      intro: 'Both use one stylesheet and an <code>&lt;i&gt;</code> tag. Remix puts the style in the name (<code>-line</code>, <code>-fill</code>); with icons keeps the name and adds a style class.',
      map: [['ri-home-line', 'home'], ['ri-search-line', 'search'], ['ri-delete-bin-line', 'trash'], ['ri-settings-3-line', 'settings'], ['ri-user-line', 'user'], ['ri-mail-line', 'mail'], ['ri-close-line', 'close'], ['ri-check-line', 'check'], ['ri-add-line', 'plus'], ['ri-menu-line', 'menu'], ['ri-edit-line', 'edit'], ['ri-pencil-line', 'pencil'], ['ri-download-line', 'download'], ['ri-upload-line', 'upload'], ['ri-heart-line', 'heart'], ['ri-star-line', 'star'], ['ri-notification-line', 'bell'], ['ri-calendar-line', 'calendar'], ['ri-lock-line', 'lock'], ['ri-arrow-right-line', 'arrow-right'], ['ri-arrow-down-s-line', 'chevron-down'], ['ri-share-line', 'share'], ['ri-file-copy-line', 'copy'], ['ri-external-link-line', 'external-link'], ['ri-eye-line', 'eye'], ['ri-filter-line', 'filter'], ['ri-information-line', 'info-circle'], ['ri-alert-line', 'alert-triangle'], ['ri-shopping-cart-line', 'shopping-cart'], ['ri-image-line', 'image'], ['ri-phone-line', 'phone']],
      prefixes: ['ri-'], suffixes: [['-line', 'line'], ['-fill', 'solid']],
      tokens: { 'ri-fw': 'with-fw', 'ri-xs': 'with-xs', 'ri-sm': 'with-sm', 'ri-lg': 'with-lg', 'ri-xl': 'with-lg', 'ri-2x': 'with-2x', 'ri-3x': 'with-3x', 'ri-4x': 'with-4x', 'ri-5x': 'with-5x' },
      before: ['html', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css">\n\n<i class="ri-home-line"></i>\n<i class="ri-heart-fill"></i>\n<i class="ri-delete-bin-line ri-2x"></i>'],
      after: ['html', '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer></script>\n\n<i class="with with-home"></i>\n<i class="with with-heart with-solid"></i>\n<i class="with with-trash with-2x"></i>'],
      sample: '<i class="ri-home-line"></i>\n<i class="ri-heart-fill"></i>\n<i class="ri-delete-bin-line ri-2x"></i>\n<button><i class="ri-settings-3-line"></i> Settings</button>',
      styleNote: 'Remix <b>-line</b> → our <b>Line</b> (no style class); <b>-fill</b> → <b>with-solid</b>.',
    },
    faq: [
      ['Did Remix Icon change its licence?', 'Yes. Starting with version 4.9.0 (January 2026) Remix Icon ships under its own Remix Icon License v1.0; earlier versions were Apache-2.0. It stays free for commercial use but adds restrictions, for example on logos and trademarks and on creating a competing icon library. with icons is MIT, so those restrictions don’t apply to our icons.'],
    ],
  },

  /* ───────────────────────── Boxicons ───────────────────────── */
  {
    slug: 'boxicons', name: 'Boxicons', kind: 'open', color: 'duo', mark: 'Bx', url: 'https://boxicons.com', searchQ: 'cog',
    known: 'a friendly web icon set with simple class names; version 3 adds React, Vue and Svelte packages and a large Pro catalogue of extra styles and weights.',
    hub: { license: 'CC BY 4.0 (free icons)', price: 'Free; Pro from $39/yr', count: 'over 3,500 free', styles: 'Basic + Filled free; more in Pro', classes: 'Yes (bx-*)', ai: 'None official found' },
    facts: {
      license: ['Free icons CC BY 4.0, fonts SIL OFL 1.1, code MIT; Pro and Brands have their own licences', [3]],
      price: ['Free plan; Pro $39/year, Team $99/year, Enterprise $249/year (as listed)', [2]],
      count: ['Over 3,500 free (“3500+”); “50k+” across all packs including Pro', [2, 1]],
      styles: ['Free: Basic, Filled and Brands. Pro adds Rounded and Sharp styles, Thin/Bold weights and Duotone packs', [4]],
      frameworks: ['React, Vue, Svelte and vanilla JS packages (<code>@boxicons/*</code>), icon font, CLI', [4, 6]],
      classes: ['Yes: <code>&lt;i class="bx bx-home"&gt;&lt;/i&gt;</code>; filled <code>bxf</code>', [5]],
      selfhost: ['Yes: <code>@boxicons/core</code> ships the SVGs and fonts', [6]],
      design: ['Official Figma plugin (free, with Pro features); Framer plugin', [1]],
      ai: ['No official MCP server or llms.txt found', []],
      attribution: ['Required by the free licences, but already included in the files; no action needed (per the docs)', [3]],
    },
    sources: [
      ['Boxicons website', 'https://boxicons.com'],
      ['Boxicons pricing', 'https://boxicons.com/pricing'],
      ['Boxicons free licence', 'https://docs.boxicons.com/license/free'],
      ['Boxicons docs: introduction (v3.0.8)', 'https://docs.boxicons.com/introduction'],
      ['Boxicons docs: font usage', 'https://docs.boxicons.com/font/usage'],
      ['@boxicons/core on unpkg', 'https://unpkg.com/@boxicons/core@1.0.6/'],
      ['Boxicons v3 basic CSS used to check names', 'https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css'],
      ['Boxicons v2 CSS used to check legacy names', 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'],
    ],
    them: [
      'You want thousands of free icons with the same simple class-name pattern you already know.',
      'You want extra weights, rounded and sharp styles and duotones, and are happy to pay for Pro.',
      'You want an official Figma plugin and brand logos.',
    ],
    us: [
      'You want everything free under one licence (MIT), with no Pro tier to keep track of.',
      'You want characterful styles like Gloss, Engrave, Blueprint and Sketch for marketing pages and slides.',
      'You want AI tools to pick icons for you: llms.txt, an agent skill and an MCP server.',
    ],
    migrate: {
      mode: 'class',
      intro: 'Boxicons and with icons both use a base class plus a name class. Swap <code>bx bx-</code> for <code>with with-</code>, then fix the names that differ (Boxicons calls settings <code>cog</code> and mail <code>envelope</code>). Names marked v2 come from Boxicons 2.',
      map: [['bx-home', 'home'], ['bx-search', 'search'], ['bx-trash', 'trash'], ['bx-cog', 'settings'], ['bx-user', 'user'], ['bx-envelope', 'mail'], ['bx-x', 'close'], ['bx-check', 'check'], ['bx-plus', 'plus'], ['bx-menu', 'menu'], ['bx-edit', 'edit'], ['bx-pencil', 'pencil'], ['bx-download (v2)', 'download'], ['bx-upload (v2)', 'upload'], ['bx-heart', 'heart'], ['bx-star', 'star'], ['bx-bell', 'bell'], ['bx-calendar', 'calendar'], ['bx-lock', 'lock'], ['bx-right-arrow-alt (v2)', 'arrow-right'], ['bx-chevron-down', 'chevron-down'], ['bx-share', 'share'], ['bx-copy', 'copy'], ['bx-link-external (v2)', 'external-link'], ['bx-show (v2)', 'eye'], ['bx-filter', 'filter'], ['bx-info-circle', 'info-circle'], ['bx-error (v2)', 'alert-triangle'], ['bx-cart', 'shopping-cart'], ['bx-image', 'image'], ['bx-phone', 'phone']],
      // v3-only names: not in the table (its icons come from the v2 package), but the converter still understands them
      extra: { 'arrow-right': 'arrow-right', eye: 'eye', 'alert-triangle': 'alert-triangle' },
      prefixes: [['bxs-', 'solid'], 'bx-'],
      tokens: { bx: '', bxf: 'style:solid', bxr: '', bxs: '', 'bx-sm': 'with-sm', 'bx-md': 'with-lg', 'bx-lg': 'with-2x', 'bx-spin': 'with-spin', 'bx-flip-horizontal': 'with-flip-h', 'bx-flip-vertical': 'with-flip-v', 'bx-rotate-90': 'with-rotate-90' },
      before: ['html', '<link rel="stylesheet" href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css">\n\n<i class="bx bx-home"></i>\n<i class="bx bx-cog bx-spin"></i>\n<i class="bxf bx-heart"></i>'],
      after: ['html', '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer></script>\n\n<i class="with with-home"></i>\n<i class="with with-settings with-spin"></i>\n<i class="with with-heart with-solid"></i>'],
      sample: '<i class="bx bx-home"></i>\n<i class="bx bx-cog bx-spin"></i>\n<i class="bxf bx-heart"></i>\n<i class="bx bxs-star"></i>\n<i class="bx bx-envelope"></i>',
      styleNote: 'Boxicons <b>Basic</b> → our <b>Line</b>; <b>Filled</b> (<code>bxf</code>, or <code>bxs-</code> names in v2) → <b>with-solid</b>. In Boxicons 3, <code>bxs</code> means the Sharp style, so check those by eye.',
    },
    faq: [
      ['Do I need to credit Boxicons?', 'The free Boxicons icons are CC BY 4.0, which requires attribution, but the Boxicons docs say the credit is already included in the free files and you don’t need to do anything. with icons is MIT and needs no credit at all.'],
    ],
  },

  /* ───────────────────────── Iconify ───────────────────────── */
  {
    slug: 'iconify', name: 'Iconify', kind: 'aggregator', color: 'gloss', mark: 'If', url: 'https://iconify.design', searchQ: 'magnify',
    known: 'one framework and one syntax (<code>prefix:name</code>) for over 300,000 open-source icons from 200+ icon sets, loaded on demand.',
    hub: { license: 'MIT framework; per-set icon licences', price: 'Free', count: 'over 300,000 (200+ sets)', styles: 'Depends on the set', classes: 'Via Tailwind / UnoCSS plugins', ai: 'None official found' },
    facts: {
      license: ['Framework MIT; every icon set keeps its own licence (MIT, Apache-2.0, CC BY 4.0, CC0 and others)', [1, 2]],
      price: ['Free; no paid tier found', [1]],
      count: ['Over 300,000 open-source icons (“Over 300,000”) from 200+ icon sets', [1, 3]],
      styles: ['Depends on each icon set', [3]],
      frameworks: ['<code>&lt;iconify-icon&gt;</code> web component, React, Vue, Svelte, Tailwind CSS and UnoCSS plugins, an API', [4]],
      classes: ['Through Tailwind (<code>icon-[mdi--home]</code>) or UnoCSS (<code>i-mdi-home</code>) plugins', [5]],
      selfhost: ['Yes: bundle icon data at build time or host your own Iconify API', [4]],
      design: ['Official “Iconify for Figma” plugin', [6]],
      ai: ['No official MCP server or llms.txt found (community MCP servers exist)', []],
      attribution: ['Depends on the icon set’s licence; some sets (e.g. CC BY) require credit', [2]],
    },
    sources: [
      ['Iconify website', 'https://iconify.design/'],
      ['Iconify README (GitHub)', 'https://github.com/iconify/iconify/blob/main/README.md'],
      ['Iconify icon sets browser', 'https://icon-sets.iconify.design/'],
      ['Iconify documentation', 'https://iconify.design/docs/'],
      ['Iconify for Tailwind CSS', 'https://iconify.design/docs/usage/css/tailwind/'],
      ['Iconify for Figma', 'https://iconify.design/docs/design/figma/'],
      ['Iconify API used to check names (mdi)', 'https://api.iconify.design/mdi.json?icons=home,magnify,delete,cog'],
    ],
    them: [
      'You need breadth more than consistency: hundreds of sets and brand logos behind one API.',
      'You already use Tailwind or UnoCSS and want icons as utility classes.',
      'You want to mix icons from several open-source families in one project.',
    ],
    us: [
      `You want one consistent family where every icon shares the same grid, names and stroke, in ${NS} styles.`,
      'You want a single licence (MIT) instead of checking each icon set’s terms.',
      'You also need icons for slides, docs and design tools, with copy and download in any colour.',
    ],
    migrate: {
      mode: 'iconify',
      intro: 'Iconify icons are named <code>prefix:name</code>. The table uses Material Design Icons (<code>mdi</code>), one of the most used sets on Iconify; the converter also understands other prefixes and looks names up by meaning.',
      map: [['mdi:home', 'home'], ['mdi:magnify', 'search'], ['mdi:delete', 'trash'], ['mdi:cog', 'settings'], ['mdi:account', 'user'], ['mdi:email', 'mail'], ['mdi:close', 'close'], ['mdi:check', 'check'], ['mdi:plus', 'plus'], ['mdi:menu', 'menu'], ['mdi:pencil', 'pencil'], ['mdi:download', 'download'], ['mdi:upload', 'upload'], ['mdi:heart', 'heart'], ['mdi:star', 'star'], ['mdi:bell', 'bell'], ['mdi:calendar', 'calendar'], ['mdi:lock', 'lock'], ['mdi:arrow-right', 'arrow-right'], ['mdi:chevron-down', 'chevron-down'], ['mdi:share-variant', 'share'], ['mdi:content-copy', 'copy'], ['mdi:open-in-new', 'external-link'], ['mdi:eye', 'eye'], ['mdi:filter', 'filter'], ['mdi:information', 'info-circle'], ['mdi:alert', 'alert-triangle'], ['mdi:cart', 'shopping-cart'], ['mdi:image', 'image'], ['mdi:phone', 'phone']],
      before: ['html', '<script src="https://code.iconify.design/iconify-icon/3.0.3/iconify-icon.min.js"></script>\n\n<iconify-icon icon="mdi:home"></iconify-icon>\n<iconify-icon icon="mdi:magnify"></iconify-icon>'],
      after: ['html', '<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/cdn.js"></script>\n\n<with-icon name="home"></with-icon>\n<with-icon name="search"></with-icon>'],
      sample: '<iconify-icon icon="mdi:home"></iconify-icon>\n<iconify-icon icon="mdi:magnify"></iconify-icon>\n<Icon icon="mdi:delete" />\n<iconify-icon icon="mdi:cog"></iconify-icon>',
      styleNote: 'Most Iconify sets have one look per prefix. Use our <b>Line</b> for outline sets and <b>Solid</b> for filled ones such as mdi.',
    },
    faq: [
      ['Is with icons available through Iconify?', 'Not today. with icons ships its own packages, a web component, CSS classes and plain SVG, so you don’t need an aggregator to use it.'],
    ],
  },

  /* ───────────────────────── Flaticon ───────────────────────── */
  {
    slug: 'flaticon', name: 'Flaticon', kind: 'marketplace', color: 'engrave', mark: 'Fl', url: 'https://www.flaticon.com', searchQ: 'picture',
    known: 'the biggest icon marketplace on this list, with millions of icons and stickers from many artists, plus UIcons, an icon font with ready CSS classes.',
    hub: { license: 'Flaticon licence (credit on free)', price: 'Free with credit; Premium plan', count: 'over 18 million (icons + stickers)', styles: 'Thousands (many artists)', classes: 'Yes, UIcons (fi-*)', ai: 'None official found' },
    facts: {
      license: ['Flaticon licence: free use with credit to Flaticon and the author; Premium removes the credit. Files can’t be resold or redistributed', [2, 1]],
      price: ['Free with attribution; Premium subscription (monthly or yearly; prices are shown in your local currency)', [1]],
      count: ['Over 18 million icons and stickers (“18.0M+”)', [1]],
      styles: ['Thousands of styles from many contributors; UIcons comes in Regular, Bold, Solid and Thin, rounded or straight', [1, 3]],
      frameworks: ['UIcons npm package (<code>@flaticon/flaticon-uicons</code>), an API, a Google Workspace add-on', [4, 5]],
      classes: ['Yes, with UIcons: <code>&lt;i class="fi fi-rr-home"&gt;&lt;/i&gt;</code>', [4]],
      selfhost: ['Yes: download files; UIcons ships its own CSS and fonts', [4]],
      design: ['Online icon editor; Google Workspace add-on', [5]],
      ai: ['No official MCP server found', []],
      attribution: ['Yes on the free plan (“Uicons by Flaticon” for UIcons); not with Premium', [2, 3]],
    },
    sources: [
      ['Flaticon pricing', 'https://www.flaticon.com/pricing'],
      ['Flaticon legal / licence terms', 'https://www.flaticon.com/legal'],
      ['Flaticon UIcons', 'https://www.flaticon.com/uicons'],
      ['UIcons README (GitHub)', 'https://github.com/flaticon/flaticon-uicons'],
      ['Flaticon for Google Workspace', 'https://www.flaticon.com/for-google'],
      ['UIcons regular-rounded CSS used to check names', 'https://unpkg.com/@flaticon/flaticon-uicons@3.3.1/css/regular/rounded.css'],
    ],
    them: [
      'You need a very specific or illustrative icon: with millions of icons, someone has probably drawn it.',
      'You want coloured, illustrated and sticker-style graphics, not just interface icons.',
      'You’re happy to credit Flaticon, or to pay for Premium and skip the credit.',
    ],
    us: [
      'You don’t want to credit anyone: with icons is MIT, so no attribution, ever.',
      'You need SVG for free: every icon is free as SVG and PNG (Flaticon’s free downloads are PNG; SVG comes with Premium).',
      `You want a consistent family where every icon matches, with the same names in ${NS} styles.`,
    ],
    migrate: {
      mode: 'class',
      intro: 'For UIcons, the pattern is almost the same: swap <code>fi fi-rr-</code> for <code>with with-</code>. For icons you downloaded from Flaticon, search below by meaning to find the matching with icons name.',
      map: [['fi-rr-home', 'home'], ['fi-rr-search', 'search'], ['fi-rr-trash', 'trash'], ['fi-rr-settings', 'settings'], ['fi-rr-user', 'user'], ['fi-rr-envelope', 'mail'], ['fi-rr-cross', 'close'], ['fi-rr-check', 'check'], ['fi-rr-plus', 'plus'], ['fi-rr-menu-burger', 'menu'], ['fi-rr-edit', 'edit'], ['fi-rr-pencil', 'pencil'], ['fi-rr-download', 'download'], ['fi-rr-upload', 'upload'], ['fi-rr-heart', 'heart'], ['fi-rr-star', 'star'], ['fi-rr-bell', 'bell'], ['fi-rr-calendar', 'calendar'], ['fi-rr-lock', 'lock'], ['fi-rr-arrow-right', 'arrow-right'], ['fi-rr-angle-down', 'chevron-down'], ['fi-rr-share', 'share'], ['fi-rr-copy', 'copy'], ['fi-rr-eye', 'eye'], ['fi-rr-filter', 'filter'], ['fi-rr-info', 'info-circle'], ['fi-rr-triangle-warning', 'alert-triangle'], ['fi-rr-shopping-cart', 'shopping-cart'], ['fi-rr-picture', 'image'], ['fi-rr-phone-call', 'phone']],
      prefixes: [['fi-rr-', 'line'], ['fi-rs-', 'line'], ['fi-br-', 'line'], ['fi-bs-', 'line'], ['fi-tr-', 'line'], ['fi-ts-', 'line'], ['fi-sr-', 'solid'], ['fi-ss-', 'solid']],
      tokens: { fi: '' },
      before: ['html', '<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css">\n\n<i class="fi fi-rr-home"></i>\n<i class="fi fi-rr-envelope"></i>\n<i class="fi fi-sr-heart"></i>'],
      after: ['html', '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer></script>\n\n<i class="with with-home"></i>\n<i class="with with-mail"></i>\n<i class="with with-heart with-solid"></i>'],
      sample: '<i class="fi fi-rr-home"></i>\n<i class="fi fi-rr-envelope"></i>\n<i class="fi fi-sr-heart"></i>\n<i class="fi fi-rr-menu-burger"></i>\n<i class="fi fi-rr-picture"></i>',
      styleNote: 'UIcons <b>regular</b>, <b>bold</b> and <b>thin</b> → our <b>Line</b>; <b>solid</b> (<code>fi-sr-</code>, <code>fi-ss-</code>) → <b>with-solid</b>.',
    },
    faq: [
      ['Do I have to credit Flaticon?', 'On the free plan, yes: Flaticon’s licence asks you to credit Flaticon and the icon’s author. Premium removes that requirement. with icons never needs credit.'],
      ['Can I get free SVG icons without attribution?', 'Yes. Every with icons icon is free as SVG and PNG under the MIT licence, with no attribution.'],
    ],
  },

  /* ───────────────────────── Icons8 ───────────────────────── */
  {
    slug: 'icons8', name: 'Icons8', kind: 'marketplace', color: 'sketch', mark: 'I8', url: 'https://icons8.com', searchQ: 'cog',
    known: 'over a million icons in 130+ consistent styles, with desktop apps, a Figma plugin, an AI icon generator and an official MCP server.',
    hub: { license: 'Free with a link; paid licence', price: 'Free (PNG + link); paid plans', count: 'over 1.3 million', styles: '130+', classes: 'Yes, via Line Awesome', ai: 'Official MCP server' },
    facts: {
      license: ['Free if you link to icons8.com where the icons are used; a paid subscription gives a licence without the link', [2]],
      price: ['Free (PNG, with a link); paid plans, including an icons plan from $15/month as listed', [1]],
      count: ['Over 1.3 million; the live number on the site changes (over 1.5 million on the icons page when checked)', [2, 3]],
      styles: ['130+ styles', [4]],
      frameworks: ['API, Mac and Windows apps, Figma plugin; Line Awesome icon font on npm', [1, 5]],
      classes: ['Through Line Awesome, its free icon font: <code>&lt;i class="las la-home"&gt;&lt;/i&gt;</code>', [6]],
      selfhost: ['Yes: downloaded files; Line Awesome via npm, CDN or ZIP', [6]],
      design: ['Figma plugin and desktop apps', [5]],
      ai: ['Official MCP server and an AI icon generator', [4]],
      attribution: ['Yes on the free plan (a link to icons8.com); not with a paid plan', [2]],
    },
    sources: [
      ['Icons8 pricing', 'https://icons8.com/pricing'],
      ['Icons8 licence', 'https://icons8.com/license'],
      ['Icons8 icons', 'https://icons8.com/icons'],
      ['Icons8 MCP server', 'https://icons8.com/mcp'],
      ['Icons8 apps and plugins', 'https://icons8.com/app'],
      ['Line Awesome (GitHub)', 'https://github.com/icons8/line-awesome'],
      ['Line Awesome CSS used to check names', 'https://cdn.jsdelivr.net/npm/line-awesome@1.3.0/dist/line-awesome/css/line-awesome.css'],
    ],
    them: [
      'You want a huge catalogue in one consistent style, from iOS to hand-drawn to 3D.',
      'You want illustrations, photos and AI tools from the same subscription.',
      'You want an official MCP server tied to a large paid catalogue.',
    ],
    us: [
      'You want free SVG with no link back: with icons is MIT (Icons8’s free plan is PNG with a link; SVG is paid).',
      `You want a small, focused set where every icon matches across ${NS} styles.`,
      'You want open packages for React, Vue, Svelte, Angular and Solid.',
    ],
    migrate: {
      mode: 'class',
      intro: 'If you use Line Awesome, Icons8’s free icon font, swap <code>las la-</code> for <code>with with-</code> and fix the names in the table. Line Awesome uses Font Awesome 5 names, so <code>cog</code>, <code>times</code> and <code>bars</code> become settings, close and menu.',
      map: [['la-home', 'home'], ['la-search', 'search'], ['la-trash', 'trash'], ['la-cog', 'settings'], ['la-user', 'user'], ['la-envelope', 'mail'], ['la-times', 'close'], ['la-check', 'check'], ['la-plus', 'plus'], ['la-bars', 'menu'], ['la-edit', 'edit'], ['la-pen', 'pencil'], ['la-download', 'download'], ['la-upload', 'upload'], ['la-heart', 'heart'], ['la-star', 'star'], ['la-bell', 'bell'], ['la-calendar', 'calendar'], ['la-lock', 'lock'], ['la-arrow-right', 'arrow-right'], ['la-chevron-down', 'chevron-down'], ['la-angle-down', 'chevron-down'], ['la-share', 'share'], ['la-copy', 'copy'], ['la-external-link-alt', 'external-link'], ['la-eye', 'eye'], ['la-filter', 'filter'], ['la-info-circle', 'info-circle'], ['la-exclamation-triangle', 'alert-triangle'], ['la-shopping-cart', 'shopping-cart'], ['la-image', 'image'], ['la-phone', 'phone']],
      prefixes: ['la-'],
      tokens: { las: '', lar: '', lab: '', la: '', 'la-lg': 'with-lg', 'la-2x': 'with-2x', 'la-3x': 'with-3x', 'la-4x': 'with-4x', 'la-5x': 'with-5x', 'la-fw': 'with-fw', 'la-spin': 'with-spin', 'la-pulse': 'with-pulse' },
      before: ['html', '<link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">\n\n<i class="las la-home"></i>\n<i class="las la-cog la-spin"></i>\n<i class="las la-bars"></i>'],
      after: ['html', '<script src="https://cdn.jsdelivr.net/npm/@withicons/classes/dist/with-loader.js" defer></script>\n\n<i class="with with-home"></i>\n<i class="with with-settings with-spin"></i>\n<i class="with with-menu"></i>'],
      sample: '<i class="las la-home"></i>\n<i class="las la-cog la-spin"></i>\n<i class="las la-bars"></i>\n<i class="las la-times"></i>\n<i class="las la-shopping-cart la-2x"></i>',
      styleNote: 'Line Awesome is a line style, so it maps to our <b>Line</b>. For other Icons8 styles, pick the closest with icons style: <b>Solid</b> for filled, <b>Sketch</b> for hand-drawn, <b>Gloss</b> for 3D-ish.',
    },
    faq: [
      ['Is Icons8 free?', 'Icons8 has a free plan for PNG icons as long as you link to icons8.com where you use them; SVG and use without the link need a paid plan. with icons is free as SVG and PNG with no link required.'],
    ],
  },

  /* ───────────────────────── The Noun Project ───────────────────────── */
  {
    slug: 'noun-project', name: 'The Noun Project', short: 'Noun Project', kind: 'marketplace', color: 'line', mark: 'NP', url: 'https://thenounproject.com', searchQ: 'idea',
    known: 'a huge library of icons drawn by human artists in thousands of styles, with a fair-pay model for creators and a low-cost Pro plan.',
    hub: { license: 'CC BY 3.0 free; royalty-free paid', price: 'Free with credit; Pro from $3.33/mo (yearly)', count: 'millions (up to 10 million)', styles: 'Thousands (many artists)', classes: 'No', ai: 'llms.txt; Noun Studio (AI)' },
    facts: {
      license: ['Free icons are CC BY 3.0 (credit the creator); a paid royalty-free licence removes the credit', [2]],
      price: ['Free with credit; Noun Pro from $3.33/month billed yearly (as listed)', [1]],
      count: ['Millions: “10M icons” on the pricing page (the site’s llms.txt says more than 8 million)', [1, 4]],
      styles: ['Thousands of artist styles, with style-matched sets', [1]],
      frameworks: ['REST API (paid, with a free trial); plugins for Figma, PowerPoint, Google and Adobe apps; Mac app', [3, 4]],
      classes: ['No official icon font or CSS classes found', []],
      selfhost: ['Yes: download PNG or SVG files', [1]],
      design: ['Figma, Office, Google and Adobe plugins', [4]],
      ai: ['Publishes an llms.txt; Noun Studio for AI-assisted editing and generation; no official MCP server found', [4]],
      attribution: ['Yes on the free plan (CC BY 3.0); not with a paid licence', [2]],
    },
    sources: [
      ['Noun Project pricing', 'https://thenounproject.com/pricing/'],
      ['Noun Project legal / licences', 'https://thenounproject.com/legal/'],
      ['Noun Project API', 'https://thenounproject.com/api/'],
      ['Noun Project llms.txt', 'https://thenounproject.com/llms.txt'],
    ],
    them: [
      'You need an icon for almost any concept, drawn by a real person, often in many interpretations.',
      'You care about supporting independent icon artists.',
      'You want plugins inside PowerPoint, Google and Adobe apps.',
    ],
    us: [
      'You don’t want to credit anyone: with icons is MIT, no attribution.',
      `You need a matching family for an interface: one grid, one stroke, the same names in ${NS} styles.`,
      'You want developer packages and CSS classes as well as downloads.',
    ],
    migrate: {
      mode: null,
      intro: 'Noun Project icons are files, not class names, so there’s nothing to rename in code. Search by meaning below to find each icon’s with icons twin, then download the SVG or PNG. The table lists common searches.',
      concept: true,
      map: [['house', 'home'], ['magnifying glass', 'search'], ['delete', 'trash'], ['gear', 'settings'], ['person', 'user'], ['envelope', 'mail'], ['idea', 'lightbulb'], ['growth', 'trending-up'], ['team', 'users'], ['goal', 'target'], ['money', 'banknote'], ['location', 'map-pin'], ['time', 'clock'], ['security', 'shield-check'], ['chat', 'message-circle'], ['award', 'award'], ['launch', 'rocket'], ['shopping', 'shopping-cart'], ['world', 'globe'], ['education', 'graduation-cap']],
    },
    faq: [
      ['How do I credit a Noun Project icon?', 'Free Noun Project icons are CC BY 3.0, so you credit the creator as the site shows on each icon’s download. A paid licence removes that requirement. with icons needs no credit.'],
    ],
  },

  /* ───────────────────────── Streamline ───────────────────────── */
  {
    slug: 'streamline', name: 'Streamline', kind: 'marketplace', color: 'gloss', mark: 'St', url: 'https://www.streamlinehq.com', searchQ: 'rocket',
    known: 'carefully built icon families (Ultimate, Core, Flex, Sharp, Plump and more) in many variants, with strong Figma and developer tooling and an official MCP server.',
    hub: { license: 'Free licence (credit); Pro', price: 'Free with credit; Pro from $19/mo (yearly)', count: 'over 300,000', styles: 'Many families & variants', classes: 'No', ai: 'Official MCP server' },
    facts: {
      license: ['Streamline Free License: commercial use allowed with credit, up to 50 icons per project; Pro removes the credit', [2, 3]],
      price: ['Free with credit; Icons from $19/month and Full Access from $29/month (annual billing, as listed)', [1, 3]],
      count: ['Over 300,000 vector icons (“300,000+”); the free library lists over 116,000', [1, 4]],
      styles: ['Named families (Ultimate, Core, Flex, Sharp, Plump, Freehand and more) with variants such as Line, Solid, Duo, Flat and Gradient', [4]],
      frameworks: ['Web app, API; plugins for Figma, Framer, VS Code, Webflow, Miro and Lucid', [1]],
      classes: ['No icon font (vectors only)', [5]],
      selfhost: ['Yes: download SVG or PNG and embed them', [4]],
      design: ['Figma, Framer, Webflow, Miro and Lucid plugins', [1]],
      ai: ['Official MCP server', [6]],
      attribution: ['Yes on the free licence; not with Pro', [2]],
    },
    sources: [
      ['Streamline pricing', 'https://home.streamlinehq.com/pricing'],
      ['Streamline Free License (help centre)', 'https://help.streamlinehq.com/en/articles/5354376-streamline-free-license'],
      ['Streamline Icons plan (help centre)', 'https://help.streamlinehq.com/en/articles/5708142-what-s-included-in-the-streamline-icons-subscription-plan'],
      ['Streamline free icons', 'https://www.streamlinehq.com/free'],
      ['Streamline: font files (help centre)', 'https://help.streamlinehq.com/en/articles/5360647-do-you-provide-font-files'],
      ['Streamline MCP', 'https://www.streamlinehq.com/mcp'],
    ],
    them: [
      'You want a premium, deep catalogue with many matching families and variants.',
      'Your team lives in Figma, Framer or Webflow and wants icons inside those tools.',
      'You want an official MCP server tied to a large paid catalogue.',
    ],
    us: [
      'You want unlimited free use with no credit and no per-project icon limit (MIT).',
      'You want open-source packages and CSS classes, not only downloads.',
      `You want a smaller set where every icon matches across ${NS} styles.`,
    ],
    migrate: {
      mode: null,
      intro: 'Streamline icons come as files, so there are no class names to rename. Search by meaning below to find each icon’s with icons twin. The table lists common names.',
      concept: true,
      map: [['house', 'home'], ['magnifying glass', 'search'], ['bin', 'trash'], ['cog', 'settings'], ['user', 'user'], ['mail', 'mail'], ['lightbulb', 'lightbulb'], ['graph', 'chart-line'], ['pie chart', 'chart-pie'], ['rocket', 'rocket'], ['shopping cart', 'shopping-cart'], ['credit card', 'credit-card'], ['map pin', 'map-pin'], ['calendar', 'calendar'], ['lock', 'lock'], ['cloud', 'cloud'], ['chat bubble', 'message-circle'], ['trophy', 'trophy'], ['bell', 'bell'], ['heart', 'heart']],
    },
    faq: [
      ['Is there a limit on free Streamline icons?', 'The Streamline Free License allows up to 50 icons per project, with credit to Streamline. with icons has no limit and needs no credit.'],
    ],
  },
  /* ───────────────────────── Lordicon (animated icons) ───────────────────────── */
  {
    slug: 'lordicon', name: 'Lordicon', kind: 'marketplace', checked: '2026-10-02', color: 'duo', mark: 'Lo', url: 'https://lordicon.com', searchQ: 'notification',
    known: 'a large library of richly illustrated animated icons, delivered as Lottie files and played with the <code>&lt;lord-icon&gt;</code> element, with a free plan (credit required) and paid PRO plans.',
    hub: { license: 'Free (credit) or PRO licence', price: 'Free with credit; PRO from $8/mo (yearly)', count: '47,900+ animated (9,700 free)', styles: 'Animated, adjustable colours & stroke', classes: 'No (<lord-icon> element)', ai: 'API; no official MCP found' },
    facts: {
      license: ['Free licence: commercial use allowed, author credit required, no redistribution of the icons as files. PRO licence: no credit needed', [2]],
      price: ['Free plan; PRO $8/month billed annually ($16 monthly); Team PRO $39/month billed annually (as listed)', [1]],
      count: ['“47,900+ premium and free animated icons”, of which 9,700 are free', [1]],
      styles: ['Animated icons whose colours and stroke weight (light, regular, bold) can be set per use', [3]],
      frameworks: ['A <code>&lt;lord-icon&gt;</code> web component from <code>@lordicon/element</code>, plus React and Flutter docs', [3, 4]],
      classes: ['No CSS classes or icon font; icons are JSON (Lottie) files loaded by the element', [3]],
      selfhost: ['Yes: download Lottie, GIF, MP4, WebP, PNG or SVG', [1]],
      design: ['Figma plugin, a Google Slides & Docs plugin and a WordPress plugin', [4]],
      ai: ['A developer API (with an API key); no official MCP server or llms.txt found', [4]],
      attribution: ['Yes on the free plan; not with PRO', [2]],
    },
    sources: [
      ['Lordicon pricing', 'https://lordicon.com/pricing'],
      ['Lordicon licences', 'https://lordicon.com/licenses'],
      ['Lordicon web docs (lord-icon element)', 'https://lordicon.com/docs/web'],
      ['Lordicon documentation', 'https://lordicon.com/docs'],
    ],
    them: [
      'You want rich, illustrated, multi-colour animations with a lot of character.',
      'You need tens of thousands of animated icons, including very specific concepts.',
      'You want triggers like morph, boomerang or sequence, or GIF and MP4 exports for video.',
    ],
    us: [
      'You want animated icons with no credit and no plan: with icons and its animations are MIT.',
      'You want light motion made of plain CSS: animated SVGs carry their own stylesheet, with no Lottie player or script.',
      `You want the same ${N} icons still or moving, in ${NS} matching styles, with one name everywhere.`,
    ],
    migrate: {
      mode: null,
      intro: 'Lordicon icons are animation files, not class names, so there’s nothing to rename in code. Search by meaning below to find each icon’s with icons twin, then pick its motion in the icon’s Customize panel (or add <code>wm</code> classes in code). The table lists common searches.',
      concept: true,
      map: [['notification', 'bell'], ['home', 'home'], ['search', 'search'], ['heart', 'heart'], ['trash', 'trash'], ['settings', 'settings'], ['loading', 'loader'], ['mail', 'mail'], ['download', 'download'], ['upload', 'upload'], ['lock', 'lock'], ['shopping cart', 'shopping-cart'], ['star', 'star'], ['check', 'check-circle'], ['error', 'x-circle'], ['rocket', 'rocket'], ['gift', 'gift'], ['calendar', 'calendar'], ['chat', 'message-circle'], ['location', 'map-pin']],
    },
    faq: [
      ['Is Lordicon free?', 'Lordicon has a free plan with 9,700 animated icons that requires credit to the author; PRO plans remove the credit and unlock the full library (checked on the pricing and licence pages). with icons is entirely free under MIT, animations included, with no credit.'],
      ['How is with icons’ animation different from Lordicon’s?', 'Lordicon animations are hand-made Lottie files played by its <code>&lt;lord-icon&gt;</code> element, which allows rich, illustrated motion. with icons animates any of its icons with small CSS keyframes (ring, beat, spin, float and more), so there is no player to load and every style can move.'],
    ],
  },
]

