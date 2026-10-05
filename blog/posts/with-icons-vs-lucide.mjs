import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, verdict, cta, doDont, faceOff, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'with-icons-vs-lucide',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'lucide0',
  stickers: [['pen-tool', 'line'], ['swap', 'duo'], ['palette', 'gloss']],
  title: 'with icons vs Lucide: should you switch from the default icons?',
  cardTitle: 'with icons vs Lucide',
  h1: 'with icons vs Lucide: is the <em>default</em> the right pick for you?',
  dek: 'If you use shadcn/ui, you already have Lucide. It is a great set. Here is a friendly look at what it does brilliantly, where with icons adds something new, and whether switching is worth it.',
  description: `with icons vs Lucide with the real icons side by side: 2px vs 1.75px lines, one style vs ${N_STYLES}, ISC vs MIT, shadcn/ui, honest pros and cons, and when to switch.`,
  keywords: ['with icons vs Lucide', 'Lucide alternative', 'Lucide icons license', 'shadcn icons', 'Lucide vs Feather', 'Lucide pros and cons', 'free icon library'],
  about: ['Lucide', 'with icons', 'Icon library'],
  related: ['with-icons-vs-heroicons', 'icon-styles-explained', 'consistent-icons'],
  tldr: [
    '<strong>Stay with Lucide</strong> if one clean outline style is all you need: it has over 1,600 icons, packages for almost every framework, and it is the default in shadcn/ui.',
    `<strong>Try with icons</strong> if you want the same tidy outline look plus filled, tinted and illustrated styles: ${N_ICONS} icons in ${N_STYLES} matching styles, ${N_SVGS} SVGs in total.`,
    'Both are free for commercial use. Lucide uses the ISC licence (icons that came from Feather are MIT). with icons is MIT. Neither asks for a visible credit.',
    'Lucide strokes are 2px wide; the with icons line style uses 1.75px, so it reads a touch lighter. Both use a 24 × 24 grid.',
    'Lucide is a community fork of Feather. with icons is drawn from scratch, but uses a very similar component style, so switching takes minutes.',
  ],
  faq: [
    { q: 'Is Lucide free for commercial use?', a: 'Yes. Lucide is released under the ISC licence, a short permissive licence similar to MIT. Icons that originally came from Feather are covered by Feather’s MIT licence. You can use them in commercial products without a visible credit; keep the licence notice if you redistribute the code.' },
    { q: 'Do I need to credit Lucide?', a: 'Not on screen. The ISC and MIT licences only ask you to keep the copyright and licence notice with copies of the software or source files. Using the icons in an app or website does not require a visible credit.' },
    { q: 'What is the best alternative to Lucide?', a: `It depends on what you miss. If you want the same tidy outline look plus filled, tinted and illustrated versions of every icon, with icons gives you ${N_ICONS} icons in ${N_STYLES} matching styles under MIT. If you simply need more outline icons, Hugeicons Free is bigger (over 6,000 icons). Feather, where Lucide came from, is smaller (287 icons) and rarely changes.` },
    { q: 'Why does shadcn/ui use Lucide?', a: 'shadcn/ui sets “lucide” as the default icon library in its components.json file and installs lucide-react during setup. Lucide fits well because it is a clean, consistent outline set with a strong React package.' },
    { q: 'Can I use with icons with shadcn/ui?', a: 'Yes. You can keep Lucide for the built-in components and use with icons elsewhere, or swap icons one by one. The with icons components use currentColor and accept className, size and strokeWidth, so Tailwind classes keep working. Install them with <code>npm i @withicons/react</code>, or copy SVG code from any icon page.' },
    { q: 'Lucide vs Feather: what is the difference?', a: 'Lucide started as a community fork of Feather and kept its 24 × 24, 2px outline look. Feather lists 287 icons and rarely changes; Lucide has grown to over 1,600 icons and ships new releases often.' },
    { q: 'Lucide vs Hugeicons: which should I pick?', a: 'Both are free outline sets. Hugeicons Free is larger (over 6,000 Stroke Rounded icons, MIT) and sells more styles in Pro. Lucide (over 1,600 icons, ISC) is fully free and is the shadcn/ui default. Pick by which look you prefer and which icons you need.' },
  ],
  sources: [
    { title: 'Lucide website (icon count, packages, checked October 2026)', url: 'https://lucide.dev' },
    { title: 'Lucide on GitHub (README)', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'Lucide licence', url: 'https://lucide.dev/license' },
    { title: 'Lucide icon design specification (24 × 24 grid, 2px stroke)', url: 'https://lucide.dev/contribute/icons/specification' },
    { title: 'Lucide llms.txt', url: 'https://lucide.dev/llms.txt' },
    { title: 'npm: lucide-static (the icons shown side by side)', url: 'https://www.npmjs.com/package/lucide-static' },
    { title: 'shadcn/ui manual installation (lucide-react, iconLibrary)', url: 'https://ui.shadcn.com/docs/installation/manual' },
    { title: 'Feather icons (icon count)', url: 'https://feathericons.com' },
    { title: 'Hugeicons pricing (free icon count, checked October 2026)', url: 'https://hugeicons.com/pricing' },
    { title: `with icons library (${N_ICONS} icons, ${N_STYLES} styles)`, url: 'https://withicons.com/icons.html' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Pick Lucide if you want one clean outline style and the widest choice: over 1,600 icons, packages for almost every framework, and it is already the default in shadcn/ui. Pick ${L.icons('with icons')} if you want that same tidy outline look plus filled, tinted and illustrated versions of every icon: ${N_ICONS} icons in ${N_STYLES} matching styles. Both are free for commercial use, and neither asks for a visible credit.</span>`)}
${p('Here is a fun fact: if you have built anything with shadcn/ui, you are already using Lucide. It is the icon set that comes in the box. So this is less “which icon set should I discover?” and more “is the default still the best choice for me?” Let’s look.')}

${h2('How do Lucide and with icons compare?')}
${table(['', 'with icons', 'Lucide'], [
  ['Price', yes('Free'), yes('Free')],
  ['Licence', yes('MIT, no visible credit'), yes('ISC (Feather-derived icons MIT), no visible credit')],
  ['Number of icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, yes('Over 1,600 (the site listed 1,857)')],
  ['Styles', yes(`${N_STYLES}: line, solid and duo for interfaces, plus ${N_STYLES - 3} creative styles such as gloss, glass, pixel, retro and luxe`), meh('1 outline style (stroke width adjustable)')],
  ['Default stroke', '1.75px on a 24 × 24 grid', '2px on a 24 × 24 grid'],
  ['Framework packages', yes('React, Vue, Svelte, Angular, Solid, web component'), yes('React, Vue, Svelte, Solid, Preact, Angular, Astro, React Native, plain JS')],
  ['Built into shadcn/ui', no('No, but works alongside it'), yes('Yes, the default')],
  ['Ready for slides and docs', yes('Copy image, PNG and SVG in any colour'), meh('Copy SVG code from the site')],
  ['Help for AI assistants', yes('MCP server, llms.txt, agent skill'), meh('llms.txt (no official MCP server found)')],
], 'with icons and Lucide, side by side (checked October 2026)')}

${h2('What do Lucide icons look like next to with icons?')}
${p('Tables only tell you so much, so here are the real icons. Each pair shows a with icons line icon on top and the matching icon from Lucide’s official package underneath, with both names, so you can judge the look for yourself.')}
${faceOff('lucide', { caption: 'Look at the line weight first: Lucide draws every icon with a 2px stroke, our line style uses 1.75px, so ours reads a little lighter. Then look at the shapes: Lucide’s house is one closed outline with a softly rounded roof, while ours has a separate roof line that overhangs the walls. The names show where the two sets call things differently, like house and home.' })}
${p('Lucide’s design spec says strokes must be 2px wide, with rounded ends and joins. Our line style uses 1.75px by default. Neither is “right”. Heavier lines hold up better on low-quality screens; lighter lines feel calmer next to body text. If you switch and want an exact match, the with icons components accept a <code>strokeWidth</code> setting, just like Lucide’s.')}
${figure('sketch0', 'Small details like line weight are what make a set of icons feel calm or busy. Pick one weight and keep it everywhere.')}

${h2('Why is Lucide everywhere?')}
${p('Mostly because of shadcn/ui, a hugely popular way to build React interfaces. Its setup installs <code>lucide-react</code> and sets Lucide as the icon library, so a lot of new projects start with Lucide before anyone has actively chosen an icon set.')}
${p('It also earns its place. Lucide has a written design spec (every icon sits on a 24 × 24 canvas with 2px strokes), which is why its icons look like they belong together. So if you are reading this because you think Lucide is bad: it is not. It is one of the best free outline icon sets on the web.')}

${h2('Is Lucide the same as Feather?')}
${p(`Not quite. Lucide started life as a community fork of Feather, a much-loved minimal icon set. (A “fork” is a copy of a project that then grows on its own.) Feather grew slowly and still lists 287 icons, so the Lucide community kept its look and kept adding icons. Some of Lucide’s icons still come from Feather, which is why its licence page mentions Feather’s MIT licence alongside Lucide’s own ISC licence.`)}
${p(`with icons is not part of that family. Every icon is drawn from scratch on our own 24 × 24 skeletons. If you liked Feather, our ${L.alt('feather', 'Feather alternative page')} explains how the two compare.`)}

${h2('Does Lucide have more than one style?')}
${p('No. Lucide has one look: a thin outline. You can make the line thicker or thinner, and change the colour and size, but it is always an outline.')}
${p(`with icons draws each icon once and renders it into ${N_STYLES} styles: 3 everyday interface styles (line, solid and duo) and ${N_STYLES - 3} creative ones. Here is the bell icon, the one you would use for notifications. Line is closest to Lucide; the rest are what Lucide does not offer.`)}
${styleRow('bell')}
${p('Why would you want that? A few everyday situations:')}
${ul([
  '<strong>Active states.</strong> Show the selected tab in solid and the rest in line. Same icon, clearly “on”.',
  `<strong>Friendly dashboards.</strong> The ${L.style('duo')} style adds a soft tint behind the line, which makes cards and empty states feel warmer.`,
  '<strong>Marketing pages and slides.</strong> Creative styles like gloss, glass, pixel, retro and kawaii turn an icon into a small illustration, without hunting for a separate illustration pack.',
])}
${iconGrid(['home', 'search', 'inbox', 'calendar', 'users', 'settings'], 'duo', 'An app sidebar in the duo style: the same shapes as the line style, with a soft tint behind.')}

${h2('Is Lucide free for commercial use?')}
${p('Yes. Lucide uses the <strong>ISC licence</strong>, which is about as relaxed as licences get. It says you can use, copy, change and share the work for any purpose, as long as the licence notice stays with copies of the code. The icons that came from Feather are covered by Feather’s <strong>MIT licence</strong>, which says the same thing in slightly different words.')}
${p(`with icons uses <strong>MIT</strong> for everything. In practice the two are equally friendly: commercial use is fine, client work is fine, and you never need a visible “icons by” credit. See our ${L.page('license.html', 'license page')} for the full text, or ${L.post('free-icons-commercial-use', 'our plain-English guide to icon licences')}.`)}

${h2('Should shadcn/ui users switch?')}
${p('Not necessarily, and you do not have to switch all at once. Here is a sensible way to think about it.')}
${h3('Keep Lucide if…')}
${p('Your app is mostly forms, tables and settings screens, you like the look, and you never need filled or decorative icons. Changing icons has a real cost (time, review, small visual bugs) and no real benefit in that case.')}
${h3('Bring in with icons if…')}
${p('You want solid icons for active states, tinted icons for dashboards, or expressive icons for your landing page and pitch deck, and you want all of them to match. Both sets use one component per icon with similar settings (size, colour, stroke width), so swapping is mostly renaming. A few names differ: Lucide’s <code>House</code> is our <code>Home</code> and <code>Trash2</code> is our <code>Trash</code> (you can see both pairs in the side-by-side above), <code>X</code> is <code>Close</code>, and <code>Funnel</code> is <code>Filter</code>.')}
${iconGrid(['home', 'trash', 'close', 'filter', 'edit', 'share'], 'line', 'The with icons names for common Lucide icons: house becomes home, trash-2 becomes trash, x becomes close, funnel becomes filter.')}
${p(`Our ${L.alt('lucide', 'Lucide alternative page')} has a full name map and a converter that rewrites your imports for you. (The with icons packages install from npm, for example <code>npm i @withicons/react</code>, and every icon page also lets you copy the SVG code.)`)}
${doDont('<p>Pick one icon set per screen. If you move to with icons, move a whole area (say, the sidebar) at once.</p>', '<p>Put a 2px Lucide icon next to a 1.75px with icons line icon in the same toolbar. The small difference in weight is surprisingly easy to spot.</p>')}

${h2('What about slides, docs and AI tools?')}
${p(`Lucide is built mainly for developers. You can copy an icon’s SVG code from its website, which is perfect for a developer or designer, but less handy if you just want an icon in a Google Slides deck.`)}
${p(`with icons was built for both. Every icon page has <strong>Copy image</strong>, <strong>PNG download</strong> in any colour and size, and <strong>SVG download</strong>, plus guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('google-slides', 'Google Slides')}, ${L.guide('notion', 'Notion')} and more.`)}
${p(`For AI tools, Lucide publishes an llms.txt file (a summary of its docs written for AI models), which helps. We did not find an official Lucide MCP server. with icons has an llms.txt, an agent skill and an ${L.page('ai.html', 'MCP server')} that lets assistants search the real icon list, so they stop inventing names.`)}

${h2('What are the pros and cons of Lucide and with icons?')}
${p('Both sets are free, well made and easy to use, so the choice comes down to trade-offs. Here they are in plain words, for each side.')}
${prosCons('Lucide', {
  lib: 'lucide',
  pros: [
    ['Huge range', `Over 1,600 icons (the site listed 1,857), almost four times our ${N_ICONS}. If you need something niche, Lucide is far more likely to have the exact icon.`],
    ['Ready in almost every framework', 'There are official packages for React, Vue, Svelte, Solid, Preact, Angular, Astro, React Native and plain JavaScript, and you can install them today.'],
    ['Already in shadcn/ui', 'If your app uses shadcn/ui, Lucide is there from day one and every example uses it. Zero setup.'],
    ['Consistent by design', 'A written rulebook (24 × 24 grid, 2px lines, rounded ends) keeps every icon looking like part of the same family.'],
    ['Big, active community', 'Lots of contributors add and refine icons all the time, and new releases come out often.'],
  ],
  cons: [
    ['Only one look', 'Every icon is an outline. There is no filled version for a selected tab and no tinted or illustrated style, so you would need a second icon set, and it will not quite match.'],
    ['Made mainly for developers', 'The website is built around code. If you just want an icon in a slide or a document, it takes a few more steps than a copy-image button.'],
    ['Less help for AI assistants', 'There is an llms.txt file, but we found no official MCP server, so AI tools may still guess icon names that do not exist.'],
    ['Two licences to read', 'Most icons are ISC and the ones from Feather are MIT. Both are relaxed and free; it is just one extra thing to understand.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} styles of every icon`, `Each icon is drawn once and comes in line, solid and duo for interfaces, plus ${N_STYLES - 3} creative styles such as gloss, glass, pixel, retro and luxe. Each also has 20 to 30 hand-picked colour palettes. Your app, homepage and slides can all use the same family.`],
    ['Easy for non-developers', `Every icon page has Copy image, a PNG download in any colour and size, and an SVG download, plus step-by-step guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('canva', 'Canva')} and more.`],
    ['One simple licence', 'Everything is MIT: free for personal and commercial use, with no credit needed.'],
    ['Built for AI helpers', 'An MCP server, an llms.txt file and an agent skill let AI assistants find real icon names instead of inventing them.'],
    ['Search that speaks human', 'Everyday words work: “bin” finds trash and “gear” finds settings.'],
  ],
  cons: [
    ['A smaller catalogue', `There are ${N_ICONS} icons, so rare or very specific symbols may be missing, and there are no brand logos at all.`],
    ['Fewer framework packages', 'There are packages for React, Vue, Svelte, Angular, Solid and a web component, but none for Preact, Astro or React Native, which Lucide covers.'],
    ['Newer, with a smaller community', 'Fewer tutorials and examples exist so far, and it is not built into shadcn/ui, so you add it yourself.'],
    ['Creative styles need room', 'The creative styles, from gloss to pixel and luxe, are made for 32px or larger. For tiny interface icons, stick to line, solid or duo.'],
  ],
})}
${p('Who does each one suit? Lucide is a great fit for developers building a busy app, especially on shadcn/ui, who need lots of icons in one plain style and want a package for almost any framework. with icons suits founders, marketers, teachers and small teams who want the same icons in their app, on their landing page and in their pitch deck, without mixing sets or touching code.')}

${h2('So, should you use Lucide or with icons?')}
${verdict({
  a: ['with icons', ['You want filled, tinted and illustrated versions of the same icons.', 'You want a slightly lighter 1.75px line.', 'You make slides and docs, not just apps.', 'You want an MCP server so AI assistants find real icon names.']],
  b: ['Lucide', ['You only need one clean outline style.', 'You need more than 1,600 icons to choose from.', 'You use shadcn/ui and want zero setup.', 'You need React Native or Astro packages.']],
})}
${p(`Lucide is a brilliant default, and there is no shame in keeping it. with icons is for the moment you want more than outlines: a solid active state, a warm duo dashboard, a glossy hero, a pixel-art game screen, a sketchy slide, all from one family. Curious how other popular sets compare? Read ${L.post('with-icons-vs-heroicons', 'with icons vs Heroicons')} or our explainer on ${L.post('icon-styles-explained', 'icon styles')}.`)}
${cta('See the bell in every style', `Search ${N_ICONS} icons, flip between ${N_STYLES} styles, and copy SVG code or a PNG in one click. Free and MIT licensed.`, ['bell', 'home', 'search', 'settings', 'palette', 'sparkles'])}
`,
}
