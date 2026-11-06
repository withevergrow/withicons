import { p, h2, h3, ul, figure, iconGrid, styleRow, table, yes, no, meh, callout, code, cta, faceOff, rivalStyles, prosCons, L, N_ICONS, N_STYLES, N_SVGS } from '../lib/blocks.mjs'

export default {
  slug: 'best-react-icon-libraries',
  category: 'comparisons',
  date: '2026-11-06',
  hero: 'h-best-react-icon-libraries',
  stickers: [['code', 'duo'], ['component', 'gloss'], ['layers', 'solid']],
  title: 'The best React icon library in 2026: 10 libraries compared',
  cardTitle: 'The best React icon libraries',
  h1: 'The best React icon library in 2026: <em>10 libraries</em>, compared',
  dek: 'lucide-react, react-icons, Heroicons, Phosphor, Tabler, MUI and more, side by side: how many icons you get, how you import them, how they behave in Next.js, and which one suits your app.',
  description: 'The best React icon library in 2026: lucide-react, react-icons, Heroicons, Phosphor, Tabler, MUI and more, compared on icons, styles, imports and Next.js.',
  keywords: ['best react icon library', 'react icons', 'lucide-react vs react-icons', 'icon library for next.js', 'react icon components', 'tree-shaking icons react', 'react server components icons'],
  about: ['React (software)', 'Icon library', 'Next.js', 'Lucide', 'React Icons', 'Tabler Icons', 'Phosphor Icons'],
  related: ['with-icons-vs-lucide', 'best-free-icon-libraries', 'with-icons-vs-heroicons'],
  tldr: [
    '<strong>Best default for most React apps:</strong> lucide-react. Over 2,000 clean outline icons, ISC licence, typed, tree-shakable, and the default in shadcn/ui.',
    '<strong>Most free MIT icons:</strong> Tabler (over 6,200, with filled versions of over 1,000). <strong>Most weights:</strong> Phosphor (6). <strong>Tailwind projects:</strong> Heroicons (316 icons, 4 sizes).',
    '<strong>react-icons</strong> bundles 31 icon sets in one package. Handy for prototypes, but each set keeps its own licence (some need a credit) and the bundled copies can lag behind the originals.',
    '<strong>Next.js App Router:</strong> Heroicons, Tabler and with icons are plain components that render on the server. Phosphor has a <code>/ssr</code> entry, lucide-react 1.x and MUI icons are client components, and Iconify draws in the browser only.',
    `<strong>One family in many looks:</strong> with icons (our set) has ${N_ICONS} icons in ${N_STYLES} styles, ${N_SVGS} SVGs, MIT. Fewer icons than Tabler, Phosphor or Lucide.`,
  ],
  faq: [
    { q: 'What is the best icon library for React?', a: 'For most apps, lucide-react: over 2,000 consistent outline icons, typed and tree-shakable, ISC licensed, and the default in shadcn/ui. Pick Tabler if you need the most free MIT icons, Phosphor for six weights, Heroicons for Tailwind projects, MUI icons for Material UI apps and Font Awesome for brand logos.' },
    { q: 'lucide-react vs react-icons: which is better?', a: 'lucide-react is one consistent set, maintained by its own team and always current. react-icons wraps 31 different sets (including an older copy of Lucide) behind one install. Use lucide-react for a product UI that should look consistent, and react-icons when you want to borrow icons from many sets during a prototype. Check each set’s licence in react-icons, because some, like Font Awesome and Game Icons, are CC BY.' },
    { q: 'Which React icon library works best with the Next.js App Router?', a: 'Libraries made of plain components with no React context render in Server Components with no setup: Heroicons, Tabler and with icons. Phosphor works when you import from @phosphor-icons/react/ssr. lucide-react 1.x and MUI icons are marked as client components, which works but sends their code to the browser. Font Awesome needs a small CSS setup in your root layout, and Iconify renders only in the browser.' },
    { q: 'Which React icon library has the most icons?', a: 'Iconify gives access to over 300,000 icons from more than 200 sets, loaded from its API. Among single sets, Tabler (over 6,200, MIT) and Hugeicons Free (6,000+, MIT) are the largest. react-icons bundles 31 sets in one package.' },
    { q: 'Are React icon libraries free for commercial use?', a: 'All ten in this guide allow commercial use. lucide-react is ISC; Heroicons, Phosphor, Tabler, MUI icons, Hugeicons Free and with icons are MIT. Font Awesome Free icons are CC BY 4.0, with the credit already in the files. In react-icons and Iconify, every icon set keeps its own licence.' },
    { q: 'Do React icon libraries make my bundle bigger?', a: 'Only by the icons you use, if you import them by name. lucide-react, react-icons, Phosphor, Tabler, Hugeicons and with icons all document tree-shaking. Avoid importing a whole set as an object or loading every icon for dynamic names unless you really need it.' },
  ],
  sources: [
    { title: 'Lucide README (ISC licence)', url: 'https://github.com/lucide-icons/lucide' },
    { title: 'lucide.dev (icon count shown on the site)', url: 'https://lucide.dev/' },
    { title: 'Lucide icon design specification (24 × 24 grid, 2px stroke)', url: 'https://lucide.dev/contribute/icons/specification' },
    { title: 'Lucide React: getting started (imports, props, tree-shaking)', url: 'https://lucide.dev/guide/react/getting-started' },
    { title: 'Lucide React: migration from v0 (brand icons removed)', url: 'https://lucide.dev/guide/react/migration' },
    { title: 'lucide-react 1.70.0 Icon component source ("use client")', url: 'https://unpkg.com/lucide-react@1.70.0/dist/esm/Icon.mjs' },
    { title: 'react-icons README (31 icon sets, licences, versions)', url: 'https://github.com/react-icons/react-icons' },
    { title: 'Heroicons README (React imports)', url: 'https://github.com/tailwindlabs/heroicons' },
    { title: 'Heroicons website (316 icons)', url: 'https://heroicons.com' },
    { title: '@phosphor-icons/react README (tree-shaking, Next.js, /ssr imports)', url: 'https://github.com/phosphor-icons/react' },
    { title: '@phosphor-icons/core 2.1.1 (icon counts)', url: 'https://unpkg.com/@phosphor-icons/core@2.1.1/' },
    { title: 'Tabler Icons README (icon counts, MIT)', url: 'https://github.com/tabler/tabler-icons' },
    { title: '@tabler/icons-react README (props, TypeScript)', url: 'https://github.com/tabler/tabler-icons/tree/main/packages/icons-react' },
    { title: 'MUI: Material Icons (count, themes, imports, peer dependencies)', url: 'https://mui.com/material-ui/material-icons/' },
    { title: '@mui/icons-material 9.5.0 Home icon source ("use client")', url: 'https://unpkg.com/@mui/icons-material@9.5.0/Home.js' },
    { title: 'Font Awesome docs: set up with React', url: 'https://docs.fontawesome.com/web/use-with/react' },
    { title: 'Font Awesome docs: use React with Next.js', url: 'https://docs.fontawesome.com/web/use-with/react/use-with' },
    { title: 'Font Awesome Free licence (GitHub)', url: 'https://github.com/FortAwesome/Font-Awesome/blob/7.x/LICENSE.txt' },
    { title: 'npm: @hugeicons/react (6,000+ free icons, Pro styles)', url: 'https://www.npmjs.com/package/@hugeicons/react' },
    { title: 'Iconify for React (API loading, client-side rendering, icon count)', url: 'https://iconify.design/docs/icon-components/react/' },
    { title: 'npm: @withicons/react 0.6.0 README', url: 'https://www.npmjs.com/package/@withicons/react' },
    { title: 'with icons license (MIT)', url: 'https://withicons.com/license.html' },
  ],
  body: () => `
${p(`<span class="lede">The best React icon library for most apps is lucide-react: over 2,000 consistent outline icons, typed, tree-shakable and the default in shadcn/ui. Pick Tabler if you need the most free MIT icons, Phosphor for six weights of every icon, Heroicons for a small polished Tailwind set, MUI icons if you already use Material UI, and Font Awesome when you need brand logos. Pick ${L.icons('with icons')} when you want one family of icons in many looks.</span>`)}
${p('A React icon library turns each icon into a component, so you write <code>&lt;Bell /&gt;</code> instead of pasting SVG code. The differences show up in four places: how many icons you get, how many looks, how you import them, and how they behave in the Next.js App Router.')}
${callout('note', `We make with icons, one of the ten libraries below. We have tried to be fair and we say where others are stronger. Every competitor fact comes from the library’s own website, README or npm package, checked in November 2026 (links at the bottom).`, 'Who wrote this')}

${h2('How do the 10 most popular React icon libraries compare?')}
${table(['Library', 'npm package', 'Icons', 'Styles', 'Licence'], [
  ['lucide-react', '<code>lucide-react</code>', 'Over 2,000', '1 outline (stroke adjustable)', yes('ISC')],
  ['react-icons', '<code>react-icons</code>', '31 bundled sets', 'Whatever each set has', meh('MIT package; each set keeps its own')],
  ['Heroicons', '<code>@heroicons/react</code>', '316', '4 (outline, solid, mini, micro)', yes('MIT')],
  ['Phosphor', '<code>@phosphor-icons/react</code>', 'About 1,500', '6 weights', yes('MIT')],
  ['Tabler Icons', '<code>@tabler/icons-react</code>', 'Over 6,200', '2 (outline, filled for over 1,000)', yes('MIT')],
  ['MUI icons', '<code>@mui/icons-material</code>', 'Over 2,000', '5 themes', yes('MIT')],
  ['Font Awesome', '<code>@fortawesome/react-fontawesome</code>', 'Over 2,000 free', '3 free (solid, regular, brands)', meh('Icons CC BY 4.0, credit in the files')],
  ['Hugeicons', '<code>@hugeicons/react</code>', '6,000+ free', '1 free (10 in Pro)', yes('MIT (free set)')],
  ['Iconify', '<code>@iconify/react</code>', 'Over 300,000 from 200+ sets', 'Whatever each set has', meh('MIT component; each set keeps its own')],
  ['with icons', '<code>@withicons/react</code>', `${N_ICONS}`, `${N_STYLES} (3 interface + ${N_STYLES - 3} creative)`, yes('MIT')],
], 'Ten React icon libraries at a glance (checked November 2026). MUI’s icon search listed 2,164 icons.')}
${p(`If you want the same comparison without the React angle, our ${L.post('best-free-icon-libraries', 'guide to the best free icon libraries')} covers slides, docs and design tools too.`)}

${h2('How do you import icons in each React library?')}
${p('Every library here lets you import one icon at a time, and modern bundlers (Vite, webpack in Next.js, Rollup, esbuild) then drop the icons you never use. That is called tree-shaking. The import style is what you will type every day, so it is worth a look.')}
${table(['Library', 'How you import', 'Next.js App Router'], [
  ['lucide-react', '<code>import { House } from \'lucide-react\'</code>', meh('Works; 1.x icons are client components')],
  ['react-icons', '<code>import { LuHouse } from \'react-icons/lu\'</code>', meh('Works; <code>IconContext</code> needs a client component')],
  ['Heroicons', '<code>import { HomeIcon } from \'@heroicons/react/24/outline\'</code>', yes('Plain server-friendly components')],
  ['Phosphor', '<code>import { HouseIcon } from \'@phosphor-icons/react\'</code>', meh('Use <code>@phosphor-icons/react/ssr</code> on the server')],
  ['Tabler Icons', '<code>import { IconHome } from \'@tabler/icons-react\'</code>', yes('Plain server-friendly components')],
  ['MUI icons', '<code>import HomeIcon from \'@mui/icons-material/Home\'</code>', meh('Client components; needs <code>@mui/material</code> and Emotion')],
  ['Font Awesome', '<code>&lt;FontAwesomeIcon icon={faHouse} /&gt;</code>', meh('Import its CSS and set <code>autoAddCss = false</code>')],
  ['Hugeicons', '<code>&lt;HugeiconsIcon icon={Home01Icon} /&gt;</code>', meh('Not documented')],
  ['Iconify', '<code>&lt;Icon icon="mdi:home" /&gt;</code>', no('Renders in the browser only')],
  ['with icons', '<code>import { Home } from \'@withicons/react\'</code>', yes('Plain components, no <code>\'use client\'</code>')],
], 'How each library is imported, and how it behaves in Server Components (checked November 2026). All ten ship TypeScript types.')}
${p('Why does the last column matter? In the Next.js App Router, pages are Server Components by default: they run on the server and send finished HTML. A plain icon component simply becomes an <code>&lt;svg&gt;</code> in that HTML. A component marked <code>\'use client\'</code> still works, but its code also travels to the browser. One that fetches icons at runtime, like Iconify’s, shows nothing until the browser has loaded it.')}
${p('Also worth knowing: Phosphor’s README warns that root imports can make some bundlers process all 9,000+ of its icon modules in development, and suggests Next.js’s <code>optimizePackageImports</code>. with icons ships each style as one module, so it needs no such setting.')}

${h2('lucide-react vs react-icons: which should you use?')}
${p('This is the question people search most, and the two are different kinds of thing. <strong>lucide-react</strong> is one icon family. Its team keeps every icon on a 24 × 24 grid with 2px strokes, so they all match, and new icons arrive often. <strong>react-icons</strong> is a wrapper. It packs 31 existing sets (Font Awesome, Material Design, Bootstrap, Tabler, Phosphor, Lucide and many more) into one install, each in its own folder.')}
${faceOff('lucide', { concepts: ['home', 'search', 'settings', 'bell', 'heart', 'trash'], caption: 'Real Lucide icons under our line icons. Lucide uses a 2px stroke, our line style 1.75px. In react-icons, the Lucide folder holds an older copy of these drawings.' })}
${p('react-icons is great for prototypes: you can try many sets without installing anything new. For a finished product, three things push most teams towards a single set:')}
${ul([
  '<strong>Licences differ per set.</strong> Most are MIT or Apache, but Font Awesome and Game Icons are CC BY and Typicons is CC BY-SA, which ask for a credit.',
  '<strong>Copies can lag behind.</strong> Its README lists 1,215 Lucide icons and 5,237 Tabler icons, while Lucide itself now has over 2,000 and Tabler over 6,200.',
  '<strong>Mixing sets shows.</strong> Icons from different families have different line weights and corners, so a toolbar built from three sets looks slightly off.',
])}
${p(`So: lucide-react for a consistent product UI, react-icons for quick experiments. If you like Lucide but want more than outlines, our ${L.post('with-icons-vs-lucide', 'with icons vs Lucide')} comparison goes deeper.`)}

${h2('Which React icon library has the most icons and styles?')}
${p('If you keep needing rare icons, size matters. <strong>Tabler</strong> is the biggest single free MIT set here, with over 6,200 outline icons and filled versions of over 1,000. <strong>Hugeicons</strong> gives 6,000+ free icons in one rounded style, and its paid Pro plan adds 60,000+ icons in 10 styles. <strong>Iconify</strong> goes further: one component that loads any of over 300,000 icons from more than 200 sets, fetched from its API as you use them.')}
${p('For several looks of the same icon, <strong>Phosphor</strong> is the classic answer: six weights, picked with a <code>weight</code> prop.')}
${rivalStyles('phosphor', ['home', 'heart', 'star', 'bell'], 'Phosphor’s six weights. You switch with one prop, for example weight="duotone".')}
${p(`with icons takes the idea further in a different direction. Each icon is drawn once and rendered into ${N_STYLES} styles: line, solid and duo for interfaces, plus creative styles for heroes, empty states and marketing pages. In React, every style is its own import path, such as <code>@withicons/react/solid</code>.`)}
${styleRow('bell', 'The same bell in a few of its styles: line, solid and duo for the interface, the rest for bigger, more playful places.', { styles: ['line', 'solid', 'duo', 'gloss', 'glass', 'clay', 'sticker', 'pixel'] })}
${p(`Want the numbers in detail? See ${L.post('with-icons-vs-tabler-icons', 'with icons vs Tabler Icons')} and ${L.post('with-icons-vs-phosphor', 'with icons vs Phosphor')}.`)}

${h2('What about Heroicons, MUI icons, Font Awesome and Iconify?')}
${h3('Heroicons: best for Tailwind CSS projects')}
${p(`Made by the Tailwind CSS team: 316 icons, each drawn four times (24px outline and solid, 20px mini, 16px micro), so small sizes stay crisp. You size them with classes like <code>size-6</code> rather than a prop. MIT licence. More in ${L.post('with-icons-vs-heroicons', 'with icons vs Heroicons')}.`)}
${h3('MUI icons: best if you already use Material UI')}
${p('Over 2,000 official Material Icons in five themes (Filled, Outlined, Rounded, Two tone and Sharp), as MUI <code>SvgIcon</code> components. They depend on <code>@mui/material</code>, which needs Emotion, so they make the most sense in an app that already uses Material UI.')}
${h3('Font Awesome: best when you need brand logos')}
${p(`The free set has over 2,000 icons, including a Brands style with logos most open sets skip (Lucide removed its brand icons in version 1). In React you install a component package, a core package and one package per style. In Next.js, its docs ask you to import its stylesheet in the root layout and set <code>config.autoAddCss = false</code>, or icons render huge. See ${L.post('with-icons-vs-font-awesome', 'with icons vs Font Awesome')}.`)}
${h3('Iconify: best for reaching any icon set')}
${p(`One <code>&lt;Icon icon="set:name" /&gt;</code> component reaches the whole Iconify catalogue. The catch: icons are fetched from the Iconify API after the page loads, and its docs say the SVG is not rendered on the server. For Next.js they suggest its web component or build-time tools instead. Each set keeps its own licence. Our ${L.alt('iconify', 'Iconify alternative page')} compares it in more detail.`)}
${figure('hero1', 'Teams tend to keep an icon library for years, so choose with your framework in mind.')}

${h2('Where is with icons stronger, and where is it weaker?')}
${p('Since we make it, here is the honest version.')}
${prosCons('with icons', {
  pros: [
    [`${N_STYLES} styles of every icon`, `Line, solid and duo for the interface, plus ${N_STYLES - 3} creative styles, all from the same drawings, so a solid active tab or a glossy hero icon always matches the rest.`],
    ['Server Components with no setup', 'Components are plain forwardRef components with no hooks or context, so they render in the App Router without <code>\'use client\'</code> and need no <code>optimizePackageImports</code>.'],
    ['Familiar props', '<code>size</code>, <code>color</code>, <code>strokeWidth</code>, <code>title</code> and <code>className</code>, close to Lucide’s, and every icon is exported as both <code>Home</code> and <code>HomeIcon</code>.'],
    ['Outside code too', `The same icons are on every icon page as PNG and SVG downloads, for slides, docs and Figma. See the ${L.icon('home', 'home icon')} page for an example.`],
  ],
  cons: [
    ['Fewer icons', `${N_ICONS} icons is far fewer than Tabler (over 6,200), Lucide (over 2,000) or Phosphor (about 1,500). If you need rare icons, those sets are more likely to have them.`],
    ['No brand logos', 'There are no company logos at all. Use Font Awesome Brands or Simple Icons for those.'],
    ['Not an iconLibrary option in shadcn/ui', `The shadcn CLI cannot install it for you, so you swap icons by hand. Our ${L.post('shadcn-ui-icons', 'shadcn/ui icons guide')} shows how.`],
    ['Creative styles need room', 'Styles like gloss, glass or pixel are made for 32px and up. For small interface icons, stick to line, solid or duo.'],
  ],
})}

${h2('Which React icon library should you pick?')}
${ul([
  '<strong>Pick lucide-react if</strong> you want the safe default: one clean outline style, over 2,000 icons, and you use shadcn/ui.',
  '<strong>Pick Tabler Icons if</strong> you need the most free MIT icons, with filled versions for many of them.',
  '<strong>Pick Phosphor if</strong> you want six weights of every icon and a duotone look.',
  '<strong>Pick Heroicons if</strong> you build with Tailwind and a small, polished set covers you.',
  '<strong>Pick MUI icons if</strong> your app already uses Material UI.',
  '<strong>Pick Font Awesome if</strong> you need brand logos or already know its classes.',
  '<strong>Pick Hugeicons if</strong> you like soft rounded lines and may want paid styles later.',
  '<strong>Pick react-icons or Iconify if</strong> you are prototyping across many sets (check each licence).',
  `<strong>Pick with icons if</strong> you want one family in ${N_STYLES} matching styles that renders on the server and also works in your slides.`,
])}
${iconGrid(['code', 'layout-dashboard', 'component', 'palette', 'smartphone', 'rocket'], 'duo', 'Different apps, different needs: code-heavy dashboards, design systems, mobile screens and launch pages.')}

${h2('How do you get started with with icons in React?')}
${p(`Install the package and import icons by name. The root is the line style; other styles have their own paths. Icons inherit the text colour, so Tailwind colour classes just work.`)}
${code(`npm i @withicons/react

import { Home, Search } from '@withicons/react'
import { Home as HomeSolid } from '@withicons/react/solid'

<Search size={20} className="text-slate-500" />
<HomeSolid title="Home" />`, 'tsx')}
${p(`The ${L.page('free/icons-for-react.html', 'free React icons page')} has every icon ready to copy, and the ${L.page('developers.html', 'developer docs')} cover Vue, Svelte, Angular, Solid, the web component and CSS classes. Coming from another library? The ${L.alt('lucide', 'Lucide')} and ${L.alt('tabler', 'Tabler')} alternative pages map the icon names for you.`)}
${cta('Try the icons in your React app', `${N_ICONS} icons in ${N_STYLES} styles, ${N_SVGS} SVGs. Typed, tree-shakable and MIT licensed.`, ['code', 'component', 'layers', 'palette', 'sparkles', 'rocket'])}
`,
}
