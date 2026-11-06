import { p, h2, h3, ul, iconGrid, styleRow, sizeRamp, table, yes, no, meh, callout, doDont, code, cta, art, L, N_ICONS, N_STYLES } from '../lib/blocks.mjs'

export default {
  slug: 'svg-icons-in-react-and-nextjs',
  category: 'code',
  date: '2026-11-06',
  hero: 'h-svg-icons-in-react-and-nextjs',
  stickers: [['code', 'duo'], ['component', 'gloss'], ['image', 'sticker']],
  title: 'How do I import SVG icons in React and Next.js? (2026 answer)',
  cardTitle: 'SVG icons in React and Next.js',
  h1: 'How to import SVG icons in <em>React and Next.js</em> today',
  dek: 'The top answers still use Create React App’s ReactComponent import and webpack configs that Next.js 16 refuses to build. Here are the four ways that work in November 2026, and when to use each.',
  description: 'Import SVG icons in React and Next.js in 2026: vite-plugin-svgr with ?react, SVGR under Turbopack in Next 16, plain img tags, and when an icon package is simpler.',
  keywords: ['import svg in react', 'svg icons react', 'next.js svg import', 'svgr turbopack', 'vite-plugin-svgr ?react', 'ReactComponent is not exported', 'next 16 svg', 'svg as react component'],
  about: ['React (software)', 'Next.js', 'Scalable Vector Graphics', 'Vite', 'SVGR', 'Turbopack'],
  related: ['best-react-icon-libraries', 'icons-in-react-server-components', 'svg-sprites'],
  tldr: [
    '<strong>Your own one-off SVGs in Vite:</strong> add <code>vite-plugin-svgr</code> and import with the <code>?react</code> suffix: <code>import Logo from \'./logo.svg?react\'</code>. The old <code>{ ReactComponent }</code> import stopped being the default in version 4 (September 2023).',
    '<strong>In Next.js 16:</strong> Turbopack is the default bundler, and a custom <code>webpack()</code> config makes <code>next build</code> fail. Put <code>@svgr/webpack</code> under the top-level <code>turbopack.rules</code> instead.',
    '<strong>Pictures you never restyle</strong> (illustrations, logos in fixed colours): use a plain <code>&lt;img src&gt;</code> or <code>next/image</code>. No loader, no JavaScript, but no CSS colour either.',
    '<strong>A whole set of interface icons:</strong> install an icon component package. No loader, typed props, only the icons you import end up in the bundle, and good ones render in Server Components.',
    'Create React App was deprecated on 14 February 2025, so any answer that edits <code>react-scripts</code> or ejects is out of date.',
  ],
  faq: [
    { q: 'Why does import { ReactComponent as Logo } from "./logo.svg" not work?', a: 'That named export was a Create React App feature (through SVGR inside react-scripts). Vite and Next.js never had it built in. In Vite, vite-plugin-svgr 4 and later uses a query instead: import Logo from "./logo.svg?react". In Next.js you add @svgr/webpack yourself, and then the default export is the component.' },
    { q: 'How do I use SVGR with Turbopack in Next.js 16?', a: 'Install @svgr/webpack and add it to next.config under the top-level turbopack key: turbopack: { rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } } }. The as: "*.js" part tells Turbopack the loader returns JavaScript. Do not keep the old webpack() rule: in Next 16 a custom webpack config makes next build fail unless you pass --webpack.' },
    { q: 'Can I change the colour of an SVG used in an img tag?', a: 'Not with the CSS color property. An image loaded through img is a separate document, so currentColor inside it cannot see your page’s text colour. Inline the SVG (as JSX or a component), use a sprite with use, or use a CSS mask if you need it to follow the text colour.' },
    { q: 'Does next/image optimise SVG files?', a: 'No. The Next.js docs say the default loader does not optimise SVG, and that the unoptimized behaviour is applied automatically when src ends in .svg. You only need dangerouslyAllowSVG if you want SVGs to go through the image optimiser, and then you should also set a Content Security Policy.' },
    { q: 'Should I use SVGR or an icon library?', a: 'Use SVGR for a handful of SVGs that are unique to your product, such as your logo or a custom illustration. For the everyday interface icons (search, settings, trash, arrows), an icon component package saves the loader setup, keeps every icon on the same grid and stroke, and gives you size, colour and title props.' },
  ],
  sources: [
    { title: 'Next.js docs: turbopack config, webpack loaders and the @svgr/webpack example (checked November 2026)', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack' },
    { title: 'Next.js docs: upgrading to version 16 (custom webpack config fails next build)', url: 'https://nextjs.org/docs/app/guides/upgrading/version-16' },
    { title: 'Next.js blog: Next.js 16 (21 October 2025)', url: 'https://nextjs.org/blog/next-16' },
    { title: 'Next.js docs: Image component (SVG and dangerouslyAllowSVG)', url: 'https://nextjs.org/docs/app/api-reference/components/image' },
    { title: 'vite-plugin-svgr README (?react import, TypeScript reference)', url: 'https://github.com/pd4d10/vite-plugin-svgr' },
    { title: 'vite-plugin-svgr v4.0.0 release: “Export as default with query” (20 September 2023)', url: 'https://github.com/pd4d10/vite-plugin-svgr/releases/tag/v4.0.0' },
    { title: 'Vite docs: static asset handling (?url, ?raw, inlining)', url: 'https://vite.dev/guide/assets' },
    { title: 'React blog: Sunsetting Create React App (14 February 2025)', url: 'https://react.dev/blog/2025/02/14/sunsetting-create-react-app' },
    { title: 'with icons: @withicons/react on npm', url: 'https://www.npmjs.com/package/@withicons/react' },
  ],
  body: () => `
${p(`<span class="lede">In React today there are four good ways to show an SVG icon. For your own one-off SVG files, use SVGR: in Vite that is <code>vite-plugin-svgr</code> with a <code>?react</code> import, and in Next.js 16 it is <code>@svgr/webpack</code> under the top-level <code>turbopack.rules</code> setting. For pictures you never restyle, a plain <code>&lt;img src&gt;</code> is simplest. For a full set of interface icons, an icon component package needs no setup at all.</span>`)}
${p(`The reason this question keeps coming back is that the famous answers are from another era. They import <code>{ ReactComponent }</code>, a Create React App trick, or paste a <code>webpack()</code> rule that Next.js 16 now rejects. Below is what works in November 2026, checked against the official docs. If you are choosing a library rather than wiring up files, our ${L.post('best-react-icon-libraries', 'comparison of React icon libraries')} covers that, so we will not repeat it here.`)}

${callout('note', `<ul><li><strong>14 February 2025:</strong> the React team deprecated Create React App for new apps. Answers that edit <code>react-scripts</code> or eject no longer apply.</li><li><strong>20 September 2023:</strong> vite-plugin-svgr 4.0 switched to a default export behind a query (<code>logo.svg?react</code>). The 2022 answers with <code>{ ReactComponent }</code> stopped working.</li><li><strong>Next.js 15.3:</strong> <code>experimental.turbo</code> became the top-level <code>turbopack</code> option.</li><li><strong>21 October 2025, Next.js 16:</strong> Turbopack became the default for <code>next dev</code> and <code>next build</code>, and a custom <code>webpack</code> config now makes the build fail on purpose.</li></ul>`, 'What changed since the old answers')}

${h2('What are the ways to use an SVG icon in React?')}
${p('An SVG is a picture made of shapes, written as text, so it stays sharp at any size. React can show one in four ways, and each has a clear job:')}
${table(['', 'SVGR import', 'Pasted JSX', '&lt;img src&gt;', 'Icon package'], [
  ['Set-up', meh('A plugin or loader'), yes('None'), yes('None'), yes('npm install')],
  ['Follows your text colour', yes(), yes(), no(), yes()],
  ['Adds JavaScript per icon', meh('Yes, a small component'), meh('Yes'), yes('No'), meh('Only the icons you import')],
  ['Works in Server Components', yes(), yes(), yes(), meh('Depends on the package')],
  ['Best for', 'Your logo, a few custom SVGs', 'One or two icons', 'Illustrations, fixed colours', 'Every interface icon'],
], 'Four ways to put an SVG icon in a React app (checked November 2026)')}
${art('m-svg-icons-in-react-and-nextjs-four-ways', 'Which way to load an SVG in React: a quick decision map.', { brief: 'A simple decision flowchart on a soft blueprint-grid background. Start box: "I have an SVG icon". Question 1: "Part of a full icon set?" yes leads to a card "Icon component package" with the with icons line-style search, settings and bell icons. No leads to Question 2: "Must it change colour with CSS?" yes leads to "SVGR (?react in Vite, turbopack.rules in Next 16)", no leads to "<img src> or next/image". Small side note card: "Many icons, no JS? Sprite + <use>". Use rounded boxes, short labels, no third-party logos.' })}

${h2('Why doesn’t import { ReactComponent } from "./logo.svg" work anymore?')}
${p('Because that line was never React. It was a feature of Create React App, which bundled a tool called SVGR (it turns an SVG file into a React component) and exposed the result as a named export called <code>ReactComponent</code>. When you move to Vite or Next.js, that hidden set-up is gone, so the import fails with errors like “ReactComponent is not exported”.')}
${p('The fix is not to recreate Create React App’s config. It is to use the modern form for your tool, below. If you are still on Create React App itself, the React team’s own advice is to move to a framework (they name Next.js, React Router and Expo) or to a build tool such as Vite.')}

${h2('How do I import an SVG as a React component in Vite?')}
${p('Install the plugin, add it to your Vite config, then add <code>?react</code> to the end of the import. Without the suffix, Vite gives you the file’s URL, which is what you want for an <code>&lt;img&gt;</code>.')}
${code(`npm i -D vite-plugin-svgr

// vite.config.js
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
export default { plugins: [react(), svgr()] }

// a component
import Logo from './logo.svg?react'      // a React component
import logoUrl from './logo.svg'         // a URL, for <img src>
export const Brand = () => <Logo className="h-6 w-6" aria-hidden="true" />`, 'jsx')}
${p('Using TypeScript? The plugin’s README asks you to add <code>/// &lt;reference types="vite-plugin-svgr/client" /&gt;</code> to <code>vite-env.d.ts</code> so the <code>?react</code> import is typed.')}

${h2('How do I import SVG files in Next.js 16 with Turbopack?')}
${p('Next.js 16 builds with Turbopack by default. Turbopack can run many webpack loaders, and <code>@svgr/webpack</code> is on the Next.js list of loaders tested to work. You register it under the top-level <code>turbopack</code> key, not inside a <code>webpack()</code> function:')}
${code(`npm i -D @svgr/webpack

// next.config.js
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

// app/page.jsx
import Logo from './logo.svg'
export default function Page() { return <Logo width={32} height={32} /> }`, 'js')}
${p('The <code>as: \'*.js\'</code> line matters: it tells Turbopack that the loader turns the SVG into JavaScript. Loader options go in an object form (<code>{ loader: \'@svgr/webpack\', options: { icon: true } }</code>), and since Next.js 16.0 a rule can carry a <code>condition</code>, for example to apply SVGR to one folder only and keep the rest as plain files.')}
${callout('warn', 'Keep the old <code>webpack(config)</code> SVG rule out of <code>next.config</code>. In Next.js 16, if the build finds a custom webpack config, <code>next build</code> stops with an error rather than guessing. You can opt out with <code>next build --webpack</code>, but the Next.js team recommends Turbopack for both dev and production. If you did not write a webpack config yourself, a plugin may be adding one.', 'The build-breaking leftover')}
${art('m-svg-icons-in-react-and-nextjs-config-before-after', 'The same SVG set-up, before and after Next.js 16.', { brief: 'A before/after pair of two code-editor-style cards side by side. Left card titled "Next 15 and older" with a faded webpack(config) { config.module.rules.push(... @svgr/webpack ...) } snippet and a red "fails next build in 16" tag. Right card titled "Next 16" with the turbopack.rules "*.svg" snippet (loaders: ["@svgr/webpack"], as: "*.js") and a green tag. Use with icons line-style alert-triangle and check-circle icons for the tags. No logos.' })}

${h2('Can I just paste the SVG into my component as JSX?')}
${p('Yes, and for one or two icons it is often the quickest route. Copy the SVG code, wrap it in a component, and change a few attribute names, because JSX uses camelCase: <code>class</code> becomes <code>className</code>, <code>stroke-width</code> becomes <code>strokeWidth</code>, <code>fill-rule</code> becomes <code>fillRule</code>. Set the colours to <code>currentColor</code> so the icon takes the text colour of whatever it sits in.')}
${p(`Every icon page on with icons can do this step for you: the download panel has <strong>React (JSX)</strong> and <strong>React + TypeScript (TSX)</strong> files, ready-made components with <code>size</code>, <code>color</code> and <code>title</code> props. Try it on the ${L.icon('search', 'search icon')} or ${L.icon('settings', 'settings icon')}. The trade-off is upkeep: once you have twenty pasted icons, you have twenty files to keep consistent, and that is the point where a package pays off.`)}
${sizeRamp(['search', 'settings', 'bell', 'trash'], [16, 20, 24, 32, 48], 'line', 'Inline SVG and components redraw from shapes at every size, so a 16 px icon is as crisp as a 48 px one.')}

${h2('When is a plain img tag the right choice?')}
${p('When the SVG is a finished picture: an illustration, an empty-state drawing, a badge in fixed brand colours. An <code>&lt;img src="/empty-inbox.svg" alt=""&gt;</code> needs no plugin, adds no JavaScript and is cached by the browser like any image. In Next.js you can put the file in <code>public/</code> and point at it, or use <code>next/image</code>.')}
${p('The catch is colour. An SVG loaded as an image is sealed off from your page, so <code>currentColor</code> inside it cannot see your CSS, and the ink shows in whatever colour the file says (often black). That makes <code>&lt;img&gt;</code> a poor fit for interface icons that must turn white on a dark button or blue on hover. Our post on ' + L.post('how-to-change-icon-color', 'changing icon colours') + ' explains the options in more depth.')}
${p('About <code>next/image</code>: the Next.js docs say its default loader does not optimise SVG (it is already a vector, and SVG can carry scripts), and it skips optimisation on its own when <code>src</code> ends in <code>.svg</code>. You only need <code>dangerouslyAllowSVG</code> if you want SVGs pushed through the optimiser, and then you should add a Content Security Policy as the docs describe.')}

${h2('When should I use an icon component package instead?')}
${p('As soon as you need more than a handful of interface icons. A package gives you icons drawn on one grid with one stroke, a size and colour prop, an accessible <code>title</code>, and nothing to configure in Vite or Next.js. Good packages are tree-shakable: your bundle keeps only the icons you import by name.')}
${p(`Here is how it looks with with icons, our free MIT set of ${N_ICONS} icons in ${N_STYLES} styles. The root import is the line style, and every other style is a subpath:`)}
${code(`npm i @withicons/react

import { Search, Bell } from '@withicons/react'          // line style
import { Heart } from '@withicons/react/solid'           // solid style

export function Toolbar() {
  return (
    <nav>
      <Search size={20} />
      <Bell className="text-slate-500" title="Notifications" />
      <Heart size={24} color="#e11d48" />
    </nav>
  )
}`, 'jsx')}
${p(`These are plain components with no state, effects or React context, so they render in Next.js Server Components without <code>'use client'</code>, and the package documents that Next.js needs no <code>optimizePackageImports</code> entry for it. Why that matters, and what goes wrong with some other libraries, is the subject of our post on ${L.post('icons-in-react-server-components', 'icons in React Server Components')}. More set-up detail lives on the ${L.page('developers.html', 'developers page')} and the ${L.page('free/icons-for-react.html', 'free React icons')} page.`)}
${styleRow('bell', 'One import path per style: the same bell from <code>@withicons/react</code>, <code>/solid</code>, <code>/duo</code> and more.', { styles: ['line', 'solid', 'duo', 'gloss', 'sketch', 'sticker', 'clay'] })}
${p('To be fair to SVGR: a package will not have the six custom SVGs your designer made. Keep SVGR for those and use the package for the common icons around them.')}

${h2('What about SVG sprites in React?')}
${p(`A sprite is one SVG file that holds many icons as <code>&lt;symbol&gt;</code>s, and each icon on the page points at one with <code>&lt;svg&gt;&lt;use href="/sprite.svg#home" /&gt;&lt;/svg&gt;</code>. It costs no JavaScript per icon, the browser caches one file, and the icons still follow <code>currentColor</code>. It suits pages with many repeated icons, such as long tables. Two rules: serve the sprite from your own domain (browsers block <code>&lt;use&gt;</code> across origins), and use plain <code>href</code>, not the old <code>xlink:href</code>. The <code>@withicons/static</code> package ships one sprite per style. Our post on ${L.post('svg-sprites', 'SVG sprites in 2026')} goes deeper.`)}
${iconGrid(['image', 'code', 'component', 'layers', 'package', 'file-code'], 'duo', 'Image, inline code, component, sprite layers, package, file: the whole menu of ways to ship an icon.')}

${h2('Which should I pick?')}
${doDont('<p>Use an icon package for interface icons, SVGR for the few SVGs that are truly yours, and <code>&lt;img&gt;</code> for finished illustrations. In Next.js 16, put SVGR under <code>turbopack.rules</code>.</p>', '<p>Copy a 2019 answer that ejects Create React App, edits <code>react-scripts</code>, or adds a <code>webpack()</code> rule to a Next.js 16 app. And do not import a whole icon set as an object to pick icons by name.</p>')}
${ul([
  `<strong>Building a product UI?</strong> Start with a package such as <code>@withicons/react</code>, or compare options in our ${L.post('best-react-icon-libraries', 'React icon library guide')}.`,
  '<strong>Adding your logo or a custom illustration?</strong> SVGR with <code>?react</code> (Vite) or <code>turbopack.rules</code> (Next.js).',
  '<strong>A static picture that never changes colour?</strong> <code>&lt;img&gt;</code> or <code>next/image</code>.',
  '<strong>Hundreds of repeated icons and no JavaScript budget?</strong> A sprite.',
])}
${p(`Not writing code at all? Every icon in ${L.icons('the library')} has Copy SVG, SVG and PNG downloads, and the ${L.guide('html', 'HTML guide')} shows the no-framework way. The ${L.style('line', 'line style')} is the default for interfaces if you are unsure where to start.`)}
${cta('Icons that need no loader', `${N_ICONS} icons in ${N_STYLES} styles as tree-shakable React components that render in Server Components. Free, MIT licensed.`, ['code', 'component', 'search', 'settings', 'bell', 'sparkles'])}
`,
}
