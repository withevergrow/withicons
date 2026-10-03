import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, meh, verdict, callout, stats, steps, cta, faceOff, rivalStyles, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

const N_CREATIVE = N_STYLES - 3 // everything beyond line, solid and duo

export default {
  slug: 'with-icons-vs-material-symbols',
  category: 'comparisons',
  date: '2026-10-02',
  hero: 'mat0',
  stickers: [['smartphone', 'solid'], ['sliders', 'duo'], ['palette', 'gloss']],
  title: 'with icons vs Material Symbols: which free icon set fits you?',
  cardTitle: 'with icons vs Material Symbols',
  h1: 'with icons vs Material Symbols: Google’s look, or <em>your</em> look?',
  dek: `Material Symbols is Google’s own icon set, built into a clever adjustable font. with icons is a smaller set of ${N_ICONS} icons in ${N_STYLES} very different styles. Here is how to choose, in plain English.`,
  description: 'with icons vs Google’s Material Symbols: the real icons side by side, honest pros and cons, styles, the variable font, licences, and which one suits you.',
  keywords: ['with icons vs Material Symbols', 'Material Symbols alternative', 'Google Material icons alternative', 'Material Symbols license', 'Material Symbols pros and cons', 'free icons for apps'],
  about: ['Material Symbols', 'Material Design', 'with icons', 'Icon library'],
  related: ['with-icons-vs-font-awesome', 'icon-styles-explained', 'best-free-icon-libraries'],
  tldr: [
    '<strong>Pick Material Symbols</strong> if your app follows Google’s Material Design or Android, or you need more than 2,500 icons from one maker.',
    `<strong>Pick with icons</strong> if you want your product to look like your brand rather than Google’s, with ${N_STYLES} matching styles and ready-made PNG and SVG files for slides.`,
    'Material Symbols comes in 3 styles (Outlined, Rounded, Sharp) inside a variable font with sliders for fill, weight, grade and size.',
    'Both are free for commercial use. Material Symbols uses Apache 2.0, with icons uses MIT, and neither asks you to show a credit.',
    `with icons has ${N_ICONS} icons drawn once and rendered in ${N_STYLES} styles (${N_SVGS} SVGs). Material Symbols has about five times as many icons, but one design language.`,
  ],
  faq: [
    { q: 'Is Material Symbols free for commercial use?', a: 'Yes. Google publishes Material Symbols under the Apache License 2.0, which allows commercial use. Google says attribution is appreciated (for example on an app’s about screen) but not required.' },
    { q: 'What is the difference between Material Icons and Material Symbols?', a: 'Material Symbols is Google’s current set, introduced in 2022, built on a variable font with adjustable fill, weight, grade and optical size. The older Material Icons set is no longer updated, according to Google’s GitHub repository.' },
    { q: 'What is the Material Symbols name for the heart, trash and user icons?', a: 'Material Symbols names icons by what they do. The heart is “favorite”, the trash can is “delete”, the user is “person” and the bell is “notifications”. In with icons they are simply heart, trash, user and bell, and search also understands everyday words like “bin” or “gear”.' },
    { q: 'Can I use Material Symbols in PowerPoint or Google Slides?', a: 'Yes. Google’s icon browser lets you download each symbol as SVG or PNG, which you can insert into slides. with icons also offers a Copy image button, so you can paste an icon straight into a slide in any colour.' },
    { q: 'Does with icons have a filled version like Material’s Fill setting?', a: `Yes. The Solid style is the filled version of every icon, and Duo adds a soft tinted fill under the outline. Because all ${N_STYLES} styles come from one drawing, the filled and outlined versions always line up.` },
    { q: 'Will my app look like a Google app if I use Material Symbols?', a: 'It can. Material Symbols is designed to match Google’s Material Design, so people often recognise the style. That is great for Android apps and less great if you want a distinct brand. Picking the Rounded or Sharp style and adjusting weight helps a little.' },
  ],
  sources: [
    { title: 'Google Fonts: Material Symbols guide (count, axes, licence, loading, font size)', url: 'https://developers.google.com/fonts/docs/material_symbols' },
    { title: 'google/material-design-icons on GitHub (licence, attribution, legacy set, the SVGs shown here)', url: 'https://github.com/google/material-design-icons' },
    { title: 'Google Fonts icon browser (icon names, SVG and PNG downloads)', url: 'https://fonts.google.com/icons' },
    { title: 'Google Design MCP overview', url: 'https://developers.google.com/design-mcp/overview' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">Material Symbols vs with icons, in one breath: use Google’s Material Symbols if your app follows Material Design or Android and you want over 2,500 icons with adjustable fill and weight. Use ${L.icons('with icons')} if you want everyday icons that look like your own brand, in ${N_STYLES} matching styles, ready to copy into slides, docs and websites. Both are free for commercial use, and neither asks for a credit.</span>`)}
${p('If you have used an Android phone, you have seen Material Symbols thousands of times. So when should you use something else? Here are the trade-offs, without the jargon.')}

${h2('How do Material Symbols and with icons compare?')}
${table(['', 'with icons', 'Material Symbols'], [
  ['Made by', 'The with icons team (Powered by Evergrow)', 'Google'],
  ['Price', yes('Free'), yes('Free')],
  ['Licence', yes('MIT, no credit needed'), yes('Apache 2.0, credit appreciated but not required')],
  ['Number of icons', `${N_ICONS} icons × ${N_STYLES} styles = ${N_SVGS} SVGs`, 'Over 2,500 icons'],
  ['Styles', yes(`${N_STYLES}: line, solid and duo for interfaces, plus ${N_CREATIVE} creative styles such as glass, pixel, retro and luxe`), meh('3: Outlined, Rounded, Sharp, plus adjustable fill and weight')],
  ['Colour', yes('20-30 hand-picked palettes per icon for the multi-colour styles'), meh('One colour at a time')],
  ['Look', yes('Neutral, not tied to one company'), meh('Google’s Material Design look')],
  ['Main format', 'SVG files, components and CSS classes', 'A variable icon font, plus SVG and PNG downloads'],
  ['Slides and docs', yes('Copy image, PNG and SVG downloads in any colour'), yes('SVG and PNG downloads')],
  ['Help for AI assistants', yes('llms.txt, agent skill, MCP server'), yes('Google’s Design MCP uses Material Symbols by default')],
], 'with icons and Material Symbols, side by side (checked October 2026)')}

${h2('What do Material Symbols look like next to with icons?')}
${p('Twelve everyday icons: ours on top, Google’s real Material Symbols (from its official GitHub repository) underneath, each with its name.')}
${faceOff('material-symbols', { variant: 'outlined', ourStyle: 'line', caption: 'Our line style above Material’s Outlined style. Notice the names first: Material calls the heart <code>favorite</code>, the trash can <code>delete</code>, the bell <code>notifications</code> and the user <code>person</code>. Then notice the drawing: Material’s icons sit a little smaller inside their square with slightly heavier lines, while ours fill more of the space with softer, rounded line ends.' })}
${faceOff('material-symbols', { variant: 'filled', ourStyle: 'solid', concepts: ['home', 'search', 'bell', 'heart', 'calendar', 'download'], caption: 'Filled versions: our solid style against Material’s Outlined style with Fill turned on. A few Material icons, like search and download, stay as outlines when filled, while every with icons solid icon gets a filled shape.' })}

${h2('What are Material Symbols, in plain words?')}
${p('Material Symbols is Google’s official icon collection, made to go with Material Design, the visual language behind Android and most Google products. Google describes it as a collection of over 2,500 icons, and it is free for anyone to use.')}
${p('It comes in three styles. <strong>Outlined</strong> is the clean default. <strong>Rounded</strong> has soft corners and feels a bit friendlier. <strong>Sharp</strong> has crisp square corners and feels more serious. Every icon exists in all three. There is also an older set called Material Icons, which Google stopped updating in 2022 when Material Symbols arrived, so for anything new, Material Symbols is the one to look at.')}

${h2('What is a variable font, and why does Google use one?')}
${p('Here is the clever bit. Material Symbols is delivered mainly as a <strong>font</strong>: a file your website loads, where each “letter” is an icon. You type a name like <code>home</code> or <code>favorite</code> inside a special tag and the browser swaps the word for the picture you saw in the face-off above.')}
${p('And it is a <em>variable</em> font, which means it has built-in sliders. Instead of downloading a separate file for every variation, you turn dials:')}
${ul([
  '<strong>Fill</strong>: outline (0) or completely filled (1).',
  '<strong>Weight</strong>: line thickness, from thin (100) to bold (700).',
  '<strong>Grade</strong>: small thickness tweaks, handy for dark backgrounds, roughly from -50 to 200.',
  '<strong>Optical size</strong>: fine-tunes the drawing for small or large use, from 20 to 48.',
])}
${p('For app designers this is genuinely great.')}
${callout('note', 'The full variable font is heavy. Google’s own guide shows the default download at around 295 KB, and up to several megabytes with every slider included. It also shows how to ask for just the icons and settings you use, which brings it down to a few kilobytes. Worth doing if you go the font route.')}

${h2('How is with icons different?')}
${p(`with icons takes the opposite path. Instead of one design language with sliders, we drew <strong>${N_ICONS} everyday icons</strong> once each on a 24 × 24 grid, then rendered every drawing into <strong>${N_STYLES} styles</strong> that feel very different from each other. You do not tweak dials; you pick a mood. Compare the two families below.`)}
${rivalStyles('material-symbols', ['home', 'heart', 'star', 'bell', 'settings'], 'Material Symbols’ real styles for five icons. Outlined, Rounded and Sharp are close cousins: the corners change, the character stays Google’s.')}
${styleRow('settings')}
${p(`${L.style('line')}, ${L.style('solid')} and ${L.style('duo')} are the three everyday interface styles, made for apps and websites. The other ${N_CREATIVE} are creative styles, more like small illustrations: frosted ${L.style('glass')}, 16-bit ${L.style('pixel')}, 70s ${L.style('retro')}, cute ${L.style('kawaii')} and gold-and-enamel ${L.style('luxe')}, among others. Use them for hero sections, presentations and posters, at 32px or larger. Each icon also comes with 20 to 30 hand-picked colour palettes that recolour every multi-colour style at once.`)}
${stats([[`${N_ICONS}`, 'icons, hand-drawn once'], [`${N_STYLES}`, 'styles from each drawing'], [N_SVGS, 'matching SVG files'], ['0', 'credits or sign-ups needed']])}

${h2('Will Material Symbols make my product look like a Google app?')}
${p('Material Symbols is beautiful, but it is also very recognisable. If your app is for Android, that is a plus: people feel at home. If you are building a brand of your own, a bakery website, a fintech dashboard, a school portal, it can make your product feel a little like a Google template.')}
${p('with icons is not tied to any company’s design system. The line style is calm and neutral, and the duo style adds a soft colour tint that makes dashboards feel warmer without shouting.')}
${iconGrid(['layout-dashboard', 'chart-pie', 'wallet', 'calendar-check', 'users', 'bell'], 'duo', 'A friendly dashboard menu in the duo style. The soft tint is part of the icon, so it works without extra design work.')}
${figure('mat1', 'On Android, Material icons feel native. On your own brand’s website or slides, you may want something that feels like you.')}

${h2('Are Material Symbols and with icons free for commercial use?')}
${p('Yes, and this is a happy part of the comparison: neither set has a paid tier, and neither makes you add a visible credit.')}
${h3('Material Symbols: Apache 2.0')}
${p('Apache 2.0 is a well-known open-source licence. You can use the icons in apps, websites, client work and products you sell. Google says it would love a mention in your app’s about screen, but that this is not required. If you redistribute the icon files themselves, keep the licence text with them.')}
${h3('with icons: MIT')}
${p(`MIT is one of the shortest and most relaxed licences there is. Use the icons anywhere, commercially or not, and never show a credit. If you share the source files, keep the licence file with them. The details are on our ${L.page('license.html', 'license page')}, and our guide ${L.post('free-icons-commercial-use', 'to using free icons commercially')} explains the common licences side by side.`)}

${h2('Which is easier for slides and documents?')}
${p('Many people searching for icons are making a pitch deck, a report or a Canva poster, not an app. Google’s icon browser lets you pick a symbol, adjust its settings and download it as SVG or PNG. It works well, although you get one colour at a time and then insert the file.')}
${p(`with icons was built with this crowd in mind. Every icon page has a <strong>Copy image</strong> button, so you can paste straight into a slide, plus PNG downloads in any size and colour and an SVG download. We also wrote step-by-step guides for ${L.guide('powerpoint', 'PowerPoint')}, ${L.guide('google-slides', 'Google Slides')}, ${L.guide('canva', 'Canva')}, ${L.guide('notion', 'Notion')} and more.`)}
${steps([
  ['Search in plain words', `Open ${L.icons('the library')} and type what you mean, like “money”, “team” or “bin”.`],
  ['Choose a style and colour', 'Gloss or sketch for a title slide, line for a tidy agenda slide.'],
  ['Copy and paste', 'Press Copy image, then paste into your slide. That is it.'],
])}

${h2('Which is easier on a website or in an app?')}
${p('With Material Symbols, the classic setup is to load the font from Google and write the icon’s name inside a tag, for example <code>&lt;span class="material-symbols-outlined"&gt;favorite&lt;/span&gt;</code> for the heart in the face-off above. It is quick, but most React and Vue packages for Material Symbols come from the community, since Google mainly ships the font and the files.')}
${p('with icons offers plain SVG code on every icon page today, a simple class pattern (<code>&lt;i class="with with-heart"&gt;</code>), a <code>&lt;with-icon&gt;</code> web component and components for React, Vue, Svelte, Angular and Solid. To be upfront: the npm packages and CDN are launching soon. Until then, copy the SVG from any icon page and paste it into your code.')}

${h2('Which works better with AI assistants?')}
${p(`If you ask an AI assistant to build a page, it needs to know real icon names. Google offers a Design MCP server (a plug-in that gives AI tools access to Google’s design resources), and its icon support defaults to Material Symbols. with icons has its own ${L.page('ai.html', 'MCP server, llms.txt and agent skill')}, so assistants can search the actual ${N_ICONS} icons instead of guessing. Our post on ${L.post('ai-assistants-and-icons', 'AI assistants and icons')} goes deeper.`)}

${h2('What are the pros and cons of Material Symbols and with icons?')}
${p('Tables are handy, but they hide the “why”. Here is each set’s honest strong and weak side, in plain words, including ours.')}
${prosCons('Material Symbols', {
  lib: 'material-symbols',
  pros: [
    ['A huge catalogue', `Google lists over 2,500 icons, about five times our ${N_ICONS}. If you need a rare idea, like a specific device or a settings screen detail, it is probably there.`],
    ['Sliders built in', 'The variable font lets you change fill, weight, grade and size without new files. A tab icon can switch smoothly from outline to filled when someone taps it.'],
    ['Three styles for every icon', 'Outlined, Rounded and Sharp each cover the whole set, so you can soften or sharpen your app without swapping libraries.'],
    ['Free, with no credit required', 'The Apache 2.0 licence allows commercial use. Google appreciates a mention but does not require one.'],
    ['Feels native on Android', 'Because it is Google’s own design language, Android users recognise it instantly, and Google’s Design MCP uses it by default.'],
  ],
  cons: [
    ['It looks like Google', 'The style is so familiar that your product can feel like a Google template rather than its own brand.'],
    ['The full font is heavy', 'Google’s guide shows around 295 KB for the default font and several megabytes with every slider. You can trim it, but that is an extra step.'],
    ['Words can flash before icons', 'While the font loads, visitors may briefly see “favorite” or “delete” as text instead of the icon. Google’s guide explains a setting that hides it, but you have to apply it.'],
    ['One mood, three variations', 'Outlined, Rounded and Sharp are close relatives. There is no hand-drawn, glossy or illustrated option for slides and posters.'],
  ],
})}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} real styles from one drawing`, `Line, solid and duo for apps, plus ${N_CREATIVE} creative styles, from glass and sketch to pixel, retro and luxe, for slides and hero sections. They always match because they share one drawing.`],
    ['No credit, ever', 'The MIT licence lets you use the icons in personal and commercial work without showing a credit line anywhere.'],
    ['Made for slides and docs', 'Every icon page has Copy image, plus PNG downloads in any size and colour and an SVG download, with guides for PowerPoint, Canva and more.'],
    ['Search in everyday words', 'Type “bin” and you get trash, type “gear” and you get settings. You do not need to learn names like <code>delete</code> or <code>favorite</code>.'],
    ['A neutral look', 'The icons are not tied to any company’s design system, so they take on your brand’s colours and personality.'],
  ],
  cons: [
    ['A smaller catalogue', `With ${N_ICONS} icons, we cover everyday needs well, but rare or very technical ideas may be missing. We also have no brand logos.`],
    ['Packages are not live yet', 'The npm packages and CDN for developers are launching soon. Today you copy SVG code or download files from each icon page.'],
    ['Newer, with a smaller community', 'Material Symbols has years of tutorials and community add-ons. with icons is younger, so there are fewer answers online for now.'],
    ['Creative styles need room', `The ${N_CREATIVE} creative styles, like gloss, glass and pixel, are made for 32px and larger. For tiny interface icons, stick to line, solid or duo.`],
  ],
})}
${p('Who each suits: Material Symbols fits Android apps, Material Design projects and teams who need a very wide catalogue with live sliders. with icons fits founders, marketers, teachers and small product teams who want everyday icons that look like their own brand across a website, a dashboard and a slide deck.')}

${verdict({
  a: ['with icons', ['You want a look that belongs to your brand, not to Google.', `You want ${N_STYLES} styles, from calm line to glossy, pixel and hand-drawn, that always match.`, 'You make slides, docs and websites and want one-click Copy image, PNG and SVG.', 'You want a small, easy-to-browse set with plain MIT terms.']],
  b: ['Material Symbols', ['You build for Android or follow Material Design closely.', 'You need more than 2,500 icons from a single maker.', 'You want a variable font with adjustable fill and weight.']],
})}

${h2('How do I switch from Material Symbols to with icons?')}
${p(`Start with the icons you use most. Our ${L.alt('material-symbols', 'Material Symbols alternative page')} has a name map (like <code>favorite</code> to ${L.icon('heart')} and <code>delete</code> to ${L.icon('trash')}), and the face-off above shows how each pair looks. Then pick one style for your interface, usually line, and keep the creative styles for slides and banners. Our ${L.post('icon-styles-explained', 'guide to icon styles')} helps you choose.`)}
${cta(`See all ${N_STYLES} styles for yourself`, `${N_ICONS} free icons, ${N_STYLES} styles, MIT licensed. Copy one into your slide or code in seconds, no account needed.`, ['settings', 'smartphone', 'palette', 'sliders', 'sparkles', 'star'])}
`,
}
