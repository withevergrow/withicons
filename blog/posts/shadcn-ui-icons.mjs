import { p, h2, h3, ul, figure, iconGrid, sizeRamp, table, yes, meh, callout, steps, verdict, doDont, code, cta, faceOff, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'shadcn-ui-icons',
  category: 'guides',
  date: '2026-11-06',
  hero: 'h-shadcn-ui-icons',
  stickers: [['swap', 'duo'], ['sliders', 'line'], ['blocks', 'gloss']],
  title: 'shadcn icons: how to change the icon library in shadcn/ui',
  cardTitle: 'How to change shadcn/ui icons',
  h1: 'shadcn icons: how to <em>change the icon library</em> in shadcn/ui',
  dek: 'shadcn/ui comes with Lucide, and that is a fine default. Here is what the iconLibrary setting really does, how to swap icons in components you already copied, and how to keep sizes and line weights tidy when you do.',
  description: 'How shadcn/ui picks its icons, what iconLibrary in components.json supports, how to swap icons in copied components, and how to keep size and stroke consistent.',
  keywords: ['shadcn icons', 'change icons in shadcn/ui', 'shadcn iconLibrary', 'lucide alternative for shadcn', 'shadcn migrate icons', 'components.json iconLibrary', 'shadcn tabler icons', 'shadcn phosphor icons'],
  about: ['shadcn/ui', 'Icon library', 'Lucide', 'React (software)', 'Tailwind CSS'],
  related: ['with-icons-vs-lucide', 'best-react-icon-libraries', 'consistent-icons'],
  tldr: [
    'shadcn/ui uses <strong>Lucide</strong> (<code>lucide-react</code>) by default. The default preset sets <code>"iconLibrary": "lucide"</code> in your <code>components.json</code>.',
    '<code>iconLibrary</code> tells the shadcn CLI which icons to write into components when you run <code>add</code>. It supports <code>lucide</code>, <code>tabler</code>, <code>hugeicons</code>, <code>phosphor</code> and <code>remixicon</code>.',
    'To switch components you already copied, run <code>npx shadcn@latest migrate icons</code>. It rewrites the imports in your <code>ui</code> folder, installs the new library and updates <code>components.json</code>.',
    'shadcn sizes icons with CSS (usually <code>size-4</code>, 16px) and Lucide draws a 2px stroke. Keep both in mind when you switch, or your icons will look slightly off.',
    `Other libraries, including with icons (${N_ICONS} icons in ${N_STYLES} styles), are not on the iconLibrary list, so you swap them by hand. For many apps, keeping Lucide is the right call.`,
  ],
  faq: [
    { q: 'What icons does shadcn/ui use?', a: 'Lucide, through the lucide-react package. The shadcn CLI’s default preset sets "iconLibrary": "lucide" in components.json, and the components import icons such as CheckIcon, ChevronDownIcon and XIcon from lucide-react. Some newer presets pick Hugeicons or Phosphor instead.' },
    { q: 'What values does iconLibrary support in components.json?', a: 'The shadcn CLI docs list lucide, tabler, hugeicons, phosphor and remixicon, plus radix as a legacy option for the migrate command. The schema accepts any string, but the CLI only knows how to write icons for those libraries.' },
    { q: 'How do I change the icons in shadcn/ui?', a: 'Run npx shadcn@latest migrate icons and pick the source and target libraries, or pass --from lucide --to tabler. It rewrites icon imports and JSX in your ui folder, installs the new package and updates iconLibrary, so later npx shadcn add commands use the new library. Icons with no match are left alone and listed at the end.' },
    { q: 'Can I use an icon library that is not on the iconLibrary list?', a: 'Yes, by hand. shadcn/ui copies component code into your project, so you can change any import yourself. Replace the lucide-react import in each component with your library and check the icon names. A small icons file that re-exports your icons makes later changes a one-file job.' },
    { q: 'Why do my icons look thinner or thicker after switching?', a: 'Different sets use different stroke widths. Lucide draws 2px lines, Tabler uses a stroke prop that defaults to 2, Phosphor uses weights, and the with icons line style uses 1.75px. At shadcn’s usual 16px size the difference is small but visible next to other icons, so pick one weight and use it everywhere.' },
    { q: 'Should I switch away from Lucide in shadcn/ui?', a: 'Only if you have a reason: you need icons Lucide lacks, you want filled or multi-weight versions, or you want a different look. Otherwise Lucide is well made, fully supported by the CLI and needs no work.' },
  ],
  sources: [
    { title: 'shadcn/ui CLI docs (init defaults, migrate icons, supported libraries)', url: 'https://ui.shadcn.com/docs/cli' },
    { title: 'shadcn/ui manual installation (components.json with iconLibrary)', url: 'https://ui.shadcn.com/docs/installation/manual' },
    { title: 'shadcn/ui components.json docs', url: 'https://ui.shadcn.com/docs/components-json' },
    { title: 'shadcn/ui components.json schema (iconLibrary)', url: 'https://ui.shadcn.com/schema.json' },
    { title: 'shadcn CLI 4.23.0 source (presets and their icon libraries)', url: 'https://unpkg.com/shadcn@4.23.0/dist/index.js' },
    { title: '@shadcn/registry 0.2.1 icon library map (packages per iconLibrary value)', url: 'https://unpkg.com/@shadcn/registry@0.2.1/dist/chunk-HLMZ34OQ.js' },
    { title: 'shadcn/ui Button source (icon sizing with size-4)', url: 'https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button.tsx' },
    { title: 'shadcn/ui Dropdown Menu registry item (lucide-react icons)', url: 'https://ui.shadcn.com/r/styles/new-york-v4/dropdown-menu.json' },
    { title: 'Lucide React: getting started (size 24, strokeWidth 2)', url: 'https://lucide.dev/guide/react/getting-started' },
    { title: 'Lucide README (ISC)', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'lucide.dev (icon count shown on the site)', url: 'https://lucide.dev/' },
    { title: 'Tabler Icons README (icon count, MIT)', url: 'https://github.com/tabler/tabler-icons' },
    { title: '@tabler/icons-react README (stroke prop)', url: 'https://github.com/tabler/tabler-icons/tree/main/packages/icons-react' },
    { title: 'npm: @hugeicons/react (6,000+ free icons)', url: 'https://www.npmjs.com/package/@hugeicons/react' },
    { title: '@phosphor-icons/react README (weights)', url: 'https://github.com/phosphor-icons/react' },
    { title: 'Remix Icon README (3200+ icons)', url: 'https://github.com/Remix-Design/RemixIcon' },
    { title: 'Remix Icon License v1.0', url: 'https://github.com/Remix-Design/RemixIcon/blob/master/License' },
    { title: 'npm: @withicons/react 0.6.0 README', url: 'https://www.npmjs.com/package/@withicons/react' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">shadcn/ui uses Lucide icons by default. The <code>iconLibrary</code> field in <code>components.json</code> tells the shadcn CLI which icon set to write into components when you add them, and today it supports Lucide, Tabler, Hugeicons, Phosphor and Remix Icon. To change components you already have, run <code>npx shadcn@latest migrate icons</code>, or swap the imports by hand for any other library, ${L.icons('with icons')} included.</span>`)}
${p('shadcn/ui is a popular way to build React interfaces. Instead of installing a component package, you copy each component’s code into your own project and change it as you like. That matters for icons: because the code is yours, you can swap every icon. You just need to know where they come from.')}
${callout('note', `We make with icons, which is not on the iconLibrary list. We cover every option fairly and say when switching is not worth it. shadcn behaviour and competitor facts were checked in November 2026 against the shadcn docs, its CLI source and each library’s README (links at the bottom).`, 'Who wrote this')}

${h2('Why does shadcn/ui use Lucide icons?')}
${p('When you start a project with <code>npx shadcn@latest init</code> and the defaults, the CLI uses its Nova preset, which pairs Lucide with the Geist font. It writes <code>"iconLibrary": "lucide"</code> into <code>components.json</code> and installs <code>lucide-react</code>. Some newer presets choose differently: Maia and Mira use Hugeicons, Lyra uses Phosphor.')}
${p(`The shadcn docs do not explain the choice, but Lucide is an easy fit: over 2,000 clean outline icons on a 24 × 24 grid with 2px strokes, an ISC licence, typed React components, and names that read well in code (<code>CheckIcon</code>, <code>ChevronDownIcon</code>, <code>XIcon</code>). Our ${L.post('with-icons-vs-lucide', 'with icons vs Lucide')} post looks at it in detail.`)}
${faceOff('lucide', { concepts: ['home', 'search', 'settings', 'bell', 'trash', 'calendar'], caption: 'Real Lucide icons, the shadcn default, under our line icons. Lucide’s 2px stroke reads a little heavier than our 1.75px line.' })}

${h2('What does iconLibrary in components.json do?')}
${p('<code>components.json</code> is the small settings file the shadcn CLI reads in your project. The <code>iconLibrary</code> line in it looks like this:')}
${code(`{
  "style": "new-york",
  "rsc": true,
  "iconLibrary": "lucide"
}`, 'json')}
${p('It does one job. In the current shadcn styles, each component names its icons once per supported library: the Dialog’s close button lists <code>XIcon</code> for Lucide, <code>IconX</code> for Tabler, <code>Cancel01Icon</code> for Hugeicons and <code>RiCloseLine</code> for Remix Icon. When you run <code>npx shadcn@latest add dialog</code>, the CLI reads <code>iconLibrary</code>, keeps the matching name, writes the import and installs the package. (Older styles such as new-york import <code>lucide-react</code> directly.) It does not touch files you already have, and your app never reads <code>components.json</code> at runtime.')}
${table(['Value', 'Package it installs', 'Free icons', 'Licence'], [
  ['<code>lucide</code> (default)', '<code>lucide-react</code>', 'Over 2,000, one outline style', yes('ISC')],
  ['<code>tabler</code>', '<code>@tabler/icons-react</code>', 'Over 6,200, outline + filled', yes('MIT')],
  ['<code>hugeicons</code>', '<code>@hugeicons/react</code> + <code>@hugeicons/core-free-icons</code>', '6,000+, one rounded style', yes('MIT (free set)')],
  ['<code>phosphor</code>', '<code>@phosphor-icons/react</code>', 'About 1,500, in 6 weights', yes('MIT')],
  ['<code>remixicon</code>', '<code>@remixicon/react</code>', '3,200+, outline + filled', meh('Remix Icon License: no credit needed, but no reselling icons or using them as logos')],
], 'The iconLibrary values the shadcn CLI understands (checked November 2026). The migrate command also accepts radix (Radix Icons) as a legacy source.')}
${p(`The JSON schema accepts any text, but the CLI only knows these five. Writing <code>"withicons"</code> or <code>"heroicons"</code> there will not make <code>add</code> install those icons. For a wider look at the options, see our guide to ${L.post('best-react-icon-libraries', 'the best React icon libraries')}.`)}

${h2('How do you change the icon library in shadcn/ui?')}
${p('If your new library is one of the five, the CLI does almost all of the work. Commit your code first, so you can see exactly what changed.')}
${steps([
  ['Commit or stash your changes', 'The migration edits files in place. A clean git state lets you review the diff and undo it in one step.'],
  ['Run the migration', 'Run <code>npx shadcn@latest migrate icons</code> and choose the source and target libraries, or skip the questions with <code>--from lucide --to tabler --yes</code>.'],
  ['Let it rewrite your ui folder', 'It changes icon imports and JSX in your <code>ui</code> directory, installs the target package and sets <code>iconLibrary</code>, so later <code>npx shadcn add</code> commands use the new library too.'],
  ['Read the leftovers list', 'Icons with no match in the new library are left untouched and listed at the end. Replace those by hand with the nearest icon.'],
  ['Fix your own files', 'The migration covers your <code>ui</code> folder. Icons in your own pages and features need the same swap, or you can pass a path or glob, like <code>"src/components/**"</code>. Scoped runs do not update <code>components.json</code>.'],
])}
${figure('wire4', 'Swapping icons is a small job when you plan it: list the screens, change one area at a time, and check each one by eye.')}

${h2('How do you swap icons in components you already copied?')}
${p('For any library outside the five, you swap by hand. It is less work than it sounds, because the built-in components only use a handful of icons: checks, chevrons, a circle, a close button, a spinner and a sidebar toggle.')}
${p('The neatest way is one small file that re-exports the icons you use, under the names your components expect. Then every component imports from that file, and changing library later means editing just one file. Here is what that looks like with with icons:')}
${code(`// components/icons.ts
export { CheckIcon, ChevronDownIcon, ChevronRightIcon, CircleIcon } from '@withicons/react'
export { CloseIcon as XIcon } from '@withicons/react'
export { LoaderCircleIcon as Loader2Icon } from '@withicons/react'
export { SidebarIcon as PanelLeftIcon } from '@withicons/react'`, 'ts')}
${p('Then, in each component, change <code>from "lucide-react"</code> to <code>from "@/components/icons"</code>. Most names match already, because with icons exports every icon as both <code>Check</code> and <code>CheckIcon</code>. Only a few names differ, like Lucide’s <code>XIcon</code>, which is our <code>CloseIcon</code>.')}
${iconGrid(['check', 'chevron-down', 'circle', 'close', 'loader-circle', 'sidebar'], 'line', 'The with icons line versions of the icons shadcn’s built-in components use most: check, chevron, circle, close, loader and sidebar.')}

${h2('How do you keep icon size and stroke width consistent with shadcn?')}
${h3('Size: let shadcn’s CSS do it')}
${p('shadcn components size icons with CSS rather than props. The Button, for example, gives any SVG inside it <code>size-4</code> (16px) unless the icon already has a <code>size-</code> class, and smaller buttons use <code>size-3</code>. CSS beats the width and height an icon component sets, so any SVG icon library follows these rules automatically. To make one icon bigger, add a class like <code>size-5</code>, just as you would with Lucide.')}
${sizeRamp(['check', 'chevron-down', 'close', 'search'], [12, 16, 20, 24], 'line', 'shadcn’s usual icon sizes, from size-3 (12px) to size-6 (24px). Most components use 16px.')}
${h3('Stroke: pick one weight')}
${p('This is where switching shows. shadcn never sets a stroke width, so with Lucide you get its default 2px line. Tabler also defaults to 2 (through a <code>stroke</code> prop), Phosphor uses named weights instead, and our line style uses 1.75. At 16px, a 2px line on a 24px grid draws about 1.3 pixels; 1.75 draws about 1.2. You will not notice that alone, but you will next to a different set.')}
${doDont('<p>Choose one stroke width for the whole app. If you replace every icon, keep the new library’s default. If some Lucide icons stay, set <code>strokeWidth={2}</code> on the new ones so they match.</p>', '<p>Leave a 2px Lucide chevron next to a lighter icon from another set in the same toolbar. The difference is small, but it makes the toolbar look unfinished.</p>')}

${h2('Can you use with icons in shadcn/ui?')}
${p(`Yes. <code>@withicons/react</code> works the way shadcn expects. Icons use <code>currentColor</code>, so classes like <code>text-muted-foreground</code> colour them. They take <code>className</code>, <code>size</code>, <code>color</code> and <code>strokeWidth</code>, like Lucide. And they are plain components with no hooks or context, so they render in Server Components without <code>'use client'</code>.`)}
${code(`npm i @withicons/react

import { CheckIcon } from '@withicons/react'
import { HomeIcon } from '@withicons/react/solid'

<CheckIcon className="size-4" strokeWidth={2} />
<HomeIcon className="size-4" />`, 'tsx')}
${p(`What you gain is the other styles. The same icons come in ${N_STYLES} styles, so a sidebar can show the active page in solid and the rest in line, or a dashboard card can use the soft ${L.style('duo')}. Every style is its own import path, such as <code>@withicons/react/solid</code>.`)}
${iconGrid(['home', 'inbox', 'calendar', 'users', 'settings', 'bell'], 'duo', 'An app sidebar in the duo style: the same shapes as line, with a soft tint behind.')}
${p(`The ${L.page('free/icons-for-react.html', 'free React icons page')} and the ${L.page('developers.html', 'developer docs')} cover setup, and every icon page, like the ${L.icon('check', 'check icon')}, has the SVG code to copy if you prefer that.`)}

${h2('Should you switch from Lucide at all?')}
${p('Honestly, most projects should not. Lucide is well drawn, the CLI fully supports it and every shadcn example uses it. A switch costs time, a review of every screen and a few small visual bugs. Do it only for a reason you can name.')}
${verdict({
  title: 'Keep Lucide, or switch?',
  a: ['a switch', ['You keep needing icons Lucide does not have (Tabler has over 6,200).', 'You want weights or a duotone look (Phosphor) or a softer, rounded line (Hugeicons).', `You want solid, tinted and illustrated versions of the same icons (with icons, ${N_STYLES} styles).`, 'You are early in the project, with few screens to check.']],
  b: ['Lucide', ['You like the look and Lucide has the icons you need.', 'You want every shadcn add to just work, with no extra steps.', 'Your app is mostly forms, tables and settings screens.', 'The project is large and a switch would mean weeks of review.']],
})}
${p(`A middle path also works: keep Lucide in the built-in components, and use another set only where it adds something, such as feature sections, empty states or the marketing site. Keep each set to its own area, and set the stroke width to match where they meet. Our guide to ${L.post('consistent-icons', 'keeping icons consistent')} has more tips.`)}
${cta('See every icon in every style', `${N_ICONS} icons in ${N_STYLES} styles, ${N_SVGS} SVGs. Copy the SVG, download a PNG or install the React package. MIT licensed.`, ['swap', 'sliders', 'blocks', 'check', 'sparkles', 'palette'])}
`,
}
