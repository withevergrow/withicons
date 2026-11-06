import { p, h2, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, steps, quote, doDont, cta, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'free-icons-no-attribution',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-free-icons-no-attribution',
  stickers: [['badge-check', 'gloss'], ['quote', 'duo'], ['heart', 'sticker']],
  title: 'Free icons with no attribution: which sets need no credit?',
  cardTitle: 'Free icons with no attribution',
  h1: 'Free icons with no attribution: which sets <em>need no credit</em>?',
  dek: 'Some free icons ask for a credit line, some ask for nothing at all. Here is what attribution really means, which popular sets need it, and what to do if you already used icons that do.',
  description: 'Free icons with no attribution: what a credit line means, which licences need one (CC BY, Flaticon, Icons8) and which do not (MIT, ISC, Apache 2.0, CC0).',
  keywords: ['free icons no attribution', 'icons without attribution', 'flaticon without attribution', 'free icons no credit required', 'icons no attribution commercial use', 'attribution free icons'],
  about: ['Attribution', 'Icon license', 'MIT License', 'Creative Commons license', 'Flaticon'],
  related: ['free-icons-commercial-use', 'with-icons-vs-flaticon', 'where-to-get-free-svg-icons'],
  tldr: [
    '<strong>No credit needed:</strong> icons under MIT, ISC, Apache 2.0 or CC0. That covers Lucide, Heroicons, Tabler, Phosphor, Bootstrap Icons, Material Symbols and with icons.',
    '<strong>Credit needed:</strong> CC BY icons, and the free plans of Flaticon, Freepik (now Magnific), Icons8 (a link), The Noun Project and Streamline.',
    '<strong>In between:</strong> Font Awesome Free is CC BY 4.0, but the credit inside its files counts. On SVG Repo and Iconify it depends on each icon or set.',
    '<strong>Already used credit-required icons?</strong> Add the credit, buy the plan that removes it, or swap them for a no-credit set.',
    `<strong>with icons</strong> is MIT: ${N_ICONS} icons in ${N_STYLES} styles (${N_SVGS} SVGs), free for commercial use, no attribution.`,
  ],
  faq: [
    { q: 'Which free icons need no attribution?', a: 'Icons under MIT, ISC, Apache 2.0 and CC0 need no visible credit. Popular examples are Lucide (ISC), Heroicons, Tabler Icons, Phosphor, Bootstrap Icons and with icons (all MIT), and Material Symbols (Apache 2.0, where Google says a credit is welcome but not required).' },
    { q: 'Can I use Flaticon icons without attribution?', a: 'Only with Flaticon Premium. Free users must credit the author and link to Flaticon. Flaticon’s help centre says you need one line per author, not one per icon. If you do not want to credit or pay, use a no-credit set instead.' },
    { q: 'Do I need to credit MIT-licensed icons on my website?', a: 'No. MIT asks you to keep its copyright and licence notice with copies of the files or code, for example in a repository or a template you share. Showing an icon on a website, in an app, on a slide or in print needs no visible credit.' },
    { q: 'Do I need to credit Icons8 icons?', a: 'On the free plan, yes: Icons8 asks for a link to icons8.com wherever you use its icons, such as the site footer, an app’s About screen or a slide. A paid plan removes the link, and Icons8 says icons downloaded while subscribed can be used without attribution after you cancel.' },
    { q: 'What happens if I forget to add a required credit?', a: 'You are using the icon outside its licence. The fix is simple: add the credit now, buy the plan that removes it, or replace the icons with ones that need no credit. It is far easier to sort this out early than after a launch.' },
    { q: 'Is this legal advice?', a: 'No. It is a friendly summary by an icon library, checked against each licence and help page in November 2026. For anything high-stakes, read the licence itself or ask a lawyer.' },
  ],
  sources: [
    { title: 'The MIT License (Open Source Initiative)', url: 'https://opensource.org/license/mit' },
    { title: 'The ISC License (Open Source Initiative)', url: 'https://opensource.org/license/isc' },
    { title: 'Apache License, Version 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
    { title: 'Creative Commons: CC0 1.0 deed', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
    { title: 'Creative Commons: CC BY 4.0 deed', url: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'Creative Commons: CC BY 3.0 deed', url: 'https://creativecommons.org/licenses/by/3.0/' },
    { title: 'Lucide licence (ISC)', url: 'https://lucide.dev/license' },
    { title: 'Heroicons (GitHub, MIT)', url: 'https://github.com/tailwindlabs/heroicons' },
    { title: 'Tabler Icons README (GitHub, MIT)', url: 'https://github.com/tabler/tabler-icons' },
    { title: 'Phosphor homepage README (GitHub, MIT)', url: 'https://github.com/phosphor-icons/homepage' },
    { title: 'Bootstrap Icons website', url: 'https://icons.getbootstrap.com' },
    { title: 'google/material-design-icons README (attribution not required)', url: 'https://github.com/google/material-design-icons' },
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'SVG Repo licensing', url: 'https://www.svgrepo.com/page/licensing/' },
    { title: 'Iconify icon sets browser (licence per set)', url: 'https://icon-sets.iconify.design/' },
    { title: 'Flaticon pricing (Free vs Premium attribution)', url: 'https://www.flaticon.com/pricing' },
    { title: 'Flaticon help: Attribution, how, when and where?', url: 'https://support.flaticon.com/s/article/Attribution-How-when-and-where-FI?language=en_US' },
    { title: 'Magnific (formerly Freepik) docs: licenses and attribution', url: 'https://support.freepik.com/s/article/Attribution-How-when-and-where?language=en_US' },
    { title: 'Icons8 licence: how to use our graphics for free', url: 'https://icons8.com/license' },
    { title: 'Icons8 pricing (subscriptions, use after cancelling)', url: 'https://icons8.com/pricing' },
    { title: 'Icons8 icons pricing (Icons plan)', url: 'https://icons8.com/icons/pricing' },
    { title: 'The Noun Project legal (CC BY 3.0, royalty-free licence)', url: 'https://thenounproject.com/legal/' },
    { title: 'The Noun Project pricing (Noun Pro)', url: 'https://thenounproject.com/pricing/' },
    { title: 'Streamline Free License (help centre)', url: 'https://help.streamlinehq.com/en/articles/5354376-streamline-free-license' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Free icons with no attribution are easy to find once you know the licence names. Icons under <strong>MIT, ISC, Apache 2.0 or CC0</strong> need no credit line: that includes Lucide, Heroicons, Tabler, Phosphor, Bootstrap Icons, Material Symbols and ${L.icons('with icons')}. Icons under <strong>CC BY</strong>, and the free plans of marketplaces like Flaticon, Icons8 and The Noun Project, do need one.</span>`)}
${p('This guide explains what attribution actually means, gives you one table of popular sets and whether each needs a credit, and shows the three ways out if you already used icons that do.')}
${callout('note', 'We are an icon library, not lawyers, so please take this as a friendly map rather than legal advice. We checked every licence and help page in November 2026. For anything high-stakes, read the licence itself or ask a professional.', 'A quick, kind disclaimer')}

${h2('What does attribution mean for icons?')}
${p('Attribution simply means <strong>saying who made it</strong>, like the photographer’s name under a newspaper photo. When a licence asks for attribution, you add a short credit line wherever the icon appears, or in a credits section nearby.')}
${p('A typical credit names the icon or its author, where it came from, and sometimes the licence, with a link if you are on the web. Flaticon’s help centre gives this format:')}
${quote('Icon made by [author] from www.flaticon.com', 'Flaticon help centre, attribution format')}
${p('Where the line goes depends on what you are making:')}
${ul([
  '<strong>Website:</strong> on the page that shows the icon, next to it or in the footer.',
  '<strong>Slides:</strong> on the slide, or on a credits slide at the end.',
  '<strong>App:</strong> the About or Credits screen, and often the app store description.',
  '<strong>Print:</strong> the acknowledgements or small print.',
])}
${p('“No attribution” means you can skip all of that. You use the icon and move on.')}

${h2('Which licences need attribution, and which do not?')}
${table(['Licence', 'Visible credit?', 'What it does ask', 'Commercial use?'], [
  ['MIT', yes('No'), 'Keep the licence text with copies of the files or code', yes('Yes')],
  ['ISC', yes('No'), 'Same as MIT, in fewer words', yes('Yes')],
  ['Apache 2.0', yes('No'), 'Keep the licence and any NOTICE file when you share the files', yes('Yes')],
  ['CC0', yes('No'), 'Nothing at all', yes('Yes')],
  ['CC BY 3.0 / 4.0', no('Yes'), 'Credit the creator, link the licence, say if you changed it', yes('Yes')],
  ['CC BY-NC', no('Yes'), 'Credit, and no commercial use at all', no('No')],
  ['Marketplace free plans', no('Yes'), 'A credit or link, set by the company', meh('Yes, with limits')],
], 'Common icon licences and the credit they ask for (checked November 2026).')}
${p(`The key detail is the difference between <strong>showing</strong> an icon and <strong>sharing the files</strong>. MIT, ISC and Apache 2.0 only care about the second: if you pass the icon files or code on, keep the little licence file with them. A website, an app screen, a slide or a poster needs no visible credit. Our guide ${L.post('free-icons-commercial-use', 'Can I use free icons commercially?')} explains each licence in more depth.`)}

${h2('Which popular icon sets need no credit?')}
${table(['Icon set', 'Licence (free use)', 'Credit needed?', 'Good to know'], [
  ['with icons', 'MIT', yes('No'), `${N_ICONS} icons in ${N_STYLES} styles, PNG and SVG`],
  ['Lucide', 'ISC (MIT for Feather icons)', yes('No'), 'The default set in shadcn/ui'],
  ['Heroicons', 'MIT', yes('No'), 'By the makers of Tailwind CSS'],
  ['Tabler Icons', 'MIT', yes('No'), 'Over 6,200 icons, outline and filled'],
  ['Phosphor', 'MIT', yes('No'), 'Six weights of each icon'],
  ['Bootstrap Icons', 'MIT', yes('No'), 'Over 2,000 icons'],
  ['Material Symbols', 'Apache 2.0', yes('No'), 'Google says a credit is welcome, not required'],
  ['Font Awesome Free', 'CC BY 4.0', meh('Already in the files'), 'Keep the comments inside the files'],
  ['SVG Repo', 'Per icon', meh('Depends on the icon'), 'Default licence needs none; some icons are CC BY or NC'],
  ['Iconify', 'Per icon set', meh('Depends on the set'), 'Each set shows its licence'],
  ['Flaticon (free)', 'Flaticon licence', no('Yes, author + Flaticon'), 'Premium removes it'],
  ['Freepik, now Magnific (free)', 'Free licence', no('Yes, credit + link'), 'Premium, Plus or Pro removes it'],
  ['Icons8 (free)', 'Icons8 licence', no('Yes, a link to icons8.com'), 'Paid plan removes it'],
  ['The Noun Project (free)', 'CC BY 3.0', no('Yes, the creator'), 'Noun Pro removes it'],
  ['Streamline (free)', 'Streamline Free License', no('Yes, credit + link'), 'Pro removes it'],
], 'Popular icon sets and whether their free version needs a credit (checked November 2026).')}
${callout('tip', `Want the full picture of where each set lives and which formats you get? Our post on ${L.post('where-to-get-free-svg-icons', 'where to get free SVG icons')} compares eleven sites side by side.`)}

${h2('Can I use Flaticon without attribution?')}
${p('Only with Flaticon Premium. Flaticon’s pricing page puts it plainly: free members must link to Flaticon and credit the author, while Premium members can use icons without crediting anyone. Two details help if you stay on the free plan:')}
${ul([
  '<strong>One line per author, not per icon.</strong> Flaticon’s help centre says you include a line for each author you used. Ten icons from one artist means one credit.',
  '<strong>Some packs are not covered.</strong> The same page notes that a few packs made by third parties, such as those by Google, are not under Flaticon’s licence, so check the pack’s own terms.',
])}
${p(`If you would rather never think about credits, a no-credit set is simpler. Our ${L.alt('flaticon', 'Flaticon alternative page')} helps you find each Flaticon icon’s twin by meaning, and ${L.post('with-icons-vs-flaticon', 'with icons vs Flaticon')} compares the two honestly, including where Flaticon wins (it has millions of icons, we have ${N_ICONS}).`)}
${figure('slides2', 'Credits slides are easy to forget at 11pm before a talk. No-credit icons mean one less thing to remember.')}

${h2('What should I do if I already used icons that need a credit?')}
${p('No panic needed. You have three good options, and you can mix them:')}
${steps([
  ['Add the credit', 'Use the exact wording the source asks for. Put it next to the icon, in the footer, on a credits slide or in the app’s About screen. Flaticon and Freepik show the text on the download screen; Icons8 just wants a link to icons8.com.'],
  ['Buy the plan that removes it', 'Flaticon Premium, Noun Pro (from $3.33 a month billed yearly) or the Icons8 Icons plan ($15 a month as listed). Check what happens after you cancel: Icons8 says assets downloaded while subscribed stay usable with no attribution.'],
  ['Swap to a no-credit set', `Replace the icons with ones under MIT, ISC, Apache 2.0 or CC0. Search ${L.icons('with icons')} in everyday words like “money”, “team” or “bin” to find each twin.`],
])}
${p('Swapping is often less work than it sounds, because most decks and sites use the same handful of everyday ideas. Here is a typical set, all MIT, in one matching style:')}
${iconGrid(['home', 'mail', 'calendar', 'users', 'chart-line', 'rocket', 'lightbulb', 'target', 'shopping-cart', 'settings', 'heart', 'star'], 'line', 'Twelve everyday icons that need no credit anywhere: websites, apps, slides or print.')}
${p(`And because every with icons drawing comes in ${N_STYLES} styles, you can keep the playful look of a marketplace icon too, from ${L.style('sticker')} to kawaii, pixel and hand-drawn sketch:`)}
${styleRow('badge-check', '', { styles: ['line', 'solid', 'duo', 'gloss', 'sticker', 'kawaii', 'pixel', 'sketch'] })}

${h2('Is “no attribution” the same as “no rules”?')}
${p('Not quite. Even the most relaxed licences keep a few small conditions, and none of them hand you trademark rights.')}
${ul([
  '<strong>Keep the licence file when you share the files.</strong> If you publish the icon files or code (a repository, an npm package, a template you sell), include the MIT, ISC or Apache licence text.',
  '<strong>Logos are trademarks.</strong> A brand logo in an icon set still belongs to the brand. Use it only to refer to that company.',
  '<strong>Check special uses.</strong> Some licences limit logos, resale on merchandise or rebuilding the set as your own library. Flaticon, Freepik and Remix Icon all have rules like this.',
])}
${p(`with icons is MIT and has no brand logos. You can use every icon in personal and commercial work with no credit, and our ${L.page('license.html', 'license page')} has the full text.`)}

${h2('How do you find icons with no attribution quickly?')}
${steps([
  ['Start from a single-licence set', 'Lucide, Tabler, Phosphor, Material Symbols or with icons. One licence, no surprises.'],
  ['On aggregators, read the icon’s own licence', 'SVG Repo and Iconify show the licence per icon or per set. Skip anything marked CC BY (unless you will credit) or NC.'],
  ['On marketplaces, look for the plan line', 'Free usually means a credit. If the page says “no attribution required”, that is a paid plan.'],
])}
${doDont('<p>Pick one no-credit set for your whole project and note its licence in a small text file. If a source needs a credit, add it on day one.</p>', '<p>Mix free marketplace icons into a client project and hope nobody asks. Missing credits are hardest to fix after launch.</p>')}

${h2('The short answer')}
${p(`If you want free icons with no attribution, choose sets under MIT, ISC, Apache 2.0 or CC0. If you already used credit-required icons, add the credit, pay to remove it, or swap. And if you want one matching set for slides, docs and code that never needs a credit line, ${L.icons(`browse all ${N_ICONS} with icons`)}. For the broader picture, see ${L.post('best-free-icon-libraries', 'the best free icon libraries')}.`)}
${cta('Icons with no credit line, ever', `${N_ICONS} icons in ${N_STYLES} styles under the MIT licence. Copy into slides, download PNG or SVG, or install for your app. No sign-up.`, ['badge-check', 'heart', 'star', 'rocket', 'sparkles', 'gift'])}
`,
}
